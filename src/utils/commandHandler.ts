import {
  ABOUT_TXT,
  CERTIFICATIONS_TXT,
  CONTACT_TXT,
  EDUCATION_TXT,
  EXPERIENCE_TXT,
  INTERESTS_TXT,
  SKILLS_TXT,
} from '../content/portfolioCopy';
import {
  formatAbsolutePath,
  formatLsOutput,
  formatPromptPath,
  getVirtualNode,
  listDirectoryEntries,
  resolveVirtualPath,
  type PathSegments,
} from '../fs/virtualFileSystem';
import { parseCommandLine } from './parseCommandLine';
import {
  type PortfolioThemeId,
  PORTFOLIO_THEME_IDS,
  resolvePortfolioThemeSlug,
  THEME_DESCRIPTIONS,
} from '../theme/themePalette';

export type CommandOutputSegment = {
  text: string;
  stream: 'stdout' | 'stderr';
};

export interface ShellEnvironment {
  /** Previous working directory (bash OLDPWD), tracked by the terminal host. */
  oldPwd: PathSegments | null;
  /** Optional theme bridge for the `theme` builtin (React host calls `setTheme`). */
  applyPortfolioTheme?: (next: PortfolioThemeId) => void;
  getPortfolioTheme?: () => PortfolioThemeId;
}

export interface CommandResult {
  /** Plain stdout/stderr block (used when segments are not needed). */
  output?: string;
  /** Multi-stream output (e.g. cat f g … with mixed errors). */
  segments?: CommandOutputSegment[];
  type: 'success' | 'error' | 'info';
  nextPath?: PathSegments;
  clear?: boolean;
}

const AVAILABLE_COMMANDS = {
  help: 'Show all available commands',
  clear: 'Clear terminal output',
  whoami: 'Display profile summary',
  about: 'Detailed introduction',
  skills: 'Technical skills matrix',
  experience: 'Internships & work experience',
  education: 'Academic background',
  certifications: 'Professional certifications',
  certs: 'Alias for certifications',
  interests: 'Hobbies & volunteering',
  contact: 'Email, phone, LinkedIn & languages',
  projects: 'Index of project files in ~/projects',
  specs: 'Show Linux-style system specs',
  system: 'Alias for specs',
  arch: 'Print system architecture',
  uname: 'Print system information',
  theme: 'Palette: theme kali | theme ubuntu (aliases: dark / light)',
  pwd: 'Print working directory (POSIX path)',
  cd: 'Change directory (cd [path] | cd -)',
  ls: 'List directory contents (optional path)',
  cat: 'Concatenate and print files (cat FILE [FILE…])',
  exit: 'Return to home directory (~)',
};

/** Sorted names used for tab-completion (documented commands only). */
export const REGISTERED_COMMANDS = Object.keys(AVAILABLE_COMMANDS).sort();

const ASCII_PENGUIN = [
  '      .--.',
  '     |o_o |',
  '     |:_/ |',
  '    //   \\ \\',
  '   (|     | )',
  "  /'\\_   _/`\\",
  '  \\___)=(___/',
].join('\n');

export const executeCommand = (
  input: string,
  cwd: PathSegments,
  env: ShellEnvironment = { oldPwd: null },
): CommandResult => {
  const parsed = parseCommandLine(input.trim());
  const command = parsed.command;
  const args = parsed.args;

  if (!command) {
    return { output: '', type: 'info' };
  }

  switch (command) {
    case 'help':
      return handleHelp();
    case 'clear':
      return handleClear();
    case 'whoami':
      return handleWhoami();
    case 'about':
      return handleAbout();
    case 'skills':
      return handleSkills();
    case 'experience':
      return handleExperience();
    case 'education':
      return handleEducation();
    case 'certifications':
    case 'certs':
      return handleCertifications();
    case 'interests':
      return handleInterests();
    case 'contact':
      return handleContact();
    case 'projects':
      return handleProjects();
    case 'specs':
    case 'system':
      return handleSpecs();
    case 'arch':
      return handleArch();
    case 'uname':
      return handleUname(args);
    case 'theme':
      return handleTheme(args, env);
    case 'pwd':
      return handlePwd(cwd);
    case 'cd':
      return handleCd(args, cwd, env);
    case 'ls':
      return handleLs(args, cwd);
    case 'cat':
      return handleCat(args, cwd);
    case 'exit':
      return handleExit();
    default:
      return tryEasterEgg(command, args) ?? unknownCommand(parsed.commandLiteral);
  }
};

