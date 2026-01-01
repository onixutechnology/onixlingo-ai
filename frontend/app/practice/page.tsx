'use client';

import { useState, useEffect, useRef } from 'react';
import Avatar3D from '@/components/avatar/Avatar3D';
import { useAvatarStore } from '@/store/avatarStore';
import XPBar from '@/components/ui/XPBar';

// Definición para TS del reconocimiento de voz
declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

export default function DashboardPage() {
  const { setGesture, setSpeaking, isSpeaking, addXp } = useAvatarStore();
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('¡Hola! Soy tu tutor IA. ¿Qué quieres practicar hoy?');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // --- LÓGICA DE VOZ Y CHAT (Igual que antes) ---
  useEffect(() => {
    if (typeof window !== 'undefined' && window.webkitSpeechRecognition) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'es-ES'; 
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript); 
      };

      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    
    // 1. MEJORA EN DETECCIÓN: Agregamos más palabras comunes para detectar español
    // Si la frase contiene tildes O palabras clave en español
    const isSpanish = /[áéíóúñ¿¡]/.test(text) || 
                      /hola|buenos|gracias|estoy|bien|tutor|idiomas|claro|si|puedo/i.test(text);
    
    let preferredVoice;

    if (isSpanish) {
       // ESPAÑOL: Priorizamos Google (Mujer) -> Luego Sabina (Mujer) -> Luego cualquiera
       preferredVoice = voices.find(v => v.name.includes('Google') && v.lang.includes('es')) || 
                        voices.find(v => v.name.includes('Sabina')) || 
                        voices.find(v => v.lang.startsWith('es'));
    } else {
       // INGLÉS: Priorizamos Google (Mujer) -> Luego Zira (Mujer) -> Luego cualquiera
       preferredVoice = voices.find(v => v.name.includes('Google') && v.lang.includes('en-US')) || 
                        voices.find(v => v.name.includes('Zira')) || 
                        voices.find(v => v.lang.startsWith('en'));
    }

    if (preferredVoice) {
        utterance.voice = preferredVoice;
        utterance.rate = 1.0; 
        // Tip: Si quieres que hable más agudo o grave, puedes ajustar 'pitch'
        // utterance.pitch = 1.0; 
    }

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };
  const toggleMic = () => {
    if (!recognitionRef.current) return alert("Usa Chrome en PC para la voz.");
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

const handleSend = async (textToSend: string = input) => {
    if (!textToSend.trim()) return;
    setLoading(true);
    
    try {
      console.log("📡 Enviando mensaje al backend:", textToSend); // Log 1

      // CAMBIO IMPORTANTE: Usamos 127.0.0.1 en lugar de localhost para evitar problemas de DNS/IPv6
      const res = await fetch('http://127.0.0.1:8001/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      });
      
      console.log("📡 Estado de respuesta HTTP:", res.status); // Log 2

      if (!res.ok) {
        throw new Error(`Error del servidor: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      console.log("📦 Datos recibidos (JSON):", data); // Log 3

      setResponse(data.text);
      if (data.gesture) setGesture(data.gesture); 
      
      if (data.emotion === 'joy' || data.gesture === 'happy') addXp(25);
      else if (data.gesture === 'nod') addXp(10);

      speakText(data.text);
      
    } catch (error) {
      // AQUÍ ESTÁ LA CLAVE: Imprimimos el error real en la consola roja
      console.error("❌ ERROR CRÍTICO EN FRONTEND:", error);
      setResponse("Ups, mi cerebro se desconectó un momento. 🧠 (Mira la consola F12)");
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  // --- DISEÑO VISUAL MEJORADO ---
  return (
    <div className="min-h-screen bg-brand-50 p-4 lg:p-8 font-sans flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Fondo Decorativo */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent-yellow/30 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>

      <div className="max-w-7xl w-full relative z-10 h-[90vh] flex flex-col">
        
        {/* HEADER */}
        <header className="flex justify-between items-center mb-6 px-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    On
                </div>
                <h1 className="text-2xl font-extrabold text-brand-700 tracking-tight">OnixLingo</h1>
            </div>
            
            {/* Status Badge */}
            <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border transition-all ${isSpeaking ? 'bg-green-100 text-green-700 border-green-200 animate-pulse' : 'bg-white text-slate-400 border-slate-200'}`}>
                {isSpeaking ? '● Hablando' : '○ Esperando'}
            </div>
        </header>

        {/* CONTENIDO PRINCIPAL: GRID 2 COLUMNAS */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
            
            {/* COLUMNA IZQUIERDA: ROBOT (40% ancho) */}
            <div className="lg:col-span-5 flex flex-col min-h-[300px]">
                <div className="bg-gradient-to-b from-brand-200 to-white rounded-[2.5rem] shadow-soft border-[6px] border-white flex-1 relative overflow-hidden group">
                    {/* Efecto de luz interior */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10"></div>
                    
                    {/* Componente 3D */}
                    <div className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing">
                         <Avatar3D />
                    </div>
                </div>
            </div>

            {/* COLUMNA DERECHA: INTERFAZ (60% ancho) */}
            <div className="lg:col-span-7 flex flex-col gap-5 h-full">
                
                {/* 1. Barra de Nivel */}
                <XPBar />

                {/* 2. Chat Container */}
                <div className="bg-white rounded-[2.5rem] shadow-soft border-[6px] border-white p-6 flex flex-col flex-1 relative overflow-hidden">
                    
                    {/* Área de Mensajes (Scrollable si fuera necesario) */}
                    <div className="flex-1 overflow-y-auto mb-6 flex flex-col justify-end space-y-4 pr-2 custom-scrollbar">
                        
                        {/* Mensaje del Robot */}
                        <div className="flex gap-4 items-end">
                            <div className="w-10 h-10 rounded-full bg-brand-100 border-2 border-brand-200 flex items-center justify-center text-xl shrink-0">
                                🤖
                            </div>
                            <div className="bg-brand-50 p-5 rounded-2xl rounded-bl-none text-brand-800 font-medium text-lg border border-brand-100 shadow-sm max-w-[90%]">
                                <p className={loading ? "animate-pulse" : ""}>
                                    {loading ? "Analizando tu respuesta..." : response}
                                </p>
                            </div>
                        </div>

                        {/* (Opcional) Aquí podrías mostrar el último mensaje del usuario alineado a la derecha */}
                    </div>

                    {/* Área de Input (Control Center) */}
                    <div className="relative group">
                        <textarea 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                            className="w-full h-32 pl-6 pr-6 pt-5 pb-16 bg-slate-50 border-2 border-slate-200 rounded-3xl focus:border-brand-500 focus:ring-4 focus:ring-brand-100/50 outline-none resize-none text-lg text-slate-700 placeholder:text-slate-400 transition-all font-medium shadow-inner"
                            placeholder="Escribe tu respuesta..."
                        />
                        
                        {/* Botonera Flotante dentro del Textarea */}
                        <div className="absolute bottom-3 right-3 flex gap-2">
                            {/* Botón Micrófono */}
                            <button 
                                onClick={toggleMic}
                                className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all shadow-md active:scale-95 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'}`}
                                title="Usar voz"
                            >
                                <span className="text-xl">🎙️</span>
                            </button>

                            {/* Botón Enviar */}
                            <button 
                                onClick={() => handleSend()}
                                disabled={loading || (!input.trim() && !isListening)}
                                className={`h-12 px-6 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md active:scale-95 ${loading || (!input.trim() && !isListening) ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-brand-600 text-white hover:bg-brand-700 shadow-brand-500/30'}`}
                            >
                                <span>ENVIAR</span>
                                <span className="text-lg">🚀</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
      </div>
    </div>
  );
}