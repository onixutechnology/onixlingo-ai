'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2, Crown, Trophy, ArrowRight, ChevronRight, CheckCircle2,
  Shield, Activity, Mic, AlertCircle, Linkedin, Twitter, Briefcase, MessageSquare
} from 'lucide-react';

const roles = [
  { id: 'ceo', name: 'CEO (Director Ejecutivo)', icon: Crown, desc: 'Enfocado en visión estratégica, diplomacia y discursos de alta dirección.' },
  { id: 'cfo', name: 'CFO (Director de Finanzas)', icon: Briefcase, desc: 'Enfocado en precisión analítica, reportes trimestrales y juntas de inversión.' },
  { id: 'cmo', name: 'CMO (Director de Marketing)', icon: MessageSquare, desc: 'Enfocado en persuasión, branding de marca y relaciones públicas.' }
];

const scenarios = [
  {
    id: 'ma',
    role: 'ceo',
    title: 'Negociación de Fusión & Adquisición (M&A)',
    situation: 'Debes presentar los términos finales de una adquisición estratégica ante un panel de accionistas escépticos de OnixCorp.',
    prompt: 'Presenta la justificación estratégica del acuerdo de $40M, minimizando el riesgo de pasivos ocultos.',
    teleprompter: 'Este acuerdo representa una sinergia operativa sin precedentes. Hemos auditado con rigor cada pasivo estratégico para garantizar un proceso de integración limpio.',
    jargonKeywords: ['sinergia', 'pasivo', 'estratégico', 'integración']
  },
  {
    id: 'vc',
    role: 'ceo',
    title: 'Series B Pitch a Venture Capitalists',
    situation: 'Estás buscando levantar $15 millones de dólares ante un sindicato de fondos de Silicon Valley.',
    prompt: 'Explica tu tracción del último año y el multiplicador de valor proyectado de la tecnología de OnixLingo.',
    teleprompter: 'Nuestra tasa de retención corporativa se mantiene en un noventa y cuatro por ciento, con un costo de adquisición de clientes optimizado al máximo.',
    jargonKeywords: ['retención', 'adquisición', 'optimizado', 'clientes']
  },
  {
    id: 'pr',
    role: 'cmo',
    title: 'Conferencia de Prensa por Crisis de Datos',
    situation: 'Una filtración menor de datos simulada requiere un discurso público sumamente controlado y empático para calmar a los clientes.',
    prompt: 'Comunica las medidas de seguridad inmediatas sin sonar defensivo ni admitir negligencia legal directa.',
    teleprompter: 'Nuestra prioridad absoluta es resguardar la soberanía de los datos. Hemos mitigado la brecha en cuarenta minutos e implementado un cifrado avanzado.',
    jargonKeywords: ['soberanía', 'datos', 'mitigado', 'cifrado']
  },
  {
    id: 'ipo',
    role: 'cfo',
    title: 'Presentación de Cierre Fiscal para IPO',
    situation: 'Presentación de resultados financieros consolidados ante la junta preparatoria del debut en Wall Street.',
    prompt: 'Justifica el margen operativo del trimestre y explica los gastos amortizados de I+D.',
    teleprompter: 'Amortizamos la inversión en el motor de inteligencia artificial a cinco años, asegurando un margen neto estable del treinta y dos por ciento para el debut bursátil.',
    jargonKeywords: ['amortizamos', 'margen', 'estable', 'bursátil']
  }
];

const executiveUnits = [
  { id: '01', title: 'Fundamentos de Oratoria C-Suite', topic: 'Postura, modulación del ritmo e inflexión tonal de autoridad.' },
  { id: '02', title: 'Fusiones e Integración de Culturas', topic: 'Uso de vocabulario diplomático durante adquisiciones hostiles.' },
  { id: '03', title: 'Roadshows Financieros e IPO', topic: 'Presentación de métricas de capital y rentabilidad ante bolsas globales.' },
  { id: '04', title: 'Gestión Lingüística de Crisis', topic: 'Comunicación de incidentes operativos mitigando el pánico de inversores.' },
  { id: '05', title: 'El Arte del Pitch Persuasivo', topic: 'Estructuración de discursos de inversión con alta densidad léxica.' },
  { id: '06', title: 'Diplomacia y Alianzas Estatales', topic: 'Protocolos de lenguaje corporativo en negociaciones de alto nivel.' }
];

