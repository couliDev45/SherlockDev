import React, { useState } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import {
  Mail,
  Github,
  Linkedin,
  Send,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { ContactFormData } from "../types";
import { api, ApiError } from "../lib/api";

export const ContactSection: React.FC = () => {
  const { profile, assets } = usePortfolio();

  const [formData, setFormData] = useState<ContactFormData>({
    nom: "",
    email: "",
    sujet: "Opportunité d'emploi",
    message: "",
  });

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      window.prompt("Copiez l'adresse e-mail :", profile.email);
    }
  };

  const openMailClient = () => {
    const body = [
      `Nom : ${formData.nom}`,
      `E-mail : ${formData.email}`,
      "",
      formData.message,
    ].join("\n");
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(formData.sujet)}&body=${encodeURIComponent(body)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Envoi vers l'API : le message est stocké en base et visible dans
      // l'espace admin (+ e-mail de notification si le SMTP est configuré).
      await api.submitContact(formData);
      setSubmitSuccess(true);
      setFormData({
        nom: "",
        email: "",
        sujet: "Opportunité d'emploi",
        message: "",
      });
      setTimeout(() => setSubmitSuccess(false), 6000);
    } catch (err) {
      // Si l'API est injoignable (backend non déployé, coupure réseau...),
      // on retombe sur l'ouverture du client mail pour ne jamais bloquer
      // l'utilisateur.
      if (err instanceof ApiError && err.status >= 400 && err.status < 500) {
        setSubmitError(err.message);
      } else {
        openMailClient();
        setSubmitSuccess(true);
        setFormData({
          nom: "",
          email: "",
          sujet: "Opportunité d'emploi",
          message: "",
        });
        setTimeout(() => setSubmitSuccess(false), 6000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="w-full py-20 lg:py-28 bg-[#F8FCFF] relative"
    >
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Direct info & map */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-8 h-[2px] bg-[#00658e]" />
                <span className="font-['Inter'] text-xs font-bold tracking-[0.2em] text-[#00658e] uppercase">
                  CONTACT
                </span>
              </div>

              <h2 className="font-['Hanken_Grotesk'] text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#16324F] leading-tight mb-4">
                Discutons ensemble.
              </h2>

              <p className="font-['Inter'] text-base text-[#40484e] leading-relaxed mb-8">
                Je suis actuellement à la recherche d'opportunités en tant que
                développeur web junior (CDI, alternance ou projets freelance).
                N'hésitez pas à me contacter !
              </p>

              {/* Direct links */}
              <div className="flex flex-col gap-4 mb-8">
                {/* Email with copy button */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-[#D9EAF4] hover:border-[#7fcdff] transition-all shadow-sm">
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center gap-3 text-sm font-semibold font-['Inter'] text-[#16324F] hover:text-[#00658e] transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[#edf4ff] text-[#00658e] flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span>{profile.email}</span>
                  </a>
                  <button
                    onClick={handleCopyEmail}
                    className="p-2 text-[#7B8FA3] hover:text-[#00658e] hover:bg-[#edf4ff] rounded-lg transition-colors cursor-pointer"
                    title="Copier l'adresse email"
                  >
                    {copiedEmail ? (
                      <Check className="w-4 h-4 text-[#2ECC71]" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Github link */}
                <a
                  href={profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-[#D9EAF4] hover:border-[#7fcdff] transition-all shadow-sm group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#edf4ff] text-[#16324F] group-hover:text-[#00658e] flex items-center justify-center transition-colors">
                    <Github className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold font-['Inter'] text-[#16324F] group-hover:text-[#00658e] transition-colors truncate">
                    {profile.githubUrl.replace("https://", "")}
                  </span>
                </a>

                {/* LinkedIn link */}
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-[#D9EAF4] hover:border-[#7fcdff] transition-all shadow-sm group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#edf4ff] text-[#00658e] flex items-center justify-center">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold font-['Inter'] text-[#16324F] group-hover:text-[#00658e] transition-colors truncate">
                    {profile.linkedinUrl.replace("https://", "")}
                  </span>
                </a>
              </div>
            </div>

            {/* Location & Status Card (sans carte)*/}
            <div className="rounded-2xl overflow-hidden border border-[#D9EAF4] bg-white shadow-sm p-4 flex items-center justify-between text-xs font-['Inter']">
              <span className="font-bold text-[#16324F] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#2ECC71]" />
                Basé à {profile.location}
              </span>
              <span className="text-[#00658e] font-bold">{profile.status}</span>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-[24px] p-6 sm:p-10 shadow-sm border border-[#D9EAF4] flex flex-col">
            <h3 className="font-['Hanken_Grotesk'] text-2xl font-bold text-[#16324F] mb-2">
              Envoyer un message
            </h3>
            <p className="font-['Inter'] text-sm text-[#40484e] mb-8">
              Remplissez le formulaire ci-dessous et je vous répondrai dans les
              plus brefs délais.
            </p>

            {submitSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-[#c7e7ff]/60 border border-[#7fcdff] flex items-start gap-3 animate-fadeIn text-[#004c6c]">
                <CheckCircle2 className="w-5 h-5 text-[#00658e] shrink-0 mt-0.5" />
                <div>
                  <p className="font-['Hanken_Grotesk'] font-bold text-sm">
                    Message envoyé !
                  </p>
                  <p className="font-['Inter'] text-xs text-[#00577b] mt-0.5">
                    Merci pour votre message, je vous répondrai dans les plus
                    brefs délais.
                  </p>
                </div>
              </div>
            )}

            {submitError && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 animate-fadeIn text-red-700">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-['Hanken_Grotesk'] font-bold text-sm">
                    Message non envoyé
                  </p>
                  <p className="font-['Inter'] text-xs text-red-600 mt-0.5">
                    {submitError}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Nom */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="nom"
                    className="font-['Inter'] text-xs font-bold uppercase tracking-wider text-[#16324F]"
                  >
                    Nom complet <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="nom"
                    type="text"
                    required
                    placeholder="ex. Jean Dupont"
                    value={formData.nom}
                    onChange={(e) =>
                      setFormData({ ...formData, nom: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-[#D9EAF4] focus:border-[#00658e] focus:ring-2 focus:ring-[#7fcdff]/30 text-sm font-['Inter'] text-[#16324F] outline-none transition-all"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="font-['Inter'] text-xs font-bold uppercase tracking-wider text-[#16324F]"
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="jean.dupont@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-[#D9EAF4] focus:border-[#00658e] focus:ring-2 focus:ring-[#7fcdff]/30 text-sm font-['Inter'] text-[#16324F] outline-none transition-all"
                  />
                </div>
              </div>

              {/* Sujet */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="sujet"
                  className="font-['Inter'] text-xs font-bold uppercase tracking-wider text-[#16324F]"
                >
                  Sujet de votre demande
                </label>
                <select
                  id="sujet"
                  value={formData.sujet}
                  onChange={(e) =>
                    setFormData({ ...formData, sujet: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-[#D9EAF4] focus:border-[#00658e] focus:ring-2 focus:ring-[#7fcdff]/30 text-sm font-['Inter'] text-[#16324F] outline-none transition-all bg-white cursor-pointer"
                >
                  <option value="Opportunité d'emploi">
                    Opportunité d'emploi (CDI / Alternance)
                  </option>
                  <option value="Projet Freelance">
                    Projet Freelance / Développement Web
                  </option>
                  <option value="Question Technique">
                    Question Technique / Échange Dev
                  </option>
                  <option value="Autre">Autre demande</option>
                </select>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="message"
                  className="font-['Inter'] text-xs font-bold uppercase tracking-wider text-[#16324F]"
                >
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  placeholder="Décrivez votre projet ou votre opportunité d'emploi..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-[#D9EAF4] focus:border-[#00658e] focus:ring-2 focus:ring-[#7fcdff]/30 text-sm font-['Inter'] text-[#16324F] outline-none transition-all resize-none"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full py-3.5 bg-[#00658e] hover:bg-[#004c6c] text-white font-['Inter'] text-xs font-bold tracking-wider uppercase rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span>ENVOI EN COURS...</span>
                ) : (
                  <>
                    <span>ENVOYER LE MESSAGE</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
