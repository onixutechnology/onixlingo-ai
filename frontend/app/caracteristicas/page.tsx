'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BrainCircuit, Mic, Globe, CheckCircle2, Sparkles, Gem, Crown, BookOpen,
  Languages, Building2, Zap, Clock, Trophy, ArrowRight, ChevronRight,
  Shield, Activity, BarChart3, Target, Users, Layers, Radio, Star,
  MessageSquare, Award, TrendingUp, Cpu, Volume2, PieChart, X, AlertTriangle
} from 'lucide-react';
import {
  fn101_calcLexicalDensity,
  fn110_detectJargonDensity,
  fn113_estimatePronunciationMatch,
  fn122_classifyWpmPace,
  fn125_estimateDiplomacyScore,
  fn130_calculateVocalConfidence,
  fn145_calculateVocabularyWealth
} from '../../utils/executiveAnalytics';

const features = [
  {
    icon: BrainCircuit,
    color: 'indigo',
    tag: 'IA Adaptativa',
    title: 'Motor Neuronal de Cero Latencia',
    description: 'Nuestro núcleo de inteligencia artificial procesa cada respuesta en milisegundos. El sistema analiza tu nivel en tiempo real y recalibra la dificultad de cada ejercicio de forma automática, garantizando que siempre estés en tu zona óptima de aprendizaje.',
    bullets: [
      'Ajuste de dificultad en tiempo real por sesión',
      'Modelos de lenguaje especializados en educación MCER',
      'Memoria de sesión: recuerda tus errores previos',
      'Análisis de patrones de aprendizaje individual',
    ],
    stat: '< 80ms', statLabel: 'Latencia de respuesta',
    extraDetails: 'El motor neuronal utiliza arquitecturas Transformers optimizadas localmente en los nodos Edge de OnixCorp. Mediante técnicas de cuantización de parámetros a 4 bits, logramos tiempos de inferencia sub-80ms sobre flujos de audio continuos WebRTC.',
    interactiveMetric: 'density'
  },
  {
    icon: Mic,
    color: 'emerald',
    tag: 'Speech Analytics',
    title: 'Análisis Fonético con IA en Tiempo Real',
    description: 'Pronuncia, recibe feedback inmediato y corrige. Nuestro sistema de Speech Analytics descompone tu voz en métricas de accuracy, fluency, intonation, rhythm, pace y confidence. No solo te dice si es correcto — te dice exactamente qué ajustar.',
    bullets: [
      'Detección de 8 dimensiones fonéticas simultáneas',
      'Benchmark CEFR (B1/B2/C1/C2) por sesión',
      'Comparativa con hablantes nativos certificados',
      'Historial de progreso con gráficas de evolución',
    ],
    stat: '98%', statLabel: 'Precisión de detección',
    extraDetails: 'Compara tu voz contra miles de horas de registros acústicos de hablantes nativos corporativos de Reino Unido, EE. UU. y Singapur. El sistema proporciona un mapa tridimensional de formantes para la alineación silábica exacta.',
    interactiveMetric: 'speech'
  },
  {
    icon: Globe,
    color: 'blue',
    tag: 'Multilingüe',
    title: 'Ecosistema de 3 Idiomas Globales',
    description: 'Inglés, Francés y Chino Mandarín en un solo ecosistema integrado. Cada idioma cuenta con currículum completo desde A1 hasta C2, avatares nativos para conversación, y currícula especializadas para contextos de negocios internacionales.',
    bullets: [
      'Inglés: 900+ lecciones con acento americano y británico',
      'Francés: Currículum DELF/DALF alineado',
      'Chino Mandarín: Sistema Pinyin + caracteres HSK',
      'Traducción contextual y gramática comparativa',
    ],
    stat: '3', statLabel: 'Idiomas Globales',
    extraDetails: 'Currícula desarrollada en conjunto por directores académicos de OnixCorp y el British Council. El motor de traducción contextual y gramática comparativa resalta las diferencias sintácticas clave para evitar calcos lingüísticos.',
    interactiveMetric: 'languages'
  },
  {
    icon: Crown,
    color: 'amber',
    tag: 'Ajedrez Cognitivo',
    title: 'Entrenamiento de Pensamiento Estratégico',
    description: 'El ajedrez no es un juego — es una herramienta de desarrollo cognitivo. La misma arquitectura mental que usa un jugador de alto nivel para anticipar movimientos es la que uses para estructurar argumentos en negociaciones ejecutivas.',
    bullets: [
      'Puzzles tácticos adaptados a tu Elo estimado',
      'Aperturas clásicas: Ruy López, Siciliana, Caro-Kann',
      '2 puzzles diarios gratis / Ilimitado en planes Pro+',
      'Tutor IA que explica cada decisión táctica',
    ],
    stat: '500+', statLabel: 'Puzzles en biblioteca',
    extraDetails: 'Puzzles indexados dinámicamente según la teoría del flujo cognitivo. El motor evalúa el árbol de decisiones estratégico y te entrena para justificar cada jugada en inglés, fomentando el pensamiento racional bajo presión extrema.',
    interactiveMetric: 'chess'
  },
  {
    icon: BookOpen,
    color: 'pink',
    tag: 'Vocabulario Inteligente',
    title: 'Sistema de Expansión Léxica Acelerada',
    description: 'Bloques de 50 palabras organizados por tema, nivel y frecuencia de uso real. El sistema utiliza repetición espaciada inteligente (SRS) para maximizar la retención a largo plazo, con ejercicios de producción activa — no solo reconocimiento pasivo.',
    bullets: [
      '60 bloques × 50 palabras = 3,000 términos por idioma',
      'Niveles A1 a C2 sin repetición de vocabulario',
      'Modo Fácil (sin tiempo), Medio (5 min), Pro (2 min)',
      'Multiplicador x5 de boletos VIP al completar bloques Pro',
    ],
    stat: '9,000+', statLabel: 'Palabras en sistema',
    extraDetails: 'Utiliza el algoritmo neuronal modificado SuperMemo2 (SRS). A través de la tasa de decaimiento calculada individualmente, cada palabra se programa en intervalos precisos justo antes del umbral estimado de olvido.',
    interactiveMetric: 'vocab'
  },
  {
    icon: Building2,
    color: 'violet',
    tag: 'Executive Program',
    title: 'Boardroom Simulator & Negociación Corporativa',
    description: 'El módulo más avanzado de OnixLingo. Simulaciones en tiempo real de escenarios corporativos de alto nivel: presentaciones ante inversores, fusiones y adquisiciones, negociaciones de contrato internacional y oratoria para C-Suite.',
    bullets: [
      '60 unidades de especialización ejecutiva',
      'Simulación de juntas directivas, pitch de VC y IPO',
      'Oratoria para CEOs, diplomacia y gestión de crisis',
      'Certification badge: Executive Speech Standard',
    ],
    stat: '60', statLabel: 'Unidades Executive',
    extraDetails: 'Nuestra gema de la corona. Simulaciones realistas que evalúan factores como la densidad de C-Suite Jargon, el índice de diplomacia y la velocidad de respuesta, otorgando credenciales validadas en la red de OnixCorp.',
    interactiveMetric: 'executive'
  },
];

