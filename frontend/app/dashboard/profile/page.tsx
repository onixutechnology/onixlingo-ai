'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Award, Lock, Flame, BookOpen, Swords, ArrowLeft, Calendar, Zap, 
  Target, Trophy, User, Mail, Phone, Globe, Shield, Copy, Check, Save, LogOut
} from 'lucide-react';
import apiClient from '@/lib/apiClient';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { UpgradeModal } from '@/components/pro/UpgradeModal';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.error("Logout error:", err);
    }
    Cookies.remove('access_token', { path: '/' });
    Cookies.remove('username', { path: '/' });
    router.push('/login');
    router.refresh();
  };

  // Estados de edición
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    country_code: 'MX',
    avatar_url: '',
    password: ''
  });

  const AVATARS = [
    "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Smile&backgroundColor=b6e3f4",
    "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Rainbow&backgroundColor=c0aede",
    "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Heart&backgroundColor=d1d4f9",
    "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Star&backgroundColor=ffd5dc",
    "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Rocket&backgroundColor=c2f3e1",
    "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Sun&backgroundColor=fde68a"
  ];

  const COUNTRIES = [
    { code: 'MX', label: 'México', flag: '🇲🇽' },
    { code: 'ES', label: 'España', flag: '🇪🇸' },
    { code: 'US', label: 'USA', flag: '🇺🇸' },
    { code: 'CO', label: 'Colombia', flag: '🇨🇴' },
    { code: 'AR', label: 'Argentina', flag: '🇦🇷' },
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await apiClient.get('/users/me');
      setProfile(data);
      setFormData({
        full_name: data.full_name || '',
        email: data.email || '',
        phone: data.phone || '',
        country_code: data.country_code || 'MX',
        avatar_url: data.avatar_url || '',
        password: ''
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedFields?: any) => {
    setSaving(true);
    try {
      const updateData: any = { ...formData, ...(updatedFields || {}) };
      if (!updateData.password) delete updateData.password;
      
      await apiClient.put('/users/me', updateData);
      fetchProfile();
      if (!updatedFields) alert("Perfil actualizado correctamente");
    } catch (err) {
      alert("Error al actualizar el perfil");
    } finally {
      setSaving(false);
    }
  };

  const selectAvatar = (url: string) => {
    setFormData(prev => ({ ...prev, avatar_url: url }));
    setShowAvatarPicker(false);
    handleSave({ avatar_url: url });
  };

  const copyReferral = () => {
    if (profile?.referral_code) {
      navigator.clipboard.writeText(profile.referral_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="w-10 h-10 border-4 border-slate-950 border-t-teal-500 animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-20 font-sans">
      
      {/* NAVEGACIÓN */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
            <ArrowLeft size={18} />
          </button>
          <h1 className="font-black text-[10px] tracking-[0.3em] uppercase text-slate-900">Executive <span className="text-teal-600">Profile</span></h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleLogout}
            className="border border-slate-300 hover:bg-red-50 hover:border-red-200 text-slate-700 hover:text-red-700 px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all"
          >
            Cerrar Sesión
          </button>
          <button 
            onClick={() => handleSave()}
            disabled={saving}
            className="bg-slate-950 text-white px-6 py-2 text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 disabled:opacity-50 transition-all"
          >
            {saving ? 'Saving...' : <><Save size={12} /> Save Changes</>}
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* COLUMNA IZQUIERDA: IDENTIDAD */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* CARD DE IDENTIDAD PRINCIPAL */}
            <section className="bg-white border border-slate-200 p-8 shadow-sm relative">
               <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 -rotate-45 translate-x-16 -translate-y-16 opacity-50"></div>
               
               <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                  <div className="relative">
                    <div 
                      onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                      className="w-32 h-32 bg-slate-950 flex items-center justify-center text-teal-400 text-5xl font-black cursor-pointer overflow-hidden hover:ring-4 hover:ring-teal-500/20 transition-all"
                    >
                      {formData.avatar_url ? (
                        <img src={formData.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        profile?.username?.charAt(0).toUpperCase()
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                         <span className="text-[10px] text-white font-black uppercase">Cambiar</span>
                      </div>
                    </div>

                    {/* Selector de Avatar - Corregido Z-Index y Posición */}
                    {showAvatarPicker && (
                      <div className="absolute top-[110%] left-0 p-4 bg-white border border-slate-200 shadow-2xl z-[100] grid grid-cols-3 gap-2 w-52 animate-in fade-in zoom-in duration-200">
                        {AVATARS.map((url, i) => (
                          <div 
                            key={i} 
                            onClick={() => selectAvatar(url)}
                            className="w-13 h-13 border border-slate-100 cursor-pointer hover:border-teal-500 hover:scale-105 transition-all bg-slate-50"
                          >
                            <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-4xl font-black tracking-tighter uppercase mb-1">{profile?.username}</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center justify-center md:justify-start gap-2">
                       <Shield size={12} className={profile?.is_pro ? "text-teal-600" : "text-slate-400"} /> {profile?.is_pro ? "Professional Executive Account" : "Standard Student Account"}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                       <div className="bg-slate-50 border border-slate-100 px-4 py-2">
                          <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest block">Eloquence Pts</span>
                          <span className="text-lg font-black text-slate-900 flex items-center gap-1"><Zap size={14} className="text-teal-500" /> {profile?.stats?.eloquence_points}</span>
                       </div>
                       <div className="bg-slate-50 border border-slate-100 px-4 py-2">
                          <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest block">Active Streak</span>
                          <span className="text-lg font-black text-slate-900 flex items-center gap-1"><Flame size={14} className="text-orange-500" /> {profile?.stats?.streak_days} Days</span>
                       </div>
                    </div>
                  </div>
               </div>
             </section>

             {/* CARD DE PLAN Y SUSCRIPCIÓN */}
             {(() => {
                const rawTier = profile?.membership?.tier?.toLowerCase() || 'free';
                const userTier = rawTier === 'titanium' ? 'executive' : rawTier;
                return (
                  <section className="bg-white border border-slate-200 shadow-sm overflow-hidden">
                     <div className="px-8 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <Shield size={14} className="text-slate-400" />
                           <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Detalles de Suscripción</h3>
                        </div>
                        {userTier !== 'executive' && (
                           <button 
                              onClick={() => setShowUpgradeModal(true)}
                              className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-none transition-colors"
                            >
                               Hacer Upgrade
                            </button>
                        )}
                     </div>
                     
                     <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           <div className="p-4 bg-slate-50 border border-slate-100 flex flex-col justify-between">
                              <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest block mb-1">Plan de Cuenta</span>
                              <div>
                                 <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest border inline-block ${
                                    userTier === 'executive'
                                       ? 'bg-amber-50 border-amber-200 text-amber-800'
                                       : userTier === 'pro'
                                          ? 'bg-teal-50 border-teal-200 text-teal-800'
                                          : 'bg-slate-50 border-slate-200 text-slate-600'
                                 }`}>
                                    {userTier.toUpperCase()}
                                 </span>
                              </div>
                           </div>
                           
                           <div className="p-4 bg-slate-50 border border-slate-100 flex flex-col justify-between">
                              <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest block mb-1">Estatus del Plan</span>
                              <div>
                                 <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest border inline-block ${
                                    profile?.membership?.status === 'active'
                                       ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                       : 'bg-rose-50 border-rose-200 text-rose-800'
                                 }`}>
                                    {profile?.membership?.status === 'active' ? 'ACTIVA' : 'INACTIVA/VENCIDA'}
                                 </span>
                              </div>
                           </div>

                           <div className="p-4 bg-slate-50 border border-slate-100 flex flex-col justify-between">
                              <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest block mb-1">Fecha de Vencimiento</span>
                              <div>
                                 <span className="text-xs font-black text-slate-800 flex items-center gap-1">
                                    <Calendar size={12} className="text-slate-400" />
                                    {profile?.membership?.valid_until 
                                       ? new Date(profile.membership.valid_until).toLocaleDateString('es-MX', {
                                             year: 'numeric',
                                             month: 'short',
                                             day: 'numeric'
                                          })
                                       : userTier === 'free' ? 'No vence (Gratuito)' : 'Ilimitado'}
                                 </span>
                              </div>
                           </div>
                        </div>

                        {/* Detalle adicional de los beneficios */}
                        <div className="mt-6 p-4 bg-slate-50 border border-slate-100 rounded-none">
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Alcance de tu nivel</p>
                           <p className="text-[9px] text-slate-500 leading-snug">
                              {userTier === 'executive'
                                 ? 'Cuentas con acceso ilimitado a todo el catálogo de 900 lecciones, el temario de negocios Executive, el tutor de voz libre e ilimitada con IA (Speech Tutor) y la arena de ajedrez completa.'
                                 : userTier === 'pro'
                                    ? 'Tu suscripción incluye acceso a las 900 lecciones del catálogo estándar (A1-C1) y prácticas de ajedrez ilimitadas. Sube al plan Executive para temarios de negocios y tutoría por IA conversacional.'
                                    : 'Estás en el plan Free (100% de energía diaria). Tu consumo es: lección normal (50% de energía), vocabulario (30% de energía, límite 1 lección/día) y ajedrez (10% de energía, límite 2 puzzles/día). Sin prácticas conversacionales por IA. Sube a PRO o EXECUTIVE para desbloquear lecciones avanzadas, energía ilimitada y quitar anuncios.'
                              }
                           </p>
                        </div>
                     </div>
                  </section>
                );
             })()}

             {/* FORMULARIO DE DATOS */}
            <section className="bg-white border border-slate-200 shadow-sm">
               <div className="px-8 py-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                  <User size={14} className="text-slate-400" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Personal Information</h3>
               </div>
               <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Full Legal Name</label>
                     <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                        <input 
                           type="text" 
                           value={formData.full_name}
                           onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                           className="w-full bg-slate-50 border border-slate-200 py-3 pl-10 pr-4 text-xs font-bold focus:outline-none focus:border-teal-500 transition-colors"
                           placeholder="Ej. Jacob Morales"
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Corporate Email</label>
                     <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                        <input 
                           type="email" 
                           value={formData.email}
                           onChange={(e) => setFormData({...formData, email: e.target.value})}
                           className="w-full bg-slate-50 border border-slate-200 py-3 pl-10 pr-4 text-xs font-bold focus:outline-none focus:border-teal-500 transition-colors"
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                     <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                        <input 
                           type="tel" 
                           value={formData.phone}
                           onChange={(e) => setFormData({...formData, phone: e.target.value})}
                           className="w-full bg-slate-50 border border-slate-200 py-3 pl-10 pr-4 text-xs font-bold focus:outline-none focus:border-teal-500 transition-colors"
                           placeholder="+52 000 000 0000"
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Base Region (Country)</label>
                     <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                        <select 
                           value={formData.country_code}
                           onChange={(e) => setFormData({...formData, country_code: e.target.value})}
                           className="w-full bg-slate-50 border border-slate-200 py-3 pl-10 pr-4 text-xs font-bold focus:outline-none focus:border-teal-500 appearance-none transition-colors"
                        >
                           {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.flag} {c.label}</option>)}
                        </select>
                     </div>
                  </div>
               </div>
            </section>

            {/* SEGURIDAD */}
            <section className="bg-white border border-slate-200 shadow-sm">
               <div className="px-8 py-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                  <Lock size={14} className="text-slate-400" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Security & Privacy</h3>
               </div>
               <div className="p-8">
                  <div className="max-w-md space-y-2">
                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Update Password</label>
                     <div className="flex gap-2">
                        <div className="relative flex-1">
                           <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                           <input 
                              type="password" 
                              value={formData.password}
                              onChange={(e) => setFormData({...formData, password: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 py-3 pl-10 pr-4 text-xs font-bold focus:outline-none focus:border-teal-500 transition-colors"
                              placeholder="Min. 6 characters"
                           />
                        </div>
                     </div>
                     <p className="text-[8px] text-slate-400 font-bold uppercase italic mt-2">Deja en blanco para mantener la contraseña actual.</p>
                  </div>
               </div>
            </section>

          </div>

          {/* COLUMNA DERECHA: REFERIDOS Y LOGROS */}
          <div className="space-y-8">
            
            {/* REFERRAL NETWORK */}
            <section className="bg-slate-950 text-white p-8 border border-slate-800 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Swords size={80} />
               </div>
               <h3 className="text-sm font-black uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                  <Award size={16} className="text-teal-400" /> Referral Network
               </h3>
               <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight mb-8 leading-relaxed">
                  Invita a colegas y gana puntos de elocuencia adicionales por cada suscripción Titanium activada.
               </p>
               
               <div className="bg-white/5 border border-white/10 p-4 mb-4">
                  <span className="text-[7px] font-black text-teal-500 uppercase tracking-widest block mb-2">Your Personal Code</span>
                  <div className="flex items-center justify-between gap-4">
                     <code className="text-lg font-mono font-black tracking-widest text-teal-400">{profile?.referral_code}</code>
                     <button 
                        onClick={copyReferral}
                        className="p-2 bg-white/10 hover:bg-white/20 transition-colors border border-white/5"
                     >
                        {copied ? <Check size={16} className="text-teal-400" /> : <Copy size={16} />}
                     </button>
                  </div>
               </div>
               <p className="text-[8px] text-slate-500 font-black uppercase text-center">Referrals Active: 0</p>
            </section>

            {/* LOGROS RESUMIDOS */}
            <section className="bg-white border border-slate-200 shadow-sm">
               <div className="px-8 py-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
                  <Trophy size={14} className="text-slate-400" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Achievements</h3>
               </div>
               <div className="p-6 space-y-4">
                  {profile?.stats?.achievements?.length > 0 ? (
                    profile.stats.achievements.map((a: any) => (
                       <div key={a} className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-100">
                          <div className="w-10 h-10 bg-teal-600/10 text-teal-600 flex items-center justify-center border border-teal-600/20">
                             <Award size={20} />
                          </div>
                          <div>
                             <p className="text-[9px] font-black uppercase text-slate-900 tracking-tight">{a.replace('_', ' ')}</p>
                             <p className="text-[7px] text-slate-400 font-bold uppercase tracking-widest">Verified Badge</p>
                          </div>
                       </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                       <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">No achievements yet</p>
                    </div>
                  )}
               </div>
            </section>

          </div>

        </div>

      </div>

      {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} />}
    </div>
  );
}