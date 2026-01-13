'use client';

import { useState, useEffect, useCallback } from 'react';
import { Check, X, RefreshCw, Zap } from 'lucide-react';

// --- TIPOS ---
interface PairingItem {
  id: string;
  text: string;
  pairId: string;
  type: 'en' | 'es';
  status: 'idle' | 'selected' | 'matched' | 'error';
}

interface PairingDrillProps {
  stage: {
    title?: string;
    description?: string;
    pairs: { id: string; en: string; es: string }[];
  };
  isPro: boolean;
  onComplete: () => void;
  onError: () => void;
  onCorrect: () => void;
}

export default function PairingDrill({ 
  stage, 
  isPro, 
  onComplete, 
  onError, 
  onCorrect 
}: PairingDrillProps) {
  
  // --- ESTADOS ---
  const [items, setItems] = useState<PairingItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false); // Bloquea clics durante animaciones
  const [matchedCount, setMatchedCount] = useState(0);

  // --- INICIALIZACIÓN ---
  useEffect(() => {
    if (stage.pairs) {
      // 1. Crear las tarjetas duplicadas (EN y ES)
      const generatedItems: PairingItem[] = stage.pairs.flatMap((pair) => [
        { id: `${pair.id}_en`, text: pair.en, pairId: pair.id, type: 'en', status: 'idle' },
        { id: `${pair.id}_es`, text: pair.es, pairId: pair.id, type: 'es', status: 'idle' }
      ]);

      // 2. Mezclar aleatoriamente (Fisher-Yates simplificado)
      const shuffled = generatedItems.sort(() => Math.random() - 0.5);
      
      setItems(shuffled);
      setMatchedCount(0);
      setSelectedId(null);
    }
  }, [stage]);

  // --- LÓGICA DEL JUEGO ---
  const handleCardClick = (clickedId: string) => {
    // Bloqueos de seguridad
    if (isProcessing) return;
    const clickedItem = items.find(i => i.id === clickedId);
    if (!clickedItem || clickedItem.status === 'matched') return;

    // CASO 1: Primer clic (Selección)
    if (!selectedId) {
      setSelectedId(clickedId);
      updateItemStatus(clickedId, 'selected');
      return;
    }

    // CASO 2: Clic en la misma tarjeta (Deseleccionar)
    if (selectedId === clickedId) {
      setSelectedId(null);
      updateItemStatus(clickedId, 'idle');
      return;
    }

    // CASO 3: Segundo clic (Verificación)
    const firstItem = items.find(i => i.id === selectedId);
    if (!firstItem) return;

    setIsProcessing(true); // Bloquear interacción momentáneamente

    if (firstItem.pairId === clickedItem.pairId) {
      // --- ACIERTO ---
      handleMatch(firstItem.id, clickedItem.id);
    } else {
      // --- ERROR ---
      handleError(firstItem.id, clickedItem.id);
    }
  };

  // Helper para actualizar estado de un item específico
  const updateItemStatus = (id: string, status: PairingItem['status']) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, status } : item));
  };

  // Manejo de Acierto
  const handleMatch = (id1: string, id2: string) => {
    // 1. Actualizar visualmente a 'matched' (verde/éxito)
    setItems(prev => prev.map(item => 
      (item.id === id1 || item.id === id2) ? { ...item, status: 'matched' } : item
    ));
    
    onCorrect(); // Sonido/XP externo
    
    const newCount = matchedCount + 1;
    setMatchedCount(newCount);
    setSelectedId(null);
    setIsProcessing(false);

    // 2. Verificar Victoria
    if (newCount === stage.pairs.length) {
      setTimeout(() => onComplete(), 1000); // Dar un segundo para celebrar antes de salir
    }
  };

  // Manejo de Error
  const handleError = (id1: string, id2: string) => {
    // 1. Marcar error (rojo/shake)
    setItems(prev => prev.map(item => 
      (item.id === id1 || item.id === id2) ? { ...item, status: 'error' } : item
    ));

    onError(); // Sonido error externo

    // 2. Esperar y resetear
    setTimeout(() => {
      setItems(prev => prev.map(item => 
        (item.id === id1 || item.id === id2) ? { ...item, status: 'idle' } : item
      ));
      setSelectedId(null);
      setIsProcessing(false); // Desbloquear
    }, 800);
  };

  // --- ESTILOS DINÁMICOS ---
  const getCardStyles = (item: PairingItem) => {
    const baseStyles = "relative flex flex-col items-center justify-center p-4 h-32 rounded-2xl border-b-4 transition-all duration-200 active:scale-95 cursor-pointer select-none overflow-hidden";
    
    if (item.status === 'matched') {
      return `${baseStyles} border-transparent bg-transparent opacity-0 pointer-events-none scale-0`; // Desaparecer suavemente
      // Alternativa: Si quieres que se queden verdes, usa:
      // return `${baseStyles} bg-emerald-100 border-emerald-400 text-emerald-700 opacity-50`;
    }

    if (item.status === 'error') {
      return `${baseStyles} bg-red-100 border-red-400 text-red-700 animate-shake`; 
      // Nota: Asegúrate de tener una animación 'shake' en tu CSS global o tailwind config.
      // Si no, usa: translate-x-1 translate-y-1 (efecto simple)
    }

    if (item.status === 'selected') {
      return isPro
        ? `${baseStyles} bg-indigo-600 border-indigo-800 text-white shadow-lg scale-105 ring-4 ring-indigo-500/30 z-10`
        : `${baseStyles} bg-blue-600 border-blue-800 text-white shadow-lg scale-105 ring-4 ring-blue-400/30 z-10`;
    }

    // Estado Idle (Normal)
    return isPro
      ? `${baseStyles} bg-slate-800 border-slate-950 text-slate-200 hover:bg-slate-700 hover:-translate-y-1`
      : `${baseStyles} bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md hover:-translate-y-1`;
  };

  // --- RENDER ---
  return (
    <div className="max-w-5xl w-full mx-auto flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER DE LA ACTIVIDAD */}
      <div className="w-full flex justify-between items-end mb-8 px-4">
        <div>
          <h2 className={`text-2xl md:text-3xl font-black ${isPro ? 'text-white' : 'text-slate-800'}`}>
            {stage.title || "Neuro Link"}
          </h2>
          <p className={`${isPro ? 'text-slate-400' : 'text-slate-500'} text-sm mt-1`}>
            {stage.description || "Conecta los conceptos relacionados."}
          </p>
        </div>
        
        <div className={`px-4 py-2 rounded-xl font-bold font-mono text-sm flex items-center gap-2 ${isPro ? 'bg-slate-800 text-indigo-400' : 'bg-white border border-slate-200 text-indigo-600'}`}>
          <Zap size={16} fill="currentColor" />
          <span>{matchedCount} / {stage.pairs?.length || 0}</span>
        </div>
      </div>

      {/* GRID DE TARJETAS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full px-2 pb-20">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleCardClick(item.id)}
            className={getCardStyles(item)}
            disabled={item.status === 'matched' || (isProcessing && item.status !== 'selected')}
          >
            {/* Indicador de Idioma (Badge pequeño) */}
            <span className={`
              absolute top-2 right-2 text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded
              ${item.type === 'en' 
                ? (isPro ? 'bg-slate-900/50 text-slate-400' : 'bg-blue-50 text-blue-400') 
                : (isPro ? 'bg-slate-900/50 text-emerald-400' : 'bg-emerald-50 text-emerald-600')
              }
            `}>
              {item.type === 'en' ? 'EN' : 'ES'}
            </span>

            {/* Texto Central */}
            <span className="text-center font-bold leading-tight px-2">
              {item.text}
            </span>

            {/* Icono de estado (Solo aparece en error/match) */}
            {item.status === 'matched' && (
              <div className="absolute inset-0 bg-emerald-500 flex items-center justify-center text-white animate-in zoom-in duration-300">
                <Check size={48} strokeWidth={4} />
              </div>
            )}
            {item.status === 'error' && (
              <div className="absolute inset-0 flex items-center justify-center opacity-20 text-red-600">
                <X size={48} strokeWidth={4} />
              </div>
            )}
          </button>
        ))}
      </div>

    </div>
  );
}