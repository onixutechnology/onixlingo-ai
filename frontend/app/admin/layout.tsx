'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { 
  Users, ShieldCheck, Cog, Menu, Bell,
  LayoutDashboard, CreditCard, BarChart3, Bot, BookOpen, Tag, Ticket, Megaphone, Share2, Sparkles, Wallet, ArrowLeft
} from 'lucide-react';

const MODULES = [
  { id: 'dashboard', label: 'Dashboard General', icon: LayoutDashboard },
  { id: 'users', label: 'Gestión de Usuarios', icon: Users },
  { id: 'messaging', label: 'Mensajería Push', icon: Megaphone },
  { id: 'affiliates', label: 'Centro de Afiliados', icon: Share2 },
  { id: 'predictive', label: 'Analítica Predictiva (IA)', icon: Sparkles },
  { id: 'finances', label: 'Finanzas y Facturas', icon: Wallet },
  { id: 'billing', label: 'Configuración Paddle', icon: CreditCard },
  { id: 'analytics', label: 'Analíticas y Reportes', icon: BarChart3 },
  { id: 'ai_models', label: 'Motores de IA', icon: Bot },
  { id: 'content', label: 'Gestor de Contenido', icon: BookOpen },
  { id: 'marketing', label: 'Marketing y Promos', icon: Tag },
  { id: 'support', label: 'Tickets de Soporte', icon: Ticket },
  { id: 'security', label: 'Seguridad y Auditoría', icon: ShieldCheck },
  { id: 'settings', label: 'Configuración Global', icon: Cog },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Extraer el id activo basado en la URL
  const activeModule = pathname?.split('/').pop() || 'dashboard';

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8022';
        const res = await fetch(`${API_URL}/api/v1/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const recent = data.slice(-3).reverse().map((u: any) => ({
            id: u.id,
            title: `Nuevo Registro ${u.role === 'pro' || u.role === 'titanium' ? 'VIP' : ''}`,
            desc: `${u.email} acaba de ingresar a OnixLingo.`,
            time: 'Actividad Reciente',
            iconType: u.role === 'pro' || u.role === 'titanium' ? 'vip' : 'user'
          }));
          setNotifications(recent);
        }
      } catch (err) {
        console.error("Error al cargar data en header", err);
      }
    };
    if (token) {
      fetchRealData();
    }
  }, [token]);

  const userInitials = user?.username ? user.username.charAt(0).toUpperCase() : 'AD';

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden relative">
      
      {/* GLOBAL SCI-FI AMBIENT BACKGROUND */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-200/40 via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute inset-0 z-0 opacity-30 bg-[linear-gradient(to_right,#6366f11a_1px,transparent_1px),linear-gradient(to_bottom,#6366f11a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

      {/* TOP FLOATING NAVIGATION (Sci-Fi Glassmorphism Block) */}
      <div className="z-50 w-full flex justify-center pt-4 sm:pt-6 px-4 sm:px-6 flex-none relative">
        <header className="w-full max-w-[1800px] bg-white/40 backdrop-blur-xl border border-white/60 shadow-[8px_8px_0px_0px_rgba(199,210,254,0.6)] rounded-none overflow-visible ring-1 ring-white/30 transition-all duration-300 transform-gpu relative">
          
          {/* Sci-fi accents on main header */}
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-indigo-400 opacity-60"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-indigo-400 opacity-60"></div>

          {/* Top bar with Logo, Title, and User Actions */}
          <div className="flex items-center justify-between px-5 sm:px-8 py-3 sm:py-4 bg-white/30 border-b border-white/50 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-none bg-slate-900 border border-slate-700 flex items-center justify-center text-white shrink-0 shadow-[2px_2px_0_0_rgba(148,163,184,0.5)]">
                  <span className="font-black font-mono text-[12px] tracking-widest uppercase">ON</span>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="font-black font-mono uppercase tracking-widest text-lg text-slate-900 hidden sm:block drop-shadow-sm leading-none">ONIXLINGO PANEL ADMINISTRATIVO</span>
                  <h1 className="text-[10px] font-black font-mono text-indigo-600 uppercase tracking-[0.2em] hidden md:block mt-1 leading-none">Global Network Array</h1>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-5">
              <button 
                onClick={() => router.push('/dashboard')}
                className="group flex items-center gap-2 px-4 py-2.5 bg-white/50 backdrop-blur-sm border border-white/60 text-slate-700 hover:text-indigo-700 hover:border-indigo-300 rounded-none text-xs font-black font-mono uppercase tracking-widest transition-all duration-300 shadow-[2px_2px_0px_0px_rgba(203,213,225,0.6)] hover:shadow-[4px_4px_0px_0px_rgba(167,139,250,0.6)] hover:-translate-y-0.5 hover:-translate-x-0.5"
              >
                <ArrowLeft size={14} className="shrink-0 group-hover:-translate-x-1 transition-transform drop-shadow-sm" />
                <span className="hidden sm:inline">EXIT_HUB</span>
              </button>
              
              {/* Notificaciones */}
              <div className="relative">
                <button 
                  onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                  className={`relative p-2.5 bg-white/50 backdrop-blur-sm border border-white/60 rounded-none text-slate-500 hover:text-indigo-600 shadow-[2px_2px_0px_0px_rgba(203,213,225,0.6)] hover:shadow-[4px_4px_0px_0px_rgba(167,139,250,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:-translate-x-0.5 ${showNotifications ? 'bg-white text-indigo-600 shadow-inner translate-y-0 translate-x-0' : ''}`}
                >
                  <Bell size={18} className="drop-shadow-sm" />
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-none border border-white animate-pulse"></span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute top-[calc(100%+12px)] right-[-50px] sm:right-0 w-80 bg-white/90 backdrop-blur-2xl border border-white/60 shadow-[6px_6px_0_0_rgba(199,210,254,0.6)] rounded-none z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="p-4 border-b border-white/50 flex items-center justify-between bg-white/40">
                      <h3 className="font-black font-mono text-[10px] tracking-widest uppercase text-slate-800 flex items-center gap-2"><Bell size={12} className="text-indigo-500"/> SYSTEM_ALERTS</h3>
                      <button className="text-[9px] font-black font-mono uppercase tracking-widest px-2 py-1 bg-indigo-50 text-indigo-600 rounded-none hover:bg-indigo-100 transition-colors border border-indigo-200">CLEAR_ALL</button>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 text-xs font-mono font-bold">NO ACTIVE ALERTS.</div>
                      ) : (
                        notifications.map((notif, idx) => (
                          <div key={idx} className="p-4 border-b border-white/40 hover:bg-white/60 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-none border border-slate-200 flex items-center justify-center shrink-0 ${notif.iconType === 'vip' ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-100 text-slate-600'}`}>
                                {notif.iconType === 'vip' ? <Sparkles size={14} /> : <Users size={14} />}
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-xs font-black font-mono tracking-wider uppercase text-slate-700 group-hover:text-indigo-600 transition-colors truncate">{notif.title}</p>
                                <p className="text-[10px] font-mono text-slate-500 mt-0.5 leading-snug truncate">{notif.desc}</p>
                                <span className="text-[9px] font-black font-mono text-slate-400 mt-1.5 block">{notif.time}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Perfil */}
              <div className="relative">
                <div 
                  onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-none bg-slate-900 border border-slate-700 text-emerald-400 flex items-center justify-center font-black font-mono text-sm shadow-[2px_2px_0_0_rgba(148,163,184,0.5)] cursor-pointer shrink-0 transition-all active:scale-95 hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-[4px_4px_0_0_rgba(167,139,250,0.6)] ${showProfileMenu ? 'shadow-[0_0_15px_rgba(52,211,153,0.5)] border-emerald-500' : ''}`}
                >
                  {userInitials}
                </div>
                {showProfileMenu && (
                  <div className="absolute top-[calc(100%+12px)] right-0 w-64 bg-white/90 backdrop-blur-2xl border border-white/60 shadow-[6px_6px_0_0_rgba(199,210,254,0.6)] rounded-none z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="p-5 border-b border-white/50 flex items-center gap-4 bg-white/40">
                      <div className="w-10 h-10 rounded-none bg-slate-900 text-emerald-400 flex items-center justify-center font-black font-mono text-sm shadow-inner shrink-0 border border-slate-700">
                        {userInitials}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-black font-mono text-xs uppercase tracking-widest text-slate-800 truncate">{user?.username ? user.username : 'ROOT_ADMIN'}</p>
                        <p className="text-[10px] font-mono font-semibold text-slate-500 truncate">{user?.email || 'admin@onixlingo.com'}</p>
                        <p className="text-[9px] font-black font-mono uppercase text-emerald-600 tracking-wider mt-1">{user?.role || 'LEVEL 5 CLEARANCE'}</p>
                      </div>
                    </div>
                    <div className="p-3 flex flex-col gap-1">
                      <button onClick={() => router.push('/admin/settings')} className="w-full text-left px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-600 hover:bg-slate-100 hover:text-indigo-600 rounded-none transition-all font-black font-mono flex items-center gap-3">
                        <Cog size={14} /> SYS_CONFIG
                      </button>
                      <button onClick={() => router.push('/admin/security')} className="w-full text-left px-4 py-2.5 text-[10px] uppercase tracking-widest text-slate-600 hover:bg-slate-100 hover:text-indigo-600 rounded-none transition-all font-black font-mono flex items-center gap-3">
                        <ShieldCheck size={14} /> SECURITY_LOGS
                      </button>
                      <div className="h-px bg-white/50 my-1 mx-2"></div>
                      <button className="w-full text-left px-4 py-2.5 text-[10px] uppercase tracking-widest text-rose-600 hover:bg-rose-50 rounded-none transition-all font-black font-mono flex items-center gap-3 border border-transparent hover:border-rose-200" onClick={() => router.push('/')}>
                        <ArrowLeft size={14} /> TERMINATE_SESSION
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom bar with scrollable Module Tabs */}
          <div className="px-3 sm:px-6 py-2 bg-white/20 border-t border-white/40">
            <nav className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style jsx>{`
                nav::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              {MODULES.map((mod) => {
                const Icon = mod.icon;
                const isActive = activeModule === mod.id;
                return (
                  <button
                    key={mod.id}
                    onClick={() => router.push(`/admin/${mod.id}`)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-none transition-all duration-300 whitespace-nowrap text-[10px] uppercase tracking-widest font-black font-mono ${
                      isActive 
                        ? 'bg-white/60 text-indigo-700 shadow-[3px_3px_0_0_rgba(167,139,250,0.5)] border border-white transform -translate-y-0.5' 
                        : 'text-slate-600 border border-transparent hover:bg-white/40 hover:text-slate-900 hover:shadow-[2px_2px_0px_0px_rgba(203,213,225,0.6)] hover:border-white/60 hover:-translate-y-0.5 hover:-translate-x-0.5 active:scale-95'
                    }`}
                  >
                    <Icon size={14} className={`shrink-0 transition-colors drop-shadow-sm ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    {mod.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </header>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 relative z-10 bg-transparent">
        {children}
      </div>
    </div>
  );
}