const techStack = [
  { icon: Cpu, label: 'Motor de IA propio', sub: 'Entrenado para educación MCER' },
  { icon: Radio, label: 'Streaming de audio real', sub: 'WebRTC + análisis fonético' },
  { icon: Shield, label: 'Datos cifrados E2E', sub: 'SOC2 compliant infrastructure' },
  { icon: Activity, label: 'Uptime 99.9%', sub: 'Infraestructura multi-región' },
  { icon: BarChart3, label: 'Analytics en tiempo real', sub: 'Dashboard de progreso vivo' },
  { icon: Users, label: 'Multi-tenant B2B', sub: 'Licencias corporativas disponibles' },
];

const colorMap: Record<string, { bg: string; text: string; border: string; icon: string; tag: string; btn: string }> = {
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200', icon: 'bg-indigo-100 text-indigo-600', tag: 'bg-indigo-100 text-indigo-700', btn: 'bg-indigo-600 hover:bg-indigo-700' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', icon: 'bg-emerald-100 text-emerald-600', tag: 'bg-emerald-100 text-emerald-700', btn: 'bg-emerald-600 hover:bg-emerald-700' },
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', icon: 'bg-blue-100 text-blue-600', tag: 'bg-blue-100 text-blue-700', btn: 'bg-blue-600 hover:bg-blue-700' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', icon: 'bg-amber-100 text-amber-600', tag: 'bg-amber-100 text-amber-700', btn: 'bg-amber-600 hover:bg-amber-700' },
  pink: { bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200', icon: 'bg-pink-100 text-pink-600', tag: 'bg-pink-100 text-pink-700', btn: 'bg-pink-600 hover:bg-pink-700' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200', icon: 'bg-violet-100 text-violet-600', tag: 'bg-violet-100 text-violet-700', btn: 'bg-violet-600 hover:bg-violet-700' },
};

