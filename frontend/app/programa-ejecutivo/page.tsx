'use client';
import LandingFooter from '@/components/LandingFooter';
import LandingNavbar from '@/components/LandingNavbar';

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
    situation: 'Debes presentar los términos finales de una adquisición estratégica ante un panel de accionistas escépticos de OnixLingo.',
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
  { id: '01', title: 'Fundamentos de Oratoria Alta Dirección', topic: 'Postura, modulación del ritmo e inflexión tonal de autoridad.' },
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
    diplomacy: 'Excellent (Alta Dirección Standard)',
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
            ctx.fillStyle = '#0f172a'; // black matching page style
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 1.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
              barHeight = dataArray[i] / 2;

              // Amber-500 gradient style for Alta Dirección branding
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
      diplomacyVal = 'Professional (Standard Alta Dirección)';
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
    <div className="min-h-screen bg-white text-black font-sans selection:bg-[#D4AF37]/30 selection:text-black">
      
      {/* NAVBAR */}
      <LandingNavbar />

      {/* HERO (BLACK) */}
      <header className="pt-28 pb-12 px-6 relative overflow-hidden bg-slate-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#D4AF37]/10 blur-[140px] opacity-60 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase tracking-widest shadow-none">
            <Crown size={12} className="text-[#D4AF37] animate-pulse" />
            Alta Dirección Corporativo Training
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Domina el Lenguaje de los<br />
            <span className="text-[#D4AF37]">Negocios Globales.</span>
          </h1>
          <p className="text-lg text-slate-700 max-w-3xl mx-auto leading-relaxed font-light">
            El simulador definitivo para directivos y líderes corporativos. Entrena oratoria, pitch con inversionistas y diplomacia ejecutiva en entornos reales.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <a href="#simulator">
              <button className="bg-[#D4AF37] hover:bg-[#b5952f] text-black font-bold py-3.5 px-8 transition-all flex items-center gap-2 shadow-none shadow-[#D4AF37]/15">
                Probar Simulador <ArrowRight size={18} />
              </button>
            </a>
            <Link href="/planes">
                <button className="bg-transparent border border-[#D4AF37] hover:bg-[#D4AF37] text-slate-900 hover:text-black font-semibold py-3.5 px-8 transition-all">
                Planes Corporativos
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* QUICK STATS (WHITE) */}
      <section className="py-10 px-6 border-y border-black bg-white text-black">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { val: '60', label: 'Unidades Executive', color: 'text-black' },
            { val: '1,400+', label: 'Escenarios Reales', color: 'text-[#D4AF37]' },
            { val: '98.4%', label: 'Precisión Fonométrica', color: 'text-black' },
            { val: 'OnixLingo', label: 'Estándar Oficial', color: 'text-black' }
          ].map((s, i) => (
            <div key={i} className="p-5 border border-black bg-white shadow-xl">
              <p className={`text-2xl font-black ${s.color}`}>{s.val}</p>
              <p className="text-[9px] text-gray-600 font-bold uppercase mt-1 tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BOARDROOM SIMULATOR (GOLD 20%) */}
      <section id="simulator" className="py-20 px-6 relative bg-[#D4AF37]/20 text-black">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-black text-black/70 uppercase tracking-widest">Simulator Console</span>
            <h2 className="text-3xl md:text-4xl font-bold text-black">Simulador de Oratoria Directiva Alta Dirección</h2>
            <p className="text-black text-sm max-w-xl mx-auto font-medium">Selecciona tu rol estratégico y lee la frase ante la consola fonométrica.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Roles selector */}
            <div className="lg:col-span-4 space-y-4">
              <h4 className="text-[10px] font-bold text-black uppercase tracking-wider">1. Perfil Alta Dirección</h4>
              <div className="space-y-3">
                {roles.map((r) => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.id}
                      onClick={() => handleRoleChange(r.id)}
                      className={`w-full p-4 border text-left transition-all flex gap-3.5 ${selectedRole === r.id ? 'border-black bg-white' : 'border-black/20 bg-white hover:border-black/50'}`}
                    >
                      <div className={`p-2 shrink-0 ${selectedRole === r.id ? 'bg-[#D4AF37] text-black' : 'bg-white text-slate-500'}`}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <p className={`font-bold text-xs ${selectedRole === r.id ? 'text-slate-900' : 'text-black'}`}>{r.name}</p>
                        <p className={`text-[10px] leading-relaxed mt-0.5 ${selectedRole === r.id ? 'text-slate-700' : 'text-gray-600'}`}>{r.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-black space-y-2">
                <h4 className="text-[10px] font-bold text-black uppercase tracking-wider">2. Caso de Negociación</h4>
                <div className="space-y-1.5">
                  {activeScenarios.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelectedScenarioId(s.id);
                        setIsSimulating(false);
                        setSimulationStep(0);
                      }}
                      className={`w-full p-3 text-left text-xs font-bold border transition-colors flex justify-between items-center ${selectedScenarioId === s.id ? 'border-black text-slate-900 bg-white' : 'border-black/20 bg-white text-black hover:border-black/50'}`}
                    >
                      <span>{s.title}</span>
                      <ChevronRight size={12} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Simulator Screen */}
            <div className="lg:col-span-8 bg-white border border-slate-200 shadow-2xl flex flex-col min-h-[440px]">
              
              <div className="p-4 bg-[#D4AF37]/20/10 border-b border-slate-800 text-amber-300 flex items-start gap-2.5 text-xs">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-[#D4AF37]" />
                <div>
                  <p className="font-extrabold uppercase text-[8px] tracking-wider text-amber-400 mb-0.5">Simulador Activo por Voz</p>
                  <p className="font-light">Usa tu micrófono real para probar esta demo. Si el navegador no tiene permisos o soporte, se aplicará una inferencia de simulación de respaldo.</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border-b border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider font-mono">
                <span className="flex items-center gap-1.5"><Activity size={12} className="text-[#D4AF37] animate-pulse" /> Audio Engine v4</span>
                <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-none bg-white0" /> Active</span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                
                {!isSimulating && (
                  <div className="my-auto text-center space-y-5 py-4">
                    <div className="space-y-2">
                      <h4 className="text-lg font-bold text-slate-900">{currentScenario.title}</h4>
                      <p className="text-slate-500 text-xs leading-relaxed max-w-md mx-auto">{currentScenario.situation}</p>
                    </div>

                    <div className="p-3.5 bg-slate-50 border border-slate-800 text-left max-w-md mx-auto space-y-1">
                      <p className="text-[9px] text-amber-400 font-black uppercase tracking-wider">Objetivo de la simulación:</p>
                      <p className="text-xs text-slate-300 text-center">"{currentScenario.prompt}"</p>
                    </div>

                    <button
                      onClick={startSimulation}
                      className="bg-[#D4AF37]/20 hover:bg-[#D4AF37]/20 text-[#050510] font-bold py-3 px-8 text-xs uppercase tracking-widest transition-all shadow-none active:scale-95"
                    >
                      Iniciar Caso de Simulación
                    </button>
                  </div>
                )}

                {isSimulating && simulationStep === 0 && (
                  <div className="space-y-5">
                    <div className="space-y-1">
                      <span className="text-[8px] text-amber-400 font-black uppercase tracking-widest">Caso Activo</span>
                      <h4 className="text-base font-bold text-slate-900">{currentScenario.title}</h4>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 space-y-2">
                      <span className="text-[8px] text-slate-500 font-black uppercase tracking-wider block border-b border-slate-200 pb-1">Frase a Leer en Voz Alta:</span>
                      <p className="text-sm italic text-slate-200 leading-relaxed font-semibold">"{currentScenario.teleprompter}"</p>
                    </div>

                    {/* Mode Selector Tabs */}
                    <div className="flex gap-2 p-1 bg-slate-50 border border-slate-800 max-w-xs mx-auto">
                      <button
                        type="button"
                        disabled={!speechSupported}
                        onClick={() => setIsWrittenMode(false)}
                        className={`flex-1 py-1 px-2 text-center text-[10px] font-bold uppercase transition-all ${!isWrittenMode ? 'bg-[#D4AF37]/20 text-[#050510] font-black' : 'text-slate-500 hover:text-slate-300 disabled:opacity-40'}`}
                      >
                        Micrófono
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsWrittenMode(true)}
                        className={`flex-1 py-1 px-2 text-center text-[10px] font-bold uppercase transition-all ${isWrittenMode ? 'bg-[#D4AF37]/20 text-[#050510] font-black' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        Texto Escrito
                      </button>
                    </div>

                    {!isWrittenMode ? (
                      <div className="flex flex-col items-center pt-4 border-t border-slate-800 space-y-3">
                        <p className="text-[10px] text-slate-500 font-medium text-center">
                          Haz clic en el botón de abajo, otorga permisos y lee la frase en voz alta:
                        </p>
                        <button
                          type="button"
                          onClick={startVoiceRecording}
                          className="w-14 h-14 bg-[#D4AF37]/100 hover:bg-red-650 text-slate-900 rounded-none flex items-center justify-center transition-all border-4 border-slate-800 hover:scale-105 active:scale-95"
                          title="Comenzar Grabación de Voz"
                        >
                          <Mic size={20} />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4 pt-4 border-t border-slate-800">
                        <p className="text-[10px] text-slate-500 font-medium">
                          {!speechSupported && (
                            <span className="text-[#D4AF37] font-bold block mb-1">
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
                          className="w-full p-3 bg-slate-50 border border-slate-200 text-slate-200 text-xs focus:border-[#D4AF37]/30 outline-none font-mono"
                        />
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => stopRecordingAndAnalyze(writtenText)}
                            className="bg-[#D4AF37]/20 hover:bg-[#D4AF37]/20 text-[#050510] font-bold py-2.5 px-6 text-xs uppercase tracking-wider shadow-none"
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
                      <canvas id="audio-canvas" width="300" height="60" className="mx-auto bg-slate-50 border border-slate-800" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-slate-900 animate-pulse">Grabando tu voz... ({recordDuration}s)</h4>
                      <p className="text-slate-500 text-[10px]">Habla ahora. El motor Web Audio está capturando las frecuencias.</p>
                    </div>
                    <div className="text-[10px] text-red-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 font-mono">
                      <span className="w-2 h-2 rounded-none bg-[#D4AF37]/100 animate-ping" />
                      MICROFONO ACTIVO - LEE EL TELEPROMPTER
                    </div>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={stopRecordingManually}
                        className="bg-red-650 hover:bg-red-750 text-slate-900 font-bold py-2 px-6 text-xs uppercase tracking-wider transition-colors shadow-none"
                      >
                        Detener y Analizar
                      </button>
                    </div>
                  </div>
                )}

                {isSimulating && simulationStep === 2 && (
                  <div className="space-y-5">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-[8px] text-emerald-400 font-black uppercase tracking-widest">Análisis Completado</span>
                        <h4 className="text-base font-bold text-slate-900">{currentScenario.title}</h4>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-amber-400 font-mono">{computedMetrics.percentile}</p>
                        <p className="text-[8px] text-slate-500 font-bold uppercase mt-0.5">Percentil Global</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 font-mono">
                      {[
                        { label: 'Fluency Accuracy (Ritmo WPM)', val: computedMetrics.fluency, color: 'text-emerald-400' },
                        { label: 'Pronunciation Core', val: computedMetrics.accuracy, color: 'text-slate-900' },
                        { label: 'Diplomacy Index', val: computedMetrics.diplomacy, color: 'text-amber-400' },
                        { label: 'Filler Word Control', val: computedMetrics.fillerWords, color: 'text-slate-900' }
                      ].map((m, i) => (
                        <div key={i} className="p-2.5 bg-slate-50 border border-slate-800">
                          <p className="text-[8px] text-slate-500 font-bold uppercase">{m.label}</p>
                          <p className={`text-sm font-bold mt-1 ${m.color}`}>{m.val}</p>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-800 text-[11px] space-y-1.5 text-left">
                      <div>
                        <p className="text-[8px] text-slate-500 font-bold uppercase">Tu Transcripción Detectada:</p>
                        <p className="text-xs text-slate-200 italic">"{userTranscript}"</p>
                        {isFallback && (
                          <p className="text-[9px] text-[#D4AF37] font-bold mt-0.5">(Nota: Entrada de respaldo debido a falta de audio/permisos)</p>
                        )}
                      </div>
                      <div>
                        <p className="text-[8px] text-slate-500 font-bold uppercase">Jargon Corporativo Detectado:</p>
                        <p className="font-mono text-amber-400 font-bold text-xs">{computedMetrics.jargon}</p>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-3 border-t border-slate-800">
                      <button
                        onClick={() => { setSimulationStep(0); setIsSimulating(false); }}
                        className="border border-slate-700 hover:border-gray-500 text-slate-900 font-bold py-2 px-5 text-[10px] uppercase transition-colors"
                      >
                        Salir
                      </button>
                      <button
                        onClick={startSimulation}
                        className="bg-[#D4AF37]/20 hover:bg-[#D4AF37]/20 text-[#050510] font-bold py-2 px-5 text-[10px] uppercase transition-all shadow-none"
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

      {/* CURRICULUM SYLLABUS (BLACK) */}
      <section className="py-20 px-6 bg-slate-50 border-y border-black text-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-black text-[#D4AF37] uppercase tracking-widest">Temario del Programa</span>
            <h2 className="text-3xl font-bold text-slate-900">60 Unidades de Especialización Directiva</h2>
            <p className="text-slate-600 text-sm max-w-xl mx-auto">Cada módulo incluye simulaciones adaptativas específicas y análisis de vocabulario Alta Dirección.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {executiveUnits.map((u) => (
              <div key={u.id} className="p-5 border border-slate-200 bg-slate-50 hover:border-[#D4AF37] transition-all group flex gap-4">
                <div className="text-xl font-black text-[#D4AF37]/50 group-hover:text-[#D4AF37] transition-colors shrink-0">{u.id}</div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{u.title}</h4>
                  <p className="text-[11px] text-slate-600 leading-normal mt-1">{u.topic}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACCREDITATION (WHITE) */}
      <section className="py-20 px-6 relative overflow-hidden bg-white text-black">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37]/10 blur-[120px] pointer-events-none rounded-none" />
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-black text-black uppercase tracking-widest bg-[#D4AF37] px-2 py-1">Acreditación Oficial</span>
              <h2 className="text-3xl font-bold text-black leading-tight">
                Certificación Directiva:<br />
                <span className="text-[#D4AF37]">Executive Speech Standard</span>
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed font-light">
                Al completar la currícula de 60 unidades, obtendrás reportes analíticos detallados respaldados por OnixLingo, ideales para demostrar tu evolución ante departamentos de RH.
              </p>

              <ul className="space-y-3 text-xs text-gray-700 font-medium">
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-[#D4AF37] shrink-0" />
                  <span>Alineado con el estándar C2 del MCER.</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-[#D4AF37] shrink-0" />
                  <span>Integración de un solo clic con LinkedIn.</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-[#D4AF37] shrink-0" />
                  <span>Acreditación verificable y auditable por terceros.</span>
                </li>
              </ul>
            </div>

            {/* Certificate */}
            <div className="lg:col-span-7">
              <div className="p-6 md:p-8 bg-white border border-black rounded-none shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/10 blur-xl pointer-events-none rounded-none" />
                
                <div className="border-4 border-double border-slate-900 p-8 md:p-12 space-y-8 text-center bg-white relative">
                  {/* Watermark-like background */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                    <Crown size={200} className="text-black" />
                  </div>

                  <div className="flex justify-center relative z-10">
                    <div className="w-14 h-14 bg-white text-[#D4AF37] flex items-center justify-center border-2 border-slate-900 shadow-sm">
                      <Crown size={28} />
                    </div>
                  </div>

                  <div className="space-y-2 relative z-10">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">Acreditación Oficial</p>
                    <h3 className="font-serif text-3xl md:text-4xl text-slate-900 tracking-wide font-medium">Executive Speech Standard</h3>
                  </div>

                  <div className="space-y-4 relative z-10 py-4">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Otorgado a:</p>
                    <p className="font-serif text-3xl font-bold text-slate-900 tracking-widest border-b border-slate-300 pb-2 max-w-sm mx-auto">
                      A. P. C.
                    </p>
                    <p className="text-xs text-slate-600 italic font-serif leading-relaxed max-w-md mx-auto">
                      "Por acreditar con excelencia las 60 unidades del simulador interactivo de oratoria de alta dirección internacional."
                    </p>
                  </div>

                  <div className="flex justify-between items-end text-[9px] text-slate-600 font-mono pt-6 border-t border-slate-200 relative z-10">
                    <div className="text-left space-y-1">
                      <p className="tracking-widest">ID: ONIX-839-C2</p>
                      <p className="text-slate-900 font-bold bg-[#D4AF37]/20 px-2 py-0.5 inline-block border border-[#D4AF37]">VERIFICACIÓN ACTIVA</p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="border-b border-slate-400 pb-1 mb-1 px-4">
                         <span className="font-script text-lg text-slate-800">O.L. Board</span>
                      </div>
                      <p className="tracking-widest">DIRECCIÓN ACADÉMICA</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-gray-600">
                  <span className="font-semibold">Comparte tu acreditación:</span>
                  <div className="flex gap-2">
                    <button onClick={() => setCertShared(true)} className="flex items-center gap-1.5 bg-white text-[#D4AF37] py-1.5 px-3 hover:opacity-90 transition-all font-semibold rounded-none">
                      LinkedIn
                    </button>
                    <button onClick={() => setCertShared(true)} className="flex items-center gap-1.5 bg-white text-[#D4AF37] py-1.5 px-3 hover:opacity-90 transition-all font-semibold rounded-none">
                      Twitter
                    </button>
                  </div>
                </div>

                {certShared && (
                  <div className="mt-3 p-2 bg-green-50 border border-green-200 text-green-700 text-[10px] text-center font-bold">
                    ✓ Credencial vinculada a tu cuenta con éxito.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* B2B FOOTER CALL TO ACTION (GOLD 20%) */}
      <section className="py-20 px-6 bg-[#D4AF37]/20 border-t border-black text-center relative overflow-hidden text-black">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10" />
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="w-10 h-10 bg-white text-[#D4AF37] flex items-center justify-center mx-auto border border-black">
            <Building2 size={20} />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-black">¿Implementación Corporativa?</h2>
            <p className="text-gray-700 text-sm font-medium leading-relaxed">
              Consigue licencias por volumen, control multi-tenant de analíticas, SSO y currícula personalizada de marca para tus equipos directivos.
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Link href="/planes">
              <button className="bg-white hover:bg-slate-50 text-[#D4AF37] font-bold py-3 px-6 text-xs uppercase tracking-widest transition-colors shadow-none border border-[#D4AF37]">
                Ver Planes B2B
              </button>
            </Link>
            <Link href="/ventas">
              <button className="bg-transparent border border-black text-black hover:bg-white hover:text-slate-900 font-semibold py-3 px-6 text-xs uppercase tracking-widest transition-all">
                Contactar Ventas
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <LandingFooter />

    </div>
  );
}
