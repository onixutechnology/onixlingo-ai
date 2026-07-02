"use client";

import React, { useState, useEffect } from 'react';
import { Tag, Loader2, Plus, Gift, KeySquare, CheckCircle2 } from 'lucide-react';

const URL = process.env.NODE_ENV === 'production' ? 'https://api.onixlingo.onixu.company' : 'http://127.0.0.1:8022';

export default function Marketing() {
  const [stats, setStats] = useState<any>({ promo_codes: [], beta_codes: [] });
  const [loading, setLoading] = useState(true);
  const [generatingPromo, setGeneratingPromo] = useState(false);
  const [generatingBeta, setGeneratingBeta] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${URL}/api/v1/admin/marketing-stats`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setStats(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateCode = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const createPromoCode = async () => {
    const code = `PROMO-${generateCode(6)}`;
    try {
      setGeneratingPromo(true);
      const res = await fetch(`${URL}/api/v1/admin/promo-codes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ code })
      });
      if (res.ok) {
        alert(`Cupón creado: ${code}`);
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingPromo(false);
    }
  };

  const createBetaCode = async () => {
    const code = `BETA-${generateCode(8)}`;
    try {
      setGeneratingBeta(true);
      const res = await fetch(`${URL}/api/v1/admin/beta-codes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ code })
      });
      if (res.ok) {
        alert(`Código Beta creado: ${code}`);
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingBeta(false);
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
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-slate-900 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 p-6 md:p-8 border border-[#1d4ed8]  relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-400/20 transition-all duration-700"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-10"></div>
        
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-500/20 border border-[#1d4ed8]/50 flex items-center justify-center ">
            <Tag size={28} className="text-indigo-300" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-widest uppercase text-">Marketing y Promos</h2>
            <p className="text-xs text-indigo-200/70 mt-1 font-mono uppercase tracking-widest">Generador de Cupones y Códigos Beta</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* PROMO CODES */}
        <div className="bg-white border border-[#1d4ed8]  flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded text-indigo-600"><Gift size={20} /></div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Cupones Promocionales</h3>
            </div>
            <button 
              onClick={createPromoCode}
              disabled={generatingPromo}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-black uppercase tracking-wider hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {generatingPromo ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Generar Cupón
            </button>
          </div>
          <div className="p-0 overflow-y-auto max-h-[500px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-[#1d4ed8] text-[10px] uppercase tracking-widest text-slate-500 sticky top-0">
                  <th className="p-4 font-black">Código</th>
                  <th className="p-4 font-black text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {stats.promo_codes.length === 0 && (
                  <tr><td colSpan={2} className="p-8 text-center text-slate-400 font-medium">No hay cupones.</td></tr>
                )}
                {stats.promo_codes.map((p: any) => (
                  <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-800 text-xs">{p.code}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-black uppercase tracking-wide border ${
                        p.is_used ? 'bg-slate-100 text-slate-500 border-[#1d4ed8]' : 'bg-emerald-100 text-emerald-800 border-[#1d4ed8]'
                      }`}>
                        {p.is_used ? 'Usado' : 'Disponible'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BETA CODES */}
        <div className="bg-white border border-[#1d4ed8]  flex flex-col">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-2 rounded text-amber-600"><KeySquare size={20} /></div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">Códigos Beta (Executive)</h3>
            </div>
            <button 
              onClick={createBetaCode}
              disabled={generatingBeta}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white text-xs font-black uppercase tracking-wider hover:bg-amber-600 transition-colors disabled:opacity-50"
            >
              {generatingBeta ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Generar Beta
            </button>
          </div>
          <div className="p-0 overflow-y-auto max-h-[500px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-[#1d4ed8] text-[10px] uppercase tracking-widest text-slate-500 sticky top-0">
                  <th className="p-4 font-black">Código</th>
                  <th className="p-4 font-black text-center">Estado</th>
                  <th className="p-4 font-black">Usado Por</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {stats.beta_codes.length === 0 && (
                  <tr><td colSpan={3} className="p-8 text-center text-slate-400 font-medium">No hay códigos beta.</td></tr>
                )}
                {stats.beta_codes.map((b: any) => (
                  <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-800 text-xs">{b.code}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-black uppercase tracking-wide border ${
                        b.is_used ? 'bg-slate-100 text-slate-500 border-[#1d4ed8]' : 'bg-amber-100 text-amber-800 border-[#1d4ed8]'
                      }`}>
                        {b.is_used ? 'Usado' : 'Disponible'}
                      </span>
                    </td>
                    <td className="p-4 text-xs font-mono text-slate-500 truncate max-w-[120px]">
                      {b.used_by_email || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