export default function CaracteristicasPage() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Interactive mini-calculator variables inside features modal
  const [inputText, setInputText] = useState('Our operational synergies are in perfect alignment for the upcoming quarterly board presentation.');
  const [speechWpm, setSpeechWpm] = useState(135);
  const [wordsKnown, setWordsKnown] = useState(25);
  const [chessElo, setChessElo] = useState(1200);

  const activeFeatureDetail = features[activeFeature];
  const activeColor = colorMap[activeFeatureDetail.color];

  const handleOpenDetails = (idx: number) => {
    setActiveFeature(idx);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#edf7f2] font-sans text-slate-800 selection:bg-indigo-500/20 selection:text-indigo-900">

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
            <Link href="/caracteristicas" className="text-indigo-600 border-b-2 border-indigo-600 pb-0.5">Características</Link>
            <Link href="/vocabulario" className="hover:text-indigo-600 transition-colors">Vocabulario</Link>
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

      {/* HERO */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-indigo-100 blur-[140px] opacity-50 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest shadow-sm">
            <Sparkles size={12} className="text-indigo-600" />
            Tecnología de Alto Rendimiento
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.08]">
            Características que<br />
            <span className="text-indigo-600">redefinen el aprendizaje.</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
            OnixLingo no es una app de frases. Es una arquitectura de aprendizaje de demostración diseñada para producir resultados medibles en tiempo real.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link href="/register">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-8 transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 hover:-translate-y-0.5">
                Empezar Gratis <ArrowRight size={18} />
              </button>
            </Link>
            <Link href="/planes">
              <button className="bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 hover:text-indigo-600 font-semibold py-3.5 px-8 transition-all">
                Ver Planes
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="py-12 px-6 border-t border-emerald-100 bg-white/60">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { val: '900+', label: 'Lecciones activas', color: 'text-slate-900' },
            { val: '3', label: 'Idiomas globales', color: 'text-indigo-600' },
            { val: '60', label: 'Módulos executive', color: 'text-amber-600' },
            { val: '< 80ms', label: 'Latencia de respuesta IA', color: 'text-emerald-600' },
          ].map((s, i) => (
            <div key={i} className="text-center p-6 bg-white border border-slate-100 shadow-sm">
              <p className={`text-3xl font-extrabold ${s.color}`}>{s.val}</p>
              <p className="text-xs text-slate-500 font-semibold mt-1 uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURE DETAIL SECTION */}
      <section className="py-24 px-6 border-t border-emerald-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">Un ecosistema. Seis módulos de élite.</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Cada característica fue construida desde cero para ser la mejor en su categoría, no un complemento.</p>
          </div>

          {/* Feature tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-16">
            {features.map((f, i) => {
              const c = colorMap[f.color];
              const Icon = f.icon;
              return (
                <button
                  key={i}
                  onClick={() => setActiveFeature(i)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold transition-all border ${activeFeature === i ? `${c.icon} ${c.border} shadow-sm` : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}
                >
                  <Icon size={14} />
                  {f.tag}
                </button>
              );
            })}
          </div>

          {/* Active feature card */}
          {features.map((f, i) => {
            if (i !== activeFeature) return null;
            const c = colorMap[f.color];
            const Icon = f.icon;
            return (
              <div key={i} className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center border ${c.border} ${c.bg} p-10 md:p-16`}>
                <div className="space-y-6">
                  <span className={`inline-block px-3 py-1 text-xs font-black uppercase tracking-widest ${c.tag}`}>{f.tag}</span>
                  <h3 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">{f.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-base">{f.description}</p>
                  <ul className="space-y-3">
                    {f.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-slate-700">
                        <CheckCircle2 size={16} className={`${c.text} mt-0.5 shrink-0`} />
                        {b}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleOpenDetails(i)}
                      className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-all shadow-md text-white ${c.btn}`}
                    >
                      Ver detalles <ChevronRight size={16} />
                    </button>
                    <Link href="/register">
                      <button className="border border-slate-300 hover:border-slate-400 bg-white text-slate-700 font-semibold px-6 py-3 text-sm">
                        Probar Demo
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-6">
                  <div className={`w-40 h-40 ${c.icon} flex items-center justify-center shadow-xl`}>
                    <Icon size={72} />
                  </div>
                  <div className="text-center">
                    <p className={`text-5xl font-black ${c.text}`}>{f.stat}</p>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{f.statLabel}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ALL FEATURES GRID */}
      <section className="py-24 px-6 bg-white border-t border-emerald-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Todo incluido en cada plan</h2>
            <p className="text-slate-500 text-base max-w-xl mx-auto">Haz clic en cualquier tarjeta para abrir la ventana de detalles interactiva.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const c = colorMap[f.color];
              const Icon = f.icon;
              return (
                <div key={i} onClick={() => handleOpenDetails(i)} className={`group p-8 border ${c.border} bg-white hover:${c.bg} transition-all cursor-pointer shadow-sm hover:shadow-md`}>
                  <div className={`w-12 h-12 ${c.icon} flex items-center justify-center mb-5`}>
                    <Icon size={24} />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${c.text} block mb-2`}>{f.tag}</span>
                  <h4 className="text-lg font-bold text-slate-900 mb-3 leading-tight">{f.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.description.substring(0, 120)}...</p>
                  <div className={`flex items-center gap-1 mt-4 text-xs font-bold ${c.text}`}>
                    Ver detalles <ChevronRight size={12} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="py-24 px-6 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <span className="text-xs font-black text-amber-400 uppercase tracking-widest">Infraestructura</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Construido para escala y precisión</h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">Cada capa técnica fue diseñada con un objetivo: que el usuario nunca experimente fricción en su aprendizaje.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {techStack.map((t, i) => {
              const Icon = t.icon;
              return (
                <div key={i} className="p-6 border border-slate-800 bg-slate-800/40 hover:border-indigo-500/40 transition-all group">
                  <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                    <Icon size={20} />
                  </div>
                  <h4 className="text-white font-bold mb-1">{t.label}</h4>
                  <p className="text-slate-500 text-xs">{t.sub}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURE INTERACTIVE DETAILS OVERLAY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-white max-w-2xl w-full border border-slate-200 shadow-2xl relative flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-[10px] font-black uppercase ${activeColor.tag}`}>{activeFeatureDetail.tag}</span>
                <h3 className="font-bold text-slate-900 text-lg">Detalles del Módulo</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-900 transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              
              {/* Access Warning (Critical Requirement) */}
              <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 flex gap-3 text-xs">
                <AlertTriangle size={18} className="shrink-0 mt-0.5 text-amber-600" />
                <div>
                  <p className="font-extrabold uppercase tracking-wide text-[10px] mb-1">Módulo de Exploración y Prueba Rápida</p>
                  <p className="font-light">Esta sección corresponde a la demostración pública para visitantes no registrados. Las herramientas avanzadas completas del panel de producción **Pro/Executive** real están integradas y son privadas del dashboard de tu cuenta.</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xl font-bold text-slate-900">{activeFeatureDetail.title}</h4>
                <p className="text-slate-650 leading-relaxed text-sm font-light">{activeFeatureDetail.description}</p>
                <p className="text-slate-500 leading-normal text-xs italic">{activeFeatureDetail.extraDetails}</p>
              </div>

              {/* Dynamic Interactive Mini calculators / Visualizers built using the 100 new functions */}
              <div className="p-5 bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles size={12} className="text-indigo-600 animate-spin" />
                    Simulador Analítico Rápido
                  </h4>
                  <span className="text-[9px] bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 font-bold">Diagnóstico</span>
                </div>

                {activeFeatureDetail.interactiveMetric === 'density' && (
                  <div className="space-y-3">
                    <label className="text-xs text-slate-500 block font-medium">Analizador de densidad de oratoria C-Suite:</label>
                    <textarea 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 focus:border-indigo-400 outline-none font-light"
                      rows={3}
                    />
                    <div className="grid grid-cols-2 gap-3 text-[11px] font-bold text-slate-650">
                      <div className="p-2.5 bg-white border border-slate-200">
                        <p className="text-slate-400 uppercase text-[9px]">Densidad Léxica</p>
                        <p className="text-indigo-600 text-sm mt-0.5 font-mono">{Math.round(fn101_calcLexicalDensity(inputText))}%</p>
                      </div>
                      <div className="p-2.5 bg-white border border-slate-200">
                        <p className="text-slate-400 uppercase text-[9px]">Jargon Detectado</p>
                        <p className="text-slate-900 text-sm mt-0.5 font-mono">{Math.round(fn110_detectJargonDensity(inputText, ['synergy', 'alignment', 'quarterly', 'board']))}%</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeFeatureDetail.interactiveMetric === 'speech' && (
                  <div className="space-y-3">
                    <label className="text-xs text-slate-500 block font-medium">Estimar confianza vocal ejecutiva basada en WPM:</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="range"
                        min="50"
                        max="240"
                        value={speechWpm}
                        onChange={(e) => setSpeechWpm(parseInt(e.target.value))}
                        className="flex-1 accent-emerald-500"
                      />
                      <span className="font-mono text-xs text-slate-900 font-bold bg-white px-2 py-1 border border-slate-200 shrink-0">{speechWpm} WPM</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-[11px] font-bold text-slate-650">
                      <div className="p-2.5 bg-white border border-slate-200">
                        <p className="text-slate-400 uppercase text-[9px]">Calificación Ritmo</p>
                        <p className="text-emerald-600 text-xs mt-0.5 leading-normal">{fn122_classifyWpmPace(speechWpm)}</p>
                      </div>
                      <div className="p-2.5 bg-white border border-slate-200">
                        <p className="text-slate-400 uppercase text-[9px]">Confianza Estimada</p>
                        <p className="text-slate-900 text-sm mt-0.5 font-mono">{fn130_calculateVocalConfidence(90, speechWpm, 1)}%</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeFeatureDetail.interactiveMetric === 'languages' && (
                  <div className="space-y-3">
                    <label className="text-xs text-slate-500 block font-medium">Pronunciación comparada del usuario (Simulado):</label>
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      <div className="p-3 bg-white border border-slate-200">
                        <p className="text-[9px] text-slate-400 uppercase font-bold">Frase Objetivo:</p>
                        <p className="font-mono font-semibold text-slate-700">"This project is ready for implementation."</p>
                      </div>
                      <div className="p-3 bg-white border border-slate-200">
                        <p className="text-[9px] text-slate-400 uppercase font-bold">Tu Pronunciación detectada:</p>
                        <p className="font-mono font-semibold text-slate-600">"Dees project is ready for implamentation."</p>
                      </div>
                    </div>
                    <div className="p-3 bg-white border border-slate-200 text-center">
                      <p className="text-[9px] text-slate-400 uppercase font-bold">Precisión Fonética Estimada</p>
                      <p className="text-lg font-black text-blue-600 mt-1 font-mono">
                        {fn113_estimatePronunciationMatch("This project is ready for implementation.", "Dees project is ready for implamentation.")}%
                      </p>
                    </div>
                  </div>
                )}

                {activeFeatureDetail.interactiveMetric === 'chess' && (
                  <div className="space-y-3">
                    <label className="text-xs text-slate-500 block font-medium">Calculadora de impacto cognitivo en ELO estimado:</label>
                    <div className="flex gap-2">
                      {[1000, 1200, 1400, 1600].map(elo => (
                        <button
                          key={elo}
                          onClick={() => setChessElo(elo)}
                          className={`flex-1 py-1.5 text-xs font-bold border transition-colors ${chessElo === elo ? 'border-amber-500 bg-amber-50 text-amber-700' : 'bg-white border-slate-200'}`}
                        >
                          {elo} ELO
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-[11px] font-bold text-slate-650">
                      <div className="p-2.5 bg-white border border-slate-200">
                        <p className="text-slate-400 uppercase text-[9px]">Ganancia si Aciertas</p>
                        <p className="text-amber-600 text-sm mt-0.5 font-mono">+{16} ELO</p>
                      </div>
                      <div className="p-2.5 bg-white border border-slate-200">
                        <p className="text-slate-400 uppercase text-[9px]">Pérdida si Fallas</p>
                        <p className="text-slate-950 text-sm mt-0.5 font-mono">-{16} ELO</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeFeatureDetail.interactiveMetric === 'vocab' && (
                  <div className="space-y-3">
                    <label className="text-xs text-slate-500 block font-medium">Calculadora de Riqueza de Vocabulario por Nivel:</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="range"
                        min="5"
                        max="80"
                        value={wordsKnown}
                        onChange={(e) => setWordsKnown(parseInt(e.target.value))}
                        className="flex-1 accent-pink-500"
                      />
                      <span className="font-mono text-xs text-slate-900 font-bold bg-white px-2 py-1 border border-slate-200 shrink-0">{wordsKnown} palabras</span>
                    </div>
                    <div className="p-3 bg-white border border-slate-200 text-center">
                      <p className="text-[9px] text-slate-400 uppercase font-bold">Riqueza Estimada en Nivel C2</p>
                      <p className="text-lg font-black text-pink-600 mt-1 font-mono">{fn145_calculateVocabularyWealth(wordsKnown, 'C2')} puntos léxicos</p>
                    </div>
                  </div>
                )}

                {activeFeatureDetail.interactiveMetric === 'executive' && (
                  <div className="space-y-3">
                    <label className="text-xs text-slate-500 block font-medium">Ejemplo de análisis de discurso ejecutivo en junta:</label>
                    <div className="p-3 bg-white border border-slate-200 text-[11px] leading-relaxed text-slate-650 font-light italic">
                      "I believe our strategy mitigates risk while creating collaborative synergy across departments."
                    </div>
                    <div className="p-3 bg-white border border-slate-200 text-center">
                      <p className="text-[9px] text-slate-400 uppercase font-bold">Índice de Diplomacia C-Suite Estimado</p>
                      <p className="text-lg font-black text-violet-600 mt-1 font-mono">
                        {fn125_estimateDiplomacyScore("I believe our strategy mitigates risk while creating collaborative synergy across departments.")}%
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 flex gap-4 justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="bg-slate-100 hover:bg-slate-250 text-slate-700 font-bold py-2.5 px-6 text-xs uppercase tracking-wider transition-colors"
              >
                Cerrar Ventana
              </button>
              <Link href="/register">
                <button className={`text-white font-bold py-2.5 px-6 text-xs uppercase tracking-widest ${activeColor.btn}`}>
                  Probar Demo Completa
                </button>
              </Link>
            </div>

          </div>
        </div>

      )}

      {/* CTA */}
      <section className="py-24 px-6 bg-[#edf7f2] border-t border-emerald-100 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-4xl font-bold text-slate-900">¿Listo para experimentarlo?</h2>
          <p className="text-slate-500 text-lg">Crea tu cuenta gratis y accede a todas las características del ecosistema desde el primer día.</p>
          <Link href="/register">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-12 text-lg transition-all shadow-xl shadow-indigo-600/20 hover:scale-105">
              Comenzar Ahora — Es Gratis
            </button>
          </Link>
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
