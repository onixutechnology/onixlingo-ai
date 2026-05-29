'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2, Gem, Crown, Trophy, ArrowRight, ChevronRight, CheckCircle2,
  Sparkles, Shield, Activity, BarChart3, Users, Play, Volume2, Award,
  Clock, Zap, Check, MessageSquare, Briefcase, Mic, AlertCircle, Share2,
  Linkedin, Twitter, Eye, Download
} from 'lucide-react';

const roles = [
  { id: 'ceo', name: 'CEO (Director Ejecutivo)', icon: Crown, desc: 'Enfocado en visión estratégica, diplomacia y discursos de alta dirección.' },
  { id: 'cfo', name: 'CFO (Director de Finanzas)', icon: Briefcase, desc: 'Enfocado en precisión analítica, reportes trimestrales y juntas de inversión.' },
  { id: 'cmo', name: 'CMO (Director de Marketing)', icon: MessageSquare, desc: 'Enfocado en persuasión, branding de marca y manejo de relaciones públicas.' }
];

const scenarios = [
  {
    id: 'ma',
    role: 'ceo',
    title: 'Negociación de Fusión & Adquisición (M&A)',
    situation: 'Debes presentar los términos finales de una adquisición estratégica ante un panel de accionistas escépticos de OnixCorp.',
    prompt: 'Presenta la justificación estratégica del acuerdo de $40M, minimizando el riesgo de pasivos ocultos.',
    teleprompter: '“Este acuerdo representa una sinergia operativa sin precedentes. Hemos auditado con rigor cada pasivo estratégico para garantizar un proceso de integración limpio...”',
    metrics: {
      accuracy: '96%',
      fluency: '94%',
      fillerWords: '0 filler words (Perfect control)',
      diplomacy: 'Excellent (C-Suite Standard)',
      jargon: 'Operational Synergy, Due Diligence, M&A Strategy',
      percentile: '98th percentile'
    }
  },
  {
    id: 'vc',
    role: 'ceo',
    title: 'Series B Pitch a Venture Capitalists',
    situation: 'Estás buscando levantar $15 millones de dólares ante un sindicato de fondos de Silicon Valley.',
    prompt: 'Explica tu tracción del último año y el multiplicador de valor proyectado de la tecnología de OnixLingo.',
    teleprompter: '“Nuestra tasa de retención corporativa se mantiene en un 94%, con un costo de adquisición de clientes optimizado al máximo...”',
    metrics: {
      accuracy: '97%',
      fluency: '98%',
      fillerWords: '1 minor pause (Excellent pace)',
      diplomacy: 'Persuasive (High Impact)',
      jargon: 'LTV/CAC Ratio, Churn Rate, Enterprise Scale',
      percentile: '99th percentile'
    }
  },
  {
    id: 'pr',
    role: 'cmo',
    title: 'Conferencia de Prensa por Crisis de Datos',
    situation: 'Una filtración menor de datos simulada requiere un discurso público sumamente controlado y empático para calmar a los clientes.',
    prompt: 'Comunica las medidas de seguridad inmediatas sin sonar defensivo ni admitir negligencia legal directa.',
    teleprompter: '“Nuestra prioridad absoluta es resguardar la soberanía de los datos. Hemos mitigado la brecha en 40 minutos e implementado un cifrado avanzado...”',
    metrics: {
      accuracy: '95%',
      fluency: '92%',
      fillerWords: '2 pauses (Good control)',
      diplomacy: 'Empathetic & Controlled',
      jargon: 'Data Sovereignty, Threat Mitigation, E2E Encryption',
      percentile: '95th percentile'
    }
  },
  {
    id: 'ipo',
    role: 'cfo',
    title: 'Presentación de Cierre Fiscal para IPO',
    situation: 'Presentación de resultados financieros consolidados ante la junta preparatoria del debut en Wall Street.',
    prompt: 'Justifica el margen operativo del trimestre y explica los gastos amortizados de I+D.',
    teleprompter: '“Amortizamos la inversión en el motor de IA a 5 años, asegurando un margen neto estable del 32% para el debut bursátil...”',
    metrics: {
      accuracy: '98%',
      fluency: '96%',
      fillerWords: '0 filler words (Perfect)',
      diplomacy: 'Highly Precise (Institutional)',
      jargon: 'Amortization, Net Margin, Capital Expenditures',
      percentile: '99th percentile'
    }
  }
];

