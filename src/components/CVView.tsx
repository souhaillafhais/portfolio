import { useCallback, useState, type CSSProperties } from 'react';
import { CERTIFICATIONS, type Certification } from '../data/certifications';
import {
  EmailIcon,
  PhoneIcon,
  LinkedInIcon,
  LocationIcon,
  BulletIcon,
} from './Icons';
import { usePortfolioTheme } from '../theme/portfolioTheme';
import {
  PORTFOLIO_THEME_IDS,
  type PortfolioThemeId,
  THEME_DESCRIPTIONS,
} from '../theme/themePalette';

const getCertificationPreviewImage = (imagePath: string) => `/assets/${imagePath}`;

interface CVViewProps {
  onLogout: () => void;
}

export const CVView = ({ onLogout }: CVViewProps) => {
  const { theme, setTheme } = usePortfolioTheme();
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  const handleCertClick = useCallback((cert: Certification) => {
    setSelectedCert(cert);
  }, []);

  const handleCloseCertPopup = useCallback(() => {
    setSelectedCert(null);
  }, []);

  return (
    <div className="relative min-h-svh w-full overflow-hidden font-sans antialiased text-base leading-7" style={{ backgroundColor: 'var(--term-bg)', color: 'var(--term-text)' }}>
      {/* Background */}
      <div className="fixed inset-0 opacity-5" style={{ backgroundColor: 'var(--term-surf)' }}>
        <div className="absolute inset-0 bg-gradient-to-br" style={{ '--tw-gradient-from': 'var(--term-accent)', '--tw-gradient-to': 'var(--term-muted)' } as CSSProperties}></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:pr-[8rem] py-8">
        {/* Header with Navigation */}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] mb-12 pb-6" style={{ borderBottomColor: 'var(--term-border)', borderBottomWidth: '1px' }}>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.26em] font-mono text-terminal-muted">Curriculum Vitae</p>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-wide" style={{ color: 'var(--term-accent)' }}>
                SOUHAIL LAFHAIS
              </h1>
              <p className="font-mono text-sm mt-2" style={{ color: 'var(--term-accent)' }}>
                MIAGE Engineering | Cybersecurity | Cloud & AI
              </p>
            </div>

            <div className="rounded-3xl border border-terminal-border/60 bg-terminal-surface/90 p-5 shadow-lg shadow-black/10">
              <h2 className="text-xl font-semibold" style={{ color: 'var(--term-accent)' }}>
                Résumé professionnel
              </h2>
              <p className="text-sm leading-relaxed mt-3" style={{ color: 'var(--term-muted)' }}>
                Ingénieur MIAGE avec spécialisation cybersécurité, cloud et automatisation. J'apporte une expertise dans l'architecture sécurisée, la gouvernance RBAC et les déploiements scalable.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-terminal-border/70 px-3 py-1 text-xs font-mono uppercase tracking-[0.2em]" style={{ color: 'var(--term-accent)' }}>
                  Cybersecurity
                </span>
                <span className="rounded-full border border-terminal-border/70 px-3 py-1 text-xs font-mono uppercase tracking-[0.2em]" style={{ color: 'var(--term-accent)' }}>
                  Cloud
                </span>
                <span className="rounded-full border border-terminal-border/70 px-3 py-1 text-xs font-mono uppercase tracking-[0.2em]" style={{ color: 'var(--term-accent)' }}>
                  AI
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-4xl border border-terminal-border/60 bg-terminal-surface/90 p-5 shadow-lg shadow-black/10">
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.32em] text-terminal-muted">Thèmes</p>
                  <p className="text-sm font-semibold mt-1" style={{ color: 'var(--term-accent)' }}>
                    Menu des styles
                  </p>
                </div>
                <select
                  value={theme}
                  onChange={(event) => setTheme(event.target.value as PortfolioThemeId)}
                  className="w-full rounded-2xl border border-terminal-border bg-terminal-bg px-3 py-2 text-sm text-terminal-text outline-none transition focus:border-terminal-accent"
                  style={{ color: 'var(--term-text)' }}
                >
                  {PORTFOLIO_THEME_IDS.map((themeId) => (
                    <option key={themeId} value={themeId}>
                      {themeId}
                    </option>
                  ))}
                </select>
                <p className="text-xs leading-snug" style={{ color: 'var(--term-muted)' }}>
                  {THEME_DESCRIPTIONS[theme]}
                </p>
              </div>
            </div>

            <div className="flex justify-end lg:justify-start">
              <button
                onClick={onLogout}
                className="rounded-full border px-5 py-2 text-sm font-mono transition-colors"
                style={{
                  borderColor: 'var(--term-accent)',
                  color: 'var(--term-accent)',
                  borderWidth: '1px',
                }}
              >
                Retour workstation
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-16">
          <SummarySection />
          <ExperienceSection />
          <EducationSection />
          <CertificationsSection onCertClick={handleCertClick} selectedCert={selectedCert} />
          <SkillsSection />
        </div>
      </div>

      {selectedCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8"
          onClick={handleCloseCertPopup}
        >
          <div
            className="w-full max-w-xl max-h-[85vh] overflow-hidden rounded-[2.5rem] border border-terminal-border/70 bg-terminal-surface/96 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-4 p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: 'var(--term-accent)' }}>
                    {selectedCert.preview.title}
                  </h2>
                  <p className="text-sm mt-2" style={{ color: 'var(--term-muted)' }}>
                    {selectedCert.issuer} · {selectedCert.date}
                  </p>
                </div>
                <button
                  onClick={handleCloseCertPopup}
                  className="rounded-full border border-terminal-border px-4 py-2 text-sm font-mono transition-colors"
                  style={{
                    borderColor: 'var(--term-accent)',
                    color: 'var(--term-accent)',
                    borderWidth: '1px',
                  }}
                >
                  Fermer
                </button>
              </div>
              <div className="border-t border-terminal-border/70 pt-5">
                <div className="mb-5 overflow-hidden rounded-[1.75rem] bg-black/5">
                  <img
                    src={getCertificationPreviewImage(selectedCert.preview.imagePath)}
                    alt={selectedCert.preview.title}
                    className="h-[16rem] w-full object-contain"
                  />
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--term-muted)' }}>
                  {selectedCert.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedCert.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="rounded-full border border-terminal-border px-3 py-1 text-xs font-mono"
                      style={{ color: 'var(--term-accent)' }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function SummarySection() {
  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-terminal-border/60 bg-terminal-surface/90 p-6 shadow-lg shadow-black/10" style={{ backgroundColor: 'color-mix(in srgb, var(--term-bg) 92%, var(--term-surf) 8%)' }}>
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.26em] font-mono text-terminal-muted">Profil</p>
          <h2 className="text-2xl font-bold mt-2" style={{ color: 'var(--term-accent)' }}>A propos</h2>
        </div>
        <p className="text-base leading-relaxed" style={{ color: 'var(--term-text)' }}>
          Final-year MIAGE engineering student at EMSI Casablanca with strong foundations in
          cybersecurity, cloud infrastructure, and artificial intelligence. Demonstrated expertise
          through internships in IT infrastructure, RBAC governance, and incident management.
          Passionate about designing secure, scalable systems with focus on threat-aware
          architecture.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h3 className="font-mono text-sm uppercase mb-3" style={{ color: 'var(--term-accent)' }}>Key Focus Areas</h3>
          <ul className="space-y-2" style={{ color: 'var(--term-muted)' }}>
            <li className="flex items-start gap-2">
              <BulletIcon size={16} style={{ color: 'var(--term-accent)', marginTop: '4px', flexShrink: 0 }} />
              <span>Secure Infrastructure & Operations</span>
            </li>
            <li className="flex items-start gap-2">
              <BulletIcon size={16} style={{ color: 'var(--term-accent)', marginTop: '4px', flexShrink: 0 }} />
              <span>Cloud Platforms (AWS, Azure, OCI)</span>
            </li>
            <li className="flex items-start gap-2">
              <BulletIcon size={16} style={{ color: 'var(--term-accent)', marginTop: '4px', flexShrink: 0 }} />
              <span>Application Security & DevOps</span>
            </li>
            <li className="flex items-start gap-2">
              <BulletIcon size={16} style={{ color: 'var(--term-accent)', marginTop: '4px', flexShrink: 0 }} />
              <span>AI/ML & Data-Driven Solutions</span>
            </li>
            <li className="flex items-start gap-2">
              <BulletIcon size={16} style={{ color: 'var(--term-accent)', marginTop: '4px', flexShrink: 0 }} />
              <span>Continuous Learning & Adaptation</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-sm uppercase mb-3" style={{ color: 'var(--term-accent)' }}>Contact</h3>
          <ul className="space-y-2 font-mono text-sm" style={{ color: 'var(--term-muted)' }}>
            <li className="flex items-center gap-3">
              <EmailIcon size={18} style={{ color: 'var(--term-accent)' }} />
              <span>souhaillafhais@gmail.com</span>
            </li>
            <li className="flex items-center gap-3">
              <PhoneIcon size={18} style={{ color: 'var(--term-accent)' }} />
              <span>+212 653 44 83 75</span>
            </li>
            <li className="flex items-center gap-3">
              <LinkedInIcon size={18} style={{ color: 'var(--term-accent)' }} />
              <a
                href="https://linkedin.com/in/souhail-lafhais"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: 'var(--term-accent)' }}
              >
                linkedin.com/in/souhail-lafhais
              </a>
            </li>
            <li className="flex items-center gap-3">
              <LocationIcon size={18} style={{ color: 'var(--term-accent)' }} />
              <span>Casablanca, Morocco</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function ExperienceSection() {
  const experiences = [
    {
      title: 'IT Infrastructure Engineer — Intern',
      company: 'Technopure Morocco',
      period: 'Feb 2026 – May 2026',
      location: 'Casablanca',
      responsibilities: [
        'Deployed and supervised servers and systems (CPU, RAM, network, services)',
        'Monitored 50+ infrastructure components handling SLA-aligned incidents',
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

  return (
    <section className="space-y-8">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.26em] font-mono text-terminal-muted">Experience</p>
        <h2 className="text-2xl font-bold mt-2" style={{ color: 'var(--term-accent)' }}>Expériences professionnelles</h2>
      </div>

      <div className="space-y-8">
        {experiences.map((exp, idx) => (
          <div key={idx} className="rounded-3xl border border-terminal-border/50 bg-terminal-surface/85 p-6" style={{ borderLeftColor: 'var(--term-accent)', borderLeftWidth: '3px' }}>
            <h3 className="text-xl font-semibold" style={{ color: 'var(--term-accent)' }}>{exp.title}</h3>
            <p className="text-sm mt-2 font-sans" style={{ color: 'var(--term-text)' }}>
              {exp.company} · {exp.location}
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--term-muted)' }}>{exp.period}</p>
            <ul className="mt-4 space-y-2" style={{ color: 'var(--term-text)' }}>
              {exp.responsibilities.map((resp, i) => (
                <li key={i} className="text-sm">• {resp}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function EducationSection() {
  const education = [
    {
      degree: 'Diploma in Computer Engineering (MIAGE)',
      school: 'Moroccan School of Engineering Sciences (EMSI)',
      period: 'Sep 2023 – Present',
      location: 'Casablanca',
      status: 'Final Year',
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

  return (
    <section className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.26em] font-mono text-terminal-muted">Formation</p>
        <h2 className="text-2xl font-bold mt-2" style={{ color: 'var(--term-accent)' }}>Éducation</h2>
      </div>
      <div className="space-y-8">
        {education.map((edu, idx) => (
          <div key={idx} className="rounded-3xl border border-terminal-border/50 bg-terminal-surface/85 p-6" style={{ borderLeftColor: 'var(--term-accent)', borderLeftWidth: '3px' }}>
            <h3 className="text-xl font-semibold" style={{ color: 'var(--term-accent)' }}>{edu.degree}</h3>
            <p className="text-sm mt-2 font-sans" style={{ color: 'var(--term-text)' }}>
              {edu.school}
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--term-muted)' }}>
              {edu.period} · {edu.location}
            </p>
            <div className="mt-3">
              <span className="inline-block px-3 py-1 text-xs font-mono rounded" style={{
                backgroundColor: 'rgba(67, 221, 207, 0.12)',
                color: 'var(--term-accent)',
                borderWidth: '0px',
              }}>
                {edu.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CertificationsSection({
  onCertClick,
  selectedCert,
}: {
  onCertClick: (cert: Certification) => void;
  selectedCert: Certification | null;
}) {
  return (
    <section className="space-y-4">
      <div>
        <p className="text-xs uppercase tracking-[0.26em] font-mono text-terminal-muted">Certifications</p>
        <h2 className="text-2xl font-bold mt-2" style={{ color: 'var(--term-accent)' }}>Validations & badges</h2>
      </div>
      <p className="mb-6 text-base" style={{ color: 'var(--term-text)' }}>
        Cliquez sur une certification pour ouvrir son aperçu dans une popup.
      </p>

      <div className="grid grid-cols-1 gap-4">
        {CERTIFICATIONS.map((cert) => (
          <button
            key={cert.id}
            onClick={() => onCertClick(cert)}
            className="w-full rounded-3xl border p-5 text-left transition-all hover:-translate-y-0.5"
            style={{
              borderColor: selectedCert?.id === cert.id ? 'var(--term-accent)' : 'var(--term-border)',
              backgroundColor: selectedCert?.id === cert.id ? 'rgba(67, 221, 207, 0.08)' : 'transparent',
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-sm" style={{ color: 'var(--term-accent)' }}>
                  {cert.title}
                </h3>
                <p className="text-xs mt-2" style={{ color: 'var(--term-muted)' }}>
                  {cert.issuer}
                </p>
              </div>
              <span className="rounded-full border border-terminal-border px-3 py-1 text-xs font-mono uppercase tracking-[0.2em]" style={{ color: 'var(--term-accent)' }}>
                Preview
              </span>
            </div>
            <p className="text-xs mt-3" style={{ color: 'var(--term-dim)' }}>
              {cert.date}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}

function SkillsSection() {
  const skillCategories = [
    {
      name: 'CYBERSECURITY & SYSTEMS',
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
      name: 'CLOUD & DEVOPS',
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
      name: 'DEVELOPMENT',
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
      name: 'AI & ANALYTICS',
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

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.26em] font-mono text-terminal-muted">Compétences</p>
        <h2 className="text-2xl font-bold mt-2" style={{ color: 'var(--term-accent)' }}>Tech stack</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {skillCategories.map((category, idx) => (
          <div key={idx} className="rounded-3xl border border-terminal-border/60 bg-terminal-surface/90 p-6" style={{ backgroundColor: 'color-mix(in srgb, var(--term-bg) 92%, var(--term-surf) 8%)' }}>
            <h3 className="text-sm uppercase font-semibold mb-4" style={{ color: 'var(--term-accent)' }}>
              {category.name}
            </h3>
            <div className="flex flex-wrap gap-3">
              {category.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs rounded"
                  style={{
                    backgroundColor: 'rgba(67, 221, 207, 0.12)',
                    color: 'var(--term-accent)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

