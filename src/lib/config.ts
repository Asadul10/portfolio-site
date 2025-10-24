export const siteConfig = {
  name: 'Asadul Islam Arif',
  tagline: 'Cybersecurity & Full-Stack Engineer',
  description: 'Portfolio showcasing cybersecurity projects, full-stack development, and technical expertise.',
  url: 'https://asadul.dev',
  ogImage: 'https://asadul.dev/og-image.jpg',
  links: {
    github: 'https://github.com/asadul',
    linkedin: 'https://linkedin.com/in/asadul',
    email: 'mailto:asadul@example.com',
    twitter: 'https://twitter.com/asadul',
  },
  social: {
    github: 'asadul',
    linkedin: 'asadul',
    twitter: 'asadul',
    email: 'asadul@example.com',
  },
  palette: 'slate-indigo' as 'slate-indigo' | 'zinc-emerald' | 'neutral-violet',
  paletteConfig: {
    'slate-indigo': {
      primary: 'slate',
      accent: 'indigo',
    },
    'zinc-emerald': {
      primary: 'zinc',
      accent: 'emerald',
    },
    'neutral-violet': {
      primary: 'neutral',
      accent: 'violet',
    },
  },
  projectCategories: [
    'Web Apps',
    'Cybersecurity Labs',
    'Networking',
    'Data/ML',
    'Other',
  ] as const,
  skills: {
    'Cybersecurity': ['Penetration Testing', 'Vulnerability Assessment', 'Security Architecture', 'Incident Response', 'Threat Modeling'],
    'Frontend': ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    'Backend': ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Redis'],
    'DevOps': ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform'],
    'Networking': ['Cisco', 'Firewall Configuration', 'Network Security', 'VPN', 'Load Balancing'],
    'Data/ML': ['Python', 'TensorFlow', 'Pandas', 'NumPy', 'Jupyter'],
  },
  timeline: [
    {
      year: '2024',
      title: 'Senior Security Engineer',
      company: 'TechCorp',
      description: 'Led security initiatives and vulnerability assessments for enterprise applications.',
    },
    {
      year: '2022',
      title: 'Full-Stack Developer',
      company: 'StartupXYZ',
      description: 'Built scalable web applications using React, Node.js, and cloud infrastructure.',
    },
    {
      year: '2020',
      title: 'Cybersecurity Analyst',
      company: 'SecurityFirm',
      description: 'Conducted penetration testing and security audits for various clients.',
    },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
export type ProjectCategory = typeof siteConfig.projectCategories[number];
