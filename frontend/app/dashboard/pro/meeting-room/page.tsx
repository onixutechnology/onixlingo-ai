'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  Users, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  MessageSquare, 
  X, 
  ArrowLeft, 
  Monitor,
  Layout,
  Send,
  MoreVertical,
  Settings,
  Circle,
  Activity,
  Loader2,
  Trophy,
  ShieldAlert
} from 'lucide-react';
import apiClient from '@/lib/apiClient';

interface Character {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'speaking' | 'listening' | 'idle';
  isAI: boolean;
}

export default function MeetingRoomPage() {
  const router = useRouter();
  const [isJoined, setIsJoined] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [characters, setCharacters] = useState<Character[]>([
    { id: '1', name: 'Dr. Sarah Chen', role: 'AI Strategy Teacher', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&h=200&auto=format&fit=crop', status: 'idle', isAI: true },
    { id: '2', name: 'Marcus Thorne', role: 'Venture Capitalist', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=200&h=200&auto=format&fit=crop', status: 'idle', isAI: true },
    { id: '3', name: 'Elena Rodriguez', role: 'CFO OnixCorp', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&h=200&auto=format&fit=crop', status: 'idle', isAI: true },
  ]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    
    const userMsg = { role: 'user', text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);
    
    try {
      // Cambiamos el estado de los personajes para simular que escuchan
      setCharacters(prev => prev.map(c => ({ ...c, status: 'listening' })));
      
      const { data } = await apiClient.post('/ai/chat', {
        message: inputText,
        context: "You are Dr. Sarah Chen, an AI Strategy Teacher in a high-stakes boardroom meeting. You are evaluating the user's leadership skills and business English. Be professional, slightly challenging, but supportive.",
        mode: "negotiation"
      });

      setCharacters(prev => prev.map(c => 
        c.id === '1' ? { ...c, status: 'speaking' } : { ...c, status: 'idle' }
      ));

      setMessages(prev => [...prev, { role: 'ai', text: data.text, analysis: data.analysis }]);
      
      setTimeout(() => {
        setCharacters(prev => prev.map(c => ({ ...c, status: 'idle' })));
      }, 3000);

    } catch (error) {
      // Error manejado silenciosamente en producción
    } finally {
      setIsLoading(false);
    }
  };

  if (!isJoined) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 p-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-8">
            <Users size={40} />
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Titanium Boardroom</h1>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-10 text-center">Simulación de junta directiva en tiempo real</p>
          
          <div className="w-full grid grid-cols-2 gap-4 mb-10">
            <button 
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-4 border flex flex-col items-center gap-3 transition-all ${isMicOn ? 'bg-amber-500 border-amber-400 text-slate-950' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
            >
              {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
              <span className="text-[10px] font-black uppercase tracking-widest">{isMicOn ? 'Mic Active' : 'Mic Muted'}</span>
            </button>
            <button 
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-4 border flex flex-col items-center gap-3 transition-all ${isVideoOn ? 'bg-amber-500 border-amber-400 text-slate-950' : 'bg-slate-950 border-slate-800 text-slate-500'}`}
            >
              {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
              <span className="text-[10px] font-black uppercase tracking-widest">{isVideoOn ? 'Video Active' : 'Video Off'}</span>
            </button>
          </div>

          <button 
            onClick={() => setIsJoined(true)}
            className="w-full py-4 bg-white text-slate-950 font-black uppercase tracking-[0.2em] text-xs hover:bg-amber-500 transition-all active:scale-95"
          >
            Join Meeting
          </button>
          <button onClick={() => router.back()} className="mt-6 text-[10px] font-black text-slate-600 hover:text-white uppercase tracking-widest transition-colors">
            Return to Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-950 flex flex-col text-slate-300 overflow-hidden">
      
      {/* Header */}
      <div className="h-14 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-widest">
            <Circle size={8} fill="currentColor" className="animate-pulse" /> LIVE SESSION
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">OnixCorp Strategy Q4</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 border border-slate-800 text-[10px] font-bold text-slate-500 uppercase">
             Encrypted <ShieldAlert size={12} className="text-amber-500" />
          </div>
          <button onClick={() => setIsJoined(false)} className="p-2 hover:bg-red-500/10 text-red-500 transition-colors">
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Main View Area */}
        <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto">
          
          {/* Board Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((char) => (
              <div key={char.id} className={`relative bg-slate-900 border-2 transition-all aspect-video overflow-hidden group ${char.status === 'speaking' ? 'border-amber-500' : 'border-slate-800'}`}>
                <Image 
                  src={char.avatar} 
                  alt={char.name} 
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-black text-xs uppercase tracking-tight">{char.name}</p>
                      <p className="text-[9px] text-amber-500 font-bold uppercase tracking-widest">{char.role}</p>
                    </div>
                    {char.status === 'speaking' && (
                      <div className="flex items-end gap-0.5 h-3">
                        <div className="w-0.5 bg-amber-500 animate-[bounce_0.6s_infinite]"></div>
                        <div className="w-0.5 bg-amber-500 animate-[bounce_0.8s_infinite]"></div>
                        <div className="w-0.5 bg-amber-500 animate-[bounce_0.5s_infinite]"></div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="absolute top-4 left-4 flex gap-2">
                   <div className="px-2 py-0.5 bg-slate-950/80 text-[8px] font-bold text-slate-400 uppercase tracking-widest backdrop-blur-md">AI Entity</div>
                </div>
              </div>
            ))}

            {/* User View */}
            <div className={`relative bg-slate-900 border-2 border-slate-800 aspect-video overflow-hidden flex items-center justify-center`}>
              {isVideoOn ? (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center italic text-slate-500 text-xs">Camera Active</div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-800 flex items-center justify-center text-white text-xl font-black mb-2 mx-auto">U</div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">You</p>
                </div>
              )}
              <div className="absolute bottom-4 left-4 px-2 py-0.5 bg-slate-950/80 text-[8px] font-bold text-slate-400 uppercase tracking-widest backdrop-blur-md">You (CEO)</div>
            </div>
          </div>

          {/* Activity Feed / Subtitles */}
          <div className="bg-slate-900/40 border border-slate-800 p-6 flex-1 min-h-[200px] flex flex-col">
             <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">
                <Activity size={12} className="text-amber-500" /> Transcripción en Tiempo Real
             </div>
             
             <div className="flex-1 space-y-4 overflow-y-auto pr-4 custom-scrollbar">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    <div className={`max-w-[80%] p-4 text-xs leading-relaxed ${msg.role === 'user' ? 'bg-slate-800 text-white' : 'bg-slate-950/50 border border-slate-800 text-slate-300'}`}>
                       <p className="font-black text-[9px] uppercase tracking-widest mb-1 text-amber-500">{msg.role === 'user' ? 'You' : 'Dr. Sarah Chen'}</p>
                       {msg.text}
                       {msg.analysis && (
                         <div className="mt-3 pt-2 border-t border-slate-800 flex items-center gap-4">
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Precisión: {msg.analysis.score}%</span>
                            {msg.analysis.tone_check && <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Tono: {msg.analysis.tone_check}</span>}
                         </div>
                       )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-4">
                     <div className="bg-slate-950/50 border border-slate-800 p-4">
                        <Loader2 className="animate-spin text-amber-500" size={16} />
                     </div>
                  </div>
                )}
             </div>
          </div>

        </div>

        {/* Sidebar Controls */}
        <div className="w-80 border-l border-slate-800 bg-slate-900/30 flex flex-col">
          <div className="p-6 border-b border-slate-800">
             <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">Objetivos de la Sesión</h3>
             <div className="space-y-3">
                {[
                  "Presentar el plan estratégico Q4",
                  "Manejar objeciones de la CFO",
                  "Usar terminología de M&A",
                  "Mantener un tono diplomático"
                ].map((obj, i) => (
                  <div key={i} className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                    <div className="w-4 h-4 border border-slate-700 flex items-center justify-center text-amber-500">
                      {i < 1 ? <Check size={10} /> : <Circle size={4} />}
                    </div>
                    {obj}
                  </div>
                ))}
             </div>
          </div>
          
          <div className="flex-1 p-6">
             <h3 className="text-xs font-black text-white uppercase tracking-widest mb-4">Board Members</h3>
             <div className="space-y-4">
                {characters.map(c => (
                  <div key={c.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-800 overflow-hidden relative">
                       <Image src={c.avatar} alt={c.name} fill className="object-cover" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-200 uppercase tracking-tight">{c.name}</p>
                       <p className="text-[8px] text-slate-500 font-bold uppercase">{c.role}</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

      </div>

      {/* Controls Bar */}
      <div className="h-20 bg-slate-950 border-t border-slate-800 px-10 flex items-center justify-between">
         <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsMicOn(!isMicOn)}
              className={`w-12 h-12 flex items-center justify-center transition-all ${isMicOn ? 'bg-slate-800 text-white' : 'bg-red-500 text-white'}`}
            >
              {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
            </button>
            <button 
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`w-12 h-12 flex items-center justify-center transition-all ${isVideoOn ? 'bg-slate-800 text-white' : 'bg-red-500 text-white'}`}
            >
              {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
            </button>
         </div>

         <div className="flex-1 max-w-2xl px-10">
            <div className="relative">
               <input 
                 type="text" 
                 value={inputText}
                 onChange={(e) => setInputText(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                 placeholder="Habla o escribe tu intervención..."
                 className="w-full bg-slate-900 border border-slate-800 px-6 py-3 text-xs font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 transition-all"
               />
               <button 
                 onClick={handleSendMessage}
                 className="absolute right-2 top-2 p-1.5 bg-amber-500 text-slate-950 hover:bg-white transition-all"
               >
                 <Send size={16} />
               </button>
            </div>
         </div>

         <div className="flex items-center gap-4">
            <button className="p-3 text-slate-500 hover:text-white transition-colors"><Monitor size={20} /></button>
            <button className="p-3 text-slate-500 hover:text-white transition-colors"><Settings size={20} /></button>
            <button 
              onClick={() => setIsJoined(false)}
              className="px-6 py-3 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all"
            >
              End Meeting
            </button>
         </div>
      </div>
    </div>
  );
}
