'use client';
import LandingFooter from '@/components/LandingFooter';
import LandingNavbar from '@/components/LandingNavbar';

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
    tag: 'Sistema Adaptativa',
    title: 'Motor Neuronal de Cero Latencia',
    description: 'Nuestro núcleo de procesamiento cognitivo procesa cada respuesta en milisegundos. El sistema analiza tu nivel en tiempo real y recalibra la dificultad de cada ejercicio de forma automática, garantizando que siempre estés en tu zona óptima de aprendizaje.',
    bullets: [
      'Ajuste de dificultad en tiempo real por sesión',
      'Modelos de lenguaje alineados con el estándar MCER',
      'Memoria de sesión: recuerda tus errores previos',
      'Análisis de patrones de aprendizaje individual',
    ],
    stat: '< 80ms', statLabel: 'Latencia de respuesta',
    extraDetails: 'El motor neuronal utiliza arquitecturas Transformers optimizadas localmente en los nodos Edge de OnixLingo. Mediante técnicas de cuantización de parámetros a 4 bits, logramos tiempos de inferencia sub-80ms sobre flujos de audio continuos WebRTC.',
    interactiveMetric: 'density'
  },
  {
    icon: Mic,
    color: 'emerald',
    tag: 'Speech Analytics',
    title: 'Análisis Fonético con el sistema en Tiempo Real',
    description: 'Pronuncia, recibe feedback inmediato y corrige. Nuestro sistema de Speech Analytics descompone tu voz en métricas de precisión, fluidez, entonación, ritmo, ritmo y confianza. No solo te dice si es correcto — te dice exactamente qué ajustar.',
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
      'Inglés: 1,000+ lecciones con acento americano y británico',
      'Francés: Currículum DELF/DALF alineado con 2,000+ lecciones',
      'Chino Mandarín: Sistema Pinyin + 600+ lecciones HSK',
      'Traducción contextual y gramática comparativa',
    ],
    stat: '3', statLabel: 'Idiomas Globales',
    extraDetails: 'Currícula desarrollada en conjunto por directores académicos de OnixLingo y el British Council. El motor de traducción contextual y gramática comparativa resalta las diferencias sintácticas clave para evitar calcos lingüísticos.',
    interactiveMetric: 'languages'
  },
  {
    icon: Crown,
    color: 'amber',
    tag: 'Ajedrez Cognitivo',
    title: 'Entrenamiento de Pensamiento Estratégico',
    description: 'El ajedrez no es un juego — es una herramienta de desarrollo cognitivo. La misma arquitectura mental que usa un jugador de alto nivel para anticipar movimientos es la que usas para estructurar argumentos en negociaciones ejecutivas.',
    bullets: [
      'Puzzles tácticos adaptados a tu Elo estimado',
      'Aperturas clásicas: Ruy López, Siciliana, Caro-Kann',
      '3,000+ retos dinámicos y lecciones en la biblioteca',
      'Tutor automatizado que explica cada decisión táctica',
    ],
    stat: '3,000+', statLabel: 'Puzzles y Retos',
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
    title: 'Corporativo Simulator & Negociación Corporativa',
    description: 'El módulo más avanzado de OnixLingo. Simulaciones en tiempo real de escenarios corporativos de alto nivel: presentaciones ante inversores, fusiones y adquisiciones, negociaciones de contrato internacional y oratoria para Alta Dirección.',
    bullets: [
      '60 unidades de especialización ejecutiva',
      'Simulación de juntas directivas, pitch de VC y IPO',
      'Oratoria para CEOs, diplomacia y gestión de crisis',
      'Certification badge: Executive Speech Standard',
    ],
    stat: '60', statLabel: 'Unidades Executive',
    extraDetails: 'Nuestra gema de la corona. Simulaciones realistas que evalúan factores como la densidad de Alta Dirección Jargon, el índice de diplomacia y la velocidad de respuesta, otorgando credenciales validadas en la red de OnixLingo.',
    interactiveMetric: 'executive'
  },
];

const techStack = [
  { icon: Cpu, label: 'Motor de Sistema propio', sub: 'Alineado con el estándar MCER' },
  { icon: Radio, label: 'Streaming de audio real', sub: 'WebRTC + análisis fonético' },
  { icon: Shield, label: 'Datos cifrados E2E', sub: 'SOC2 compliant infrastructure' },
  { icon: Activity, label: 'Uptime 99.9%', sub: 'Infraestructura multi-región' },
  { icon: BarChart3, label: 'Analytics en tiempo real', sub: 'Dashboard de progreso vivo' },
  { icon: Users, label: 'Multi-tenant B2B', sub: 'Licencias corporativas disponibles' },
];

