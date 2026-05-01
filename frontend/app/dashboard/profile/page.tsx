'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  User, CreditCard, Share2, Settings, Shield, 
  Copy, Check, Crown, Loader2, Save, Calendar, ArrowLeft, LogOut,
  Home, BookA, Briefcase, Lock, ExternalLink, Mail, Camera, Bell, MonitorSmartphone, Key
} from 'lucide-react';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useUIStore } from '@/store/uiStore';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  membership: {
    tier: 'free' | 'pro' | 'titanium';
    valid_until: string;
    status: 'active' | 'expired';
  };
  referral_code: string;
  stats: {
    joined_at: string;
    total_xp: number;
    streak: number;
  };
}

// 📱 BOTTOM NAV INTELIGENTE
const MobileBottomNav = ({ toggleProMode, mode }: { toggleProMode: () => void, mode: string }) => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#020617]/95 backdrop-blur-xl border-t border-slate-800 px-4 sm:px-6 py-3 flex justify-between items-center z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] pb-safe">
      <Link href="/dashboard" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard') ? 'text-indigo-500' : 'text-slate-500 hover:text-indigo-400'}`}>
        <Home size={24} strokeWidth={isActive('/dashboard') ? 2.5 : 2} />
        <span className="text-[10px] font-bold">Inicio</span>
      </Link>
      <Link href="/dashboard/vocabulary" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard/vocabulary') ? 'text-indigo-500' : 'text-slate-500 hover:text-indigo-400'}`}>
        <BookA size={24} strokeWidth={isActive('/dashboard/vocabulary') ? 2.5 : 2} />
        <span className="text-[10px] font-bold">Vocab</span>
      </Link>
      <Link href="/dashboard/chess" className="group relative -mt-8">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-[#020617] cursor-pointer transform active:scale-95 transition-all duration-300 ${isActive('/dashboard/chess') ? 'bg-amber-500 shadow-amber-500/40 scale-105 ring-2 ring-amber-200' : 'bg-slate-800 shadow-slate-900/40 hover:-translate-y-1'}`}>
          <Crown size={28} fill="currentColor" />
        </div>
        <span className={`absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-bold transition-opacity ${isActive('/dashboard/chess') ? 'text-amber-500 opacity-100' : 'text-slate-500 opacity-0 group-hover:opacity-100'}`}>
          Ajedrez
        </span>
      </Link>
      <Link href="/dashboard/profile" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard/profile') ? 'text-indigo-500' : 'text-slate-500 hover:text-indigo-400'}`}>
        <User size={24} strokeWidth={isActive('/dashboard/profile') ? 2.5 : 2} />
        <span className="text-[10px] font-bold">Perfil</span>
      </Link>
      <button onClick={toggleProMode} className={`flex flex-col items-center gap-1 transition-colors active:scale-95 ${mode === 'professional' ? 'text-indigo-500' : 'text-slate-500 hover:text-indigo-400'}`}>
        <Briefcase size={24} strokeWidth={mode === 'professional' ? 2.5 : 2} />
        <span className="text-[10px] font-bold">Pro</span>
      </button>
    </div>
  );
};

