import { LINKEDIN_PROFILE_URL } from '../constants/socialLinks';
import { CERTIFICATIONS } from '../data/certifications';

/**
 * Canonical portfolio copy — Souhail Lafhais (English).
 * Synced with virtual files under ~/ and ~/projects/
 */

export const ABOUT_TXT = `================================================================================
  ABOUT.TXT                         Souhail Lafhais / portfolio-shell
================================================================================

PROFILE
  Final-year MIAGE engineering student at EMSI Casablanca (Moroccan School of
  Engineering Sciences). I am passionate about software engineering,
  cybersecurity, and artificial intelligence, with strong foundations in
  information systems, IT security, analysis, and adaptability.

FOCUS AREAS
  Secure infrastructure and operations | Application delivery | Threat-aware
  design | Data-driven decision-making | Continuous learning across security,
  cloud, and AI/ML.

HOW TO EXPLORE THIS TERMINAL
  Builtin commands (same content as ~/ text files):  experience  education
  certifications  (or  certs )  interests  contact  skills  about
  Files on disk (simulated): run  ls   then   cat experience.txt , etc.

Tip: 'help' lists every command | 'cd projects' + 'ls' for project cards.
`;

export const SKILLS_TXT = `================================================================================
  SKILLS.TXT                        capability matrix
================================================================================

CYBERSECURITY, SYSTEMS & NETWORKING
  Windows Server (AD DS, GPO) | Linux (Red Hat, Ubuntu, Kali) | VMware ESXi
  Nmap | ELK stack | Burp Suite | Metasploit | TCP/IP | Firewalls | IDS/IPS
  Risk analysis | IAM | RBAC | AWS | Azure (fundamentals) | PowerShell
  Zabbix | ISO 27001 / 27002 & NIST (working knowledge)

DEVELOPMENT & FRAMEWORKS
  Java, Spring Boot, Spring Security | Python | React / React Native (basics)
  REST APIs | Docker | Git / GitHub | SonarQube | Selenium | SSIS
  MySQL | PostgreSQL | Oracle (DBA-oriented practice) | Power BI | Excel
  Sage X3 | Agile (Scrum)

AI & MACHINE LEARNING
  Machine learning | NLP | Agentic AI | RAG | Automation | Fine-tuning
  Prompt engineering

INTERPERSONAL
  Adaptability | Continuous learning | Team spirit | Analysis | Problem-solving
`;

export const EXPERIENCE_TXT = `================================================================================
  EXPERIENCE.TXT                    professional timeline
================================================================================

IT INFRASTRUCTURE ENGINEER — INTERN
  Technopure Morocco · Casablanca · Feb 2026 – May 2026

  • Deployed and supervised servers and systems (CPU, RAM, network, services)
    to support availability and performance targets.
  • Monitored 50+ infrastructure components and handled incidents within agreed
    timeframes.
  • Configured Sage X3 ERP modules (purchasing, inventory, sales) to support
    daily operations.

CYBERSECURITY INTERN — RBAC & ACCESS GOVERNANCE
  Maghreb Oxygene SA · Casablanca · Jul 2025 – Sep 2025

  • Reviewed roles and permissions on Blackboard; highlighted risks around
    critical entry points.
  • Produced recommendations to strengthen security and authorization management.

SUMMER INTERN
  Proactis · Casablanca · Jul 2024 – Aug 2024

  • Exposure to IT infrastructure and security controls.
  • Explored environments spanning ERP, data platforms, and networking.
`;

export const EDUCATION_TXT = `================================================================================
  EDUCATION.TXT                     academic path
================================================================================

DIPLOMA IN COMPUTER ENGINEERING (IN PROGRESS)
  Moroccan School of Engineering Sciences (EMSI)
  Sep 2023 – Present · Casablanca

INTEGRATED PREPARATORY CLASSES
  Moroccan School of Engineering Sciences (EMSI)
  Sep 2021 – Jun 2023 · Casablanca

SCIENTIFIC BACCALAUREATE — PHYSICS & CHEMISTRY
  Mohammed VI Qualifying High School
  2020 · Casablanca
`;

