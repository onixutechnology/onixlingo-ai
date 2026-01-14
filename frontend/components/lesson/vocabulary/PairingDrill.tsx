'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // 👈 Importante para animaciones suaves
import { Check, X, Zap, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';

// --- CONFIGURACIÓN ---
const BATCH_SIZE = 6; // Número de parejas por ronda (12 cartas en total)

// --- TIPOS ---
interface PairingDrillProps {
  stage: {
    title?: string;
    description?: string;
  };
  pairs: { id: string; en: string; es: string }[]; // Recibe TODAS las palabras
  isPro: boolean;
  onComplete: () => void;
  onError: () => void;
  onCorrect: () => void;
}

interface CardItem {
  id: string;      // ID único de la carta (ej: p_01_en)
  pairId: string;  // ID de la pareja (ej: p_01)
  text: string;
  type: 'en' | 'es';
  status: 'idle' | 'selected' | 'matched' | 'error';
}

export default function PairingDrill({ 
  stage, 
  pairs = [], // Default array vacío para evitar crash
  isPro, 
  onComplete, 
  onError, 
  onCorrect 
}: PairingDrillProps) {
  
  // --- ESTADOS ---
  const [activeCards, setActiveCards] = useState<CardItem[]>([]);
  const [completedPairIds, setCompletedPairIds] = useState<Set<string>>(new Set());
  const [selectedCards, setSelectedCards] = useState<CardItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- 1. LÓGICA DE LOTES (BATCHING) ---
  useEffect(() => {
    // Si no hay pares, no hacer nada
    if (!pairs || pairs.length === 0) return;

    // Si completamos todas las parejas disponibles -> FIN
    if (completedPairIds.size === pairs.length) {
      setTimeout(onComplete, 1000);
      return;
    }

    // Verificar si necesitamos cargar nuevas cartas
    // Criterio: No hay cartas O todas las visibles están matcheadas
    const allVisibleMatched = activeCards.length > 0 && activeCards.every(c => c.status === 'matched');
    
    if (activeCards.length === 0 || allVisibleMatched) {
      loadNextBatch();
    }
  }, [completedPairIds, pairs.length]);

  const loadNextBatch = () => {
    // 1. Filtrar las que faltan por hacer
    const remainingPairs = pairs.filter(p => !completedPairIds.has(p.id));
    
    if (remainingPairs.length === 0) return;

    // 2. Tomar las siguientes N parejas
    const nextBatch = remainingPairs.slice(0, BATCH_SIZE);

    // 3. Generar las cartas (EN + ES)
    const newCards: CardItem[] = nextBatch.flatMap(pair => [
      { id: `${pair.id}_en`, pairId: pair.id, text: pair.en, type: 'en', status: 'idle' },
      { id: `${pair.id}_es`, pairId: pair.id, text: pair.es, type: 'es', status: 'idle' }
    ]);

    // 4. Barajar y setear (con pequeño delay para que la animación de salida termine)
    setTimeout(() => {
        setActiveCards(newCards.sort(() => Math.random() - 0.5));
    }, 300);
  };

  // --- 2. MANEJO DE CLICS ---
  const handleCardClick = (card: CardItem) => {
    if (isProcessing || card.status === 'matched' || card.status === 'selected') return;

    // A. Primera Selección
    if (selectedCards.length === 0) {
      updateCardStatus(card.id, 'selected');
      setSelectedCards([card]);
      return;
    }

    // B. Segunda Selección
    if (selectedCards.length === 1) {
      const firstCard = selectedCards[0];
      
      // Evitar clic en la misma carta
      if (firstCard.id === card.id) return;

      updateCardStatus(card.id, 'selected');
      setSelectedCards([...selectedCards, card]);
      setIsProcessing(true);

      // Verificar Match
      if (firstCard.pairId === card.pairId) {
        handleMatchSuccess(firstCard.id, card.id, firstCard.pairId);
      } else {
        handleMatchError(firstCard.id, card.id);
      }
    }
  };

  const updateCardStatus = (cardId: string, status: CardItem['status']) => {
    setActiveCards(prev => prev.map(c => c.id === cardId ? { ...c, status } : c));
  };

  // --- 3. EXITO Y ERROR ---
  const handleMatchSuccess = (id1: string, id2: string, pairId: string) => {
    onCorrect();
    // Efecto visual
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 }, colors: ['#4ade80', '#3b82f6'] });

    // Esperar un poco antes de marcar como matched (para que se vea la selección)
    setTimeout(() => {
      setActiveCards(prev => prev.map(c => 
        (c.id === id1 || c.id === id2) ? { ...c, status: 'matched' } : c
      ));
      setSelectedCards([]);
      setIsProcessing(false);
      
      // IMPORTANTE: Esto dispara el useEffect para cargar el siguiente lote si corresponde
      setCompletedPairIds(prev => new Set(prev).add(pairId));
    }, 500);
  };

  const handleMatchError = (id1: string, id2: string) => {
    onError();
    updateCardStatus(id1, 'error');
    updateCardStatus(id2, 'error');

    setTimeout(() => {
      // Resetear a idle
      setActiveCards(prev => prev.map(c => 
        (c.id === id1 || c.id === id2) ? { ...c, status: 'idle' } : c
      ));
      setSelectedCards([]);
      setIsProcessing(false);
    }, 1000);
  };

  // --- 4. ESTILOS DINÁMICOS (Tailwind Puro para máxima compatibilidad) ---
  const getCardClasses = (card: CardItem) => {
    const isSelected = card.status === 'selected';
    const isError = card.status === 'error';
    const isEn = card.type === 'en';
    
    // Base layout
    let classes = "relative flex flex-col items-center justify-center p-4 h-28 md:h-32 rounded-2xl border-b-4 transition-all duration-200 cursor-pointer select-none overflow-hidden active:scale-95 shadow-sm ";
    
    // Tema PRO vs Normal
    if (isPro) {
        if (isSelected) classes += "bg-indigo-600 border-indigo-800 text-white ring-2 ring-indigo-400 ";
        else if (isError) classes += "bg-red-900/50 border-red-600 text-red-200 animate-shake ";
        else classes += "bg-slate-800 border-slate-950 text-slate-200 hover:bg-slate-700 hover:-translate-y-1 ";
    } else {
        if (isSelected) classes += "bg-blue-500 border-blue-700 text-white ring-4 ring-blue-200 ";
        else if (isError) classes += "bg-red-100 border-red-400 text-red-700 animate-shake ";
        else classes += "bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-600 hover:-translate-y-1 ";
    }

    return classes;
  };

  // --- RENDER ---
  const progressPercent = Math.round((completedPairIds.size / Math.max(pairs.length, 1)) * 100);

  return (
    <div className="max-w-5xl w-full mx-auto flex flex-col items-center">
      
      {/* HEADER */}
      <div className="w-full flex flex-col md:flex-row justify-between items-end mb-6 px-4 gap-4">
        <div className="flex-1">
          <h2 className={`text-2xl md:text-3xl font-black ${isPro ? 'text-white' : 'text-slate-800'}`}>
            {stage?.title || "Vocabulary Drill"}
          </h2>
          <p className={`${isPro ? 'text-slate-400' : 'text-slate-500'} text-sm mt-1`}>
            {stage?.description || "Empareja los conceptos."}
          </p>
        </div>
        
        {/* Barra de Progreso */}
        <div className="w-full md:w-1/3 flex flex-col items-end">
            <div className={`flex items-center gap-2 font-bold mb-1 ${isPro ? 'text-indigo-400' : 'text-indigo-600'}`}>
                <Zap size={16} fill="currentColor" />
                <span>{completedPairIds.size} / {pairs.length}</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <motion.div 
                    className="h-full bg-indigo-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>
        </div>
      </div>

      {/* GRID (Usando AnimatePresence para transiciones de lotes) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 w-full px-2 pb-20 min-h-[400px]">
        <AnimatePresence mode='popLayout'>
            {activeCards.map((card) => {
               // Si está matcheada, la sacamos del DOM visualmente para limpiar la vista (estilo Duolingo)
               if (card.status === 'matched') return null;

               return (
                <motion.button
                    key={card.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    onClick={() => handleCardClick(card)}
                    className={getCardClasses(card)}
                    disabled={isProcessing}
                >
                    {/* Badge Idioma */}
                    <span className={`
                    absolute top-2 right-2 text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded
                    ${card.type === 'en' 
                        ? (isPro ? 'bg-slate-900 text-slate-500' : 'bg-blue-50 text-blue-400') 
                        : (isPro ? 'bg-slate-900 text-emerald-500' : 'bg-emerald-50 text-emerald-600')
                    }
                    `}>
                    {card.type === 'en' ? 'EN' : 'ES'}
                    </span>

                    <span className="text-center font-bold leading-tight px-1 text-lg">
                    {card.text}
                    </span>

                    {/* Feedback Icon (Solo error, el success desaparece la carta) */}
                    {card.status === 'error' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-red-100/10 text-red-500">
                            <X size={48} strokeWidth={4} />
                        </div>
                    )}
                </motion.button>
               );
            })}
        </AnimatePresence>
        
        {/* Loading State cuando cambia de lote */}
        {activeCards.length === 0 && completedPairIds.size < pairs.length && (
            <div className="col-span-full flex items-center justify-center h-64 text-slate-400 animate-pulse">
                Cargando siguiente ronda...
            </div>
        )}
      </div>

    </div>
  );
}