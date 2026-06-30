"use client";

import React, { useState, useEffect } from 'react';
import { Bot, Save, Loader2, Sparkles, Cpu, Type } from 'lucide-react';
import { API_URL } from '../lib/api'; // fallback if needed, but we redefine to 8022

const URL = process.env.NODE_ENV === 'production' ? 'https://api.onixlingo.onixu.company' : 'http://127.0.0.1:8022';

interface AIConfig {
  id: number;
  engine_name: string;
  system_prompt: string;
  temperature: string;
  model_version: string;
  updated_at: string;
}

export default function AiEngines() {
  const [configs, setConfigs] = useState<AIConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    try {
      const res = await fetch(`${URL}/api/v1/admin/ai-configs`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        setConfigs(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index: number, field: keyof AIConfig, value: string) => {
    const newConfigs = [...configs];
    newConfigs[index] = { ...newConfigs[index], [field]: value };
    setConfigs(newConfigs);
  };

  const handleSave = async (index: number) => {
    const config = configs[index];
    setSavingId(config.id);
    try {
      const res = await fetch(`${URL}/api/v1/admin/ai-configs/${config.engine_name}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          system_prompt: config.system_prompt,
          temperature: config.temperature,
          model_version: config.model_version
        })
      });
      if (res.ok) {
        alert(`Configuración de ${config.engine_name} guardada correctamente.`);
      } else {
        alert("Error al guardar la configuración.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
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
      
      {/* HEADER SCI-FI STYLING */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-slate-900 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 p-6 md:p-8 border border-indigo-500/30 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-400/20 transition-all duration-700"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-10"></div>
        
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-500/20 border border-indigo-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            <Bot size={28} className="text-indigo-300" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-widest uppercase text-shadow-sm">Motores de Sistema</h2>
            <p className="text-xs text-indigo-200/70 mt-1 font-mono uppercase tracking-widest">Afinamiento Neural del Tutor</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {configs.map((config, idx) => (
          <div key={config.id} className="bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col relative overflow-hidden group">
            <div className="h-2 w-full bg-indigo-600"></div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-black uppercase text-slate-800 tracking-wide flex items-center gap-2">
                    <Sparkles size={16} className="text-indigo-500" />
                    {config.engine_name.replace('_', ' ')}
                  </h3>
                  <p className="text-xs font-mono text-slate-400 mt-1">ID: {config.id} | Última act: {new Date(config.updated_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-5 flex-1">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-1.5 mb-2">
                    <Cpu size={12} /> Modelo / Versión
                  </label>
                  <select 
                    value={config.model_version} 
                    onChange={(e) => handleChange(idx, 'model_version', e.target.value)}
                    className="w-full p-2 border border-slate-200 text-sm font-medium focus:border-indigo-500 outline-none bg-slate-50 focus:bg-white"
                  >
                    <option value="gpt-4o">gpt-4o</option>
                    <option value="gpt-4o-mini">gpt-4o-mini</option>
                    <option value="gemini-1.5-pro">gemini-1.5-pro</option>
                    <option value="gemini-1.5-flash">gemini-1.5-flash</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-1.5 mb-2">
                    <Type size={12} /> Temperatura (0.0 - 1.0)
                  </label>
                  <input 
                    type="number" step="0.1" min="0" max="1"
                    value={config.temperature} 
                    onChange={(e) => handleChange(idx, 'temperature', e.target.value)}
                    className="w-full p-2 border border-slate-200 text-sm font-medium focus:border-indigo-500 outline-none bg-slate-50 focus:bg-white"
                  />
                </div>

                <div className="flex-1 flex flex-col">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-1.5 mb-2">
                    <Bot size={12} /> System Prompt (Instrucciones del sistema)
                  </label>
                  <textarea 
                    value={config.system_prompt} 
                    onChange={(e) => handleChange(idx, 'system_prompt', e.target.value)}
                    className="w-full p-3 border border-slate-200 text-sm focus:border-indigo-500 outline-none bg-slate-50 focus:bg-white resize-none flex-1 min-h-[150px] font-mono leading-relaxed"
                  />
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <button 
                  onClick={() => handleSave(idx)}
                  disabled={savingId === config.id}
                  className="w-full flex justify-center items-center gap-2 py-3 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                  {savingId === config.id ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
