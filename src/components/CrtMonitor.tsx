import { useEffect, useRef, useState, type ReactNode } from 'react';
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

interface CrtMonitorProps {
  children: ReactNode;
  powered: boolean;
  onTogglePower: () => void;
  /** Retour à l’écran de connexion. */
  onLogout?: () => void;
  /** Pendant la séquence de déconnexion : désactive interrupteur et logout. */
  controlsLocked?: boolean;
  typingSoundEnabled?: boolean;
  onToggleTypingSound?: () => void;
}

/**
 * Écran façon ancien CRT : scanlines / vignette, extinction (ligne vidéo, NO SIGNAL),
 * réchauffage phosphores à l’allumage, interrupteur sous le cadre (aligné sur le thème).
 */
export const CrtMonitor = ({
  children,
  powered,
  onTogglePower,
  onLogout,
  controlsLocked = false,
  typingSoundEnabled = true,
  onToggleTypingSound,
}: CrtMonitorProps) => {
  const reduceMotion = usePrefersReducedMotion();
  const [warmingUp, setWarmingUp] = useState(false);
  const prevPowered = useRef<boolean | undefined>(undefined);
  const prevPoweredForSound = useRef<boolean | undefined>(undefined);
  const crtAudioRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const prev = prevPowered.current;
    prevPowered.current = powered;

    if (reduceMotion) {
      setWarmingUp(false);
      return;
    }
    if (prev === undefined) return;

    if (!prev && powered) {
      setWarmingUp(true);
      const id = window.setTimeout(() => setWarmingUp(false), 940);
      return () => clearTimeout(id);
    }
    if (!powered) setWarmingUp(false);
    return undefined;
  }, [powered, reduceMotion]);

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

  const heightViewport =
    'h-[clamp(236px,min(52dvh,92vw),min(480px,58dvh))] sm:h-[clamp(260px,min(50dvh,85vw),min(480px,56dvh))]';

  const controlRail =
    'rounded-md border border-terminal-border bg-terminal-header/90 shadow-[inset_0_1px_0_rgb(255_255_255/0.06),0_6px_14px_-6px_rgb(0_0_0/0.35)] backdrop-blur-sm';

  return (
    <div className="mx-auto w-full max-w-[min(100%,min(42rem,calc(100vw-2rem)))] shrink-0 px-1 sm:px-0">
      <div className="flex flex-col gap-2 sm:gap-2.5">
        <div className="relative overflow-hidden rounded-lg border border-terminal-border/80 bg-black shadow-[0_24px_50px_-12px_rgb(0_0_0/0.55),inset_0_0_0_1px_rgb(255_255_255/0.04)]">
          <div
            className={`pointer-events-none absolute inset-0 z-[12] rounded-lg transition-opacity duration-500 ${powered ? 'opacity-[0.065]' : 'opacity-[0.16]'}`}
            style={{
              backgroundImage:
                'repeating-linear-gradient(180deg, transparent 0px, rgb(0 0 0) 1px, transparent 2px, transparent 3px)',
            }}
            aria-hidden
          />

          <div
            className="pointer-events-none absolute inset-0 z-[13] rounded-lg transition-[box-shadow] duration-500"
            style={{
              boxShadow: powered ? 'inset 0 0 56px rgb(0 0 0 / 0.55)' : 'inset 0 0 88px rgb(0 0 0 / 0.94)',
            }}
            aria-hidden
          />

          {/* Contenu tube */}
          <div
            className={`relative z-[14] flex ${heightViewport} w-full flex-col overflow-hidden rounded-[inherit] transition-[opacity,filter,transform] duration-[400ms] ease-[cubic-bezier(0.4,0.15,0.2,1)] ${warmingUp ? 'crt-warmup' : ''} ${powered ? '' : 'pointer-events-none'}`}
            style={{
              opacity: powered ? 1 : 0,
              transformOrigin: '50% 50%',
              transform: powered ? 'scaleY(1)' : 'scaleY(0.04)',
              ...(warmingUp ? {} : { filter: powered ? 'brightness(1)' : 'brightness(0)' }),
            }}
            aria-hidden={!powered}
          >
            <div
              className="relative h-full w-full overflow-hidden rounded-[inherit]"
              inert={!powered || undefined}
            >
              {children}
            </div>
          </div>

          {!powered && (
            <div
              className={`pointer-events-none absolute inset-0 z-[17] rounded-lg bg-[#030304] ${reduceMotion ? '' : 'crt-flyback-mask'}`}
              aria-hidden
            />
          )}

          {!powered && (
            <div className="pointer-events-none absolute inset-0 z-[21] flex flex-col items-center justify-center gap-2 font-mono text-center">
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

        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 px-1 sm:gap-x-4 sm:px-2">
          {onToggleTypingSound ? (
            <div className={`flex items-center ${controlRail} p-px`}>
              <button
                type="button"
                disabled={controlsLocked}
                onClick={() => {
                  if (!controlsLocked) onToggleTypingSound();
                }}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[5px] text-terminal-muted transition-colors hover:bg-terminal-surface/90 hover:text-terminal-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent active:opacity-95 disabled:cursor-not-allowed disabled:opacity-45"
                aria-label={
                  typingSoundEnabled
                    ? 'Désactiver le son de frappe clavier'
                    : 'Activer le son de frappe clavier'
                }
                title={typingSoundEnabled ? 'Son clavier activé' : 'Son clavier désactivé'}
              >
                <span className="pointer-events-none text-[18px] leading-none sm:text-[19px]" aria-hidden>
                  {typingSoundEnabled ? '🔊' : '🔇'}
                </span>
              </button>
            </div>
          ) : null}

          <div className={`flex items-center px-2.5 py-1.5 sm:px-3 sm:py-2 ${controlRail}`}>
            <button
              type="button"
              disabled={controlsLocked}
              onClick={() => {
                if (!controlsLocked) onTogglePower();
              }}
              aria-pressed={powered}
              aria-label={
                powered ? 'Écran allumé · cliquer pour éteindre' : 'Écran éteint · cliquer pour allumer'
              }
              className="flex min-h-[44px] shrink-0 items-center justify-center gap-2 px-2 sm:gap-2.5 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <span className="hidden font-mono text-[9px] font-bold uppercase tracking-[0.22em] text-terminal-muted sm:inline">
                Monitor
              </span>
              <span className="relative h-[31px] w-[52px] shrink-0 rounded-full border border-terminal-border bg-terminal-bg p-[3px] shadow-[inset_0_3px_6px_rgb(0_0_0/0.55)]">
                <span
                  className="absolute inset-y-[3px] rounded-full shadow-[0_3px_6px_rgb(0_0_0/0.45)] transition-[left,background] duration-[320ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
                  style={{
                    width: '22px',
                    left: powered ? 'calc(100% - 25px)' : '3px',
                    background: powered
                      ? 'linear-gradient(185deg,color-mix(in srgb,var(--term-accent) 92%,white),color-mix(in srgb,var(--term-accent) 55%,#064e3b))'
                      : 'linear-gradient(185deg,color-mix(in srgb,var(--term-dim) 70%,#7f1d1d),#450a0a)',
                  }}
                  aria-hidden
                />
              </span>
              <span
                className={`inline-flex h-[22px] w-8 shrink-0 items-center justify-center rounded border font-mono text-[9px] font-bold uppercase tabular-nums tracking-wider shadow-inner ring-1 ${
                  powered
                    ? 'border-terminal-accent/45 bg-terminal-surface text-terminal-accent ring-terminal-accent/25'
                    : 'border-terminal-border bg-terminal-bg text-terminal-dim ring-terminal-border/50'
                }`}
              >
                {powered ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>

          {onLogout ? (
            <div className={`flex items-center ${controlRail} p-px`}>
              <button
                type="button"
                disabled={controlsLocked}
                onClick={() => {
                  if (!controlsLocked) onLogout();
                }}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-[5px] text-terminal-muted transition-colors hover:bg-terminal-surface/90 hover:text-terminal-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent active:opacity-95 disabled:cursor-not-allowed disabled:opacity-45"
                aria-label="Se déconnecter — nouvelle question à la prochaine connexion"
                title="Déconnexion"
              >
                <LogoutIcon className="pointer-events-none h-[18px] w-[18px] sm:h-5 sm:w-5" />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
