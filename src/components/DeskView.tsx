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

  /* En mouvement réduit, les deux états démarrent déjà à `true` (cf. useState ci-dessus). */
  useEffect(() => {
    if (prefersReducedMotion) return;

    const tShowHeader = window.setTimeout(() => setShowHeader(true), INTRO_SHOW_HEADER_MS);
    return () => window.clearTimeout(tShowHeader);
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!showHeader || prefersReducedMotion) return;

    const tCrtOn = window.setTimeout(() => setCrtPowered(true), INTRO_HEADER_TO_CRT_MS);
    return () => {
      window.clearTimeout(tCrtOn);
    };
  }, [showHeader, prefersReducedMotion]);

  return (
    <div
      className={`fixed inset-0 z-10 motion-reduce:transition-none ${
        isLoggingOut
          ? 'transition-[opacity,filter,transform] duration-[620ms] ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:duration-200'
          : ''
      } ${deskFadeOut ? 'pointer-events-none scale-[0.985] opacity-0 blur-[2px]' : 'opacity-100'}`}
    >
      <CrtMonitor
        powered={crtPowered}
        onTogglePower={() => setCrtPowered((v) => !v)}
        onLogout={beginLogout}
        onSwitchToCv={onSwitchToCv}
        controlsLocked={isLoggingOut}
        typingSoundEnabled={typingSoundEnabled}
        onToggleTypingSound={() => setTypingSoundEnabled((v) => !v)}
      >
        {/*
         * Contenu du tube. Le rembourrage tient les angles arrondis et le vignettage à
         * distance du texte, qui serait sinon rogné ou assombri dans les coins.
         */}
        <div className="relative flex h-full w-full flex-col overflow-hidden bg-terminal-bg px-[clamp(1rem,3.6vw,3.25rem)] pb-[clamp(0.75rem,2.4vh,1.75rem)] pt-[clamp(0.75rem,2.6vh,2rem)]">
          <CodeBackdrop />

          {showHeader ? (
            <>
              <header className="relative z-10 flex w-full shrink-0 justify-center pb-2 text-center lg:justify-start">
                <div className="w-full max-w-[min(100%,48rem)]">
                  <WorkstationTitleAnimation />
                </div>
              </header>

              <div className="relative z-10 flex min-h-0 w-full flex-1 justify-center gap-5 lg:gap-8">
                <div className="flex min-w-0 flex-1 justify-center">
                  <Terminal embedded typingSoundEnabled={typingSoundEnabled} />
                </div>

                <aside
                  aria-hidden={!shortcutsVisible}
                  className={`hidden w-[15rem] shrink-0 self-start md:block ${
                    shortcutsVisible
                      ? 'translate-x-0 opacity-100'
                      : 'pointer-events-none translate-x-8 opacity-0'
                  } transition-[opacity,transform] duration-[650ms] ease-[cubic-bezier(0.25,1,0.45,1)] motion-reduce:transition-none`}
                >
                  <CommandShortcuts />
                </aside>
              </div>
            </>
          ) : null}
        </div>
      </CrtMonitor>
    </div>
  );
};
