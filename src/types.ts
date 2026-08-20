export type NavSection = 'accueil' | 'a-propos' | 'competences' | 'projets' | 'parcours' | 'contact';

export interface SkillItem {
  name: string;
  level: string;
  percentage: number;
}

export interface SkillCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  colorClass: string;
  skills: SkillItem[];
  badges?: string[];
}

export interface Project {
  id: string;
  title: string;
  year: string;
  category: 'React' | 'Node.js' | 'UI/UX' | 'Mobile' | 'Backend';
  description: string;
  longDescription: string;
  image: string;
  alt: string;
  tags: string[];
  featured?: boolean;
  demoUrl?: string;
  githubUrl?: string;
  metrics?: { label: string; value: string }[];
}

export interface TimelineEvent {
  id?: number;
  year: string;
  title: string;
  description: string;
  tags: string[];
  align: 'left' | 'right';
  badgeColor?: string;
}

export interface ContactFormData {
  nom: string;
  email: string;
  sujet: string;
  message: string;
}

export interface SiteAssets {
  logo: string;
  avatar: string;
  mapParis: string;
  cvUrl: string;
  cvFileName: string;
}

export interface UserProfile {
  name: string;
  title: string;
  subtitle: string;
  bio: string;
  shortBio: string;
  email: string;
  location: string;
  status: string;
  githubUrl: string;
  linkedinUrl: string;
}

