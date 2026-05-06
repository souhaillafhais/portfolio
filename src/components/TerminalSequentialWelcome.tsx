import { useEffect, useRef, useState } from 'react';
import { OutputLine } from './OutputLine';
import { TypingReveal } from './TypingReveal';

export const TERMINAL_BOOTSTRAP_LINES = [
  'Welcome — Souhail Lafhais (MIAGE · EMSI Casablanca)',
  "Try 'experience', 'certifications', 'contact' — or 'help' / 'ls'. Palettes: 'theme list', then pick one (theme dracula · theme nord · theme paper · …).",
  'All registered commands are seeded in your line history. Step through them with ↑ and ↓ (keyboard arrows). Commands you type are appended after these.',
];

/** Bloc d’accueil CLI : lignes successives façon frappe (réduit mouvement = affichage direct). */
export function TerminalSequentialWelcome({
  prefersReducedMotion,
  onComplete,
  onTick,
}: {
  prefersReducedMotion: boolean;
  onComplete: () => void;
  onTick?: () => void;
}) {
  const doneRef = useRef(false);
  const [typingLine, setTypingLine] = useState(0);
  const n = TERMINAL_BOOTSTRAP_LINES.length;

  useEffect(() => {
    doneRef.current = false;
    setTypingLine(0);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) {
      if (!doneRef.current) {
        doneRef.current = true;
        queueMicrotask(() => onComplete());
      }
    }
  }, [prefersReducedMotion, onComplete]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (typingLine >= n && !doneRef.current) {
      doneRef.current = true;
      queueMicrotask(() => onComplete());
    }
  }, [typingLine, n, prefersReducedMotion, onComplete]);

  if (prefersReducedMotion) {
    return (
      <div className="mb-2 space-y-2">
        {TERMINAL_BOOTSTRAP_LINES.map((text, idx) => (
          <OutputLine key={idx} type="default">
            {text}
          </OutputLine>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-2 space-y-2">
      {TERMINAL_BOOTSTRAP_LINES.slice(0, typingLine).map((text, idx) => (
        <OutputLine key={`done-${idx}`} type="default">
          {text}
        </OutputLine>
      ))}
      {typingLine < n && (
        <OutputLine type="default">
          <TypingReveal
            slow
            text={TERMINAL_BOOTSTRAP_LINES[typingLine] ?? ''}
            onTick={onTick}
            onComplete={() => setTypingLine((l) => l + 1)}
          />
        </OutputLine>
      )}
    </div>
  );
}
