import React from 'react';
import { Project } from '../types';
import { X, ExternalLink, Github, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#16324F]/50 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white w-full max-w-3xl rounded-[24px] shadow-2xl border border-[#D9EAF4] overflow-hidden flex flex-col max-h-[90vh] relative animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div className="relative h-64 sm:h-80 bg-[#16324F] overflow-hidden">
          <img
            src={project.image}
            alt={project.alt}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#16324F] via-[#16324F]/30 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/80 hover:bg-white text-[#16324F] backdrop-blur-md shadow-md transition-all focus:outline-none"
            aria-label="Fermer la boîte de dialogue"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title & Badge */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-[#00658e] text-white text-xs font-bold font-['Inter'] rounded-full uppercase tracking-wider">
                {project.year}
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold font-['Inter'] rounded-full uppercase tracking-wider">
                {project.category}
              </span>
            </div>
            <h3 className="font-['Hanken_Grotesk'] text-2xl sm:text-3xl font-bold">
              {project.title}
            </h3>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex flex-col gap-6">
          <div>
            <h4 className="font-['Hanken_Grotesk'] text-lg font-bold text-[#16324F] mb-2">
              Présentation du Projet
            </h4>
            <p className="font-['Inter'] text-sm sm:text-base text-[#40484e] leading-relaxed">
              {project.longDescription || project.description}
            </p>
          </div>

          {/* Key Metrics if any */}
          {project.metrics && (
            <div>
              <h4 className="font-['Hanken_Grotesk'] text-sm font-bold text-[#16324F] uppercase tracking-wider mb-3">
                Indicateurs & Performance
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {project.metrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#edf4ff] border border-[#D9EAF4] flex flex-col"
                  >
                    <span className="text-xs text-[#7B8FA3] font-['Inter']">{m.label}</span>
                    <span className="text-lg font-bold font-['Hanken_Grotesk'] text-[#00658e] mt-0.5">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tech Stack */}
          <div>
            <h4 className="font-['Hanken_Grotesk'] text-sm font-bold text-[#16324F] uppercase tracking-wider mb-3">
              Stack Technique & Outils
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 bg-[#edf4ff] text-[#00658e] font-['JetBrains_Mono'] text-xs font-semibold rounded-lg border border-[#D9EAF4]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Action links */}
          <div className="pt-4 border-t border-[#D9EAF4] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#2ECC71] font-semibold font-['Inter']">
              <ShieldCheck className="w-4 h-4" />
              <span>Code vérifié & testé en production</span>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <a
                href={project.githubUrl || '#'}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-white border border-[#D9EAF4] text-[#16324F] hover:bg-[#edf4ff] font-['Inter'] text-xs font-bold rounded-lg transition-all flex items-center gap-2"
              >
                <Github className="w-4 h-4" />
                <span>Voir le GitHub</span>
              </a>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-[#00658e] hover:bg-[#004c6c] text-white font-['Inter'] text-xs font-bold rounded-lg transition-all shadow-sm flex items-center gap-2"
              >
                <span>Fermer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
