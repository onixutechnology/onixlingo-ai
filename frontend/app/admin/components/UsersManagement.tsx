"use client";

import { useState, useEffect } from 'react';
import { Users, Crown, ShieldAlert, Search, Gift, Loader2, Settings, Star, Zap } from 'lucide-react';
import Cookies from 'js-cookie';

import GiftModal from './modals/GiftModal';
import UserManagementModal from './modals/UserManagementModal';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.onixlingo.onixu.company'
  : 'http://127.0.0.1:8022';

interface AdminUser {
  id: number;
  email: string;
  username: string;
  is_pro: boolean;
  tier: string;
  role: string;
  created_at: string;
  valid_until?: string;
}

const TIER_META: Record<string, { color: string; icon: React.ReactNode }> = {
  free:      { color: '#64748b', icon: <Users size={11} /> },
  pro:       { color: '#3b82f6', icon: <Zap size={11} /> },
  executive: { color: '#8b5cf6', icon: <Crown size={11} /> },
  titanium:  { color: '#f59e0b', icon: <Star size={11} /> },
};

export default function UsersManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [managingUser, setManagingUser] = useState<AdminUser | null>(null);
  const [giftingUser, setGiftingUser] = useState<AdminUser | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token') || Cookies.get('access_token');
      if (!token) return;

      const res = await fetch(`${API_URL}/api/v1/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 403) {
        setError('Acceso Denegado: No tienes privilegios de Administrador.');
        setLoading(false);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || data);
      } else {
        setError('Error al cargar la base de datos de usuarios.');
      }
    } catch {
      setError('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    u =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const premiumCount = users.filter(u => u.is_pro).length;
  const tierCounts = users.reduce<Record<string, number>>((acc, u) => {
    const t = u.tier?.toLowerCase() || 'free';
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-6 h-[50vh]">
        <ShieldAlert size={64} className="text-red-500 mb-6" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Acceso Restringido</h1>
        <p className="text-slate-500 mb-8">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Usuarios', value: users.length, icon: <Users size={22} />, color: '#6366f1' },
          { label: 'Con Suscripción', value: premiumCount, icon: <Crown size={22} />, color: '#f59e0b' },
          { label: 'Tier Pro', value: tierCounts['pro'] || 0, icon: <Zap size={22} />, color: '#3b82f6' },
          { label: 'Titanium', value: tierCounts['titanium'] || 0, icon: <Star size={22} />, color: '#f59e0b' },
        ].map(stat => (
          <div
            key={stat.label}
            className="bg-white/40 backdrop-blur-md border border-white/60 p-5 flex items-center gap-4 shadow-[3px_3px_0_0_rgba(203,213,225,0.5)] hover:shadow-[6px_6px_0_0_rgba(203,213,225,0.5)] hover:-translate-y-0.5 transition-all"
          >
            <div className="p-3 rounded-none" style={{ background: `${stat.color}15`, color: stat.color }}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-white/40 backdrop-blur-md border border-white/60 shadow-[3px_3px_0_0_rgba(203,213,225,0.5)] relative overflow-hidden">
        {loading && users.length > 0 && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
          </div>
        )}

        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <h2 className="text-sm font-black font-mono tracking-widest uppercase text-slate-900">
            Directorio de Cuentas
          </h2>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Buscar usuario o email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-white/60 border border-white/60 text-sm text-slate-900 pl-10 pr-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {loading && users.length === 0 ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="animate-spin text-indigo-500" size={32} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 text-[10px] uppercase tracking-wider">
                  <th className="p-4 pl-6 font-black border-b border-slate-200">ID</th>
                  <th className="p-4 font-black border-b border-slate-200">Usuario</th>
                  <th className="p-4 font-black border-b border-slate-200">Nivel</th>
                  <th className="p-4 font-black border-b border-slate-200">Vencimiento VIP</th>
                  <th className="p-4 pr-6 font-black border-b border-slate-200 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredUsers.map(u => {
                  const tierKey = u.tier?.toLowerCase() || 'free';
                  const tierMeta = TIER_META[tierKey] || TIER_META['free'];
                  return (
                    <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors group">
                      <td className="p-4 pl-6 text-slate-400 font-mono text-xs">#{u.id}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 flex items-center justify-center font-bold text-xs shadow-sm shrink-0 group-hover:scale-105 transition-transform"
                            style={{ background: `${tierMeta.color}15`, color: tierMeta.color }}
                          >
                            {u.username.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              {u.username}
                              {u.role === 'admin' && (
                                <ShieldAlert size={11} className="text-red-500" />
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider"
                          style={{
                            background: `${tierMeta.color}15`,
                            border: `1px solid ${tierMeta.color}40`,
                            color: tierMeta.color,
                          }}
                        >
                          {tierMeta.icon} {tierKey}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-mono">
                        {u.valid_until
                          ? <span className="text-slate-700">{new Date(u.valid_until).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                          : u.is_pro
                          ? <span className="text-amber-600 font-black uppercase tracking-wider text-[10px]">Sin fecha registrada</span>
                          : <span className="text-slate-300">—</span>}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setGiftingUser(u)}
                            className="p-2 transition-colors shadow-sm hover:scale-110 active:scale-95"
                            style={{
                              background: '#fffbeb',
                              border: '1px solid #fde68a',
                              color: '#b45309',
                            }}
                            title="Regalar Suscripción"
                          >
                            <Gift size={15} />
                          </button>
                          <button
                            onClick={() => setManagingUser(u)}
                            className="p-2 text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors shadow-sm hover:scale-110 active:scale-95"
                            title="Configurar Cuenta"
                          >
                            <Settings size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredUsers.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-slate-400 text-sm">
                      No se encontraron usuarios con ese criterio de búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODALS */}
      <GiftModal
        user={giftingUser}
        mounted={mounted}
        onClose={() => setGiftingUser(null)}
        onSuccess={fetchUsers}
      />
      <UserManagementModal
        managingUser={managingUser}
        mounted={mounted}
        onClose={() => setManagingUser(null)}
        onSuccess={fetchUsers}
      />
    </div>
  );
}
