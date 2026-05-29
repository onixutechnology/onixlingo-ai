'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen, Clock, Trophy, ArrowRight, ChevronRight, CheckCircle2,
  Sparkles, Languages, RefreshCw, Volume2, Award, Zap, HelpCircle,
  Gem, AlertCircle, Play, Check, Flame, Star, StarOff
} from 'lucide-react';

const languages = [
  { id: 'en', flag: '🇺🇸', name: 'Inglés', count: '3,000 palabras' },
  { id: 'fr', flag: '🇫🇷', name: 'Francés', count: '3,000 palabras' },
  { id: 'zh', flag: '🇨🇳', name: 'Chino Mandarín', count: '3,000 palabras' },
];

const blocks = [
  { id: 1, level: 'A1', title: 'Fundamentos Cotidianos', words: ['Hello (Hola)', 'Please (Por favor)', 'Thank you (Gracias)', 'Good morning (Buenos días)', 'Goodbye (Adiós)'], desc: 'Interacciones básicas y expresiones de cortesía cotidiana.' },
  { id: 2, level: 'A2', title: 'Expresiones del Día a Día', words: ['Family (Familia)', 'Travel (Viajar)', 'Food (Comida)', 'Shopping (Comprar)', 'Weather (Clima)'], desc: 'Conversaciones rutinarias y descripciones sencillas.' },
  { id: 3, level: 'B1', title: 'Comunicación Profesional Básica', words: ['Meeting (Reunión)', 'Project (Proyecto)', 'Client (Cliente)', 'Schedule (Calendario)', 'Task (Tarea)'], desc: 'Negociaciones iniciales y discusiones de trabajo estándar.' },
  { id: 4, level: 'B2', title: 'Negocios & Finanzas Corporativas', words: ['Assets (Activos)', 'Synergy (Sinergia)', 'Revenue (Ingresos)', 'Budget (Presupuesto)', 'Investment (Inversión)'], desc: 'Análisis de mercado, contabilidad y estrategia empresarial.' },
  { id: 5, level: 'C1', title: 'Oratoria & Negociación Avanzada', words: ['Leverage (Apalancamiento)', 'Paradigm (Paradigma)', 'Mitigate (Mitigar)', 'Consensus (Consenso)', 'Volatility (Volatilidad)'], desc: 'Estructuración lingüística de alto nivel para juntas directivas.' },
  { id: 6, level: 'C2', title: 'Dominio Fluido de C-Suite', words: ['Sovereignty (Soberanía)', 'Prerogative (Prerrogativa)', 'Ambiguity (Ambigüedad)', 'Ephemeral (Efímero)', 'Equilibrium (Equilibrio)'], desc: 'Vocabulario diplomático, gestión de crisis y matices ejecutivos.' }
];

