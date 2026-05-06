export interface ParsedCommandLine {
  /** Full trimmed command line before interpretation */
  raw: string;
  /** First token as typed (verbatim / unquoted casing) */
  commandLiteral: string;
  /** First token, lowercased (empty if line is blank or comment-only). */
  command: string;
  /** Remaining tokens, casing preserved */
  args: string[];
}

/**
 * Shell-like tokenizer: splits on whitespace, honours '...' and "..." segments.
 */
function tokenize(line: string): string[] {
  const tokens: string[] = [];
  let cur = '';
  let quote: '"' | "'" | null = null;

  const flush = () => {
    if (cur.length > 0) tokens.push(cur);
    cur = '';
  };

  for (let i = 0; i < line.length; i++) {
    const c = line[i]!;

    if (quote === "'") {
      if (c === "'") quote = null;
      else cur += c;
      continue;
    }

    if (quote === '"') {
      if (c === '\\' && i + 1 < line.length) {
        const next = line[i + 1]!;
        if (next === '"' || next === '\\' || next === '\n') {
          cur += next;
          i++;
          continue;
        }
      }
      if (c === '"') quote = null;
      else cur += c;
      continue;
    }

    if (/\s/.test(c)) {
      flush();
      while (i + 1 < line.length && /\s/.test(line[i + 1]!)) i++;
      continue;
    }

    if (c === '"' || c === "'") {
      quote = c;
      continue;
    }

    cur += c;
  }

  flush();
  return tokens;
}

/** Parses interactive shell input after trim; treats leading `#` as a comment line. */
export function parseCommandLine(line: string): ParsedCommandLine {
  const trimmed = line.trim();

  if (!trimmed) {
    return { raw: '', commandLiteral: '', command: '', args: [] };
  }

  if (trimmed.startsWith('#')) {
    return { raw: trimmed, commandLiteral: '', command: '', args: [] };
  }

  const words = tokenize(trimmed);

  if (words.length === 0) {
    return { raw: trimmed, commandLiteral: '', command: '', args: [] };
  }

  const [commandHead, ...args] = words;
  const literal = commandHead ?? '';

  return {
    raw: trimmed,
    commandLiteral: literal,
    command: literal.toLowerCase(),
    args,
  };
}
