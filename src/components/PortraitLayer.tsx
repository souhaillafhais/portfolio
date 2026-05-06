import { useEffect, useLayoutEffect, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { LINKEDIN_PROFILE_URL } from '../constants/socialLinks';
import gatePortrait from '../assets/photo.jpg';

interface PortraitLayerProps {
  docked: boolean;
}

/**
 * Après unlock : pose « centre » puis glissement lent vers la pastille dockée à droite.
 * Note : le composant reste monté pendant le gate (`docked={false}`) — les effets ne doivent
 * mettre entered à true QUE lorsque `docked` est vrai, sinon la transition serait sauté au login.
 */
export const PortraitLayer = ({ docked }: PortraitLayerProps) => {
  const reduceMotion = usePrefersReducedMotion();
  const [photoBroken, setPhotoBroken] = useState(false);
  /** false = géométrie « entrée » (centre) ; true = dock coin droit ; animé uniquement quand docked. */
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!docked) {
      setEntered(reduceMotion);
    }
  }, [docked, reduceMotion]);

  useLayoutEffect(() => {
    if (!docked) return;
    if (reduceMotion) {
      setEntered(true);
      return;
    }
    setEntered(false);
    /* Laisser le navigateur composer la pose initiale avant de basculer (sinon pas d’interpolation). */
    const id = window.setTimeout(() => setEntered(true), 160);
    return () => window.clearTimeout(id);
  }, [docked, reduceMotion]);

  if (!docked) {
    return null;
  }

  const timing = reduceMotion
    ? ''
    : 'transition-[left,top,width,height,border-radius,border-width,border-color,box-shadow] duration-[5200ms] ease-[cubic-bezier(0.26,1,0.4,1)] will-change-[left,top,width,height]';

  const layoutEnter = [
    'fixed z-[90] overflow-hidden bg-terminal-header shadow-lg',
    'pointer-events-none',
    'rounded-full border border-terminal-border',
    'h-28 w-28 sm:h-32 sm:w-32 min-h-[7rem] min-w-[7rem]',
    'top-[calc(env(safe-area-inset-top,0)+min(35svh,13.5rem))] sm:top-[calc(env(safe-area-inset-top,0)+min(33svh,14rem))]',
    'left-[calc(50vw-3.5rem)] sm:left-[calc(50vw-4rem)]',
  ].join(' ');

  const layoutDocked = [
    'fixed z-[90] overflow-hidden bg-terminal-header shadow-lg',
    'pointer-events-none',
    'rounded-full border border-terminal-accent/50',
    'h-[5.25rem] w-[5.25rem] sm:h-24 sm:w-24',
    'top-[max(0.75rem,env(safe-area-inset-top))] sm:top-[max(1rem,env(safe-area-inset-top))]',
    'left-[calc(100vw-max(0.75rem,env(safe-area-inset-right))-5.25rem)]',
    'sm:left-[calc(100vw-max(1.5rem,env(safe-area-inset-right))-6rem)]',
  ].join(' ');

  const layout = entered ? layoutDocked : layoutEnter;

  const imgBody = !photoBroken ? (
    <img
      src={gatePortrait}
      alt=""
      width={160}
      height={160}
      className="h-full w-full object-cover"
      draggable={false}
      onError={() => setPhotoBroken(true)}
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-terminal-accent">SL</div>
  );

  return (
    <div className={`${timing} ${layout}`} aria-hidden={false}>
      <a
        href={LINKEDIN_PROFILE_URL}
        target="_blank"
        rel="noopener noreferrer me"
        className="pointer-events-auto absolute inset-0 z-[1] rounded-inherit outline-none hover:opacity-[0.96] focus-visible:ring-2 focus-visible:ring-terminal-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--term-bg)]"
        aria-label="Souhail Lafhais — ouvrir LinkedIn"
        title="LinkedIn"
      />
      <div className="relative z-0 h-full w-full">{imgBody}</div>
    </div>
  );
};
