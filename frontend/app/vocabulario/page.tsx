'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen, Clock, Trophy, ArrowRight, ChevronRight, CheckCircle2,
  Sparkles, Languages, RefreshCw, Volume2, Award, Zap, HelpCircle,
  Gem, AlertCircle, Play, Check, Flame, Star
} from 'lucide-react';

const languages = [
  { id: 'en', flag: '🇺🇸', name: 'Inglés', count: '3,000+ palabras' },
  { id: 'fr', flag: '🇫🇷', name: 'Francés', count: '3,000+ palabras' },
  { id: 'zh', flag: '🇨🇳', name: 'Chino Mandarín', count: '3,000+ palabras' },
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
    { word: '缓解 (huǎnjié)', translation: 'Mitigar / Aliviar', pronunciation: 'huǎn jié', sentence: '新政策缓解了公司的资金链压力。', explanation: '使紧张或严重的状况得到一定程度 de 减轻。' },
    { word: '愿景 (yuànjǐng)', translation: 'Visión / Perspectiva', pronunciation: 'yuàn jǐng', sentence: '公司的长期愿景是成为行业领导者。', explanation: '对未来发展所勾画的蓝图或向往的景象。' },
    { word: '核心竞争 (héxīn jìngzhēng)', translation: 'Competitividad Núcleo', pronunciation: 'hé xīn jìng zhēng', sentence: '创新是我们的核心竞争力。', explanation: '企业在市场上独特的、不易被对手模仿的优势。' }
  ]
};