const sampleDrills: Record<string, Array<{ word: string; pinyin?: string; translation: string; pronunciation: string; sentence: string; explanation: string }>> = {
  en: [
    { word: 'Leverage', translation: 'Apalancamiento / Aprovechar', pronunciation: '/ˈliːvərɪdʒ/', sentence: 'We must leverage our core assets to gain a market advantage.', explanation: 'Uso de una ventaja estratégica para maximizar resultados.' },
    { word: 'Synergy', translation: 'Sinergia', pronunciation: '/ˈsɪnərdʒi/', sentence: 'The merger will create significant operational synergies.', explanation: 'Acción conjunta de varios factores que genera un resultado superior a la suma de sus partes.' },
    { word: 'Mitigate', translation: 'Mitigar / Atenuar', pronunciation: '/ˈmɪtɪɡeɪt/', sentence: 'Our risk management team worked to mitigate the financial damage.', explanation: 'Reducir la severidad, gravedad o impacto negativo de un evento.' },
    { word: 'Paradigm', translation: 'Paradigma / Modelo', pronunciation: '/ˈpærədaɪm/', sentence: 'This AI technology represents a new business paradigm.', explanation: 'Un modelo o patrón aceptado que sirve como referencia en un sector.' },
    { word: 'Volatility', translation: 'Volatilidad / Inestabilidad', pronunciation: '/ˌvɒləˈtɪlɪti/', sentence: 'The market exhibits high volatility in the second quarter.', explanation: 'Medida de la frecuencia y la intensidad de los cambios de precio o condiciones.' }
  ],
  fr: [
    { word: 'Synergie', translation: 'Sinergia', pronunciation: '/si.nɛʁ.ʒi/', sentence: 'La fusion a permis de créer une excellente synergie d’équipe.', explanation: 'Collaboration efficace produisant un effet supérieur.' },
    { word: 'Atténuer', translation: 'Mitigar / Atenuar', pronunciation: '/a.te.nɥe/', sentence: 'Il faut atténuer les risques liés à ce nouveau projet.', explanation: 'Rendre moins grave, moins intense ou moins vif.' },
    { word: 'Atouts', translation: 'Activos / Ventajas', pronunciation: '/a.tu/', sentence: 'La flexibilité est l’un de nos plus grands atouts.', explanation: 'Avantage ou ressource stratégique clé.' },
    { word: 'Rentabilité', translation: 'Rentabilidad', pronunciation: '/ʁɑ̃.ta.bi.li.te/', sentence: 'Nous devons optimiser la rentabilité de cet investissement.', explanation: 'Rapport entre les revenus générés et les ressources employées.' },
    { word: 'Consensus', translation: 'Consenso', pronunciation: '/kɔ̃.sɛ̃.sys/', sentence: 'Les directeurs sont parvenus à un consensus général.', explanation: 'Accord global entre les membres d’un groupe.' }
  ],
  zh: [
    { word: '杠杆 (gànggān)', translation: 'Apalancamiento / Palanca', pronunciation: 'gàng gān', sentence: '我们必须利用金融杠杆来扩大规模。', explanation: '利用特定工具或优势以较小的投入换取较大的产出。' },
    { word: '协同 (xiétóng)', translation: 'Sinergia / Coordinación', pronunciation: 'xié tóng', sentence: '部门之间需要更紧密的协同效应。', explanation: '两个 o 多个组织共同努力，实现 1+1>2 的效果。' },
    { word: '缓解 (huǎnjié)', translation: 'Mitigar / Aliviar', pronunciation: 'huǎn jié', sentence: '新政策缓解了公司的资金链压力。', explanation: '使紧张或严重的状况得到一定程度的减轻。' },
    { word: '愿景 (yuànjǐng)', translation: 'Visión / Perspectiva', pronunciation: 'yuàn jǐng', sentence: '公司的长期愿景是成为行业领导者。', explanation: '对未来发展所勾画的蓝图或向往的景象。' },
    { word: '核心竞争 (héxīn jìngzhēng)', translation: 'Competitividad Núcleo', pronunciation: 'hé xīn jìng zhēng', sentence: '创新是我们的核心竞争力。', explanation: '企业在市场上独特的、不易被对手模仿的优势。' }
  ]
};

