'use client';

import { useState } from 'react';
import { ChevronDown, Lock, Play, Shield, Star } from 'lucide-react';
import { CHESS_LEVELS } from '../chess-data';
import { woodPanelStyle } from '../styles';

interface ChessLevelAccordionProps {
  modules: any[];
  expandedLevel: number | null;
  setExpandedLevel: (id: number | null) => void;
  userTier: string;
  setShowUpgrade: (val: boolean) => void;
}

export const ChessLevelAccordion = ({ 
  modules, 
  expandedLevel, 
  setExpandedLevel, 
  userTier, 
  setShowUpgrade 
}: ChessLevelAccordionProps) => {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const calculateProgress = (lessons: any[]) => {
    if (!lessons || lessons.length === 0) return 0;
    const completed = lessons.filter((l: any) => l.completed).length;
    return Math.round((completed / lessons.length) * 100);
  };

  return (
    <>
      {CHESS_LEVELS.map((level) => {
        const isLevelExpanded = expandedLevel === level.id;
        const levelModules = modules.filter(m => m.level === level.id);

        return (
          <div key={level.id} style={woodPanelStyle} className="rounded-none overflow-hidden transition-all duration-300 shadow-2xl">
            {/* HEADER DEL NIVEL */}
            <div 
              onClick={() => setExpandedLevel(isLevelExpanded ? null : level.id)}
              className="p-6 md:p-8 bg-[#1f0f06] border-b border-[#3c1e0a]/60 flex items-center justify-between cursor-pointer hover:bg-[#2b160b] transition-colors relative"
            >
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent pointer-events-none"></div>
              <div className="relative z-10">
                <h3 className="text-xl md:text-2xl font-black text-amber-400 font-serif italic tracking-tight">{level.title}</h3>
                <p className="text-xs text-amber-200/70 mt-1 max-w-2xl">{level.desc}</p>
              </div>
              <ChevronDown 
                size={24} 
                className={`text-amber-400 shrink-0 ml-4 transition-transform duration-200 ${isLevelExpanded ? 'rotate-180' : ''}`} 
              />
            </div>

            {/* LISTA DE MÓDULOS DENTRO DEL NIVEL */}
            {isLevelExpanded && (
              <div className="p-4 md:p-6 space-y-6 bg-[#120703]/50">
                {levelModules.map((module) => {
                  const currentProgress = calculateProgress(module.lessons);
                  const isCompleted = currentProgress === 100;

                  return (
                    <div key={module.id} style={woodPanelStyle} className={`rounded-none ${module.locked ? 'opacity-65' : 'hover:border-[#62351b]'} overflow-hidden transition-all duration-300 shadow-none`}>
                      
                      {/* HEADER DEL MÓDULO */}
                      <div 
                        onClick={() => {
                          if (module.locked) {
                            setShowUpgrade(true);
                          } else {
                            toggleModule(module.id);
                          }
                        }} 
                        className="p-5 md:p-6 flex items-start gap-5 border-b border-[#3c1e0a]/60 relative cursor-pointer hover:bg-[#361d0f]/20 transition-all"
                      >
                        {isCompleted && (
                          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/100/5 rounded-full blur-3xl"></div>
                        )}

                        <div className={`w-12 h-12 rounded-none bg-gradient-to-br ${module.color} flex items-center justify-center text-slate-900 shadow-none shrink-0 border border-black/30 ${module.locked ? 'grayscale' : ''}`}>
                          <module.icon size={24} />
                        </div>
                        
                        <div className="flex-1 relative z-10">
                          <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                            <h4 className="text-lg font-bold text-white leading-tight">{module.title}</h4>
                            <div className="flex items-center gap-3">
                              {module.locked ? (
                                <div className="flex items-center gap-2 text-slate-600 font-bold text-[10px] bg-[#221006]/85 border border-[#3c1e0a]/40 px-2 py-1 rounded-none animate-pulse">
                                  <Lock size={12} className="text-[#D4AF37]" fill="currentColor" /> Bloqueado
                                </div>
                              ) : (
                                <>
                                  <span className={`text-[10px] font-bold px-2 py-1 rounded-none border ${isCompleted ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40' : 'text-[#ecd3b5] bg-[#361d0f] border-[#502b16]'}`}>
                                    {currentProgress}% Completado
                                  </span>
                                  <ChevronDown 
                                    size={14} 
                                    className={`text-amber-400 transition-transform duration-200 ${expandedModules[module.id] ? 'rotate-180' : ''}`} 
                                  />
                                </>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-slate-300 mb-3 max-w-2xl leading-relaxed">{module.desc}</p>
                          
                          {/* Barra de Progreso */}
                          {!module.locked && (
                            <div className="h-1.5 w-full bg-[#130a04] border border-[#3c1e0a] rounded-none overflow-hidden max-w-xs">
                              <div className={`h-full bg-gradient-to-r ${module.color} transition-all duration-1000`} style={{ width: `${currentProgress}%` }}></div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* LAS 100 LECCIONES DINÁMICAS */}
                      {!module.locked && !!expandedModules[module.id] && (
                        <div className="bg-[#100501]/75 border-t border-[#3c1e0a]/40 max-h-[350px] overflow-y-auto custom-scrollbar">
                          <style>{`
                            .custom-scrollbar::-webkit-scrollbar {
                              width: 6px;
                            }
                            .custom-scrollbar::-webkit-scrollbar-track {
                              background: #100501;
                            }
                            .custom-scrollbar::-webkit-scrollbar-thumb {
                              background: #3c1e0a;
                            }
                            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                              background: #502b16;
                            }
                          `}</style>
                          {module.lessons.map((lesson: any, idx: number) => {
                            const isLessonLocked = userTier === 'free' && module.id !== 'lvl1-mod1';
                            
                            const content = (
                              <div 
                                className={`flex items-center justify-between p-3 md:px-6 border-b border-[#3c1e0a]/40 transition-colors group rounded-none w-full
                                  ${isLessonLocked ? 'opacity-40 cursor-not-allowed bg-slate-50/20' : 'hover:bg-[#D4AF37]/20/10 cursor-pointer'}`}
                                onClick={(e) => {
                                  if (isLessonLocked) {
                                    e.preventDefault();
                                    setShowUpgrade(true);
                                  }
                                }}
                              >
                                <div className="flex items-center gap-3">
                                  <div className={`w-7 h-7 rounded-none flex items-center justify-center text-[10px] font-bold border transition-colors 
                                    ${lesson.completed ? 'bg-emerald-600 border-emerald-500 text-slate-900 shadow-none' : 
                                      isLessonLocked ? 'border-slate-800 text-slate-600' : 'bg-transparent border-[#361d0f] text-[#ecd3b5]/50 group-hover:border-[#D4AF37]/30 group-hover:text-amber-400'}`}>
                                    {lesson.completed ? <Shield size={12} fill="currentColor"/> : isLessonLocked ? <Lock size={10} className="text-slate-600" /> : idx + 1}
                                  </div>
                                  <span className={`font-bold text-xs ${lesson.completed ? 'text-slate-600 line-through decoration-slate-700' : isLessonLocked ? 'text-slate-600' : 'text-[#ecd3b5] group-hover:text-white'}`}>
                                    {lesson.title}
                                  </span>
                                </div>
                                
                                {lesson.completed ? (
                                  <div className="flex items-center gap-2">
                                    <span className="text-[9px] text-amber-200/60 font-bold uppercase tracking-wider flex items-center gap-0.5">
                                      ⏱️ {((lesson.id.charCodeAt(lesson.id.length - 1) * 7) % 45) + 15}s
                                    </span>
                                    <div className="flex gap-0.5 bg-amber-950/60 px-1.5 py-0.5 rounded-none border border-amber-800/40">
                                      {[1, 2, 3].map((star) => (
                                        <Star key={star} size={10} className="text-[#D4AF37]" fill="currentColor"/>
                                      ))}
                                    </div>
                                  </div>
                                ) : isLessonLocked ? (
                                  <div className="flex items-center gap-1.5 text-slate-600 text-[10px] font-black uppercase tracking-widest mr-1">
                                    <Lock size={10} /> Locked
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-3">
                                    <span className="text-[9px] font-black text-amber-400/0 group-hover:text-amber-400 uppercase tracking-widest transition-colors">
                                      Jugar
                                    </span>
                                    <div className="w-8 h-8 rounded-none border border-[#3c1e0a] flex items-center justify-center text-[#ecd3b5]/50 group-hover:bg-amber-400 group-hover:text-slate-900 group-hover:border-amber-400 transition-all">
                                      <Play size={12} fill="currentColor"/>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );

                            return isLessonLocked ? (
                              <div key={lesson.id}>{content}</div>
                            ) : (
                              <a href={`/dashboard/chess/practice?lessonId=${lesson.id}`} key={lesson.id} className="block w-full">
                                {content}
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};
