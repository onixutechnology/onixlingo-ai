"use client";

import React, { useEffect, useState } from 'react';
import { AlertCircle, X, BellRing, Sparkles } from 'lucide-react';

const WS_URL = process.env.NODE_ENV === 'production' 
  ? 'wss://api.onixlingo.onixu.company/ws/broadcast/live'
  : 'ws://127.0.0.1:8022/ws/broadcast/live';

interface BroadcastMessage {
  type: string;
  title: string;
  body: string;
  campaign_type: string;
}

export default function GlobalBroadcastListener() {
  const [messages, setMessages] = useState<BroadcastMessage[]>([]);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimer: NodeJS.Timeout | null = null;
    let retryDelay = 5000; // empieza en 5s
    const MAX_DELAY = 60000; // max 60s entre reintentos
    let stopped = false;

    const connect = () => {
      if (stopped) return;

      // Solo intentar si hay un token de sesión activo
      const token = localStorage.getItem('access_token') ||
                    localStorage.getItem('admin_token') ||
                    document.cookie.split(';').find(c => c.trim().startsWith('access_token='))?.split('=')[1];
      if (!token) {
        // Sin sesión: no conectar, reintentar más tarde con backoff
        reconnectTimer = setTimeout(connect, retryDelay);
        retryDelay = Math.min(retryDelay * 2, MAX_DELAY);
        return;
      }

      // Resetear delay cuando hay sesión
      retryDelay = 5000;

      ws = new WebSocket(`${WS_URL}?token=${token}`);

      ws.onopen = () => {
        retryDelay = 5000; // reset on success
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'campaign_broadcast') {
            setMessages((prev) => [...prev, data]);
            setTimeout(() => {
              setMessages((prev) => prev.filter((m) => m !== data));
            }, 15000);
          }
        } catch (e) {
          console.error("Error parsing broadcast message", e);
        }
      };

      ws.onerror = () => {
        // Silencioso — el onclose se encarga del retry
      };

      ws.onclose = (event) => {
        if (stopped) return;
        // 403 = no autorizado, no tiene caso reintentar de forma agresiva
        if (event.code === 1006 || event.code === 4003) {
          reconnectTimer = setTimeout(connect, MAX_DELAY);
          return;
        }
        reconnectTimer = setTimeout(connect, retryDelay);
        retryDelay = Math.min(retryDelay * 1.5, MAX_DELAY);
      };
    };

    connect();

    return () => {
      stopped = true;
      if (ws) ws.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, []);

  if (messages.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 w-full max-w-md pointer-events-none">
      {messages.map((msg, idx) => (
        <div 
          key={idx} 
          className="pointer-events-auto w-full bg-slate-900/95 backdrop-blur-md border border-indigo-500/50 p-4 shadow-2xl rounded-lg animate-in slide-in-from-top-10 fade-in duration-500 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-50"></div>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full"></div>
          
          <div className="relative z-10 flex items-start gap-4">
            <div className="shrink-0 bg-indigo-500/20 p-2 rounded-full border border-indigo-400/30 text-indigo-300">
              {msg.campaign_type === 'promo' ? <Sparkles size={24} /> : <BellRing size={24} />}
            </div>
            <div className="flex-1 pt-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-white font-black text-sm tracking-wide uppercase">{msg.title}</h4>
                <button 
                  onClick={() => setMessages((prev) => prev.filter((m) => m !== msg))}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="text-indigo-100/80 text-xs font-medium leading-relaxed">
                {msg.body}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
