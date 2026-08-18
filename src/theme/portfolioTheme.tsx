import { useCallback, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from 'react';
import {
  type PortfolioThemeId,
  defaultPortfolioTheme,
  isPortfolioThemeId,
} from './themePalette';
import { PortfolioThemeContext } from './portfolioThemeContext';

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

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return <PortfolioThemeContext.Provider value={value}>{children}</PortfolioThemeContext.Provider>;
}
