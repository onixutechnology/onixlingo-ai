"use client";

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Server, AlertTriangle, Eye, Loader2, Activity } from 'lucide-react';

const URL = process.env.NODE_ENV === 'production' ? 'https://api.onixlingo.onixu.company' : 'http://127.0.0.1:8022';

interface AuditLog {
  id: number;
  admin_id: number | null;
  action: string;
  details: string;
  ip_address: string;
  created_at: string;
}

export default function AuditSecurity() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${URL}/api/v1/admin/audit-logs`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setLogs(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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
            <ShieldCheck size={28} className="text-indigo-300" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-widest uppercase text-">Seguridad y Auditoría</h2>
            <p className="text-xs text-indigo-200/70 mt-1 font-mono uppercase tracking-widest">Registro de Acciones Administrativas</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-[#1d4ed8] p-5 flex items-center gap-4">
          <div className="bg-emerald-100 p-3 rounded-full text-emerald-600"><Server size={20} /></div>
          <div>
            <h4 className="text-[10px] uppercase tracking-widest font-black text-emerald-800">Estado del Sistema</h4>
            <p className="text-lg font-black text-emerald-900 mt-1">Estable</p>
          </div>
        </div>
        <div className="bg-indigo-50 border border-[#1d4ed8] p-5 flex items-center gap-4">
          <div className="bg-indigo-100 p-3 rounded-full text-indigo-600"><Activity size={20} /></div>
          <div>
            <h4 className="text-[10px] uppercase tracking-widest font-black text-indigo-800">Eventos de Auditoría (24h)</h4>
            <p className="text-lg font-black text-indigo-900 mt-1">{logs.length}</p>
          </div>
        </div>
        <div className="bg-amber-50 border border-[#1d4ed8] p-5 flex items-center gap-4">
          <div className="bg-amber-100 p-3 rounded-full text-amber-600"><AlertTriangle size={20} /></div>
          <div>
            <h4 className="text-[10px] uppercase tracking-widest font-black text-amber-800">Alertas Críticas</h4>
            <p className="text-lg font-black text-amber-900 mt-1">0</p>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-[#1d4ed8]  overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-[#1d4ed8] text-[10px] uppercase tracking-widest text-slate-500">
                <th className="p-4 font-black">Fecha y Hora</th>
                <th className="p-4 font-black">Acción</th>
                <th className="p-4 font-black">Admin ID</th>
                <th className="p-4 font-black">IP Origen</th>
                <th className="p-4 font-black w-1/3">Detalles</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">No hay registros de auditoría aún.</td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 text-xs font-mono text-slate-500 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-[10px] font-black uppercase text-slate-700 tracking-wide border border-[#1d4ed8]">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-indigo-600 font-bold">{log.admin_id || 'SISTEMA'}</td>
                    <td className="p-4 font-mono text-slate-500 text-xs">{log.ip_address}</td>
                    <td className="p-4 text-slate-600 text-xs">{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
