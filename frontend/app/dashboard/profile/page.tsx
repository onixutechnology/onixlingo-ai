'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  User, CreditCard, Share2, Settings, Shield, 
  Copy, Check, Crown, Loader2, Save, Calendar, ArrowLeft, LogOut,
  Home, BookA, Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useUIStore } from '@/store/uiStore';

// --- TIPOS DE DATOS ---
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

// 📱 BOTTOM NAV
const MobileBottomNav = ({ toggleProMode, mode }: { toggleProMode: () => void, mode: string }) => {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 px-4 sm:px-6 py-3 flex justify-between items-center z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] pb-safe">
      <Link href="/dashboard" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard') ? 'text-indigo-500' : 'text-slate-500 hover:text-indigo-400'}`}>
        <Home size={24} strokeWidth={isActive('/dashboard') ? 2.5 : 2} />
        <span className="text-[10px] font-bold">Inicio</span>
      </Link>

      <Link href="/dashboard/vocabulary" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard/vocabulary') ? 'text-indigo-500' : 'text-slate-500 hover:text-indigo-400'}`}>
        <BookA size={24} strokeWidth={isActive('/dashboard/vocabulary') ? 2.5 : 2} />
        <span className="text-[10px] font-bold">Vocab</span>
      </Link>

      <Link href="/dashboard/chess" className="group relative -mt-8">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-slate-950 cursor-pointer transform active:scale-95 transition-all duration-300 bg-emerald-600 shadow-emerald-500/40">
          <Crown size={28} fill="currentColor" />
        </div>
        <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-bold text-emerald-600">
          Ajedrez
        </span>
      </Link>

      <Link href="/dashboard/profile" className={`flex flex-col items-center gap-1 transition-colors ${isActive('/dashboard/profile') ? 'text-indigo-500' : 'text-slate-500 hover:text-indigo-400'}`}>
        <User size={24} strokeWidth={isActive('/dashboard/profile') ? 2.5 : 2} />
        <span className="text-[10px] font-bold">Perfil</span>
      </Link>

      <button onClick={toggleProMode} className={`flex flex-col items-center gap-1 transition-colors active:scale-95 ${mode === 'professional' ? 'text-amber-500' : 'text-slate-500 hover:text-amber-400'}`}>
        <Briefcase size={24} strokeWidth={mode === 'professional' ? 2.5 : 2} />
        <span className="text-[10px] font-bold">Pro</span>
      </button>
    </div>
  );
};

