import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Layout, Server, Database, Wrench, GitBranch, Code2, PenTool, CheckCircle, Flame } from 'lucide-react';

export const SkillsSection: React.FC = () => {
  const { skills } = usePortfolio();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layout':
        return <Layout className="w-8 h-8 text-[#00658e] group-hover:rotate-6 transition-transform duration-300" />;
      case 'Server':
        return <Server className="w-8 h-8 text-[#006491] group-hover:rotate-6 transition-transform duration-300" />;
      case 'Database':
        return <Database className="w-8 h-8 text-[#4c6269] group-hover:rotate-6 transition-transform duration-300" />;
      case 'Wrench':
        return <Wrench className="w-8 h-8 text-[#7B8FA3] group-hover:rotate-6 transition-transform duration-300" />;
      default:
        return <Code2 className="w-8 h-8 text-[#00658e]" />;
    }
  };

  const getToolIcon = (tool: string) => {
    switch (tool.toLowerCase()) {
      case 'git':
        return <GitBranch className="w-4 h-4 text-[#00658e]" />;
      case 'vs code':
        return <Code2 className="w-4 h-4 text-[#006491]" />;
      case 'figma':
        return <PenTool className="w-4 h-4 text-[#4c6269]" />;
      default:
        return <CheckCircle className="w-4 h-4 text-[#00658e]" />;
    }
  };

  return (
    <section id="competences" className="w-full py-20 lg:py-28 bg-[#F8FCFF] relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#cde5ff] rounded-full blur-[100px] opacity-40 pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-[#c7e7ff] rounded-full blur-[100px] opacity-40 pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-5 lg:px-10 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col gap-3 mb-14">
          <div className="inline-flex items-center gap-2">
            <span className="w-8 h-[2px] bg-[#00658e]" />
            <span className="font-['Inter'] text-xs font-bold tracking-[0.2em] text-[#00658e] uppercase">
              EXPERTISE
            </span>
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#16324F] leading-tight">
            Compétences & <br className="hidden sm:inline" />Expertise
          </h2>
          <p className="font-['Inter'] text-base sm:text-lg text-[#40484e] max-w-2xl mt-1">
            Une vue détaillée de mon arsenal technique, combinant des fondations solides et une veille technologique continue pour construire des expériences numériques performantes.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((category) => {
            const isHovered = hoveredCard === category.id;

            return (
              <div
                key={category.id}
                onMouseEnter={() => setHoveredCard(category.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border border-[#D9EAF4] flex flex-col gap-4 group cursor-default relative isolate"
              >
                {/* Top Icon & Title */}
                <div className="flex items-center gap-3">
                  {getIcon(category.icon)}
                  <h3 className="font-['Hanken_Grotesk'] text-xl font-bold text-[#16324F]">
                    {category.title}
                  </h3>
                </div>

                {/* Subtitle */}
                <p className="font-['Inter'] text-xs sm:text-sm text-[#40484e] leading-relaxed">
                  {category.description}
                </p>

                {/* Skills with Progress Bars */}
                {category.skills && category.skills.length > 0 && (
                  <div className="flex flex-col gap-3.5 mt-2">
                    {category.skills.map((skill, sIdx) => {
                      const isExpert = skill.level === 'EXPERT';
                      const isAvance = skill.level === 'AVANCÉ';

                      return (
                        <div key={sIdx} className="flex flex-col gap-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-['JetBrains_Mono'] font-medium text-[#16324F]">
                              {skill.name}
                            </span>
                            <span
                              className={`font-['Inter'] font-bold text-[11px] tracking-wider uppercase ${
                                isExpert
                                  ? 'text-[#00658e]'
                                  : isAvance
                                  ? 'text-[#006491]'
                                  : 'text-[#7B8FA3]'
                              }`}
                            >
                              {skill.level}
                            </span>
                          </div>

                          {/* Progress Track */}
                          <div className="w-full bg-[#edf4ff] rounded-full h-2 overflow-hidden border border-[#D9EAF4]/50">
                            <div
                              className={`h-2 rounded-full transition-all duration-700 ease-out ${
                                isExpert
                                  ? 'bg-[#00658e]'
                                  : isAvance
                                  ? 'bg-[#006491]'
                                  : 'bg-[#7fcdff]'
                              }`}
                              style={{
                                width: `${skill.percentage}%`,
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Tools Badges / Pills */}
                {category.badges && category.badges.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {category.badges.map((badge, bIdx) => (
                      <span
                        key={bIdx}
                        className="px-3 py-1.5 bg-[#edf4ff] hover:bg-[#d8eaff] text-[#16324F] font-['JetBrains_Mono'] text-xs font-semibold rounded-full border border-[#D9EAF4] flex items-center gap-1.5 transition-colors"
                      >
                        {getToolIcon(badge)}
                        {badge}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
