"use client";

import React, { useState } from 'react';
import { 
  CreditCard, ShieldCheck, Copy, Check, Server, Link, 
  Terminal, Lock, Zap
} from 'lucide-react';

const API_URL = process.env.NODE_ENV === 'production' ? 'https://api.onixlingo.onixu.company' : 'http://127.0.0.1:8022';

export default function Subscriptions() {
  const [copied, setCopied] = useState(false);
  
  // URL del webhook extraída del backend (asume que la API base es la misma donde corre el backend)
  const webhookUrl = `${API_URL}/api/v1/billing/paddle-webhook`;

  const handleCopy = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-[1800px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER SCI-FI STYLING */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-slate-900 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 p-6 md:p-8 border border-indigo-500/30 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-400/20 transition-all duration-700"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-10"></div>
        
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-500/20 border border-indigo-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            <CreditCard size={28} className="text-yellow-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-widest uppercase text-shadow-sm">Configuración Paddle</h2>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="flex items-center gap-1.5 text-[10px] font-black font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 uppercase tracking-widest">
                <ShieldCheck size={10} /> SDK Conectado
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-black font-mono px-2 py-0.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 uppercase tracking-widest">
                <Server size={10} /> Entorno: .ENV
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* PANEL IZQUIERDO: Webhook y Dev Mode */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Tarjeta de Webhook */}
          <div className="bg-white border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                  <Link size={16} className="text-indigo-500" /> Integración de Webhook
                </h3>
                <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wider">URL obligatoria para sincronizar pagos en tiempo real</p>
              </div>
              <Lock size={16} className="text-slate-300" />
            </div>

            <div className="p-6 md:p-8 relative z-10">
              <p className="text-sm font-medium text-slate-600 mb-5 leading-relaxed">
                Para que el backend actualice automáticamente las cuentas de los usuarios a nivel PRO o Executive y llene tu panel de Finanzas, debes configurar la siguiente URL como tu <strong>Default Webhook</strong> en el panel de control de Paddle.
              </p>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 overflow-x-auto">
                  <code className="text-xs font-mono text-indigo-700 font-bold whitespace-nowrap">
                    {webhookUrl}
                  </code>
                </div>
                <button 
                  onClick={handleCopy}
                  className="shrink-0 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest transition-colors shadow-sm"
                >
                  {copied ? <><Check size={14} /> Copiado</> : <><Copy size={14} /> Copiar URL</>}
                </button>
              </div>

              <div className="mt-6 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-sm">
                <Zap size={18} className="shrink-0 mt-0.5 text-amber-600" />
                <div className="text-xs">
                  <strong className="font-black uppercase tracking-widest block mb-1">Clave Secreta Requerida</strong>
                  Asegúrate de copiar tu <code>PADDLE_WEBHOOK_SECRET</code> desde el panel de Paddle y añadirlo al archivo <code>.env</code> de tu backend. Sin este secreto, el servidor rechazará las notificaciones por seguridad.
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* PANEL DERECHO: Tiers */}
        <div className="xl:col-span-1">
          <div className="bg-white border border-slate-200 shadow-sm flex flex-col h-full">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                <ShieldCheck size={16} className="text-indigo-500" /> Niveles (Tiers) Activos
              </h3>
              <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wider">Planes configurados en el sistema</p>
            </div>
            
            <div className="flex-1 p-6 space-y-6">
              
              <div className="group border border-indigo-100 bg-indigo-50/30 p-5 hover:bg-indigo-50 transition-colors relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-1">Estándar</div>
                <h4 className="text-lg font-black text-slate-900 uppercase">Plan PRO</h4>
                <div className="flex items-end gap-3 mt-1">
                  <div>
                    <div className="text-2xl font-black font-mono text-indigo-700 leading-none">$129<span className="text-sm text-slate-500"> MXN/mes</span></div>
                  </div>
                  <div className="border-l border-indigo-200 pl-3">
                    <div className="text-[10px] font-black font-mono text-slate-600 uppercase">Anual:</div>
                    <div className="text-sm font-black font-mono text-indigo-700 leading-none">$799<span className="text-[10px] text-slate-500"> MXN/año</span></div>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 font-bold mt-3 leading-relaxed">Acceso ilimitado a lecciones y práctica de idiomas sin anuncios.</p>
                <div className="mt-4 pt-4 border-t border-indigo-100/50">
                  <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 block mb-1">Identificador del Backend:</span>
                  <code className="text-xs font-mono font-bold text-slate-700">tier: "pro"</code>
                </div>
              </div>

              <div className="group border border-slate-200 p-5 hover:border-slate-300 transition-colors">
                <h4 className="text-lg font-black text-slate-900 uppercase">Titanium Executive</h4>
                <div className="flex items-end gap-3 mt-1">
                  <div>
                    <div className="text-2xl font-black font-mono text-slate-800 leading-none">$249<span className="text-sm text-slate-500"> MXN/mes</span></div>
                  </div>
                  <div className="border-l border-slate-200 pl-3">
                    <div className="text-[10px] font-black font-mono text-slate-400 uppercase">Anual:</div>
                    <div className="text-sm font-black font-mono text-slate-800 leading-none">$1499<span className="text-[10px] text-slate-500"> MXN/año</span></div>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 font-bold mt-2 leading-relaxed">Soporte prioritario 24/7, analíticas detalladas predictivas y acceso anticipado a betas.</p>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Identificador del Backend:</span>
                  <code className="text-xs font-mono font-bold text-slate-700">tier: "executive"</code>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-100 text-center">
                <p className="text-[10px] font-bold text-slate-500 leading-relaxed">
                  Para modificar los precios u ofrecer descuentos, debes hacerlo directamente desde tu panel de Paddle.
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
