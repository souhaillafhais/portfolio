import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useState, type ReactNode } from 'react';
import {
  type PortfolioThemeId,
  defaultPortfolioTheme,
  isPortfolioThemeId,
} from './themePalette';

export type { PortfolioThemeId } from './themePalette';

const STORAGE_KEY = 'portfolio-shell-theme';

function readStoredTheme(): PortfolioThemeId {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && isPortfolioThemeId(raw)) return raw;
  } catch {
    /* private mode etc. */
  }
  return defaultPortfolioTheme();
}

type ThemeContextValue = {
  theme: PortfolioThemeId;
  setTheme: (next: PortfolioThemeId) => void;
};

const PortfolioThemeContext = createContext<ThemeContextValue | null>(null);

/** Keeps Tailwind/CSS theme tokens in sync with `data-portfolio-theme` on `<html>`. */
export function PortfolioThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<PortfolioThemeId>(() => readStoredTheme());

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-portfolio-theme', theme);
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const setTheme = useCallback((next: PortfolioThemeId) => {
    setThemeState(next);
  }, []);

  return (
    <PortfolioThemeContext.Provider value={{ theme, setTheme }}>{children}</PortfolioThemeContext.Provider>
  );
}

export function usePortfolioTheme(): ThemeContextValue {
  const ctx = useContext(PortfolioThemeContext);
  if (!ctx) {
    throw new Error('usePortfolioTheme must be used within PortfolioThemeProvider');
  }
  return ctx;
}
