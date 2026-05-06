import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface TypewriterHeadingProps {
  text: string;
  onComplete?: () => void;
}

export const TypewriterHeading = ({ text, onComplete }: TypewriterHeadingProps) => {
  const reduceMotion = usePrefersReducedMotion();
  const [shown, setShown] = useState('');

  useEffect(() => {
    setShown('');

    if (reduceMotion) {
      setShown(text);
      queueMicrotask(() => onComplete?.());
      return;
    }

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const step = (i: number) => {
      if (cancelled) return;
      if (i >= text.length) {
        onComplete?.();
        return;
      }
      setShown(text.slice(0, i + 1));
      timeoutId = window.setTimeout(() => step(i + 1), 52 + Math.random() * 28);
    };

    timeoutId = window.setTimeout(() => step(0), 140);

    return () => {
      cancelled = true;
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [text, reduceMotion, onComplete]);

  return (
    <h1 className="font-mono text-2xl font-semibold tracking-tight text-terminal-text md:text-3xl">
      <span>{shown}</span>
      {!reduceMotion && shown.length < text.length && (
        <span className="terminal-cursor-blink ml-0.5 inline-block h-[1.1em] w-2 translate-y-0.5 bg-terminal-accent align-middle" />
      )}
    </h1>
  );
};