/** Largeur du cadre ASCII ci-dessus ; au-delà, l’organisme passe à la ligne suivante. */
const CERT_LINE_WIDTH = 80;

/** Généré depuis `data/certifications.ts` pour que le terminal et le CV ne divergent jamais. */
const CERTIFICATION_LINES = CERTIFICATIONS.map((cert) => {
  const head = `  • ${cert.title} (${cert.date})`;
  const tail = ` — ${cert.issuer}`;
  return head.length + tail.length <= CERT_LINE_WIDTH ? head + tail : `${head}\n    — ${cert.issuer}`;
}).join('\n');

export const CERTIFICATIONS_TXT = `================================================================================
  CERTIFICATIONS.TXT                credentials
================================================================================

${CERTIFICATION_LINES}
`;

export const INTERESTS_TXT = `================================================================================
  INTERESTS.TXT                     beyond the keyboard
================================================================================

TEAM SPORTS
  Regular basketball and football — teamwork, strategy, and resilience.

VOLUNTEERING — ROTARACT
  Managed budgets, tracked spending, and supported financial coordination for
  social projects; helped organize community events end-to-end.
`;

export const CONTACT_TXT = `================================================================================
  CONTACT.TXT                       reach Souhail
================================================================================

Phone       +212 653 44 83 75

Email       souhaillafhais@gmail.com

LinkedIn    ${LINKEDIN_PROFILE_URL}
            (profile: souhail-lafhais)

LANGUAGES
  Arabic    Native
  French    Professional working proficiency
  English   Professional working proficiency
`;

export const PROJECT1_TXT = `================================================================================
  PROJECT_01.TXT                    IT monitoring & incident management
================================================================================

Context     Technopure Morocco · Mar 2026 – Apr 2026

Stack       Zabbix · GLPI · VMware ESXi · Ubuntu

Summary
  Designed and deployed a platform for IT infrastructure monitoring and
  incident management with real-time visibility into health and tickets.

Outcomes
  • Faster incident detection through continuous monitoring and automated alerts.
  • Lower mean time to respond/recover (MTTR), reducing downtime.
  • Centralized view of infrastructure performance and incident lifecycle.
`;

export const PROJECT2_TXT = `================================================================================
  PROJECT_02.TXT                    SOC & intrusion detection (academic)
================================================================================

Context     EMSI Casablanca · Oct 2025 – Dec 2025

Stack       Wazuh · ELK Stack · Suricata · Metasploit

Summary
  Built a SOC-style monitoring workflow with log collection, intrusion detection,
  and near-real-time incident analysis to harden the assessed environment.

Highlights
  • Correlation-friendly logging pipeline.
  • IDS-aligned alerting and hands-on validation with security tooling.
`;

export const PROJECT3_TXT = `================================================================================
  PROJECT_03.TXT                    Scalable cloud app & CI/CD
================================================================================

Context     Jun 2025

Stack       AWS (EC2, S3, RDS, ELB) · Docker · Kubernetes · GitHub Actions

Summary
  Delivered a scalable cloud deployment using containers, orchestration, and a
  CI/CD pipeline to improve availability and release automation.

Highlights
  • Repeatable builds and staged promotions toward production-like targets.
  • Infra primitives mapped to resilient, horizontally scalable patterns.
`;

export const PROJECT4_TXT = `================================================================================
  PROJECT_04.TXT                    AcciTrack — mobile incident reporting
================================================================================

Context     EMSI Casablanca · Feb 2025 – May 2025

Stack       Spring Boot · React Native · MySQL

Summary
  Mobile application to digitize accident reports with structured capture and
  AI-assisted generation of report content.

Highlights
  • End-to-end flow from field capture to persisted records.
  • Integrated intelligence layer to accelerate consistent documentation.
`;
