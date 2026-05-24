import { useCallback, useState, type CSSProperties } from 'react';
import { CERTIFICATIONS, type Certification } from '../data/certifications';
import {
  EmailIcon,
  PhoneIcon,
  LinkedInIcon,
  LocationIcon,
  BulletIcon,
} from './Icons';

interface CVViewProps {
  onLogout: () => void;
}

export const CVView = ({ onLogout }: CVViewProps) => {
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  const [section, setSection] = useState<
    'summary' | 'experience' | 'education' | 'certifications' | 'skills'
  >('summary');

  const handleCertClick = useCallback((cert: Certification) => {
    setSelectedCert(cert);
  }, []);

  const handleClosePreview = useCallback(() => {
    setSelectedCert(null);
  }, []);

  return (
    <div className="relative min-h-svh w-full overflow-hidden" style={{ backgroundColor: 'var(--term-bg)', color: 'var(--term-text)' }}>
      {/* Background */}
      <div className="fixed inset-0 opacity-5" style={{ backgroundColor: 'var(--term-surf)' }}>
        <div className="absolute inset-0 bg-gradient-to-br" style={{ '--tw-gradient-from': 'var(--term-accent)', '--tw-gradient-to': 'var(--term-muted)' } as CSSProperties}></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12 pb-6" style={{ borderBottomColor: 'var(--term-border)', borderBottomWidth: '1px' }}>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-wide" style={{ color: 'var(--term-accent)' }}>SOUHAIL LAFHAIS</h1>
            <p className="font-mono text-sm mt-2" style={{ color: 'var(--term-accent)' }}>
              MIAGE Engineering | Cybersecurity | Cloud & AI
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded text-sm font-mono transition-colors"
              style={{
                borderColor: 'var(--term-accent)',
                color: 'var(--term-accent)',
                borderWidth: '1px',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(67, 221, 207, 0.1)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
              }}
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 pb-4" style={{ borderBottomColor: 'var(--term-border)', borderBottomWidth: '1px' }}>
          {(['summary', 'experience', 'education', 'certifications', 'skills'] as const).map(
            (s) => (
              <button
                key={s}
                onClick={() => setSection(s)}
                className={`px-4 py-2 font-mono text-sm uppercase tracking-wide transition-colors`}
                style={{
                  color: section === s ? 'var(--term-accent)' : 'var(--term-muted)',
                  borderBottomColor: section === s ? 'var(--term-accent)' : 'transparent',
                  borderBottomWidth: section === s ? '2px' : '0px',
                  paddingBottom: section === s ? 'calc(0.5rem - 2px)' : '0.5rem',
                }}
              >
                {s}
              </button>
            ),
          )}
        </div>

        {/* Content */}
        <div className="min-h-96">
          {section === 'summary' && <SummarySection />}
          {section === 'experience' && <ExperienceSection />}
          {section === 'education' && <EducationSection />}
          {section === 'certifications' && (
            <CertificationsSection onCertClick={handleCertClick} selectedCert={selectedCert} />
          )}
          {section === 'skills' && <SkillsSection />}
        </div>
      </div>

      {/* Certification Preview Modal */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          onClick={handleClosePreview}
        >
          <div
            className="rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            style={{
              backgroundColor: 'var(--term-surf)',
              borderColor: 'var(--term-accent)',
              borderWidth: '1px',
              border: '1px solid rgba(255,255,255,0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6" style={{ borderBottomColor: 'var(--term-border)', borderBottomWidth: '1px' }}>
              <h2 className="text-xl font-bold" style={{ color: 'var(--term-accent)' }}>
                {selectedCert.preview.title}
              </h2>
              <button
                onClick={handleClosePreview}
                className="text-2xl w-8 h-8 flex items-center justify-center transition-colors"
                style={{ color: 'var(--term-muted)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--term-accent)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = 'var(--term-muted)';
                }}
              >
                ✕
              </button>
            </div>
            <div className="p-6 flex justify-center">
              <img
                src={`/src/assets/${selectedCert.preview.imagePath}`}
                alt={selectedCert.preview.title}
                className="max-w-full max-h-[60vh] rounded"
                style={{
                  objectFit: 'contain',
                }}
                onError={(e) => {
                  const img = e.currentTarget;
                  img.style.display = 'none';
                  const errorMsg = document.createElement('div');
                  errorMsg.style.color = 'var(--term-muted)';
                  errorMsg.textContent = `Image not found: ${selectedCert.preview.imagePath}. Please add the image to the assets/certifications/ folder.`;
                  img.parentElement?.appendChild(errorMsg);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function SummarySection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--term-accent)' }}>PROFILE</h2>
        <p className="leading-relaxed" style={{ color: 'var(--term-muted)' }}>
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
    </div>
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
    <div className="space-y-8">
      {experiences.map((exp, idx) => (
        <div key={idx} className="pl-6 pb-6" style={{ borderLeftColor: 'var(--term-accent)', borderLeftWidth: '2px' }}>
          <h3 className="text-xl font-bold" style={{ color: 'var(--term-accent)' }}>{exp.title}</h3>
          <p className="font-mono text-sm mt-1" style={{ color: 'var(--term-muted)' }}>
            {exp.company} · {exp.location}
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--term-muted)' }}>{exp.period}</p>
          <ul className="mt-4 space-y-2" style={{ color: 'var(--term-muted)' }}>
            {exp.responsibilities.map((resp, i) => (
              <li key={i}>• {resp}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
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
    <div className="space-y-8">
      {education.map((edu, idx) => (
        <div key={idx} className="pl-6 pb-6" style={{ borderLeftColor: 'var(--term-accent)', borderLeftWidth: '2px' }}>
          <h3 className="text-xl font-bold" style={{ color: 'var(--term-accent)' }}>{edu.degree}</h3>
          <p className="font-mono text-sm mt-1" style={{ color: 'var(--term-muted)' }}>
            {edu.school}
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--term-muted)' }}>
            {edu.period} · {edu.location}
          </p>
          <div className="mt-3">
            <span className="inline-block px-3 py-1 text-xs font-mono rounded" style={{
              backgroundColor: 'rgba(67, 221, 207, 0.1)',
              color: 'var(--term-accent)',
              borderWidth: '0px',
            }}>
              {edu.status}
            </span>
          </div>
        </div>
      ))}
    </div>
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
    <div className="space-y-4">
      <p className="mb-6" style={{ color: 'var(--term-muted)' }}>
        Click any certification to view detailed credentials and competencies
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CERTIFICATIONS.map((cert) => (
          <button
            key={cert.id}
            onClick={() => onCertClick(cert)}
            className="p-4 rounded text-left transition-all hover:scale-105"
            style={{
              borderWidth: selectedCert?.id === cert.id ? '2px' : '2px',
              borderColor: selectedCert?.id === cert.id ? 'var(--term-accent)' : 'var(--term-border)',
              backgroundColor: selectedCert?.id === cert.id ? 'rgba(67, 221, 207, 0.05)' : 'transparent',
            }}
          >
            <h3 className="font-bold text-sm" style={{ color: 'var(--term-accent)' }}>{cert.title}</h3>
            <p className="text-xs mt-2" style={{ color: 'var(--term-muted)' }}>{cert.issuer}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--term-dim)' }}>{cert.date}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {cert.skills.slice(0, 3).map((skill, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 rounded"
                  style={{
                    backgroundColor: 'rgba(122, 174, 138, 0.1)',
                    color: 'var(--term-muted)',
                  }}
                >
                  {skill}
                </span>
              ))}
              {cert.skills.length > 3 && (
                <span
                  className="text-xs px-2 py-1 rounded"
                  style={{
                    backgroundColor: 'rgba(122, 174, 138, 0.1)',
                    color: 'var(--term-muted)',
                  }}
                >
                  +{cert.skills.length - 3}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {skillCategories.map((category, idx) => (
        <div key={idx}>
          <h3 className="font-mono text-sm uppercase font-bold mb-4" style={{ color: 'var(--term-accent)' }}>
            {category.name}
          </h3>
          <div className="flex flex-wrap gap-3">
            {category.skills.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 text-xs font-mono rounded"
                style={{
                  backgroundColor: 'rgba(67, 221, 207, 0.1)',
                  color: 'var(--term-accent)',
                  borderColor: 'var(--term-accent)',
                  borderWidth: '1px',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

