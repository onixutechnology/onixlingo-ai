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
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001';

export default function PracticePage() {
  const router = useRouter();
  
  // 1. Estados Globales y UI
  const { mode } = useUIStore();
  const isPro = mode === 'professional';
  
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

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${isPro ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* --- HEADER --- */}
      <header className={`h-16 px-6 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md border-b ${isPro ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="flex items-center gap-4">
            <Link href={isPro ? "/dashboard/pro" : "/dashboard"}>
                <button className={`p-2 rounded-full transition-colors ${isPro ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'}`}>
                    <ArrowLeft size={24} />
                </button>
            </Link>
            <div>
                <h1 className={`text-lg font-bold tracking-tight ${isPro ? 'text-white' : 'text-slate-800'}`}>
                    AI Tutor <span className={isPro ? 'text-amber-500' : 'text-indigo-600'}>Live</span>
                </h1>
                <p className="text-[10px] opacity-60 uppercase tracking-widest font-bold">Conversation Mode</p>
            </div>
        </div>
        
        {/* Indicador de Status */}
        <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 ${isPro ? 'bg-slate-800 border-slate-700 text-emerald-400' : 'bg-white border-slate-200 text-emerald-600'}`}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            ONLINE
        </div>
      </header>

      {/* --- MAIN CONTENT (Split View) --- */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* COLUMNA IZQUIERDA: AVATAR 3D */}
        <section className={`relative flex-1 min-h-[40vh] lg:min-h-auto flex items-center justify-center overflow-hidden ${isPro ? 'bg-gradient-to-b from-slate-900 to-indigo-950' : 'bg-gradient-to-b from-blue-50 to-white'}`}>
            
            {/* Efectos de Fondo */}
            <div className={`absolute inset-0 opacity-30 ${isPro ? 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent' : 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400/20 via-transparent to-transparent'}`}></div>
            
            {/* El Avatar */}
            <div className="w-full h-full relative z-10">
                <Avatar3D />
            </div>

            {/* Subtítulos Flotantes (Respuesta de IA) */}
            <div className="absolute bottom-8 left-6 right-6 text-center z-20">
                <div className={`inline-block px-6 py-4 rounded-3xl shadow-xl backdrop-blur-md max-w-2xl text-lg font-medium transition-all ${
                    isPro 
                        ? 'bg-black/60 text-white border border-white/10' 
                        : 'bg-white/80 text-slate-800 border border-white shadow-blue-900/5'
                }`}>
                    {loading ? (
                        <div className="flex items-center gap-2 justify-center text-sm opacity-80">
                            <Sparkles size={16} className="animate-spin" /> Thinking...
                        </div>
                    ) : (
                        <p>{response}</p>
                    )}
                </div>
            </div>
        </section>

        {/* COLUMNA DERECHA: INTERACCIÓN */}
        <section className={`w-full lg:w-[450px] flex flex-col border-l z-20 ${isPro ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
            
            {/* Chat Area (Placeholder visual) */}
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center opacity-40">
                <div className={`p-6 rounded-full mb-4 ${isPro ? 'bg-slate-900' : 'bg-slate-100'}`}>
                    <MessageSquare size={40} />
                </div>
                <p className="text-sm">Historial de conversación disponible en la versión completa.</p>
            </div>

            {/* Input Area */}
            <div className={`p-6 border-t ${isPro ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-slate-50'}`}>
                
                {/* Botones de Acción Rápida */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                    {['Explain grammar', 'Pronunciation', 'Give me a quiz'].map((prompt) => (
                        <button 
                            key={prompt}
                            onClick={() => { setInput(prompt); }}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                                isPro 
                                    ? 'border-slate-700 hover:bg-slate-800 text-slate-300' 
                                    : 'border-slate-200 hover:bg-white hover:shadow-sm text-slate-600'
                            }`}
                        >
                            {prompt}
                        </button>
                    ))}
                </div>

                <div className="flex items-end gap-3">
                    <div className={`flex-1 relative rounded-2xl border-2 transition-all focus-within:ring-2 ${
                        isPro 
                            ? 'bg-slate-950 border-slate-700 focus-within:border-amber-500 focus-within:ring-amber-500/20' 
                            : 'bg-white border-slate-200 focus-within:border-indigo-500 focus-within:ring-indigo-200'
                    }`}>
                        <textarea 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Escribe tu respuesta..."
                            className={`w-full bg-transparent p-4 outline-none resize-none h-[60px] ${isPro ? 'text-white placeholder:text-slate-600' : 'text-slate-800 placeholder:text-slate-400'}`}
                        />
                        <button 
                            onClick={handleMicToggle}
                            className={`absolute right-3 bottom-3 p-2 rounded-full transition-colors ${
                                isRecording 
                                    ? 'bg-red-500 text-white animate-pulse' 
                                    : (isPro ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-indigo-600')
                            }`}
                        >
                            <Mic size={20} />
                        </button>
                    </div>

                    <button 
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className={`h-[60px] w-[60px] rounded-2xl flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                            isPro 
                                ? 'bg-amber-500 text-slate-900 shadow-amber-900/20' 
                                : 'bg-indigo-600 text-white shadow-indigo-200'
                        }`}
                    >
                        {loading ? <Loader2 size={24} className="animate-spin" /> : <Send size={24} />}
                    </button>
                </div>
                
                <div className="mt-3 flex justify-between items-center text-[10px] uppercase font-bold tracking-widest opacity-50">
                    <span>Press Enter to send</span>
                    <span className="flex items-center gap-1"><MonitorPlay size={10} /> {isPro ? 'GPT-4 Turbo' : 'Standard Model'}</span>
                </div>
            </div>
        </section>

      </main>
    </div>
  );
}