import { useEffect, useMemo, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const POOL = [
  '$ grep -r "portfolio" ~/src/',
  'sudo iptables -L -n --line-numbers',
  'chmod +x ./deploy.sh && ./deploy.sh',
  'journalctl -u nginx -n 80 --no-pager',
  'cargo build --release',
  'git rebase --onto main feature/auth-cache',
  'docker compose exec app bash -lc "migrate"',
  'const debounce = (fn: () => void, ms: number) => { /* … */ };',
  'async function fetchJSON<T>(url: string): Promise<T> { /* … */ }',
  'SELECT id, slug FROM posts WHERE visible = TRUE LIMIT 20;',
  'impl fmt::Display for Edge { fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result { Ok(()) } }',
  '[toolchain]\nchannel = "1.85"\nprofile = "minimal"',
  'kubectl get pods -A -o wide',
  'ssh -o BatchMode=yes deploy@staging "uptime"',
  'find . -type f -name "*.ts" ! -path "*/node_modules/*"',
  '#define TCP_MD5SIG_MAXKEYLEN\t80',
  'export PATH="$HOME/.cargo/bin:$PATH"',
  'python3 -m venv .venv && source .venv/bin/activate',
  'printf "%s\\\\n" "$PATH" | tr ":" "\\n"',
  '(define (fact n) (if (= n 0) 1 (* n (fact (- n 1)))))',
  '#pragma omp parallel for reduction(+:sum)',
  'echo "${PIPESTATUS[@]}"',
  '.PHONY: test lint\r\ntest:\r\n\tpnpm vitest run',
  'iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE',
  'systemctl --user status pipewire.socket',
];

type Line = {
  top: number;
  left: number;
  rotate: number;
  opacity: number;
  snippet: string;
};

function mulberry32(a: number) {
  let t = (a >>> 0) || 88587787;
  return () => {
    t += 0x6d2b79f5;
    let z = Math.imul(t ^ (t >>> 15), 1 | t);
    z ^= z + Math.imul(z ^ (z >>> 7), 61 | z);
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  };
}

function pickLines(seed: number, count = 38): Line[] {
  const rng = mulberry32(seed);
  const out: Line[] = [];
  for (let i = 0; i < count; i++) {
    out.push({
      top: rng() * 108 - 5,
      left: rng() * 106 - 3,
      rotate: rng() * 7 - 3.5,
      opacity: 0.065 + rng() * 0.058,
      snippet: POOL[(i + Math.floor(rng() * POOL.length)) % POOL.length],
    });
  }
  return out;
}

/** Texte monospace / snippets (shell & langages) en fond, très discret selon `--term-*`. */
export function CodeBackdrop() {
  const reduceMotion = usePrefersReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(() => setTick((x) => x + 1), 5200);
    return () => clearInterval(id);
  }, [reduceMotion]);

  const seed = reduceMotion ? 999017 : tick * 7919 + 524287;
  const lines = useMemo(() => pickLines(seed), [seed]);

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0 bg-[linear-gradient(160deg,var(--term-surf)_0%,transparent_42%,transparent_58%,color-mix(in_srgb,var(--term-accent)_4%,transparent)_100%)] opacity-[0.35]"
        aria-hidden
      />
      {lines.map((line, i) => (
        <span
          key={`${seed}-${i}`}
          className={`pointer-events-none absolute max-w-[min(86vw,22rem)] truncate select-none font-mono tabular-nums text-terminal-muted ${reduceMotion ? '' : 'code-backdrop-moving-line will-change-transform'}`}
          style={{
            top: `${line.top}%`,
            left: `${line.left}%`,
            ['--line-rotate' as string]: `${line.rotate}deg`,
            animationDelay: reduceMotion ? undefined : `${(i * 0.73) % 14}s`,
            ...(reduceMotion ? { transform: `rotate(${line.rotate}deg)` } : {}),
            opacity: line.opacity,
            fontSize: 'clamp(9px, 2.05vw, 11px)',
            lineHeight: 1.3,
          }}
        >
          {line.snippet.length > 92 ? `${line.snippet.slice(0, 92)}…` : line.snippet}
        </span>
      ))}
    </div>
  );
}
