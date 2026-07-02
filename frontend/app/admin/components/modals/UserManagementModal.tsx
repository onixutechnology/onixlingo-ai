"use client";

import { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Crown, ShieldAlert, Trash2, KeyRound, X,
  User, Zap, Star, Ban, CheckCircle, RefreshCw,
  ChevronDown, Loader2, ShieldCheck, AlertTriangle
} from 'lucide-react';
import Cookies from 'js-cookie';

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
}

interface UserManagementModalProps {
  managingUser: AdminUser | null;
  mounted: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TIERS = [
  { id: 'free', label: 'Free', icon: <User size={14} />, color: '#64748b', isPro: false },
  { id: 'pro', label: 'Pro', icon: <Zap size={14} />, color: '#3b82f6', isPro: true },
  { id: 'executive', label: 'Executive', icon: <Crown size={14} />, color: '#8b5cf6', isPro: true },
  { id: 'titanium', label: 'Titanium', icon: <Star size={14} />, color: '#f59e0b', isPro: true },
];

export default function UserManagementModal({
  managingUser,
  mounted,
  onClose,
  onSuccess,
}: UserManagementModalProps) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [activeSection, setActiveSection] = useState<'tier' | 'role' | 'danger'>('tier');

  if (!managingUser || !mounted) return null;

  const token = () => localStorage.getItem('admin_token') || Cookies.get('access_token');

  const call = async (method: string, path: string, body?: object, confirmMsg?: string) => {
    if (confirmMsg && !confirm(confirmMsg)) return;
    setLoading(true);
    setFeedback(null);
    try {
      const res = await fetch(`${API_URL}/api/v1/admin${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${token()}`,
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({ type: 'success', msg: data.message || 'Acción ejecutada correctamente' });
        onSuccess();
      } else {
        setFeedback({ type: 'error', msg: data.detail || 'Error al ejecutar la acción' });
      }
    } catch {
      setFeedback({ type: 'error', msg: 'Error de conexión con el servidor' });
    } finally {
      setLoading(false);
    }
  };

  const handleTierChange = (tier: string, isPro: boolean) =>
    call('PUT', `/users/${managingUser.id}/tier`, { tier, is_pro: isPro });

  const handleRoleChange = (role: string) =>
    call('PUT', `/users/${managingUser.id}/role`, { role }, `¿Cambiar rol a ${role}?`);

  const handleBan = () =>
    call('POST', `/users/${managingUser.id}/ban`, undefined, managingUser.role !== 'admin'
      ? `¿Suspender/Activar la cuenta de ${managingUser.username}?`
      : undefined);

  const handleDelete = () =>
    call('DELETE', `/users/${managingUser.id}`, undefined,
      `⚠️ IRREVERSIBLE: ¿Eliminar permanentemente la cuenta de "${managingUser.username}"?`);

  const handleResetPassword = () => {
    const pwd = prompt('Nueva contraseña temporal para este usuario:');
    if (pwd) call('PUT', `/users/${managingUser.id}/password`, { new_password: pwd });
  };

  const currentTier = TIERS.find(t => t.id === managingUser.tier.toLowerCase()) || TIERS[0];

