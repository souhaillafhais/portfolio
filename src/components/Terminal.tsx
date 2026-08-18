import { useState, useRef, useEffect, useCallback, type KeyboardEvent, type PointerEvent } from 'react';
import { OutputLine } from './OutputLine';
import { CommandInput } from './CommandInput';
import { TypingReveal } from './TypingReveal';
import { executeCommand, REGISTERED_COMMANDS, type CommandOutputSegment } from '../utils/commandHandler';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { usePortfolioTheme } from '../theme/portfolioThemeContext';
import { parseCommandLine } from '../utils/parseCommandLine';
import { applyTabCompletion } from '../utils/tabCompletion';
import { formatPromptPath, pathsEqual, type PathSegments } from '../fs/virtualFileSystem';
import { useTypewriterSound } from '../hooks/useTypewriterSound';

interface TerminalOutput {
  id: string;
  command: string;
  prompt: string;
  output?: string;
  segments?: CommandOutputSegment[];
  outputType?: 'success' | 'error' | 'info';
}

/** Long payloads skip character reveal for responsiveness (multi-file cat, huge pastes). */
const MAX_TYPING_CHARS = 14_000;

const shouldAnimatePlainOutput = (item: TerminalOutput): boolean => {
  if (item.outputType === 'error') return false;
  if (!item.output || item.output.length > MAX_TYPING_CHARS) return false;
  return true;
};

const shouldAnimateStdoutSegment = (
  segments: CommandOutputSegment[] | undefined,
  seg: CommandOutputSegment,
): boolean =>
  Boolean(
    segments &&
      segments.length === 1 &&
      seg.stream === 'stdout' &&
      seg.text.length > 0 &&
      seg.text.length <= MAX_TYPING_CHARS,
  );

const pickLatencyMs = (line: string): number => {
  if (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    return 0;
  }

  const { command } = parseCommandLine(line);
  if (!command || command === 'clear') return 0;

  const roll = (min: number, max: number) =>
    Math.floor(min + Math.random() * (max - min + 1));

  if (command === 'pwd' || command === 'ls' || command === 'help') return roll(2, 6);
  if (command === 'cd') return roll(3, 8);
  return roll(4, 12);
};

interface TerminalProps {
  /** Renders inside CRT/workspace — fills parent instead of full viewport centering. */
  embedded?: boolean;
  typingSoundEnabled?: boolean;
}