export default function VocabularioPage() {
  const [selectedLang, setSelectedLang] = useState('en');
  const [selectedBlock, setSelectedBlock] = useState(4); 
  const [difficulty, setDifficulty] = useState('pro'); 
  const [drillIndex, setDrillIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(120); 
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [streak, setStreak] = useState(5);
  const [srsDays, setSrsDays] = useState(1);

  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const activeWords = sampleDrills[selectedLang] || sampleDrills.en;
  const currentWord = activeWords[drillIndex] || activeWords[0];

  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const playWordAudio = () => {
    setIsPlayingSound(true);
    setTimeout(() => setIsPlayingSound(false), 800);
  };

  useEffect(() => {
    if (activeWords && activeWords.length > 0 && currentWord) {
      const correct = currentWord.translation;
      const otherTranslations = activeWords
        .filter((w) => w.translation !== correct)
        .map((w) => w.translation);
      
      const shuffledOthers = [...otherTranslations].sort(() => 0.5 - Math.random()).slice(0, 3);
      const combined = [correct, ...shuffledOthers].sort(() => 0.5 - Math.random());
      
      setOptions(combined);
      setSelectedOption(null);
      setHasAnswered(false);
    }
  }, [drillIndex, selectedLang, selectedBlock, activeWords, currentWord]);

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
    setSelectedOption(null);
    setHasAnswered(false);
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

  const handleAnswerSelect = (option: string) => {
    if (hasAnswered) return;
    setSelectedOption(option);
    setHasAnswered(true);
    const isCorrect = option === currentWord.translation;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNextWord = () => {
    if (drillIndex < activeWords.length - 1) {
      setDrillIndex((prev) => prev + 1);
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

  const getSrsInterval = (reviewCount: number) => {
    return Math.ceil(Math.pow(2, reviewCount * 1.15));
  };

  return (
    <div className="min-h-screen bg-[#edf7f2] font-sans text-slate-800 selection:bg-pink-500/20 selection:text-pink-900">
      
      {/* NAVBAR */}
      <nav className="fixed w-full bg-[#edf7f2]/90 backdrop-blur-xl border-b border-emerald-100 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/20">
              <span>O</span>
            </div>
            <span className="font-bold text-slate-900 tracking-tight text-xl">OnixLingo</span>
          </Link>
          <div className="hidden md:flex gap-8 items-center text-sm font-semibold text-slate-600">
            <Link href="/caracteristicas" className="hover:text-indigo-600 transition-colors">Características</Link>
            <Link href="/vocabulario" className="text-pink-600 border-b-2 border-pink-600 pb-1">Vocabulario</Link>
            <Link href="/programa-ejecutivo" className="hover:text-indigo-600 transition-colors">Programa Ejecutivo</Link>
            <Link href="/planes" className="hover:text-indigo-600 transition-colors">Planes</Link>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/login" className="hidden md:block text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Iniciar Sesión</Link>
            <Link href="/register">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 px-6 transition-all shadow-md shadow-indigo-600/20 hover:scale-105">
                Crear Cuenta Gratis
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="pt-36 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-pink-100/40 blur-[130px] opacity-40 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-pink-250 text-pink-700 text-xs font-bold uppercase tracking-widest shadow-sm">
            <BookOpen size={12} className="text-pink-600 animate-pulse" />
            Estructuración Léxica Avanzada (SRS)
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Expansión de Vocabulario<br />
            <span className="text-pink-600">Permanente y Científica.</span>
          </h1>
          <p className="text-lg text-slate-650 max-w-3xl mx-auto leading-relaxed font-light">
            Domina 3,000+ términos clave por idioma mediante algoritmos de repetición espaciada y simuladores interactivos diseñados para retención activa bajo estrés.
          </p>
        </div>
      </header>

      {/* LANGUAGE SELECTOR */}
      <section className="py-6 px-6 bg-white/50 border-t border-emerald-100 shadow-sm backdrop-blur-sm">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-bold text-base text-slate-900">1. Vector de Aprendizaje</h3>
            <p className="text-slate-500 text-xs mt-0.5">Selecciona el idioma objetivo alineado con la currícula del MCER.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            {languages.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  setSelectedLang(l.id);
                  setIsRunning(false);
                  setIsCompleted(false);
                }}
                className={`flex-1 md:flex-none flex items-center gap-3 px-5 py-3 border font-bold transition-all ${selectedLang === l.id ? 'border-pink-500 bg-pink-50 text-pink-700 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-350 text-slate-600'}`}
              >
                <span className="text-xl">{l.flag}</span>
                <div className="text-left">
                  <p className="text-xs font-black">{l.name}</p>
                  <p className="text-[9px] text-slate-400 font-semibold">{l.count}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* BLOCKS GRID */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center md:text-left">
            <h3 className="font-bold text-xl text-slate-900">2. Módulos Léxicos Activos</h3>
            <p className="text-slate-500 text-xs mt-0.5">Selecciona la dificultad y nivel de especialización léxica.</p>
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
                className={`p-5 border transition-all cursor-pointer relative flex flex-col justify-between ${selectedBlock === b.id ? 'border-pink-500 bg-white shadow-md ring-1 ring-pink-500/10' : 'border-slate-200 bg-white/70 hover:border-slate-350 shadow-sm'}`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-0.5 text-[9px] font-black rounded-none ${b.level.startsWith('A') ? 'bg-emerald-100 text-emerald-700' : b.level.startsWith('B') ? 'bg-indigo-100 text-indigo-700' : 'bg-pink-100 text-pink-700'}`}>
                      Nivel {b.level}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Bloque {b.id}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-slate-900 mb-1 leading-tight">{b.title}</h4>
                    <p className="text-xs text-slate-500 leading-normal font-light">{b.desc}</p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex justify-between items-center text-[11px]">
                  <span className="text-slate-400 font-bold uppercase text-[9px]">{b.words.length * 10} palabras clave</span>
                  <div className={`flex items-center gap-0.5 font-bold ${selectedBlock === b.id ? 'text-pink-600' : 'text-slate-600'}`}>
                    {selectedBlock === b.id ? 'Seleccionado' : 'Seleccionar'} <ChevronRight size={12} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE DRILL SIMULATOR */}
      <section className="py-16 px-6 bg-slate-900 text-white border-t border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-pink-500/5 blur-[120px] pointer-events-none rounded-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          
          <div className="text-center mb-8 space-y-2">
            <span className="text-xs font-black text-pink-450 uppercase tracking-widest">Simulator Studio</span>
            <h3 className="font-bold text-2xl tracking-tight">3. Simulador de Retención Léxica Directiva</h3>
            <p className="text-slate-450 text-xs max-w-md mx-auto">Prueba el simulador activo de memorización. La dificultad Pro otorga el boost de tickets VIP.</p>
          </div>

          {/* Dificultad Tabs */}
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-950 border border-slate-850 mb-6 max-w-md mx-auto">
            {[
              { id: 'facil', label: 'Fácil', sub: 'Sin tiempo', color: 'border-emerald-500 text-emerald-400 bg-emerald-500/10' },
              { id: 'medio', label: 'Medio', sub: '5 min limit', color: 'border-amber-500 text-amber-400 bg-amber-500/10' },
              { id: 'pro', label: 'Pro', sub: '2 min & x5', color: 'border-pink-500 text-pink-400 bg-pink-500/10' }
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => {
                  setDifficulty(d.id);
                  setIsRunning(false);
                  setIsCompleted(false);
                }}
                className={`py-2 px-1 text-center border transition-all ${difficulty === d.id ? d.color : 'border-transparent text-slate-500 hover:text-white'}`}
              >
                <p className="font-extrabold text-xs">{d.label}</p>
                <p className="text-[8px] text-slate-500 font-bold uppercase mt-0.5">{d.sub}</p>
              </button>
            ))}
          </div>

          {/* SIMULATOR SCREEN */}
          <div className="bg-slate-950 border border-slate-850 p-6 md:p-10 relative shadow-2xl">
            
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-start gap-3 text-xs leading-normal">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-amber-500" />
              <div>
                <p className="font-extrabold uppercase text-[9px] tracking-wider text-amber-400 mb-0.5">Demostración Rápida (Sandbox)</p>
                <p className="font-light">Las bases de datos completas, la sincronización por voz de pronunciación y el tracking de racha están habilitados en tu dashboard personal.</p>
              </div>
            </div>
            
            {!isRunning && !isCompleted && (
              <div className="text-center space-y-6 py-6">
                <div className="w-14 h-14 bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mx-auto shadow-inner">
                  <Play size={28} className="ml-1" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-white">Preparado para iniciar el Bloque {selectedBlock}</h4>
                  <p className="text-slate-400 text-xs">
                    Idioma: <span className="font-bold text-white">{languages.find(l => l.id === selectedLang)?.name}</span>.
                  </p>
                </div>
                <button
                  onClick={startDrill}
                  className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 text-xs tracking-wider uppercase transition-all shadow-lg active:scale-95"
                >
                  Comenzar Bloque
                </button>
              </div>
            )}

            {isRunning && !isCompleted && (
              <div className="space-y-6">
                
                {/* Stats */}
                <div className="flex justify-between items-center border-b border-slate-850 pb-3 text-xs font-bold text-slate-400 font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping" />
                    <span>Progreso: {drillIndex + 1} / {activeWords.length}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Flame size={14} />
                      <span>Racha: {streak}</span>
                    </div>
                    <div className="flex items-center gap-1 text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2 py-0.5">
                      <Clock size={12} />
                      <span>{formatTime(timer)}</span>
                    </div>
                  </div>
                </div>

                {/* Quiz Card */}
                <div className="flex flex-col items-center py-4">
                  <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between items-center text-center relative select-none shadow-xl">
                    <span className="absolute top-2.5 right-3 text-[8px] text-slate-500 font-bold uppercase tracking-wider">
                      Selecciona la traducción correcta
                    </span>

                    <div className="w-full space-y-4 my-2">
                      <div className="flex items-center justify-center gap-3 pt-2">
                        <h4 className="text-3xl font-extrabold text-white tracking-tight">{currentWord.word}</h4>
                        <button 
                          onClick={playWordAudio}
                          className={`p-1.5 bg-slate-800 text-slate-350 border border-slate-700 hover:bg-slate-700 transition-colors ${isPlayingSound ? 'animate-bounce text-pink-400' : ''}`}
                          title="Reproducir audio"
                        >
                          <Volume2 size={14} />
                        </button>
                      </div>
                      
                      {currentWord.pinyin && (
                        <p className="text-slate-400 text-xs font-mono">{currentWord.pinyin}</p>
                      )}
                      
                      <div className="text-[10px] text-slate-500 font-mono">
                        <span>Pronunciación: {currentWord.pronunciation}</span>
                      </div>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 gap-2.5 pt-2">
                        {options.map((opt, i) => {
                          const isCorrect = opt === currentWord.translation;
                          const isSelected = opt === selectedOption;
                          let btnStyle = "border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:border-slate-750";
                          
                          if (hasAnswered) {
                            if (isCorrect) {
                              btnStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-450 font-bold";
                            } else if (isSelected) {
                              btnStyle = "border-red-500 bg-red-500/10 text-red-450 font-bold";
                            } else {
                              btnStyle = "border-slate-850 bg-slate-950 text-slate-600 opacity-60 cursor-not-allowed";
                            }
                          }

                          return (
                            <button
                              key={i}
                              disabled={hasAnswered}
                              onClick={() => handleAnswerSelect(opt)}
                              className={`w-full py-3 px-4 border text-xs text-left transition-all flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {hasAnswered && isCorrect && <Check size={14} className="text-emerald-450" />}
                              {hasAnswered && isSelected && !isCorrect && <span className="text-red-400 font-bold">✗</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Explanation and Next Button */}
                {hasAnswered && (
                  <div className="mt-4 p-5 bg-slate-950 border border-slate-850 space-y-3 text-left max-w-md mx-auto">
                    <div className="space-y-1">
                      <p className="text-[9px] text-pink-400 font-black uppercase tracking-wider">Definición y Explicación:</p>
                      <p className="text-xs text-slate-300">{currentWord.explanation}</p>
                    </div>
                    <div className="space-y-1 pt-1.5 border-t border-slate-800">
                      <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider">Ejemplo de Uso:</p>
                      <p className="text-xs text-slate-400 italic">"{currentWord.sentence}"</p>
                    </div>
                    <div className="pt-3 flex justify-end">
                      <button
                        onClick={handleNextWord}
                        className="bg-pink-650 hover:bg-pink-750 text-white font-bold py-2 px-5 text-[10px] tracking-wider uppercase transition-colors"
                      >
                        {drillIndex < activeWords.length - 1 ? 'Siguiente Palabra' : 'Ver Resultados'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {isCompleted && (
              <div className="text-center space-y-5 py-4">
                <div className="w-12 h-12 bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center mx-auto">
                  <Award size={28} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-bold text-white">¡Módulo Completado!</h4>
                  <p className="text-slate-400 text-xs">Revisaste todas las palabras clave del Bloque {selectedBlock}.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto bg-slate-900 border border-slate-800 p-3">
                  <div className="text-center border-r border-slate-800">
                    <p className="text-2xl font-black text-pink-400">{score} / {activeWords.length}</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">Aciertos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-amber-400">
                      {difficulty === 'pro' && score === activeWords.length ? '+5 VIP' : '+1 VIP'}
                    </p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase mt-0.5">Boletos VIP</p>
                  </div>
                </div>

                {difficulty === 'pro' && score === activeWords.length && (
                  <div className="bg-pink-500/10 border border-pink-500/20 p-3 max-w-sm mx-auto text-[10px] text-pink-300 font-medium">
                    🏆 <strong>Boost de Tickets Activo:</strong> Recibiste un multiplicador x5 para el Sorteo de Hardware.
                  </div>
                )}

                <div className="flex gap-3 justify-center pt-3">
                  <button
                    onClick={startDrill}
                    className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2.5 px-6 text-xs uppercase transition-colors"
                  >
                    Reintentar
                  </button>
                  <button
                    onClick={() => setIsCompleted(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold py-2.5 px-6 text-xs uppercase transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* SRS SYSTEM EXPLANATION */}
      <section className="py-20 px-6 bg-white border-t border-emerald-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-5">
              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">Algoritmo Repetición Espaciada</span>
              <h2 className="text-3xl font-bold text-slate-900 leading-tight">
                Intervalos de Aprendizaje Adaptativos
              </h2>
              <p className="text-slate-655 text-sm leading-relaxed font-light">
                Nuestro motor predice el decaimiento de memoria (Curva del Olvido) basándose en tus interacciones y programa los repasos de forma precisa antes de que olvides el término.
              </p>

              {/* Interactive SRS Calculator */}
              <div className="bg-slate-50 border border-slate-200 p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Calculadora de Intervalos SRS</h4>
                  <span className="px-2 py-0.5 bg-pink-100 text-pink-700 text-[9px] font-bold">Interactivo</span>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 block">Número de aciertos consecutivos para una palabra:</label>
                  <div className="flex gap-2.5">
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <button
                        key={num}
                        onClick={() => setSrsDays(num)}
                        className={`flex-1 py-1.5 text-xs font-bold border transition-colors ${srsDays === num ? 'border-pink-500 bg-pink-50 text-pink-700' : 'bg-white border-slate-200 hover:border-slate-350'}`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs pt-1.5">
                  <span className="text-slate-500">Próxima revisión recomendada:</span>
                  <span className="font-bold text-slate-900">En {getSrsInterval(srsDays)} días</span>
                </div>
              </div>
            </div>

            {/* Scientific Graph */}
            <div className="p-6 border border-slate-250 bg-slate-50/50 flex flex-col justify-between min-h-[320px] shadow-sm relative">
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-sm">Visualización del Olvido Cognitivo</h4>
                <p className="text-[10px] text-slate-500">Curva de decaimiento frente a la optimización de OnixLingo.</p>
              </div>

              <div className="h-36 w-full border-b border-l border-slate-300 relative flex items-end pt-4">
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 0 30 C 50 110, 150 140, 300 150" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4" />
                  <path d="M 0 30 C 30 20, 45 40, 45 30 C 90 20, 120 40, 120 30 C 180 20, 240 35, 240 30" fill="none" stroke="#ec4899" strokeWidth="2.5" />
                </svg>

                <div className="absolute top-4 right-2 text-[8px] space-y-1 font-bold uppercase">
                  <div className="flex items-center gap-1.5 text-red-500"><span className="w-2.5 h-0.5 bg-red-500 inline-block border-t border-dashed" /> Olvido Normal</div>
                  <div className="flex items-center gap-1.5 text-pink-500"><span className="w-2.5 h-0.5 bg-pink-500 inline-block" /> OnixLingo SRS</div>
                </div>

                <div className="absolute bottom-[-18px] left-0 text-[8px] text-slate-400 font-bold uppercase">Día 1</div>
                <div className="absolute bottom-[-18px] left-1/3 text-[8px] text-slate-400 font-bold uppercase">Día 3</div>
                <div className="absolute bottom-[-18px] left-2/3 text-[8px] text-slate-400 font-bold uppercase">Día 7</div>
              </div>

              <div className="bg-white border border-slate-200 p-3 text-[11px] text-slate-600 leading-relaxed mt-4">
                💡 <strong>Análisis Académico:</strong> Nuestro sistema de repetición espaciada impide el descarte neuronal, manteniendo tu tasa de retención por encima del 92%.
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* RAFFLE VOUCHERS */}
      <section className="py-20 px-6 bg-[#edf7f2] border-t border-emerald-100">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="w-14 h-14 bg-pink-100 text-pink-600 flex items-center justify-center mx-auto shadow-sm">
            <Trophy size={28} />
          </div>
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sorteo Mensual de Hardware</h2>
            <p className="text-slate-600 text-sm font-light">Completa vocabulario en modo Pro, acumula boletos VIP y gana tablets, diademas inteligentes y licencias premium corporativas.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
            <div className="bg-white border border-slate-200 p-5 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">Paso 1</span>
              <h4 className="font-bold text-sm text-slate-900 mb-1">Entrena en modo Pro</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed">Completa el bloque de 50 palabras en menos de 2 minutos.</p>
            </div>
            <div className="bg-white border border-slate-200 p-5 shadow-sm">
              <span className="text-xs font-bold text-pink-600 uppercase tracking-widest block mb-2">Paso 2</span>
              <h4 className="font-bold text-sm text-slate-900 mb-1">Boost x5 VIP Tickets</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed">Obtén 5 boletos para el sorteo mensual de hardware corporativo.</p>
            </div>
            <div className="bg-white border border-slate-200 p-5 shadow-sm">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-2">Paso 3</span>
              <h4 className="font-bold text-sm text-slate-900 mb-1">Sorteo automático</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed">Tus participaciones se registran directamente en tu cuenta al instante.</p>
            </div>
          </div>

          <div className="pt-4">
            <Link href="/register">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 text-xs uppercase tracking-widest transition-all shadow-xl">
                Iniciar mi Entrenamiento Gratis
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#e2efe7] py-10 px-6 text-sm text-slate-655 border-t border-emerald-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-bold text-slate-900">OnixLingo</span>
          <div className="flex gap-6 font-medium flex-wrap">
            <Link href="/planes" className="hover:text-indigo-600 transition-colors">Planes</Link>
            <Link href="/legal/privacy" className="hover:text-indigo-600 transition-colors">Privacidad</Link>
            <Link href="/legal/terms" className="hover:text-indigo-600 transition-colors">Términos</Link>
            <Link href="/legal/refunds" className="hover:text-indigo-600 transition-colors">Reembolsos</Link>
            <Link href="/legal/support" className="hover:text-indigo-600 transition-colors">Soporte</Link>
          </div>
          <div className="text-left md:text-right text-xs space-y-1">
            <p>© 2026 OnixuTechnology.</p>
            <p className="text-[10px] text-slate-550 font-light">Pagos procesados por Paddle, nuestro Merchant of Record.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
