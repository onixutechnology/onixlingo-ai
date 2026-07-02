'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { X, Sparkles, AlertTriangle } from 'lucide-react';
import {
  fn101_calcLexicalDensity,
  fn110_detectJargonDensity,
  fn113_estimatePronunciationMatch,
  fn122_classifyWpmPace,
  fn125_estimateDiplomacyScore,
  fn130_calculateVocalConfidence,
  fn145_calculateVocabularyWealth
} from '../../utils/executiveAnalytics';

type ActiveColor = {
  bg: string;
  text: string;
  border: string;
  icon: string;
  tag: string;
  btn: string;
};

type ActiveFeatureDetail = {
  icon: any;
  color: string;
  tag: string;
  title: string;
  description: string;
  bullets: string[];
  stat: string;
  statLabel: string;
  extraDetails: string;
  interactiveMetric: string;
};

interface InteractiveModalProps {
  activeFeatureDetail: ActiveFeatureDetail;
  activeColor: ActiveColor;
  onClose: () => void;
}

export default function InteractiveModal({ activeFeatureDetail, activeColor, onClose }: InteractiveModalProps) {
  const [inputText, setInputText] = useState('Our operational synergies are in perfect alignment for the upcoming quarterly board presentation.');
  const [speechWpm, setSpeechWpm] = useState(135);
  const [wordsKnown, setWordsKnown] = useState(25);
  const [chessElo, setChessElo] = useState(1200);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-50/80 backdrop-blur-md">
      <div className="bg-white max-w-2xl w-full border border-slate-200 shadow-2xl relative flex flex-col justify-between max-h-[85vh] overflow-y-auto rounded-none">
        
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 text-[9px] font-black uppercase ${activeColor.tag}`}>{activeFeatureDetail.tag}</span>
            <h3 className="font-bold text-black text-base">Consola de Diagnóstico</h3>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-black transition-colors p-1">
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
          <button onClick={onClose} className="bg-white hover:bg-white text-slate-700 font-bold py-2.5 px-5 text-xs uppercase tracking-wider transition-colors">
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
  );
}
