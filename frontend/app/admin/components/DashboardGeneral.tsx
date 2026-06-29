"use client";

import { useState, useEffect, useCallback } from 'react';
import { 
  Loader2, Users, Crown, Zap, TrendingUp, Activity, 
  DollarSign, CreditCard, BarChart2, CheckCircle2, 
  Headphones, Database, Globe, Ticket, Gift, LineChart, 
  BookOpen, Target, ShieldAlert, AlertTriangle, RefreshCw
} from 'lucide-react';
import Cookies from 'js-cookie';

const API_URL = process.env.NODE_ENV === 'production' ? 'https://api.onixlingo.onixu.company' : 'http://127.0.0.1:8022';

export default function DashboardGeneral() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchAllRealData = useCallback(async (isRetry = false) => {
    try {
      if (!isRetry) setLoading(true);
      setError(null);

      const token = localStorage.getItem('admin_token') || Cookies.get('access_token');
      if (!token) {
        setError('No se encontró token de sesión. Inicia sesión nuevamente.');
        setLoading(false);
        return;
      }

      const headers = { 'Authorization': `Bearer ${token}` };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(`${API_URL}/api/v1/admin/dashboard-all`, { 
        headers,
        signal: controller.signal 
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        if (res.status === 401) {
          setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
        } else {
          setError(`Error del servidor (${res.status}). Intenta de nuevo.`);
        }
        setLoading(false);
        return;
      }
      
      const allData = await res.json();

      setData({
        total_users: allData.total_users || 0,
        premium_users: allData.premium_users || 0,
        new_users_week: allData.new_users_week || 0,
        active_users_week: allData.active_users_week || 0,
        total_xp: allData.total_xp || 0,
        pro_users: allData.pro_users || 0,
        executive_users: allData.executive_users || 0,
        estimated_mrr: allData.estimated_mrr || 0,
        projected_mrr: allData.projected_mrr || 0,
        expected_growth_percentage: allData.expected_growth_percentage || 0,
        churn_risk_users: allData.churn_risk_users || 0,
        upgrade_candidates: allData.upgrade_candidates || 0,
        total_revenue: allData.total_revenue || 0,
        transactions_count: allData.transactions_count || 0,
        en_learners: allData.en_learners || 0,
        fr_learners: allData.fr_learners || 0,
        zh_learners: allData.zh_learners || 0,
        top_students: allData.top_students || 0,
        total_language_lessons: allData.total_language_lessons || 0,
        chess_lessons: allData.chess_lessons || 0,
        open_tickets: allData.open_tickets || 0,
        total_referrals: allData.total_referrals || 0,
        active_referrals: allData.active_referrals || 0,
        promo_codes: allData.promo_codes || 0,
        beta_codes: allData.beta_codes || 0,
        active_free_users: allData.active_free_users || 0,
      });
      setError(null);

    } catch (e: any) {
      if (e.name === 'AbortError') {
        setError('El servidor tardó demasiado en responder. Verifica que el backend esté corriendo en el puerto 8022.');
      } else {
        setError('No se pudo conectar al backend. Asegúrate de que el servidor esté encendido (puerto 8022).');
      }
      console.error("Error al obtener datos reales:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllRealData();
  }, [fetchAllRealData]);

  // Auto-retry: si hay error, reintentar cada 5 segundos hasta 3 veces
  useEffect(() => {
    if (error && retryCount < 3) {
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        fetchAllRealData(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, retryCount, fetchAllRealData]);

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;
  }

  if (error || !data) {
    return (
      <div className="flex flex-col justify-center items-center h-full gap-4 p-8">
        <AlertTriangle className="text-amber-500" size={48} />
        <p className="text-slate-700 font-semibold text-center max-w-md">{error || 'No se pudieron cargar los datos.'}</p>
        {retryCount < 3 && <p className="text-xs text-slate-400 animate-pulse">Reintentando automáticamente... ({retryCount}/3)</p>}
        <button 
          onClick={() => { setRetryCount(0); fetchAllRealData(); }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors"
        >
          <RefreshCw size={14} /> Reintentar manualmente
        </button>
      </div>
    );
  }


  const s = data;
  const total_learners = s.en_learners + s.fr_learners + s.zh_learners || 1;

  return (
    <div className="relative max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">


      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b-2 border-slate-200/50 pb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-widest">ONIXLINGO PANEL ADMINISTRATIVO</h2>
          <p className="text-sm text-slate-500 mt-1 font-mono">SYS_STATUS: ONLINE | DATA_SOURCE: LIVE_DB_FAST</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
          <div className="w-2 h-2 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)] animate-pulse"></div>
          SYS_ONLINE
        </div>
      </div>

      {/* 1. VISIÓN FINANCIERA & PREDICTIVA (REAL) */}
      <section className="space-y-4">
        <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-widest border-l-4 border-emerald-500 pl-3">
          <DollarSign size={16} className="text-emerald-500"/> Financial Sector
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <MetricCard title="Total Revenue" value={`$${s.total_revenue.toFixed(2)}`} icon={<DollarSign size={16}/>} color="emerald" />
          <MetricCard title="MRR Actual" value={`$${s.estimated_mrr.toFixed(2)}`} icon={<CreditCard size={16}/>} color="emerald" />
          <MetricCard title="MRR Proyectado" value={`$${s.projected_mrr.toFixed(2)}`} icon={<TrendingUp size={16}/>} color="indigo" />
          <MetricCard title="Crecimiento Esp." value={`${s.expected_growth_percentage}%`} icon={<LineChart size={16}/>} color="indigo" />
          <MetricCard title="Riesgo de Churn" value={s.churn_risk_users} icon={<ShieldAlert size={16}/>} color="rose" />
          <MetricCard title="Candidatos VIP" value={s.upgrade_candidates} icon={<Target size={16}/>} color="amber" />
        </div>
      </section>

      {/* 2. CRECIMIENTO Y RETENCIÓN (REAL) */}
      <section className="space-y-4">
        <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-widest border-l-4 border-blue-500 pl-3">
          <Activity size={16} className="text-blue-500"/> User Telemetry
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <MetricCard title="Total Usuarios" value={s.total_users.toLocaleString()} icon={<Users size={16}/>} color="blue" />
          <MetricCard title="Nuevos (7 Días)" value={`+${s.new_users_week}`} icon={<TrendingUp size={16}/>} color="emerald" />
          <MetricCard title="Activos (7 Días)" value={s.active_users_week.toLocaleString()} icon={<Activity size={16}/>} color="sky" />
          <MetricCard title="XP Total Global" value={s.total_xp.toLocaleString()} icon={<Zap size={16}/>} color="amber" />
          <MetricCard title="Transacciones" value={s.transactions_count} icon={<CreditCard size={16}/>} color="slate" />
          <MetricCard title="Alumnos Top" value={s.top_students} icon={<Crown size={16}/>} color="purple" />
        </div>
      </section>

      {/* 3. CONTENIDO, SOPORTE Y MARKETING (REAL) */}
      <section className="space-y-4">
        <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-widest border-l-4 border-slate-700 pl-3">
          <Database size={16} className="text-slate-700"/> Operations Array
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4">
          <MetricCard title="Docs Idioma" value={s.total_language_lessons} icon={<BookOpen size={16}/>} color="blue" />
          <MetricCard title="Docs Ajedrez" value={s.chess_lessons} icon={<Database size={16}/>} color="slate" />
          <MetricCard title="Soporte (Abierto)" value={s.open_tickets} icon={<Headphones size={16}/>} color="rose" />
          <MetricCard title="Ref. Totales" value={s.total_referrals} icon={<Users size={16}/>} color="emerald" />
          <MetricCard title="Ref. Pagados" value={s.active_referrals} icon={<Gift size={16}/>} color="amber" />
          <MetricCard title="Cupones Promo" value={s.promo_codes} icon={<Ticket size={16}/>} color="indigo" />
          <MetricCard title="Cupones Beta" value={s.beta_codes} icon={<Ticket size={16}/>} color="slate" />
          <MetricCard title="Usuarios PRO" value={s.premium_users} icon={<Crown size={16}/>} color="amber" />
        </div>
      </section>
      
      {/* 4. DISTRIBUCIONES (GRÁFICOS REALES SCI-FI) */}
      <section className="space-y-4">
        <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-widest border-l-4 border-purple-500 pl-3">
          <BarChart2 size={16} className="text-purple-500"/> Distribution Nodes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Chart 1: Distribución de Idiomas */}
          <div className="relative bg-white/40 backdrop-blur-xl p-6 border border-white/60 shadow-[4px_4px_0px_0px_rgba(203,213,225,0.6)] transition-all hover:shadow-[8px_8px_0px_0px_rgba(167,139,250,0.6)] hover:-translate-y-1 hover:-translate-x-1 group">
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <h4 className="text-xs font-black text-slate-700 mb-6 flex items-center gap-2 uppercase tracking-widest"><Globe size={14} className="text-blue-500"/> Nodes por Idioma</h4>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-[10px] font-black font-mono text-slate-600 mb-1.5 uppercase"><span>ENG_NODE</span> <span>{((s.en_learners / total_learners) * 100).toFixed(0)}%</span></div>
                <div className="w-full bg-slate-200/50 h-2"><div className="bg-blue-500 h-2 shadow-[0_0_10px_rgba(59,130,246,0.6)]" style={{ width: `${(s.en_learners / total_learners) * 100}%` }}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-black font-mono text-slate-600 mb-1.5 uppercase"><span>FRA_NODE</span> <span>{((s.fr_learners / total_learners) * 100).toFixed(0)}%</span></div>
                <div className="w-full bg-slate-200/50 h-2"><div className="bg-indigo-500 h-2 shadow-[0_0_10px_rgba(99,102,241,0.6)]" style={{ width: `${(s.fr_learners / total_learners) * 100}%` }}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-black font-mono text-slate-600 mb-1.5 uppercase"><span>ZHO_NODE</span> <span>{((s.zh_learners / total_learners) * 100).toFixed(0)}%</span></div>
                <div className="w-full bg-slate-200/50 h-2"><div className="bg-emerald-500 h-2 shadow-[0_0_10px_rgba(16,185,129,0.6)]" style={{ width: `${(s.zh_learners / total_learners) * 100}%` }}></div></div>
              </div>
            </div>
          </div>

          {/* Chart 2: Distribución de Suscripciones */}
          <div className="relative bg-white/40 backdrop-blur-xl p-6 border border-white/60 shadow-[4px_4px_0px_0px_rgba(203,213,225,0.6)] transition-all hover:shadow-[8px_8px_0px_0px_rgba(251,191,36,0.6)] hover:-translate-y-1 hover:-translate-x-1 group">
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <h4 className="text-xs font-black text-slate-700 mb-6 flex items-center gap-2 uppercase tracking-widest"><Crown size={14} className="text-amber-500"/> Subscriptions Status</h4>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-[10px] font-black font-mono text-slate-600 mb-1.5 uppercase"><span>TIER_FREE</span> <span>{s.total_users > 0 ? (((s.total_users - s.premium_users)/s.total_users) * 100).toFixed(0) : 0}%</span></div>
                <div className="w-full bg-slate-200/50 h-2"><div className="bg-slate-400 h-2" style={{ width: `${s.total_users > 0 ? ((s.total_users - s.premium_users)/s.total_users) * 100 : 0}%` }}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-black font-mono text-amber-600 mb-1.5 uppercase"><span>TIER_VIP</span> <span>{s.total_users > 0 ? ((s.pro_users/s.total_users) * 100).toFixed(0) : 0}%</span></div>
                <div className="w-full bg-amber-100/50 h-2"><div className="bg-amber-500 h-2 shadow-[0_0_10px_rgba(245,158,11,0.8)]" style={{ width: `${s.total_users > 0 ? (s.pro_users/s.total_users) * 100 : 0}%` }}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-black font-mono text-slate-800 mb-1.5 uppercase"><span>TIER_EXEC</span> <span>{s.total_users > 0 ? ((s.executive_users/s.total_users) * 100).toFixed(0) : 0}%</span></div>
                <div className="w-full bg-slate-200/50 h-2"><div className="bg-slate-800 h-2 shadow-[0_0_10px_rgba(30,41,59,0.8)]" style={{ width: `${s.total_users > 0 ? (s.executive_users/s.total_users) * 100 : 0}%` }}></div></div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-black font-mono text-emerald-600 mb-1.5 uppercase"><span>FREE_ACTIVE</span> <span>{s.total_users > 0 ? ((s.active_free_users/s.total_users) * 100).toFixed(0) : 0}%</span></div>
                <div className="w-full bg-emerald-100/50 h-2"><div className="bg-emerald-500 h-2 shadow-[0_0_10px_rgba(16,185,129,0.8)]" style={{ width: `${s.total_users > 0 ? (s.active_free_users/s.total_users) * 100 : 0}%` }}></div></div>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

function MetricCard({ title, value, icon, color }: { title: string, value: string|number, icon: any, color: string }) {
  const colorMap: any = {
    blue: 'bg-blue-50/80 border-blue-200 text-blue-600',
    amber: 'bg-amber-50/80 border-amber-200 text-amber-600',
    emerald: 'bg-emerald-50/80 border-emerald-200 text-emerald-600',
    indigo: 'bg-indigo-50/80 border-indigo-200 text-indigo-600',
    rose: 'bg-rose-50/80 border-rose-200 text-rose-600',
    purple: 'bg-purple-50/80 border-purple-200 text-purple-600',
    sky: 'bg-sky-50/80 border-sky-200 text-sky-600',
    slate: 'bg-slate-50/80 border-slate-200 text-slate-600',
  };
  return (
    <div className="relative bg-white/40 backdrop-blur-md border border-white/60 p-4 shadow-[3px_3px_0px_0px_rgba(203,213,225,0.6)] hover:shadow-[6px_6px_0px_0px_rgba(148,163,184,0.5)] hover:-translate-y-1 hover:-translate-x-1 transition-all duration-300 flex flex-col justify-between group overflow-hidden">
      
      {/* Sci-fi corner accents */}
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-slate-400/30"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-slate-400/30"></div>

      <div className="flex justify-between items-start mb-3">
        <div className={`p-2 border ${colorMap[color] || colorMap.slate} group-hover:scale-110 transition-transform duration-300 shadow-inner rounded-none`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-2xl font-black text-slate-800 tracking-tight font-mono">{value}</p>
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1 line-clamp-1">{title}</p>
      </div>
    </div>
  );
}