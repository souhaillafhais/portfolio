import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { CERTIFICATIONS, type Certification } from '../data/certifications';
import { EmailIcon, PhoneIcon, LinkedInIcon, LocationIcon } from './Icons';
import { usePortfolioTheme } from '../theme/portfolioThemeContext';
import {
  PORTFOLIO_THEME_IDS,
  type PortfolioThemeId,
  THEME_DESCRIPTIONS,
} from '../theme/themePalette';

const getCertificationPreviewImage = (imagePath: string) => `/assets/${imagePath}`;

interface CVViewProps {
  onLogout: () => void;
}

/* ─── Primitives partagées — une seule échelle de rayons, d’espacements et de titres ────── */

const CARD = 'rounded-lg border border-terminal-border/60 bg-terminal-surface/45';

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-terminal-muted">
          {eyebrow}
        </p>
        <h2 className="text-xl font-semibold tracking-tight" style={{ color: 'var(--term-accent)' }}>
          {title}
        </h2>
      </header>
      {children}
    </section>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span
      className="rounded-full border border-terminal-border/70 px-2.5 py-1 font-mono text-[0.7rem] leading-none"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--term-accent) 9%, transparent)',
        color: 'var(--term-accent)',
      }}
    >
      {children}
    </span>
  );
}

/** Entrée de frise : puce sur le rail vertical, puis titre, méta et détail. */
function TimelineItem({
  title,
  subtitle,
  meta,
  children,
}: {
  title: string;
  subtitle: string;
  meta: string;
  children?: ReactNode;
}) {
  return (
    <li className="relative pl-7">
      <span
        className="absolute left-0 top-[0.45rem] h-2.5 w-2.5 rounded-full ring-4"
        style={{
          backgroundColor: 'var(--term-accent)',
          // L’anneau masque le rail derrière la puce, sans dépendre d’un fond opaque.
          ['--tw-ring-color' as string]: 'var(--term-bg)',
        }}
        aria-hidden
      />
      <h3 className="text-[0.95rem] font-semibold leading-snug text-terminal-text">{title}</h3>
      <p className="mt-1 text-sm" style={{ color: 'var(--term-accent)' }}>
        {subtitle}
      </p>
      <p className="mt-0.5 font-mono text-xs text-terminal-muted">{meta}</p>
      {children ? <div className="mt-3">{children}</div> : null}
    </li>
  );
}

function Timeline({ children }: { children: ReactNode }) {
  return (
    <ol className="relative space-y-8 before:absolute before:bottom-2 before:left-[0.3rem] before:top-2 before:w-px before:bg-terminal-border/60">
      {children}
    </ol>
  );
}

/* ─── Données de présentation ───────────────────────────────────────────────────────────── */

const EXPERIENCES = [
  {
    title: 'IT Infrastructure Engineer — Intern',
    company: 'Technopure Morocco',
    period: 'Feb 2026 – May 2026',
    location: 'Casablanca',
    responsibilities: [
      'Deployed and supervised servers and systems (CPU, RAM, network, services)',
      'Monitored 50+ infrastructure components, handling incidents within agreed timeframes',
      'Configured Sage X3 ERP modules (purchasing, inventory, sales)',
    ],
  },
  {
    title: 'Cybersecurity Intern — RBAC & Access Governance',
    company: 'Maghreb Oxygene SA',
    period: 'Jul 2025 – Sep 2025',
    location: 'Casablanca',
    responsibilities: [
      'Reviewed roles and permissions on Blackboard systems',
      'Highlighted risks around critical entry points',
      'Produced security recommendations for authorization management',
    ],
  },
  {
    title: 'Summer Intern',
    company: 'Proactis',
    period: 'Jul 2024 – Aug 2024',
    location: 'Casablanca',
    responsibilities: [
      'Exposure to IT infrastructure and security controls',
      'Explored environments spanning ERP, data platforms, and networking',
    ],
  },
];

const EDUCATION = [
  {
    degree: 'Diploma in Computer Engineering (MIAGE)',
    school: 'Moroccan School of Engineering Sciences (EMSI)',
    period: 'Sep 2023 – Present',
    location: 'Casablanca',
    status: 'Final year',
  },
  {
    degree: 'Integrated Preparatory Classes',
    school: 'Moroccan School of Engineering Sciences (EMSI)',
    period: 'Sep 2021 – Jun 2023',
    location: 'Casablanca',
    status: 'Completed',
  },
  {
    degree: 'Scientific Baccalaureate — Physics & Chemistry',
    school: 'Mohammed VI Qualifying High School',
    period: '2020',
    location: 'Casablanca',
    status: 'Completed',
  },
];

