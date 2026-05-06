export interface SecurityQuestion {
  id: string;
  question: string;
  /** User answer is matched after normalizeAnswer — include common variants. */
  acceptedAnswers: string[];
  hint: string;
}

function normalizeAnswer(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, ' ');
}

export function isAnswerCorrect(question: SecurityQuestion, rawInput: string): boolean {
  const n = normalizeAnswer(rawInput);
  if (!n) return false;
  return question.acceptedAnswers.some((a) => normalizeAnswer(a) === n);
}

/** General-knowledge pool — one question is picked at random per visit. */
export const SECURITY_QUESTIONS: SecurityQuestion[] = [
  {
    id: 'math-div',
    question: 'What is 72 divided by 9?',
    acceptedAnswers: ['8', 'eight'],
    hint: 'Think single-digit multiplication facts.',
  },
  {
    id: 'capital-spain',
    question: 'What is the capital of Spain?',
    acceptedAnswers: ['madrid'],
    hint: 'Major city on the central plateau — starts with M.',
  },
  {
    id: 'triangle',
    question: 'How many sides does a triangle have?',
    acceptedAnswers: ['3', 'three'],
    hint: 'The simplest polygon.',
  },
  {
    id: 'water',
    question: 'What is the usual chemical formula for water?',
    acceptedAnswers: ['h2o'],
    hint: 'Two hydrogen atoms and one oxygen atom.',
  },
  {
    id: 'earth-moon',
    question: 'How many moons does Earth have?',
    acceptedAnswers: ['1', 'one'],
    hint: 'Look up at night.',
  },
  {
    id: 'binary',
    question: 'In binary, what decimal number does 101 represent?',
    acceptedAnswers: ['5', 'five'],
    hint: 'Bits from right: 1 + 0 + 4.',
  },
  {
    id: 'light-sound',
    question: 'In air, which is faster: light or sound?',
    acceptedAnswers: ['light'],
    hint: 'Thunder arrives after the flash.',
  },
  {
    id: 'century',
    question: 'Which year began the 21st century (calendar convention)?',
    acceptedAnswers: ['2001'],
    hint: 'There was no “year zero”; count carefully after 1999.',
  },
  {
    id: 'cpu',
    question: 'What does the letter “P” stand for in CPU?',
    acceptedAnswers: ['processing', 'processor'],
    hint: 'Central Processing Unit — the middle word.',
  },
  {
    id: 'rainbow',
    question: 'How many colours are traditionally named in a classic rainbow (ROY G. BIV)?',
    acceptedAnswers: ['7', 'seven'],
    hint: 'Red, orange, yellow, green, blue, indigo, violet.',
  },
];

/** `excludeId` évite de reproposer la même question qu’au tour précédent (ex. après logout). */
export function pickRandomQuestion(excludeId?: string): SecurityQuestion {
  const pool = SECURITY_QUESTIONS;
  const n = pool.length;
  if (n === 0) throw new Error('No security questions configured');
  const candidates = excludeId && n > 1 ? pool.filter((q) => q.id !== excludeId) : pool;
  const use = candidates.length > 0 ? candidates : pool;
  return use[Math.floor(Math.random() * use.length)]!;
}
