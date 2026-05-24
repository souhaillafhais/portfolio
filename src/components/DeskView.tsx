import { useCallback, useEffect, useState } from 'react';
import { Terminal } from './Terminal';
import { WorkstationTitleAnimation } from './WorkstationTitleAnimation';
import { CrtMonitor } from './CrtMonitor';
import { CommandShortcuts } from './CommandShortcuts';
import { CodeBackdrop } from './CodeBackdrop';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface DeskViewProps {
  onLogout: () => void;
  onSwitchToCv: () => void;
}

/** Délais après apparition du titre : mise sous tension CRT → frappe CLI → panneau raccourcis. */
const INTRO_HEADER_TO_CRT_MS = 760;
const INTRO_SHOW_HEADER_MS = 2000;

/** Après extinction CRT : fondu bureau puis passage login (ms). */
const LOGOUT_CRT_SETTLE_MS = 720;
const LOGOUT_FADE_MS = 620;
const LOGOUT_TOTAL_MS = LOGOUT_CRT_SETTLE_MS + LOGOUT_FADE_MS + 120;

export const DeskView = ({ onLogout, onSwitchToCv }: DeskViewProps) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [showHeader, setShowHeader] = useState(() => prefersReducedMotion);
  const [crtPowered, setCrtPowered] = useState(() => prefersReducedMotion);
  const [shortcutsVisible, setShortcutsVisible] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [deskFadeOut, setDeskFadeOut] = useState(false);
  const [typingSoundEnabled, setTypingSoundEnabled] = useState(true);

  const beginLogout = useCallback(() => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setCrtPowered(false);
    setShortcutsVisible(false);
  }, [isLoggingOut]);

  useEffect(() => {
    if (!isLoggingOut) return;

    const fast = prefersReducedMotion;
    const fadeStart = fast ? 220 : LOGOUT_CRT_SETTLE_MS;
    const total = fast ? 520 : LOGOUT_TOTAL_MS;

    const tFade = window.setTimeout(() => setDeskFadeOut(true), fadeStart);
    const tDone = window.setTimeout(() => {
      onLogout();
    }, total);

    return () => {
      window.clearTimeout(tFade);
      window.clearTimeout(tDone);
    };
  }, [isLoggingOut, onLogout, prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setShowHeader(true);
      setCrtPowered(true);
      return undefined;
    }

    const tShowHeader = window.setTimeout(() => setShowHeader(true), INTRO_SHOW_HEADER_MS);
    return () => window.clearTimeout(tShowHeader);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!showHeader || prefersReducedMotion) return;

    setCrtPowered(false);

    const tCrtOn = window.setTimeout(() => setCrtPowered(true), INTRO_HEADER_TO_CRT_MS);
    return () => {
      window.clearTimeout(tCrtOn);
    };
  }, [showHeader, prefersReducedMotion]);

  return (
    <div
      className={`relative isolate z-10 flex min-h-svh w-full max-w-[100vw] flex-col overflow-x-hidden bg-terminal-bg motion-reduce:transition-none ${
        isLoggingOut
          ? 'transition-[opacity,filter,transform] duration-[620ms] ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:duration-200'
          : ''
      } ${deskFadeOut ? 'pointer-events-none scale-[0.985] opacity-0 blur-[2px]' : 'opacity-100'}`}
    >
      <CodeBackdrop />

      <header className="relative z-10 flex w-full justify-center px-[max(1rem,env(safe-area-inset-left))] pb-2 pr-[max(1rem,env(safe-area-inset-right))] pt-[calc(env(safe-area-inset-top,0px)+0.75rem)] text-center sm:px-5 md:pr-[7.75rem] lg:pr-[8.75rem]">
        <div
          className={`w-full max-w-[min(100%,48rem)] transition-opacity motion-reduce:transition-none ${
            showHeader ? 'opacity-100' : 'pointer-events-none select-none opacity-0'
          } min-h-[7.5rem] duration-700 ease-out sm:min-h-[6.75rem]`}
          aria-hidden={!showHeader}
        >
          {showHeader ? <WorkstationTitleAnimation /> : null}
        </div>
      </header>

      <div className="relative z-10 flex min-h-0 w-full flex-1 items-center justify-center px-[max(0.75rem,env(safe-area-inset-left))] py-4 pr-[max(0.75rem,env(safe-area-inset-right))] pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-4 sm:py-6 md:px-5">
        {showHeader ? (
          <div className="flex w-full max-w-[min(100%,72rem)] flex-col items-center justify-center gap-6 md:flex-row md:items-start md:justify-center md:gap-8 lg:gap-10">
            <div className="flex w-full min-w-0 justify-center md:flex-1 md:max-w-[min(100%,42rem)]">
              <CrtMonitor
                powered={crtPowered}
                onTogglePower={() => setCrtPowered((v) => !v)}
                onLogout={beginLogout}
                onSwitchToCv={onSwitchToCv}
                controlsLocked={isLoggingOut}
                typingSoundEnabled={typingSoundEnabled}
                onToggleTypingSound={() => setTypingSoundEnabled((v) => !v)}
              >
                <Terminal
                  embedded
                  typingSoundEnabled={typingSoundEnabled}
                />
              </CrtMonitor>
            </div>

            <aside
              aria-hidden={!shortcutsVisible}
              className={`mx-auto w-full min-w-0 max-w-sm shrink-0 md:mx-0 md:w-[min(100%,14.5rem)] md:max-w-none lg:w-[15rem] ${
                shortcutsVisible ? 'translate-x-0 opacity-100' : 'pointer-events-none translate-x-10 opacity-0 sm:translate-x-8'
              } transition-[opacity,transform] motion-reduce:transition-none duration-[650ms] ease-[cubic-bezier(0.25,1,0.45,1)]`}
            >
              <CommandShortcuts />
            </aside>
          </div>
        ) : null}
      </div>
    </div>
  );
};
