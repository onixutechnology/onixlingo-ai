'use client';

import { useState, useRef } from 'react';
import { Mic, Square, Loader2, X, Volume2, BookOpen, CheckCircle2, AlertTriangle } from 'lucide-react';
import Cookies from 'js-cookie';

interface ReadingStudioProps {
  onClose: () => void;
}

export const ReadingStudio = ({ onClose }: ReadingStudioProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  // Referencias para el micrófono
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // El texto que el ejecutivo debe leer
  const targetText = "Our strategic imperative is to leverage synergistic partnerships to maximize shareholder value and drive sustainable growth across emerging markets.";

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001';

  // 🎤 INICIAR GRABACIÓN
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await analyzeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop()); // Apagar la luz del mic
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error al acceder al micrófono:", error);
      alert("Por favor, permite el acceso al micrófono para usar el Fluency Lab.");
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
          // No enviamos Content-Type, el navegador lo calcula automático con FormData
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Error en el análisis");
      const data = await res.json();
      setResult(data.data); // Guardamos la calificación de la IA
    } catch (error) {
      console.error(error);
      alert("Hubo un error al procesar el audio.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 🔊 REPRODUCIR TEXTO ORIGINAL (Para que el usuario escuche cómo se pronuncia)
  const playReferenceAudio = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(targetText);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        {/* HEADER */}
        <div className="sticky top-0 bg-slate-900/90 backdrop-blur-sm border-b border-slate-800 px-6 py-5 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <BookOpen className="text-amber-400" /> Reading Studio
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors active:scale-95">
            <X className="text-slate-400 hover:text-white" size={24} />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          
          {/* EL TEXTO A LEER */}
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-3">Target Text</p>
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 md:p-8 text-slate-200 text-lg md:text-xl leading-relaxed font-medium">
              "{targetText}"
            </div>
          </div>

          {/* CONTROLES */}
          {!result && (
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={playReferenceAudio}
                disabled={isRecording || isAnalyzing}
                className="flex-1 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Volume2 size={20} /> Listen First
              </button>
              
              {!isRecording ? (
                <button 
                  onClick={startRecording}
                  disabled={isAnalyzing}
                  className="flex-1 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/50 disabled:opacity-50 active:scale-95"
                >
                  {isAnalyzing ? <Loader2 className="animate-spin" size={20} /> : <Mic size={20} />} 
                  {isAnalyzing ? 'Analizando...' : 'Start Recording'}
                </button>
              ) : (
                <button 
                  onClick={stopRecording}
                  className="flex-1 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-900/50 animate-pulse active:scale-95"
                >
                  <Square size={20} fill="currentColor" /> Stop & Analyze
                </button>
              )}
            </div>
          )}

          {/* RESULTADOS DE LA IA */}
          {result && (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-amber-500/30 rounded-2xl p-6 md:p-8 animate-in slide-in-from-bottom-4">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-amber-500/20 mb-4 bg-slate-950 shadow-inner">
                  <span className="text-4xl font-black text-amber-500">{result.score}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Fluency Score</h3>
                <p className="text-emerald-400 font-medium flex items-center justify-center gap-2">
                  <CheckCircle2 size={18} /> {result.feedback}
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-bold">What we heard:</p>
                <p className="text-slate-300 italic">"{result.transcription}"</p>
              </div>

              <button 
                onClick={() => setResult(null)}
                className="w-full mt-6 py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black uppercase tracking-widest transition-colors active:scale-95"
              >
                Try Again
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
