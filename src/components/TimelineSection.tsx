import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Calendar, CheckCircle2, Milestone } from 'lucide-react';

export const TimelineSection: React.FC = () => {
  const { timeline } = usePortfolio();

  return (
    <section id="parcours" className="w-full py-20 lg:py-28 bg-[#F8FCFF] relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-10 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-[2px] bg-[#00658e]" />
            <span className="font-['Inter'] text-xs font-bold tracking-[0.2em] text-[#00658e] uppercase">
              CHRONOLOGIE
            </span>
            <span className="w-6 h-[2px] bg-[#00658e]" />
          </div>
          <h2 className="font-['Hanken_Grotesk'] text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#16324F] leading-tight mb-4">
            Parcours & Apprentissage
          </h2>
          <p className="font-['Inter'] text-base sm:text-lg text-[#40484e] max-w-2xl leading-relaxed">
            Mon évolution dans le développement web, mes formations et les projets clés qui jalonnent mon parcours de développeur junior.
          </p>
        </div>

        {/* Timeline Structure */}
        <div className="relative">
          {/* Central Vertical Line (Desktop) & Left Line (Mobile) */}
          <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-[2px] bg-[#D9EAF4] -translate-x-1/2" />

          <div className="flex flex-col gap-10 md:gap-14">
            {timeline.map((item, idx) => {
              const isLeft = item.align === 'left';

              return (
                <div
                  key={idx}
                  className={`relative flex flex-col md:flex-row items-start md:items-center ${
                    isLeft ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Node Icon (Middle) */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-4 border-[#00658e] shadow-md z-20 flex items-center justify-center">
                    <span className="w-2 h-2 rounded-full bg-[#00658e]" />
                  </div>

                  {/* Empty side for layout symmetry */}
                  <div className="hidden md:block md:w-1/2" />

                  {/* Content Card Side */}
                  <div
                    className={`pl-12 md:pl-0 w-full md:w-1/2 ${
                      isLeft ? 'md:pr-12' : 'md:pl-12'
                    }`}
                  >
                    <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow duration-300 border border-[#D9EAF4] relative group">
                      {/* Year Badge */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 bg-[#c7e7ff] text-[#00658e] font-['JetBrains_Mono'] text-xs font-bold rounded-full">
                          {item.year}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-['Hanken_Grotesk'] text-xl sm:text-2xl font-bold text-[#16324F] mb-3 group-hover:text-[#00658e] transition-colors">
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="font-['Inter'] text-sm text-[#40484e] leading-relaxed mb-5">
                        {item.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2.5 py-1 bg-[#edf4ff] text-[#00658e] font-['JetBrains_Mono'] text-xs rounded-md border border-[#D9EAF4]/60"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