const executiveUnits = [
  { id: '01', title: 'Fundamentos de Oratoria C-Suite', topic: 'Postura, modulación del ritmo e inflexión tonal de autoridad.' },
  { id: '02', title: 'Fusiones e Integración de Culturas', topic: 'Uso de vocabulario diplomático durante adquisiciones hostiles.' },
  { id: '03', title: 'Roadshows Financieros e IPO', topic: 'Presentación de métricas de capital y rentabilidad ante bolsas globales.' },
  { id: '04', title: 'Gestión Lingüística de Crisis', topic: 'Comunicación de incidentes operativos mitigando el pánico de inversores.' },
  { id: '05', title: 'El Arte del Pitch Persuasivo', topic: 'Estructuración de discursos de inversión con alta densidad léxica.' },
  { id: '06', title: 'Diplomacia y Alianzas Estatales', topic: 'Protocolos de lenguaje corporativo en negociaciones multi-gubernamentales.' }
];

export default function ProgramaEjecutivoPage() {
  const [selectedRole, setSelectedRole] = useState('ceo');
  const [selectedScenarioId, setSelectedScenarioId] = useState('ma');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0); // 0: intro, 1: recording, 2: results
  const [micActive, setMicActive] = useState(false);
  const [certShared, setCertShared] = useState(false);

  const activeScenarios = scenarios.filter(s => s.role === selectedRole);
  const currentScenario = scenarios.find(s => s.id === selectedScenarioId) || scenarios[0];

  const handleRoleChange = (roleId: string) => {
    setSelectedRole(roleId);
    const related = scenarios.find(s => s.role === roleId);
    if (related) {
      setSelectedScenarioId(related.id);
    }
    setIsSimulating(false);
    setSimulationStep(0);
  };

  const startSimulation = () => {
    setIsSimulating(true);
    setSimulationStep(0);
  };

  const startVoiceRecording = () => {
    setMicActive(true);
    setSimulationStep(1);
    // Simulate speaking duration
    setTimeout(() => {
      setMicActive(false);
      setSimulationStep(2);
    }, 6000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-100">
      
      {/* NAVBAR */}
      <nav className="fixed w-full bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
              <span>O</span>
            </div>
            <span className="font-bold text-white tracking-tight text-xl">OnixLingo</span>
          </Link>
          <div className="hidden md:flex gap-8 items-center text-sm font-semibold text-slate-400">
            <Link href="/caracteristicas" className="hover:text-white transition-colors">Características</Link>
            <Link href="/vocabulario" className="hover:text-white transition-colors">Vocabulario</Link>
            <Link href="/programa-ejecutivo" className="text-amber-400 border-b-2 border-amber-400 pb-0.5">Programa Ejecutivo</Link>
            <Link href="/planes" className="hover:text-white transition-colors">Planes</Link>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/login" className="hidden md:block text-sm font-semibold text-slate-400 hover:text-white transition-colors">Iniciar Sesión</Link>
            <Link href="/register">
              <button className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-sm font-bold py-2.5 px-6 transition-all shadow-md shadow-amber-500/20">
                Acceso Corporativo
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="pt-44 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-amber-500/10 to-transparent blur-[140px] opacity-60 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900 border border-slate-800 text-amber-400 text-xs font-bold uppercase tracking-widest shadow-lg">
            <Crown size={12} className="text-amber-500 animate-pulse" />
            C-Suite Boardroom Training
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.06]">
            Domina el Lenguaje de los<br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">Negocios Globales.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
            El simulador definitivo para fundadores, CEOs y directivos de OnixCorp. Entrena oratoria corporativa, fusiones, relaciones públicas y pitch de capital bajo condiciones reales de estrés de junta directiva.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a href="#simulator">
              <button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3.5 px-8 transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 hover:-translate-y-0.5">
                Probar Simulador <ArrowRight size={18} />
              </button>
            </a>
            <Link href="/planes">
              <button className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-white font-semibold py-3.5 px-8 transition-all">
                Ver Planes Corporativos
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* BENCHMARK STATS */}
      <section className="py-12 px-6 border-t border-slate-900 bg-slate-900/40">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { val: '60', label: 'Unidades C-Suite', color: 'text-amber-400' },
            { val: '24/7', label: 'IA Coach de Negocios', color: 'text-white' },
            { val: '98.4%', label: 'Fluidez Directiva Alcanzada', color: 'text-emerald-400' },
            { val: 'OnixCorp', label: 'Estándar de Certificación', color: 'text-amber-400' }
          ].map((s, i) => (
            <div key={i} className="p-6 border border-slate-900 bg-slate-950/80 shadow-2xl">
              <p className={`text-3xl font-extrabold ${s.color}`}>{s.val}</p>
              <p className="text-xs text-slate-500 font-semibold mt-1 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BOARDROOM SIMULATOR SECTION */}
      <section id="simulator" className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-16 space-y-4">
            <span className="text-xs font-black text-amber-500 uppercase tracking-widest">Boardroom Simulator</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">Simulador Interactivo de Juntas Directivas y Alta Dirección</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Seleccione una competencia ejecutiva y someta su oratoria corporativa al escáner fonométrico de inteligencia artificial.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left side selectors */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Role Selectors */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">1. Selección de Perfil Directivo C-Suite</h4>
                <div className="space-y-3">
                  {roles.map((r) => {
                    const Icon = r.icon;
                    return (
                      <button
                        key={r.id}
                        onClick={() => handleRoleChange(r.id)}
                        className={`w-full p-4 border text-left transition-all flex items-start gap-4 ${selectedRole === r.id ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'}`}
                      >
                        <div className={`p-2 shrink-0 ${selectedRole === r.id ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-white">{r.name}</p>
                          <p className="text-[11px] text-slate-400 leading-normal mt-1">{r.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Scenario selector */}
              <div className="space-y-3 pt-4 border-t border-slate-900">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">2. Selección de Escenario de Negociación Estratégica</h4>
                <div className="space-y-2">
                  {activeScenarios.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedScenarioId(s.id);
                        setIsSimulating(false);
                        setSimulationStep(0);
                      }}
                      className={`w-full p-3 text-left text-xs font-bold transition-all border flex items-center justify-between ${selectedScenarioId === s.id ? 'border-amber-500 text-amber-400 bg-amber-500/5' : 'border-slate-900 text-slate-400 bg-slate-950 hover:border-slate-800 hover:text-slate-300'}`}
                    >
                      <span>{s.title}</span>
                      <ChevronRight size={14} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side Simulator Screen */}
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 shadow-2xl relative min-h-[480px] flex flex-col">
              
              {/* Guest Access Alert (Branding differentiator) */}
              <div className="p-4 bg-amber-500/10 border-b border-amber-505/25 text-amber-300 flex items-start gap-3 text-xs leading-normal">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-amber-500" />
                <div>
                  <p className="font-extrabold uppercase text-[9px] tracking-wider text-amber-400 mb-0.5">Boardroom Simulator de Demostración (Acceso Invitado)</p>
                  <p className="font-light">Esta es una versión de prueba rápida para visitantes. Las simulaciones reales del plan **Executive** contienen lecciones extendidas integradas de 60 unidades, analítica avanzada de 8 dimensiones y certificados blockchain verificables en tu cuenta corporativa.</p>
                </div>
              </div>
              
              {/* Glass screen glowing details */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-transparent to-amber-500" />
              <div className="p-4 bg-slate-950 border-b border-slate-850 flex items-center justify-between text-xs text-slate-500 font-bold tracking-widest uppercase">
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-amber-500" />
                  <span>OnixLingo Executive Audio Engine v4.8</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-slate-400">Ready</span>
                </div>
              </div>

              {/* Interactive Area */}
              <div className="p-8 flex-1 flex flex-col justify-between">

                {!isSimulating && (
                  <div className="my-auto text-center space-y-6 py-6">
                    <div className="max-w-md mx-auto space-y-4">
                      <h4 className="text-xl font-bold text-white">{currentScenario.title}</h4>
                      <p className="text-slate-400 text-xs leading-relaxed">{currentScenario.situation}</p>
                    </div>

                    <div className="p-4 bg-slate-950 border border-slate-850 max-w-lg mx-auto text-left space-y-2">
                      <p className="text-[10px] text-amber-400 font-black uppercase tracking-wider">Tu Objetivo de Discurso:</p>
                      <p className="text-xs text-slate-300 leading-normal">"{currentScenario.prompt}"</p>
                    </div>

                    <button
                      onClick={startSimulation}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 px-8 text-xs tracking-widest uppercase transition-all shadow-lg shadow-amber-500/20"
                    >
                      Entrar a la Sala de Simulación
                    </button>
                  </div>
                )}

                {isSimulating && simulationStep === 0 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <span className="text-[10px] text-amber-400 font-black uppercase tracking-widest">Escenario Activo</span>
                      <h4 className="text-lg font-bold text-white">{currentScenario.title}</h4>
                    </div>

                    <div className="p-6 bg-slate-950 border border-slate-800 space-y-4">
                      <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider block border-b border-slate-800 pb-1.5">Teleprompter de Práctica:</span>
                      <p className="text-sm font-semibold italic text-slate-200 leading-relaxed">{currentScenario.teleprompter}</p>
                    </div>

                    <div className="flex flex-col items-center py-4 border-t border-slate-850">
                      <p className="text-xs text-slate-400 mb-4">Haz clic abajo para iniciar tu micrófono y leer la frase.</p>
                      <button
                        onClick={startVoiceRecording}
                        className="w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all animate-pulse border-4 border-slate-800 hover:scale-105 active:scale-95"
                      >
                        <Mic size={24} />
                      </button>
                    </div>
                  </div>
                )}

                {isSimulating && simulationStep === 1 && (
                  <div className="my-auto text-center space-y-6 py-8">
                    <div className="flex justify-center items-center gap-1.5 h-12">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((h, i) => (
                        <div
                          key={i}
                          style={{ height: `${h * 4}px` }}
                          className="w-1 bg-amber-500 animate-pulse rounded-full"
                        />
                      ))}
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-lg font-bold text-white animate-pulse">Analizando frecuencia vocal...</h4>
                      <p className="text-slate-400 text-xs font-mono">Grabando tu respuesta en tiempo real (CEFR / WPM Metric). Manten la velocidad...</p>
                    </div>
                    <div className="text-xs text-red-400 font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                      MICROFONO ACTIVO
                    </div>
                  </div>
                )}

                {isSimulating && simulationStep === 2 && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-850 pb-4">
                      <div>
                        <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Análisis Completado</span>
                        <h4 className="text-lg font-bold text-white">{currentScenario.title}</h4>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-amber-400">{currentScenario.metrics.percentile}</p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Percentil Corporativo</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Fluency Accuracy', val: currentScenario.metrics.fluency, color: 'text-emerald-400' },
                        { label: 'Pronunciation Core', val: currentScenario.metrics.accuracy, color: 'text-white' },
                        { label: 'Diplomacy Index', val: currentScenario.metrics.diplomacy, color: 'text-amber-400' },
                        { label: 'Filler Word Control', val: currentScenario.metrics.fillerWords, color: 'text-white' }
                      ].map((m, i) => (
                        <div key={i} className="p-3 bg-slate-950 border border-slate-850">
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{m.label}</p>
                          <p className={`text-base font-bold mt-1 ${m.color}`}>{m.val}</p>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-slate-950 border border-slate-850 space-y-1.5 text-xs">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">C-Suite Jargon Detectado:</p>
                      <p className="font-mono text-amber-400 font-bold">{currentScenario.metrics.jargon}</p>
                    </div>

                    <div className="flex gap-4 justify-end pt-4 border-t border-slate-850">
                      <button
                        onClick={() => {
                          setSimulationStep(0);
                          setIsSimulating(false);
                        }}
                        className="border border-slate-700 hover:border-slate-500 text-white font-bold py-2.5 px-6 text-xs tracking-wider uppercase transition-colors"
                      >
                        Salir de Simulación
                      </button>
                      <button
                        onClick={startSimulation}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 px-6 text-xs tracking-wider uppercase transition-all shadow-md shadow-amber-500/20"
                      >
                        Simular Otra Vez
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CURRICULUM SYLLABUS SECTION */}
      <section className="py-24 px-6 bg-slate-900 border-t border-slate-850">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16 space-y-4">
            <span className="text-xs font-black text-amber-400 uppercase tracking-widest">Currículum del Programa</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">60 Unidades de Especialización Directiva</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">Cada unidad está diseñada con simulaciones de audio adaptativas y feedback instantáneo por el motor neuronal de OnixLingo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {executiveUnits.map((u) => (
              <div key={u.id} className="p-6 border border-slate-800 bg-slate-950/60 hover:border-amber-500/30 transition-all group">
                <div className="text-2xl font-black text-amber-500/20 group-hover:text-amber-500/40 transition-colors mb-4">{u.id}</div>
                <h4 className="text-lg font-bold text-white mb-2">{u.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-light">{u.topic}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/register">
              <button className="inline-flex items-center gap-2 text-xs font-black text-amber-400 hover:text-amber-300 uppercase tracking-widest group">
                Descargar plan de estudios completo corporativo (PDF) 
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

        </div>
      </section>

      {/* GRADUATION CREDENTIAL AND CERTIFICATE */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-amber-500/5 blur-[130px] opacity-40 pointer-events-none rounded-none" />
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-black text-amber-500 uppercase tracking-widest">Acreditación Oficial</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                Certificación Directiva:<br />
                <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">Executive Speech Standard.</span>
              </h2>
              <p className="text-slate-400 leading-relaxed font-light text-sm">
                Al completar los 60 temas del currículum, recibirás la credencial digital de oratoria internacional respaldada por OnixCorp. Esta acreditación cuenta con un hash único verificable por departamentos de recursos humanos en la blockchain educativa corporativa.
              </p>

              <ul className="space-y-3.5 text-xs text-slate-300 font-medium">
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-amber-500 shrink-0" />
                  <span>Cumple con estándares lingüísticos C2 MCER.</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-amber-500 shrink-0" />
                  <span>Integrable de forma directa en LinkedIn y Twitter.</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-amber-500 shrink-0" />
                  <span>Hash verificable y auditable por empresas asociadas.</span>
                </li>
              </ul>
            </div>

            {/* Glowing Certificate Artifact Representation */}
            <div className="lg:col-span-7">
              <div className="p-8 bg-slate-900 border-2 border-amber-500/30 rounded-none shadow-2xl relative overflow-hidden group">
                
                {/* Glowing border accents */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-xl group-hover:bg-amber-500/20 transition-all pointer-events-none rounded-none" />
                <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-amber-500/40" />
                <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-amber-500/40" />

                {/* Main Certificate Header */}
                <div className="border border-amber-500/20 p-6 md:p-10 space-y-6 text-center bg-slate-950/60">
                  <div className="flex justify-center mb-2">
                    <div className="w-12 h-12 bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/30">
                      <Crown size={22} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest">Certificación de Logro</p>
                    <h3 className="font-serif text-2xl md:text-3xl text-white tracking-wide">Executive Speech Standard</h3>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[9px] text-slate-500 font-bold uppercase">Otorgado a:</p>
                    <p className="text-lg font-bold text-white tracking-wide border-b border-slate-800 pb-2 max-w-sm mx-auto">Alejandro Pérez C.</p>
                    <p className="text-[10px] text-slate-400 italic font-light max-w-md mx-auto">
                      "Por haber completado con excelencia el simulador boardroom de 60 unidades de oratoria ejecutiva internacional en los niveles B2, C1 y C2."
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono pt-4 border-t border-slate-900">
                    <div className="text-left">
                      <p>CERTIFICADO ID: ONIX-839-C2</p>
                      <p className="text-amber-500/60 font-semibold">VERIFICACIÓN: ACTIVA</p>
                    </div>
                    <div className="text-right">
                      <p>FECHA: MAYO 2026</p>
                      <p className="text-slate-400">OnixLingo Accreditation Board</p>
                    </div>
                  </div>
                </div>

                {/* Share actions */}
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-400">
                  <span>Comparte tu logro en redes sociales:</span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setCertShared(true)}
                      className="flex items-center gap-2 bg-[#0077b5] text-white py-2 px-4 hover:opacity-90 transition-all font-semibold rounded-none"
                    >
                      <Linkedin size={14} /> LinkedIn
                    </button>
                    <button
                      onClick={() => setCertShared(true)}
                      className="flex items-center gap-2 bg-[#1da1f2] text-white py-2 px-4 hover:opacity-90 transition-all font-semibold rounded-none"
                    >
                      <Twitter size={14} /> Twitter
                    </button>
                  </div>
                </div>

                {certShared && (
                  <div className="mt-4 p-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center font-medium">
                    ✓ ¡Enlace de acreditación generado e importado a tus credenciales temporales con éxito!
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ENTERPRISE CALL TO ACTION */}
      <section className="py-24 px-6 bg-slate-900 border-t border-slate-800 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto shadow-inner">
            <Building2 size={24} />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">¿Quieres implementar OnixLingo en tu empresa?</h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed font-light">
              Ofrecemos planes corporativos para equipos C-Suite con control multi-tenant de analíticas, integraciones de SSO y personalización de currículum de marca.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/planes">
              <button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3.5 px-8 text-sm uppercase tracking-wider transition-colors">
                Ver Licencias B2B
              </button>
            </Link>
            <Link href="/ventas">
              <button className="bg-slate-950 border border-slate-800 text-slate-300 hover:text-white font-semibold py-3.5 px-8 text-sm transition-all hover:border-amber-500/30">
                Contactar Ventas OnixCorp
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 py-10 px-6 text-sm text-slate-500 border-t border-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-bold text-white">OnixLingo</span>
          <div className="flex gap-6 font-medium flex-wrap">
            <Link href="/planes" className="hover:text-amber-400 transition-colors">Planes</Link>
            <Link href="/legal/privacy" className="hover:text-amber-400 transition-colors">Privacidad</Link>
            <Link href="/legal/terms" className="hover:text-amber-400 transition-colors">Términos</Link>
            <Link href="/legal/refunds" className="hover:text-amber-400 transition-colors">Reembolsos</Link>
          </div>
          <p className="text-xs text-slate-600">© 2026 OnixuTechnology.</p>
        </div>
      </footer>

    </div>
  );
}
