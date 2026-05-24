import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
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

/** Page login épurée : photo en haut de la zone de question, mot de passe, bouton — sans carte ni cadre. */
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
    setHint(question.hint);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit();
  };

  return (
    <div
      className="portfolio-login-enter relative z-[40] flex min-h-svh flex-col items-center justify-center bg-terminal-bg px-6 py-10 font-[system-ui,'Segoe_UI',Roboto,'Helvetica_Neue',sans-serif]"
      style={{
        paddingLeft: 'max(1.5rem, env(safe-area-inset-left))',
        paddingRight: 'max(1.5rem, env(safe-area-inset-right))',
        paddingTop: 'max(1.5rem, env(safe-area-inset-top))',
        paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
      }}
    >
      <div
        className={`flex w-full max-w-[22rem] flex-col items-center ${authenticating ? 'pointer-events-none' : ''}`}
        aria-busy={authenticating}
      >
        <div className="mb-8 mt-20 flex items-center justify-center" />

        <p
          className={`w-full text-center text-sm leading-relaxed text-terminal-dim transition-opacity duration-300 ${authenticating ? 'pointer-events-none opacity-35' : ''}`}
        >
          {question.question}
        </p>

        <form
          onSubmit={onSubmit}
          className={`mt-8 w-full space-y-4 transition-opacity duration-300 ${authenticating ? 'opacity-90' : ''}`}
        >
          <label className="sr-only" htmlFor="gate-password">
            Password — your answer to the question above
          </label>
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
            className="h-11 w-full min-w-0 rounded-md bg-terminal-bg/40 px-3.5 text-[15px] text-terminal-text outline-none ring-1 ring-terminal-border/60 transition placeholder:text-terminal-muted/65 focus:bg-terminal-bg/60 focus:ring-terminal-accent/40 disabled:cursor-not-allowed disabled:opacity-70"
            placeholder="Password"
            aria-describedby={hint ? 'gate-hint' : 'gate-helper'}
            autoFocus={!authenticating}
          />

          <p id="gate-helper" className="hidden" aria-live="polite">
            Wrong answers show an optional hint.
          </p>

          {hint && !authenticating && (
            <p id="gate-hint" className="text-center text-sm text-amber-500/95" role="status">
              Hint: {hint}
            </p>
          )}

          <button
            type="submit"
            disabled={authenticating || !value.trim()}
            className="flex h-11 w-full items-center justify-center gap-2.5 rounded-md bg-terminal-accent/15 text-sm font-semibold text-terminal-accent transition hover:bg-terminal-accent/22 active:opacity-95 disabled:pointer-events-none disabled:opacity-50"
            aria-label={authenticating ? 'Connexion en cours' : 'Sign in'}
          >
            {authenticating ? (
              <>
                <span
                  className={`inline-block h-[1.125rem] w-[1.125rem] shrink-0 rounded-full border-2 border-terminal-accent/35 border-t-terminal-accent ${reduceMotion ? '' : 'animate-spin'}`}
                  aria-hidden
                />
                <span>Signing in…</span>
                <span className="sr-only">Chargement</span>
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
