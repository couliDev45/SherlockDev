import { Project, SkillCategory, TimelineEvent, SiteAssets, UserProfile } from '../types';

export const DEFAULT_ASSETS: SiteAssets = {
  logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD31qO4ImkqBy9-UzN4y7OFBNG_3nwT6zXFQVo5gNktCGeYeDxLIo18IRlwLp40_NpSKedZCZSymvoBsRAfnvMpws8feLFEvgcqsVa_49CSGNuBjx5VxCk7EDrIds5Nq8OASMMVJpfWfVcJ6y0uX-TKmCw2D-u1lFRF5JVT86xfQAB3N4QeHa14wx9R9sG3YxmQxmiFT32e9k3bQZkvsrsLVRk--sFfla0TTO-5y_vSOiDXD5fJvzdA',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvgylQzP5U5m2JInSmdAKxaMqetuC3wobYyqlOoz-16f9kH-F9losK3cgZGZnQNYSGS1379jgXyHaQRsxcp2RooEp9oBg9gaE2n0YTTPnM2Xg14PdAk0Wi6sGdroaHiUVrUae2MQDO6Ma2dLWmI70J9LUwlzQe5I1ky0x-9ERepK5xNht7Q5cyyIX4avgW-zCD0ltSuVA4VUfH9OwqSIGWjc9qaAVb8-eix9v6AvBdyvXjw0gvfx_V',
  mapParis: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUZ2p-6OX3K9AYipmE_6_wjj7KahmpuCNnc2I0f2XcX1W6lxfMDi2SHnF2CJc3M1OTLaehf4wPrRqzEGA1hLUa3zxzGlvpYAqPJrGk-pvKaXzHyt7K3eB550SstDMRkvQRnYScHbU-gglTkiNCWvxE7uRKtsRNIz8DTBQ5KGIRhx3yhpY3WjwE3oGLWa2RPegYJXkFlUtWZBtSVC3RsxpvM1fZoUMkeS95fQOnIiktm3j6SlmvJzFN',
  cvUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  cvFileName: 'CV_CouliDev.pdf',
};

export const DEFAULT_PROFILE: UserProfile = {
  name: 'CouliDev',
  title: 'Développeur Web Full-Stack Junior',
  subtitle: 'Spécialisé en React, Node.js et TypeScript',
  bio: "Passionné par le développement web et les nouvelles technologies, j'ai suivi une formation certifiante en développement web full-stack. Curieux, rigoureux et autonome, je conçois des applications modernes, dynamiques et faciles à maintenir.",
  shortBio: 'Développeur Junior Full-Stack & Passionné UI/UX',
  email: 'lucas.zheng.dev@gmail.com',
  location: 'Paris, France',
  status: 'Disponible immédiatement (CDI / Alternance / Freelance)',
  githubUrl: 'https://github.com/lucas-zheng',
  linkedinUrl: 'https://linkedin.com/in/lucas-zheng-dev',
};

export const DEFAULT_SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend',
    icon: 'Layout',
    description: "Création d'interfaces utilisateur modernes et réactives.",
    colorClass: 'text-[#00658e]',
    skills: [
      { name: 'React', level: 'NOTIONS', percentage: 43 },
      { name: 'TypeScript', level: 'NOTIONS', percentage: 40 },
      { name: 'Next.js', level: 'NOTIONS', percentage: 38 },
      { name: 'HTML5 / CSS3 / JS', level: 'MAÎTRISÉ', percentage: 90 },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    icon: 'Server',
    description: "Développement d'APIs RESTful et logique serveur.",
    colorClass: 'text-[#006491]',
    skills: [
      { name: 'Node.js / Express', level: 'NOTIONS', percentage: 40 },
      { name: 'API REST', level: 'NOTIONS', percentage: 43 },
      { name: 'PostgreSQL', level: 'NOTIONS', percentage: 38 },
      { name: 'Python', level: 'NOTIONS', percentage: 33 },
    ],
  },
  {
    id: 'donnees',
    title: 'Données',
    icon: 'Database',
    description: 'Modélisation et gestion de bases de données.',
    colorClass: 'text-[#4c6269]',
    skills: [
      { name: 'PostgreSQL / SQL', level: 'NOTIONS', percentage: 39 },
      { name: 'Prisma ORM', level: 'NOTIONS', percentage: 40 },
      { name: 'MongoDB', level: 'NOTIONS', percentage: 34 },
    ],
  },
  {
    id: 'outils',
    title: 'Outils & Méthodes',
    icon: 'Wrench',
    description: 'Environnement de travail et outils collaboratifs.',
    colorClass: 'text-[#7B8FA3]',
    skills: [],
    badges: ['Git', 'GitHub', 'VS Code', 'Figma', 'Vite', 'TailwindCSS', 'Postman', 'Docker (Bases)'],
  },
];

export const DEFAULT_PROJECTS: Project[] = [];

export const DEFAULT_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: '2024',
    title: 'Développement Web Full-Stack & Projets Pratiques',
    description:
      'Réalisation d’applications web réactives avec React, TypeScript et Node.js. Intégration de bonnes pratiques de développement (Clean Code, Git Flow, API REST).',
    tags: ['React', 'TypeScript', 'Node.js', 'TailwindCSS'],
    align: 'left',
    badgeColor: 'bg-[#c7e7ff] text-[#00658e]',
  },
  {
    year: '2022',
    title: 'Découverte du Code & Auto-formation',
    description:
      'Apprentissage autonome des principes d’algorithmie, développement de premiers sites statiques et scripts interactifs en JavaScript et Python.',
    tags: ['Algorithmie', 'JavaScript', 'Python', 'Web Fundamentals'],
    align: 'right',
    badgeColor: 'bg-[#c7e7ff] text-[#00658e]',
  },
];

// Compatibility exports
export const ASSETS = DEFAULT_ASSETS;
export const SKILL_CATEGORIES = DEFAULT_SKILL_CATEGORIES;
export const PROJECTS = DEFAULT_PROJECTS;
export const TIMELINE_EVENTS = DEFAULT_TIMELINE_EVENTS;
