import { useCallback, useRef } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Very small "key tick" synthesized with WebAudio.
 * Keeps a cooldown to avoid overwhelming audio at high typing speeds.
 */
export function useTypewriterSound(enabled = true) {
  const reduceMotion = usePrefersReducedMotion();
  const ctxRef = useRef<AudioContext | null>(null);
  const lastTickRef = useRef(0);

  const tick = useCallback(() => {
    if (!enabled || reduceMotion || typeof window === 'undefined') return;
    const now = performance.now();
    if (now - lastTickRef.current < 52) return;
    lastTickRef.current = now;

    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    if (!ctxRef.current) {
      ctxRef.current = new AudioCtx();
    }
    const ctx = ctxRef.current;
    if (ctx.state === 'suspended') {
      void ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 900;

    osc.type = 'square';
    osc.frequency.setValueAtTime(1450 + Math.random() * 320, ctx.currentTime);

    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.024, ctx.currentTime + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);

    osc.connect(hp);
    hp.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.032);
  }, [enabled, reduceMotion]);

  return { tick };
}