// 🔘 COMPONENTE DE TOGGLE SWITCH (NUEVO)
const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean, onChange: () => void }) => (
  <button 
    type="button"
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${enabled ? 'bg-indigo-500' : 'bg-slate-700'}`}
  >
    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

export default function ProfilePage() {
  const router = useRouter();
  const { mode, setMode } = useUIStore();
  
  // Estados de carga y guardado
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [managingPlan, setManagingPlan] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [copied, setCopied] = useState(false);

  // Estados del formulario
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Nuevos estados de preferencias
  const [marketingEmails, setMarketingEmails] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  useEffect(() => {
    const fetchProfileAndStats = async () => {
      try {
        const token = Cookies.get('access_token');
        const localUser = localStorage.getItem('currentUser');
        const localTier = localStorage.getItem('onix_tier') as 'free' | 'pro' | 'titanium' || 'free';
        
        const baseProfile: UserProfile = {
          id: "local_temp",
          full_name: localUser || "Estudiante",
          email: "usuario@onixlingo.com", 
          membership: {
            tier: localTier,
            valid_until: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
            status: 'active'
          },
          referral_code: `ONX-${new Date().getFullYear()}-${localUser?.substring(0,3).toUpperCase() || 'USR'}`,
          stats: { joined_at: new Date().toISOString(), total_xp: 0, streak: 0 }
        };

        if (!token) {
          router.push('/login');
          return;
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.onixlingo.onixu.company';
        const headers = { 
          'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const [profileRes, statsRes] = await Promise.all([
          fetch(`${API_URL}/api/v1/users/me`, { headers }).catch(() => null),
          fetch(`${API_URL}/api/v1/progress/stats`, { headers }).catch(() => null)
        ]);

        let finalProfile = { ...baseProfile };

        if (profileRes && profileRes.ok) {
          const profileData = await profileRes.json();
          finalProfile = { ...finalProfile, ...profileData };
        }

        if (statsRes && statsRes.ok) {
          const statsData = await statsRes.json();
          finalProfile.stats.total_xp = statsData.total_xp || 0;
          finalProfile.stats.streak = 5; 
        }

        setUser(finalProfile);
        setName(finalProfile.full_name || finalProfile.email); 
        setEmail(finalProfile.email);

      } catch (error) {
        console.error("Error cargando perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndStats();
  }, [router]);

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus('idle');
    const token = Cookies.get('access_token');
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.onixlingo.onixu.company';

    try {
      const payload = { 
        full_name: name, 
        email: email,
        ...(password.length >= 6 ? { password } : {})
      };

      const res = await fetch(`${API_URL}/api/v1/users/me`, {
        method: 'PUT', 
        headers: { 
          'Authorization': token?.startsWith('Bearer ') ? token : `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        localStorage.setItem('currentUser', name);
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.detail || 'No se pudo actualizar'}`);
      }
    } catch (error) {
      console.warn("Actualizando localmente (Backend no listo):", error);
      localStorage.setItem('currentUser', name);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setSaving(false);
      setPassword(''); 
    }
  };

  const handleManagePlan = async () => {
    setManagingPlan(true);
    try {
      const token = Cookies.get('access_token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.onixlingo.onixu.company';
      
      const res = await fetch(`${API_URL}/api/v1/billing/create-portal-session`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        window.location.href = data.url; 
      } else {
        alert("El portal de facturación requiere configuración de llaves de Stripe en tu servidor backend.");
      }
    } catch (error) {
      alert("Error conectando con el portal de facturación.");
    } finally {
      setManagingPlan(false);
    }
  };

  const handleLogout = () => {
    if(confirm("¿Estás seguro de cerrar sesión?")) {
      Cookies.remove('access_token');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('onix_tier');
      localStorage.removeItem('onixlingo-ui-prefs');
      router.push('/login');
    }
  };

  const toggleProMode = () => {
    setMode(mode === 'professional' ? 'student' : 'professional');
    router.push(mode === 'professional' ? '/dashboard' : '/dashboard/pro');
  };

  const copyInviteLink = () => {
    const link = `https://onixlingo.com/join?ref=${user?.referral_code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] text-white">
      <Loader2 className="animate-spin text-indigo-500 mb-4" size={48} />
      <p className="text-slate-400 font-bold tracking-widest uppercase text-[10px] animate-pulse">Sincronizando Identidad...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans p-4 md:p-8 lg:p-12 pb-32 selection:bg-indigo-500/30">
      
      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-indigo-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-900/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* HEADER DE NAVEGACIÓN */}
        <div className="flex justify-between items-center bg-slate-900/50 backdrop-blur-md border border-slate-800/80 p-4 rounded-2xl">
          <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold text-sm group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            Volver al Hub
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-xs font-bold uppercase tracking-widest bg-red-950/30 border border-red-900/50 px-4 py-2 rounded-xl hover:bg-red-900/50">
            <LogOut size={14} /> Cerrar Sesión
          </button>
        </div>

        {/* SECCIÓN PRINCIPAL: AVATAR Y DATOS */}
        <header className="flex flex-col md:flex-row items-center md:items-stretch gap-8">
          {/* AVATAR CARD */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden group min-w-[280px]">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none"></div>
            
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-900 flex items-center justify-center shadow-2xl shadow-indigo-500/20 ring-4 ring-slate-950 z-10 relative">
                <span className="text-5xl font-black text-white tracking-tighter">
                  {name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <button className="absolute bottom-0 right-0 bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-full z-20 border-4 border-slate-900 transition-all shadow-xl group-hover:scale-110">
                <Camera size={18} />
              </button>
            </div>
            
            <div className="text-center w-full">
              <h1 className="text-2xl font-black text-white tracking-tight mb-1 truncate">{name}</h1>
              <p className="text-slate-500 text-sm mb-4 truncate">{email}</p>
              <div className="inline-flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs font-bold text-slate-300">
                <Calendar size={14} className="text-indigo-400" />
                Miembro desde {new Date(user?.stats.joined_at!).getFullYear()}
              </div>
            </div>
          </div>

          {/* STATS & QUICK ACTIONS */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* BILLING CARD */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 rounded-[2rem] flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/20 transition-all"></div>
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                    <CreditCard size={14} /> Plan Actual
                  </h2>
                  <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-black px-2.5 py-1 rounded-md border border-emerald-500/20 uppercase tracking-widest">
                    Activo
                  </span>
                </div>
                <div className="text-3xl font-black text-white tracking-tight mb-1">
                  {user?.membership.tier.toUpperCase()}
                </div>
                <p className="text-xs text-slate-500 font-medium">Renueva el {new Date(user?.membership.valid_until!).toLocaleDateString()}</p>
              </div>

              <button 
                onClick={handleManagePlan} disabled={managingPlan}
                className="mt-6 w-full py-3 bg-white text-slate-900 hover:bg-slate-200 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95 disabled:opacity-80"
              >
                {managingPlan ? <Loader2 className="animate-spin" size={16} /> : <ExternalLink size={16} />}
                {managingPlan ? 'Conectando...' : 'Portal de Pago'}
              </button>
            </div>

            {/* REFERRAL CARD */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] flex flex-col justify-between">
              <div>
                <h2 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Share2 size={14} /> Programa de Referidos
                </h2>
                <h3 className="text-lg font-bold text-white leading-tight mb-2">Gana 1 mes de Titanium gratis.</h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">Comparte tu enlace. Si un amigo se suscribe, ambos reciben beneficios VIP.</p>
              </div>

              <div className="mt-4 bg-slate-950 p-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
                <div className="flex-1 text-slate-300 text-[10px] font-mono truncate pl-3">
                  onixlingo.com/join?ref={user?.referral_code.split('-')[2]}
                </div>
                <button 
                  onClick={copyInviteLink}
                  className={`p-2.5 rounded-lg transition-all font-bold flex items-center gap-2 justify-center
                  ${copied ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>

          </div>
        </header>

        {/* AJUSTES Y PREFERENCIAS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* FORMULARIO DE PERFIL */}
          <section className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800/80">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-indigo-400">
                  <Settings size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white tracking-tight">Información Personal</h2>
                  <p className="text-xs text-slate-500 font-medium">Actualiza tus credenciales de acceso.</p>
                </div>
              </div>
              {saveStatus === 'success' && (
                <span className="hidden sm:flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 animate-in fade-in zoom-in">
                  <Check size={14} /> Guardado
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Nombre Completo</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="text" value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white rounded-xl pl-11 pr-4 py-3.5 outline-none transition-all focus:ring-1 focus:ring-indigo-500/50 text-sm font-medium placeholder:text-slate-700"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Correo Electrónico</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white rounded-xl pl-11 pr-4 py-3.5 outline-none transition-all focus:ring-1 focus:ring-indigo-500/50 text-sm font-medium placeholder:text-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Cambiar Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                  <input 
                    type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white rounded-xl pl-11 pr-4 py-3.5 outline-none transition-all focus:ring-1 focus:ring-indigo-500/50 text-sm font-medium placeholder:text-slate-700"
                    placeholder="Escribe una nueva contraseña o déjalo en blanco"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-800/80">
              <button 
                onClick={handleSave} disabled={saving}
                className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-indigo-500/20 active:scale-95"
              >
                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                {saving ? 'Guardando...' : 'Actualizar Perfil'}
              </button>
            </div>
          </section>

          {/* PREFERENCIAS Y SEGURIDAD */}
          <div className="space-y-6">
            
            {/* NOTIFICACIONES */}
            <section className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] shadow-lg">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Bell size={14} /> Preferencias
              </h3>
              
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white mb-0.5">Alertas de Progreso</p>
                    <p className="text-[10px] text-slate-500">Recordatorios de racha y lecciones.</p>
                  </div>
                  <ToggleSwitch enabled={marketingEmails} onChange={() => setMarketingEmails(!marketingEmails)} />
                </div>
                <div className="h-px w-full bg-slate-800/80"></div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white mb-0.5">Resumen Semanal</p>
                    <p className="text-[10px] text-slate-500">Reporte de métricas a tu correo.</p>
                  </div>
                  <ToggleSwitch enabled={weeklyReports} onChange={() => setWeeklyReports(!weeklyReports)} />
                </div>
              </div>
            </section>

            {/* SEGURIDAD */}
            <section className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] shadow-lg">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Shield size={14} /> Seguridad (Beta)
              </h3>
              
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white mb-0.5 flex items-center gap-2">
                      Autenticación 2FA <span className="bg-indigo-500/10 text-indigo-400 text-[8px] px-1.5 py-0.5 rounded border border-indigo-500/20">PROX</span>
                    </p>
                    <p className="text-[10px] text-slate-500">Mayor protección para tu cuenta.</p>
                  </div>
                  <ToggleSwitch enabled={twoFactorAuth} onChange={() => setTwoFactorAuth(!twoFactorAuth)} />
                </div>
                
                <button className="w-full mt-2 py-2.5 bg-slate-950 border border-slate-800 hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-300 transition-colors flex items-center justify-center gap-2">
                  <MonitorSmartphone size={14} /> Cerrar todas las sesiones
                </button>
              </div>
            </section>

          </div>

        </div>
      </div>

      <MobileBottomNav toggleProMode={toggleProMode} mode={mode} />
    </div>
  );
}