import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { CrtMonitor } from './CrtMonitor';
import { CodeBackdrop } from './CodeBackdrop';
import {
  isAnswerCorrect,
  pickRandomQuestion,
  type SecurityQuestion,
} from '../data/securityQuestions';

interface LoginGateProps {
  onPassed: () => void;
  gateSession: number;
  lastQuestionIdKey: string;
}

const LOGIN_USER = 'visitor';

/** Session TTY sur le tube CRT : bannière noyau, invite de login, question de sécurité. */
export const LoginGate = ({ onPassed, lastQuestionIdKey, gateSession }: LoginGateProps) => {
  const reduceMotion = usePrefersReducedMotion();
  const question = useMemo<SecurityQuestion>(() => {
    try {
      const excludeRaw =
        gateSession > 0 ? (sessionStorage.getItem(lastQuestionIdKey) ?? undefined) : undefined;
      const q = pickRandomQuestion(excludeRaw?.trim() || undefined);
      sessionStorage.setItem(lastQuestionIdKey, q.id);
      return q;
    } catch {
      const q = pickRandomQuestion();
      try {
        sessionStorage.setItem(lastQuestionIdKey, q.id);
      } catch {
        /* ignore */
      }
      return q;
    }
  }, [lastQuestionIdKey, gateSession]);
  const [value, setValue] = useState('');
  const [hint, setHint] = useState<string | null>(null);
  const [failures, setFailures] = useState(0);
  const [authenticating, setAuthenticating] = useState(false);

  useEffect(() => {
    if (!authenticating) return;
    const ms = reduceMotion ? 600 : 2000 + Math.floor(Math.random() * 1001);
    const id = window.setTimeout(() => {
      onPassed();
    }, ms);
    return () => window.clearTimeout(id);
  }, [authenticating, onPassed, reduceMotion]);

  const submit = () => {
    if (authenticating) return;
    setHint(null);
    if (isAnswerCorrect(question, value)) {
      setAuthenticating(true);
      return;
    }
    setFailures((n) => n + 1);
    setHint(question.hint);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit();
  };

  return (
    <div className="portfolio-login-enter fixed inset-0 z-[40]">
      <CrtMonitor powered>
        <div className="relative flex h-full w-full flex-col overflow-hidden bg-terminal-bg px-[clamp(1rem,3.6vw,3.25rem)] pb-[clamp(0.75rem,2.4vh,1.75rem)] pt-[clamp(0.75rem,2.6vh,2rem)]">
          <CodeBackdrop />

          <div className="terminal-scroll-area relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto font-mono text-[0.8125rem] leading-relaxed text-terminal-text sm:text-sm">
            {/* Bannière noyau — décor, cohérent avec la commande `specs` */}
            <pre className="whitespace-pre-wrap text-terminal-dim" aria-hidden>
              {`Portfolio Linux 1.0 (demo)  tty1
Kernel 6.8.0-portfolio on x86_64
`}
            </pre>

            <p className="mt-4 text-terminal-text">
              <span className="text-terminal-dim">portfolio</span> login:{' '}
              <span className="text-terminal-accent">{LOGIN_USER}</span>
            </p>

            <p className="mt-4 max-w-[62ch] text-terminal-text">
              <span className="text-terminal-muted">Security question —</span> {question.question}
            </p>

            <form onSubmit={onSubmit} className="mt-3 max-w-[62ch]">
              <label className="sr-only" htmlFor="gate-password">
                Password — your answer to the question above
              </label>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="shrink-0 select-none text-terminal-text" aria-hidden>
                  Password:
                </span>
                <input
                  id="gate-password"
                  type="password"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  value={value}
                  disabled={authenticating}
                  onChange={(e) => {
                    setValue(e.target.value);
                    setHint(null);
                  }}
                  className="min-w-0 flex-1 bg-transparent font-mono text-[0.8125rem] tracking-[0.25em] text-terminal-accent caret-transparent outline-none disabled:opacity-60 sm:text-sm"
                  aria-describedby={hint ? 'gate-hint' : 'gate-helper'}
                  autoFocus={!authenticating}
                />
                {!authenticating && (
                  <span
                    className="terminal-cursor-blink pointer-events-none -ml-1 inline-block h-4 w-2 shrink-0 rounded-sm bg-terminal-accent"
                    aria-hidden
                  />
                )}
              </div>

              <p id="gate-helper" className="sr-only">
                Press Enter to sign in. A wrong answer prints a hint.
              </p>

              {hint && !authenticating && (
                <p id="gate-hint" className="mt-3 text-amber-400/95" role="status">
                  <span className="text-rose-400">Login incorrect</span>
                  {failures > 1 ? ` (${failures} attempts)` : ''} — hint: {hint}
                </p>
              )}

              {authenticating && (
                <p className="mt-3 text-terminal-dim" role="status">
                  Authenticating<span aria-hidden>…</span> starting workstation session
                  <span className="sr-only">, please wait</span>
                </p>
              )}

              {/* Bouton conservé pour le tactile et le clavier ; Entrée fait la même chose. */}
              <button
                type="submit"
                disabled={authenticating || !value.trim()}
                className="mt-5 rounded border border-terminal-border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.18em] text-terminal-accent transition hover:border-terminal-accent/60 hover:bg-terminal-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent disabled:pointer-events-none disabled:opacity-40"
              >
                {authenticating ? 'Signing in…' : 'Enter ⏎'}
              </button>
            </form>
          </div>
        </div>
      </CrtMonitor>
    </div>
  );
};
