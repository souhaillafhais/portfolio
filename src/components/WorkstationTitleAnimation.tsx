import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const NAME = 'Souhail Lafhais';
const WELCOME = 'Welcome to my workstation.';

/**
 * Welcome line types once and stays forever.
 * Name line loops slow type → backspace delete → repeat (reduced-motion: static).
 */
export const WorkstationTitleAnimation = () => {
  const reduceMotion = usePrefersReducedMotion();
  const [nameShown, setNameShown] = useState(() => (reduceMotion ? NAME : ''));
  const [welcomeShown, setWelcomeShown] = useState(() => (reduceMotion ? WELCOME : ''));
  const [welcomeComplete, setWelcomeComplete] = useState(reduceMotion);
  const [caretOnName, setCaretOnName] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setWelcomeShown(WELCOME);
      setWelcomeComplete(true);
      setNameShown(NAME);
      setCaretOnName(false);
      return;
    }

    let cancelled = false;
    const delay = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));
    const typeMs = () => 165 + Math.random() * 95;
    const getDeleteMs = () => 105 + Math.random() * 55;

    const typeWelcomeOnce = async () => {
      for (let i = 1; i <= WELCOME.length && !cancelled; i++) {
        setWelcomeShown(WELCOME.slice(0, i));
        await delay(typeMs());
      }
      if (!cancelled) {
        setWelcomeComplete(true);
        setWelcomeShown(WELCOME);
      }
    };

    void typeWelcomeOnce();

    return () => {
      cancelled = true;
    };
  }, [reduceMotion]);

  useEffect(() => {
    if (reduceMotion) return;

    let cancelled = false;
    const delay = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));
    const typeMs = () => 165 + Math.random() * 95;
    const getDeleteMs = () => 105 + Math.random() * 55;

    const run = async () => {
      await delay(200);
      if (cancelled) return;

      while (!cancelled) {
        setNameShown('');
        setCaretOnName(true);
        await delay(140);
        if (cancelled) return;

        for (let i = 1; i <= NAME.length; i++) {
          if (cancelled) return;
          setNameShown(NAME.slice(0, i));
          await delay(typeMs());
        }

        await delay(960 + Math.random() * 360);
        if (cancelled) return;

        setCaretOnName(true);
        for (let ln = NAME.length - 1; ln >= 0; ln--) {
          if (cancelled) return;
          setNameShown(NAME.slice(0, ln));
          await delay(getDeleteMs());
        }

        setCaretOnName(false);
        await delay(720 + Math.random() * 220);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [reduceMotion]);

  return (
    <div className="min-h-[7.5rem] w-full max-w-3xl sm:min-h-[6.75rem]">
      <h1 className="font-display flex w-full flex-wrap items-baseline justify-center gap-x-1 text-center text-3xl font-medium leading-tight tracking-tight text-terminal-text sm:text-4xl md:text-[2.65rem] lg:justify-start lg:text-5xl">
        <span>{nameShown}</span>
        {!reduceMotion && caretOnName && (
          <span className="terminal-cursor-blink ml-0.5 inline-block h-[1.05em] w-2 translate-y-1 bg-terminal-accent md:translate-y-0.5" />
        )}
      </h1>
      <p
        className={`neon-welcome mx-auto mt-3 max-w-2xl text-center font-mono text-[0.8125rem] leading-relaxed tracking-wide sm:mt-4 sm:text-sm lg:mx-0 lg:text-left lg:text-base ${
          welcomeComplete ? '' : 'min-h-[1.65em]'
        }`}
      >
        <span>{welcomeShown}</span>
        {!reduceMotion && !welcomeComplete && welcomeShown.length < WELCOME.length && (
          <span className="terminal-cursor-blink ml-0.5 inline-block h-[1.05em] w-2 translate-y-1 bg-terminal-accent md:translate-y-0.5" />
        )}
      </p>
    </div>
  );
};