  const sections = [
    { id: 'tier', label: 'Nivel / Tier', icon: <Crown size={12} /> },
    { id: 'role', label: 'Rol Sistema', icon: <ShieldCheck size={12} /> },
    { id: 'danger', label: 'Zona Peligrosa', icon: <AlertTriangle size={12} /> },
  ] as const;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md  animate-in zoom-in-95 duration-200 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-slate-900">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 flex items-center justify-center font-black text-sm"
              style={{ background: `${currentTier.color}20`, color: currentTier.color, border: `1px solid ${currentTier.color}40` }}
            >
              {managingUser.username.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-black text-white leading-tight">{managingUser.username}</p>
              <p className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">{managingUser.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-slate-100">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${
                activeSection === s.id
                  ? s.id === 'danger'
                    ? 'border-b-2 border-red-500 text-red-600 bg-red-50'
                    : 'border-b-2 border-[#1d4ed8] text-indigo-700 bg-indigo-50'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-4 bg-slate-50/40">
          {/* ── TIER SECTION ── */}
          {activeSection === 'tier' && (
            <div className="space-y-3">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
                Nivel actual: <span className="font-black" style={{ color: currentTier.color }}>{currentTier.label}</span>
              </p>
              <div className="grid grid-cols-2 gap-2">
                {TIERS.map(tier => (
                  <button
                    key={tier.id}
                    onClick={() => handleTierChange(tier.id, tier.isPro)}
                    disabled={loading}
                    className="relative p-3 flex items-center gap-2 transition-all text-sm font-black rounded-none disabled:opacity-50"
                    style={{
                      background: managingUser.tier.toLowerCase() === tier.id ? `${tier.color}10` : '#fff',
                      border: managingUser.tier.toLowerCase() === tier.id
                        ? `2px solid ${tier.color}60`
                        : '1px solid #e2e8f0',
                      color: tier.color,
                    }}
                  >
                    {tier.icon}
                    <span className="text-slate-800">{tier.label}</span>
                    {managingUser.tier.toLowerCase() === tier.id && (
                      <CheckCircle size={12} className="absolute top-1 right-1" style={{ color: tier.color }} />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 italic">
                Cambiar el nivel no suma días de acceso. Para regalar días usa el botón 🎁 en la tabla.
              </p>
            </div>
          )}

          {/* ── ROLE SECTION ── */}
          {activeSection === 'role' && (
            <div className="space-y-3">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">
                Rol actual: <span className="text-slate-700 font-black">{managingUser.role}</span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleRoleChange('user')}
                  disabled={loading}
                  className={`flex-1 py-3 text-sm font-black font-mono uppercase border transition-all rounded-none disabled:opacity-50 flex items-center justify-center gap-2 ${
                    managingUser.role === 'user'
                      ? 'bg-slate-900 text-white border-[#1d4ed8]'
                      : 'bg-white border-[#1d4ed8] text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <User size={14} /> Estudiante
                </button>
                <button
                  onClick={() => handleRoleChange('admin')}
                  disabled={loading}
                  className={`flex-1 py-3 text-sm font-black font-mono uppercase border transition-all rounded-none disabled:opacity-50 flex items-center justify-center gap-2 ${
                    managingUser.role === 'admin'
                      ? 'bg-red-500 text-white border-red-500'
                      : 'bg-white border-[#1d4ed8] text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                  }`}
                >
                  <ShieldAlert size={14} /> Admin
                </button>
              </div>
              <div
                className="p-3 bg-amber-50 border border-[#1d4ed8] text-amber-700 text-xs leading-relaxed"
              >
                ⚠️ Otorgar rol <strong>Admin</strong> le da acceso completo a este panel de control. Solo asigna esta función a personas de confianza del equipo.
              </div>
            </div>
          )}

          {/* ── DANGER ZONE ── */}
          {activeSection === 'danger' && (
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-[11px] leading-relaxed">
                Las acciones de esta sección pueden afectar de forma permanente la cuenta del usuario. Procede con cautela.
              </div>
              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full py-3 bg-white border border-[#1d4ed8] hover:bg-blue-50 hover:border-[#1d4ed8] text-slate-700 hover:text-blue-700 text-sm font-black font-mono uppercase flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <KeyRound size={15} /> Forzar Nueva Contraseña
              </button>
              <button
                onClick={handleBan}
                disabled={loading}
                className="w-full py-3 bg-white border border-[#1d4ed8] hover:bg-amber-50 text-amber-700 text-sm font-black font-mono uppercase flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Ban size={15} /> Suspender / Reactivar Cuenta
              </button>
              <button
                onClick={handleDelete}
                disabled={loading || managingUser.role === 'admin'}
                className="w-full py-3 bg-red-50 hover:bg-red-100 border border-red-300 text-red-600 text-sm font-black font-mono uppercase flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Trash2 size={15} /> Eliminar Cuenta Definitivamente
              </button>
              {managingUser.role === 'admin' && (
                <p className="text-[10px] text-slate-400 text-center italic">No puedes eliminar cuentas con rol Admin</p>
              )}
            </div>
          )}

          {/* Feedback */}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-indigo-600 font-mono">
              <Loader2 size={12} className="animate-spin" /> Procesando...
            </div>
          )}
          {feedback && (
            <div
              className={`px-3 py-2.5 text-xs font-mono flex items-center gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-50 border border-[#1d4ed8] text-emerald-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}
            >
              {feedback.type === 'success' ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
              {feedback.msg}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
