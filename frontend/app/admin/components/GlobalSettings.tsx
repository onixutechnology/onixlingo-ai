"use client";

import React, { useState, useEffect } from 'react';
import { 
  Save, Server, ShieldCheck, CreditCard, Bot, Globe, 
  Loader2, AlertCircle, Settings2
} from 'lucide-react';
import Cookies from 'js-cookie';

const API_URL = process.env.NODE_ENV === 'production' ? 'https://api.onixlingo.onixu.company' : 'http://127.0.0.1:8022';

interface SettingItem {
  key: string;
  value: string;
  description: string;
}

export default function GlobalSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('system');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('admin_token') || Cookies.get('access_token');
      const res = await fetch(`${API_URL}/api/v1/admin/settings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('admin_token') || Cookies.get('access_token');
      const res = await fetch(`${API_URL}/api/v1/admin/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ settings: settings })
      });

      if (res.ok) {
        // Just visual feedback, no intrusive alerts
        const btn = document.getElementById('saveBtn');
        if(btn) {
           btn.innerHTML = '<span class="text-white">✓ GUARDADO</span>';
           setTimeout(() => fetchSettings(), 1500);
        }
      } else {
        alert("Error al guardar configuraciones.");
      }
    } catch (err) {
      console.error("Error saving settings:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: string, val: string) => {
    setSettings(prev => ({ ...prev, [key]: val }));
  };

  const ToggleSwitch = ({ settingKey, label, desc }: { settingKey: string, label: string, desc?: string }) => {
    const isChecked = settings[settingKey] === 'true';
    return (
      <div className="flex items-center justify-between p-5 bg-white border border-[#1d4ed8]  hover:border-[#1d4ed8] transition-colors">
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-800">{label}</h4>
          <p className="text-[10px] text-slate-500 font-medium mt-1">{desc || descriptions[settingKey]}</p>
        </div>
        <button 
          onClick={() => handleChange(settingKey, isChecked ? 'false' : 'true')}
          className={`w-12 h-6 rounded-full relative transition-colors duration-300 ease-in-out ${isChecked ? 'bg-indigo-600' : 'bg-slate-300'}`}
        >
          <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${isChecked ? 'translate-x-6' : 'translate-x-0'}`}></div>
        </button>
      </div>
    );
  };

  const InputField = ({ settingKey, label, type = "text", desc }: { settingKey: string, label: string, type?: string, desc?: string }) => {
    return (
      <div className="flex flex-col p-5 bg-white border border-[#1d4ed8]  hover:border-[#1d4ed8] transition-colors">
        <label className="text-xs font-black uppercase tracking-widest text-slate-800 mb-1">{label}</label>
        <p className="text-[10px] text-slate-500 font-medium mb-3">{desc || descriptions[settingKey]}</p>
        <input 
          type={type}
          value={settings[settingKey] || ''}
          onChange={(e) => handleChange(settingKey, e.target.value)}
          className="w-full p-2.5 border border-[#1d4ed8] text-sm font-medium focus:outline-none focus:border-[#1d4ed8] bg-slate-50 focus:bg-white transition-colors"
        />
      </div>
    );
  };

  const SelectField = ({ settingKey, label, options, desc }: { settingKey: string, label: string, options: {value: string, label: string}[], desc?: string }) => {
    return (
      <div className="flex flex-col p-5 bg-white border border-[#1d4ed8]  hover:border-[#1d4ed8] transition-colors">
        <label className="text-xs font-black uppercase tracking-widest text-slate-800 mb-1">{label}</label>
        <p className="text-[10px] text-slate-500 font-medium mb-3">{desc || descriptions[settingKey]}</p>
        <select 
          value={settings[settingKey] || ''}
          onChange={(e) => handleChange(settingKey, e.target.value)}
          className="w-full p-2.5 border border-[#1d4ed8] text-sm font-medium focus:outline-none focus:border-[#1d4ed8] bg-slate-50 focus:bg-white transition-colors cursor-pointer"
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1800px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER SCI-FI STYLING */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-slate-900 bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 p-6 md:p-8 border border-[#1d4ed8]  relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-400/20 transition-all duration-700"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-10"></div>
        
        <div className="relative z-10 flex items-center gap-5">
          <div className="w-14 h-14 bg-indigo-500/20 border border-[#1d4ed8]/50 flex items-center justify-center ">
            <Settings2 size={28} className="text-indigo-300" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-widest uppercase text-">Configuración Global</h2>
            <p className="text-xs text-indigo-200/70 mt-1 font-mono uppercase tracking-widest">Control Maestro de la Plataforma</p>
          </div>
        </div>

        <div className="relative z-10">
          <button 
            id="saveBtn"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-3 px-6 py-3 bg-emerald-500 text-white rounded-none text-xs font-black font-mono uppercase tracking-widest transition-all   hover:translate-y-0.5 hover:translate-x-0.5 active:scale-95 disabled:opacity-50"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Guardar Cambios
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* TABS SIDEBAR */}
        <div className="w-full lg:w-64 flex flex-col gap-2 shrink-0">
          <button onClick={() => setActiveTab('system')} className={`flex items-center gap-3 px-5 py-4 text-xs font-black uppercase tracking-widest transition-colors ${activeTab === 'system' ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600 ' : 'bg-white text-slate-500 hover:bg-slate-50 border-l-4 border-transparent'}`}>
            <Server size={16} /> Sistema
          </button>
          <button onClick={() => setActiveTab('ai')} className={`flex items-center gap-3 px-5 py-4 text-xs font-black uppercase tracking-widest transition-colors ${activeTab === 'ai' ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600 ' : 'bg-white text-slate-500 hover:bg-slate-50 border-l-4 border-transparent'}`}>
            <Bot size={16} /> Sistema Analítico Avanzado
          </button>
          <button onClick={() => setActiveTab('billing')} className={`flex items-center gap-3 px-5 py-4 text-xs font-black uppercase tracking-widest transition-colors ${activeTab === 'billing' ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600 ' : 'bg-white text-slate-500 hover:bg-slate-50 border-l-4 border-transparent'}`}>
            <CreditCard size={16} /> Pagos y Finanzas
          </button>
          <button onClick={() => setActiveTab('general')} className={`flex items-center gap-3 px-5 py-4 text-xs font-black uppercase tracking-widest transition-colors ${activeTab === 'general' ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600 ' : 'bg-white text-slate-500 hover:bg-slate-50 border-l-4 border-transparent'}`}>
            <Globe size={16} /> General
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 min-h-[400px]">
          {activeTab === 'system' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-amber-50 border border-[#1d4ed8] p-4 flex items-start gap-3">
                <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                <div>
                  <h4 className="text-xs font-black text-amber-800 uppercase tracking-widest">Advertencia de Seguridad</h4>
                  <p className="text-[10px] text-amber-700 font-medium mt-1">Modificar estas opciones puede afectar directamente la disponibilidad de OnixLingo para los estudiantes.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ToggleSwitch settingKey="maintenance_mode" label="Modo Mantenimiento" />
                <ToggleSwitch settingKey="registration_open" label="Registro de Alumnos" />
                <InputField settingKey="max_daily_xp" label="Límite XP Diario (Anti-Bot)" type="number" />
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField 
                  settingKey="ai_default_engine" 
                  label="Motor Sistema Principal" 
                  options={[
                    {value: 'gpt-4o', label: 'OpenAI GPT-4o (Recomendado)'},
                    {value: 'gpt-4o-mini', label: 'OpenAI GPT-4o Mini (Rápido/Económico)'},
                    {value: 'gemini-1.5-pro', label: 'Google Gemini 1.5 Pro'},
                    {value: 'gemini-1.5-flash', label: 'Google Gemini 1.5 Flash'}
                  ]} 
                />
                <InputField settingKey="ai_global_temperature" label="Temperatura Global (Creatividad)" type="number" />
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField 
                  settingKey="payment_environment" 
                  label="Entorno de Pasarela" 
                  options={[
                    {value: 'test', label: 'Sandbox / Modo de Pruebas'},
                    {value: 'live', label: 'Producción / Live Mode'}
                  ]} 
                />
                <SelectField 
                  settingKey="default_currency" 
                  label="Moneda Base" 
                  options={[
                    {value: 'USD', label: 'Dólar Estadounidense (USD)'},
                    {value: 'MXN', label: 'Peso Mexicano (MXN)'},
                    {value: 'EUR', label: 'Euro (EUR)'}
                  ]} 
                />
                <InputField settingKey="display_price_pro_monthly" label="Precio Mostrado PRO (Mensual)" type="number" desc="Valor mostrado en la landing page para el plan Pro Mensual" />
                <InputField settingKey="display_price_pro_yearly" label="Precio Mostrado PRO (Anual)" type="number" desc="Valor mostrado en la landing page para el plan Pro Anual" />
                <InputField settingKey="display_price_exec_monthly" label="Precio Mostrado EXECUTIVE (Mensual)" type="number" desc="Valor mostrado en la landing page para el plan Executive Mensual" />
                <InputField settingKey="display_price_exec_yearly" label="Precio Mostrado EXECUTIVE (Anual)" type="number" desc="Valor mostrado en la landing page para el plan Executive Anual" />
              </div>
            </div>
          )}

          {activeTab === 'general' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField settingKey="platform_name" label="Nombre de la Plataforma" />
                <InputField settingKey="support_email" label="Email de Soporte" type="email" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
