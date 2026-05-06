/** Canonical `data-portfolio-theme` ids (hyphenated names). Kept narrow so CSS stays readable. */

export const PORTFOLIO_THEME_IDS = [
  'kali',
  'ubuntu',
  'dracula',
  'nord',
  'gruvbox',
  'monokai',
  'tokyo-night',
  'catppuccin',
  'matrix',
  'solarized-dark',
  'solarized-light',
  'paper',
  'rose-pine',
  'one-dark',
  'oceanic',
] as const;

export type PortfolioThemeId = (typeof PORTFOLIO_THEME_IDS)[number];

/** One-line summaries for `theme list` / help. */
export const THEME_DESCRIPTIONS: Record<PortfolioThemeId, string> = {
  kali: 'Dark Kali-inspired — green/teal on black',
  ubuntu: 'Light Ubuntu-inspired — amber field, brown text',
  dracula: 'Dracula classic — violet & cyan accents',
  nord: 'Nord Frost — glacier blues',
  gruvbox: 'Gruvbox dark — retro warm amber',
  monokai: 'Monokai — neon candy syntax',
  'tokyo-night': 'Tokyo Night — violet / indigo / magenta',
  catppuccin: 'Catppuccin Mocha — mauve & rosewater',
  matrix: 'Matrix — radioactive green on abyss black',
  'solarized-dark': 'Solarized Dark — blue-gray tooling',
  'solarized-light': 'Solarized Light — ivory & solar yellow',
  paper: 'Paper — soft cream editorial light',
  'rose-pine': 'Rosé Pine — rose & dusty purple dusk',
  'one-dark': 'One Dark — Atom-style blue graphite',
  oceanic: 'Oceanic Next — teal & seafoam deep blue',
};

const ALIAS_ENTRIES: readonly [string, PortfolioThemeId][] = [
  ['dark', 'kali'],
  ['light', 'ubuntu'],
  ['gruv', 'gruvbox'],
  ['tokyonight', 'tokyo-night'],
  ['tokyo', 'tokyo-night'],
  ['catpuccino', 'catppuccin'],
  ['catppuccin-mocha', 'catppuccin'],
  ['mocha', 'catppuccin'],
  ['solarized', 'solarized-dark'],
  ['sol-dark', 'solarized-dark'],
  ['sol-light', 'solarized-light'],
  ['pine', 'rose-pine'],
  ['ocean', 'oceanic'],
];

const aliasMap = new Map<string, PortfolioThemeId>(
  [...ALIAS_ENTRIES].map(([a, id]) => [a, id]),
);

export function isPortfolioThemeId(v: string): v is PortfolioThemeId {
  return (PORTFOLIO_THEME_IDS as readonly string[]).includes(v);
}

/** Maps user input (`theme xxx`) to an id or null. Hyphens normalized. */
export function resolvePortfolioThemeSlug(raw: string): PortfolioThemeId | null {
  const k = raw.trim().toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-');
  if (isPortfolioThemeId(k)) return k;
  return aliasMap.get(k) ?? null;
}

export function defaultPortfolioTheme(): PortfolioThemeId {
  return 'kali';
}