const colorMap: Record<string, { bg: string; text: string; border: string; icon: string; tag: string; btn: string }> = {
  indigo: { bg: 'bg-indigo-50/50', text: 'text-black', border: 'border-indigo-200', icon: 'bg-indigo-100 text-black', tag: 'bg-indigo-100 text-gray-900', btn: 'bg-white hover:bg-slate-50' },
  emerald: { bg: 'bg-white/50', text: 'text-[#D4AF37]', border: 'border-[#D4AF37]/30', icon: 'bg-gray-200 text-[#D4AF37]', tag: 'bg-gray-200 text-[#D4AF37]', btn: 'bg-emerald-600 hover:bg-emerald-700' },
  blue: { bg: 'bg-blue-50/50', text: 'text-[#D4AF37]', border: 'border-blue-200', icon: 'bg-blue-100 text-[#D4AF37]', tag: 'bg-blue-100 text-blue-700', btn: 'bg-[#D4AF37]/20 hover:bg-blue-700' },
  amber: { bg: 'bg-[#D4AF37]/10/50', text: 'text-[#D4AF37]', border: 'border-[#D4AF37]/30', icon: 'bg-amber-100 text-[#D4AF37]', tag: 'bg-amber-100 text-[#D4AF37]', btn: 'bg-[#D4AF37]/20 hover:bg-amber-700' },
  pink: { bg: 'bg-pink-50/50', text: 'text-pink-600', border: 'border-pink-200', icon: 'bg-pink-100 text-pink-600', tag: 'bg-pink-100 text-pink-700', btn: 'bg-pink-600 hover:bg-pink-700' },
  violet: { bg: 'bg-violet-50/50', text: 'text-violet-600', border: 'border-violet-200', icon: 'bg-violet-100 text-violet-600', tag: 'bg-violet-100 text-violet-700', btn: 'bg-violet-600 hover:bg-violet-700' },
};

