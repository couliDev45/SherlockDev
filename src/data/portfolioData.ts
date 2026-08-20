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
      { name: 'React', level: 'MAÎTRISÉ', percentage: 85 },
      { name: 'TypeScript', level: 'ACQUIS', percentage: 80 },
      { name: 'Next.js', level: 'ACQUIS', percentage: 75 },
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
      { name: 'Node.js / Express', level: 'MAÎTRISÉ', percentage: 80 },
      { name: 'API REST', level: 'MAÎTRISÉ', percentage: 85 },
      { name: 'PostgreSQL', level: 'ACQUIS', percentage: 75 },
      { name: 'Python', level: 'NOTIONS', percentage: 65 },
    ],
  },
  {
    id: 'donnees',
    title: 'Données',
    icon: 'Database',
    description: 'Modélisation et gestion de bases de données.',
    colorClass: 'text-[#4c6269]',
    skills: [
      { name: 'PostgreSQL / SQL', level: 'ACQUIS', percentage: 78 },
      { name: 'Prisma ORM', level: 'MAÎTRISÉ', percentage: 80 },
      { name: 'MongoDB', level: 'NOTIONS', percentage: 68 },
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

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'barachap',
    title: 'BaraChap',
    year: '2024',
    category: 'React',
    description:
      'Application web pour une boulangerie artisanale. Intégration du catalogue produits, panier dynamique et espace de gestion des commandes en ligne.',
    longDescription:
      'BaraChap est un projet d\'application web complète développée pour une boulangerie locale. L\'application inclut un catalogue interactif de produits frais, une gestion de panier en temps réel, ainsi qu\'un panneau d\'administration pour suivre la préparation des commandes.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDkHdFhkpHwKbeLgofiijWD-bEiZHfICOYGwAOMTv4bfh6aW83RJwu1puj1Idqyw2I75KB81sxDTDR-HecvKuJgZfELSJcNeePtr14Jhu-wuXQg5OvhkOEihvXoKL5M7PoAWPVCVObyk0e8Jh_HCTqmaAtIHUhK8l0_q6MTx4PrRt7nIbR_upRJeuDcNFqSvZGGpzRiaBiIGEq-fXfwH1tVzYSNrFN8su9piX6T9Wkz1p_HRxtLEdgR',
    alt: "Interface web de l'application BaraChap pour une boulangerie artisanale",
    tags: ['React', 'Node.js', 'TailwindCSS', 'Figma'],
    featured: true,
    demoUrl: '#',
    githubUrl: 'https://github.com/lucas-zheng/barachap',
    metrics: [
      { label: 'Score Lighthouse', value: '98/100' },
      { label: 'Temps de réponse', value: '< 1s' },
      { label: 'Composants React', value: '25+' },
    ],
  },
  {
    id: 'ecodash',
    title: 'EcoDash Analytics',
    year: '2024',
    category: 'UI/UX',
    description:
      "Dashboard interactif de suivi d'indicateurs écologiques et énergétiques avec graphiques dynamiques et filtres multi-critères.",
    longDescription:
      "EcoDash Analytics est une application frontend permettant de visualiser des métriques environnementales. Réalisée avec React et Chart.js, elle offre une expérience utilisateur fluide avec des graphiques réactifs et un mode sombre/clair.",
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBPsNy0uajqFagvbqe19X51_WLj2k4wZ12jsQ1gIE1FMNwJdtC2gSv9eBomb40RgsZ2aTxi4_IcyMJg2pdSdh80gaZrskwBIlXZbwMFGsvHYIyjP2JGgGF8jAB8yD6O3clfILPhntq0vGufoP_6cGkaBhvO9lxxWcKqLURfBbmnJDJhdInz3iT8B_G-DepuiTy1juWeDczejqAwwIS_OFCXBnPSZjJ7Ne1N0IEsFGFiiVzmLi6KfnBS',
    alt: 'Tableau de bord analytique EcoDash avec graphiques',
    tags: ['React', 'TailwindCSS', 'Chart.js', 'TypeScript'],
    demoUrl: '#',
    githubUrl: 'https://github.com/lucas-zheng/ecodash-analytics',
    metrics: [
      { label: 'Interface', value: '100% Responsive' },
      { label: 'Graphiques', value: 'Temps réel' },
      { label: 'Accessibilité', value: 'Conforme WCAG' },
    ],
  },
  {
    id: 'flowstate',
    title: 'FlowState Tasker',
    year: '2023',
    category: 'React',
    description:
      'Application web de gestion de tâches Kanban conçue pour organiser les projets de code, avec filtres par tags et sauvegardes locales.',
    longDescription:
      'FlowState Tasker aide les développeurs à organiser leurs sprints quotidiens grâce à un tableau Kanban fluide avec glisser-déposer, persistance des données et statistiques de complétion de tâches.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB284nzFWLzeVMGHXNQbnXYdwrYGfdV3YHwstagV0OXmJTL8HxF-QFBCSmtxLJFaN6TZOsuS4zfas8nUzC2_Zbos_DyLorr3UNejcmW20r9778ca7EGErsbupWkrR-lZrvule5SxAHGiEEgfmtBDA2WDc7fwIEyyet7qf_dpq-16U7yUOZa7HDDkWIeRbu8RsMVL4ULVG5qdGwMaXI0q2quu0wLljCd0Nc6HrIkA2myyLIC2hd0WtVc',
    alt: 'Application FlowState Tasker',
    tags: ['React', 'TypeScript', 'TailwindCSS', 'LocalStorage'],
    demoUrl: '#',
    githubUrl: 'https://github.com/lucas-zheng/flowstate-tasker',
    metrics: [
      { label: 'Fonctionnalité', value: 'Drag & Drop' },
      { label: 'Mode', value: 'Offline First' },
      { label: 'Design', value: 'Clean & Ergonomique' },
    ],
  },
  {
    id: 'devpulse-api',
    title: 'DevPulse REST API',
    year: '2023',
    category: 'Node.js',
    description:
      'API REST d\'authentification et de gestion d\'utilisateurs construite avec Node.js, Express et PostgreSQL.',
    longDescription:
      'DevPulse est un backend d\'API REST complet intégrant l\'authentification par tokens JWT, le hachage sécurisé des mots de passe avec bcrypt, la validation des schémas avec Zod et l\'accès aux données via Prisma ORM.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBb-H5whDmtNqDxDKJhFHllWsRKRrn0PO8M3a4yUKxr5GeyNbSg1GE7pu6GrB-xljAZTe4QYDVvu6B_Jo8ynPCRpBhL5B9jZ7UXsXVHUq2mWdf1x6vbj3SV5xSTltguz7u323wvc7Fw3j6tVxpk1zwETpU9hZJtTOIzurN2-SmyWrgtlVB2dD701-uOK6W9rl4F2QNBIoVJZdHUUhJz5A6dEI33zvjksJe9N5duHYTMioTWJinx-dcp',
    alt: 'Schéma d\'architecture DevPulse API',
    tags: ['Node.js', 'Express', 'PostgreSQL', 'Prisma', 'JWT'],
    featured: true,
    demoUrl: '#',
    githubUrl: 'https://github.com/lucas-zheng/devpulse-api',
    metrics: [
      { label: 'Sécurité', value: 'JWT & Bcrypt' },
      { label: 'Base de données', value: 'PostgreSQL / Prisma' },
      { label: 'Tests', value: 'Jest / Supertest' },
    ],
  },
];

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
    year: '2023 - 2024',
    title: 'Formation Développeur Web & Web Mobile (Certifiante)',
    description:
      'Formation intensive aux fondamentaux du web : développement frontend (HTML/CSS/JS), backend (Node.js/Express), modélisation de bases de données (SQL/PostgreSQL) et gestion de projet Agile.',
    tags: ['HTML5/CSS3', 'JavaScript ES6+', 'Express', 'PostgreSQL'],
    align: 'right',
    badgeColor: 'bg-[#c7e7ff] text-[#00658e]',
  },
  {
    year: '2023',
    title: 'Projet de Fin d’Études & Stage Immersion',
    description:
      'Conception et développement d’un projet d’application web complète en équipe. Mise en pratique de la gestion de version Git et des méthodologies Scrum.',
    tags: ['React', 'Git / GitHub', 'Figma', 'Agile / Scrum'],
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
