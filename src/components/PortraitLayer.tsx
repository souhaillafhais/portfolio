import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { LINKEDIN_PROFILE_URL } from '../constants/socialLinks';
import gatePortrait from '../assets/photo.jpg';

interface PortraitLayerProps {
  position: 'login' | 'docked' | 'hidden';
}

/**
 * Image partagée : apparition en haut du login, puis glissement vers le coin droit quand l’app est active.
 */
export const PortraitLayer = ({ position }: PortraitLayerProps) => {
  const reduceMotion = usePrefersReducedMotion();
  const [photoBroken, setPhotoBroken] = useState(false);
  const [entered, setEntered] = useState(false);
  const [renderedPosition, setRenderedPosition] = useState(position);
  const isDocked = position === 'docked';

  /* Ajustement d’état pendant le rendu — motif React pour réagir au changement d’une prop. */
  if (renderedPosition !== position) {
    setRenderedPosition(position);
    setEntered(reduceMotion && position === 'docked');
  }

  useEffect(() => {
    if (!isDocked || reduceMotion || entered) return;

    /* Laisser le navigateur composer la pose initiale avant de basculer (sinon pas d’interpolation). */
    const id = window.setTimeout(() => setEntered(true), 160);
    return () => window.clearTimeout(id);
  }, [isDocked, reduceMotion, entered]);

  if (position === 'hidden') {
    return null;
  }

  const timing = reduceMotion
    ? ''
    : 'transition-[right,top,width,height,border-radius,border-width,border-color,box-shadow,transform] duration-[5200ms] ease-[cubic-bezier(0.26,1,0.4,1)] will-change-[right,top,width,height,transform]';

  /*
   * Login et poste de travail partagent le coin haut droit du tube : l’image ne fait que
   * rétrécir d’une vue à l’autre, sans jamais passer sur le texte de la console.
   *
   * Ancré par `right` et non par `left: calc(100vw - …)` : `100vw` inclut la barre de
   * défilement, ce qui décalait le portrait sous celle-ci sur desktop.
   */
  const layoutLogin = [
    'fixed z-[90] overflow-hidden bg-terminal-header shadow-lg',
    'pointer-events-none',
    'rounded-full border border-terminal-border',
    'h-24 w-24 sm:h-32 sm:w-32',
    'top-[calc(var(--crt-bezel)+env(safe-area-inset-top,0px)+1.25rem)]',
    'right-[calc(var(--crt-bezel)+env(safe-area-inset-right,0px)+1rem)]',
  ].join(' ');

  const layoutDocked = [
    'fixed z-[90] overflow-hidden bg-terminal-header shadow-lg',
    'pointer-events-none',
    'rounded-full border border-terminal-accent/50',
    'h-[5.25rem] w-[5.25rem] sm:h-24 sm:w-24',
    /* Décalé de l’épaisseur du cadre pour se poser dans le tube, pas sur le plastique. */
    'top-[calc(var(--crt-bezel)+env(safe-area-inset-top,0px)+0.85rem)]',
    'right-[calc(var(--crt-bezel)+env(safe-area-inset-right,0px)+0.85rem)]',
  ].join(' ');

  const layout = position === 'login' ? layoutLogin : entered ? layoutDocked : layoutLogin;

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
        className="pointer-events-auto absolute inset-0 z-[1] rounded-full outline-none hover:opacity-[0.96] focus-visible:ring-2 focus-visible:ring-terminal-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--term-bg)]"
        aria-label="Souhail Lafhais — ouvrir LinkedIn"
        title="LinkedIn"
      />
      <div className="relative z-0 h-full w-full">{imgBody}</div>
    </div>
  );
};
