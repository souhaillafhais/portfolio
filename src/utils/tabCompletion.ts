import { listDirectoryEntries, type PathSegments } from '../fs/virtualFileSystem';
import { REGISTERED_COMMANDS } from './commandHandler';

function longestCommonPrefix(strs: string[]): string {
  if (strs.length === 0) return '';
  let prefix = strs[0]!;
  for (let i = 1; i < strs.length; i++) {
    const s = strs[i]!;
    let j = 0;
    while (j < prefix.length && j < s.length && prefix[j] === s[j]) j++;
    prefix = prefix.slice(0, j);
    if (!prefix) return '';
  }
  return prefix;
}

function pathCandidates(cmd: string, cwd: PathSegments): string[] {
  const entries = listDirectoryEntries(cwd);
  if (!entries) return [];

  const dirs = entries.dirs.map((d) => d.slice(0, -1));
  const pool = cmd === 'cd' ? dirs : [...dirs, ...entries.files];
  return [...pool].sort((a, b) => a.localeCompare(b));
}

/**
 * Bash-style tab completion for registered commands and cwd paths (cd / ls / cat).
 * Returns an updated input line, or null when nothing applies.
 */
export function applyTabCompletion(line: string, cwd: PathSegments): string | null {
  const endsWithSpace = /\s$/.test(line);
  const trimmedRight = line.replace(/\s+$/, '');
  const tokens =
    trimmedRight.length === 0 ? ([] as string[]) : trimmedRight.split(/\s+/);

  const head = tokens[0]?.toLowerCase();
  const registeredHead = head ? REGISTERED_COMMANDS.includes(head) : false;

  if (
    registeredHead &&
    head &&
    (tokens.length >= 2 || endsWithSpace) &&
    (head === 'cd' || head === 'ls' || head === 'cat')
  ) {
    let partial = '';
    let stem: string;

    if (endsWithSpace) {
      partial = '';
      stem = line;
    } else {
      partial = tokens[tokens.length - 1]!;
      stem = line.slice(0, line.length - partial.length);
    }

    const pool = pathCandidates(head, cwd);
    const matches = pool.filter((name) => name.startsWith(partial));

    if (matches.length === 0) return null;
    if (matches.length === 1) {
      return stem + matches[0] + ' ';
    }

    const lcp = longestCommonPrefix(matches);
    const ext = lcp.slice(partial.length);
    return ext.length > 0 ? stem + lcp : null;
  }

  if (tokens.length !== 1 || endsWithSpace) {
    return null;
  }

  const partial = tokens[0]!;
  const lower = partial.toLowerCase();
  const exact = REGISTERED_COMMANDS.find((c) => c === lower);

  if (exact) {
    return line + ' ';
  }

  const matches = REGISTERED_COMMANDS.filter((c) => c.startsWith(lower));
  if (matches.length === 0) return null;

  const stem = line.slice(0, line.length - partial.length);

  if (matches.length === 1) {
    return stem + matches[0] + ' ';
  }

  const lcp = longestCommonPrefix(matches);
  const ext = lcp.slice(partial.length);
  return ext.length > 0 ? stem + lcp : null;
}
