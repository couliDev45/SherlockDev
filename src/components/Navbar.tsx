import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { NavSection } from '../types';
import { Menu, X, Code2, Shield, Download, FileText } from 'lucide-react';

interface NavbarProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onNavigate }) => {
  const { assets, profile, setIsAdminOpen } = usePortfolio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: NavSection; label: string }[] = [
    { id: 'accueil', label: 'ACCUEIL' },
    { id: 'a-propos', label: 'À PROPOS' },
    { id: 'competences', label: 'COMPÉTENCES' },
    { id: 'projets', label: 'PROJETS' },
    { id: 'parcours', label: 'PARCOURS' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const handleNavClick = (sectionId: NavSection) => {
    onNavigate(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F8FCFF]/90 backdrop-blur-xl shadow-[0_1px_12px_rgba(22,50,79,0.06)] border-b border-[#D9EAF4]/60'
          : 'bg-[#F8FCFF]/80 backdrop-blur-md'
      }`}
    >
      <div className="h-20 max-w-[1200px] mx-auto px-5 lg:px-10 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => handleNavClick('accueil')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="relative flex items-center justify-center">
            <img
              src={assets.logo}
              alt="Logo CouliDev"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
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
              className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#00658e] to-[#65c1fe] text-white flex items-center justify-center font-bold text-sm shadow-sm"
            >
              <Code2 className="w-5 h-5" />
            </div>
          </div>
          <span className="font-['Hanken_Grotesk'] text-2xl font-bold tracking-tight text-[#16324F] group-hover:text-[#00658e] transition-colors">
            CouliDev
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold tracking-wider font-['Inter']">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative py-1 transition-colors duration-200 uppercase focus:outline-none ${
                  isActive
                    ? 'text-[#00658e] font-extrabold'
                    : 'text-[#40484e] hover:text-[#00658e] font-bold'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#00658e] rounded-full animate-fadeIn" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Profile Avatar, Download CV & Admin Action */}
        <div className="flex items-center gap-3">
          {/* Download CV Button */}
          <a
            href={assets.cvUrl}
            download={assets.cvFileName}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 bg-[#edf4ff] hover:bg-[#d8eaff] text-[#00658e] border border-[#D9EAF4] rounded-lg font-['Inter'] text-xs font-bold transition-all shadow-sm"
            title="Télécharger mon CV au format PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CV</span>
          </a>

          {/* Admin Dashboard Trigger */}
          <button
            onClick={() => setIsAdminOpen(true)}
            className="p-2 rounded-xl bg-[#16324F] hover:bg-[#00658e] text-white shadow-sm transition-all flex items-center justify-center gap-1.5 focus:outline-none"
            title="Ouvrir le Tableau de Bord Admin (Gestion Images, Projets, CV)"
          >
            <Shield className="w-4 h-4 text-[#65c1fe]" />
            <span className="text-[11px] font-['Inter'] font-bold uppercase tracking-wider hidden lg:inline">
              Admin
            </span>
          </button>

          {/* Avatar Profile */}
          <div className="relative group cursor-pointer" onClick={() => handleNavClick('a-propos')}>
            <img
              src={assets.avatar}
              alt={profile.name}
              className="w-10 h-10 rounded-full border-2 border-[#7fcdff] object-cover transition-transform group-hover:scale-105 shadow-sm"
            />
            <span
              title={profile.status}
              className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#2ECC71] border-2 border-white ring-1 ring-[#2ECC71]/30"
            />
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#16324F] hover:bg-[#edf4ff] transition-colors focus:outline-none"
            aria-label="Menu mobile"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F8FCFF]/98 border-b border-[#D9EAF4] px-5 py-4 backdrop-blur-xl shadow-lg transition-all">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left px-4 py-3 rounded-xl font-['Inter'] text-sm tracking-wider font-bold uppercase transition-all ${
                    isActive
                      ? 'bg-[#edf4ff] text-[#00658e] font-extrabold'
                      : 'text-[#40484e] hover:bg-[#edf4ff]/60 hover:text-[#00658e]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            <div className="pt-2 border-t border-[#D9EAF4] flex items-center justify-between">
              <a
                href={assets.cvUrl}
                download={assets.cvFileName}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 bg-[#edf4ff] text-[#00658e] rounded-xl font-['Inter'] text-xs font-bold"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger mon CV</span>
              </a>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAdminOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#16324F] text-white rounded-xl font-['Inter'] text-xs font-bold"
              >
                <Shield className="w-4 h-4 text-[#65c1fe]" />
                <span>Dashboard Admin</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
