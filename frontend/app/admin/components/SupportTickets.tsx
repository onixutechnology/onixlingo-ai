"use client";

import React, { useState, useEffect } from 'react';
import { LifeBuoy, Loader2, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

const URL = process.env.NODE_ENV === 'production' ? 'https://api.onixlingo.onixu.company' : 'http://127.0.0.1:8022';

export default function SupportTickets() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${URL}/api/v1/admin/support-tickets`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setTickets(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`${URL}/api/v1/admin/support-tickets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchTickets();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1800px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-slate-900 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 p-6 md:p-8 border border-indigo-500/30 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-400/20 transition-all duration-700"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-10"></div>
        
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-500/20 border border-indigo-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            <LifeBuoy size={28} className="text-indigo-300" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-widest uppercase text-shadow-sm">Tickets de Soporte</h2>
            <p className="text-xs text-indigo-200/70 mt-1 font-mono uppercase tracking-widest">Atención al Alumno</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {tickets.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 shadow-sm">
            <MessageSquare size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">No hay tickets de soporte pendientes.</p>
          </div>
        ) : (
          tickets.map((t) => (
            <div key={t.id} className="bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row">
              <div className={`w-2 md:w-3 shrink-0 ${t.priority === 'high' ? 'bg-red-500' : 'bg-indigo-500'}`}></div>
              <div className="p-6 flex-1 flex flex-col lg:flex-row gap-6">
                
                {/* INFO CONTENT */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-wider rounded border ${
                      t.status === 'open' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                      t.status === 'resolved' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                      'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {t.status === 'open' ? 'Abierto' : t.status === 'resolved' ? 'Resuelto' : 'Cerrado'}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                      TICKET #{t.id} • {new Date(t.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-black text-slate-800">{t.subject}</h3>
                  <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-md border border-slate-100 whitespace-pre-wrap font-medium">
                    {t.message}
                  </p>
                  
                  <div className="text-xs font-mono text-slate-500 mt-2">
                    Usuario: <span className="font-bold text-indigo-600">{t.user_email}</span>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="w-full lg:w-48 shrink-0 flex flex-col gap-2 justify-center border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
                  {t.status !== 'resolved' && (
                    <button 
                      onClick={() => updateStatus(t.id, 'resolved')}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-500 text-white text-xs font-black uppercase tracking-wider hover:bg-emerald-600 transition-colors shadow-sm"
                    >
                      <CheckCircle2 size={16} /> Resolver
                    </button>
                  )}
                  {t.status !== 'closed' && (
                    <button 
                      onClick={() => updateStatus(t.id, 'closed')}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-wider hover:bg-slate-200 transition-colors"
                    >
                      Cerrar Ticket
                    </button>
                  )}
                  {t.status !== 'open' && (
                    <button 
                      onClick={() => updateStatus(t.id, 'open')}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-100 text-amber-700 text-xs font-black uppercase tracking-wider hover:bg-amber-200 transition-colors"
                    >
                      Reabrir
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