const tryEasterEgg = (cmd: string, args: string[]): CommandResult | null => {
  switch (cmd) {
    case 'sudo':
    case 'su':
      return {
        output: `[portfolio-shell] ${cmd}: elevation denied — session runs without privileges.\nTry 'help' for available built-ins.`,
        type: 'info',
      };
    case 'nmap':
      return {
        output: [
          'Starting Nmap 7.94 ( simulated — no packets sent )',
          'Nmap scan report for portfolio (127.0.0.1)',
          'Not shown: 997 filtered tcp ports (demo)',
          'PORT     STATE SERVICE',
          '22/tcp   open  ssh',
          '80/tcp   closed http',
          '443/tcp  open  https',
          '',
          'Portfolio overlay: fictional scan for ambience only.',
        ].join('\n'),
        type: 'success',
      };
    case 'ssh':
      return {
        output: `ssh: connect to host portfolio port 22: Connection refused\nhint: you're already inside this shell.`,
        type: 'error',
      };
    case 'ping': {
      const target = args[0] ?? 'portfolio';
      return {
        output: [
          `PING ${target} (127.0.0.1) 56(84) bytes of data.`,
          `64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.02 ms`,
          '',
          `--- ${target} ping statistics ---`,
          '1 packets transmitted, 1 received, 0% packet loss (demo)',
        ].join('\n'),
        type: 'success',
      };
    }
    case 'curl':
    case 'wget':
      return {
        output: `[HTTP/2 418] I'm a teapot — portfolio demo stub.\nTry 'cat about.txt' for real content.`,
        type: 'info',
      };
    case 'chmod':
    case 'chown':
    case 'rm':
    case 'mkfs':
    case 'dd':
      return {
        output: `${cmd}: operation not permitted on demo filesystem`,
        type: 'error',
      };
    case 'hack':
    case 'matrix':
      return {
        output: [
          'INIT SEQUENCE… OK',
          '[████████████████████] 100% ambience',
          'There is no spoon — only React state.',
        ].join('\n'),
        type: 'success',
      };
    default:
      return null;
  }
};

const COMMAND_NOT_FOUND_SHELL = 'bash';

const unknownCommand = (literal: string): CommandResult => ({
  output: `${COMMAND_NOT_FOUND_SHELL}: ${literal}: command not found\nType 'help' to see available commands.`,
  type: 'error',
});

const handleTheme = (args: string[], env: ShellEnvironment): CommandResult => {
  const current = env.getPortfolioTheme?.() ?? 'kali';

  if (args.length === 0) {
    const desc = THEME_DESCRIPTIONS[current] ?? '';
    return {
      output: [
        `Current theme: ${current}`,
        desc ? `  (${desc})` : '',
        '',
        'Try:  theme list     — prints every palette & id',
        '      theme <name>  — switches shell & page styling (saved locally)',
      ]
        .filter(Boolean)
        .join('\n'),
      type: 'info',
    };
  }

  const raw = args[0]!.trim().toLowerCase();

  if (raw === 'list' || raw === 'ls') {
    const lines = [...PORTFOLIO_THEME_IDS]
      .sort()
      .map((id) => `  ${id.padEnd(18)} ${THEME_DESCRIPTIONS[id]}`)
      .join('\n');

    return {
      output: [
        'portfolio-shell palettes (theme <id>):',
        '------------------------------------------------------------',
        lines,
        '',
        'Aliases — dark:kali · light:ubuntu · tokyonight:tokyo-night · ocean:oceanic',
      ].join('\n'),
      type: 'info',
    };
  }

  const next = resolvePortfolioThemeSlug(raw);

  if (!next) {
    return {
      output: [
        `theme: '${args[0]}' is unknown.`,
        "Run theme list — or shorthand: theme kali · theme ubuntu · theme rose-pine · …",
      ].join('\n'),
      type: 'error',
    };
  }

  env.applyPortfolioTheme?.(next);

  return {
    output: [`Theme set → ${next}`, THEME_DESCRIPTIONS[next]].join('\n'),
    type: 'success',
  };
};

