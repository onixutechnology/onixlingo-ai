'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  BrainCircuit, 
  Mic, 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Gem,
  Crown,
  BookOpen,
  Languages,
  LayoutGrid,
  Building2,
  User,
  Zap,
  Clock,
  Trophy,
  X
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#edf7f2] font-sans text-slate-800 selection:bg-indigo-500/30 selection:text-indigo-900">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed w-full bg-[#edf7f2]/90 backdrop-blur-xl border-b border-emerald-100 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-none flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/20">
              <span className="mt-0.5">O</span>
            </div>
            <span className="font-bold text-slate-900 tracking-tight text-xl">OnixLingo</span>
          </div>
          
          <div className="hidden md:flex gap-8 items-center text-sm font-semibold text-slate-600">
            <Link href="/caracteristicas" className="hover:text-indigo-600 transition-colors">Características</Link>
            <Link href="/vocabulario" className="hover:text-indigo-600 transition-colors">Vocabulario</Link>
            <Link href="/programa-ejecutivo" className="hover:text-indigo-600 transition-colors">Programa Ejecutivo</Link>
            <Link href="/planes" className="hover:text-indigo-600 transition-colors">Planes</Link>
          </div>

          <div className="flex gap-8 items-center">
            <Link href="/login" className="hidden md:block text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
              Iniciar Sesión
            </Link>
            <Link href="/register">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 px-6 rounded-none transition-all shadow-md shadow-indigo-600/20 hover:shadow-lg hover:scale-105 active:scale-95">
                Crear Cuenta Gratis
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="pt-40 pb-24 px-6 relative overflow-hidden bg-[#edf7f2]">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-100 rounded-none blur-[120px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-none bg-white border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest shadow-sm">
            <Sparkles size={12} className="text-indigo-600" />
            Ecosistema de Aprendizaje de Alto Rendimiento
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
            Ecosistema de Cognición y Oratoria C-Suite.
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
            Infraestructura integral de simulación lingüística y análisis acústico en tiempo real para el dominio técnico del Inglés, Francés y Chino Mandarín, potenciada por entrenamiento estratégico cognitivo de alta precisión.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6">
            <div className="bg-white border border-slate-200 rounded-none p-4 shadow-sm">
              <p className="text-2xl font-bold text-slate-900">900+</p>
              <p className="text-xs text-slate-500 font-medium">Lecciones Activas</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-none p-4 shadow-sm">
              <p className="text-2xl font-bold text-indigo-600">3</p>
              <p className="text-xs text-slate-500 font-medium">Idiomas Globales</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-none p-4 shadow-sm">
              <p className="text-2xl font-bold text-amber-600">60</p>
              <p className="text-xs text-slate-500 font-medium">Temas Ejecutivos</p>
            </div>
            <div className="bg-white border border-slate-200 rounded-none p-4 shadow-sm">
              <p className="text-2xl font-bold text-slate-900">100%</p>
              <p className="text-xs text-slate-500 font-medium">Feedback de Voz IA</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8">
            <Link href="/register" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-indigo-600 text-white text-lg font-bold py-4 px-10 rounded-none shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 hover:-translate-y-1 hover:bg-indigo-700">
                Comenzar Ahora <ArrowRight size={20} />
              </button>
            </Link>
            <Link href="/ventas" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 hover:border-indigo-600 hover:text-indigo-600 text-lg font-semibold py-4 px-10 rounded-none transition-all shadow-sm hover:shadow-md">
                Ver Planes y Licencias
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* --- ECOSISTEMA BENTO GRID --- */}
      <section id="features" className="py-24 bg-[#edf7f2] relative z-10 border-t border-emerald-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 md:text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">Arquitectura Holística de Aprendizaje</h2>
            <p className="text-slate-600 text-xl font-light">
              Módulos altamente especializados y calibrados algorítmicamente para optimizar el rendimiento y el desarrollo cognitivo-lingüístico ejecutivo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Standard English & Multilang */}
            <div className="md:col-span-2 group bg-white p-8 rounded-none border border-slate-200 hover:border-indigo-300 transition-all duration-300 overflow-hidden relative">
              <div className="absolute right-[-5%] top-[-10%] opacity-5 group-hover:opacity-10 transition-opacity text-slate-900">
                <Globe size={200} />
              </div>
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-none flex items-center justify-center mb-6">
                <Languages size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Soberanía Multilingüe</h3>
              <p className="text-slate-600 leading-relaxed mb-6 max-w-md relative z-10">
                Instrucción rigurosa de Inglés, Francés y Chino Mandarín adaptada a los estándares de competencia del MCER. Interacción acústica con avatares nativos y retroalimentación de pronunciación instantánea.
              </p>
              <div className="flex gap-2 relative z-10">
                <span className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-none text-xs font-bold text-slate-600 shadow-sm">🇺🇸🇬🇧 Inglés</span>
                <span className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-none text-xs font-bold text-slate-600 shadow-sm">🇫🇷 Francés</span>
                <span className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-none text-xs font-bold text-slate-600 shadow-sm">🇨🇳 Chino</span>
              </div>
            </div>

            {/* Chess / Ajedrez */}
            <div className="group bg-white p-8 rounded-none border border-slate-200 hover:border-emerald-300 transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-none flex items-center justify-center mb-6">
                <Crown size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Ajedrez Estratégico</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Potenciación de procesos de toma de decisiones bajo presión directiva. Análisis táctico de aperturas, patrones complejos y problemas de flujo adaptativo guiados por nuestro tutor neuronal interactivo.
              </p>
            </div>

            {/* Vocabulary */}
            <div id="vocabulary" className="group bg-white p-8 rounded-none border border-slate-200 hover:border-pink-300 transition-all duration-300">
              <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-none flex items-center justify-center mb-6">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Expansión Léxica Activa</h3>
              <p className="text-slate-600 leading-relaxed text-sm mb-4">
                Asimilación e incorporación permanente de terminología ejecutiva avanzada mediante 60 bloques temáticos sin solapamiento por idioma (A1 a C2).
              </p>
              <div className="space-y-1.5 text-[10px] text-slate-500 font-bold uppercase">
                <div className="flex items-center gap-1.5"><Clock size={12} className="text-teal-600" /> Fácil: Sin límite temporal</div>
                <div className="flex items-center gap-1.5"><Clock size={12} className="text-teal-600" /> Medio: Umbral de 5 Minutos</div>
                <div className="flex items-center gap-1.5"><Clock size={12} className="text-amber-500" /> Pro: Umbral de 2 Minutos</div>
              </div>
            </div>

            {/* Pro & Executive Benefits */}
            <div className="md:col-span-4 group bg-slate-900 p-8 rounded-none border border-amber-500/30 hover:border-amber-500/60 transition-all duration-300 flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-slate-900/10">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900 rounded-none flex items-center justify-center shadow-lg">
                <Gem size={32} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-white">Membresías Pro & Executive</h3>
                  <span className="px-2 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase tracking-widest rounded-none">Licenciamiento Premium</span>
                </div>
                <p className="text-slate-300 leading-relaxed max-w-3xl">
                  Acceso irrestricto a currícula avanzada, vocabulario y ajedrez ilimitados, simuladores acústicos de voz y un **multiplicador de boletos x5** para sorteos mensuales de hardware corporativo al completar bloques de vocabulario en dificultad **Pro**.
                </p>
              </div>
              <div>
                <Link href="/ventas">
                  <button className="whitespace-nowrap px-6 py-3 bg-white hover:bg-amber-400 text-slate-900 rounded-none font-bold transition-all shadow-md">
                    Ver Licencias
                  </button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- CORE TECH FEATURES --- */}
      <section className="py-24 bg-[#edf7f2] border-t border-emerald-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-none flex items-center justify-center mb-2 shadow-sm">
              <BrainCircuit size={28} />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Motor Inferencia Neuronal de Baja Latencia</h4>
            <p className="text-slate-600 leading-relaxed text-sm">
              Modelos optimizados localmente a nivel Edge para una interacción conversacional de respuesta inmediata.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-none flex items-center justify-center mb-2 shadow-sm">
              <Mic size={28} />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Análisis Fonométrico de Precisión</h4>
            <p className="text-slate-600 leading-relaxed text-sm">
              Evaluación acústica de formantes y mapa fonético para una corrección articulatoria instantánea de nivel nativo.
            </p>
          </div>
          <div id="executive" className="flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-none flex items-center justify-center mb-2 shadow-sm">
              <Sparkles size={28} />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Simulador Boardroom y Negociación C-Suite</h4>
            <p className="text-slate-600 leading-relaxed text-sm">
              Inmersión directiva en 60 escenarios simulados de fusiones, rondas de inversión, roadshows y diplomacia corporativa.
            </p>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN PLANES (PERSONAL B2C) --- */}
      <section id="pricing" className="py-24 bg-[#edf7f2] border-t border-emerald-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
              Planes individuales para ti
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Elige el nivel de aceleración adecuado para tus objetivos profesionales y personales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Plan 1: FREE */}
            <div className="bg-white border border-slate-200 rounded-none p-8 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
              <div>
                <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-none flex items-center justify-center mb-6">
                  <User size={24} />
                </div>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-2xl font-bold text-slate-900">FREE</h3>
                  <span className="text-sm font-semibold text-slate-500">$0 MXN / mes</span>
                </div>
                <p className="text-slate-600 mb-6 text-sm">
                  Para arrancar tus bases de forma guiada en múltiples idiomas.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-slate-700 text-sm">
                    <CheckCircle2 size={18} className="text-indigo-500 shrink-0" /> Lecciones A1 (Inglés)
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 text-sm">
                    <CheckCircle2 size={18} className="text-indigo-500 shrink-0" /> Vocabulario: 1 bloque al día
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 text-sm">
                    <CheckCircle2 size={18} className="text-indigo-500 shrink-0" /> Ajedrez: 2 puzzles al día
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 text-sm">
                    <CheckCircle2 size={18} className="text-indigo-500 shrink-0" /> Idiomas: ES, FR, CN
                  </li>
                </ul>
              </div>
              <Link href="/register">
                <button className="w-full bg-[#edf7f2] border border-slate-200 hover:border-indigo-600 text-slate-800 hover:text-indigo-600 font-bold py-3 px-6 rounded-none transition-all shadow-sm">
                  Crear Cuenta Gratis
                </button>
              </Link>
            </div>

            {/* Plan 2: PRO */}
            <div className="bg-white border border-indigo-200 rounded-none p-8 shadow-sm flex flex-col justify-between hover:border-indigo-400 transition-all relative">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-none">
                RECOMENDADO
              </div>
              <div>
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-none flex items-center justify-center mb-6">
                  <Zap size={24} />
                </div>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-2xl font-bold text-slate-900">PRO</h3>
                  <span className="text-sm font-semibold text-slate-500">$129 MXN / mes</span>
                </div>
                <p className="text-slate-600 mb-6 text-sm">
                  Acceso completo a todos los niveles estándar del idioma.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-slate-700 text-sm">
                    <CheckCircle2 size={18} className="text-indigo-500 shrink-0" /> 900+ lecciones (A1 a C1)
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 text-sm">
                    <CheckCircle2 size={18} className="text-indigo-500 shrink-0" /> Vocabulario y ajedrez ilimitados
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 text-sm">
                    <CheckCircle2 size={18} className="text-indigo-500 shrink-0" /> Sin anuncios publicitarios
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 text-sm">
                    <CheckCircle2 size={18} className="text-indigo-500 shrink-0" /> Idiomas: ES, FR, CN
                  </li>
                </ul>
              </div>
              <Link href="/register?tier=pro">
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-none transition-all shadow-md shadow-indigo-600/10">
                  Adquirir Plan Pro
                </button>
              </Link>
            </div>

            {/* Plan 3: EXECUTIVE */}
            <div className="bg-slate-900 border border-slate-800 rounded-none p-8 shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute right-[-10%] top-[-10%] opacity-10">
                <Crown size={200} className="text-amber-400" />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-amber-500/20 text-amber-400 rounded-none flex items-center justify-center mb-6">
                  <Crown size={24} />
                </div>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-2xl font-bold text-white">EXECUTIVE</h3>
                  <span className="text-sm font-semibold text-amber-400">$249 MXN / mes</span>
                </div>
                <p className="text-slate-300 mb-6 text-sm">
                  Desbloqueo definitivo. Currículum de negocios y tutoría avanzada por IA.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-slate-300 text-sm">
                    <CheckCircle2 size={18} className="text-amber-400 shrink-0" /> Acceso ilimitado a TODO el sistema
                  </li>
                  <li className="flex items-center gap-3 text-slate-300 text-sm">
                    <CheckCircle2 size={18} className="text-amber-400 shrink-0" /> Temario Executive de Negocios
                  </li>
                  <li className="flex items-center gap-3 text-slate-300 text-sm">
                    <CheckCircle2 size={18} className="text-amber-400 shrink-0" /> Tutoría conversacional por IA
                  </li>
                  <li className="flex items-center gap-3 text-slate-300 text-sm">
                    <CheckCircle2 size={18} className="text-amber-400 shrink-0" /> Multiplicador x5 en sorteos premium
                  </li>
                  <li className="flex items-center gap-3 text-slate-300 text-sm">
                    <CheckCircle2 size={18} className="text-amber-400 shrink-0" /> Certificación oficial de estudios
                  </li>
                </ul>
              </div>
              <Link href="/register?tier=executive" className="relative z-10">
                <button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3 px-6 rounded-none transition-all shadow-lg shadow-amber-500/10">
                  Adquirir Executive
                </button>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* --- TERMINAL DEMO --- */}
      <section className="py-32 bg-[#edf7f2] overflow-hidden relative border-t border-emerald-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-20 relative z-10">
          <div className="flex-1 space-y-10">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
              Aprende conversando, <br/>no memorizando.
            </h2>
            <div className="space-y-6">
              <div className="flex gap-6 items-start">
                <div className="p-2 bg-indigo-100 rounded-none text-indigo-600 mt-1"><CheckCircle2 size={24} /></div>
                <div>
                  <h4 className="text-xl font-bold mb-2 text-slate-900">Entorno Libre de Juicios</h4>
                  <p className="text-slate-600 leading-relaxed">Practica a tu propio ritmo. Nuestro tutor IA tiene paciencia infinita y está disponible 24/7.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="p-2 bg-purple-100 rounded-none text-purple-600 mt-1"><CheckCircle2 size={24} /></div>
                <div>
                  <h4 className="text-xl font-bold mb-2 text-slate-900">Feedback Contextual</h4>
                  <p className="text-slate-600 leading-relaxed">Correcciones explicadas al instante, entendiendo el contexto de lo que querías comunicar.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full">
            <div className="bg-slate-900 border border-slate-800 rounded-none p-6 md:p-8 shadow-2xl relative">
              <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500"></div>
                  <div className="w-3 h-3 bg-amber-500"></div>
                  <div className="w-3 h-3 bg-emerald-500"></div>
                </div>
              </div>
              
              <div className="space-y-6 font-mono text-sm">
                <div className="flex flex-col gap-1 border-l-2 border-slate-700 pl-3">
                  <span className="text-slate-400 text-xs font-bold font-sans">Boardroom Simulator (AI Coach) &gt;</span>
                  <span className="text-slate-300">"Welcome to the C-Suite simulation. Let's practice presenting the quarterly growth projection to the shareholders. Start with an opening statement."</span>
                </div>
                <div className="flex flex-col gap-1 border-l-2 border-amber-500 pl-3">
                  <span className="text-amber-400 text-xs font-bold font-sans">Student (CEO) &gt;</span>
                  <span className="text-slate-100">"Our company grew a lot last quarter and we hope to make more next year."</span>
                </div>
                <div className="flex flex-col gap-1 border-l-2 border-slate-700 pl-3">
                  <span className="text-slate-400 text-xs font-bold font-sans">AI Feedback & Speech Analytics &gt;</span>
                  <span className="text-slate-300">"Grammatically correct, but let's upgrade the vocabulary for an executive audience. Try saying: **'Our organization recorded substantial growth this quarter, and we project a strong upward trajectory for the upcoming fiscal year.'**"</span>
                </div>
                <div className="flex flex-col gap-1 border-l-2 border-emerald-500 pl-3 opacity-90">
                  <span className="text-emerald-400 text-xs font-bold font-sans">Student (CEO) &gt;</span>
                  <span className="text-slate-100">"Our organization recorded substantial growth this quarter, and we project a strong upward trajectory for the upcoming fiscal year."</span>
                </div>
                <div className="flex flex-col gap-1 border-l-2 border-teal-500 pl-3">
                  <span className="text-teal-400 text-xs font-bold font-sans">Speech Analysis &gt;</span>
                  <span className="text-emerald-400 font-bold">✓ Pronunciation: 98% • Fluency: 95% • Tone: Confident & Authoritative</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section className="py-32 bg-[#edf7f2] text-center px-6 border-t border-emerald-100">
        <div className="max-w-4xl mx-auto space-y-10">
          <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
            El conocimiento global <br/>en tus manos.
          </h2>
          <p className="text-xl text-slate-600 font-light max-w-2xl mx-auto">
            Únete a OnixLingo y transforma la forma en la que aprendes, compites y te comunicas con el mundo.
          </p>
          <div className="flex flex-col items-center gap-4">
            <Link href="/register">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-bold py-5 px-12 rounded-none transition-all shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95">
                Crear Mi Cuenta Gratuita
              </button>
            </Link>
            <p className="text-sm text-slate-500 font-medium">Acceso inmediato a todos los módulos.</p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#e2efe7] py-12 px-6 text-sm text-slate-600 border-t border-emerald-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-lg">OnixLingo</span>
            </div>
            <p className="text-xs">Ecosistema Educativo de Alta Disponibilidad</p>
          </div>
          <div className="flex gap-8 font-medium flex-wrap">
            <Link href="/planes" className="hover:text-indigo-600 transition-colors">Planes y Precios</Link>
            <Link href="/legal/privacy" className="hover:text-indigo-600 transition-colors">Privacidad</Link>
            <Link href="/legal/terms" className="hover:text-indigo-600 transition-colors">Términos</Link>
            <Link href="/legal/refunds" className="hover:text-indigo-600 transition-colors">Reembolsos</Link>
            <Link href="/legal/support" className="hover:text-indigo-600 transition-colors">Soporte</Link>
          </div>
          <p className="text-xs">© 2026 OnixuTechnology.</p>
        </div>
      </footer>

    </div>
  );
}