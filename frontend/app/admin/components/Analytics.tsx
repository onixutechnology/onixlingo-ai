"use client";

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, TrendingUp, Users, Languages, 
  Target, Zap, Clock, Loader2, AlertTriangle, ShieldCheck
} from 'lucide-react';
import Cookies from 'js-cookie';

const API_URL = process.env.NODE_ENV === 'production' ? 'https://api.onixlingo.onixu.company' : 'http://127.0.0.1:8022';

interface GrowthData {
  date: string;
  new_users: number;
}

interface AnalyticsData {
  growth: GrowthData[];
  languages: { en: number; fr: number; zh: number };
  tiers: { free?: number; pro?: number; executive?: number };
  engagement: { avg_eloquence: number; avg_streak: number };
  total_users: number;
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('admin_token') || Cookies.get('access_token');
        if (!token) throw new Error("No hay token de sesión. Vuelve a iniciar sesión.");

        const res = await fetch(`${API_URL}/api/v1/admin/analytics`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!res.ok) throw new Error("Error al obtener los datos de analíticas.");
        
        const jsonData = await res.json();
        setData(jsonData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 text-slate-400">
        <Loader2 size={40} className="animate-spin text-indigo-500 mb-4" />
        <p className="font-mono text-xs font-black uppercase tracking-widest">Calculando Vectores de Datos...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full flex items-center justify-center py-24 text-rose-500">
        <AlertTriangle size={40} className="mb-4" />
        <p className="font-mono text-xs font-black uppercase tracking-widest">{error}</p>
      </div>
    );
  }

  // Cálculos para gráficos
  const maxGrowth = Math.max(...data.growth.map(d => d.new_users), 1);
  const totalLang = (data.languages.en || 0) + (data.languages.fr || 0) + (data.languages.zh || 0) || 1;
  const enPct = ((data.languages.en || 0) / totalLang) * 100;
  const frPct = ((data.languages.fr || 0) / totalLang) * 100;
  const zhPct = ((data.languages.zh || 0) / totalLang) * 100;

  return (
    <div className="w-full max-w-[1800px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER SCI-FI STYLING */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-slate-900 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 p-6 md:p-8 border border-indigo-500/30 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-400/20 transition-all duration-700"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-10"></div>
        
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-500/20 border border-indigo-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            <BarChart3 size={28} className="text-cyan-400" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-widest uppercase text-shadow-sm">Analíticas y Reportes</h2>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="flex items-center gap-1.5 text-[10px] font-black font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 uppercase tracking-widest">
                <ShieldCheck size={10} /> Sistema Online
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-black font-mono px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/50 uppercase tracking-widest">
                <TrendingUp size={10} /> Data en Tiempo Real
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* PANEL IZQUIERDO: Growth Chart */}
        <div className="xl:col-span-2 space-y-6">
          
          <div className="bg-white border border-slate-200 shadow-sm relative overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                  <Users size={16} className="text-indigo-500" /> Crecimiento de Usuarios
                </h3>
                <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wider">Adquisición en los últimos 7 días</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black font-mono text-indigo-600 leading-none">{data.total_users}</div>
                <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">Usuarios Totales Históricos</div>
              </div>
            </div>

            <div className="flex-1 p-6 md:p-8 flex items-end justify-between gap-2 h-[300px] mt-4">
              {data.growth.map((day, idx) => {
                const heightPct = Math.max((day.new_users / maxGrowth) * 100, 5);
                return (
                  <div key={idx} className="flex flex-col items-center gap-3 flex-1 group">
                    <div className="text-xs font-black font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity -mb-1">
                      {day.new_users}
                    </div>
                    <div className="w-full max-w-[40px] bg-slate-100 rounded-t-sm relative flex flex-col justify-end h-full">
                      <div 
                        className="w-full bg-gradient-to-t from-indigo-600 to-cyan-400 rounded-t-sm transition-all duration-1000 ease-out group-hover:from-indigo-500 group-hover:to-cyan-300 shadow-[0_0_15px_rgba(79,70,229,0.2)]"
                        style={{ height: `${heightPct}%` }}
                      ></div>
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 text-center">
                      {day.date}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
        </div>

        {/* PANEL DERECHO: Métricas de Idioma y Engagement */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* Idiomas */}
          <div className="bg-white border border-slate-200 shadow-sm">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                <Languages size={16} className="text-indigo-500" /> Distribución de Idiomas
              </h3>
              <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wider">Demografía de estudio actual</p>
            </div>
            <div className="p-6 space-y-5">
              
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-700">Inglés</span>
                  <span className="text-xs font-black font-mono text-slate-900">{enPct.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: `${enPct}%` }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-700">Francés</span>
                  <span className="text-xs font-black font-mono text-slate-900">{frPct.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500" style={{ width: `${frPct}%` }}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-700">Chino Mandarín</span>
                  <span className="text-xs font-black font-mono text-slate-900">{zhPct.toFixed(1)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${zhPct}%` }}></div>
                </div>
              </div>

            </div>
          </div>

          {/* Engagement */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 text-white p-5 border border-slate-800 shadow-sm relative overflow-hidden group">
              <Zap size={24} className="text-yellow-400 mb-3 opacity-80 group-hover:scale-110 transition-transform" />
              <div className="text-2xl font-black font-mono mb-1">{data.engagement.avg_eloquence}</div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Elocuencia Promedio</p>
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-yellow-400/5 blur-xl rounded-full"></div>
            </div>
            
            <div className="bg-slate-900 text-white p-5 border border-slate-800 shadow-sm relative overflow-hidden group">
              <Target size={24} className="text-emerald-400 mb-3 opacity-80 group-hover:scale-110 transition-transform" />
              <div className="text-2xl font-black font-mono mb-1">{data.engagement.avg_streak}</div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Días de Racha Promedio</p>
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-400/5 blur-xl rounded-full"></div>
            </div>
          </div>

          {/* Resumen de Tiers */}
          <div className="bg-indigo-50 border border-indigo-100 p-5 shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-800 mb-4 flex items-center gap-2">
              <Clock size={14} /> Penetración de Suscripción
            </h3>
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <div className="text-xl font-black font-mono text-indigo-900">{data.tiers.pro || 0}</div>
                <div className="text-[8px] font-black uppercase tracking-widest text-indigo-500 mt-1">Plan Pro</div>
              </div>
              <div className="w-[1px] h-8 bg-indigo-200"></div>
              <div className="flex-1">
                <div className="text-xl font-black font-mono text-indigo-900">{data.tiers.executive || 0}</div>
                <div className="text-[8px] font-black uppercase tracking-widest text-indigo-500 mt-1">Executive</div>
              </div>
              <div className="w-[1px] h-8 bg-indigo-200"></div>
              <div className="flex-1">
                <div className="text-xl font-black font-mono text-slate-500">{data.tiers.free || 0}</div>
                <div className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1">Gratuitos</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
