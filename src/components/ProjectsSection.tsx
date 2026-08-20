import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Project } from '../types';
import { ArrowRight, Code, ArrowUpRight, FileText, FolderGit2 } from 'lucide-react';
import { ProjectModal } from './ProjectModal';

export const ProjectsSection: React.FC = () => {
  const { projects } = usePortfolio();
  const [activeFilter, setActiveFilter] = useState<string>('Tous');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filterCategories = ['Tous', 'React', 'Node.js', 'UI/UX', 'Mobile', 'Backend'];

  const filteredProjects = projects.filter((p) => {
    if (activeFilter === 'Tous') return true;
    if (activeFilter === 'React') return p.tags.includes('React') || p.tags.includes('React Native') || p.category === 'React';
    if (activeFilter === 'Node.js') return p.tags.includes('Node.js') || p.category === 'Node.js';
    if (activeFilter === 'UI/UX') return p.tags.includes('Figma') || p.category === 'UI/UX';
    if (activeFilter === 'Mobile') return p.tags.includes('Mobile') || p.tags.includes('React Native') || p.category === 'Mobile';
    if (activeFilter === 'Backend') return p.tags.includes('Backend') || p.category === 'Backend' || p.category === 'Node.js';
    return true;
  });

  return (
    <section id="projets" className="w-full py-20 lg:py-28 bg-[#F8FCFF] relative">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#65c1fe] rounded-full blur-[140px] opacity-15 pointer-events-none translate-x-1/3 -translate-y-1/4" />

      <div className="max-w-[1200px] mx-auto px-5 lg:px-10 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-start max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-8 h-[2px] bg-[#00658e]" />
            <span className="font-['Inter'] text-xs font-bold tracking-[0.2em] text-[#00658e] uppercase">
              RÉALISATIONS
            </span>
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#16324F] leading-tight mb-4">
            Projets & Applications Web
          </h2>
          <p className="font-['Inter'] text-base sm:text-lg text-[#40484e] max-w-2xl leading-relaxed">
            Découvrez une sélection de mes projets de formation et réalisations personnelles. Chaque projet est conçu avec soin pour mettre en œuvre les meilleures pratiques du web moderne.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 mb-10">
          {filterCategories.map((f) => {
            const isActive = activeFilter === f;
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-5 py-2.5 rounded-xl font-['Inter'] text-xs font-bold tracking-wider transition-all duration-200 focus:outline-none cursor-pointer ${
                  isActive
                    ? 'bg-[#00658e] text-white shadow-sm'
                    : 'bg-white text-[#40484e] border border-[#D9EAF4] hover:border-[#00658e] hover:text-[#00658e]'
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* Dynamic Project Grid */}
        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-[#D9EAF4] text-center flex flex-col items-center gap-4 my-6">
            <FolderGit2 className="w-12 h-12 text-[#7B8FA3]" />
            <p className="font-['Hanken_Grotesk'] text-lg font-bold text-[#16324F]">
              Aucun projet trouvé dans cette catégorie.
            </p>
            <p className="font-['Inter'] text-xs text-[#7B8FA3]">
              Vous pouvez ajouter de nouveaux projets via le Dashboard Admin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, idx) => {
              const isFirstFeatured = idx === 0 && project.featured;

              return (
                <article
                  key={project.id}
                  className={`group bg-white rounded-[24px] shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-[#D9EAF4] flex flex-col ${
                    isFirstFeatured ? 'md:col-span-2 lg:col-span-3 lg:flex-row' : ''
                  }`}
                >
                  {/* Image Container */}
                  <div
                    className={`p-4 bg-[#f2f7fb] overflow-hidden relative ${
                      isFirstFeatured ? 'lg:w-[50%] h-[280px] lg:h-auto min-h-[300px]' : 'h-[220px]'
                    }`}
                  >
                    <div className="w-full h-full rounded-[16px] overflow-hidden relative shadow-inner">
                      <img
                        src={project.image}
                        alt={project.alt || project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-3 py-1 bg-[#16324F]/85 backdrop-blur-md text-white text-[11px] font-bold font-['Inter'] rounded-full uppercase tracking-wider">
                          {project.category}
                        </span>
                        {project.featured && (
                          <span className="px-2.5 py-1 bg-[#00658e] text-white text-[10px] font-bold font-['Inter'] rounded-full uppercase tracking-wider">
                            ★ En Vedette
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div
                    className={`p-6 sm:p-7 flex-grow flex flex-col justify-between ${
                      isFirstFeatured ? 'lg:w-[50%]' : ''
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-['Hanken_Grotesk'] text-xl sm:text-2xl font-bold text-[#16324F]">
                          {project.title}
                        </h3>
                        <span className="px-3 py-1 bg-[#edf4ff] rounded-full font-['Inter'] text-xs font-bold text-[#00658e]">
                          {project.year}
                        </span>
                      </div>

                      <p className="font-['Inter'] text-sm text-[#40484e] mb-6 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    <div>
                      {/* Tech Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-1 bg-[#edf4ff] text-[#16324F] font-['JetBrains_Mono'] text-xs rounded-md border border-[#D9EAF4]/80"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Card Actions */}
                      <div className="flex items-center gap-3 pt-4 border-t border-[#D9EAF4]">
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="px-4 py-2.5 bg-[#00658e] hover:bg-[#004c6c] text-white font-['Inter'] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <span>DÉTAILS</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2.5 bg-white text-[#16324F] border border-[#D9EAF4] hover:bg-[#edf4ff] font-['Inter'] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                          >
                            <Code className="w-3.5 h-3.5 text-[#00658e]" />
                            <span>CODE</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Interactive Project Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
