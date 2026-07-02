'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle, Activity, Mic } from 'lucide-react';

interface Scenario {
  id: string;
  role: string;
  title: string;
  situation: string;
  prompt: string;
  teleprompter: string;
  jargonKeywords: string[];
}

interface BoardroomSimulatorProps {
  currentScenario: Scenario;
}

export default function BoardroomSimulator({ currentScenario }: BoardroomSimulatorProps) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0); // 0: intro, 1: recording, 2: results
  const [micActive, setMicActive] = useState(false);

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
  );
}
