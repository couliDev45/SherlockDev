import React, { useEffect, useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { Project, TimelineEvent } from "../types";
import { DEFAULT_ASSETS } from "../data/portfolioData";
import { api, ApiError } from "../lib/api";
import {
  X,
  Image as ImageIcon,
  FolderPlus,
  FileText,
  Trash2,
  Edit3,
  Plus,
  Check,
  RotateCcw,
  Upload,
  User,
  Shield,
  Download,
  Calendar,
  Sparkles,
  Lock,
  LogOut,
  MessageSquare,
  Loader2,
} from "lucide-react";

export const AdminDashboardModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    profile,
    assets,
    projects,
    timeline,
    isAdminAuthenticated,
    adminError,
    loginAdmin,
    logoutAdmin,
    updateProfile,
    updateAssets,
    addProject,
    updateProject,
    deleteProject,
    addTimelineEvent,
    deleteTimelineEvent,
    updateCV,
    resetToDefaults,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<
    "images" | "projects" | "timeline" | "cv" | "messages" | "reset"
  >("images");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Login gate state
  const [passwordInput, setPasswordInput] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Contact messages (chargés uniquement une fois connecté, onglet "messages")
  const [messages, setMessages] = useState<
    { id: number; nom: string; email: string; sujet: string; message: string; is_read: boolean; created_at: string }[]
  >([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Project Editing State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [projectFormData, setProjectFormData] = useState<Partial<Project>>({
    title: "",
    year: "2024",
    category: "React",
    description: "",
    longDescription: "",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop",
    alt: "Aperçu du projet",
    tags: ["React", "Node.js"],
    featured: false,
    demoUrl: "#",
    githubUrl: "https://github.com",
  });
  const [tagInput, setTagInput] = useState("");

  // Timeline Event creation state
  const [isAddingTimeline, setIsAddingTimeline] = useState(false);
  const [timelineForm, setTimelineForm] = useState<TimelineEvent>({
    year: "2024",
    title: "",
    description: "",
    tags: ["React", "TypeScript"],
    align: "left",
  });
  const [timelineTagInput, setTimelineTagInput] = useState("React, TypeScript");

  // Local Profile & Assets Form State
  const [profileForm, setProfileForm] = useState(profile);
  const [assetsForm, setAssetsForm] = useState(assets);

  useEffect(() => {
    if (isAdminOpen) {
      setProfileForm(profile);
      setAssetsForm(assets);
    }
  }, [assets, isAdminOpen, profile]);

  // Avatar preset : uniquement la photo de profil personnelle
  const presetAvatars = [DEFAULT_ASSETS.avatar];

  const presetProjectCovers = [
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000&auto=format&fit=crop",
  ];

  useEffect(() => {
    if (isAdminOpen && isAdminAuthenticated && activeTab === "messages") {
      setIsLoadingMessages(true);
      api
        .getContactMessages()
        .then(setMessages)
        .catch((err) => {
          setErrorMessage(err instanceof ApiError ? err.message : "Impossible de charger les messages.");
        })
        .finally(() => setIsLoadingMessages(false));
    }
  }, [isAdminOpen, isAdminAuthenticated, activeTab]);

  if (!isAdminOpen) return null;

  const showNotification = (msg: string) => {
    setSuccessMessage(msg);
    setErrorMessage(null);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const showError = (err: unknown, fallback: string) => {
    setErrorMessage(err instanceof ApiError ? err.message : fallback);
    setSuccessMessage(null);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    const ok = await loginAdmin(passwordInput);
    setIsLoggingIn(false);
    if (ok) setPasswordInput("");
  };

  const handleMarkMessageRead = async (id: number) => {
    try {
      await api.markMessageRead(id);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: true } : m)));
    } catch (err) {
      showError(err, "Impossible de marquer le message comme lu.");
    }
  };

  // Écran de connexion : tant que l'admin n'est pas authentifié auprès de
  // l'API, aucune donnée sensible ni action de modification n'est accessible.
  if (!isAdminAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#16324F]/60 backdrop-blur-md animate-fadeIn">
        <div
          className="bg-white w-full max-w-sm rounded-[28px] shadow-2xl border border-[#D9EAF4] overflow-hidden animate-scaleUp"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-[#16324F] px-6 py-6 text-white flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#00658e] text-white flex items-center justify-center shadow-inner">
              <Lock className="w-6 h-6 text-[#65c1fe]" />
            </div>
            <div>
              <h2 className="font-['Hanken_Grotesk'] text-lg font-bold tracking-tight">
                Espace Administrateur
              </h2>
              <p className="font-['Inter'] text-xs text-[#c7e7ff] mt-1">
                Connexion requise pour gérer le contenu du portfolio
              </p>
            </div>
          </div>

          <form onSubmit={handleLoginSubmit} className="p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="admin-password" className="font-['Inter'] text-xs font-bold uppercase tracking-wider text-[#16324F]">
                Mot de passe
              </label>
              <input
                id="admin-password"
                type="password"
                autoFocus
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#D9EAF4] focus:border-[#00658e] focus:ring-2 focus:ring-[#7fcdff]/30 text-sm font-['Inter'] text-[#16324F] outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            {adminError && (
              <p className="text-xs font-['Inter'] text-red-600 -mt-2">{adminError}</p>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-[#00658e] hover:bg-[#004c6c] text-white font-['Inter'] text-xs font-bold tracking-wider uppercase rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connexion...</span>
                </>
              ) : (
                <span>SE CONNECTER</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsAdminOpen(false)}
              className="w-full py-2.5 text-[#40484e] hover:text-[#16324F] font-['Inter'] text-xs font-bold tracking-wider uppercase rounded-xl transition-all cursor-pointer"
            >
              Annuler
            </button>
          </form>
        </div>
      </div>
    );
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(profileForm);
      showNotification("Profil mis à jour avec succès !");
    } catch (err) {
      showError(err, "Impossible de mettre à jour le profil.");
    }
  };

  const handleAssetsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateAssets(assetsForm);
      showNotification("Images mises à jour avec succès !");
    } catch (err) {
      showError(err, "Impossible de mettre à jour les images.");
    }
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (base64Url: string, fileName?: string) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          callback(reader.result, file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Project Add / Edit handlers
  const openNewProjectForm = () => {
    setProjectFormData({
      title: "",
      year: new Date().getFullYear().toString(),
      category: "React",
      description: "",
      longDescription: "",
      image: presetProjectCovers[0],
      alt: "Nouveau projet web",
      tags: ["React", "TypeScript", "TailwindCSS"],
      featured: false,
      demoUrl: "#",
      githubUrl: "https://github.com",
    });
    setTagInput("React, TypeScript, TailwindCSS");
    setEditingProject(null);
    setIsCreatingProject(true);
  };

  const openEditProjectForm = (proj: Project) => {
    setEditingProject(proj);
    setProjectFormData(proj);
    setTagInput(proj.tags.join(", "));
    setIsCreatingProject(false);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = tagInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const projectToSave = {
      ...projectFormData,
      tags: tagsArray,
      alt: projectFormData.title
        ? `Aperçu du projet ${projectFormData.title}`
        : "Projet",
    };

    try {
      if (isCreatingProject) {
        await addProject(projectToSave as Omit<Project, "id">);
        showNotification("Nouveau projet ajouté avec succès !");
      } else if (editingProject) {
        await updateProject(editingProject.id, projectToSave);
        showNotification("Projet mis à jour avec succès !");
      }
      setIsCreatingProject(false);
      setEditingProject(null);
    } catch (err) {
      showError(err, "Impossible d'enregistrer le projet.");
    }
  };

  const handleDeleteProject = async (id: string, title: string) => {
    if (
      window.confirm(`Êtes-vous sûr de vouloir retirer le projet "${title}" ?`)
    ) {
      try {
        await deleteProject(id);
        showNotification(`Projet "${title}" retiré.`);
      } catch (err) {
        showError(err, "Impossible de supprimer le projet.");
      }
    }
  };

  const handleSaveTimelineEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = timelineTagInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const { id: _unusedId, ...timelineFormWithoutId } = timelineForm;

    try {
      await addTimelineEvent({
        ...timelineFormWithoutId,
        tags: tagsArray,
      });

      setIsAddingTimeline(false);
      setTimelineForm({
        year: "2024",
        title: "",
        description: "",
        tags: ["React", "TypeScript"],
        align: "left",
      });
      showNotification("Nouvelle étape ajoutée au parcours !");
    } catch (err) {
      showError(err, "Impossible d'ajouter cette étape.");
    }
  };

  const handleDeleteTimelineEvent = async (id: number | undefined, title: string) => {
    if (id === undefined) {
      showError(null, "Cette étape n'est pas encore synchronisée, rechargez la page.");
      return;
    }
    if (window.confirm(`Retirer l'étape "${title}" du parcours ?`)) {
      try {
        await deleteTimelineEvent(id);
        showNotification(`Étape "${title}" retirée.`);
      } catch (err) {
        showError(err, "Impossible de supprimer cette étape.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#16324F]/60 backdrop-blur-md animate-fadeIn">
      <div
        className="bg-white w-full max-w-4xl rounded-[28px] shadow-2xl border border-[#D9EAF4] overflow-hidden flex flex-col max-h-[92vh] relative animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#16324F] px-6 py-5 text-white flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00658e] text-white flex items-center justify-center shadow-inner">
              <Shield className="w-5 h-5 text-[#65c1fe]" />
            </div>
            <div>
              <h2 className="font-['Hanken_Grotesk'] text-xl font-bold tracking-tight">
                Tableau de Bord Administrateur
              </h2>
              <p className="font-['Inter'] text-xs text-[#c7e7ff]">
                Gestion dynamique des images, des projets, du parcours et du CV
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={logoutAdmin}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none cursor-pointer"
              aria-label="Se déconnecter"
              title="Se déconnecter"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none cursor-pointer"
              aria-label="Fermer le dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success / Error Toast */}
        {successMessage && (
          <div className="bg-[#2ECC71] text-white px-6 py-2.5 text-xs font-['Inter'] font-bold flex items-center gap-2 animate-fadeIn shrink-0">
            <Check className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-600 text-white px-6 py-2.5 text-xs font-['Inter'] font-bold flex items-center gap-2 animate-fadeIn shrink-0">
            <X className="w-4 h-4" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-[#F8FCFF] border-b border-[#D9EAF4] px-6 py-2 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => {
              setActiveTab("images");
              setIsCreatingProject(false);
              setEditingProject(null);
            }}
            className={`px-4 py-2.5 rounded-xl font-['Inter'] text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "images"
                ? "bg-[#00658e] text-white shadow-sm"
                : "text-[#40484e] hover:bg-[#edf4ff]"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Images</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("projects");
            }}
            className={`px-4 py-2.5 rounded-xl font-['Inter'] text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "projects"
                ? "bg-[#00658e] text-white shadow-sm"
                : "text-[#40484e] hover:bg-[#edf4ff]"
            }`}
          >
            <FolderPlus className="w-4 h-4" />
            <span>Projets ({projects.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("timeline");
              setIsCreatingProject(false);
              setEditingProject(null);
            }}
            className={`px-4 py-2.5 rounded-xl font-['Inter'] text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "timeline"
                ? "bg-[#00658e] text-white shadow-sm"
                : "text-[#40484e] hover:bg-[#edf4ff]"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Parcours ({timeline.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("cv");
              setIsCreatingProject(false);
              setEditingProject(null);
            }}
            className={`px-4 py-2.5 rounded-xl font-['Inter'] text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "cv"
                ? "bg-[#00658e] text-white shadow-sm"
                : "text-[#40484e] hover:bg-[#edf4ff]"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>CV & Profil</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("messages");
              setIsCreatingProject(false);
              setEditingProject(null);
            }}
            className={`px-4 py-2.5 rounded-xl font-['Inter'] text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "messages"
                ? "bg-[#00658e] text-white shadow-sm"
                : "text-[#40484e] hover:bg-[#edf4ff]"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>
              Messages
              {messages.filter((m) => !m.is_read).length > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[10px]">
                  {messages.filter((m) => !m.is_read).length}
                </span>
              )}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab("reset");
              setIsCreatingProject(false);
              setEditingProject(null);
            }}
            className={`ml-auto px-4 py-2.5 rounded-xl font-['Inter'] text-xs font-bold tracking-wider uppercase flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "reset"
                ? "bg-red-600 text-white shadow-sm"
                : "text-red-600 hover:bg-red-50"
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-grow bg-[#F8FCFF]">
          {/* TAB 1: IMAGES MANAGEMENT */}
          {activeTab === "images" && (
            <form
              onSubmit={handleAssetsSubmit}
              className="flex flex-col gap-6 max-w-3xl mx-auto"
            >
              <div className="bg-white p-6 rounded-2xl border border-[#D9EAF4] shadow-sm flex flex-col gap-4">
                <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-[#16324F] flex items-center gap-2">
                  <User className="w-5 h-5 text-[#00658e]" />
                  <span>Photo de Profil / Avatar</span>
                </h3>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#00658e] shadow-md shrink-0 bg-gray-100">
                    <img
                      src={assetsForm.avatar}
                      alt="Aperçu Avatar"
                      className="w-full h-full object-cover"
                      onError={(e) =>
                        (e.currentTarget.src = DEFAULT_ASSETS.avatar)
                      }
                    />
                  </div>

                  <div className="flex flex-col gap-3 w-full">
                    <label className="font-['Inter'] text-xs font-bold text-[#16324F] uppercase tracking-wider">
                      URL de l'image Avatar
                    </label>
                    <input
                      type="text"
                      value={assetsForm.avatar}
                      onChange={(e) =>
                        setAssetsForm({ ...assetsForm, avatar: e.target.value })
                      }
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D9EAF4] text-xs font-['Inter'] outline-none focus:border-[#00658e]"
                    />

                    <div className="flex items-center gap-3">
                      <label className="px-4 py-2 bg-[#edf4ff] text-[#00658e] hover:bg-[#d8eaff] rounded-xl text-xs font-['Inter'] font-bold cursor-pointer flex items-center gap-2 transition-colors">
                        <Upload className="w-4 h-4" />
                        <span>Téléverser depuis le PC</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(e, (base64) =>
                              setAssetsForm({ ...assetsForm, avatar: base64 }),
                            )
                          }
                        />
                      </label>
                    </div>

                    {/* Presets Gallery */}
                    <div className="pt-2">
                      <span className="text-[11px] font-['Inter'] text-[#7B8FA3] block mb-1.5">
                        Ou choisissez un avatar prédéfini :
                      </span>
                      <div className="flex items-center gap-2">
                        {presetAvatars.map((url, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() =>
                              setAssetsForm({ ...assetsForm, avatar: url })
                            }
                            className="w-9 h-9 rounded-lg overflow-hidden border border-[#D9EAF4] hover:border-[#00658e] transition-all shrink-0 cursor-pointer"
                          >
                            <img
                              src={url}
                              alt={`Preset ${i}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Logo Site */}
              <div className="bg-white p-6 rounded-2xl border border-[#D9EAF4] shadow-sm flex flex-col gap-4">
                <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-[#16324F] flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#00658e]" />
                  <span>Logo de la Marque (CouliDev)</span>
                </h3>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-24 h-16 bg-[#16324F] rounded-xl flex items-center justify-center p-2 shrink-0 border border-[#D9EAF4]">
                    <img
                      src={assetsForm.logo}
                      alt="Aperçu Logo"
                      className="h-8 w-auto object-contain brightness-0 invert"
                    />
                  </div>

                  <div className="flex flex-col gap-3 w-full">
                    <label className="font-['Inter'] text-xs font-bold text-[#16324F] uppercase tracking-wider">
                      URL du Logo
                    </label>
                    <input
                      type="text"
                      value={assetsForm.logo}
                      onChange={(e) =>
                        setAssetsForm({ ...assetsForm, logo: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D9EAF4] text-xs font-['Inter'] outline-none focus:border-[#00658e]"
                    />

                    <label className="self-start px-4 py-2 bg-[#edf4ff] text-[#00658e] hover:bg-[#d8eaff] rounded-xl text-xs font-['Inter'] font-bold cursor-pointer flex items-center gap-2 transition-colors">
                      <Upload className="w-4 h-4" />
                      <span>Téléverser un logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(e, (base64) =>
                            setAssetsForm({ ...assetsForm, logo: base64 }),
                          )
                        }
                      />
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#00658e] hover:bg-[#004c6c] text-white font-['Inter'] text-xs font-bold tracking-wider uppercase rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>ENREGISTRER LES MODIFICATIONS D'IMAGES</span>
              </button>
            </form>
          )}

          {/* TAB 2: PROJECTS MANAGEMENT */}
          {activeTab === "projects" && (
            <div className="flex flex-col gap-6">
              {!isCreatingProject && !editingProject ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-['Hanken_Grotesk'] text-xl font-bold text-[#16324F]">
                        Gestion des Projets
                      </h3>
                      <p className="font-['Inter'] text-xs text-[#40484e]">
                        Ajoutez, modifiez ou retirez vos projets.
                      </p>
                    </div>

                    <button
                      onClick={openNewProjectForm}
                      className="px-5 py-3 bg-[#00658e] hover:bg-[#004c6c] text-white font-['Inter'] text-xs font-bold tracking-wider uppercase rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Ajouter un Projet</span>
                    </button>
                  </div>

                  {/* Projects List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map((p) => (
                      <div
                        key={p.id}
                        className="bg-white rounded-2xl border border-[#D9EAF4] p-4 flex gap-4 shadow-sm hover:shadow-md transition-shadow relative group"
                      >
                        <div className="w-28 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                          <img
                            src={p.image}
                            alt={p.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex flex-col justify-between flex-grow">
                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="font-['Hanken_Grotesk'] font-bold text-base text-[#16324F]">
                                {p.title}
                              </h4>
                              <span className="px-2 py-0.5 bg-[#edf4ff] text-[#00658e] text-[10px] font-bold rounded-md font-['Inter'] uppercase">
                                {p.category}
                              </span>
                            </div>
                            <p className="font-['Inter'] text-xs text-[#7B8FA3] line-clamp-2 mt-1">
                              {p.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-[#D9EAF4]/60">
                            <span className="font-['JetBrains_Mono'] text-[11px] text-[#40484e]">
                              {p.year}
                            </span>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openEditProjectForm(p)}
                                className="p-1.5 rounded-lg bg-[#edf4ff] text-[#00658e] hover:bg-[#d8eaff] transition-colors cursor-pointer"
                                title="Éditer le projet"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteProject(p.id, p.title)
                                }
                                className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                                title="Retirer le projet"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* Project Creation / Editing Form */
                <form
                  onSubmit={handleSaveProject}
                  className="bg-white p-6 rounded-2xl border border-[#D9EAF4] shadow-sm flex flex-col gap-5 max-w-3xl mx-auto"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#D9EAF4]">
                    <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-[#16324F]">
                      {isCreatingProject
                        ? "Ajouter un Nouveau Projet"
                        : `Éditer "${editingProject?.title}"`}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingProject(false);
                        setEditingProject(null);
                      }}
                      className="text-xs font-['Inter'] text-[#7B8FA3] hover:text-[#16324F] cursor-pointer"
                    >
                      Annuler
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-['Inter'] text-xs font-bold text-[#16324F] uppercase tracking-wider">
                        Titre du Projet *
                      </label>
                      <input
                        type="text"
                        required
                        value={projectFormData.title || ""}
                        onChange={(e) =>
                          setProjectFormData({
                            ...projectFormData,
                            title: e.target.value,
                          })
                        }
                        placeholder="ex. DevPortfolio"
                        className="px-4 py-2.5 rounded-xl border border-[#D9EAF4] text-xs font-['Inter'] outline-none focus:border-[#00658e]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-['Inter'] text-xs font-bold text-[#16324F] uppercase tracking-wider">
                        Catégorie
                      </label>
                      <select
                        value={projectFormData.category || "React"}
                        onChange={(e) =>
                          setProjectFormData({
                            ...projectFormData,
                            category: e.target.value as Project["category"],
                          })
                        }
                        className="px-4 py-2.5 rounded-xl border border-[#D9EAF4] text-xs font-['Inter'] outline-none focus:border-[#00658e] bg-white cursor-pointer"
                      >
                        <option value="React">React</option>
                        <option value="Node.js">Node.js</option>
                        <option value="UI/UX">UI/UX</option>
                        <option value="Mobile">Mobile</option>
                        <option value="Backend">Backend</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-['Inter'] text-xs font-bold text-[#16324F] uppercase tracking-wider">
                        Année
                      </label>
                      <input
                        type="text"
                        value={projectFormData.year || "2024"}
                        onChange={(e) =>
                          setProjectFormData({
                            ...projectFormData,
                            year: e.target.value,
                          })
                        }
                        className="px-4 py-2.5 rounded-xl border border-[#D9EAF4] text-xs font-['Inter'] outline-none focus:border-[#00658e]"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-['Inter'] text-xs font-bold text-[#16324F] uppercase tracking-wider">
                        Lien GitHub
                      </label>
                      <input
                        type="text"
                        value={projectFormData.githubUrl || ""}
                        onChange={(e) =>
                          setProjectFormData({
                            ...projectFormData,
                            githubUrl: e.target.value,
                          })
                        }
                        placeholder="https://github.com/..."
                        className="px-4 py-2.5 rounded-xl border border-[#D9EAF4] text-xs font-['Inter'] outline-none focus:border-[#00658e]"
                      />
                    </div>
                  </div>

                  {/* Descriptions */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-['Inter'] text-xs font-bold text-[#16324F] uppercase tracking-wider">
                      Description Courte (Aperçu carte) *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={projectFormData.description || ""}
                      onChange={(e) =>
                        setProjectFormData({
                          ...projectFormData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Résumé concis du projet..."
                      className="px-4 py-2.5 rounded-xl border border-[#D9EAF4] text-xs font-['Inter'] outline-none focus:border-[#00658e] resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-['Inter'] text-xs font-bold text-[#16324F] uppercase tracking-wider">
                      Description Longue (Fenêtre de détails) *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={projectFormData.longDescription || ""}
                      onChange={(e) =>
                        setProjectFormData({
                          ...projectFormData,
                          longDescription: e.target.value,
                        })
                      }
                      placeholder="Présentation détaillée du projet, du contexte, des choix techniques..."
                      className="px-4 py-2.5 rounded-xl border border-[#D9EAF4] text-xs font-['Inter'] outline-none focus:border-[#00658e] resize-none"
                    />
                  </div>

                  {/* Image input & upload */}
                  <div className="flex flex-col gap-2">
                    <label className="font-['Inter'] text-xs font-bold text-[#16324F] uppercase tracking-wider">
                      Image d'illustration du Projet *
                    </label>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {projectFormData.image && (
                        <div className="w-24 h-16 rounded-lg overflow-hidden border border-[#D9EAF4] shrink-0 bg-gray-100">
                          <img
                            src={projectFormData.image}
                            alt="Aperçu"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <input
                        type="text"
                        required
                        value={projectFormData.image || ""}
                        onChange={(e) =>
                          setProjectFormData({
                            ...projectFormData,
                            image: e.target.value,
                          })
                        }
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-4 py-2.5 rounded-xl border border-[#D9EAF4] text-xs font-['Inter'] outline-none focus:border-[#00658e]"
                      />

                      <label className="px-4 py-2.5 bg-[#edf4ff] text-[#00658e] hover:bg-[#d8eaff] rounded-xl text-xs font-['Inter'] font-bold cursor-pointer flex items-center gap-2 whitespace-nowrap shrink-0">
                        <Upload className="w-4 h-4" />
                        <span>Téléverser image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(e, (base64) =>
                              setProjectFormData({
                                ...projectFormData,
                                image: base64,
                              }),
                            )
                          }
                        />
                      </label>
                    </div>

                    {/* Presets Project Gallery */}
                    <div className="pt-2">
                      <span className="text-[11px] font-['Inter'] text-[#7B8FA3] block mb-1.5">
                        Exemples de couvertures prêtes à l'emploi :
                      </span>
                      <div className="flex items-center gap-2">
                        {presetProjectCovers.map((url, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() =>
                              setProjectFormData({
                                ...projectFormData,
                                image: url,
                              })
                            }
                            className="w-14 h-9 rounded-lg overflow-hidden border border-[#D9EAF4] hover:border-[#00658e] transition-all shrink-0 cursor-pointer"
                          >
                            <img
                              src={url}
                              alt={`Preset ${i}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-col gap-1.5">
                    <label className="font-['Inter'] text-xs font-bold text-[#16324F] uppercase tracking-wider">
                      Tags Technologies (séparés par des virgules)
                    </label>
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="React, TypeScript, TailwindCSS, Express"
                      className="px-4 py-2.5 rounded-xl border border-[#D9EAF4] text-xs font-['Inter'] outline-none focus:border-[#00658e]"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D9EAF4]">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingProject(false);
                        setEditingProject(null);
                      }}
                      className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#16324F] font-['Inter'] text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#00658e] hover:bg-[#004c6c] text-white font-['Inter'] text-xs font-bold tracking-wider uppercase rounded-xl transition-colors shadow-sm cursor-pointer"
                    >
                      {isCreatingProject
                        ? "Ajouter le Projet"
                        : "Enregistrer le Projet"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: TIMELINE / PARCOURS */}
          {activeTab === "timeline" && (
            <div className="flex flex-col gap-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-['Hanken_Grotesk'] text-xl font-bold text-[#16324F]">
                    Gestion du Parcours & Formations
                  </h3>
                  <p className="font-['Inter'] text-xs text-[#40484e]">
                    Ajoutez vos étapes de formation, certifs et expériences.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddingTimeline(true)}
                  className="px-5 py-2.5 bg-[#00658e] hover:bg-[#004c6c] text-white font-['Inter'] text-xs font-bold tracking-wider uppercase rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter une Étape</span>
                </button>
              </div>

              {isAddingTimeline && (
                <form
                  onSubmit={handleSaveTimelineEvent}
                  className="bg-white p-6 rounded-2xl border border-[#D9EAF4] shadow-sm flex flex-col gap-4"
                >
                  <h4 className="font-['Hanken_Grotesk'] text-base font-bold text-[#16324F]">
                    Nouvelle Étape du Parcours
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-['Inter'] text-xs font-bold text-[#16324F] uppercase">
                        Année / Période
                      </label>
                      <input
                        type="text"
                        required
                        value={timelineForm.year}
                        onChange={(e) =>
                          setTimelineForm({
                            ...timelineForm,
                            year: e.target.value,
                          })
                        }
                        placeholder="ex. 2024"
                        className="px-4 py-2.5 rounded-xl border border-[#D9EAF4] text-xs font-['Inter'] outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="font-['Inter'] text-xs font-bold text-[#16324F] uppercase">
                        Titre / Formation
                      </label>
                      <input
                        type="text"
                        required
                        value={timelineForm.title}
                        onChange={(e) =>
                          setTimelineForm({
                            ...timelineForm,
                            title: e.target.value,
                          })
                        }
                        placeholder="ex. Certification React & TypeScript"
                        className="px-4 py-2.5 rounded-xl border border-[#D9EAF4] text-xs font-['Inter'] outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-['Inter'] text-xs font-bold text-[#16324F] uppercase">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={timelineForm.description}
                      onChange={(e) =>
                        setTimelineForm({
                          ...timelineForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Détails sur ce que vous avez appris..."
                      className="px-4 py-2.5 rounded-xl border border-[#D9EAF4] text-xs font-['Inter'] outline-none resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-['Inter'] text-xs font-bold text-[#16324F] uppercase">
                      Tags (virgules)
                    </label>
                    <input
                      type="text"
                      value={timelineTagInput}
                      onChange={(e) => setTimelineTagInput(e.target.value)}
                      placeholder="React, TypeScript, Redux"
                      className="px-4 py-2.5 rounded-xl border border-[#D9EAF4] text-xs font-['Inter'] outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingTimeline(false)}
                      className="px-4 py-2 bg-gray-100 text-[#16324F] text-xs font-bold rounded-xl"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#00658e] text-white text-xs font-bold rounded-xl"
                    >
                      Ajouter l'étape
                    </button>
                  </div>
                </form>
              )}

              {/* Timeline Items List */}
              <div className="flex flex-col gap-3">
                {timeline.map((item, idx) => (
                  <div
                    key={item.id ?? idx}
                    className="bg-white p-4 rounded-xl border border-[#D9EAF4] flex items-center justify-between gap-4 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-[#c7e7ff] text-[#00658e] font-['JetBrains_Mono'] text-xs font-bold rounded-full shrink-0">
                        {item.year}
                      </span>
                      <div>
                        <h4 className="font-['Hanken_Grotesk'] font-bold text-sm text-[#16324F]">
                          {item.title}
                        </h4>
                        <p className="font-['Inter'] text-xs text-[#7B8FA3] line-clamp-1">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteTimelineEvent(item.id, item.title)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CV & PROFILE MANAGEMENT */}
          {activeTab === "cv" && (
            <div className="flex flex-col gap-6 max-w-3xl mx-auto">
              {/* CV File Management Card */}
              <div className="bg-white p-6 rounded-2xl border border-[#D9EAF4] shadow-sm flex flex-col gap-4">
                <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-[#16324F] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#00658e]" />
                  <span>Gestion du Curriculum Vitae (CV)</span>
                </h3>

                <p className="font-['Inter'] text-xs text-[#40484e]">
                  Configurez le fichier PDF de votre CV que les recruteurs
                  pourront télécharger directement depuis la Navbar et le Hero.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex flex-col gap-1 w-full">
                    <label className="font-['Inter'] text-xs font-bold text-[#16324F] uppercase tracking-wider">
                      Lien du fichier CV (URL ou Fichier PDF)
                    </label>
                    <input
                      type="text"
                      value={assetsForm.cvUrl}
                      onChange={(e) =>
                        setAssetsForm({ ...assetsForm, cvUrl: e.target.value })
                      }
                      placeholder="https://.../mon_cv.pdf"
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D9EAF4] text-xs font-['Inter'] outline-none focus:border-[#00658e]"
                    />
                  </div>

                  <div className="flex flex-col gap-1 w-full sm:w-auto">
                    <label className="font-['Inter'] text-xs font-bold text-[#16324F] uppercase tracking-wider">
                      Nom du fichier
                    </label>
                    <input
                      type="text"
                      value={assetsForm.cvFileName}
                      onChange={(e) =>
                        setAssetsForm({
                          ...assetsForm,
                          cvFileName: e.target.value,
                        })
                      }
                      placeholder="CV_CouliDev.pdf"
                      className="px-4 py-2.5 rounded-xl border border-[#D9EAF4] text-xs font-['Inter'] outline-none focus:border-[#00658e]"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <label className="px-4 py-2 bg-[#edf4ff] text-[#00658e] hover:bg-[#d8eaff] rounded-xl text-xs font-['Inter'] font-bold cursor-pointer flex items-center gap-2 transition-colors">
                    <Upload className="w-4 h-4" />
                    <span>Téléverser Fichier CV (PDF)</span>
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(e, (base64, fileName) => {
                          setAssetsForm({
                            ...assetsForm,
                            cvUrl: base64,
                            cvFileName: fileName || "CV_CouliDev.pdf",
                          });
                          updateCV(base64, fileName || "CV_CouliDev.pdf")
                            .then(() => showNotification("Fichier CV mis à jour !"))
                            .catch((err) => showError(err, "Impossible de mettre à jour le CV."));
                        })
                      }
                    />
                  </label>

                  <a
                    href={assetsForm.cvUrl}
                    download={assetsForm.cvFileName}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-white border border-[#D9EAF4] text-[#16324F] hover:bg-[#edf4ff] rounded-xl text-xs font-['Inter'] font-bold flex items-center gap-2 transition-colors"
                  >
                    <Download className="w-4 h-4 text-[#00658e]" />
                    <span>Tester le téléchargement du CV</span>
                  </a>
                </div>
              </div>

              {/* Profile Details Card */}
              <form
                onSubmit={handleProfileSubmit}
                className="bg-white p-6 rounded-2xl border border-[#D9EAF4] shadow-sm flex flex-col gap-4"
              >
                <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-[#16324F] flex items-center gap-2">
                  <User className="w-5 h-5 text-[#00658e]" />
                  <span>Informations de Profil Développeur Junior</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-['Inter'] text-xs font-bold text-[#16324F] uppercase tracking-wider">
                      Nom Complet
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, name: e.target.value })
                      }
                      className="px-4 py-2.5 rounded-xl border border-[#D9EAF4] text-xs font-['Inter'] outline-none focus:border-[#00658e]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-['Inter'] text-xs font-bold text-[#16324F] uppercase tracking-wider">
                      Titre Professionnel
                    </label>
                    <input
                      type="text"
                      value={profileForm.title}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          title: e.target.value,
                        })
                      }
                      placeholder="ex. Développeur Web Full-Stack Junior"
                      className="px-4 py-2.5 rounded-xl border border-[#D9EAF4] text-xs font-['Inter'] outline-none focus:border-[#00658e]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-['Inter'] text-xs font-bold text-[#16324F] uppercase tracking-wider">
                      Email de Contact
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          email: e.target.value,
                        })
                      }
                      className="px-4 py-2.5 rounded-xl border border-[#D9EAF4] text-xs font-['Inter'] outline-none focus:border-[#00658e]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-['Inter'] text-xs font-bold text-[#16324F] uppercase tracking-wider">
                      Localisation
                    </label>
                    <input
                      type="text"
                      value={profileForm.location}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          location: e.target.value,
                        })
                      }
                      placeholder="ex. Abidjan, Côte d'Ivoire"
                      className="px-4 py-2.5 rounded-xl border border-[#D9EAF4] text-xs font-['Inter'] outline-none focus:border-[#00658e]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-['Inter'] text-xs font-bold text-[#16324F] uppercase tracking-wider">
                      Disponibilité
                    </label>
                    <input
                      type="text"
                      value={profileForm.status}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          status: e.target.value,
                        })
                      }
                      placeholder="ex. Disponible immédiatement (CDI / Alternance / Freelance)"
                      className="px-4 py-2.5 rounded-xl border border-[#D9EAF4] text-xs font-['Inter'] outline-none focus:border-[#00658e]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-['Inter'] text-xs font-bold text-[#16324F] uppercase tracking-wider">
                      Lien GitHub
                    </label>
                    <input
                      type="text"
                      value={profileForm.githubUrl}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          githubUrl: e.target.value,
                        })
                      }
                      className="px-4 py-2.5 rounded-xl border border-[#D9EAF4] text-xs font-['Inter'] outline-none focus:border-[#00658e]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-['Inter'] text-xs font-bold text-[#16324F] uppercase tracking-wider">
                      Lien LinkedIn
                    </label>
                    <input
                      type="text"
                      value={profileForm.linkedinUrl}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          linkedinUrl: e.target.value,
                        })
                      }
                      className="px-4 py-2.5 rounded-xl border border-[#D9EAF4] text-xs font-['Inter'] outline-none focus:border-[#00658e]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-['Inter'] text-xs font-bold text-[#16324F] uppercase tracking-wider">
                    Bio / Présentation "À Propos"
                  </label>
                  <textarea
                    rows={3}
                    value={profileForm.bio}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, bio: e.target.value })
                    }
                    className="px-4 py-2.5 rounded-xl border border-[#D9EAF4] text-xs font-['Inter'] outline-none focus:border-[#00658e] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#00658e] hover:bg-[#004c6c] text-white font-['Inter'] text-xs font-bold tracking-wider uppercase rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Check className="w-4 h-4" />
                  <span>ENREGISTRER LE PROFIL & CV</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB: MESSAGES DE CONTACT */}
          {activeTab === "messages" && (
            <div className="flex flex-col gap-4 max-w-3xl mx-auto">
              <div className="flex items-center justify-between">
                <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-[#16324F] flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#00658e]" />
                  <span>Messages reçus ({messages.length})</span>
                </h3>
              </div>

              {isLoadingMessages && (
                <div className="flex items-center justify-center py-16 text-[#7B8FA3]">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              )}

              {!isLoadingMessages && messages.length === 0 && (
                <div className="bg-white p-8 rounded-2xl border border-[#D9EAF4] text-center text-sm font-['Inter'] text-[#7B8FA3]">
                  Aucun message reçu pour le moment.
                </div>
              )}

              {!isLoadingMessages &&
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={`bg-white p-5 rounded-2xl border shadow-sm flex flex-col gap-2 ${
                      m.is_read ? "border-[#D9EAF4]" : "border-[#00658e]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          {!m.is_read && (
                            <span className="w-2 h-2 rounded-full bg-[#00658e] shrink-0" />
                          )}
                          <h4 className="font-['Hanken_Grotesk'] font-bold text-sm text-[#16324F]">
                            {m.nom}
                          </h4>
                          <span className="text-xs font-['Inter'] text-[#7B8FA3]">
                            &lt;{m.email}&gt;
                          </span>
                        </div>
                        <p className="font-['Inter'] text-xs font-bold text-[#00658e] mt-1">
                          {m.sujet}
                        </p>
                      </div>
                      <span className="font-['JetBrains_Mono'] text-[11px] text-[#7B8FA3] shrink-0">
                        {new Date(m.created_at).toLocaleString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <p className="font-['Inter'] text-sm text-[#40484e] whitespace-pre-wrap">
                      {m.message}
                    </p>

                    <div className="flex items-center gap-3 mt-1">
                      <a
                        href={`mailto:${m.email}?subject=${encodeURIComponent(
                          `Re: ${m.sujet}`
                        )}`}
                        className="text-xs font-['Inter'] font-bold text-[#00658e] hover:underline"
                      >
                        Répondre par e-mail
                      </a>
                      {!m.is_read && (
                        <button
                          onClick={() => handleMarkMessageRead(m.id)}
                          className="text-xs font-['Inter'] font-bold text-[#7B8FA3] hover:text-[#16324F] cursor-pointer"
                        >
                          Marquer comme lu
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* TAB 5: RESET / RESTORE */}
          {activeTab === "reset" && (
            <div className="bg-white p-8 rounded-2xl border border-red-200 shadow-sm flex flex-col items-center text-center max-w-lg mx-auto gap-4 my-8">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                <RotateCcw className="w-8 h-8" />
              </div>

              <h3 className="font-['Hanken_Grotesk'] text-xl font-bold text-[#16324F]">
                Réinitialiser les données du site ?
              </h3>

              <p className="font-['Inter'] text-xs text-[#40484e] leading-relaxed">
                Cette action supprimera toutes vos modifications personnalisées
                (images, projets ajoutés, parcours, CV) et rétablira le
                portfolio par défaut du Développeur Junior.
              </p>

              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Confirmer la réinitialisation vers les données par défaut ?",
                    )
                  ) {
                    resetToDefaults();
                    setProfileForm(profile);
                    setAssetsForm(assets);
                    showNotification("Site réinitialisé avec succès !");
                  }
                }}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-['Inter'] text-xs font-bold tracking-wider uppercase rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer mt-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>RÉINITIALISER TOUT</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
