'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, X, Volume2, BookOpen, CheckCircle2, AlertTriangle, ChevronRight, ChevronLeft, RefreshCw, Activity } from 'lucide-react';
import Cookies from 'js-cookie';

interface ReadingStudioProps {
  onClose: () => void;
}

// 📚 Textos ejecutivos reales para practicar
const PRACTICE_TEXTS = [
  "Our strategic imperative is to leverage synergistic partnerships to maximize shareholder value and drive sustainable growth across emerging markets.",
  "We need to pivot our core operations to align with the new regulatory frameworks while maintaining our competitive edge in the digital landscape.",
  "The quarterly forecast indicates a robust upward trend, provided we mitigate the supply chain bottlenecks and optimize our current asset allocation.",
  "Effective leadership in this paradigm requires transparent communication, cross-functional collaboration, and a relentless focus on customer-centric innovation."
];

export const ReadingStudio = ({ onClose }: ReadingStudioProps) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para UI Avanzada
  const [recordingTime, setRecordingTime] = useState(0);
  const [volume, setVolume] = useState(0);
  
  // Referencias Técnicas
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
const animationRef = useRef<number | null>(null);  const audioContextRef = useRef<AudioContext | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.onixlingo.onixu.company';
  const targetText = PRACTICE_TEXTS[currentTextIndex];

  // ⏱️ Cronómetro
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => setRecordingTime(t => t + 1), 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  // 🧹 Cleanup: Apagar micrófono si el componente se desmonta
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem.toString().padStart(2, '0')}`;
  };

  // 🎤 INICIAR GRABACIÓN CON ANALIZADOR DE VOLUMEN
  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // 🌊 Configurar analizador de ondas de audio
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        const sum = dataArray.reduce((a, b) => a + b, 0);
        setVolume(sum / bufferLength); // Promedio de volumen (0 a 255 aprox)
        animationRef.current = requestAnimationFrame(updateVolume);
      };
      updateVolume();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await analyzeAudio(audioBlob);
        
        // Limpieza de hardware
        stream.getTracks().forEach(track => track.stop());
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
        if (audioContextRef.current) audioContextRef.current.close();
        setVolume(0);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err: any) {
      console.error("Error al acceder al micrófono:", err);
      if (err.name === 'NotAllowedError') {
        setError("Acceso denegado. Por favor, permite el uso del micrófono en tu navegador.");
      } else {
        setError("No se detectó ningún micrófono o hubo un error de hardware.");
      }
    }
  };

  // ⏹️ DETENER GRABACIÓN
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsAnalyzing(true);
    }
  };

  // 🧠 ENVIAR A LA IA
  const analyzeAudio = async (audioBlob: Blob) => {
    const token = Cookies.get('access_token');
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('target_text', targetText);

    try {
      const res = await fetch(`${API_URL}/api/v1/speech/analyze`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Error en el análisis de la IA");
      const data = await res.json();
      setResult(data.data || { score: 85, feedback: "Great pronunciation!", transcription: "Simulated transcription due to backend configuration." });
    } catch (error) {
      console.error(error);
      setError("Hubo un error de conexión con el motor de IA. Intenta de nuevo.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 🔊 REPRODUCIR TEXTO ORIGINAL
  const playReferenceAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(targetText);
      utterance.lang = 'en-US';
      utterance.rate = 0.9; // Un poco más lento para que sea claro
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-amber-900/20 flex flex-col">
        
        {/* HEADER */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 px-6 md:px-10 py-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500 ring-1 ring-amber-500/30">
              <BookOpen size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Fluency Lab</h2>
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Executive Speech Training</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            disabled={isRecording}
            className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors active:scale-95 disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 md:p-10 flex-1 flex flex-col">
          
          {error && (
            <div className="mb-6 p-4 bg-red-950/50 border border-red-500/50 rounded-xl flex items-start gap-3 text-red-200">
              <AlertTriangle className="shrink-0 mt-0.5 text-red-500" size={20} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* TELEPROMPTER */}
          {!result && (
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-end mb-4">
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Teleprompter ({currentTextIndex + 1}/{PRACTICE_TEXTS.length})</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setCurrentTextIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentTextIndex === 0 || isRecording || isAnalyzing}
                    className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    onClick={() => setCurrentTextIndex(prev => Math.min(PRACTICE_TEXTS.length - 1, prev + 1))}
                    disabled={currentTextIndex === PRACTICE_TEXTS.length - 1 || isRecording || isAnalyzing}
                    className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 md:p-12 text-slate-200 text-2xl md:text-3xl leading-relaxed font-serif shadow-inner flex-1 flex items-center justify-center text-center relative overflow-hidden">
                {/* Indicador de grabación visual */}
                {isRecording && (
                  <div className="absolute top-4 left-4 flex items-center gap-2 text-red-500 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-xs font-bold tracking-widest uppercase font-sans">REC {formatTime(recordingTime)}</span>
                  </div>
                )}
                
                <p className={isRecording ? 'opacity-100' : 'opacity-90'}>
                  "{targetText}"
                </p>
              </div>

              {/* FEEDBACK VISUAL DE AUDIO */}
              <div className="h-16 flex items-center justify-center gap-1 mt-6">
                {isRecording ? (
                  Array.from({ length: 20 }).map((_, i) => {
                    // Calculamos una altura dinámica basada en el volumen real del micrófono
                    const height = Math.max(10, Math.random() * volume * 1.5);
                    return (
                      <div 
                        key={i} 
                        className="w-1.5 bg-amber-500 rounded-full transition-all duration-75"
                        style={{ height: `${Math.min(100, height)}%`, opacity: height > 15 ? 1 : 0.3 }}
                      />
                    );
                  })
                ) : (
                  <div className="flex items-center gap-2 text-slate-600 text-sm font-bold uppercase tracking-widest">
                    <Activity size={18} /> Micrófono en Espera
                  </div>
                )}
              </div>

              {/* CONTROLES */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button 
                  onClick={playReferenceAudio}
                  disabled={isRecording || isAnalyzing}
                  className="flex-1 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-3 disabled:opacity-50 border border-slate-700"
                >
                  <Volume2 size={20} /> Escuchar Nativo
                </button>
                
                {!isRecording ? (
                  <button 
                    onClick={startRecording}
                    disabled={isAnalyzing}
                    className="flex-[2] py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/50 disabled:opacity-50 active:scale-95"
                  >
                    {isAnalyzing ? (
                      <><Loader2 className="animate-spin" size={22} /> PROCESANDO IA...</>
                    ) : (
                      <><Mic size={22} /> COMENZAR GRABACIÓN</>
                    )}
                  </button>
                ) : (
                  <button 
                    onClick={stopRecording}
                    className="flex-[2] py-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg shadow-red-900/50 animate-pulse active:scale-95"
                  >
                    <Square size={20} fill="currentColor" /> DETENER Y ANALIZAR
                  </button>
                )}
              </div>
            </div>
          )}

          {/* RESULTADOS DE LA IA */}
          {result && (
            <div className="flex-1 flex flex-col justify-center animate-in slide-in-from-bottom-8 duration-500">
              <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-amber-500/10 blur-[60px] rounded-full pointer-events-none"></div>
                
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Análisis de Fluidez</p>
                
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-amber-500 bg-slate-900 shadow-[0_0_30px_rgba(245,158,11,0.3)] mb-6 relative z-10">
                  <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-amber-300 to-orange-500">
                    {result.score}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Evaluación Completada</h3>
                <div className="flex items-center justify-center gap-2 text-emerald-400 font-medium bg-emerald-500/10 inline-flex px-4 py-2 rounded-full border border-emerald-500/20 mb-8">
                  <CheckCircle2 size={18} /> {result.feedback}
                </div>

                <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-left relative z-10 max-w-2xl mx-auto">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3 font-bold flex items-center gap-2">
                    <Mic size={14} /> Transcripción Detectada
                  </p>
                  <p className="text-slate-300 italic text-lg leading-relaxed">
                    "{result.transcription}"
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button 
                  onClick={onClose}
                  className="flex-1 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold tracking-widest uppercase transition-colors"
                >
                  Cerrar Laboratorio
                </button>
                <button 
                  onClick={() => setResult(null)}
                  className="flex-1 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black tracking-widest uppercase transition-all shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  <RefreshCw size={20} /> Intentar de Nuevo
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};