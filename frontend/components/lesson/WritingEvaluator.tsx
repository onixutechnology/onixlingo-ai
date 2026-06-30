'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, Play, RefreshCw, PenTool, Edit3, Lock } from 'lucide-react';
import apiClient from '@/lib/apiClient';

interface WritingEvaluatorProps {
  stage: any;
  onComplete: () => void;
  isPro: boolean;
}

export default function WritingEvaluator({ stage, onComplete, isPro }: WritingEvaluatorProps) {
  const [text, setText] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (text.length < 10) {
      setError("Please write at least 10 characters.");
      return;
    }
    
    setIsEvaluating(true);
    setError(null);
    
    try {
      const response = await apiClient.post('/api/v1/ai/evaluate-writing', {
        prompt: stage.ai_system_prompt || stage.question || 'Evaluate writing',
        text: text
      });
      setResult(response.data);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setError("Límite diario alcanzado: Sube a Pro o Executive para evaluaciones ilimitadas.");
      } else {
        setError("Ocurrió un error al evaluar. Por favor intenta de nuevo.");
      }
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      {/* Pregunta o Escenario */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-[#D4AF37]/10 rounded-xl text-[#D4AF37]">
            <Edit3 size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{stage.scenario || "Writing Task"}</h2>
            <p className="text-sm text-slate-500">Evaluación Cognitiva Profesional</p>
          </div>
        </div>
        <div className="prose prose-slate max-w-none text-slate-700 whitespace-pre-wrap">
          {stage.question}
        </div>
        {stage.image_url && (
          <div className="mt-6 flex justify-center">
            <img src={stage.image_url} alt="Reference material" className="max-w-full h-auto max-h-[400px] rounded-xl shadow-sm border border-slate-200" />
          </div>
        )}
      </div>

      {/* Caja de Texto */}
      {!result ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={isEvaluating}
            placeholder="Empieza a escribir tu respuesta aquí..."
            className="w-full min-h-[250px] p-4 text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent resize-y"
          />
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-slate-500">{text.split(/\s+/).filter(w => w.length > 0).length} palabras</span>
            
            {error && <span className="text-red-500 text-sm font-medium">{error}</span>}
            
            <button 
              onClick={handleSubmit} 
              disabled={isEvaluating || text.length < 5}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                isEvaluating 
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : 'bg-[#101828] text-white hover:bg-black shadow-lg hover:shadow-xl'
              }`}
            >
              {isEvaluating ? (
                <><RefreshCw size={18} className="animate-spin" /> Analizando...</>
              ) : (
                <><PenTool size={18} /> Enviar a Revisión del Sistema</>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Resultados de la Evaluación */
        <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500" /> Resultados del Evaluador Analítico
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
              <div className="text-sm font-medium text-emerald-800 mb-1">Gramática</div>
              <div className="text-3xl font-bold text-emerald-600">{result.grammar_score}/100</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
              <div className="text-sm font-medium text-blue-800 mb-1">Vocabulario</div>
              <div className="text-3xl font-bold text-blue-600">{result.vocab_score}/100</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 text-center">
              <div className="text-sm font-medium text-purple-800 mb-1">Coherencia</div>
              <div className="text-3xl font-bold text-purple-600">{result.coherence_score}/100</div>
            </div>
          </div>

          {result.mistakes && result.mistakes.length > 0 && (
            <div className="mb-8">
              <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-500" /> Áreas de Mejora
              </h4>
              <ul className="space-y-2">
                {result.mistakes.map((m: string, i: number) => (
                  <li key={i} className="flex gap-2 text-slate-600 bg-slate-50 p-3 rounded-lg">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mb-8">
            <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">
              Reescritura Profesional (Sugerencia)
            </h4>
            <div className="p-5 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl text-slate-800 italic shadow-sm">
              "{result.rewrite_suggestion}"
            </div>
          </div>

          <div className="flex justify-end">
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
