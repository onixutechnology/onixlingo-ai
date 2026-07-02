"use client";



import { useState, useEffect } from 'react';
import { Loader2, Share2, Users, Crown, Gift, CheckCircle } from 'lucide-react';
import Cookies from 'js-cookie';

const API_URL = process.env.NODE_ENV === 'production' ? 'https://api.onixlingo.onixu.company' : 'http://127.0.0.1:8022';

interface Ambassador {
  id: number;
  email: string;
  referral_code: string;
  total_referred: number;
  pending_rewards: number;
}

interface AffiliatesStats {
  total_referrals: number;
  active_referrals: number;
  top_ambassadors: Ambassador[];
}

export default function AffiliatesManagement() {
  const [stats, setStats] = useState<AffiliatesStats | null>(null);
  const [isRewarding, setIsRewarding] = useState<number | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('admin_token') || Cookies.get('access_token');
      if (!token) return;
      const res = await fetch(`${API_URL}/api/v1/admin/affiliates`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {}
  };

  const handleReward = async (userId: number) => {
    setIsRewarding(userId);
    try {
      const token = localStorage.getItem('admin_token') || Cookies.get('access_token');
      const res = await fetch(`${API_URL}/api/v1/admin/affiliates/${userId}/reward`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchStats();
        alert("¡Recompensa entregada exitosamente!");
      } else {
        const err = await res.json();
        alert(err.detail || "Error al entregar recompensa");
      }
    } catch (e) {
      alert("Error de conexión");
    } finally {
      setIsRewarding(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Red de Afiliados y Embajadores</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Gestión del crecimiento orgánico y recompensas para referidores destacados.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 bg-slate-100 px-3 py-1.5 border border-[#1d4ed8]">
            Programa de Referidos V1.0
          </span>
        </div>
      </div>

      {!stats ? (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
          <Loader2 className="animate-spin text-[#D4AF37]" size={40} />
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Analizando red de contactos...</p>
        </div>
      ) : (
        <>
          {/* Tarjetas de Métricas Corporativas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#1d4ed8] p-6   transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <Share2 size={64} />
              </div>
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="p-2 bg-indigo-50 border border-indigo-100 text-indigo-600 ">
                  <Share2 size={20} />
                </div>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Adquisición Total</h3>
              </div>
              <div className="relative z-10">
                <p className="text-4xl font-black text-slate-900 font-mono tracking-tighter">{stats.total_referrals}</p>
                <p className="text-[11px] font-bold text-slate-400 mt-1">Usuarios registrados vía enlace</p>
              </div>
            </div>
            
            <div className="bg-white border border-[#1d4ed8] p-6   transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <Users size={64} />
              </div>
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="p-2 bg-emerald-50 border border-emerald-100 text-emerald-600 ">
                  <Users size={20} />
                </div>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Conversión Efectiva</h3>
              </div>
              <div className="relative z-10">
                <p className="text-4xl font-black text-slate-900 font-mono tracking-tighter">{stats.active_referrals}</p>
                <p className="text-[11px] font-bold text-slate-400 mt-1">Recompensas aprobadas y entregadas</p>
              </div>
            </div>
            
            <div className="bg-white border border-[#1d4ed8] p-6   transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                <Crown size={64} />
              </div>
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="p-2 bg-amber-50 border border-amber-100 text-amber-600 ">
                  <Crown size={20} />
                </div>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Líderes de Red</h3>
              </div>
              <div className="relative z-10">
                <p className="text-4xl font-black text-slate-900 font-mono tracking-tighter">{stats.top_ambassadors.length}</p>
                <p className="text-[11px] font-bold text-slate-400 mt-1">Embajadores activos registrados</p>
              </div>
            </div>
          </div>

          {/* Tabla de Ranking y Gestión */}
          <div className="bg-white border border-[#1d4ed8]  overflow-hidden flex flex-col">
            <div className="p-6 border-b border-[#1d4ed8] bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Gift className="text-[#D4AF37]" size={24} />
                <div>
                  <h3 className="text-sm font-black tracking-widest uppercase text-slate-900">Directorio de Embajadores</h3>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Autorización de recompensas pendiente</p>
                </div>
              </div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Sincronizado
              </div>
            </div>
            
            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white text-slate-400 text-[9px] font-black uppercase tracking-widest sticky top-0 border-b-2 border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Socio Estratégico</th>
                    <th className="px-6 py-4">Código Referido</th>
                    <th className="px-6 py-4 text-center">Volumen</th>
                    <th className="px-6 py-4 text-center">Estado de Liquidación</th>
                    <th className="px-6 py-4 text-right">Autorización</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {stats.top_ambassadors.map((ambassador) => (
                    <tr key={ambassador.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900 text-xs">{ambassador.email}</p>
                        <p className="text-slate-400 text-[10px] font-mono mt-0.5 tracking-wider">ID: #{String(ambassador.id).padStart(4, '0')}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 bg-slate-100 border border-[#1d4ed8] text-slate-600 font-mono text-[10px] font-black tracking-widest">
                          {ambassador.referral_code}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center min-w-[32px] h-8 px-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-black text-xs">
                          {ambassador.total_referred}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {ambassador.pending_rewards > 0 ? (
                          <div className="flex flex-col items-center">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-[#1d4ed8]">
                              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
                              {ambassador.pending_rewards} Pendientes
                            </span>
                            <span className="text-[9px] text-slate-400 mt-1 font-bold">+ {ambassador.pending_rewards * 7} días PRO a liberar</span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-[#1d4ed8]">
                            <CheckCircle size={12} /> Liquidado
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleReward(ambassador.id)}
                          disabled={ambassador.pending_rewards === 0 || isRewarding === ambassador.id}
                          className="text-[10px] font-black tracking-widest uppercase px-4 py-2.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-[#D4AF37] hover:bg-[#b0902a] text-white flex items-center gap-2 ml-auto "
                        >
                          {isRewarding === ambassador.id ? <Loader2 size={12} className="animate-spin" /> : <Gift size={12} />}
                          Aprobar Premio
                        </button>
                      </td>
                    </tr>
                  ))}
                  {stats.top_ambassadors.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-16 text-center text-slate-500">
                        <div className="flex flex-col items-center gap-3">
                          <Users size={32} className="text-slate-300" />
                          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Sin registros de embajadores</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
