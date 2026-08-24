import { useEffect, useRef, type ReactNode } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

function CVIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" x2="12" y1="11" y2="17" />
      <line x1="9" x2="15" y1="14" y2="14" />
    </svg>
  );
}

interface CrtMonitorProps {
  children: ReactNode;
  powered: boolean;
  /** Absent au login : l’interrupteur disparaît, l’écran reste allumé. */
  onTogglePower?: () => void;
  /** Retour à l’écran de connexion. */
  onLogout?: () => void;
  /** Basculer vers la vue CV. */
  onSwitchToCv?: () => void;
  /** Pendant la séquence de déconnexion : désactive interrupteur et logout. */
  controlsLocked?: boolean;
  typingSoundEnabled?: boolean;
  onToggleTypingSound?: () => void;
}

/**
 * Moniteur CRT des années 90 occupant tout le viewport : coque plastique, tube bombé et
 * mentonnière portant les commandes physiques.
 *
 * La courbure est suggérée — rayon proportionnel, vignettage d’angle, reflet de verre — et
 * non appliquée au contenu : une vraie distorsion (feDisplacementMap ou WebGL) rendrait le
 * texte flou et décalerait les clics.
 */
export const CrtMonitor = ({
  children,
  powered,
  onTogglePower,
  onLogout,
  onSwitchToCv,
  controlsLocked = false,
  typingSoundEnabled = true,
  onToggleTypingSound,
}: CrtMonitorProps) => {
  const reduceMotion = usePrefersReducedMotion();
  const prevPoweredForSound = useRef<boolean | undefined>(undefined);
  const crtAudioRef = useRef<AudioContext | null>(null);

  /**
   * Le réchauffage des phosphores est piloté par CSS : `.crt-warmup` porte une animation
   * `forwards` de 0,94 s, rejouée chaque fois que la classe est réappliquée — donc à chaque
   * passage OFF → ON. La media query `prefers-reduced-motion` la neutralise déjà côté CSS.
   */
  const warmingUp = powered && !reduceMotion;

  useEffect(() => {
    const prev = prevPoweredForSound.current;
    prevPoweredForSound.current = powered;
    if (prev !== false || !powered || typeof window === 'undefined') return;
    const AudioCtx =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    if (!crtAudioRef.current) crtAudioRef.current = new AudioCtx();
    const ctx = crtAudioRef.current;
    if (ctx.state === 'suspended') void ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 1650;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(860, ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.26);

    osc.connect(lp);
    lp.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.28);
  }, [powered]);

  const chinButton =
    'flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-white/10 bg-black/25 text-terminal-muted shadow-[inset_0_1px_0_rgb(255_255_255/0.07)] transition-colors hover:bg-black/40 hover:text-terminal-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent active:opacity-95 disabled:cursor-not-allowed disabled:opacity-45';

  return (
    <div
      className="crt-shell fixed inset-0 z-0 flex flex-col overflow-hidden"
      style={{
        paddingTop: 'calc(var(--crt-bezel) + env(safe-area-inset-top, 0px))',
        paddingLeft: 'calc(var(--crt-bezel) + env(safe-area-inset-left, 0px))',
        paddingRight: 'calc(var(--crt-bezel) + env(safe-area-inset-right, 0px))',
      }}
    >
      <div className="crt-tube relative z-10 min-h-0 flex-1 overflow-hidden bg-black">
        {/* Tube : contenu */}
        <div
          className={`relative z-[14] h-full w-full overflow-hidden rounded-[inherit] transition-[opacity,transform] duration-[400ms] ease-[cubic-bezier(0.4,0.15,0.2,1)] ${
            warmingUp ? 'crt-warmup' : ''
          } ${powered ? '' : 'pointer-events-none'}`}
          style={{
            opacity: powered ? 1 : 0,
            transformOrigin: '50% 50%',
            transform: powered ? 'scaleY(1)' : 'scaleY(0.04)',
            ...(warmingUp ? {} : { filter: powered ? 'brightness(1)' : 'brightness(0)' }),
          }}
          aria-hidden={!powered}
        >
          <div className="relative h-full w-full overflow-hidden" inert={!powered || undefined}>
            {children}
          </div>
        </div>

        {/* Couches optiques — ordre : phosphore → grille → grain → vignettage → verre → scintillement */}
        <div
          className={`crt-scanlines pointer-events-none absolute inset-0 z-[16] rounded-[inherit] transition-opacity duration-500 ${
            powered ? 'opacity-[0.55]' : 'opacity-90'
          }`}
          aria-hidden
        />
        <div
          className="crt-grille pointer-events-none absolute inset-0 z-[16] rounded-[inherit] opacity-70"
          aria-hidden
        />
        <div
          className="crt-grain pointer-events-none absolute inset-[-4%] z-[17] opacity-[0.055] mix-blend-overlay"
          aria-hidden
        />
        <div
          className="crt-vignette pointer-events-none absolute inset-0 z-[18] rounded-[inherit]"
          aria-hidden
        />
        <div
          className="crt-glass pointer-events-none absolute inset-0 z-[19] rounded-[inherit]"
          aria-hidden
        />
        {powered && (
          <div
            className="crt-flicker pointer-events-none absolute inset-0 z-[20] rounded-[inherit]"
            aria-hidden
          />
        )}

        {!powered && (
          <div
            className={`pointer-events-none absolute inset-0 z-[21] rounded-[inherit] bg-[#030304] ${
              reduceMotion ? '' : 'crt-flyback-mask'
            }`}
            aria-hidden
          />
        )}

        {!powered && (
          <div className="pointer-events-none absolute inset-0 z-[22] flex flex-col items-center justify-center gap-2 text-center font-mono">
            <p
              className="crt-standby-blink text-[11px] tracking-[0.42em]"
              style={{ color: 'rgba(251, 191, 72, 0.82)' }}
            >
              NO SIGNAL
            </p>
            <p className="text-[10px] tracking-widest" style={{ color: 'rgba(251, 191, 72, 0.35)' }}>
              — POWER —
            </p>
          </div>
        )}
      </div>

      {/* Mentonnière : plaque de marque, LED et commandes physiques */}
      <div
        className="relative z-10 flex shrink-0 items-center justify-between gap-3 px-1 sm:px-3"
        style={{
          height: 'var(--crt-chin)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="hidden select-none font-mono text-[10px] font-bold uppercase tracking-[0.34em] text-white/25 sm:inline"
            aria-hidden
          >
            Portfolio&nbsp;Shell
          </span>
          <span
            className="hidden select-none font-mono text-[9px] uppercase tracking-[0.2em] text-white/15 md:inline"
            aria-hidden
          >
            PS&#8209;1700&nbsp;SVGA
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          {onToggleTypingSound ? (
            <button
              type="button"
              disabled={controlsLocked}
              onClick={() => {
                if (!controlsLocked) onToggleTypingSound();
              }}
              className={chinButton}
              aria-label={
                typingSoundEnabled
                  ? 'Désactiver le son de frappe clavier'
                  : 'Activer le son de frappe clavier'
              }
              title={typingSoundEnabled ? 'Son clavier activé' : 'Son clavier désactivé'}
            >
              <span className="pointer-events-none text-[17px] leading-none" aria-hidden>
                {typingSoundEnabled ? '🔊' : '🔇'}
              </span>
            </button>
          ) : null}

          {onSwitchToCv ? (
            <button
              type="button"
              disabled={controlsLocked}
              onClick={() => {
                if (!controlsLocked) onSwitchToCv();
              }}
              className={chinButton}
              aria-label="Voir le CV interactif"
              title="Vue CV"
            >
              <CVIcon className="pointer-events-none h-[18px] w-[18px]" />
            </button>
          ) : null}

          {onLogout ? (
            <button
              type="button"
              disabled={controlsLocked}
              onClick={() => {
                if (!controlsLocked) onLogout();
              }}
              className={chinButton}
              aria-label="Se déconnecter — nouvelle question à la prochaine connexion"
              title="Déconnexion"
            >
              <LogoutIcon className="pointer-events-none h-[18px] w-[18px]" />
            </button>
          ) : null}

          {/* Interrupteur d’alimentation + LED, groupés comme sur la façade d’origine */}
          <div className={`ml-1 flex items-center gap-2.5 sm:ml-2 ${onTogglePower ? '' : 'pr-1'}`}>
            <span
              className={`h-[7px] w-[7px] shrink-0 rounded-full transition-colors duration-300 ${
                powered ? 'crt-led-on' : ''
              }`}
              style={{
                background: powered ? 'var(--term-accent)' : 'rgb(120 20 20)',
                boxShadow: powered
                  ? '0 0 7px 1px color-mix(in srgb, var(--term-accent) 70%, transparent)'
                  : 'inset 0 1px 2px rgb(0 0 0 / 0.7)',
              }}
              aria-hidden
            />
            {onTogglePower ? (
              <button
                type="button"
                disabled={controlsLocked}
                onClick={() => {
                  if (!controlsLocked) onTogglePower();
                }}
                aria-pressed={powered}
                aria-label={
                  powered
                    ? 'Écran allumé · cliquer pour éteindre'
                    : 'Écran éteint · cliquer pour allumer'
                }
                className="flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-md px-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent disabled:cursor-not-allowed disabled:opacity-45"
              >
                <span
                  className="hidden font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-white/30 sm:inline"
                  aria-hidden
                >
                  Power
                </span>
                <span className="relative h-[28px] w-[48px] shrink-0 rounded-full border border-black/60 bg-black/50 p-[3px] shadow-[inset_0_3px_6px_rgb(0_0_0/0.65)]">
                  <span
                    className="absolute inset-y-[3px] rounded-full shadow-[0_3px_6px_rgb(0_0_0/0.5)] transition-[left,background] duration-[320ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
                    style={{
                      width: '20px',
                      left: powered ? 'calc(100% - 23px)' : '3px',
                      background: powered
                        ? 'linear-gradient(185deg,color-mix(in srgb,var(--term-accent) 92%,white),color-mix(in srgb,var(--term-accent) 55%,#064e3b))'
                        : 'linear-gradient(185deg,#8a8a92,#3a3a41)',
                    }}
                    aria-hidden
                  />
                </span>
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
