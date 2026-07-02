"use client";

import { useState, useEffect } from 'react';
import { 
  Send, Calendar, Clock, BarChart2, BellRing, UserCheck, 
  Settings2, Plus, ArrowUpRight, CheckCircle2, Search, Mail, Loader2
} from 'lucide-react';

const API_URL = process.env.NODE_ENV === 'production' ? 'https://api.onixlingo.onixu.company' : 'http://127.0.0.1:8022';

export default function MessagingCenter() {
  const [activeTab, setActiveTab] = useState<'create' | 'scheduled' | 'history'>('scheduled');
  
  const [scheduledMails, setScheduledMails] = useState<any[]>([]);
  const [historyMails, setHistoryMails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [targetAudience, setTargetAudience] = useState('Todos los usuarios');
  const [body, setBody] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledAt, setScheduledAt] = useState('');

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/v1/admin/campaigns`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setScheduledMails(data.filter((c: any) => c.status === 'pending' || c.is_scheduled));
        setHistoryMails(data.filter((c: any) => c.status === 'sent' || c.status === 'completed' || !c.is_scheduled));
      }
    } catch (err) {
      console.error("Error fetching campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCreateCampaign = async () => {
    if (!title || !body) return alert("Completa todos los campos");
    
    try {
      setSubmitting(true);
      const res = await fetch(`${API_URL}/api/v1/admin/campaigns/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title,
          body,
          target_audience: targetAudience,
          campaign_type: "email_push",
          is_scheduled: isScheduled,
          scheduled_at: isScheduled ? scheduledAt : null,
          frequency: "once"
        })
      });

      if (res.ok) {
        alert("Campaña guardada y/o enviada con éxito.");
        setTitle('');
        setBody('');
        setScheduledAt('');
        fetchCampaigns();
        setActiveTab(isScheduled ? 'scheduled' : 'history');
      } else {
        alert("Error al procesar la campaña.");
      }
    } catch (err) {
      console.error(err);
      alert("Error de red");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCampaign = async (id: number) => {
    if (!confirm("¿Seguro que deseas cancelar esta campaña programada?")) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/admin/campaigns/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.ok) {
        fetchCampaigns();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-[1800px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER SCI-FI STYLING */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-slate-900 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 p-6 md:p-8 border border-[#1d4ed8]  relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-400/20 transition-all duration-700"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-10"></div>
        
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-500/20 border border-[#1d4ed8]/50 flex items-center justify-center ">
            <BellRing size={28} className="text-indigo-300" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-widest uppercase text-">Centro de Mensajería</h2>
            <p className="text-xs text-indigo-200/70 mt-1 font-mono uppercase tracking-widest">Motor de Notificaciones Push & Email</p>
          </div>
        </div>

        <div className="relative z-10">
          <button 
            onClick={() => setActiveTab('create')}
            className="flex items-center gap-3 px-6 py-3 bg-white text-slate-900 rounded-none text-xs font-black font-mono uppercase tracking-widest transition-all   hover:translate-y-0.5 hover:translate-x-0.5 active:scale-95"
          >
            <Plus size={16} className="text-indigo-600" />
            Nueva Campaña
          </button>
        </div>
      </div>

      {/* KPIS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#1d4ed8] p-6 flex items-center gap-5">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-full">
            <BarChart2 size={24} />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Tasa de Apertura</p>
            <h3 className="text-3xl font-black text-slate-800 font-mono mt-1">
              {loading ? <Loader2 className="animate-spin w-6 h-6 text-slate-300" /> : '0.0%'}
            </h3>
          </div>
        </div>
        <div className="bg-white border border-[#1d4ed8] p-6 flex items-center gap-5">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Receptores Mensuales</p>
            <h3 className="text-3xl font-black text-slate-800 font-mono mt-1">
              {loading ? <Loader2 className="animate-spin w-6 h-6 text-slate-300" /> : '0'}
            </h3>
          </div>
        </div>
        <div className="bg-white border border-[#1d4ed8] p-6 flex items-center gap-5">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-full">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Envíos en Cola (CRON)</p>
            <h3 className="text-3xl font-black text-slate-800 font-mono mt-1">
              {loading ? <Loader2 className="animate-spin w-6 h-6 text-slate-300" /> : scheduledMails.length}
            </h3>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="bg-white border border-[#1d4ed8]  mt-6 min-h-[400px]">
        {/* TABS */}
        <div className="flex border-b border-slate-100 bg-slate-50/50">
          <button 
            onClick={() => setActiveTab('scheduled')}
            className={`px-8 py-4 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors ${activeTab === 'scheduled' ? 'border-b-2 border-indigo-600 text-indigo-700 bg-white' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Calendar size={14} /> Envíos Programados
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-8 py-4 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors ${activeTab === 'history' ? 'border-b-2 border-indigo-600 text-indigo-700 bg-white' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Settings2 size={14} /> Historial
          </button>
          <button 
            onClick={() => setActiveTab('create')}
            className={`px-8 py-4 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-colors ${activeTab === 'create' ? 'border-b-2 border-indigo-600 text-indigo-700 bg-white' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Mail size={14} /> Redactar
          </button>
        </div>

        {/* TAB CONTENT: SCHEDULED */}
        {activeTab === 'scheduled' && (
          <div className="p-0 animate-in fade-in duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                  <Calendar size={16} className="text-indigo-500" /> Cola de Envíos
                </h3>
                <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wider">Campañas esperando fecha de ejecución</p>
              </div>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-y border-slate-100">
                    <tr>
                      <th className="px-6 py-3">ID / Título</th>
                      <th className="px-6 py-3">Segmento</th>
                      <th className="px-6 py-3">Fecha de Envío</th>
                      <th className="px-6 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {scheduledMails.map((mail, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900 text-xs">{mail.title}</p>
                          <span className="text-[9px] font-black font-mono px-1.5 py-0.5 mt-1 inline-block bg-slate-100 text-slate-500">C-{mail.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full">{mail.target_audience}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <Calendar size={12} className="text-slate-400"/> {mail.scheduled_at ? new Date(mail.scheduled_at).toLocaleDateString() : '-'}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1.5">
                            <Clock size={12} /> {mail.scheduled_at ? new Date(mail.scheduled_at).toLocaleTimeString() : '-'}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleDeleteCampaign(mail.id)}
                            className="text-[10px] font-black uppercase text-rose-500 hover:bg-rose-50 px-3 py-1.5 transition-colors border border-transparent hover:border-[#1d4ed8] mr-2"
                          >
                            Cancelar
                          </button>
                        </td>
                      </tr>
                    ))}
                    {scheduledMails.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                          No hay envíos programados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT: HISTORY */}
        {activeTab === 'history' && (
          <div className="p-0 animate-in fade-in duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" /> Historial de Envíos
                </h3>
                <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wider">Registro de campañas completadas</p>
              </div>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Buscar campaña..." className="pl-9 pr-4 py-2 text-xs border border-[#1d4ed8] bg-slate-50 focus:outline-none focus:border-[#1d4ed8] font-medium w-64" />
              </div>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-y border-slate-100">
                    <tr>
                      <th className="px-6 py-3">ID / Título</th>
                      <th className="px-6 py-3">Fecha Enviado</th>
                      <th className="px-6 py-3 text-center">Audiencia</th>
                      <th className="px-6 py-3 text-center">Estado</th>
                      <th className="px-6 py-3 text-right">Reporte</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {historyMails.map((mail, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-900 text-xs">{mail.title}</p>
                          <span className="text-[9px] font-black font-mono px-1.5 py-0.5 mt-1 inline-block bg-slate-100 text-slate-500">C-{mail.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-[11px] font-bold text-slate-600">
                            {mail.sent_at ? new Date(mail.sent_at).toLocaleString() : 'N/A'}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded-full">{mail.target_audience}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-xs font-black font-mono text-emerald-600">{mail.status}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-[10px] font-black uppercase text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 transition-colors border border-transparent hover:border-[#1d4ed8] inline-flex items-center gap-1">
                            Ver Stats <ArrowUpRight size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {historyMails.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                          El historial de envíos está vacío
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB CONTENT: CREATE CAMPAIGN */}
        {activeTab === 'create' && (
          <div className="p-6 md:p-10 animate-in fade-in duration-300">
            <div className="max-w-3xl mx-auto space-y-8">
              <div>
                <h3 className="text-lg font-black uppercase tracking-widest text-slate-900">Diseñador de Campaña</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Redacta y programa tu próxima notificación masiva.</p>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Nombre Interno (Título)</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ej: Promo Verano 2026" 
                      className="w-full p-3 border border-[#1d4ed8] text-sm font-medium focus:outline-none focus:border-[#1d4ed8]" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Segmento (Audiencia)</label>
                    <select 
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="w-full p-3 border border-[#1d4ed8] text-sm font-medium focus:outline-none focus:border-[#1d4ed8] bg-white"
                    >
                      <option>Todos los usuarios</option>
                      <option>Usuarios PRO</option>
                      <option>Usuarios Free</option>
                      <option>Usuarios Inactivos (&gt;7 días)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Contenido del Mensaje</label>
                  <textarea 
                    rows={6} 
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Escribe tu mensaje aquí..." 
                    className="w-full p-3 border border-[#1d4ed8] text-sm focus:outline-none focus:border-[#1d4ed8] font-mono resize-none"
                  ></textarea>
                </div>

                <div className="p-5 bg-slate-50 border border-[#1d4ed8] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-700">Método de Envío</p>
                    <p className="text-[10px] text-slate-500 font-medium">Elige cuándo se enviará esta campaña.</p>
                  </div>
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                        <input 
                          type="radio" 
                          name="sendType" 
                          checked={!isScheduled}
                          onChange={() => setIsScheduled(false)}
                          className="accent-indigo-600" 
                        /> 
                        Inmediato
                      </label>
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                        <input 
                          type="radio" 
                          name="sendType" 
                          checked={isScheduled}
                          onChange={() => setIsScheduled(true)}
                          className="accent-indigo-600" 
                        /> 
                        Programar
                      </label>
                    </div>
                    {isScheduled && (
                      <input 
                        type="datetime-local" 
                        value={scheduledAt}
                        onChange={(e) => setScheduledAt(e.target.value)}
                        className="p-2 border border-[#1d4ed8] text-xs font-medium focus:outline-none focus:border-[#1d4ed8]" 
                      />
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button 
                    onClick={handleCreateCampaign}
                    disabled={submitting}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-xs font-black uppercase tracking-widest transition-colors  disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send size={16} />} 
                    {isScheduled ? 'Programar Envío' : 'Enviar Ahora'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
