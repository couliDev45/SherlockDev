import React, { useState, useEffect } from 'react';
import { NavSection } from './types';
import { PortfolioProvider } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { TimelineSection } from './components/TimelineSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminDashboardModal } from './components/AdminDashboardModal';

function MainAppContent() {
  const [activeSection, setActiveSection] = useState<NavSection>('accueil');

  const scrollToSection = (sectionId: NavSection) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections: NavSection[] = [
        'accueil',
        'a-propos',
        'competences',
        'projets',
        'parcours',
        'contact',
      ];

      const scrollPosition = window.scrollY + 120;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FCFF] text-[#001d32] flex flex-col selection:bg-[#c7e7ff] selection:text-[#001e2e]">
      {/* Navigation Bar */}
      <Navbar activeSection={activeSection} onNavigate={scrollToSection} />

      {/* Main Content Sections */}
      <main className="flex-grow flex flex-col">
        <HeroSection onNavigate={scrollToSection} />
        <AboutSection onNavigate={scrollToSection} />
        <SkillsSection />
        <ProjectsSection />
        <TimelineSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer onNavigate={scrollToSection} />

      {/* Admin Dashboard Modal */}
      <AdminDashboardModal />
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <MainAppContent />
    </PortfolioProvider>
  );
}
