'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { 
  Users, Crown, ShieldAlert, ArrowLeft, Search, 
  Gift, Loader2, CheckCircle2, AlertCircle, Database
} from 'lucide-react';

interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: string;
  is_pro: boolean;
  tier: string;
  valid_until: string | null;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [grantingId, setGrantingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = Cookies.get('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.onixlingo.onixu.company';
      const res = await fetch(`${API_URL}/api/v1/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.status === 403) {
        setError('Acceso Denegado: No tienes privilegios de Administrador.');
        setLoading(false);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      } else {
        setError('Error al cargar la base de datos de usuarios.');
      }
    } catch (err) {
      setError('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleGrantPro = async (userId: number, username: string) => {
    if (!confirm(`¿Estás seguro de regalar 30 días VIP a ${username}?`)) return;
    
    setGrantingId(userId);
    try {
      const token = Cookies.get('access_token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.onixlingo.onixu.company';
      
      const res = await fetch(`${API_URL}/api/v1/admin/grant-pro/${userId}?days=30`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        alert(`¡30 Días VIP otorgados exitosamente a ${username}!`);
        fetchUsers(); // Recargamos la tabla
      } else {
        const errData = await res.json();
        alert(`Error: ${errData.detail}`);
      }
    } catch (error) {
      alert("Error conectando con el servidor.");
    } finally {
      setGrantingId(null);
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-indigo-500">
      <Loader2 className="animate-spin mb-4" size={48} />
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Accediendo a Base de Datos...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-6">
      <ShieldAlert size={64} className="text-red-500 mb-6" />
      <h1 className="text-2xl font-bold text-white mb-2">Acceso Restringido</h1>
      <p className="text-slate-400 mb-8">{error}</p>
      <button onClick={() => router.push('/dashboard')} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-500 transition-colors flex items-center gap-2">
        <ArrowLeft size={18} /> Volver al Hub
      </button>
    </div>
  );

  const premiumCount = users.filter(u => u.is_pro).length;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 md:p-12 font-sans selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400"><Database size={24} /></div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Onix Command Center</h1>
            </div>
            <p className="text-slate-400 text-sm">Gestión global de usuarios, suscripciones y accesos VIP.</p>
          </div>
          <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-slate-900 border border-slate-800 px-5 py-2.5 rounded-xl font-bold text-sm w-fit">
            <ArrowLeft size={16} /> Salir del Panel
          </button>
        </div>

        {/* STATS WIDGETS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex items-center gap-4">
            <div className="p-4 bg-blue-500/10 text-blue-400 rounded-xl"><Users size={28} /></div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Usuarios</p>
              <p className="text-3xl font-black text-white">{users.length}</p>
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex items-center gap-4">
            <div className="p-4 bg-amber-500/10 text-amber-400 rounded-xl"><Crown size={28} /></div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Usuarios Premium</p>
              <p className="text-3xl font-black text-white">{premiumCount}</p>
            </div>
          </div>
        </div>

        {/* BÚSQUEDA Y TABLA */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900/50">
            <h2 className="text-lg font-bold text-white">Directorio de Cuentas</h2>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Buscar por email o usuario..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-sm text-white rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 text-slate-400 text-xs uppercase tracking-widest">
                  <th className="p-4 font-bold">ID</th>
                  <th className="p-4 font-bold">Usuario</th>
                  <th className="p-4 font-bold">Nivel</th>
                  <th className="p-4 font-bold">Expiración VIP</th>
                  <th className="p-4 font-bold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 text-slate-500 font-mono">#{u.id}</td>
                    <td className="p-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        {u.username} 
                        {/* 🔥 AQUÍ ESTÁ LA CORRECCIÓN: Envolvemos en un span con title */}
                        {u.role === 'admin' && <span title="Administrador"><ShieldAlert size={14} className="text-red-400" /></span>}
                      </div>
                      <div className="text-xs text-slate-500">{u.email}</div>
                    </td>
                    <td className="p-4">
                      {u.is_pro ? (
                        <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                          <Crown size={12} /> {u.tier}
                        </span>
                      ) : (
                        <span className="inline-flex bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                          Free
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-slate-400 font-mono text-xs">
                      {u.valid_until ? new Date(u.valid_until).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => handleGrantPro(u.id, u.username)}
                        disabled={grantingId === u.id}
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
                      >
                        {grantingId === u.id ? <Loader2 size={14} className="animate-spin" /> : <Gift size={14} />}
                        +30 Días VIP
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      No se encontraron usuarios en la base de datos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}