export default function ProgramaEjecutivoPage() {
  const [selectedRole, setSelectedRole] = useState('ceo');
  const [selectedScenarioId, setSelectedScenarioId] = useState('ma');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0); // 0: intro, 1: recording, 2: results
  const [micActive, setMicActive] = useState(false);
  const [certShared, setCertShared] = useState(false);

  // Speech compatibility and written input modes
  const [speechSupported, setSpeechSupported] = useState(true);
  const [isWrittenMode, setIsWrittenMode] = useState(false);
  const [writtenText, setWrittenText] = useState('');
  const [recordDuration, setRecordDuration] = useState(0);
  const recordIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Real-time audio and speech recognition states
  const [userTranscript, setUserTranscript] = useState('');
  const [isFallback, setIsFallback] = useState(false);
  const [computedMetrics, setComputedMetrics] = useState({
    accuracy: '100%',
    fluency: '100%',
    fillerWords: '0 filler words (Perfect control)',
    diplomacy: 'Excellent (C-Suite Standard)',
    jargon: 'None',
    percentile: '99th percentile'
  });

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);

  const activeScenarios = scenarios.filter(s => s.role === selectedRole);
  const currentScenario = scenarios.find(s => s.id === selectedScenarioId) || scenarios[0];

  useEffect(() => {
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSpeechSupported(!!SpeechRecognitionClass);
    if (!SpeechRecognitionClass) {
      setIsWrittenMode(true);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

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
    setUserTranscript('');
  };

  const startVoiceRecording = async () => {
    setUserTranscript('');
    setIsFallback(false);
    setSimulationStep(1);
    setMicActive(true);
    setRecordDuration(0);

    if (recordIntervalRef.current) {
      clearInterval(recordIntervalRef.current);
    }
    recordIntervalRef.current = setInterval(() => {
      setRecordDuration(prev => prev + 1);
    }, 1000);

    // 1. Web Audio Visualizer Setup
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const canvas = document.getElementById('audio-canvas') as HTMLCanvasElement;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
          if (!analyserRef.current) return;
          animationFrameRef.current = requestAnimationFrame(draw);
          analyserRef.current.getByteFrequencyData(dataArray);

          if (ctx) {
            ctx.fillStyle = '#0f172a'; // slate-900 matching page style
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 1.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
              barHeight = dataArray[i] / 2;

              // Amber-500 gradient style for C-Suite branding
              ctx.fillStyle = `rgb(${245}, ${158}, ${11 + barHeight})`;
              ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

              x += barWidth + 1;
            }
          }
        };
        draw();
      }
    } catch (err) {
      console.warn('Microphone block or Web Audio unsupported:', err);
    }

    // 2. Speech Recognition Initialization
    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    let spokenText = '';

    if (SpeechRecognitionClass) {
      const recognition = new SpeechRecognitionClass();
      recognition.lang = 'es-ES'; // Spanish matching Spanish teleprompter
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        spokenText = event.results[0][0].transcript;
        setUserTranscript(spokenText);
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech Recognition error event:', e);
      };

      recognition.onend = () => {
        stopRecordingAndAnalyze(spokenText);
      };

      recognitionRef.current = recognition;
      recognition.start();
      
      // Auto-stop after 15 seconds if user stays silent
      setTimeout(() => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      }, 15000);
    } else {
      // Browser doesn't support speech recognition (Safari/Firefox fallbacks)
      setTimeout(() => {
        stopRecordingAndAnalyze('');
      }, 4500);
    }
  };

  const stopRecordingManually = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    } else {
      stopRecordingAndAnalyze('');
    }
  };

  const stopRecordingAndAnalyze = (spokenText: string) => {
    // Clear timer
    if (recordIntervalRef.current) {
      clearInterval(recordIntervalRef.current);
      recordIntervalRef.current = null;
    }

    // Stop mic stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setMicActive(false);

    let finalSpoken = spokenText.trim();
    let localFallback = false;

    if (!finalSpoken) {
      finalSpoken = '';
      localFallback = true;
      setIsFallback(true);
    }

    // Match calculations
    const cleanStr = (s: string) => s.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()""“]/g, '').trim();
    const targetClean = cleanStr(currentScenario.teleprompter);
    const spokenClean = cleanStr(finalSpoken);

    const targetWords = targetClean.split(/\s+/).filter(Boolean);
    const spokenWords = spokenClean.split(/\s+/).filter(Boolean);

    // Calculate match percentage
    const matchedWords = targetWords.filter(word => spokenWords.includes(word));
    const accuracyVal = targetWords.length > 0 
      ? Math.round((matchedWords.length / targetWords.length) * 100)
      : 0;

    // Fluency WPM (Target: ~130 WPM)
    const wordsCount = spokenWords.length;
    const duration = recordDuration || (isWrittenMode ? 6 : 4.5);
    const wpm = Math.round(wordsCount / (duration / 60)) || 0;
    
    let fluencyScore = 100;
    if (wordsCount === 0) {
      fluencyScore = 0;
    } else if (wpm < 110) {
      fluencyScore = Math.max(30, 100 - (110 - wpm) * 1.5);
    } else if (wpm > 150) {
      fluencyScore = Math.max(30, 100 - (wpm - 150) * 1.5);
    }
    fluencyScore = Math.round(fluencyScore);

    // Filler words detection
    const fillerWordsList = ['eh', 'este', 'bueno', 'mmm', 'como', 'ah', 'uh', 'pues', 'osea'];
    const detectedFillers = spokenWords.filter(w => fillerWordsList.includes(w));
    const fillerCount = detectedFillers.length;
    const fillerText = fillerCount === 0
      ? '0 filler words (Perfect control)'
      : `${fillerCount} muletilla(s) detectada(s) (${Array.from(new Set(detectedFillers)).join(', ')})`;

    // Diplomacy index
    let diplomacyVal = 'Highly Precise (Institutional)';
    if (accuracyVal < 40) {
      diplomacyVal = 'Needs Refinement (Unclear flow)';
    } else if (accuracyVal < 75) {
      diplomacyVal = 'Hesitant (Requires modulation)';
    } else if (accuracyVal < 90) {
      diplomacyVal = 'Professional (Standard C-Suite)';
    }

    // Jargon check
    const matchedJargon = currentScenario.jargonKeywords.filter(k => spokenClean.includes(k));
    const jargonText = matchedJargon.length > 0
      ? matchedJargon.map(j => j.charAt(0).toUpperCase() + j.slice(1)).join(', ')
      : 'No corporate jargon detected';

    // Final percentile
    const finalScore = Math.round((accuracyVal + fluencyScore) / 2);
    const percentileVal = finalScore >= 95 ? '99th percentile'
      : finalScore >= 90 ? '95th percentile'
      : finalScore >= 80 ? '85th percentile'
      : finalScore >= 70 ? '70th percentile'
      : finalScore >= 50 ? '50th percentile'
      : 'Below average';

    setComputedMetrics({
      accuracy: `${accuracyVal}%`,
      fluency: `${fluencyScore}%`,
      fillerWords: fillerText,
      diplomacy: diplomacyVal,
      jargon: jargonText,
      percentile: percentileVal
    });

    setUserTranscript(finalSpoken || '(Sin entrada detectada)');
    setSimulationStep(2);
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
            <Link href="/programa-ejecutivo" className="text-amber-400 border-b-2 border-amber-400 pb-1">Programa Ejecutivo</Link>
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
      <header className="pt-36 pb-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-amber-500/10 to-transparent blur-[140px] opacity-60 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900 border border-slate-800 text-amber-400 text-xs font-bold uppercase tracking-widest shadow-lg">
            <Crown size={12} className="text-amber-500 animate-pulse" />
            C-Suite Boardroom Training
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Domina el Lenguaje de los<br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 bg-clip-text text-transparent">Negocios Globales.</span>
          </h1>
          <p className="text-lg text-slate-450 max-w-3xl mx-auto leading-relaxed font-light">
            El simulador definitivo para directivos y líderes corporativos. Entrena oratoria, pitch con inversionistas y diplomacia ejecutiva en entornos reales.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <a href="#simulator">
              <button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3.5 px-8 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/15">
                Probar Simulador <ArrowRight size={18} />
              </button>
            </a>
            <Link href="/planes">
              <button className="bg-slate-900 border border-slate-855 hover:border-amber-500/30 text-slate-300 font-semibold py-3.5 px-8 transition-all">
                Planes Corporativos
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* QUICK STATS */}
      <section className="py-10 px-6 border-t border-slate-900 bg-slate-900/40">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { val: '60', label: 'Unidades Executive', color: 'text-amber-400' },
            { val: '1,400+', label: 'Escenarios Reales', color: 'text-white' },
            { val: '98.4%', label: 'Precisión Fonométrica', color: 'text-emerald-400' },
            { val: 'OnixCorp', label: 'Estándar Oficial', color: 'text-amber-400' }
          ].map((s, i) => (
            <div key={i} className="p-5 border border-slate-855 bg-slate-950/80 shadow-xl">
              <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
              <p className="text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BOARDROOM SIMULATOR */}
      <section id="simulator" className="py-20 px-6 relative">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-black text-amber-555 uppercase tracking-widest">Simulator Console</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Simulador de Oratoria Directiva C-Suite</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">Selecciona tu rol estratégico y lee la frase ante la consola fonométrica.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Roles selector */}
            <div className="lg:col-span-4 space-y-4">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">1. Perfil C-Suite</h4>
              <div className="space-y-3">
                {roles.map((r) => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.id}
                      onClick={() => handleRoleChange(r.id)}
                      className={`w-full p-4 border text-left transition-all flex gap-3.5 ${selectedRole === r.id ? 'border-amber-500 bg-amber-500/10' : 'border-slate-855 bg-slate-900/20 hover:border-slate-700'}`}
                    >
                      <div className={`p-2 shrink-0 ${selectedRole === r.id ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-white">{r.name}</p>
                        <p className="text-[10px] text-slate-450 leading-relaxed mt-0.5">{r.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-900 space-y-2">
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">2. Caso de Negociación</h4>
                <div className="space-y-1.5">
                  {activeScenarios.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedScenarioId(s.id);
                        setIsSimulating(false);
                        setSimulationStep(0);
                      }}
                      className={`w-full p-3 text-left text-xs font-bold border transition-colors flex justify-between items-center ${selectedScenarioId === s.id ? 'border-amber-500 text-amber-400 bg-amber-500/5' : 'border-slate-900 text-slate-500 hover:border-slate-800'}`}
                    >
                      <span>{s.title}</span>
                      <ChevronRight size={12} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Simulator Screen */}
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 shadow-2xl flex flex-col min-h-[440px]">
              
              <div className="p-4 bg-amber-500/10 border-b border-slate-850 text-amber-300 flex items-start gap-2.5 text-xs">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-amber-500" />
                <div>
                  <p className="font-extrabold uppercase text-[8px] tracking-wider text-amber-400 mb-0.5">Simulador Activo por Voz</p>
                  <p className="font-light">Usa tu micrófono real para probar esta demo. Si el navegador no tiene permisos o soporte, se aplicará una inferencia de simulación de respaldo.</p>
                </div>
              </div>

              <div className="p-3 bg-slate-950 border-b border-slate-850 flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">
                <span className="flex items-center gap-1.5"><Activity size={12} className="text-amber-500 animate-pulse" /> Audio Engine v4</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active</span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                
                {!isSimulating && (
                  <div className="my-auto text-center space-y-5 py-4">
                    <div className="space-y-2">
                      <h4 className="text-lg font-bold text-white">{currentScenario.title}</h4>
                      <p className="text-slate-400 text-xs leading-relaxed max-w-md mx-auto">{currentScenario.situation}</p>
                    </div>

                    <div className="p-3.5 bg-slate-950 border border-slate-850 text-left max-w-md mx-auto space-y-1">
                      <p className="text-[9px] text-amber-450 font-black uppercase tracking-wider">Objetivo de la simulación:</p>
                      <p className="text-xs text-slate-300 text-center">"{currentScenario.prompt}"</p>
                    </div>

                    <button
                      onClick={startSimulation}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 px-8 text-xs uppercase tracking-widest transition-all shadow-md active:scale-95"
                    >
                      Iniciar Caso de Simulación
                    </button>
                  </div>
                )}

                {isSimulating && simulationStep === 0 && (
                  <div className="space-y-5">
                    <div className="space-y-1">
                      <span className="text-[8px] text-amber-400 font-black uppercase tracking-widest">Caso Activo</span>
                      <h4 className="text-base font-bold text-white">{currentScenario.title}</h4>
                    </div>

                    <div className="p-4 bg-slate-950 border border-slate-800 space-y-2">
                      <span className="text-[8px] text-slate-500 font-black uppercase tracking-wider block border-b border-slate-800 pb-1">Frase a Leer en Voz Alta:</span>
                      <p className="text-sm italic text-slate-200 leading-relaxed font-semibold">"{currentScenario.teleprompter}"</p>
                    </div>

                    {/* Mode Selector Tabs */}
                    <div className="flex gap-2 p-1 bg-slate-950 border border-slate-850 max-w-xs mx-auto">
                      <button
                        type="button"
                        disabled={!speechSupported}
                        onClick={() => setIsWrittenMode(false)}
                        className={`flex-1 py-1 px-2 text-center text-[10px] font-bold uppercase transition-all ${!isWrittenMode ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-500 hover:text-slate-300 disabled:opacity-40'}`}
                      >
                        Micrófono
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsWrittenMode(true)}
                        className={`flex-1 py-1 px-2 text-center text-[10px] font-bold uppercase transition-all ${isWrittenMode ? 'bg-amber-500 text-slate-950 font-black' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        Texto Escrito
                      </button>
                    </div>

                    {!isWrittenMode ? (
                      <div className="flex flex-col items-center pt-4 border-t border-slate-850 space-y-3">
                        <p className="text-[10px] text-slate-400 font-medium text-center">
                          Haz clic en el botón de abajo, otorga permisos y lee la frase en voz alta:
                        </p>
                        <button
                          type="button"
                          onClick={startVoiceRecording}
                          className="w-14 h-14 bg-red-500 hover:bg-red-650 text-white rounded-full flex items-center justify-center transition-all border-4 border-slate-850 hover:scale-105 active:scale-95"
                          title="Comenzar Grabación de Voz"
                        >
                          <Mic size={20} />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4 pt-4 border-t border-slate-850">
                        <p className="text-[10px] text-slate-400 font-medium">
                          {!speechSupported && (
                            <span className="text-amber-500 font-bold block mb-1">
                              ⚠️ El reconocimiento de voz no es compatible con tu navegador. Por favor ingresa el texto:
                            </span>
                          )}
                          Escribe o pega el texto de tu discurso para analizarlo con el motor analítico:
                        </p>
                        <textarea
                          rows={3}
                          value={writtenText}
                          onChange={(e) => setWrittenText(e.target.value)}
                          placeholder="Escribe tu frase aquí..."
                          className="w-full p-3 bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:border-amber-500 outline-none font-mono"
                        />
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => stopRecordingAndAnalyze(writtenText)}
                            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 px-6 text-xs uppercase tracking-wider shadow-md"
                          >
                            Analizar Texto Escrito
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {isSimulating && simulationStep === 1 && (
                  <div className="my-auto text-center space-y-6 py-6">
                    <div className="relative">
                      {/* Audio visualizer canvas element for real-time waveform */}
                      <canvas id="audio-canvas" width="300" height="60" className="mx-auto bg-slate-950 border border-slate-850" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-white animate-pulse">Grabando tu voz... ({recordDuration}s)</h4>
                      <p className="text-slate-400 text-[10px]">Habla ahora. El motor Web Audio está capturando las frecuencias.</p>
                    </div>
                    <div className="text-[10px] text-red-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 font-mono">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      MICROFONO ACTIVO - LEE EL TELEPROMPTER
                    </div>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={stopRecordingManually}
                        className="bg-red-650 hover:bg-red-750 text-white font-bold py-2 px-6 text-xs uppercase tracking-wider transition-colors shadow-md"
                      >
                        Detener y Analizar
                      </button>
                    </div>
                  </div>
                )}

                {isSimulating && simulationStep === 2 && (
                  <div className="space-y-5">
                    <div className="flex justify-between items-center border-b border-slate-855 pb-3">
                      <div>
                        <span className="text-[8px] text-emerald-400 font-black uppercase tracking-widest">Análisis Completado</span>
                        <h4 className="text-base font-bold text-white">{currentScenario.title}</h4>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-amber-400 font-mono">{computedMetrics.percentile}</p>
                        <p className="text-[8px] text-slate-500 font-bold uppercase mt-0.5">Percentil Global</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 font-mono">
                      {[
                        { label: 'Fluency Accuracy (Ritmo WPM)', val: computedMetrics.fluency, color: 'text-emerald-400' },
                        { label: 'Pronunciation Core', val: computedMetrics.accuracy, color: 'text-white' },
                        { label: 'Diplomacy Index', val: computedMetrics.diplomacy, color: 'text-amber-400' },
                        { label: 'Filler Word Control', val: computedMetrics.fillerWords, color: 'text-white' }
                      ].map((m, i) => (
                        <div key={i} className="p-2.5 bg-slate-950 border border-slate-850">
                          <p className="text-[8px] text-slate-500 font-bold uppercase">{m.label}</p>
                          <p className={`text-sm font-bold mt-1 ${m.color}`}>{m.val}</p>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-slate-950 border border-slate-855 text-[11px] space-y-1.5 text-left">
                      <div>
                        <p className="text-[8px] text-slate-500 font-bold uppercase">Tu Transcripción Detectada:</p>
                        <p className="text-xs text-slate-200 italic">"{userTranscript}"</p>
                        {isFallback && (
                          <p className="text-[9px] text-amber-500 font-bold mt-0.5">(Nota: Entrada de respaldo debido a falta de audio/permisos)</p>
                        )}
                      </div>
                      <div>
                        <p className="text-[8px] text-slate-500 font-bold uppercase">Jargon Corporativo Detectado:</p>
                        <p className="font-mono text-amber-400 font-bold text-xs">{computedMetrics.jargon}</p>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-3 border-t border-slate-850">
                      <button
                        onClick={() => { setSimulationStep(0); setIsSimulating(false); }}
                        className="border border-slate-700 hover:border-slate-500 text-white font-bold py-2 px-5 text-[10px] uppercase transition-colors"
                      >
                        Salir
                      </button>
                      <button
                        onClick={startSimulation}
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 px-5 text-[10px] uppercase transition-all shadow-md"
                      >
                        Reintentar
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CURRICULUM SYLLABUS */}
      <section className="py-20 px-6 bg-slate-900 border-t border-slate-855">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-black text-amber-400 uppercase tracking-widest">Temario del Programa</span>
            <h2 className="text-3xl font-bold text-white">60 Unidades de Especialización Directiva</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">Cada módulo incluye simulaciones adaptativas específicas y análisis de vocabulario C-Suite.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {executiveUnits.map((u) => (
              <div key={u.id} className="p-5 border border-slate-800 bg-slate-950/60 hover:border-amber-500/30 transition-all group flex gap-4">
                <div className="text-xl font-black text-amber-500/20 group-hover:text-amber-500/40 transition-colors shrink-0">{u.id}</div>
                <div>
                  <h4 className="text-sm font-bold text-white">{u.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-normal mt-1">{u.topic}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACCREDITATION */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] pointer-events-none rounded-none" />
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-black text-amber-500 uppercase tracking-widest">Acreditación Oficial</span>
              <h2 className="text-3xl font-bold text-white leading-tight">
                Certificación Directiva:<br />
                <span className="bg-gradient-to-r from-amber-400 to-amber-250 bg-clip-text text-transparent">Executive Speech Standard</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed font-light">
                Al completar la currícula de 60 unidades, obtendrás la credencial digital respaldada por OnixCorp, verificable por departamentos de RH en la blockchain corporativa.
              </p>

              <ul className="space-y-3 text-xs text-slate-355 font-medium">
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-amber-500 shrink-0" />
                  <span>Alineado con el estándar C2 del MCER.</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-amber-500 shrink-0" />
                  <span>Integración de un solo clic con LinkedIn.</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-amber-500 shrink-0" />
                  <span>Acreditación verificable y auditable por terceros.</span>
                </li>
              </ul>
            </div>

            {/* Certificate */}
            <div className="lg:col-span-7">
              <div className="p-6 md:p-8 bg-slate-900 border border-amber-500/20 rounded-none shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 blur-xl pointer-events-none rounded-none" />
                
                <div className="border border-amber-500/10 p-6 md:p-8 space-y-5 text-center bg-slate-950/80">
                  <div className="flex justify-center mb-1">
                    <div className="w-10 h-10 bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20">
                      <Crown size={20} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[9px] text-amber-500 font-bold uppercase tracking-wider">Acreditación Oficial</p>
                    <h3 className="font-serif text-xl md:text-2xl text-white tracking-wide">Executive Speech Standard</h3>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[9px] text-slate-500 font-bold uppercase">Otorgado a:</p>
                    <p className="text-base font-bold text-white tracking-wide border-b border-slate-800 pb-1.5 max-w-xs mx-auto">Alejandro Pérez C.</p>
                    <p className="text-[10px] text-slate-400 italic font-light max-w-sm mx-auto">
                      "Por acreditar con excelencia las 60 unidades del simulador interactivo de oratoria de alta dirección internacional."
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-[8px] text-slate-500 font-mono pt-3 border-t border-slate-900">
                    <div className="text-left">
                      <p>CERTIFICADO ID: ONIX-839-C2</p>
                      <p className="text-amber-500/50 font-semibold">VERIFICACIÓN: ACTIVA</p>
                    </div>
                    <div className="text-right">
                      <p>FECHA: MAYO 2026</p>
                      <p>Accreditation Board</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-slate-400">
                  <span className="font-semibold">Comparte tu acreditación:</span>
                  <div className="flex gap-2">
                    <button onClick={() => setCertShared(true)} className="flex items-center gap-1.5 bg-[#0077b5] text-white py-1.5 px-3 hover:opacity-90 transition-all font-semibold rounded-none">
                      LinkedIn
                    </button>
                    <button onClick={() => setCertShared(true)} className="flex items-center gap-1.5 bg-[#1da1f2] text-white py-1.5 px-3 hover:opacity-90 transition-all font-semibold rounded-none">
                      Twitter
                    </button>
                  </div>
                </div>

                {certShared && (
                  <div className="mt-3 p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 text-[10px] text-center font-medium">
                    ✓ Credencial vinculada a tu cuenta con éxito.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* B2B FOOTER CALL TO ACTION */}
      <section className="py-20 px-6 bg-slate-900 border-t border-slate-800 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto">
            <Building2 size={20} />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-white">¿Implementación Corporativa?</h2>
            <p className="text-slate-450 text-sm font-light leading-relaxed">
              Consigue licencias por volumen, control multi-tenant de analíticas, SSO y currícula personalizada de marca para tus equipos directivos.
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Link href="/planes">
              <button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 px-6 text-xs uppercase tracking-widest transition-colors shadow-md">
                Ver Planes B2B
              </button>
            </Link>
            <Link href="/ventas">
              <button className="bg-slate-950 border border-slate-800 text-slate-350 hover:text-white font-semibold py-3 px-6 text-xs uppercase tracking-widest transition-all">
                Contactar Ventas
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
            <Link href="/legal/support" className="hover:text-amber-400 transition-colors">Soporte</Link>
          </div>
          <div className="text-left md:text-right text-xs space-y-1">
            <p>© 2026 OnixuTechnology.</p>
            <p className="text-[10px] text-slate-655 font-light">Pagos procesados por Paddle, nuestro Merchant of Record.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
