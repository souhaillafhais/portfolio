import { createContext, useContext } from 'react';
import type { PortfolioThemeId } from './themePalette';

export type ThemeContextValue = {
  theme: PortfolioThemeId;
  setTheme: (next: PortfolioThemeId) => void;
};

/**
 * Séparé de `portfolioTheme.tsx` : ce module n’exporte aucun composant, ce qui permet au
 * Fast Refresh de préserver l’état lors des éditions du provider.
 */
export const PortfolioThemeContext = createContext<ThemeContextValue | null>(null);

export function usePortfolioTheme(): ThemeContextValue {
  const ctx = useContext(PortfolioThemeContext);
  if (!ctx) {
    throw new Error('usePortfolioTheme must be used within PortfolioThemeProvider');
  }
  return ctx;
}
