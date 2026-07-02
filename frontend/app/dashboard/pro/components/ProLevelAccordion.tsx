'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Play, Check, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProLevelAccordionProps {
  currentCurriculum: any[];
  levelConfig: Record<string, any>;
  proProgress: any[];
  activeLanguage: string;
  expandedSection: string | null;
  toggleSection: (id: string) => void;
}

export const ProLevelAccordion = ({
  currentCurriculum,
  levelConfig,
  proProgress,
  activeLanguage,
  expandedSection,
  toggleSection
}: ProLevelAccordionProps) => {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3">
      {currentCurriculum.map((section, sectionIndex) => {
        const cfg = levelConfig[section.level] || levelConfig['B1'];
        const isOpen = expandedSection === section.id;
        const completedCount = section.lessons.filter(
          (l: any) => proProgress.find(p => p.lesson_id === l.id && (p.language === activeLanguage || (!p.language && activeLanguage === 'en')))?.status === 'completed'
        ).length;
        const progressPct = Math.round((completedCount / section.lessons.length) * 100);

        return (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.06 }}
            className={`border border-teal-800/15 bg-white/40 backdrop-blur-sm overflow-hidden transition-all duration-300 shadow-none hover:bg-white/50 ${isOpen ? 'shadow-none border-teal-700/40 bg-white/65' : ''}`}
          >
            {/* ACCORDION HEADER */}
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full p-5 flex items-center justify-between hover:bg-white/20 transition-colors text-left"
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* Level color stripe */}
                <div className={`w-1 h-12 bg-gradient-to-b ${cfg.gradient} flex-shrink-0`} />

                <div className={`w-11 h-11 ${cfg.iconBg} border ${cfg.border} flex items-center justify-center flex-shrink-0 shadow-none`}>
                  <section.icon size={20} className={cfg.iconColor} />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-none">
                      {section.title}
                    </h3>
                    <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border ${cfg.badge} shadow-xs`}>
                      {section.level}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 font-medium mt-1 truncate max-w-sm">{section.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                <div className="hidden md:flex flex-col items-end gap-1">
                  <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">
                    {completedCount}/{section.lessons.length} completadas
                  </span>
                  <div className="w-24 h-1 bg-white rounded-none">
                    <div
                      className={`h-full bg-gradient-to-r ${cfg.gradient} transition-all duration-500`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                <ChevronDown
                  size={16}
                  className={`text-teal-800 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
              </div>
            </button>

            {/* ACCORDION BODY */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-slate-200 p-4 grid grid-cols-1 sm:grid-cols-2 gap-1.5 bg-white/20">
                    {section.lessons.map((lesson: any, idx: number) => {
                      const lessonStatus = proProgress.find(p => p.lesson_id === lesson.id && (p.language === activeLanguage || (!p.language && activeLanguage === 'en')))?.status
                        || (lesson.id === 'pro-exec-b1-1' || lesson.id === 'pro-b1-1' ? 'active' : 'locked');
                      const isLocked = lessonStatus === 'locked';
                      const isCompleted = lessonStatus === 'completed';

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => !isLocked && router.push(`/lesson/${lesson.id}?type=pro`)}
                          disabled={isLocked}
                          className={`flex items-center justify-between px-4 py-3 border transition-all text-left group/lesson
                            ${isLocked
                              ? 'border-transparent bg-white/5 opacity-60 cursor-not-allowed'
                              : isCompleted
                                ? 'border-emerald-600/20 bg-emerald-600/5 cursor-pointer hover:bg-emerald-600/10'
                                : 'border-transparent hover:border-teal-800/15 hover:bg-white/60 cursor-pointer'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 flex items-center justify-center flex-shrink-0 text-[10px] font-black
                              ${isCompleted ? 'text-[#D4AF37]' : isLocked ? 'text-slate-500' : 'text-teal-700'}`}>
                              {isCompleted
                                ? <Check size={13} />
                                : isLocked
                                  ? <Lock size={11} />
                                  : <span>{idx + 1}</span>
                              }
                            </div>
                            <span className={`text-[11px] font-bold uppercase tracking-tight
                              ${isLocked ? 'text-slate-500 font-medium' : isCompleted ? 'text-[#D4AF37]' : 'text-slate-900 group-hover/lesson:text-slate-900'}`}>
                              {lesson.title}
                            </span>
                          </div>
                          <Play
                            size={11}
                            className={`flex-shrink-0 transition-transform group-hover/lesson:translate-x-0.5
                              ${isLocked ? 'text-slate-300' : 'text-[#D4AF37]'}`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};
