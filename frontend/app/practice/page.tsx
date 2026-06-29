'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Mic, Send, Volume2, ArrowLeft, Sparkles, Loader2, 
  MessageSquare, Zap, MonitorPlay 
} from 'lucide-react';

// --- STORES ---
import { useAvatarStore } from '@/store/avatarStore';
import { useProgressStore } from '@/store/progressStore'; // 👈 IMPORTACIÓN CORRECTA
import { useUIStore } from '@/store/uiStore'; 

// --- COMPONENTES ---
import Avatar3D from '@/components/avatar/Avatar3D';

// --- CONFIGURACIÓN API (Ajústalo a tu backend real) ---
const API_URL = process.env.NODE_ENV === 'production' ? 'https://api.onixlingo.onixu.company' : 'http://127.0.0.1:8021';

export default function PracticePage() {
  const router = useRouter();
  
  // 1. Estados Globales y UI
  const { mode, userTier, checkAndResetDailyLimits } = useUIStore();
  const isPro = mode === 'professional';

  useEffect(() => {
    checkAndResetDailyLimits();
  }, [checkAndResetDailyLimits]);
  
  // 2. Stores Separados (Solución del Error)
  const { setGesture, setSpeaking, isSpeaking } = useAvatarStore(); 
  const { addXp } = useProgressStore(); 

  // 3. Estados Locales
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('¡Hola! Soy tu tutor IA. ¿Qué quieres practicar hoy?');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // --- LÓGICA DE TEXT-TO-SPEECH ---
  const speak = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Intentar buscar una voz en inglés decente
      const voices = window.speechSynthesis.getVoices();
      const enVoice = voices.find(v => v.lang.includes('en-US')) || voices[0];
      utterance.voice = enVoice;
      utterance.lang = 'en-US';
      utterance.rate = 1;

      utterance.onstart = () => {
        setSpeaking(true);
        setGesture('talking');
      };
      utterance.onend = () => {
        setSpeaking(false);
        setGesture('idle');
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  // --- LÓGICA DE ENVÍO (CHAT) ---
  const handleSend = async () => {
    if (!input.trim()) return;

    setLoading(true);
    // 1. Animación de "Pensando"
    setGesture('thinking'); 

    try {
      // --- AQUÍ CONECTAS TU BACKEND REAL ---
      // const res = await fetch(`${API_URL}/api/v1/chat`, { method: 'POST', body: JSON.stringify({ message: input }) });
      // const data = await res.json();
      // const aiMessage = data.response;

      // --- SIMULACIÓN (Para que funcione la UI ya mismo) ---
      await new Promise(r => setTimeout(r, 1500)); // Simula delay de red
      const aiMessage = `That's an interesting point about "${input}". In a professional context, we might phrase it more precisely. Let's try again!`;
      
      setResponse(aiMessage);
      speak(aiMessage);
      
      // Ganar XP por participar
      addXp(15); 

    } catch (error) {
      console.error("Error connecting to AI:", error);
      setResponse("Lo siento, tuve un problema de conexión. Intenta de nuevo.");
      setGesture('sad');
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  const handleMicToggle = () => {
    setIsRecording(!isRecording);
    // Aquí iría la lógica real de Web Speech API (SpeechToText)
    if (!isRecording) {
        setGesture('listening');
    } else {
        setGesture('idle');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (userTier === 'free') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 p-6 relative overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/20 via-transparent to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-[1px] bg-[#D4AF37]"></div>
        
        <div className="bg-white border border-slate-200 p-10 max-w-md w-full shadow-2xl rounded-none text-center relative z-10 backdrop-blur-md">
          <div className="w-16 h-16 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center mx-auto mb-6">
            <Mic size={32} className="animate-pulse" />
          </div>
          <h2 className="text-xl font-serif font-black italic uppercase tracking-wider text-[#D4AF37] mb-2">
            Función Premium
          </h2>
          <p className="text-[10px] text-slate-600 leading-relaxed mb-8 uppercase tracking-wider font-bold">
            Las prácticas de conversación libre con Inteligencia Artificial (Speech Tutor) no están disponibles en el Plan Free.
          </p>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => router.push('/dashboard/pricing')}
              className="w-full py-4 bg-[#D4AF37] hover:bg-[#b5952f] text-black font-black text-[9px] uppercase tracking-[0.2em] transition-all rounded-none shadow-none shadow-[#D4AF37]/30"
            >
              Subir a Pro / Executive
            </button>
            <button 
              onClick={() => router.push('/dashboard')}
              className="w-full py-3 border border-gray-700 bg-transparent text-slate-600 hover:text-slate-900 font-black text-[9px] uppercase tracking-[0.2em] transition-all rounded-none"
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* --- HEADER --- */}
      <header className="h-16 px-6 flex items-center justify-between sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="flex items-center gap-4">
            <Link href={isPro ? "/dashboard/pro" : "/dashboard"}>
                <button className="p-2 rounded-none transition-colors hover:bg-white/10 text-slate-600 hover:text-slate-900">
                    <ArrowLeft size={24} />
                </button>
            </Link>
            <div>
                <h1 className="text-lg font-black tracking-tight text-slate-900 font-serif italic">
                    AI Tutor <span className="text-[#D4AF37]">Live</span>
                </h1>
                <p className="text-[10px] opacity-60 uppercase tracking-widest font-bold">Conversation Mode</p>
            </div>
        </div>
        
        {/* Indicador de Status */}
        <div className="px-3 py-1 rounded-none text-xs font-bold border flex items-center gap-2 bg-white border-slate-200 text-[#D4AF37]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
            </span>
            ONLINE
        </div>
      </header>

      {/* --- MAIN CONTENT (Split View) --- */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* COLUMNA IZQUIERDA: AVATAR 3D */}
        <section className="relative flex-1 min-h-[40vh] lg:min-h-auto flex items-center justify-center overflow-hidden bg-white">
            
            {/* Efectos de Fondo */}
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#D4AF37]/20 via-transparent to-transparent"></div>
            
            {/* El Avatar */}
            <div className="w-full h-full relative z-10">
                <Avatar3D />
            </div>

            {/* Subtítulos Flotantes (Respuesta de IA) */}
            <div className="absolute bottom-8 left-6 right-6 text-center z-20">
                <div className="inline-block px-6 py-4 rounded-none shadow-xl backdrop-blur-md max-w-2xl text-lg transition-all bg-[#D4AF37]/20 text-slate-900 border border-[#D4AF37]/30 font-bold">
                    {loading ? (
                        <div className="flex items-center gap-2 justify-center text-sm opacity-80 uppercase tracking-widest">
                            <Sparkles size={16} className="animate-spin text-[#D4AF37]" /> Pensando...
                        </div>
                    ) : (
                        <p>{response}</p>
                    )}
                </div>
            </div>
        </section>

        {/* COLUMNA DERECHA: INTERACCIÓN */}
        <section className="w-full lg:w-[450px] flex flex-col border-l z-20 bg-slate-50 border-slate-200">
            
            {/* Chat Area (Placeholder visual) */}
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center opacity-40">
                <div className="p-6 rounded-none mb-4 bg-white border border-slate-200">
                    <MessageSquare size={40} className="text-[#D4AF37]" />
                </div>
                <p className="text-[10px] uppercase font-bold tracking-widest">Historial de conversación disponible en la versión completa.</p>
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-slate-200 bg-white">
                
                {/* Botones de Acción Rápida */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                    {['Explain grammar', 'Pronunciation', 'Give me a quiz'].map((prompt) => (
                        <button 
                            key={prompt}
                            onClick={() => { setInput(prompt); }}
                            className="whitespace-nowrap px-4 py-2 rounded-none text-[9px] uppercase tracking-widest font-black border transition-all bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/20"
                        >
                            {prompt}
                        </button>
                    ))}
                </div>

                <div className="flex items-end gap-3">
                    <div className="flex-1 relative rounded-none border-2 transition-all focus-within:ring-2 bg-slate-50 border-slate-200 focus-within:border-[#D4AF37] focus-within:ring-[#D4AF37]/20">
                        <textarea 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Escribe tu respuesta..."
                            className="w-full bg-transparent p-4 outline-none resize-none h-[60px] text-slate-900 placeholder:text-gray-600 text-xs font-bold"
                        />
                        <button 
                            onClick={handleMicToggle}
                            className={`absolute right-3 bottom-3 p-2 rounded-none transition-colors ${
                                isRecording 
                                    ? 'bg-[#D4AF37]/100 text-slate-900 animate-pulse' 
                                    : 'text-slate-500 hover:text-slate-900'
                            }`}
                        >
                            <Mic size={20} />
                        </button>
                    </div>

                    <button 
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="h-[60px] w-[60px] rounded-none flex items-center justify-center shadow-none transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed bg-[#D4AF37] text-black shadow-[#D4AF37]/20"
                    >
                        {loading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                    </button>
                </div>
                
                <div className="mt-3 flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-slate-500">
                    <span>Press Enter to send</span>
                    <span className="flex items-center gap-1"><MonitorPlay size={10} className="text-[#D4AF37]"/> {isPro ? 'GPT-4 Turbo' : 'Standard Model'}</span>
                </div>
            </div>
        </section>

      </main>
    </div>
  );
}