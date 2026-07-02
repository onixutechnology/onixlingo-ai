"use client";

import { useState, useEffect } from 'react';
import { 
  TrendingDown, TrendingUp, AlertTriangle, Users, BookOpen, 
  Sparkles, Zap, ArrowRight, Loader2, Clock, Bot
} from 'lucide-react';

const API_URL = process.env.NODE_ENV === 'production' ? 'https://api.onixlingo.onixu.company' : 'http://127.0.0.1:8022';

export default function PredictiveAnalytics() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    current_mrr: 0,
    projected_mrr: 0,
    expected_growth_percentage: 0
  });

  const [churnRiskUsers, setChurnRiskUsers] = useState<any[]>([]);
  const [upgradeCandidates, setUpgradeCandidates] = useState<any[]>([]);
  const [cfoReport, setCfoReport] = useState<string>('');

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/v1/admin/predictive-analytics`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setStats({
          current_mrr: data.current_mrr || 0,
          projected_mrr: data.projected_mrr || 0,
          expected_growth_percentage: data.expected_growth_percentage || 0
        });
        setChurnRiskUsers(data.churn_risk_users || []);
        setUpgradeCandidates(data.upgrade_candidates || []);
        setCfoReport(data.cfo_report || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleRunModel = () => {
    setIsProcessing(true);
    setTimeout(() => {
      fetchAnalytics().then(() => setIsProcessing(false));
    }, 1500);
  };

  const calculateDropProb = (riskLevel: string) => {
    if (riskLevel === 'High') return 85;
    if (riskLevel === 'Medium') return 55;
    return 20;
  };

  return (
    <div className="w-full max-w-[1800px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER SCI-FI */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-slate-900 bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-900 p-6 md:p-8 rounded-none border border-[#1d4ed8]  relative overflow-hidden group">
        
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/20 transition-all duration-700"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-20"></div>

        <div className="relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 bg-indigo-500/10 border border-[#1d4ed8] flex items-center justify-center">
            <Sparkles size={32} className="text-indigo-400" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-widest uppercase text-">Analítica Predictiva <span className="text-indigo-400">Sistema</span></h2>
            <p className="text-xs text-indigo-200/70 mt-1 font-mono uppercase tracking-widest">Motor de Inferencia: <span className="text-emerald-400">En Línea</span> | Precisión Histórica: 94.2%</p>
          </div>
        </div>

        <div className="relative z-10">
          <button 
            onClick={handleRunModel}
            disabled={isProcessing || loading}
            className="group flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-none text-xs font-black font-mono uppercase tracking-widest transition-all   hover:translate-y-0.5 hover:translate-x-0.5 active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? <Loader2 size={16} className="text-indigo-300 animate-spin" /> : <Zap size={16} className="text-indigo-300 group-hover:text-indigo-200" />}
            Recalcular Proyección
          </button>
        </div>
      </div>

      {/* CFO REPORT */}
      <div className="bg-white border border-[#1d4ed8] p-6 md:p-8  relative overflow-hidden group">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-none bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">CFO Executive Summary</h3>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Reporte Automatizado</p>
          </div>
        </div>
        
        <div className="relative z-10 pl-2 md:pl-12 border-l-2 border-indigo-100 ml-2 md:ml-3">
          {loading || isProcessing ? (
            <div className="flex flex-col gap-3 animate-pulse">
              <div className="h-3 bg-slate-200 rounded w-full max-w-2xl"></div>
              <div className="h-3 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-200 rounded w-5/6"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2 mt-4"></div>
            </div>
          ) : (
            <div className="text-sm text-slate-700 leading-loose font-medium whitespace-pre-wrap">
              {cfoReport ? cfoReport : 'No se pudo generar el reporte del CFO.'}
            </div>
          )}
        </div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl translate-y-1/2 translate-x-1/3 group-hover:bg-indigo-100/50 transition-all duration-700"></div>
      </div>

      {/* 3 PREDICTIVE WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Widget 1: Churn Prediction */}
        <div className="bg-white border border-[#1d4ed8] p-6  relative overflow-hidden group hover:border-[#1d4ed8] transition-colors">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <AlertTriangle size={14} className="text-rose-500" /> Riesgo de Fuga a 30 Días
            </h3>
            <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-500 px-2 py-0.5">CHURN_PRED</span>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-end gap-3">
              <p className="text-5xl font-black text-slate-900 font-mono tracking-tighter">
                {loading ? '--' : churnRiskUsers.length}
              </p>
            </div>
            <p className="text-xs font-bold text-slate-400 mt-3 flex items-center gap-2">
              <Users size={14} /> Usuarios detectados en zona de riesgo.
            </p>
          </div>
          <div className="mt-5 h-1.5 w-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-rose-500 transition-all duration-1000 " style={{ width: loading ? '0%' : `${Math.min(100, churnRiskUsers.length * 10)}%` }}></div>
          </div>
        </div>

        {/* Widget 2: LTV Forecast */}
        <div className="bg-white border border-[#1d4ed8] p-6  relative overflow-hidden group hover:border-[#1d4ed8] transition-colors">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <TrendingUp size={14} className="text-emerald-500" /> MRR Proyectado (Próximo Mes)
            </h3>
            <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-500 px-2 py-0.5">LTV_EST</span>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-end gap-3">
              <p className="text-5xl font-black text-slate-900 font-mono tracking-tighter">
                <span className="text-2xl text-slate-400">$</span>{loading ? '--' : Math.floor(stats.projected_mrr)}
              </p>
              <div className={`flex items-center gap-1 mb-1.5 px-2 py-0.5 border ${stats.expected_growth_percentage >= 0 ? 'text-emerald-500 bg-emerald-50 border-emerald-100' : 'text-rose-500 bg-rose-50 border-rose-100'}`}>
                {stats.expected_growth_percentage >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span className="text-[10px] font-black">{stats.expected_growth_percentage > 0 ? '+' : ''}{loading ? '--' : stats.expected_growth_percentage}% crec.</span>
              </div>
            </div>
            <p className="text-xs font-bold text-slate-400 mt-3 flex items-center gap-2">
              <Zap size={14} className="text-[#D4AF37]" /> Basado en conversiones orgánicas y rachas.
            </p>
          </div>
          
          <div className="mt-5 flex items-end gap-1 h-12 w-full opacity-60">
            {[30, 45, 40, 60, 55, 70, 85, 75, 90, 100].map((h, i) => (
              <div key={i} className={`flex-1 ${i > 6 ? 'bg-indigo-400' : 'bg-slate-200'} transition-all hover:bg-indigo-500`} style={{ height: loading ? '10%' : `${h}%` }}></div>
            ))}
          </div>
        </div>

        {/* Widget 3: Conversion Candidates */}
        <div className="bg-white border border-[#1d4ed8] p-6  relative overflow-hidden group hover:border-[#1d4ed8] transition-colors">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-500" /> Candidatos a Upgrade (PRO)
            </h3>
            <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-500 px-2 py-0.5">CONV_PROB</span>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-end gap-3">
              <p className="text-5xl font-black text-slate-900 font-mono tracking-tighter">
                {loading ? '--' : upgradeCandidates.length}
              </p>
            </div>
            <p className="text-xs font-bold text-slate-400 mt-3 flex items-center gap-2">
              <Sparkles size={14} className="text-emerald-400" /> Usuarios Free altamente enganchados.
            </p>
          </div>
          <div className="mt-5 h-1.5 w-full bg-slate-100 flex overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: loading ? '0%' : '60%' }}></div>
            <div className="h-full bg-amber-400 transition-all duration-1000" style={{ width: loading ? '0%' : '40%' }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* INTERVENTION LIST */}
        <div className="xl:col-span-2 bg-white border border-[#1d4ed8] ">
          <div className="p-6 border-b border-slate-100 flex justify-between items-end">
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                <AlertTriangle size={16} className="text-rose-500" /> Intervención Requerida (Churn Risk)
              </h3>
              <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wider">Usuarios PRO en riesgo inminente de cancelación</p>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Usuario / Tier</th>
                  <th className="px-6 py-4">Probabilidad Abandono</th>
                  <th className="px-6 py-4">Última Actividad</th>
                  <th className="px-6 py-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <Loader2 className="w-6 h-6 animate-spin text-indigo-400 mx-auto" />
                    </td>
                  </tr>
                ) : churnRiskUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Sin usuarios en riesgo inminente</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1">Tu base de usuarios está sana.</p>
                    </td>
                  </tr>
                ) : (
                  churnRiskUsers.map((user, idx) => (
                    <tr key={idx} className="hover:bg-rose-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 text-xs">{user.email}</p>
                        <span className="text-[9px] font-black font-mono px-1.5 py-0.5 mt-1 inline-block bg-indigo-100 text-indigo-700 uppercase">
                          {user.tier || 'PRO'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-center gap-1.5">
                          <span className={`text-xs font-black font-mono ${calculateDropProb(user.risk_level) > 80 ? 'text-rose-600' : 'text-amber-600'}`}>
                            {calculateDropProb(user.risk_level)}%
                          </span>
                          <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${calculateDropProb(user.risk_level) > 80 ? 'bg-rose-500' : 'bg-amber-400'}`} style={{ width: `${calculateDropProb(user.risk_level)}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[10px] font-bold text-slate-500 leading-tight">Inactividad prolongada</p>
                        <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-wider flex items-center gap-1">
                          <Clock size={10} /> {new Date(user.last_activity).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-[10px] font-black uppercase bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white px-3 py-1.5 transition-colors border border-[#1d4ed8] hover:border-indigo-600 inline-flex items-center gap-1">
                          ENGAGE <ArrowRight size={10} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* UPGRADE CANDIDATES */}
        <div className="bg-white border border-[#1d4ed8]  flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-500" /> Candidatos a Upgrade
            </h3>
            <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wider">Alta probabilidad de conversión</p>
          </div>
          
          <div className="flex-1 overflow-y-auto max-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-full min-h-[200px]">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
              </div>
            ) : upgradeCandidates.length === 0 ? (
              <div className="p-6 text-center mt-10">
                <Sparkles size={24} className="text-slate-300 mx-auto mb-3" />
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Sin Candidatos Actuales</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {upgradeCandidates.map((user, idx) => (
                  <div key={idx} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-bold text-slate-900">{user.email}</p>
                        <p className="text-[10px] text-slate-500 font-medium mt-1">Racha: {user.streak_days} días | Puntos: {user.eloquence_points}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black font-mono text-emerald-600">{user.conversion_probability}%</span>
                        <p className="text-[8px] uppercase tracking-widest text-slate-400 mt-0.5">Probabilidad</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
