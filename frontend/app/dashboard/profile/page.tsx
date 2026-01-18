'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, CreditCard, Share2, Settings, Shield, 
  Copy, Check, Crown, Loader2, Save, Calendar, ArrowLeft, LogOut
} from 'lucide-react';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';

// --- TIPOS DE DATOS ---
interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  membership: {
    tier: 'free' | 'pro' | 'titanium';
    valid_until: string; // ISO Date
    status: 'active' | 'expired';
  };
  referral_code: string;
  stats: {
    joined_at: string;
    total_xp: number;
  };
}

export default function ProfilePage() {
  const router = useRouter();
  
  // --- ESTADOS ---
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [copied, setCopied] = useState(false);

  // Estados del Formulario
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // 1. CARGAR DATOS DEL USUARIO (Simulación o Fetch Real)
  useEffect(() => {
    // Aquí conectarías con tu backend: fetch(`${API_URL}/api/v1/users/me`)...
    
    // Simulación para visualización inmediata:
    setTimeout(() => {
        setUser({
            id: "usr_onix_001",
            full_name: "Estudiante Titanium",
            email: "student@onixlingo.com",
            membership: {
                tier: 'titanium',
                valid_until: '2026-12-31T23:59:59Z',
                status: 'active'
            },
            referral_code: "ONIX-2026-X",
            stats: {
                joined_at: new Date().toISOString(),
                total_xp: 15420
            }
        });
        setName("Estudiante Titanium");
        setEmail("student@onixlingo.com");
        setLoading(false);
    }, 800);
  }, []);

  // 2. GUARDAR DATOS
  const handleSave = async () => {
    setSaving(true);
    // Simulación de llamada a API
    setTimeout(() => {
        setSaving(false);
        // Aquí podrías usar una librería de Toast/Notificaciones
        alert("¡Datos actualizados correctamente!");
    }, 1000);
  };

  // 3. CERRAR SESIÓN
  const handleLogout = () => {
    if(confirm("¿Estás seguro de cerrar sesión?")) {
        Cookies.remove('access_token');
        localStorage.clear();
        router.push('/login');
    }
  };

  // 4. COPIAR LINK
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
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-6 md:p-12 selection:bg-indigo-500/30">
      
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
                        {user?.full_name.charAt(0)}
                    </span>
                </div>
                {/* Badge de Nivel */}
                <div className="absolute -bottom-2 -right-2 bg-slate-900 p-1.5 rounded-full">
                    <div className="bg-emerald-500 text-slate-900 p-1.5 rounded-full">
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
                        <span className="text-white font-bold">{user?.stats.total_xp.toLocaleString()} XP</span>
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
                {/* Fondo decorativo animado */}
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
    </div>
  );
}