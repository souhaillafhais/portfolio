import { useEffect, useRef, useState } from 'react';
import { useTypewriterSound } from '../hooks/useTypewriterSound';

const CPS_DEFAULT = 680;
const CPS_SLOW = 9;
const MIN_DURATION_MS = 140;
const MIN_DURATION_SLOW_MS = 220;
const MAX_DURATION_MS = 5200;
const MAX_DURATION_SLOW_MS = 120_000;

interface TypingRevealProps {
  /** Non-empty text to stream (parent should skip mounting when empty). */
  text: string;
  onTick?: () => void;
  onComplete?: () => void;
  /** Frappe lente façon titre (plusieurs dizaines de ms par caractère). */
  slow?: boolean;
  withTypewriterSound?: boolean;
}

/**
 * Progressive stdout-style reveal using requestAnimationFrame.
 * When the user prefers reduced motion, render plain text from the parent instead.
 */
export const TypingReveal = ({
  text,
  onTick,
  onComplete,
  slow = false,
  withTypewriterSound = false,
}: TypingRevealProps) => {
  const { tick } = useTypewriterSound();
  const onTickRef = useRef(onTick);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onTickRef.current = onTick;
    onCompleteRef.current = onComplete;
  });

  const [shown, setShown] = useState('');

  useEffect(() => {
    let raf = 0;
    let cancelled = false;
    let start: number | null = null;
    let prevLen = 0;

    const cps = slow ? CPS_SLOW : CPS_DEFAULT;
    const minD = slow ? MIN_DURATION_SLOW_MS : MIN_DURATION_MS;
    const maxD = slow ? MAX_DURATION_SLOW_MS : MAX_DURATION_MS;

    const duration = Math.min(maxD, Math.max(minD, (text.length / cps) * 1000));

    const loop = (t: number) => {
      if (cancelled) return;
      if (start === null) start = t;

      const ratio = Math.min(1, (t - start) / duration);
      const len = Math.floor(text.length * ratio);
      const slice = text.slice(0, len);

      if (len !== prevLen) {
        prevLen = len;
        onTickRef.current?.();
        if (withTypewriterSound) tick();
      }

      setShown(slice);

      if (ratio < 1) {
        raf = requestAnimationFrame(loop);
      } else {
        setShown(text);
        onCompleteRef.current?.();
      }
    };

    /* eslint-disable react-hooks/set-state-in-effect -- rAF-driven progressive reveal needs an initial empty frame */
    setShown('');
    /* eslint-enable react-hooks/set-state-in-effect */
    raf = requestAnimationFrame(loop);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [text, slow]);

  return <>{shown}</>;
};
