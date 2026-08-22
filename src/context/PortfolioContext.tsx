import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Project, SiteAssets, UserProfile, SkillCategory, TimelineEvent } from '../types';
import {
  DEFAULT_ASSETS,
  DEFAULT_PROFILE,
  DEFAULT_PROJECTS,
  DEFAULT_SKILL_CATEGORIES,
  DEFAULT_TIMELINE_EVENTS,
} from '../data/portfolioData';
import { api, ApiError, getAdminToken, setAdminToken, clearAdminToken } from '../lib/api';

interface PortfolioContextType {
  profile: UserProfile;
  assets: SiteAssets;
  projects: Project[];
  skills: SkillCategory[];
  timeline: TimelineEvent[];
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;

  // Connexion à l'espace admin (backend, tous les visiteurs partagent la même donnée)
  isAdminAuthenticated: boolean;
  adminError: string | null;
  loginAdmin: (password: string) => Promise<boolean>;
  logoutAdmin: () => void;

  // Chargement initial des données depuis l'API
  isLoading: boolean;
  isOffline: boolean;

  updateProfile: (newProfile: Partial<UserProfile>) => Promise<void>;
  updateAssets: (newAssets: Partial<SiteAssets>) => Promise<void>;
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (id: string, updatedProject: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addTimelineEvent: (event: Omit<TimelineEvent, 'id'>) => Promise<void>;
  deleteTimelineEvent: (id: number) => Promise<void>;
  updateCV: (cvUrl: string, cvFileName: string) => Promise<void>;
  resetToDefaults: () => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [assets, setAssets] = useState<SiteAssets>(DEFAULT_ASSETS);
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [skills, setSkills] = useState<SkillCategory[]>(DEFAULT_SKILL_CATEGORIES);
  const [timeline, setTimeline] = useState<TimelineEvent[]>(DEFAULT_TIMELINE_EVENTS);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);

  // Au montage : on tente de charger les données réelles depuis l'API.
  // Si le backend n'est pas joignable (pas encore déployé, hors-ligne...),
  // on continue d'afficher les données par défaut plutôt que de casser le site.
  useEffect(() => {
    let cancelled = false;

    api
      .getPortfolio()
      .then((data) => {
        if (cancelled) return;
        setProfile(data.profile);
        setAssets(data.assets);
        setProjects(data.projects);
        setTimeline(data.timeline);
        setSkills(data.skills);
        setIsOffline(false);
      })
      .catch((err) => {
        console.warn('[portfolio] Impossible de charger les données depuis l\'API, utilisation des valeurs par défaut.', err);
        if (!cancelled) setIsOffline(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    // Session admin persistée pour l'onglet en cours (sessionStorage).
    setIsAdminAuthenticated(!!getAdminToken());

    // Lien d'accès secret : ouvre l'admin uniquement si l'URL contient
    // ?key=<clé secrète> correspondant à VITE_ADMIN_ACCESS_KEY. Aucun bouton
    // visible dans l'interface n'y renvoie, pour éviter les tentatives de
    // connexion venant de bots/visiteurs qui explorent le site au hasard.
    const secretKey = import.meta.env.VITE_ADMIN_ACCESS_KEY as string | undefined;
    if (secretKey) {
      const params = new URLSearchParams(window.location.search);
      if (params.get('key') === secretKey) {
        setIsAdminOpen(true);
        // Nettoie l'URL pour ne pas laisser la clé visible dans la barre
        // d'adresse une fois l'admin ouvert.
        params.delete('key');
        const newSearch = params.toString();
        const newUrl =
          window.location.pathname + (newSearch ? `?${newSearch}` : '') + window.location.hash;
        window.history.replaceState({}, '', newUrl);
      }
    }

    return () => {
      cancelled = true;
    };
  }, []);

  const loginAdmin = useCallback(async (password: string): Promise<boolean> => {
    setAdminError(null);
    try {
      const { token } = await api.login(password);
      setAdminToken(token);
      setIsAdminAuthenticated(true);
      return true;
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Impossible de se connecter à l'API.";
      setAdminError(message);
      setIsAdminAuthenticated(false);
      return false;
    }
  }, []);

  const logoutAdmin = useCallback(() => {
    clearAdminToken();
    setIsAdminAuthenticated(false);
  }, []);

  const updateProfile = useCallback(async (newProfile: Partial<UserProfile>) => {
    const updated = await api.updateProfile(newProfile);
    setProfile(updated as UserProfile);
  }, []);

  const updateAssets = useCallback(async (newAssets: Partial<SiteAssets>) => {
    const updated = await api.updateAssets(newAssets);
    setAssets(updated as SiteAssets);
  }, []);

  const addProject = useCallback(async (projectData: Omit<Project, 'id'>) => {
    const created = await api.createProject(projectData);
    setProjects((prev) => [created as Project, ...prev]);
  }, []);

  const updateProject = useCallback(async (id: string, updatedFields: Partial<Project>) => {
    const updated = await api.updateProject(id, updatedFields);
    setProjects((prev) => prev.map((p) => (p.id === id ? (updated as Project) : p)));
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    await api.deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addTimelineEvent = useCallback(async (event: Omit<TimelineEvent, 'id'>) => {
    const created = await api.createTimelineEvent(event);
    setTimeline((prev) => [created as TimelineEvent, ...prev]);
  }, []);

  const deleteTimelineEvent = useCallback(async (id: number) => {
    await api.deleteTimelineEvent(id);
    setTimeline((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateCV = useCallback(
    async (cvUrl: string, cvFileName: string) => {
      await updateAssets({ cvUrl, cvFileName });
    },
    [updateAssets]
  );

  const resetToDefaults = useCallback(() => {
    // Remise à zéro locale uniquement (affichage) : les vraies données en
    // base ne sont pas supprimées automatiquement pour éviter toute perte
    // accidentelle. Utilisez `npm run db:seed` côté serveur pour réinitialiser
    // réellement la base de données aux valeurs par défaut.
    setProfile(DEFAULT_PROFILE);
    setAssets(DEFAULT_ASSETS);
    setProjects(DEFAULT_PROJECTS);
    setTimeline(DEFAULT_TIMELINE_EVENTS);
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        profile,
        assets,
        projects,
        skills,
        timeline,
        isAdminOpen,
        setIsAdminOpen,
        isAdminAuthenticated,
        adminError,
        loginAdmin,
        logoutAdmin,
        isLoading,
        isOffline,
        updateProfile,
        updateAssets,
        addProject,
        updateProject,
        deleteProject,
        addTimelineEvent,
        deleteTimelineEvent,
        updateCV,
        resetToDefaults,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