const handleHelp = (): CommandResult => {
  const rows = Object.entries(AVAILABLE_COMMANDS);
  const col = rows.reduce((w, [name]) => Math.max(w, name.length), 4);

  const body = rows
    .map(([cmd, summary]) => `  ${cmd.padEnd(col)}    ${summary}`)
    .join('\n');

  const banner = [
    ASCII_PENGUIN,
    '',
    'Linux Portfolio',
    '',
    'portfolio-shell (bash-compat) - interactive portfolio',
    '------------------------------------------------------------',
    '',
    body,
    '',
    'Quick content: experience | education | certifications | contact | interests',
    '(same content as ~/experience.txt, etc.)',
    '',
    'Navigate like a workstation: ~/ holds text files plus projects/',
  ].join('\n');

  return { output: banner, type: 'info' };
};

const handleSpecs = (): CommandResult => ({
  output: [
    ASCII_PENGUIN,
    '',
    'Linux Portfolio',
    '',
    'souhail@portfolio',
    '---------------------------',
    'OS: Portfolio Linux 1.0 (demo)',
    'Kernel: 6.8.0-portfolio',
    'Arch: x86_64',
    'Shell: bash-compatible (custom)',
    'CPU: Intel Core i7 (simulated)',
    'Memory: 16 GiB (simulated)',
    'Terminal: CRT Portfolio Shell',
    '',
    "Tip: run 'arch' or 'uname -a' for quick info.",
  ].join('\n'),
  type: 'success',
});

const handleArch = (): CommandResult => ({
  output: [ASCII_PENGUIN, '', 'Linux Portfolio', '', 'x86_64'].join('\n'),
  type: 'success',
});

const handleUname = (args: string[]): CommandResult => {
  const full = args.includes('-a');
  if (full) {
    return {
      output: [
        ASCII_PENGUIN,
        '',
        'Linux Portfolio',
        '',
        'Linux portfolio 6.8.0-portfolio #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux',
      ].join('\n'),
      type: 'success',
    };
  }
  return {
    output: [ASCII_PENGUIN, '', 'Linux Portfolio', '', 'Linux'].join('\n'),
    type: 'success',
  };
};

const handleClear = (): CommandResult => ({
  output: '',
  type: 'info',
  clear: true,
});

const handleWhoami = (): CommandResult => ({
  output: `Souhail Lafhais | MIAGE Engineering Student — EMSI Casablanca
Cybersecurity · Software Engineering · Artificial Intelligence
portfolio-shell v1.0 · souhaillafhais@gmail.com`,
  type: 'success',
});

const handleAbout = (): CommandResult => ({
  output: ABOUT_TXT,
  type: 'success',
});

const handleSkills = (): CommandResult => ({
  output: SKILLS_TXT,
  type: 'success',
});

const handleExperience = (): CommandResult => ({
  output: EXPERIENCE_TXT,
  type: 'success',
});

const handleEducation = (): CommandResult => ({
  output: EDUCATION_TXT,
  type: 'success',
});

const handleCertifications = (): CommandResult => ({
  output: CERTIFICATIONS_TXT,
  type: 'success',
});

const handleInterests = (): CommandResult => ({
  output: INTERESTS_TXT,
  type: 'success',
});

const handleContact = (): CommandResult => ({
  output: CONTACT_TXT,
  type: 'success',
});

const handleProjects = (): CommandResult => ({
  output: `Project write-ups live under ~/projects/ :

  project1.txt — IT monitoring & incident management (Technopure Morocco)
  project2.txt — SOC lab & intrusion detection (EMSI)
  project3.txt — Scalable cloud deployment & CI/CD (AWS, Docker, K8s)
  project4.txt — AcciTrack mobile app (Spring Boot · React Native · MySQL)

Try:  cd projects   then   ls   or   cat project1.txt`,
  type: 'info',
});