export default function CaracteristicasPage() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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
    <div className="min-h-screen bg-white font-sans text-gray-800 selection:bg-[#D4AF37]/30 selection:text-black">

      {/* NAVBAR */}
      <LandingNavbar />

      {/* HERO (BLACK) */}
      <section className="pt-36 pb-16 px-6 relative overflow-hidden bg-slate-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#D4AF37]/20/10 blur-[130px] opacity-40 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase tracking-widest shadow-none">
            <Sparkles size={12} className="text-[#D4AF37] animate-pulse" />
            Ecosistema Tecnológico de Vanguardia
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Tecnología Avanzada para un<br />
            <span className="text-slate-900">Aprendizaje sin Fricciones.</span>
          </h1>
          <p className="text-lg text-slate-700 max-w-3xl mx-auto leading-relaxed font-light">
            OnixLingo integra tecnología cognitiva, motores de análisis fonométrico en tiempo real y dinámicas de ajedrez estratégico para asegurar un desarrollo cognitivo premium.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link href="/register">
              <button className="bg-[#D4AF37] hover:bg-[#b5952f] text-black font-bold py-3.5 px-8 transition-all shadow-none shadow-[#D4AF37]/20 flex items-center gap-2 hover:-translate-y-0.5">
                Comenzar Demo <ArrowRight size={18} />
              </button>
            </Link>
            <Link href="/planes">
              <button className="bg-transparent border border-[#D4AF37] hover:bg-[#D4AF37] hover:text-black text-slate-900 font-semibold py-3.5 px-8 transition-all">
                Explorar Planes
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* DETAILED STATS GRID (WHITE) */}
      <section className="py-10 px-6 border-y border-black bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { val: '3,000+', label: 'Lecciones de Idiomas', color: 'text-black' },
            { val: '3,000+', label: 'Retos de Ajedrez', color: 'text-[#D4AF37]' },
            { val: '1,400+', label: 'Temas y Contextos', color: 'text-black' },
            { val: '< 80ms', label: 'Latencia de Sistema', color: 'text-black' },
          ].map((s, i) => (
            <div key={i} className="p-5 bg-white border border-black shadow-none flex flex-col justify-center">
              <p className={`text-3xl font-black ${s.color}`}>{s.val}</p>
              <p className="text-[10px] text-gray-800 font-bold uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INTERACTIVE MODULE TABS (GOLD 20%) */}
      <section className="py-20 px-6 border-t border-black bg-[#D4AF37]/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight">Estructura Modular del Ecosistema</h2>
            <p className="text-black text-sm max-w-xl mx-auto font-medium">Seis pilares estratégicos diseñados con tecnología propietaria para maximizar el rendimiento.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {features.map((f, i) => {
              const c = colorMap[f.color];
              const Icon = f.icon;
              return (
                <button
                  key={i}
                  onClick={() => setActiveFeature(i)}
                  className={`flex items-center gap-2 px-5 py-3 text-xs font-bold transition-all border ${activeFeature === i ? `${c.icon} ${c.border} bg-white shadow-none ring-1 ring-black/5` : 'bg-white border-slate-200 text-slate-500 hover:border-slate-200 hover:text-slate-700'}`}
                >
                  <Icon size={14} />
                  {f.tag}
                </button>
              );
            })}
          </div>

          {/* Active Card */}
          <div className="max-w-4xl mx-auto">
            {features.map((f, i) => {
              if (i !== activeFeature) return null;
              const c = colorMap[f.color];
              const Icon = f.icon;
              return (
                <div key={i} className={`grid grid-cols-1 md:grid-cols-12 gap-8 items-center border border-white/40 bg-white p-8 md:p-12 shadow-none relative overflow-hidden`}>
                  <div className="md:col-span-8 space-y-5">
                    <span className={`inline-block px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${c.tag}`}>{f.tag}</span>
                    <h3 className="text-2xl md:text-3xl font-extrabold text-black leading-tight">{f.title}</h3>
                    <p className="text-slate-600 leading-relaxed text-sm">{f.description}</p>
                    <ul className="space-y-2">
                      {f.bullets.map((b, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                          <CheckCircle2 size={15} className={`${c.text} mt-0.5 shrink-0`} />
                          {b}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="flex gap-3 pt-3">
                      <button 
                        onClick={() => handleOpenDetails(i)}
                        className={`flex items-center gap-1.5 px-6 py-3 font-bold text-xs uppercase tracking-widest text-slate-900 shadow-none bg-white hover:bg-slate-50`}
                      >
                        Panel de Simulación <ChevronRight size={14} />
                      </button>
                      <Link href="/register">
                        <button className="border border-black bg-white hover:bg-white text-black font-semibold px-6 py-3 text-xs uppercase tracking-widest">
                          Iniciar Demo
                        </button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="md:col-span-4 flex flex-col items-center justify-center gap-4 py-4 md:border-l md:border-slate-200/50">
                    <div className={`w-32 h-32 ${c.icon} flex items-center justify-center shadow-none rounded-none border border-white/20`}>
                      <Icon size={56} />
                    </div>
                    <div className="text-center">
                      <p className={`text-4xl font-black ${c.text}`}>{f.stat}</p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{f.statLabel}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CAPABILITIES GRID (BLACK) */}
      <section className="py-20 px-6 bg-slate-50 border-t border-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">Tecnologías Integradas</h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto">Capas de infraestructura optimizadas para una experiencia sin interrupciones.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} onClick={() => handleOpenDetails(i)} className={`group p-6 border border-slate-200 bg-slate-50 hover:border-[#D4AF37] transition-all cursor-pointer shadow-none hover:shadow-none flex flex-col justify-between min-h-[220px]`}>
                  <div>
                    <div className={`w-10 h-10 bg-white text-[#D4AF37] border border-slate-200 flex items-center justify-center mb-4`}>
                      <Icon size={20} />
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest text-[#D4AF37] block mb-1`}>{f.tag}</span>
                    <h4 className="text-base font-bold text-slate-900 leading-tight mb-2">{f.title}</h4>
                    <p className="text-slate-600 text-xs leading-relaxed">{f.description.substring(0, 110)}...</p>
                  </div>
                  <div className={`flex items-center gap-1 mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-900 group-hover:text-[#D4AF37]`}>
                    Diagnóstico <ChevronRight size={10} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TECH ARCHITECTURE (WHITE) */}
      <section className="py-20 px-6 bg-white border-t border-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-black text-black uppercase tracking-widest">Infraestructura Directa</span>
            <h2 className="text-3xl font-bold text-black">Construido para Escala e Inferencia</h2>
            <p className="text-gray-600 text-sm max-w-xl mx-auto">Optimización fonométrica y WebRTC redundante a nivel global.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {techStack.map((t, i) => {
              const Icon = t.icon;
              return (
                <div key={i} className="p-5 border border-black bg-white hover:border-[#D4AF37] transition-all group flex items-start gap-4">
                  <div className="w-10 h-10 bg-white text-slate-900 flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:text-black transition-colors shrink-0">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h4 className="text-black text-sm font-bold">{t.label}</h4>
                    <p className="text-gray-600 text-[11px] mt-0.5 leading-normal">{t.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INTERACTIVE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-50/80 backdrop-blur-md">
          <div className="bg-white max-w-2xl w-full border border-slate-200 shadow-2xl relative flex flex-col justify-between max-h-[85vh] overflow-y-auto rounded-none">
            
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-[9px] font-black uppercase ${activeColor.tag}`}>{activeFeatureDetail.tag}</span>
                <h3 className="font-bold text-black text-base">Consola de Diagnóstico</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-black transition-colors p-1">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-amber-900 flex gap-3 text-xs leading-normal">
                <AlertTriangle size={18} className="shrink-0 mt-0.5 text-[#D4AF37]" />
                <div>
                  <p className="font-extrabold uppercase text-[9px] tracking-wider text-[#D4AF37] mb-0.5">Demostración de Inferencia e Sistema</p>
                  <p className="font-light">Las herramientas completas de Speech Analytics, simuladores acústicos de voz y persistencia en la base de datos están habilitadas en tu panel privado tras registrarte.</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-bold text-black">{activeFeatureDetail.title}</h4>
                <p className="text-gray-600 text-xs leading-relaxed">{activeFeatureDetail.description}</p>
                <p className="text-slate-500 text-[11px] italic leading-normal">{activeFeatureDetail.extraDetails}</p>
              </div>

              {/* Dynamic Interactive Calculators */}
              <div className="p-5 bg-white border border-slate-200 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                  <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles size={12} className="text-[#D4AF37] animate-spin" />
                    Simulación Rápida de Entrada
                  </h4>
                  <span className="text-[9px] bg-[#D4AF37]/10 border border-amber-100 text-amber-900 px-2 py-0.5 font-bold uppercase">Sandbox</span>
                </div>

                {activeFeatureDetail.interactiveMetric === 'density' && (
                  <div className="space-y-3">
                    <label className="text-xs text-slate-500 block font-medium">Analizador de densidad de oratoria Alta Dirección:</label>
                    <textarea 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-slate-200 focus:border-amber-400 outline-none font-mono"
                      rows={3}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white border border-slate-200 text-center">
                        <p className="text-slate-500 uppercase text-[9px] font-bold">Densidad Léxica</p>
                        <p className="text-black text-lg font-black mt-0.5 font-mono">{Math.round(fn101_calcLexicalDensity(inputText))}%</p>
                      </div>
                      <div className="p-3 bg-white border border-slate-200 text-center">
                        <p className="text-slate-500 uppercase text-[9px] font-bold">Jargon Detectado</p>
                        <p className="text-black text-lg font-black mt-0.5 font-mono">{Math.round(fn110_detectJargonDensity(inputText, ['synergy', 'alignment', 'quarterly', 'board']))}%</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeFeatureDetail.interactiveMetric === 'speech' && (
                  <div className="space-y-3">
                    <label className="text-xs text-slate-500 block font-medium">Confianza vocal estimada según velocidad de lectura (WPM):</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="range" min="50" max="240" value={speechWpm}
                        onChange={(e) => setSpeechWpm(parseInt(e.target.value))}
                        className="flex-1 accent-gray-500"
                      />
                      <span className="font-mono text-xs text-black font-bold bg-white px-2 py-1 border border-slate-200 shrink-0">{speechWpm} WPM</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-white border border-slate-200 text-center">
                        <p className="text-slate-500 uppercase text-[9px] font-bold">Calificación Ritmo</p>
                        <p className="text-[#D4AF37] text-xs font-bold mt-1 leading-normal">{fn122_classifyWpmPace(speechWpm)}</p>
                      </div>
                      <div className="p-3 bg-white border border-slate-200 text-center">
                        <p className="text-slate-500 uppercase text-[9px] font-bold">Confianza Estimada</p>
                        <p className="text-black text-lg font-black mt-0.5 font-mono">{fn130_calculateVocalConfidence(90, speechWpm, 1)}%</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeFeatureDetail.interactiveMetric === 'languages' && (
                  <div className="space-y-3">
                    <label className="text-xs text-slate-500 block font-medium">Comparativa fonética del motor de traducción:</label>
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      <div className="p-2.5 bg-white border border-slate-200">
                        <p className="text-[8px] text-slate-500 uppercase font-bold">Frase Objetivo:</p>
                        <p className="font-mono font-semibold text-slate-700 text-xs mt-0.5">"This project is ready for implementation."</p>
                      </div>
                      <div className="p-2.5 bg-white border border-slate-200">
                        <p className="text-[8px] text-slate-500 uppercase font-bold">Tu Entrada Acústica:</p>
                        <p className="font-mono font-semibold text-slate-500 text-xs mt-0.5">"Dees project is ready for implamentation."</p>
                      </div>
                    </div>
                    <div className="p-3 bg-white border border-slate-200 text-center">
                      <p className="text-[9px] text-slate-500 uppercase font-bold">Alineación Silábica Estimada</p>
                      <p className="text-lg font-black text-[#D4AF37] mt-1 font-mono">
                        {fn113_estimatePronunciationMatch("This project is ready for implementation.", "Dees project is ready for implamentation.")}%
                      </p>
                    </div>
                  </div>
                )}

                {activeFeatureDetail.interactiveMetric === 'chess' && (
                  <div className="space-y-3">
                    <label className="text-xs text-slate-500 block font-medium">Ajuste de ELO cognitivo en biblioteca táctica:</label>
                    <div className="flex gap-2">
                      {[1000, 1200, 1400, 1600].map(elo => (
                        <button
                          key={elo} onClick={() => setChessElo(elo)}
                          className={`flex-1 py-1.5 text-xs font-bold border transition-colors ${chessElo === elo ? 'border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]' : 'bg-white border-slate-200 hover:border-slate-200'}`}
                        >
                          {elo} ELO
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="p-3 bg-white border border-slate-200">
                        <p className="text-slate-500 uppercase text-[9px] font-bold">Acierto Estimado</p>
                        <p className="text-[#D4AF37] text-lg font-black mt-0.5 font-mono">+{16} ELO</p>
                      </div>
                      <div className="p-3 bg-white border border-slate-200">
                        <p className="text-slate-500 uppercase text-[9px] font-bold">Fallo Estimado</p>
                        <p className="text-black text-lg font-black mt-0.5 font-mono">-{16} ELO</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeFeatureDetail.interactiveMetric === 'vocab' && (
                  <div className="space-y-3">
                    <label className="text-xs text-slate-500 block font-medium">Estimador de Riqueza Léxica en niveles avanzados:</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="range" min="5" max="80" value={wordsKnown}
                        onChange={(e) => setWordsKnown(parseInt(e.target.value))}
                        className="flex-1 accent-pink-500"
                      />
                      <span className="font-mono text-xs text-black font-bold bg-white px-2 py-1 border border-slate-200 shrink-0">{wordsKnown} palabras</span>
                    </div>
                    <div className="p-3 bg-white border border-slate-200 text-center">
                      <p className="text-[9px] text-slate-500 uppercase font-bold">Puntaje Léxico C2 Relativo</p>
                      <p className="text-lg font-black text-pink-600 mt-1 font-mono">{fn145_calculateVocabularyWealth(wordsKnown, 'C2')} pts</p>
                    </div>
                  </div>
                )}

                {activeFeatureDetail.interactiveMetric === 'executive' && (
                  <div className="space-y-3">
                    <label className="text-xs text-slate-500 block font-medium">Ejemplo de análisis diplomático de discurso:</label>
                    <div className="p-2.5 bg-white border border-slate-200 text-xs leading-relaxed text-gray-600 font-light italic">
                      "I believe our strategy mitigates risk while creating collaborative synergy across departments."
                    </div>
                    <div className="p-3 bg-white border border-slate-200 text-center">
                      <p className="text-[9px] text-slate-500 uppercase font-bold">Índice de Diplomacia Alta Dirección</p>
                      <p className="text-lg font-black text-violet-600 mt-1 font-mono">
                        {fn125_estimateDiplomacyScore("I believe our strategy mitigates risk while creating collaborative synergy across departments.")}%
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>

            <div className="p-5 border-t border-slate-200 flex gap-3 justify-end">
              <button onClick={() => setIsModalOpen(false)} className="bg-white hover:bg-white text-slate-700 font-bold py-2.5 px-5 text-xs uppercase tracking-wider transition-colors">
                Cerrar
              </button>
              <Link href="/register">
                <button className={`text-slate-900 font-bold py-2.5 px-5 text-xs uppercase tracking-widest ${activeColor.btn}`}>
                  Demo Completa
                </button>
              </Link>
            </div>

          </div>
        </div>
      )}

      {/* CTA (GOLD 20%) */}
      <section className="py-20 px-6 bg-[#D4AF37]/20 border-t border-black text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-black">¿Listo para comenzar?</h2>
          <p className="text-black text-sm font-medium">Crea tu cuenta gratis hoy mismo y accede al simulador interactivo de lecciones.</p>
          <Link href="/register">
            <button className="bg-white hover:bg-slate-50 text-[#D4AF37] font-bold py-4 px-12 text-sm uppercase tracking-widest transition-all shadow-xl shadow-black/20 hover:scale-105 border border-[#D4AF37]">
              Comenzar Ahora
            </button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <LandingFooter />
    </div>
  );
}
