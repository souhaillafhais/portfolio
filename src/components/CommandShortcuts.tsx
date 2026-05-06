import { useCallback, useState } from 'react';

const SHORTCUTS = [
  { label: 'List commands', command: 'help' },
  { label: 'Work experience', command: 'experience' },
  { label: 'Light Ubuntu theme', command: 'theme ubuntu' },
  { label: 'Contact & links', command: 'contact' },
] as const;

function CopyIcon({ copied }: { copied: boolean }) {
  if (copied) {
    return (
      <span className="text-terminal-accent" aria-hidden>
        ✓
      </span>
    );
  }
  return (
    <svg
      className="h-4 w-4 shrink-0 text-terminal-muted opacity-90"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

export const CommandShortcuts = () => {
  const [recentCopy, setRecentCopy] = useState<string | null>(null);

  const copy = useCallback(async (command: string) => {
    try {
      await navigator.clipboard.writeText(command);
      setRecentCopy(command);
      window.setTimeout(() => setRecentCopy((cur) => (cur === command ? null : cur)), 1800);
    } catch {
      setRecentCopy(null);
    }
  }, []);

  return (
    <div className="rounded-lg border border-terminal-border bg-terminal-surface/90 p-4 shadow-[inset_0_1px_0_rgb(255_255_255/0.04),0_14px_32px_-12px_rgb(0_0_0/0.45)] backdrop-blur-[2px]">
      <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-terminal-muted">
        Quick paste
      </p>
      <ul className="flex flex-col gap-2 font-mono text-sm">
        {SHORTCUTS.map(({ label, command }) => {
          const copied = recentCopy === command;
          return (
            <li key={command}>
              <div className="flex items-start gap-2 rounded-md border border-terminal-border/70 bg-terminal-bg/40 px-2.5 py-2 shadow-[inset_0_1px_0_rgb(255_255_255/0.04)]">
                <button
                  type="button"
                  className="-m-1 mt-px shrink-0 rounded p-1 text-terminal-accent transition hover:bg-terminal-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terminal-accent disabled:opacity-60"
                  onClick={() => void copy(command)}
                  title={copied ? 'Copied' : 'Copy command'}
                  aria-label={`Copy "${command}" to clipboard`}
                >
                  <CopyIcon copied={copied} />
                </button>
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] uppercase tracking-wider text-terminal-dim">{label}</span>
                  <code className="mt-0.5 block break-all text-terminal-text">{command}</code>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