const SKILL_GROUPS = [
  {
    name: 'Cybersecurity & Systems',
    skills: [
      'Windows Server (AD DS, GPO)',
      'Linux (Red Hat, Ubuntu, Kali)',
      'VMware ESXi',
      'Nmap',
      'ELK Stack',
      'Burp Suite',
      'Metasploit',
      'TCP/IP',
      'Firewalls',
      'IDS/IPS',
      'Risk Analysis',
      'IAM & RBAC',
      'Zabbix',
      'ISO 27001/27002',
      'NIST Framework',
    ],
  },
  {
    name: 'Cloud & DevOps',
    skills: [
      'AWS (EC2, S3, RDS, ELB)',
      'Azure (VNets, VMs, App Services)',
      'Oracle Cloud Infrastructure',
      'Docker',
      'Kubernetes',
      'Terraform',
      'CI/CD Pipelines',
      'GitHub Actions',
      'PowerShell',
      'Agile/Scrum',
    ],
  },
  {
    name: 'Development',
    skills: [
      'Java & Spring Boot',
      'Spring Security',
      'Python',
      'React & React Native',
      'TypeScript',
      'REST APIs',
      'Git & GitHub',
      'MySQL',
      'PostgreSQL',
      'Oracle DB',
      'SonarQube',
      'Selenium',
    ],
  },
  {
    name: 'AI & Analytics',
    skills: [
      'Machine Learning',
      'Natural Language Processing',
      'Agentic AI',
      'RAG Systems',
      'Fine-tuning',
      'Prompt Engineering',
      'Power BI',
      'Data Analysis',
      'SSIS',
    ],
  },
];

const LANGUAGES = [
  { name: 'Arabic', level: 'Native' },
  { name: 'French', level: 'Professional' },
  { name: 'English', level: 'Professional' },
];

/* ─── Vue ───────────────────────────────────────────────────────────────────────────────── */

