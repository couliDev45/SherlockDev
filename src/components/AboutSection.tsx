import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { CheckCircle2, Download, Code, Sparkles, User, Award } from 'lucide-react';
import { NavSection } from '../types';

interface AboutSectionProps {
  onNavigate: (section: NavSection) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onNavigate }) => {
  const { profile, assets } = usePortfolio();

  const highlights = [
    { title: 'Code Propre & Structuré', desc: 'Composants découplés, typage TypeScript et respect des normes modern JS.' },
    { title: 'Bases Solides Full-Stack', desc: 'Développement frontend réactif avec React et backend RESTful avec Node.js.' },
    { title: 'Apprentissage Continu', desc: 'Veille technologique régulière, curiosité et adaptabilité rapide.' },
    { title: 'Esprit d’Équipe & Git', desc: 'Utilisation assidue de Git/GitHub, écoute active et rigueur de travail.' },
  ];

  return (
    <section id="a-propos" className="w-full py-20 lg:py-28 bg-[#F8FCFF] relative">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
        {/* Section Header */}
        <div className="flex flex-col items-start max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-8 h-[2px] bg-[#00658e]" />
            <span className="font-['Inter'] text-xs font-bold tracking-[0.2em] text-[#00658e] uppercase">
              À PROPOS
            </span>
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#16324F] leading-tight">
            Développeur Web Junior Déterminé & Passionné
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Avatar & Code Terminal Badge */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-md bg-white rounded-2xl p-4 shadow-md border border-[#D9EAF4]">
              <div className="relative rounded-xl overflow-hidden aspect-square mb-4 bg-gray-100">
                <img
                  src={assets.avatar}
                  alt={`Portrait ${profile.name}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#16324F]/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="font-['Hanken_Grotesk'] font-bold text-xl">{profile.name}</p>
                  <p className="font-['Inter'] text-xs text-[#c7e7ff]">{profile.title}</p>
                </div>
              </div>

              {/* Code Snippet Card */}
              <div className="bg-[#16324F] text-white p-4 rounded-xl font-['JetBrains_Mono'] text-xs leading-relaxed overflow-hidden">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-[10px] text-gray-400">developer.ts</span>
                </div>
                <p className="text-[#85cfff]">const <span className="text-white">developer</span> = &#123;</p>
                <p className="pl-4 text-gray-300">name: <span className="text-[#2ECC71]">'{profile.name}'</span>,</p>
                <p className="pl-4 text-gray-300">role: <span className="text-[#65c1fe]">'Junior Full-Stack'</span>,</p>
                <p className="pl-4 text-gray-300">motivation: <span className="text-amber-400">100</span>,</p>
                <p className="text-[#85cfff]">&#125;;</p>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Values */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <p className="font-['Inter'] text-base sm:text-lg text-[#40484e] leading-relaxed">
              {profile.bio}
            </p>
            <p className="font-['Inter'] text-base sm:text-lg text-[#40484e] leading-relaxed">
              Mon objectif est d'intégrer une équipe dynamique où je pourrai mettre à profit mes compétences en React, Node.js et TypeScript, tout en continuant à apprendre au contact de développeurs expérimentés.
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-xl border border-[#D9EAF4] shadow-sm hover:border-[#7fcdff] transition-colors flex flex-col gap-1.5"
                >
                  <div className="flex items-center gap-2 text-[#00658e]">
                    <CheckCircle2 className="w-4 h-4 text-[#2ECC71]" />
                    <h3 className="font-['Hanken_Grotesk'] font-bold text-sm text-[#16324F]">{item.title}</h3>
                  </div>
                  <p className="font-['Inter'] text-xs text-[#7B8FA3] leading-normal pl-6">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 bg-[#00658e] text-white font-['Inter'] text-xs font-bold tracking-wider uppercase rounded-xl shadow-sm hover:bg-[#004c6c] transition-all cursor-pointer"
              >
                Discuter d'une opportunité
              </button>

              <a
                href={assets.cvUrl}
                download={assets.cvFileName}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 bg-[#edf4ff] text-[#00658e] border border-[#7fcdff] font-['Inter'] text-xs font-bold tracking-wider uppercase rounded-xl hover:bg-[#d8eaff] transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger mon CV</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
