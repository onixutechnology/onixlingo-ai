'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import Cookies from 'js-cookie'; 
import { useUIStore } from '@/store/uiStore';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import apiClient from '@/lib/apiClient';
import { AdBanner } from '@/components/ads/AdBanner';

import { 
  ArrowLeft, BookA, Search, Play,
  Briefcase, Plane, Users, Coffee, 
  Lock, CheckCircle2, Loader2, Crown, Languages, Flame, Zap, Sparkles,
  MessageSquare, Coins, Handshake, Lightbulb
} from 'lucide-react';

// Extracted Components
import { VocabLanguageModal } from './components/VocabLanguageModal';
import { VocabLeaderboardWidget, VocabTrophiesWidget } from './components/VocabStatsWidgets';
import { getVocabularyTrophies } from '@/lib/vocabTrophies';

const CATEGORIES = [
  { id: 'basics', label: 'Life Essentials', icon: Coffee },
  { id: 'travel', label: 'Global Travel', icon: Plane },
  { id: 'business', label: 'Business & Career', icon: Briefcase },
  { id: 'marketing', label: 'Marketing & Growth', icon: Users },
  { id: 'networking', label: 'Social & Networking', icon: MessageSquare },
  { id: 'leadership', label: 'Executive Leadership', icon: Crown },
  { id: 'finance', label: 'Finance & Wealth', icon: Coins },
  { id: 'negotiation', label: 'Negotiation & Deals', icon: Handshake },
  { id: 'lifestyle', label: 'Lifestyle & Wellness', icon: Sparkles },
  { id: 'innovation', label: 'Science & Tech', icon: Lightbulb }
];

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function VocabularyPage() {
  const router = useRouter();
  const { mode, activeLanguage, setLanguage, userTier, energy, checkAndResetDailyLimits } = useUIStore();

  useEffect(() => {
    checkAndResetDailyLimits();
  }, [checkAndResetDailyLimits]);
  
  const [activeCat, setActiveCat] = useState('basics');
  const [searchTerm, setSearchTerm] = useState('');
  const [vocabProgress, setVocabProgress] = useState<any[]>([]);
  const [userStats, setUserStats] = useState({ streak: 0, totalXP: 0 });
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLangModal, setShowLangModal] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const seen = localStorage.getItem('vocab_lang_modal_seen');
      if (!seen) {
        setShowLangModal(true);
      }
    }
  }, []);

  useEffect(() => {
    const fetchCoreData = async () => {
      try {
        const results = await Promise.allSettled([
          apiClient.get('/progress/map'),
          apiClient.get('/progress/stats')
        ]);

        const rejected = results.filter((r): r is PromiseRejectedResult => r.status === 'rejected');
        if (rejected.length > 0) {
          const firstRealError = rejected.find(r => {
            const err = r.reason;
            const isAbort = err?.code === 'ERR_CANCELED' || err?.message === 'canceled' || err?.message?.includes('aborted') || err?.name === 'AbortError';
            const is401 = err?.response?.status === 401;
            return !isAbort && !is401;
          });
          if (firstRealError) {
            throw firstRealError.reason;
          }
          return;
        }

        const [mapRes, statsRes] = results.map(
          r => (r as PromiseFulfilledResult<any>).value
        );

        setVocabProgress(mapRes.data.vocab || []); 
        setUserStats({
          streak: statsRes.data.streak || 0,
          totalXP: statsRes.data.total_xp || 0
        });
      } catch (error) {
        console.error("Error cargando vocabulario:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchLeaderboard = async () => {
      try {
        const res = await apiClient.get('/progress/leaderboard');
        setLeaderboard(res.data.leaderboard || []);
      } catch (error) {
        console.warn("No se pudo cargar el leaderboard");
      }
    };

    fetchCoreData();
    fetchLeaderboard();
  }, [router, activeLanguage]);

  const dynamicLeaderboard = useMemo(() => {
    const list = [...leaderboard].filter(item => item.alias?.toLowerCase() !== 'diana');
    
    if (!list.some(item => item.isMe)) {
      list.push({
        rank: '-',
        alias: Cookies.get('username') || 'Tú',
        xp: userStats.totalXP,
        isMe: true
      });
    }

    return list
      .sort((a, b) => b.xp - a.xp)
      .map((item, idx) => ({
        rank: item.rank === '-' ? '-' : idx + 1,
        name: item.alias,
        count: `${Math.max(5, Math.round((item.xp || 0) / 8))} parejas`,
        isMe: item.isMe
      }));
  }, [leaderboard, userStats.totalXP]);

  const vocabTrophies = useMemo(() => getVocabularyTrophies(activeLanguage, vocabProgress, userStats.streak), [activeLanguage, vocabProgress, userStats.streak]);

  const getLessonState = (lessonId: string) => {
    const lessonData = vocabProgress.find(p => p.lesson_id === lessonId && p.language === activeLanguage);
    if (lessonData) {
      if (lessonData.status === 'completed') return 'completed';
      if (lessonData.status === 'active' || lessonData.is_unlocked) return 'active';
    }
    if (lessonId === 'basics_mod_1') return 'active';
    return 'locked';
  };

  const getScore = (lessonId: string) => {
    const lessonData = vocabProgress.find(p => p.lesson_id === lessonId && p.language === activeLanguage);
    return lessonData ? lessonData.score : 0;
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.03 } }
  };
  
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 } 
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50">
        <Loader2 className="animate-spin text-slate-700 mb-4" size={24} />
        <p className="text-slate-700 font-black text-[9px] uppercase tracking-[0.3em]">Neural Link Active...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 pb-32 font-sans text-black selection:bg-orange-100 selection:text-black relative">
      
      {/* --- HEADER CORPORATIVO (SQUARE) --- */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 h-16 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 border border-slate-200 text-slate-700 hover:text-slate-700 hover:border-black transition-all">
              <ArrowLeft size={18} />
            </Link>
            <div className="flex items-center gap-2">
              <div className="bg-black p-1.5 text-slate-900">
                <BookA size={18} />
              </div>
              <h1 className="text-sm font-black uppercase tracking-[0.2em] font-serif italic">Vocabulario <span className="text-slate-700">Pro</span></h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setShowLangModal(true)} 
               className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 text-black hover:text-slate-700 hover:border-black transition-all font-black text-[9px] uppercase tracking-widest bg-white"
             >
               <Languages size={14} className="text-slate-700" />
               <span>Idioma: {activeLanguage === 'en' ? 'Inglés' : activeLanguage === 'fr' ? 'Francés' : 'Chino'}</span>
             </button>

              <div className="hidden md:flex items-center gap-4">
                 <div className="flex items-center gap-2 border-r border-slate-100 pr-4">
                    <Flame size={14} className="text-rose-500" />
                    <span className="text-xs font-black">{userStats.streak}</span>
                 </div>
                 <div className="flex items-center gap-2 border-r border-slate-100 pr-4">
                    <Zap size={14} className="text-slate-700" />
                    <span className="text-xs font-black">{userStats.totalXP.toLocaleString()} XP</span>
                 </div>
                  {/* ⚡ ENERGÍA (Batería Premium) */}
                  <div className="flex items-center gap-2">
                    {userTier === 'free' ? (
                      <div className="flex items-center gap-1">
                        <div className="flex items-center">
                          <div className="relative w-14 h-5 bg-slate-900 rounded-[4px] border border-slate-700 p-0.5 flex items-center shadow-[inset_0_1.5px_4px_rgba(0,0,0,0.8)] overflow-hidden">
                            <div 
                              className={`h-full rounded-[2px] transition-all duration-500 ${
                                energy > 50 
                                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]' 
                                  : energy > 20 
                                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]' 
                                    : 'bg-gradient-to-r from-rose-600 to-rose-400 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]'
                              }`}
                              style={{ width: `${energy}%` }}
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-slate-900 font-mono leading-none tracking-wider drop-shadow-[0_1.5px_2px_rgba(0,0,0,1)]">
                              {energy}%
                            </span>
                          </div>
                          <div className="w-[3px] h-2.5 bg-slate-700 rounded-r-[2px] -ml-[1px] shadow-[0_4px_15px_rgba(234,88,12,0.05)] shrink-0" />
                        </div>
                      </div>
                    ) : (
                      <span className="text-[9px] font-black uppercase tracking-wider text-[#D4AF37]">Energía Ilimitada</span>
                    )}
                  </div>
              </div>
          </div>
        </div>
      </div>

      {/* WRAPPER PRINCIPAL CON ANUNCIOS */}
      <div className="max-w-[1700px] mx-auto flex flex-col xl:flex-row gap-6 pt-6 px-4">
        
        {/* ESPACIO PUBLICITARIO IZQUIERDO */}
        <div className="hidden xl:block w-[160px] shrink-0">
          <div className="sticky top-20 flex justify-center w-full">
             <AdBanner slot="9876543210" style={{ display: 'inline-block', width: '160px', height: '600px' }} />
          </div>
        </div>

        {/* CONTENEDOR CENTRAL */}
        <div className="flex-1 min-w-0 max-w-7xl mx-auto w-full flex flex-col">
        
        <div className="mb-10 bg-orange-100 border-l-4 border-slate-300 p-6 shadow-[0_10px_40px_rgba(234,88,12,0.12)] text-black relative overflow-hidden group rounded-none">
          <div className="absolute top-0 right-0 p-1 opacity-20"><BookA size={70} className="text-slate-700 animate-pulse" /></div>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div>
              <p className="text-[8px] font-black text-black uppercase tracking-[0.3em] mb-2 flex items-center gap-1.5">
                <Zap size={12} className="text-slate-700" />
                Word Association Training System
              </p>
              <h2 className="text-2xl font-black uppercase tracking-tight font-serif italic mb-1.5 text-black">
                Estadísticas de Asociación de Vocabulario
              </h2>
              <p className="text-black text-[10px] font-bold uppercase tracking-widest leading-relaxed max-w-xl">
                Métricas de retención y asociación de parejas de palabras registradas de forma interactiva en tu cuenta.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto shrink-0">
              <div className="p-3.5 bg-white/80 backdrop-blur-sm border border-slate-200 text-center min-w-[120px] rounded-none shadow-none">
                <p className="text-[8px] text-black font-black uppercase tracking-wider mb-1">Parejas Completadas</p>
                <p className="text-xs font-black text-black tracking-tight leading-none mt-1.5 font-mono">
                  {vocabProgress.filter(p => p.status === 'completed').length * 5} parejas
                </p>
              </div>

              <div className="p-3.5 bg-white/80 backdrop-blur-sm border border-slate-200 text-center min-w-[120px] rounded-none shadow-none">
                <p className="text-[8px] text-black font-black uppercase tracking-wider mb-1">Racha de Días</p>
                <p className="text-xs font-black text-black font-mono leading-none mt-1.5">
                  {userStats.streak} {userStats.streak === 1 ? 'día' : 'días'}
                </p>
              </div>

              <div className="p-3.5 bg-white/80 backdrop-blur-sm border border-slate-200 text-center min-w-[120px] rounded-none shadow-none">
                <p className="text-[8px] text-black font-black uppercase tracking-wider mb-1">Promedio de Acierto</p>
                <p className="text-xs font-black text-[#D4AF37] font-mono leading-none mt-1.5">
                  {(() => {
                    const completed = vocabProgress.filter(p => p.status === 'completed');
                    return completed.length > 0
                      ? Math.round(completed.reduce((acc, curr) => acc + (curr.score || 0), 0) / completed.length)
                      : 0;
                  })()}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* --- GRID DE EXCELENCIA: RANKING Y TROFEOS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <VocabLeaderboardWidget leaderboard={dynamicLeaderboard} />
          <VocabTrophiesWidget trophies={vocabTrophies} />
        </div>

        {/* --- SINCRONIZACIÓN --- */}
        {(activeLanguage !== 'en' && activeLanguage !== 'fr' && activeLanguage !== 'zh') ? (
          <div className="bg-white border border-slate-200 p-12 text-center flex flex-col items-center justify-center shadow-[0_4px_15px_rgba(234,88,12,0.05)]">
            <div className="w-16 h-16 bg-orange-100 text-slate-700 flex items-center justify-center mb-6 border border-slate-200">
              <Languages size={32} />
            </div>
            <h3 className="text-xl font-black text-black mb-2 uppercase tracking-tight font-serif italic">Glosario en Sincronización</h3>
            <p className="text-slate-700 max-w-md mx-auto mb-8 text-[11px] font-bold uppercase tracking-widest leading-relaxed">
              El diccionario interactivo para <strong>{activeLanguage === 'fr' ? 'Francés' : 'Chino'}</strong> está siendo indexado.
            </p>
            <button onClick={() => setLanguage('en')} className="bg-slate-900 text-slate-900 font-black px-8 py-3 rounded-none hover:bg-slate-700 transition-all text-[10px] uppercase tracking-widest">
              Regresar a Inglés
            </button>
          </div>
        ) : (
          <>
            {/* --- SELECTOR DE CATEGORÍAS (CUADRADO) --- */}
            <div className="mb-12 border-b border-slate-200 flex flex-wrap gap-1">
              {CATEGORIES.map((cat) => {
                const isActive = activeCat === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCat(cat.id)}
                    className={`
                      px-6 py-4 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2
                      ${isActive 
                        ? 'border-black bg-white text-slate-700' 
                        : 'border-transparent text-slate-700 hover:text-black hover:bg-white'}
                    `}
                  >
                    <cat.icon size={14} />
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* --- HEADER DINÁMICO --- */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={14} className="text-slate-700" />
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-700">Directorio Técnico</span>
                </div>
                <h2 className="text-4xl font-black text-black tracking-tighter uppercase mb-4 font-serif italic">
                  {CATEGORIES.find(c => c.id === activeCat)?.label}
                </h2>
                <p className="text-black text-[11px] font-bold uppercase tracking-widest leading-relaxed opacity-80">
                  Léxico corporativo de alto rendimiento. Módulos diseñados para el dominio de terminología C-Level y gestión ejecutiva global.
                </p>
              </div>

              <div className="relative w-full lg:w-80 group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-700" />
                </div>
                <input 
                  type="text"
                  placeholder="FILTRAR MÓDULOS..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-none outline-none focus:border-black transition-all font-black text-[10px] uppercase tracking-widest"
                />
              </div>
            </div>

            {/* --- GRID DE LECCIONES --- */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              key={activeCat}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {LEVELS.flatMap((level, levelIndex) => {
                const partsCount = 10;
                const partsArray = Array.from({ length: partsCount }, (_, i) => i + 1);
                
                return partsArray.map(part => {
                  const moduleNum = (levelIndex * partsCount) + part;
                  const moduleStr = moduleNum.toString();
                  const lessonId = `${activeCat}_mod_${moduleStr}`;
                  
                  const status = getLessonState(lessonId);
                  const score = getScore(lessonId);
                  
                  const isPremiumModule = moduleNum > 18; 
                  const isTierLocked = isPremiumModule && userTier === 'free';
                  const isProgressionLocked = status === 'locked';
                  const isLocked = isProgressionLocked || isTierLocked;

                  const categoryNames: Record<string, string> = {
                    basics: 'Life Essentials', travel: 'Global Travel', business: 'Business & Career',
                    marketing: 'Marketing & Growth', networking: 'Social & Networking',
                    leadership: 'Executive Leadership', finance: 'Finance & Wealth',
                    negotiation: 'Negotiation & Deals', lifestyle: 'Lifestyle & Wellness',
                    innovation: 'Science & Tech'
                  };
                  
                  const categorySubtitles: Record<string, string> = {
                    basics: 'Core Assets', travel: 'Transit Assets', business: 'Executive Assets',
                    marketing: 'Growth Assets', networking: 'Social Assets', leadership: 'Rhetoric Assets',
                    finance: 'Wealth Assets', negotiation: 'Bargaining Assets', lifestyle: 'Wellness Assets',
                    innovation: 'Future Assets'
                  };

                  const displayTitle = `${categoryNames[activeCat] || activeCat.toUpperCase()} • ${level}`;
                  const subTitle = `Part ${part}: ${categorySubtitles[activeCat] || 'Technical Assets'}`;
                
                if (searchTerm && !displayTitle.toLowerCase().includes(searchTerm.toLowerCase())) return null;

                const CardContent = (
                  <div className={`
                    h-full border p-6 flex flex-col justify-between transition-all duration-300 rounded-none relative overflow-hidden group
                    ${!isLocked 
                      ? 'bg-white border-slate-200 hover:border-black hover:shadow-[0_10px_40px_rgba(234,88,12,0.12)]' 
                      : 'bg-orange-50 border-slate-100 opacity-60 cursor-not-allowed'}
                  `}>
                    
                    <div className="flex items-start gap-4 mb-8">
                      <div className={`
                        w-12 h-12 flex flex-col items-center justify-center font-black text-xs border transition-colors
                        ${!isLocked ? 'bg-orange-50 border-slate-200 text-slate-700' : 'bg-orange-100 border-slate-200 text-slate-700'}
                      `}>
                        {level}
                        <span className="text-[7px] font-black opacity-60">P{part}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className={`font-black text-xs uppercase tracking-tight mb-1 transition-colors flex items-center gap-1.5 ${!isLocked ? 'text-black' : 'text-slate-700'}`}>
                          {displayTitle}
                          {isPremiumModule && <span className="px-1.5 py-[1px] bg-slate-900 text-slate-900 text-[6px] tracking-widest rounded-none shadow-none">PRO</span>}
                        </h3>
                        <p className="text-[8px] font-black text-slate-700 uppercase tracking-[0.2em]">
                          {subTitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-[8px] font-black text-slate-700 uppercase tracking-widest mb-1.5">
                          <span>Dominio Técnico</span>
                          <span className={score > 0 ? 'text-slate-700' : ''}>{score}%</span>
                        </div>
                        <div className="w-full h-1 bg-orange-100 rounded-none overflow-hidden">
                          <div 
                            className="h-full bg-black transition-all duration-1000" 
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>

                      <div className={`
                        w-10 h-10 flex items-center justify-center transition-all duration-300 border
                        ${isLocked ? 'bg-orange-50 text-slate-500 border-slate-100' : 'bg-white text-slate-700 group-hover:bg-black group-hover:text-slate-900 border-slate-200 group-hover:border-black'}
                      `}>
                        {isLocked ? <Lock size={16} /> : (status === 'completed' ? <CheckCircle2 size={18} /> : <Play size={16} fill="currentColor" />)}
                      </div>
                    </div>
                  </div>
                );

                return (
                  <motion.div variants={itemVariants} key={lessonId} className="h-full">
                    {isLocked ? CardContent : (
                      <Link href={`/lesson/vocabulary/${lessonId}?type=vocab`} className="h-full block">
                        {CardContent}
                      </Link>
                    )}
                  </motion.div>
                );
                });
              })}
            </motion.div>
          </>
        )}
        </div> {/* CIERRE CONTENEDOR CENTRAL */}

        {/* AdSense Derecho */}
        <div className="hidden xl:block w-[160px] shrink-0">
          <div className="sticky top-24 flex justify-center w-full">
            <AdBanner slot="2348572911" style={{ display: 'inline-block', width: '160px', height: '600px' }} />
          </div>
        </div>

      </div>

      <AnimatePresence>
        {showLangModal && (
          <VocabLanguageModal 
            activeLanguage={activeLanguage}
            setLanguage={setLanguage}
            onClose={() => setShowLangModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}