export default function ProfilePage() {
  const router = useRouter();
  const { mode, setMode } = useUIStore();
  
  // --- ESTADOS ---
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [copied, setCopied] = useState(false);

  // Estados del Formulario
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // 1. CARGAR DATOS REALES (Perfil + Progreso)
  useEffect(() => {
    const fetchProfileAndStats = async () => {
      try {
        const token = Cookies.get('access_token');
        const localUser = localStorage.getItem('currentUser');
        const localTier = localStorage.getItem('onix_tier') as 'free' | 'pro' | 'titanium' || 'free';
        
        // Configuración Base
        const baseProfile: UserProfile = {
          id: "local_temp",
          full_name: localUser || "Estudiante",
          email: "usuario@onixlingo.com", 
          membership: {
            tier: localTier,
            valid_until: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
            status: 'active'
          },
          referral_code: `ONIX-${new Date().getFullYear()}-${localUser?.substring(0,3).toUpperCase() || 'USR'}`,
          stats: {
            joined_at: new Date().toISOString(),
            total_xp: 0,
            streak: 0
          }
        };

        if (!token) {
          router.push('/login');
          return;
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://onixlingo-bckend.onrender.com';
        const headers = { 
          'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // Promesas en paralelo para mayor velocidad
        const [profileRes, statsRes] = await Promise.all([
          fetch(`${API_URL}/api/v1/users/me`, { headers }).catch(() => null),
          fetch(`${API_URL}/api/v1/progress/stats`, { headers }).catch(() => null)
        ]);

        let finalProfile = { ...baseProfile };

        // Procesar Perfil
        if (profileRes && profileRes.ok) {
          const profileData = await profileRes.json();
          finalProfile = { ...finalProfile, ...profileData };
        }

        // Procesar Stats (El XP real)
        if (statsRes && statsRes.ok) {
          const statsData = await statsRes.json();
          finalProfile.stats.total_xp = statsData.total_xp || 0;
          finalProfile.stats.streak = 5; // TODO: Conectar con racha real
        }

        setUser(finalProfile);
        setName(finalProfile.full_name);
        setEmail(finalProfile.email);

      } catch (error) {
        console.error("Error cargando perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndStats();
  }, [router]);

  // 2. GUARDAR DATOS
  const handleSave = async () => {
    setSaving(true);
    const token = Cookies.get('access_token');
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://onixlingo-bckend.onrender.com';

    try {
      const res = await fetch(`${API_URL}/api/v1/users/me`, {
        method: 'PUT', 
        headers: { 
          'Authorization': token?.startsWith('Bearer ') ? token : `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ full_name: name, email })
      });

      if (res.ok) {
        localStorage.setItem('currentUser', name);
        alert("¡Datos actualizados correctamente!");
      } else {
        throw new Error("Backend no implementado aún");
      }
    } catch (error) {
      console.warn("Actualizando localmente (Backend no listo):", error);
      localStorage.setItem('currentUser', name);
      // Silencioso para el usuario
    } finally {
      setSaving(false);
    }
  };

  // 3. CERRAR SESIÓN
  const handleLogout = () => {
    if(confirm("¿Estás seguro de cerrar sesión?")) {
      Cookies.remove('access_token');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('onix_tier');
      localStorage.removeItem('onixlingo-ui-prefs');
      router.push('/login');
    }
  };

  // 4. MODO PRO TOGGLE
  const toggleProMode = () => {
    setMode(mode === 'professional' ? 'student' : 'professional');
    router.push(mode === 'professional' ? '/dashboard' : '/dashboard/pro');
  };

  // 5. COPIAR LINK
  const copyInviteLink = () => {
    const link = `https://onixlingo.com/join?ref=${user?.referral_code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- RENDER DE CARGA ---
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white">
      <Loader2 className="animate-spin text-indigo-500 mb-4" size={40} />
      <p className="text-slate-400 font-medium animate-pulse">Cargando perfil...</p>
    </div>
  );

  // --- RENDER PRINCIPAL ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-6 md:p-12 pb-32 selection:bg-indigo-500/30">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* NAVEGACIÓN SUPERIOR */}
        <div className="flex justify-between items-center mb-4">
          <button 
            onClick={() => router.push('/dashboard')} 
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-bold group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
            Volver al Dashboard
          </button>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-bold bg-red-900/10 px-4 py-2 rounded-lg hover:bg-red-900/20"
          >
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </div>

        {/* HEADER PERFIL */}
        <header className="flex flex-col md:flex-row items-center md:items-start gap-8 pb-10 border-b border-slate-800/50">
          <div className="relative">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 flex items-center justify-center shadow-2xl shadow-indigo-500/20 ring-4 ring-slate-900 z-10 relative">
              <span className="text-5xl font-black text-white tracking-tighter">
                {user?.full_name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            {/* Badge de Nivel */}
            <div className="absolute -bottom-2 -right-2 bg-slate-900 p-1.5 rounded-full z-20">
              <div className="bg-emerald-500 text-slate-900 p-1.5 rounded-full shadow-lg shadow-emerald-500/30">
                <Shield size={16} fill="currentColor" />
              </div>
            </div>
          </div>
          
          <div className="text-center md:text-left pt-2">
            <h1 className="text-4xl font-black text-white tracking-tight mb-2">{user?.full_name}</h1>
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 text-slate-400 text-sm font-medium">
              <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800">
                <Calendar size={14} className="text-indigo-400" />
                <span>Miembro desde {new Date(user?.stats.joined_at!).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800">
                <Crown size={14} className="text-amber-400" />
                <span className="text-white font-bold">{user?.stats.total_xp.toLocaleString()} XP Totales</span>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 💳 TARJETA 1: MEMBRESÍA */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-800 p-8 rounded-[2rem] relative overflow-hidden group hover:border-indigo-500/30 transition-all shadow-xl"
          >
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
            <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:rotate-12 duration-500">
              <Crown size={140} />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <CreditCard size={14} /> Plan Actual
              </h2>

              <div className="flex items-baseline gap-4 mb-8">
                <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400 tracking-tighter">
                  {user?.membership.tier.toUpperCase()}
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest">
                  ACTIVO
                </span>
              </div>

              <div className="flex items-center gap-3 text-slate-400 text-sm bg-black/20 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                <Calendar size={18} className="text-indigo-400" />
                <span>Próxima renovación: <span className="text-white font-bold">{new Date(user?.membership.valid_until!).toLocaleDateString()}</span></span>
              </div>

              <div className="mt-8 flex gap-3">
                <button className="flex-1 py-3 bg-white text-slate-900 hover:bg-indigo-50 rounded-xl text-sm font-bold transition-colors shadow-lg shadow-white/5">
                  Gestionar Plan
                </button>
              </div>
            </div>
          </motion.section>

          {/* 🤝 TARJETA 2: REFERIDOS */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] flex flex-col justify-between shadow-xl"
          >
            <div>
              <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Share2 size={14} /> Recompensas
              </h2>
              <h3 className="text-xl font-bold text-white mb-3">
                Invita amigos, gana meses gratis.
              </h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Tu código único otorga acceso VIP a tus amigos. Por cada registro confirmado, te regalamos <strong>1 mes de Titanium</strong>.
              </p>
            </div>

            <div className="bg-black/30 p-2 rounded-2xl border border-slate-700/50 flex items-center gap-2 pl-4">
              <div className="flex-1 text-slate-300 text-sm font-mono truncate select-all">
                onixlingo.com/join?ref={user?.referral_code}
              </div>
              <button 
                onClick={copyInviteLink}
                className={`p-3.5 rounded-xl transition-all font-bold flex items-center gap-2 shadow-lg min-w-[110px] justify-center
                  ${copied ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-600'}`}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span className="text-xs uppercase tracking-wider">{copied ? 'Listo' : 'Copiar'}</span>
              </button>
            </div>
          </motion.section>
        </div>

        {/* ⚙️ SECCIÓN 3: EDITAR DATOS */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900 border border-slate-800 p-8 md:p-10 rounded-[2rem] shadow-xl"
        >
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-800">
            <div className="p-3 bg-slate-800 rounded-2xl text-slate-400">
              <Settings size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Ajustes Personales</h2>
              <p className="text-sm text-slate-500">Actualiza tu información de contacto</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nombre Completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white rounded-xl pl-12 pr-5 py-4 outline-none transition-all focus:ring-1 focus:ring-indigo-500/50 font-medium placeholder:text-slate-700"
                  placeholder="Tu nombre"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Correo Electrónico</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">@</div>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-white rounded-xl pl-12 pr-5 py-4 outline-none transition-all focus:ring-1 focus:ring-indigo-500/50 font-medium placeholder:text-slate-700"
                  placeholder="tu@email.com"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-indigo-500 transition-all flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 active:scale-95"
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </motion.section>

      </div>
      
      {/* 🟢 BARRA MÓVIL INTEGRADA AQUÍ */}
      <MobileBottomNav toggleProMode={toggleProMode} mode={mode} />
    </div>
  );
}