export const Terminal = ({
  embedded = false,
  typingSoundEnabled = true,
}: TerminalProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { tick } = useTypewriterSound(typingSoundEnabled);
  const { theme, setTheme } = usePortfolioTheme();

  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState<PathSegments>(['home']);
  const [output, setOutput] = useState<TerminalOutput[]>([]);
  /**
   * Annonce lecteur d’écran. `id` force une mutation du DOM même quand le texte est identique
   * (commande relancée), sinon la région live ne rejoue pas le message.
   */
  const [announcement, setAnnouncement] = useState({ id: 0, text: '' });
  const announceSeqRef = useRef(0);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const cwdRef = useRef<PathSegments>(cwd);
  const oldPwdRef = useRef<PathSegments | null>(null);
  const historyRef = useRef<string[]>([...REGISTERED_COMMANDS]);
  const histPosRef = useRef<number | null>(null);
  const draftRef = useRef('');

  const promptPath = formatPromptPath(cwd);

  useEffect(() => {
    cwdRef.current = cwd;
  }, [cwd]);

  useEffect(() => {
    requestAnimationFrame(() => {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
  }, [output]);

  const lastTypingScrollRef = useRef(0);

  const scrollTickDuringTyping = useCallback(() => {
    const now = performance.now();
    if (now - lastTypingScrollRef.current < 64) return;
    lastTypingScrollRef.current = now;
    requestAnimationFrame(() => {
      terminalEndRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
    });
  }, []);

  const announce = useCallback((text: string) => {
    announceSeqRef.current += 1;
    setAnnouncement({ id: announceSeqRef.current, text });
  }, []);

  const pushHistory = (entry: string) => {
    const h = historyRef.current;
    if (h[h.length - 1] === entry) return;
    historyRef.current = [...h, entry];
  };

  const navigateHistory = useCallback(
    (delta: -1 | 1) => {
      const hist = historyRef.current;
      if (hist.length === 0) return;

      if (delta === -1) {
        if (histPosRef.current === null) {
          draftRef.current = input;
          histPosRef.current = hist.length - 1;
        } else {
          histPosRef.current = Math.max(0, histPosRef.current - 1);
        }
        setInput(hist[histPosRef.current]!);
        return;
      }

      if (histPosRef.current === null) return;

      if (histPosRef.current >= hist.length - 1) {
        histPosRef.current = null;
        setInput(draftRef.current);
        return;
      }

      histPosRef.current += 1;
      setInput(hist[histPosRef.current]!);
    },
    [input],
  );

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;

    const isPrintable = e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey;
    const isEditKey = e.key === 'Backspace' || e.key === 'Delete';
    if (isPrintable || isEditKey) {
      tick();
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigateHistory(-1);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigateHistory(1);
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const next = applyTabCompletion(input, cwdRef.current);
      if (next !== null) {
        setInput(next);
      }
      return;
    }

    handleEnterKey(e);
  };

  const handleEnterKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;

    const trimmedInput = input.trim();

    if (!trimmedInput) {
      setInput('');
      return;
    }

    e.preventDefault();

    histPosRef.current = null;
    draftRef.current = '';

    void (async () => {
      pushHistory(trimmedInput);

      const latency = pickLatencyMs(trimmedInput);
      if (latency > 0) {
        await new Promise((r) => setTimeout(r, latency));
      }

      const cwdSnapshot = cwdRef.current;
      const snapshotPromptPath = formatPromptPath(cwdSnapshot);
      const commandPrompt = `souhail@portfolio:${snapshotPromptPath}$`;

      const result = executeCommand(trimmedInput, cwdSnapshot, {
        oldPwd: oldPwdRef.current,
        applyPortfolioTheme: setTheme,
        getPortfolioTheme: () => theme,
      });

      if (result.clear) {
        setOutput([]);
        setInput('');
        announce('Terminal cleared.');
        queueMicrotask(() => inputRef.current?.focus({ preventScroll: true }));
        return;
      }

      if (result.nextPath) {
        const next = result.nextPath;
        if (!pathsEqual(cwdSnapshot, next)) {
          oldPwdRef.current = cwdSnapshot;
          setCwd(next);
        }
      }

      const newOutput: TerminalOutput = {
        id: crypto.randomUUID(),
        command: trimmedInput,
        prompt: commandPrompt,
        output: result.output,
        segments: result.segments,
        outputType: result.type,
      };

      setOutput((prev) => [...prev, newOutput]);
      setInput('');

      /* La révélation caractère par caractère est inaudible : on annonce le résultat complet. */
      const spoken = (result.segments?.map((seg) => seg.text).join('\n') ?? result.output ?? '').trim();
      announce(spoken || `${trimmedInput}: done.`);

      queueMicrotask(() => inputRef.current?.focus({ preventScroll: true }));
    })();
  };

  const commandLineVisible = true;

  const handleWorkspacePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const target = e.target as HTMLElement;
    if (target.closest('input')) return;

    const sel = window.getSelection()?.toString() ?? '';
    if (sel.length > 0) return;

    inputRef.current?.focus({ preventScroll: true });
  };

  const outerClass = embedded
    ? 'relative flex h-full min-h-0 w-full flex-col'
    : 'relative flex min-h-svh w-full justify-center px-3 py-4 sm:px-6 sm:py-8 md:items-center md:py-10';

  const innerClass = embedded
    ? 'relative flex h-full min-h-0 w-full flex-col overflow-hidden rounded-sm border border-terminal-border/50 bg-terminal-surface/98 shadow-[inset_0_0_48px_rgb(0,0,0,0.5)]'
    : 'relative flex h-[min(calc(100dvh-2rem),52rem)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-terminal-border/70 bg-terminal-surface/95 shadow-[0_0_0_1px_rgb(94_234_212/0.08),0_24px_50px_-12px_rgb(0_0_0/0.72)] backdrop-blur-sm md:h-[min(calc(100dvh-5rem),52rem)]';

  const scanlineRounded = embedded ? 'rounded-sm' : 'rounded-2xl';

  return (
    <div className={outerClass}>
      <div className={innerClass} role="region" aria-label="Portfolio terminal">
        {/* Scanline overlay — subtle CRT feel */}
        <div
          className={`pointer-events-none absolute inset-0 opacity-[0.04] ${scanlineRounded}`}
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent 0px, rgb(0 0 0) 1px, transparent 2px, transparent 3px)',
          }}
          aria-hidden
        />

        <header className="relative flex shrink-0 items-center gap-4 border-b border-terminal-border/80 bg-terminal-header/90 px-4 py-3 backdrop-blur-md sm:px-5">
          <div className="flex gap-1.5" aria-hidden>
            <span className="h-3 w-3 shrink-0 rounded-full bg-[#ff5f57] opacity-95 shadow-sm" />
            <span className="h-3 w-3 shrink-0 rounded-full bg-[#febc2e] opacity-95 shadow-sm" />
            <span className="h-3 w-3 shrink-0 rounded-full bg-[#28c840] opacity-95 shadow-sm" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3">
            <span className="truncate font-mono text-[0.7rem] font-medium uppercase tracking-[0.2em] text-terminal-muted sm:text-xs">
              portfolio — bash
            </span>
            <span className="hidden font-mono text-[0.65rem] text-terminal-dim sm:inline">
              Unauthorized access is prohibited • session ttys001
            </span>
          </div>
          <span
            className="hidden shrink-0 rounded-full border border-terminal-accent/25 bg-terminal-accent/10 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-terminal-accent sm:block"
            title="Demonstration shell"
          >
            secure
          </span>
        </header>

        <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          <span key={announcement.id}>{announcement.text}</span>
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col px-4 py-5 font-mono text-[0.8125rem] leading-relaxed text-terminal-text sm:px-6 sm:text-sm">
          <div
            className="terminal-scroll-area flex min-h-0 flex-1 cursor-text flex-col overflow-x-auto overflow-y-scroll overscroll-y-contain pb-2"
            onPointerUp={handleWorkspacePointerUp}
          >
            {output.length === 0 && (
              <div className="mb-2 space-y-2">
                <OutputLine type="default">Welcome — Souhail Lafhais (MIAGE · EMSI Casablanca)</OutputLine>
                <OutputLine type="default">
                  Try &apos;experience&apos;, &apos;certifications&apos;, &apos;contact&apos; — or &apos;help&apos; / &apos;ls&apos;.
                  Palettes: &apos;theme list&apos;, then pick one (theme dracula · theme nord · theme paper · …).
                </OutputLine>
                <OutputLine type="default">
                  <span>
                    All registered commands are seeded in your line history. Step through them with{' '}
                    <kbd className="mx-0.5 inline-block min-w-[1.25rem] rounded border border-terminal-border bg-terminal-header/90 px-1.5 py-0.5 text-center font-mono text-terminal-text shadow-sm">
                      ↑
                    </kbd>{' '}
                    and{' '}
                    <kbd className="mx-0.5 inline-block min-w-[1.25rem] rounded border border-terminal-border bg-terminal-header/90 px-1.5 py-0.5 text-center font-mono text-terminal-text shadow-sm">
                      ↓
                    </kbd>{' '}
                    (keyboard arrows). Commands you type are appended after these.
                  </span>
                </OutputLine>
              </div>
            )}

            {output.map((item) => (
              <div key={item.id} className="mb-3">
                <OutputLine type="command" prefix={`${item.prompt} `}>
                  {item.command}
                </OutputLine>
                {item.segments && item.segments.length > 0 ? (
                  item.segments.map((seg, idx) => {
                    const lineType = seg.stream === 'stderr' ? 'error' : 'output';
                    const animate =
                      !prefersReducedMotion &&
                      seg.stream === 'stdout' &&
                      shouldAnimateStdoutSegment(item.segments, seg);

                    return (
                      <OutputLine key={`${item.id}-${idx}`} type={lineType}>
                        {animate ? (
                          <TypingReveal text={seg.text} onTick={scrollTickDuringTyping} />
                        ) : (
                          seg.text
                        )}
                      </OutputLine>
                    );
                  })
                ) : (
                  item.output && (
                    <OutputLine type={item.outputType === 'error' ? 'error' : 'output'}>
                      {!prefersReducedMotion && shouldAnimatePlainOutput(item) ? (
                        <TypingReveal text={item.output} onTick={scrollTickDuringTyping} />
                      ) : (
                        item.output
                      )}
                    </OutputLine>
                  )
                )}
              </div>
            ))}

            {commandLineVisible && (
              <CommandInput
                promptPath={promptPath}
                value={input}
                onChange={(v) => {
                  histPosRef.current = null;
                  setInput(v);
                }}
                onKeyDown={handleInputKeyDown}
                inputRef={inputRef}
              />
            )}

            <div ref={terminalEndRef} className="h-px shrink-0" aria-hidden />
          </div>
        </div>
      </div>
    </div>
  );
};