export default function VocabularioPage() {
  const [selectedLang, setSelectedLang] = useState('en');
  const [selectedBlock, setSelectedBlock] = useState(4); // B2 by default
  const [difficulty, setDifficulty] = useState('pro'); // pro by default (x5 VIP ticket)
  const [drillIndex, setDrillIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(120); // 2 minutes for Pro mode
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [streak, setStreak] = useState(5);
  const [srsDays, setSrsDays] = useState(1);

  // Active word list based on language
  const activeWords = sampleDrills[selectedLang] || sampleDrills.en;
  const currentWord = activeWords[drillIndex] || activeWords[0];

  // Sound playback mock
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const playWordAudio = () => {
    setIsPlayingSound(true);
    setTimeout(() => setIsPlayingSound(false), 800);
  };

  // Timer hook
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && isRunning) {
      setIsRunning(false);
      setIsCompleted(true);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  const startDrill = () => {
    setDrillIndex(0);
    setScore(0);
    setIsFlipped(false);
    setIsCompleted(false);
    if (difficulty === 'pro') {
      setTimer(120);
    } else if (difficulty === 'medio') {
      setTimer(300);
    } else {
      setTimer(999);
    }
    setIsRunning(true);
  };

  const handleNextWord = (knowsIt: boolean) => {
    if (knowsIt) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
    
    setIsFlipped(false);
    
    if (drillIndex < activeWords.length - 1) {
      setTimeout(() => {
        setDrillIndex((prev) => prev + 1);
      }, 200);
    } else {
      setIsRunning(false);
      setIsCompleted(true);
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds > 900) return 'Ilimitado';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // SRS Interval Calculator helper
  const getSrsInterval = (reviewCount: number) => {
    // E-Factor based SRS math: Interval = 2^(reviewCount * 1.2) days
    return Math.ceil(Math.pow(2, reviewCount * 1.15));
  };

  return (
    <div className="min-h-screen bg-[#edf7f2] font-sans text-slate-800 selection:bg-pink-500/20 selection:text-pink-900">
      
      {/* NAVBAR */}
      <nav className="fixed w-full bg-[#edf7f2]/95 backdrop-blur-xl border-b border-emerald-100 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/20">
              <span>O</span>
            </div>
            <span className="font-bold text-slate-900 tracking-tight text-xl">OnixLingo</span>
          </Link>
          <div className="hidden md:flex gap-8 items-center text-sm font-semibold text-slate-600">
            <Link href="/caracteristicas" className="hover:text-indigo-600 transition-colors">Características</Link>
            <Link href="/vocabulario" className="text-pink-600 border-b-2 border-pink-600 pb-0.5">Vocabulario</Link>
            <Link href="/programa-ejecutivo" className="hover:text-indigo-600 transition-colors">Programa Ejecutivo</Link>
            <Link href="/planes" className="hover:text-indigo-600 transition-colors">Planes</Link>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/login" className="hidden md:block text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Iniciar Sesión</Link>
            <Link href="/register">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 px-6 transition-all shadow-md shadow-indigo-600/20">
                Crear Cuenta Gratis
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-pink-100/60 blur-[130px] opacity-40 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-pink-200 text-pink-700 text-xs font-bold uppercase tracking-widest shadow-sm">
            <BookOpen size={12} className="text-pink-600 animate-pulse" />
            Sistema Léxico Inteligente (SRS)
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.08]">
            Expansión de Vocabulario<br />
            <span className="text-pink-600">Acelerada y Permanente.</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
            Domina 3,000 palabras cruciales por idioma (inglés, francés y chino). Diseñado con algoritmos de repetición espaciada y drills dinámicos de alto nivel para retención a largo plazo.
          </p>
          <div className="flex flex-wrap justify-center gap-6 pt-4 text-sm font-bold text-slate-600">
            <div className="flex items-center gap-2 bg-white px-4 py-2 border border-slate-200 shadow-sm">
              <Languages size={16} className="text-pink-600" />
              <span>3 Idiomas Globales</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 border border-slate-200 shadow-sm">
              <Zap size={16} className="text-indigo-600" />
              <span>Repetición Espaciada SRS</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 border border-slate-200 shadow-sm">
              <Trophy size={16} className="text-amber-500" />
              <span>Multiplicador VIP x5 en Pro</span>
            </div>
          </div>
        </div>
      </header>

      {/* LANGUAGE SELECTOR */}
      <section className="py-8 px-6 bg-white/60 border-t border-emerald-100 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-slate-900">1. Vector de Aprendizaje e Idioma Objetivo</h3>
            <p className="text-slate-500 text-xs">Cada módulo multilingüe posee un plan de estudios riguroso alineado con los niveles de competencia del MCER.</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            {languages.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  setSelectedLang(l.id);
                  setIsRunning(false);
                  setIsCompleted(false);
                }}
                className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-6 py-3.5 border font-bold transition-all ${selectedLang === l.id ? 'border-pink-500 bg-pink-50 text-pink-700 shadow-sm shadow-pink-100' : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'}`}
              >
                <span className="text-2xl">{l.flag}</span>
                <div className="text-left">
                  <p className="text-sm font-black">{l.name}</p>
                  <p className="text-[10px] text-slate-400 font-semibold">{l.count}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* BLOCKS GRID */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 space-y-2">
            <h3 className="font-bold text-2xl text-slate-900">2. Selección de Módulos Léxicos Específicos</h3>
            <p className="text-slate-500 text-sm max-w-xl">Determine el bloque léxico para el entrenamiento cognitivo. Cada unidad posee exactamente 50 unidades de terminología seleccionadas por nivel.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blocks.map((b) => (
              <div
                key={b.id}
                onClick={() => {
                  setSelectedBlock(b.id);
                  setIsRunning(false);
                  setIsCompleted(false);
                }}
                className={`p-6 border transition-all cursor-pointer relative group flex flex-col justify-between ${selectedBlock === b.id ? 'border-pink-500 bg-white shadow-lg ring-1 ring-pink-500/20' : 'border-slate-200 bg-white/80 hover:border-slate-300 shadow-sm'}`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={`px-2.5 py-1 text-xs font-black rounded-none ${b.level.startsWith('A') ? 'bg-emerald-100 text-emerald-700' : b.level.startsWith('B') ? 'bg-indigo-100 text-indigo-700' : 'bg-pink-100 text-pink-700'}`}>
                      Nivel {b.level}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Bloque {b.id} de 10</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-900 mb-1 leading-tight group-hover:text-pink-600 transition-colors">{b.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-light">{b.desc}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold">{b.words.length * 10} palabras clave</span>
                  <div className={`flex items-center gap-1 font-bold ${selectedBlock === b.id ? 'text-pink-600' : 'text-slate-600 group-hover:text-indigo-600'}`}>
                    {selectedBlock === b.id ? 'Seleccionado' : 'Seleccionar'} <ChevronRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE DRILL SIMULATOR */}
      <section className="py-16 px-6 bg-slate-900 border-t border-slate-800 text-white relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-pink-500/5 blur-[120px] pointer-events-none rounded-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          
          <div className="text-center mb-10 space-y-4">
            <span className="text-xs font-black text-pink-400 uppercase tracking-widest">Boardroom Vocab Studio</span>
            <h3 className="font-bold text-3xl tracking-tight">3. Simulador de Retención Léxica Bajo Presión Directiva</h3>
            <p className="text-slate-400 text-sm max-w-lg mx-auto">Valide su capacidad de retención inmediata bajo condiciones de estrés temporizado. El nivel Ejecutivo otorga un multiplicador de boletos x5.</p>
          </div>

          {/* Dificultad tabs */}
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-800 border border-slate-700 mb-8 max-w-xl mx-auto">
            {[
              { id: 'facil', label: 'Fácil', sub: 'Sin tiempo', color: 'border-emerald-500 text-emerald-400 bg-emerald-500/10' },
              { id: 'medio', label: 'Medio', sub: '5 min limit', color: 'border-amber-500 text-amber-400 bg-amber-500/10' },
              { id: 'pro', label: 'Pro', sub: '2 min & x5 Tickets', color: 'border-pink-500 text-pink-400 bg-pink-500/10' }
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  setDifficulty(d.id);
                  setIsRunning(false);
                  setIsCompleted(false);
                }}
                className={`py-3 px-2 text-center border transition-all ${difficulty === d.id ? d.color : 'border-transparent text-slate-400 hover:text-white'}`}
              >
                <p className="font-extrabold text-sm">{d.label}</p>
                <p className="text-[9px] text-slate-500 font-semibold uppercase mt-0.5">{d.sub}</p>
              </button>
            ))}
          </div>

          {/* SIMULATOR SCREEN CARD */}
          <div className="bg-slate-950 border border-slate-800 p-8 md:p-12 relative shadow-2xl">
            
            {/* Guest Access Alert (Branding differentiator) */}
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/35 text-amber-300 flex items-start gap-3 text-xs leading-normal">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-amber-500" />
              <div>
                <p className="font-extrabold uppercase text-[9px] tracking-wider text-amber-400 mb-0.5">Simulador de Demostración Pública (Acceso Invitado)</p>
                <p className="font-light">Esta es una versión de prueba rápida para visitantes. La plataforma Pro/Executive real contiene un registro completo de progreso, persistencia en la nube y lecciones integradas exclusivas para miembros en su área de trabajo.</p>
              </div>
            </div>
            
            {!isRunning && !isCompleted && (
              <div className="text-center space-y-6 py-8">
                <div className="w-16 h-16 bg-pink-500/10 border border-pink-500/30 text-pink-400 flex items-center justify-center mx-auto shadow-inner">
                  <Play size={32} className="ml-1" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-white">Preparado para iniciar el Bloque {selectedBlock}</h4>
                  <p className="text-slate-400 text-xs max-w-md mx-auto">
                    Idioma seleccionado: <span className="font-bold text-white">{languages.find(l => l.id === selectedLang)?.name}</span>. 
                    {difficulty === 'pro' && ' Dificultad Pro activa: Se requiere completar todas las respuestas correctas en menos de 2 minutos para el boost de tickets.'}
                  </p>
                </div>
                <button
                  onClick={startDrill}
                  className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-10 text-sm tracking-wider uppercase transition-all shadow-lg shadow-pink-600/20 active:scale-95"
                >
                  Comenzar Ejercicio
                </button>
              </div>
            )}

            {isRunning && !isCompleted && (
              <div className="space-y-8">
                
                {/* Stats Bar */}
                <div className="flex justify-between items-center border-b border-slate-800 pb-4 text-xs font-bold text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
                    <span>Progreso: {drillIndex + 1} / {activeWords.length}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Flame size={14} />
                      <span>Racha: {streak}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-pink-400 bg-pink-500/10 border border-pink-500/30 px-3 py-1">
                      <Clock size={12} />
                      <span>{formatTime(timer)}</span>
                    </div>
                  </div>
                </div>

                {/* Flip Card Section */}
                <div className="flex flex-col items-center py-6">
                  <div 
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="w-full max-w-lg min-h-[180px] bg-slate-900 border border-slate-800 hover:border-slate-700 p-8 flex flex-col justify-between items-center text-center cursor-pointer transition-all relative group select-none shadow-xl"
                  >
                    <span className="absolute top-3 right-4 text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                      {isFlipped ? 'Respuesta / Definición' : 'Haz clic para revelar'}
                    </span>

                    <div className="my-auto space-y-3">
                      {!isFlipped ? (
                        <>
                          <h4 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{currentWord.word}</h4>
                          {currentWord.pinyin && <p className="text-slate-400 text-sm">{currentWord.pinyin}</p>}
                        </>
                      ) : (
                        <>
                          <h4 className="text-2xl font-extrabold text-pink-400 tracking-tight">{currentWord.translation}</h4>
                          <p className="text-slate-300 text-sm font-medium">"{currentWord.sentence}"</p>
                          <p className="text-slate-500 text-xs max-w-md mx-auto pt-2 border-t border-slate-800/80">{currentWord.explanation}</p>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-4 text-[10px] font-bold text-slate-500">
                      <Volume2 size={14} className="text-slate-400 shrink-0" />
                      <span>{currentWord.pronunciation}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          playWordAudio();
                        }}
                        className={`ml-2 p-1.5 bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors ${isPlayingSound ? 'animate-bounce text-pink-400' : ''}`}
                      >
                        <Volume2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Flip Button or Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center border-t border-slate-800 pt-6">
                  {!isFlipped ? (
                    <button
                      onClick={() => setIsFlipped(true)}
                      className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold py-3 px-8 text-xs tracking-widest uppercase transition-all"
                    >
                      Revelar Definición
                    </button>
                  ) : (
                    <div className="flex gap-4 w-full justify-center">
                      <button
                        onClick={() => handleNextWord(false)}
                        className="flex-1 max-w-[200px] border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold py-3 text-xs tracking-wider uppercase transition-colors"
                      >
                        No la recordaba
                      </button>
                      <button
                        onClick={() => handleNextWord(true)}
                        className="flex-1 max-w-[200px] border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold py-3 text-xs tracking-wider uppercase transition-colors"
                      >
                        Sí, la recordaba
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {isCompleted && (
              <div className="text-center space-y-6 py-6">
                <div className="w-16 h-16 bg-pink-500/10 border border-pink-500/30 text-pink-400 flex items-center justify-center mx-auto shadow-inner">
                  <Award size={32} />
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-bold text-white">¡Sesión de Vocabulario Completada!</h4>
                  <p className="text-slate-400 text-xs">Has revisado todas las palabras del Bloque {selectedBlock}.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto bg-slate-900 border border-slate-800 p-4">
                  <div className="text-center border-r border-slate-800">
                    <p className="text-3xl font-black text-pink-400">{score} / {activeWords.length}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Recordadas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-black text-amber-400">
                      {difficulty === 'pro' && score === activeWords.length ? '+5 VIP' : '+1 VIP'}
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Boletos Obtenidos</p>
                  </div>
                </div>

                {difficulty === 'pro' && score === activeWords.length && (
                  <div className="bg-pink-500/10 border border-pink-500/30 p-3 max-w-md mx-auto text-xs text-pink-300 font-medium">
                    🏆 <strong>¡Boost Especial de Rendimiento PRO!</strong> Recibiste un multiplicador x5 de boletos VIP para el Sorteo Mensual de hardware de OnixCorp al completar un bloque sin fallar.
                  </div>
                )}

                <div className="flex gap-4 justify-center pt-4">
                  <button
                    onClick={startDrill}
                    className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 text-xs tracking-wider uppercase transition-colors"
                  >
                    Reintentar Bloque
                  </button>
                  <button
                    onClick={() => setIsCompleted(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold py-3 px-8 text-xs tracking-wider uppercase transition-colors"
                  >
                    Volver al Panel
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* SRS SYSTEM EXPLANATION */}
      <section className="py-24 px-6 bg-white border-t border-emerald-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-6">
              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Algoritmo Neuronal SRS</span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                El fin de olvidar.<br />
                Repetición Espaciada Integrada.
              </h2>
              <p className="text-slate-600 leading-relaxed font-light">
                ¿Por qué recordamos algunas palabras y olvidamos otras en 48 horas? El cerebro descarta información no recurrente. Nuestro algoritmo calcula la tasa de decaimiento de memoria (Curva del Olvido) basada en tus fallos y aciertos, y programa las palabras para revisión justo en el momento de debilidad léxica.
              </p>

              <div className="grid grid-cols-3 gap-4 pt-4">
                {[
                  { days: '1 día', step: 'Paso 1: Repaso' },
                  { days: '3 días', step: 'Paso 2: Retención' },
                  { days: '7 días', step: 'Paso 3: Memoria' }
                ].map((s, i) => (
                  <div key={i} className="p-4 bg-[#edf7f2] border border-emerald-100 text-center">
                    <p className="text-xl font-bold text-slate-900">{s.days}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">{s.step}</p>
                  </div>
                ))}
              </div>

              {/* Interactive SRS Calculator */}
              <div className="bg-slate-50 border border-slate-200 p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Calculadora de Intervalo SRS</h4>
                  <span className="px-2 py-0.5 bg-pink-100 text-pink-700 text-[10px] font-bold">Interactivo</span>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 block">Número de veces seguidas que has respondido correctamente:</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <button
                        key={num}
                        onClick={() => setSrsDays(num)}
                        className={`flex-1 py-2 text-xs font-bold border transition-colors ${srsDays === num ? 'border-pink-500 bg-pink-50 text-pink-700' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-200/60">
                  <span className="text-slate-500">Próxima fecha de revisión calculada:</span>
                  <span className="font-bold text-slate-900">En {getSrsInterval(srsDays)} días</span>
                </div>
              </div>
            </div>

            {/* Scientific graph illustration representation */}
            <div className="p-8 border border-slate-200 bg-slate-50/50 flex flex-col justify-between min-h-[350px] shadow-sm relative">
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900">Visualización de la Retención Léxica</h4>
                <p className="text-xs text-slate-500">Curva de retención normal frente al modelo adaptativo de OnixLingo.</p>
              </div>

              {/* Mock Graphic Visual */}
              <div className="h-44 w-full border-b border-l border-slate-300 relative flex items-end pt-4">
                
                {/* Curved line 1: normal decay (Red) */}
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  {/* Normal Curve */}
                  <path d="M 0 30 C 50 120, 150 150, 300 160" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="4" />
                  {/* OnixLingo Intervals */}
                  <path d="M 0 30 C 30 20, 45 40, 45 30 C 90 20, 120 40, 120 30 C 180 20, 240 35, 240 30 C 280 20, 300 20, 320 20" fill="none" stroke="#ec4899" strokeWidth="3" />
                </svg>

                {/* Legend labels */}
                <div className="absolute top-6 right-4 text-[10px] space-y-1.5 font-bold uppercase">
                  <div className="flex items-center gap-1.5 text-[#ef4444]"><span className="w-2.5 h-0.5 bg-[#ef4444] inline-block border-t border-dashed" /> Olvido Normal (2 días)</div>
                  <div className="flex items-center gap-1.5 text-[#ec4899]"><span className="w-2.5 h-0.5 bg-[#ec4899] inline-block" /> OnixLingo SRS (Permanente)</div>
                </div>

                {/* X labels */}
                <div className="absolute bottom-[-22px] left-0 text-[9px] text-slate-400 font-bold">Día 1</div>
                <div className="absolute bottom-[-22px] left-1/3 text-[9px] text-slate-400 font-bold">Día 3</div>
                <div className="absolute bottom-[-22px] left-2/3 text-[9px] text-slate-400 font-bold">Día 7</div>
              </div>

              <div className="bg-white border border-slate-200 p-4 text-xs text-slate-600 space-y-1.5">
                <p>💡 <strong>Análisis Científico:</strong> Con repetición clásica, la retención cae al 20% en 3 días. Con el sistema adaptativo de OnixLingo, la retención se mantiene constantemente por encima del 92% a lo largo de las semanas.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* RAFFLE VOUCHERS AND BOLETOS */}
      <section className="py-24 px-6 bg-[#edf7f2] border-t border-emerald-100">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="w-16 h-16 bg-pink-100 text-pink-600 flex items-center justify-center mx-auto shadow-md">
            <Trophy size={32} />
          </div>
          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Aprende Vocabulario. Gana Premios Físicos.
            </h2>
            <p className="text-slate-600 text-lg font-light leading-relaxed">
              Cada bloque de vocabulario completado te otorga boletos VIP para los sorteos de hardware premium mensuales de OnixCorp (tablets, auriculares inteligentes y becas).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
            <div className="bg-white border border-slate-200 p-6 shadow-sm">
              <span className="w-8 h-8 bg-slate-100 text-slate-600 flex items-center justify-center font-bold mb-4">1</span>
              <h4 className="font-bold text-slate-900 mb-1">Completa en modo Pro</h4>
              <p className="text-xs text-slate-500">Termina cualquier bloque de 50 palabras en la velocidad máxima de 2 minutos.</p>
            </div>
            <div className="bg-white border border-slate-200 p-6 shadow-sm">
              <span className="w-8 h-8 bg-pink-100 text-pink-700 flex items-center justify-center font-bold mb-4">x5</span>
              <h4 className="font-bold text-slate-900 mb-1">Multiplicador VIP</h4>
              <p className="text-xs text-slate-500">Recibe 5 boletos de entrada al sorteo en lugar de 1 por cada bloque exitoso.</p>
            </div>
            <div className="bg-white border border-slate-200 p-6 shadow-sm">
              <span className="w-8 h-8 bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-4">✓</span>
              <h4 className="font-bold text-slate-900 mb-1">Sorteo Automatizado</h4>
              <p className="text-xs text-slate-500">Tus boletos se agregan directamente a tu cuenta y participan al final de cada mes.</p>
            </div>
          </div>

          <div className="inline-flex flex-col items-center gap-3">
            <Link href="/register">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-12 transition-all shadow-xl shadow-indigo-600/20">
                Iniciar mi Entrenamiento Gratis
              </button>
            </Link>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Sin contratos · Cancela cuando quieras</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#e2efe7] py-10 px-6 text-sm text-slate-600 border-t border-emerald-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-bold text-slate-900">OnixLingo</span>
          <div className="flex gap-6 font-medium flex-wrap">
            <Link href="/planes" className="hover:text-indigo-600 transition-colors">Planes</Link>
            <Link href="/legal/privacy" className="hover:text-indigo-600 transition-colors">Privacidad</Link>
            <Link href="/legal/terms" className="hover:text-indigo-600 transition-colors">Términos</Link>
            <Link href="/legal/refunds" className="hover:text-indigo-600 transition-colors">Reembolsos</Link>
          </div>
          <p className="text-xs">© 2026 OnixuTechnology.</p>
        </div>
      </footer>

    </div>
  );
}
