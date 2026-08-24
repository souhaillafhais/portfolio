/**
 * Source unique des certifications.
 *
 * Alimente à la fois la vue CV (cartes + popup d’aperçu) et `CERTIFICATIONS_TXT`
 * (commande `certifications` / `cat certifications.txt`) — voir `content/portfolioCopy.ts`.
 * Toute nouvelle certification s’ajoute ici et nulle part ailleurs.
 *
 * `date` porte l’année : ne pas la répéter dans `title`.
 */

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  description: string;
  skills: string[];
  preview: {
    title: string;
    /** Chemin relatif à /assets/ dans le dossier public. */
    imagePath: string;
  };
}

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'oci-devops',
    title: 'Oracle Cloud Infrastructure 2025 Certified DevOps Professional',
    issuer: 'Oracle',
    date: '2025',
    credentialUrl: 'https://www.oracle.com/certifications/',
    description:
      'Advanced certification in Oracle Cloud Infrastructure DevOps practices, covering deployment automation, infrastructure as code, and continuous integration/continuous delivery pipelines.',
    skills: ['Oracle Cloud', 'DevOps', 'CI/CD', 'Infrastructure as Code', 'Docker', 'Kubernetes'],
    preview: {
      title: 'OCI DevOps Professional',
      imagePath: 'certifications/oracle-devops.jpg',
    },
  },
  {
    id: 'azure-vnet',
    title: 'Virtual Networks in Microsoft Azure',
    issuer: 'WhizLabs',
    date: '2025',
    description:
      'Specialized hands-on training in Azure virtual networking, including VNets, subnets, security groups, and advanced routing configurations.',
    skills: ['Azure', 'Networking', 'Virtual Networks', 'Network Security', 'Connectivity'],
    preview: {
      title: 'Azure Virtual Networks',
      imagePath: 'certifications/vnet.jpg',
    },
  },
  {
    id: 'penn-java-oop',
    title: 'Introduction to Java and Object-Oriented Programming',
    issuer: 'University of Pennsylvania',
    date: '2025',
    description:
      'Course focused on Java fundamentals and object-oriented programming concepts including classes, inheritance, polymorphism, and software development best practices.',
    skills: [
      'Java',
      'Object-Oriented Programming',
      'Classes & Objects',
      'Inheritance',
      'Polymorphism',
      'Software Development',
    ],
    preview: {
      title: 'Java & OOP',
      imagePath: 'certifications/java.jpg',
    },
  },
  {
    id: 'ibm-csa',
    title: 'Cybersecurity Compliance Frameworks, Standards & Regulations',
    issuer: 'IBM',
    date: '2025',
    description:
      'Comprehensive course covering major security frameworks including ISO 27001/27002, NIST, GDPR, and PCI-DSS compliance requirements.',
    skills: [
      'ISO 27001/27002',
      'NIST Framework',
      'GDPR',
      'PCI-DSS',
      'Risk Management',
      'Compliance Auditing',
    ],
    preview: {
      title: 'Cybersecurity Compliance',
      imagePath: 'certifications/cs.jpg',
    },
  },
  {
    id: 'spring-cloud-microservices',
    title: 'Advanced Spring Cloud Microservices & Deployment with Docker',
    issuer: 'Packt',
    date: '2025',
    description:
      'Advanced course covering Spring Cloud microservices architecture, containerization with Docker, service communication, deployment strategies, and scalable backend systems.',
    skills: [
      'Spring Boot',
      'Spring Cloud',
      'Microservices',
      'Docker',
      'REST APIs',
      'Backend Development',
      'Deployment',
    ],
    preview: {
      title: 'Spring Microservices',
      imagePath: 'certifications/ms.jpg',
    },
  },
  {
    id: 'ibm-containers',
    title: 'Introduction to Containers w/ Docker, Kubernetes & OpenShift',
    issuer: 'IBM',
    date: '2025',
    description:
      'Course covering containerization fundamentals, Docker, Kubernetes orchestration, and Red Hat OpenShift deployment concepts.',
    skills: ['Docker', 'Kubernetes', 'OpenShift', 'Containers', 'DevOps', 'Cloud Computing'],
    preview: {
      title: 'Containers & Kubernetes',
      imagePath: 'certifications/containers.jpg',
    },
  },
  {
    id: 'unix-workbench',
    title: 'The Unix Workbench',
    issuer: 'Johns Hopkins University',
    date: '2024',
    description:
      'Comprehensive course on Unix/Linux command line, shell scripting, version control, and development tools.',
    skills: ['Linux', 'Bash', 'Git', 'Command Line', 'Shell Scripting', 'VCS'],
    preview: {
      title: 'Unix Workbench',
      imagePath: 'certifications/unix.jpg',
    },
  },
  {
    id: 'hkust-se-design',
    title: 'Software Engineering: Design & Project Management',
    issuer: 'Hong Kong University of Science and Technology',
    date: '2024',
    description:
      'Course on software design principles, architectural patterns, and project management practices across the software development lifecycle.',
    skills: [
      'Software Design',
      'Design Patterns',
      'Software Architecture',
      'Project Management',
      'SDLC',
    ],
    preview: {
      title: 'Software Design & PM',
      imagePath: 'certifications/sd.jpg',
    },
  },
  {
    id: 'ibm-agility',
    title: 'Delivering Quality Work with Agility',
    issuer: 'IBM',
    date: '2024',
    description:
      'Professional development course on Agile methodologies, Scrum practices, and delivering value in iterative environments.',
    skills: ['Agile', 'Scrum', 'Project Management', 'Team Collaboration', 'Quality Assurance'],
    preview: {
      title: 'Agile Delivery',
      imagePath: 'certifications/agile.jpg',
    },
  },
];
