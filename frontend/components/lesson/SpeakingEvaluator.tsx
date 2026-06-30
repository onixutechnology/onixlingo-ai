'use client';

import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2, CheckCircle2, AlertCircle, Play } from 'lucide-react';
import apiClient from '@/lib/apiClient';

interface SpeakingEvaluatorProps {
  stage: any;
  onComplete: () => void;
  isPro: boolean;
}

export default function SpeakingEvaluator({ stage, onComplete, isPro }: SpeakingEvaluatorProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

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

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        sendAudioToAnalysis(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      setError("No se pudo acceder al micrófono. Por favor revisa los permisos.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const sendAudioToAnalysis = async (blob: Blob) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('audio', blob, 'recording.webm');
      // En el caso de speaking, pasamos la instrucción o texto objetivo
      formData.append('target_text', stage.target_text || stage.instructions || 'Speak naturally');

      const response = await apiClient.post('/api/v1/speech/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // La API devuelve { status: "success", data: { fluency_score: X, feedback: "..." } }
      setResult(response.data.data);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError("Límite diario alcanzado: Sube a Pro o Executive para grabaciones ilimitadas.");
      } else {
        setError("Error al procesar el audio. Por favor intenta grabar de nuevo.");
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Instrucciones y Escenario */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
            <Mic size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Prueba de Speaking</h2>
            <p className="text-sm text-slate-500">Google Cloud STT + Evaluador Analítico</p>
          </div>
        </div>
        
        <div className="prose prose-slate max-w-none text-slate-700 whitespace-pre-wrap mb-4 font-medium">
          {stage.instructions}
        </div>
        
        {stage.target_text && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 italic">
            "{stage.target_text}"
          </div>
        )}
        
        {stage.image_url && (
          <div className="mt-6 flex justify-center">
            <img src={stage.image_url} alt="Reference material" className="max-w-full h-auto max-h-[400px] rounded-xl shadow-sm border border-slate-200" />
          </div>
        )}
      </div>

      {/* Controles de Grabación */}
      {!result ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center min-h-[250px]">
          
          {isAnalyzing ? (
            <div className="flex flex-col items-center gap-4 text-indigo-600">
              <Loader2 size={48} className="animate-spin" />
              <p className="font-medium">Analizando pronunciación y fluidez...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-6">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all ${
                  isRecording 
                    ? 'bg-red-500 text-white animate-pulse shadow-red-500/50' 
                    : 'bg-[#101828] text-white hover:scale-105 shadow-slate-900/30'
                }`}
              >
                {isRecording ? <Square size={32} fill="currentColor" /> : <Mic size={36} />}
              </button>
              
              <div className="text-center">
                <p className="font-bold text-slate-800 text-lg">
                  {isRecording ? 'Grabando... (Click para detener)' : 'Click para Empezar a Hablar'}
                </p>
                {error && <p className="text-red-500 mt-2 font-medium flex items-center justify-center gap-1"><AlertCircle size={16}/> {error}</p>}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Resultados */
        <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-6 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <CheckCircle2 className="text-indigo-500" /> Resultados de Speaking
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-100 flex flex-col items-center justify-center">
              <div className="text-sm font-bold text-indigo-800 uppercase tracking-wider mb-2">Fluidez y Pronunciación</div>
              <div className="text-5xl font-black text-indigo-600">{result.fluency_score}%</div>
            </div>
            
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                Feedback de la Plataforma
              </div>
              <p className="text-slate-700">{result.feedback || "Excelente pronunciación."}</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            {audioUrl ? (
              <audio src={audioUrl} controls className="h-10 outline-none" />
            ) : <div/>}
            
            <button 
              onClick={onComplete}
              className="bg-[#D4AF37] hover:bg-[#B8962E] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-[#D4AF37]/30 transition-all hover:-translate-y-0.5"
            >
              Continuar Siguiente Parte
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
