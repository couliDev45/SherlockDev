import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { NavSection } from '../types';
import { ArrowUp, Github, Linkedin, Heart, Code2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (section: NavSection) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { assets, profile } = usePortfolio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#16324F] text-white py-14 border-t border-[#16324F]/80">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10 flex flex-col gap-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src={assets.logo}
              alt="Logo CouliDev"
              className="h-8 w-auto brightness-0 invert"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                if (target.nextElementSibling) {
                  (target.nextElementSibling as HTMLElement).style.display = 'flex';
                }
              }}
            />
            <div
              style={{ display: 'none' }}
              className="w-8 h-8 rounded-lg bg-[#7fcdff] text-[#16324F] flex items-center justify-center font-bold text-sm"
            >
              <Code2 className="w-5 h-5" />
            </div>
            <span className="font-['Hanken_Grotesk'] text-2xl font-bold tracking-tight">
              CouliDev
            </span>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-xs font-['Inter'] font-semibold tracking-wider uppercase text-gray-300">
            <button onClick={() => onNavigate('accueil')} className="hover:text-[#7fcdff] transition-colors cursor-pointer">
              Accueil
            </button>
            <button onClick={() => onNavigate('a-propos')} className="hover:text-[#7fcdff] transition-colors cursor-pointer">
              À Propos
            </button>
            <button onClick={() => onNavigate('competences')} className="hover:text-[#7fcdff] transition-colors cursor-pointer">
              Compétences
            </button>
            <button onClick={() => onNavigate('projets')} className="hover:text-[#7fcdff] transition-colors cursor-pointer">
              Projets
            </button>
            <button onClick={() => onNavigate('parcours')} className="hover:text-[#7fcdff] transition-colors cursor-pointer">
              Parcours
            </button>
            <button onClick={() => onNavigate('contact')} className="hover:text-[#7fcdff] transition-colors cursor-pointer">
              Contact
            </button>
          </nav>

          {/* Social Links & Back to top */}
          <div className="flex items-center gap-3">
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-lg bg-[#00658e] hover:bg-[#004c6c] text-white transition-colors cursor-pointer"
              title="Retour en haut"
              aria-label="Retour en haut"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-['Inter'] text-gray-400">
          <p>© {new Date().getFullYear()} {profile.name}. Portfolio Développeur Junior.</p>
          <p className="flex items-center gap-1.5">
            Développé avec <Heart className="w-3.5 h-3.5 text-[#65c1fe] fill-[#65c1fe]" /> en React & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};