export const CVView = ({ onLogout }: CVViewProps) => {
  const { theme, setTheme } = usePortfolioTheme();
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  const handleCertClick = useCallback((cert: Certification) => {
    setSelectedCert(cert);
  }, []);

  const handleCloseCertPopup = useCallback(() => {
    setSelectedCert(null);
  }, []);

  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const isCertOpen = selectedCert !== null;

  /* Modale : focus à l’ouverture, Échap pour fermer, focus rendu à la carte d’origine. */
  useEffect(() => {
    if (!isCertOpen) return;

    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleCloseCertPopup();
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      lastFocusedRef.current?.focus();
    };
  }, [isCertOpen, handleCloseCertPopup]);

  return (
    <div
      className="min-h-svh w-full font-sans antialiased"
      style={{ backgroundColor: 'var(--term-bg)', color: 'var(--term-text)' }}
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-14 lg:py-16">
        {/* Rail d’identité — collant sur grand écran, empilé en tête sur mobile */}
        <aside className="space-y-6 lg:sticky lg:top-12 lg:self-start">
          <div className="space-y-2">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-terminal-muted">
              Curriculum vitae
            </p>
            <h1
              className="text-2xl font-bold leading-tight tracking-tight"
              style={{ color: 'var(--term-accent)' }}
            >
              Souhail Lafhais
            </h1>
            <p className="text-sm leading-relaxed text-terminal-dim">
              MIAGE engineering · Cybersecurity, cloud &amp; AI
            </p>
          </div>

          <ul className="space-y-2.5 text-sm">
            <li className="flex items-center gap-2.5">
              <EmailIcon size={15} style={{ color: 'var(--term-accent)', flexShrink: 0 }} />
              <a
                href="mailto:souhaillafhais@gmail.com"
                className="min-w-0 break-all font-mono text-[0.78rem] text-terminal-dim hover:underline"
              >
                souhaillafhais@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <PhoneIcon size={15} style={{ color: 'var(--term-accent)', flexShrink: 0 }} />
              <a
                href="tel:+212653448375"
                className="font-mono text-[0.78rem] text-terminal-dim hover:underline"
              >
                +212 653 44 83 75
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <LinkedInIcon size={15} style={{ color: 'var(--term-accent)', flexShrink: 0 }} />
              <a
                href="https://linkedin.com/in/souhail-lafhais"
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-0 break-all font-mono text-[0.78rem] text-terminal-dim hover:underline"
              >
                souhail-lafhais
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <LocationIcon size={15} style={{ color: 'var(--term-accent)', flexShrink: 0 }} />
              <span className="font-mono text-[0.78rem] text-terminal-dim">Casablanca, Morocco</span>
            </li>
          </ul>

          <div className={`${CARD} p-4`}>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-terminal-muted">
              Languages
            </p>
            <ul className="mt-3 space-y-1.5">
              {LANGUAGES.map((lang) => (
                <li key={lang.name} className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="text-terminal-text">{lang.name}</span>
                  <span className="font-mono text-[0.7rem] text-terminal-muted">{lang.level}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={`${CARD} p-4`}>
            <label
              htmlFor="cv-theme"
              className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-terminal-muted"
            >
              Palette
            </label>
            <select
              id="cv-theme"
              value={theme}
              onChange={(event) => setTheme(event.target.value as PortfolioThemeId)}
              className="mt-3 w-full rounded-md border border-terminal-border bg-terminal-bg px-2.5 py-2 font-mono text-xs outline-none transition focus:border-terminal-accent"
              style={{ color: 'var(--term-text)' }}
            >
              {PORTFOLIO_THEME_IDS.map((themeId) => (
                <option key={themeId} value={themeId}>
                  {themeId}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs leading-snug text-terminal-muted">
              {THEME_DESCRIPTIONS[theme]}
            </p>
          </div>

          <button
            onClick={onLogout}
            className="w-full rounded-md border px-4 py-2.5 font-mono text-xs uppercase tracking-[0.18em] transition hover:bg-terminal-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent"
            style={{ borderColor: 'var(--term-accent)', color: 'var(--term-accent)' }}
          >
            ← Back to workstation
          </button>
        </aside>

        {/* Contenu principal */}
        <main className="space-y-14">
          <Section eyebrow="Profile" title="About">
            <p className="max-w-[68ch] leading-relaxed text-terminal-text">
              Final-year MIAGE engineering student at EMSI Casablanca with strong foundations in
              cybersecurity, cloud infrastructure, and artificial intelligence. Demonstrated
              expertise through internships in IT infrastructure, RBAC governance, and incident
              management. Passionate about designing secure, scalable systems with a focus on
              threat-aware architecture.
            </p>
            <div className="flex flex-wrap gap-2">
              <Chip>Secure infrastructure</Chip>
              <Chip>Cloud (AWS · Azure · OCI)</Chip>
              <Chip>Application security</Chip>
              <Chip>AI / ML</Chip>
            </div>
          </Section>

          <Section eyebrow="Experience" title="Professional experience">
            <Timeline>
              {EXPERIENCES.map((exp) => (
                <TimelineItem
                  key={exp.title}
                  title={exp.title}
                  subtitle={`${exp.company} · ${exp.location}`}
                  meta={exp.period}
                >
                  <ul className="space-y-1.5">
                    {exp.responsibilities.map((resp) => (
                      <li
                        key={resp}
                        className="relative pl-4 text-sm leading-relaxed text-terminal-dim before:absolute before:left-0 before:top-[0.6em] before:h-1 before:w-1 before:rounded-full before:bg-terminal-muted"
                      >
                        {resp}
                      </li>
                    ))}
                  </ul>
                </TimelineItem>
              ))}
            </Timeline>
          </Section>

          <Section eyebrow="Education" title="Academic background">
            <Timeline>
              {EDUCATION.map((edu) => (
                <TimelineItem
                  key={edu.degree}
                  title={edu.degree}
                  subtitle={edu.school}
                  meta={`${edu.period} · ${edu.location}`}
                >
                  <Chip>{edu.status}</Chip>
                </TimelineItem>
              ))}
            </Timeline>
          </Section>

          <Section eyebrow="Certifications" title="Credentials">
            <p className="text-sm text-terminal-dim">
              Select a certification to open its preview.
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {CERTIFICATIONS.map((cert) => (
                <li key={cert.id}>
                  <button
                    onClick={() => handleCertClick(cert)}
                    className={`${CARD} flex h-full w-full flex-col gap-2 p-4 text-left transition hover:border-terminal-accent/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent`}
                  >
                    <span className="text-sm font-semibold leading-snug text-terminal-text">
                      {cert.title}
                    </span>
                    <span className="mt-auto flex items-baseline justify-between gap-3">
                      <span className="text-xs text-terminal-muted">{cert.issuer}</span>
                      <span className="font-mono text-[0.7rem] text-terminal-dim">{cert.date}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </Section>

          <Section eyebrow="Skills" title="Tech stack">
            <div className="grid gap-6 sm:grid-cols-2">
              {SKILL_GROUPS.map((group) => (
                <div key={group.name} className={`${CARD} p-4`}>
                  <h3 className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-terminal-muted">
                    {group.name}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {group.skills.map((skill) => (
                      <Chip key={skill}>{skill}</Chip>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </main>
      </div>

      {selectedCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-8"
          onClick={handleCloseCertPopup}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cert-dialog-title"
            tabIndex={-1}
            className="flex max-h-[86vh] w-full max-w-xl flex-col overflow-hidden rounded-lg border border-terminal-border bg-terminal-surface shadow-2xl outline-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-terminal-border/70 p-5">
              <div className="min-w-0">
                <h2
                  id="cert-dialog-title"
                  className="text-base font-semibold leading-snug"
                  style={{ color: 'var(--term-accent)' }}
                >
                  {selectedCert.preview.title}
                </h2>
                <p className="mt-1 text-xs text-terminal-muted">
                  {selectedCert.issuer} · {selectedCert.date}
                </p>
              </div>
              <button
                onClick={handleCloseCertPopup}
                className="shrink-0 rounded-md border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.16em] transition hover:bg-terminal-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-accent"
                style={{ borderColor: 'var(--term-accent)', color: 'var(--term-accent)' }}
              >
                Close
              </button>
            </div>

            <div className="min-h-0 overflow-y-auto p-5">
              <div className="overflow-hidden rounded-md border border-terminal-border/50 bg-black/20">
                <img
                  src={getCertificationPreviewImage(selectedCert.preview.imagePath)}
                  alt={selectedCert.preview.title}
                  loading="lazy"
                  decoding="async"
                  className="h-[15rem] w-full object-contain"
                />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-terminal-dim">
                {selectedCert.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {selectedCert.skills.map((skill) => (
                  <Chip key={skill}>{skill}</Chip>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
