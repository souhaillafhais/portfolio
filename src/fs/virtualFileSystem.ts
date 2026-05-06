import {
  ABOUT_TXT,
  CERTIFICATIONS_TXT,
  CONTACT_TXT,
  EDUCATION_TXT,
  EXPERIENCE_TXT,
  INTERESTS_TXT,
  PROJECT1_TXT,
  PROJECT2_TXT,
  PROJECT3_TXT,
  PROJECT4_TXT,
  SKILLS_TXT,
} from '../content/portfolioCopy';

/** Logical path segments; root bucket is `home` (shown as ~ in the prompt). */
export type PathSegments = string[];

export type VirtualNode =
  | {
      type: 'dir';
      children: string[];
    }
  | {
      type: 'file';
      content: string;
    };

/**
 * Flat virtual tree. Keys are POSIX-like paths without leading slash, e.g. `home/projects`.
 * Mirrors /home/... on a typical Linux workstation.
 */
export const VIRTUAL_FS: Record<string, VirtualNode> = {
  home: {
    type: 'dir',
    children: [
      'about.txt',
      'skills.txt',
      'experience.txt',
      'education.txt',
      'certifications.txt',
      'interests.txt',
      'contact.txt',
      'projects',
    ],
  },
  'home/projects': {
    type: 'dir',
    children: ['project1.txt', 'project2.txt', 'project3.txt', 'project4.txt'],
  },
  'home/about.txt': {
    type: 'file',
    content: ABOUT_TXT,
  },
  'home/skills.txt': {
    type: 'file',
    content: SKILLS_TXT,
  },
  'home/experience.txt': {
    type: 'file',
    content: EXPERIENCE_TXT,
  },
  'home/education.txt': {
    type: 'file',
    content: EDUCATION_TXT,
  },
  'home/certifications.txt': {
    type: 'file',
    content: CERTIFICATIONS_TXT,
  },
  'home/interests.txt': {
    type: 'file',
    content: INTERESTS_TXT,
  },
  'home/contact.txt': {
    type: 'file',
    content: CONTACT_TXT,
  },
  'home/projects/project1.txt': {
    type: 'file',
    content: PROJECT1_TXT,
  },
  'home/projects/project2.txt': {
    type: 'file',
    content: PROJECT2_TXT,
  },
  'home/projects/project3.txt': {
    type: 'file',
    content: PROJECT3_TXT,
  },
  'home/projects/project4.txt': {
    type: 'file',
    content: PROJECT4_TXT,
  },
};

export const pathKey = (segments: PathSegments): string => segments.join('/');

export const pathsEqual = (a: PathSegments, b: PathSegments): boolean =>
  pathKey(a) === pathKey(b);

export const getVirtualNode = (
  segments: PathSegments,
  fs: Record<string, VirtualNode> = VIRTUAL_FS,
): VirtualNode | undefined => fs[pathKey(segments)];

/** Collapse `.`, `..`, empty segments; cannot escape above `home`. */
export const normalizePathSegments = (parts: string[]): PathSegments => {
  const result: string[] = [];

  for (const part of parts) {
    if (!part || part === '.') continue;
    if (part === '..') {
      if (result.length > 1) result.pop();
      continue;
    }
    result.push(part);
  }

  return result.length === 0 ? ['home'] : result;
};

/**
 * Resolve a user path segment against cwd — supports ~, ~/, absolute paths under /home.
 */
export const resolveVirtualPath = (target: string, cwd: PathSegments): PathSegments | null => {
  const t = target.trim();

  if (t === '~' || t === '~/' || t === '/') {
    return ['home'];
  }

  if (t.startsWith('~/')) {
    const rest = t.slice(2).split('/').filter(Boolean);
    return normalizePathSegments(['home', ...rest]);
  }

  const parts = t.split('/').filter(Boolean);

  if (t.startsWith('/')) {
    if (parts[0] !== 'home') return null;
    return normalizePathSegments(parts);
  }

  return normalizePathSegments([...cwd, ...parts]);
};

/** Prompt-style display: ~ and ~/projects */
export const formatPromptPath = (segments: PathSegments): string => {
  if (segments.length === 1 && segments[0] === 'home') return '~';
  return `~/${segments.slice(1).join('/')}`;
};

/** pwd-style absolute path starting at /home */
export const formatAbsolutePath = (segments: PathSegments): string =>
  `/${segments.join('/')}`;

export type ListedEntries = { dirs: string[]; files: string[] };

/** Sorted listing: directories (with trailing slash) then files. */
export const listDirectoryEntries = (
  segments: PathSegments,
  fs: Record<string, VirtualNode> = VIRTUAL_FS,
): ListedEntries | null => {
  const node = getVirtualNode(segments, fs);
  if (!node || node.type !== 'dir') return null;

  const base = pathKey(segments);
  const dirs: string[] = [];
  const files: string[] = [];

  for (const name of node.children) {
    const child = fs[`${base}/${name}`];
    if (!child) continue;
    if (child.type === 'dir') dirs.push(`${name}/`);
    else files.push(name);
  }

  dirs.sort((a, b) => a.localeCompare(b));
  files.sort((a, b) => a.localeCompare(b));

  return { dirs, files };
};

export const formatLsOutput = (entries: ListedEntries): string =>
  [...entries.dirs, ...entries.files].join('  ');
