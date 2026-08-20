import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowRight, Mail, Code2, FileCode, Database, Cloud, Download, Sparkles } from 'lucide-react';
import { NavSection } from '../types';

interface HeroSectionProps {
  onNavigate: (section: NavSection) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const { profile, assets } = usePortfolio();

  return (
    <section
      id="accueil"
      className="relative w-full min-h-[calc(100vh-80px)] flex flex-col justify-center overflow-hidden bg-[#F8FCFF] pt-20"
    >
      {/* Background Tech Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />

      {/* Atmospheric Ambient Glows */}
      <div className="absolute -top-24 right-[-10%] w-[550px] h-[550px] rounded-full bg-[#cde5ff] blur-[120px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-15%] w-[480px] h-[480px] rounded-full bg-[#c7e7ff] blur-[140px] opacity-45 pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-5 lg:px-10 py-16 lg:py-24 flex flex-col justify-center items-start">
        {/* Eyebrow / Tag */}
        <div className="flex items-center gap-3 mb-6">
          <span className="w-8 h-[2px] bg-[#00658e]" />
          <span className="font-['Inter'] text-xs font-bold tracking-[0.2em] text-[#00658e] uppercase flex items-center gap-2">
            <span>PORTFOLIO DÉVELOPPEUR JUNIOR</span>
            <span className="px-2 py-0.5 rounded-full bg-[#2ECC71]/15 text-[#2ECC71] border border-[#2ECC71]/30 font-extrabold text-[10px]">
              DISPONIBLE
            </span>
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="font-['Hanken_Grotesk'] text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[#16324F] max-w-4xl mb-6 leading-[1.15] tracking-tight">
          {profile.title}{' '}
          <span className="text-[#00658e] relative inline-block">
            Passionné
            <svg
              className="absolute w-full h-3.5 -bottom-1 left-0 -z-10 text-[#c9e6ff] opacity-80"
              preserveAspectRatio="none"
              viewBox="0 0 100 20"
            >
              <path d="M0 15 Q 50 0 100 15 L 100 20 L 0 20 Z" fill="currentColor" />
            </svg>
          </span>
        </h1>

        {/* Subtitle description */}
        <p className="font-['Inter'] text-lg sm:text-xl text-[#40484e] max-w-2xl mb-10 leading-relaxed">
          {profile.bio}
        </p>

        {/* CTA Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => onNavigate('projets')}
            className="px-7 py-3.5 bg-[#00658e] text-white font-['Inter'] text-xs font-bold tracking-wider uppercase rounded-xl shadow-sm hover:bg-[#004c6c] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2.5 focus:outline-none cursor-pointer"
          >
            <span>VOIR MES PROJETS</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href={assets.cvUrl}
            download={assets.cvFileName}
            target="_blank"
            rel="noreferrer"
            className="px-7 py-3.5 bg-[#edf4ff] text-[#00658e] font-['Inter'] text-xs font-bold tracking-wider uppercase rounded-xl border border-[#7fcdff] hover:bg-[#d8eaff] hover:shadow-sm transition-all duration-300 flex items-center justify-center gap-2.5 focus:outline-none"
          >
            <span>TÉLÉCHARGER MON CV</span>
            <Download className="w-4 h-4" />
          </a>

          <button
            onClick={() => onNavigate('contact')}
            className="px-7 py-3.5 bg-white text-[#16324F] font-['Inter'] text-xs font-bold tracking-wider uppercase rounded-xl border border-[#D9EAF4] hover:bg-[#edf4ff] hover:shadow-sm transition-all duration-300 flex items-center justify-center gap-2.5 focus:outline-none cursor-pointer"
          >
            <span>ME CONTACTER</span>
            <Mail className="w-4 h-4 text-[#00658e]" />
          </button>
        </div>

        {/* Bottom Technologies Bar */}
        <div className="mt-16 lg:mt-24 pt-8 border-t border-[#D9EAF4]/80 flex flex-wrap items-center gap-6 w-full opacity-85">
          <p className="font-['Inter'] text-xs font-bold tracking-widest text-[#40484e] uppercase hidden sm:block">
            Stack Développeur Junior
          </p>
          <div className="w-px h-6 bg-[#bfc7cf] hidden sm:block" />

          <div className="flex flex-wrap items-center gap-6 text-[#40484e]">
            <div className="group relative flex items-center gap-2 text-sm font-medium hover:text-[#00658e] transition-colors cursor-default">
              <Code2 className="w-6 h-6 text-[#00658e]" />
              <span className="font-['JetBrains_Mono'] text-xs text-[#16324F]">React / Next.js</span>
            </div>

            <div className="group relative flex items-center gap-2 text-sm font-medium hover:text-[#00658e] transition-colors cursor-default">
              <FileCode className="w-6 h-6 text-[#006491]" />
              <span className="font-['JetBrains_Mono'] text-xs text-[#16324F]">Node.js / Express</span>
            </div>

            <div className="group relative flex items-center gap-2 text-sm font-medium hover:text-[#00658e] transition-colors cursor-default">
              <Database className="w-6 h-6 text-[#4c6269]" />
              <span className="font-['JetBrains_Mono'] text-xs text-[#16324F]">PostgreSQL / SQL</span>
            </div>

            <div className="group relative flex items-center gap-2 text-sm font-medium hover:text-[#00658e] transition-colors cursor-default">
              <Cloud className="w-6 h-6 text-[#7B8FA3]" />
              <span className="font-['JetBrains_Mono'] text-xs text-[#16324F]">Git & GitHub</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