const handlePwd = (cwd: PathSegments): CommandResult => ({
  output: formatAbsolutePath(cwd),
  type: 'success',
});

const handleCd = (args: string[], cwd: PathSegments, env: ShellEnvironment): CommandResult => {
  if (args.length > 1) {
    return {
      output: 'bash: cd: too many arguments',
      type: 'error',
    };
  }

  if (args.length === 0) {
    return {
      output: '',
      type: 'success',
      nextPath: ['home'],
    };
  }

  const target = args[0]!;

  if (target === '-') {
    const prev = env.oldPwd;

    if (!prev) {
      return {
        output: 'bash: cd: OLDPWD not set',
        type: 'error',
      };
    }

    const node = getVirtualNode(prev);

    if (!node || node.type !== 'dir') {
      return {
        output: 'bash: cd: -: No such file or directory',
        type: 'error',
      };
    }

    return {
      output: formatPromptPath(prev),
      type: 'success',
      nextPath: prev,
    };
  }

  const newPath = resolveVirtualPath(target, cwd);

  if (!newPath) {
    return {
      output: `bash: cd: ${target}: No such file or directory`,
      type: 'error',
    };
  }

  const node = getVirtualNode(newPath);

  if (!node) {
    return {
      output: `bash: cd: ${target}: No such file or directory`,
      type: 'error',
    };
  }

  if (node.type !== 'dir') {
    return {
      output: `bash: cd: ${target}: Not a directory`,
      type: 'error',
    };
  }

  return {
    output: '',
    type: 'success',
    nextPath: newPath,
  };
};

const handleLs = (args: string[], cwd: PathSegments): CommandResult => {
  if (args.length > 1) {
    return {
      output: 'bash: ls: too many arguments',
      type: 'error',
    };
  }

  let pathSegments: PathSegments;

  if (args.length === 0) {
    pathSegments = cwd;
  } else {
    const resolved = resolveVirtualPath(args[0]!, cwd);
    if (resolved === null) {
      return {
        output: `ls: cannot access ${args[0]}: No such file or directory`,
        type: 'error',
      };
    }
    pathSegments = resolved;
  }

  const node = getVirtualNode(pathSegments);

  if (!node) {
    const label = args[0] ?? formatPromptPath(pathSegments);
    return {
      output: `ls: cannot access ${label}: No such file or directory`,
      type: 'error',
    };
  }

  if (node.type !== 'dir') {
    const label = args[0] ?? formatPromptPath(pathSegments);
    return {
      output: `ls: cannot access ${label}: Not a directory`,
      type: 'error',
    };
  }

  const entries = listDirectoryEntries(pathSegments)!;

  return {
    output: formatLsOutput(entries),
    type: 'success',
  };
};

const describeCatTarget = (target: string, cwd: PathSegments): CommandOutputSegment => {
  const targetPath = resolveVirtualPath(target, cwd);

  if (!targetPath) {
    return { stream: 'stderr', text: `cat: ${target}: No such file or directory` };
  }

  const node = getVirtualNode(targetPath);

  if (!node) {
    return { stream: 'stderr', text: `cat: ${target}: No such file or directory` };
  }

  if (node.type === 'dir') {
    return { stream: 'stderr', text: `cat: ${target}: Is a directory` };
  }

  return { stream: 'stdout', text: node.content };
};

const handleCat = (args: string[], cwd: PathSegments): CommandResult => {
  if (args.length === 0) {
    return {
      output: 'cat: missing operand',
      type: 'error',
    };
  }

  if (args.length === 1) {
    const segment = describeCatTarget(args[0]!, cwd);
    if (segment.stream === 'stderr') {
      return { output: segment.text, type: 'error' };
    }
    return { output: segment.text, type: 'success' };
  }

  const segments = args.map((arg) => describeCatTarget(arg, cwd));

  const sawStdout = segments.some((s) => s.stream === 'stdout');
  const sawStderr = segments.some((s) => s.stream === 'stderr');

  return {
    segments,
    type: sawStderr && !sawStdout ? 'error' : 'success',
  };
};

const handleExit = (): CommandResult => ({
  output: 'Working directory set to ~',
  type: 'info',
  nextPath: ['home'],
});
