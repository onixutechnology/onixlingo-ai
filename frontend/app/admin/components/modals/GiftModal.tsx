"use client";

import { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Gift, Crown, Zap, X, Mail, MessageSquare,
  Check, Loader2, Calendar, Send, Star
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

interface GiftModalProps {
  user: AdminUser | null;
  mounted: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TIER_OPTIONS = [
  {
    id: 'pro',
    label: 'PRO',
    icon: <Zap size={18} />,
    color: '#2563eb',
    lightBg: '#eff6ff',
    lightBorder: '#bfdbfe',
    textColor: '#1d4ed8',
    desc: 'Tutores automatizados, lecciones avanzadas, pronunciación',
  },
  {
    id: 'executive',
    label: 'EXECUTIVE',
    icon: <Crown size={18} />,
    color: '#7c3aed',
    lightBg: '#f5f3ff',
    lightBorder: '#ddd6fe',
    textColor: '#6d28d9',
    desc: 'Salas B2B, negociaciones, IAs especializadas',
  },
  {
    id: 'titanium',
    label: 'TITANIUM',
    icon: <Star size={18} />,
    color: '#d97706',
    lightBg: '#fffbeb',
    lightBorder: '#fde68a',
    textColor: '#b45309',
    desc: 'Acceso total, prioridad máxima, todas las IAs',
  },
];

const DAY_OPTIONS = [7, 14, 30, 60, 90, 180, 365];

export default function GiftModal({ user, mounted, onClose, onSuccess }: GiftModalProps) {
  const [selectedTier, setSelectedTier] = useState('pro');
  const [selectedDays, setSelectedDays] = useState(30);
  const [message, setMessage] = useState('');
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!user || !mounted) return null;

  const activeTier = TIER_OPTIONS.find(t => t.id === selectedTier)!;

  const handleSendGift = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('admin_token') || Cookies.get('access_token');
      const res = await fetch(`${API_URL}/api/v1/admin/users/${user.id}/gift`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier: selectedTier,
          days: selectedDays,
          message: message.trim(),
          notify_email: notifyEmail,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
          setSuccess(false);
        }, 2000);
      } else {
        setError(data.detail || 'Error al procesar el regalo');
      }
    } catch {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const expiryPreview = () => {
    const d = new Date();
    d.setDate(d.getDate() + selectedDays);
    return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden border border-slate-200">

        {/* Header — borde de color del tier activo */}
        <div
          className="flex justify-between items-center px-6 py-5 border-b-2"
          style={{ borderBottomColor: activeTier.color, background: activeTier.lightBg }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 flex items-center justify-center"
              style={{ background: activeTier.lightBg, border: `1.5px solid ${activeTier.lightBorder}`, color: activeTier.color }}
            >
              <Gift size={18} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 tracking-wide uppercase">Enviar Regalo</h3>
              <p className="text-[10px] font-mono tracking-widest" style={{ color: activeTier.textColor }}>
                → {user.username} · {user.email}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white/60 rounded transition-colors">
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 bg-white">
            <div
              className="w-16 h-16 flex items-center justify-center animate-bounce border-2"
              style={{ background: activeTier.lightBg, borderColor: activeTier.color }}
            >
              <Check size={30} style={{ color: activeTier.color }} />
            </div>
            <p className="font-black text-xl uppercase tracking-wider" style={{ color: activeTier.textColor }}>¡Regalo Enviado!</p>
            <p className="text-slate-500 text-sm text-center">
              {notifyEmail ? `Correo enviado a ${user.email}` : 'Acceso activado exitosamente'}
            </p>
          </div>
        ) : (
          <div className="p-6 space-y-5 bg-white overflow-y-auto max-h-[75vh]">

            {/* ── 1. Tier ── */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                1. Nivel de Acceso
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TIER_OPTIONS.map(tier => (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    className="relative p-3 flex flex-col items-center gap-1.5 transition-all duration-150"
                    style={{
                      background: selectedTier === tier.id ? tier.lightBg : '#f8fafc',
                      border: selectedTier === tier.id ? `2px solid ${tier.color}` : '1.5px solid #e2e8f0',
                      color: selectedTier === tier.id ? tier.textColor : '#64748b',
                    }}
                  >
                    <span style={{ color: selectedTier === tier.id ? tier.color : '#94a3b8' }}>{tier.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">{tier.label}</span>
                    {selectedTier === tier.id && (
                      <div
                        className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center"
                        style={{ background: tier.color }}
                      >
                        <Check size={9} color="white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ── 2. Duración ── */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                2. Duración del Regalo
              </label>
              <div className="flex flex-wrap gap-2">
                {DAY_OPTIONS.map(d => (
                  <button
                    key={d}
                    onClick={() => setSelectedDays(d)}
                    className="px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all border"
                    style={{
                      background: selectedDays === d ? activeTier.lightBg : '#f8fafc',
                      border: selectedDays === d ? `1.5px solid ${activeTier.color}` : '1.5px solid #e2e8f0',
                      color: selectedDays === d ? activeTier.textColor : '#64748b',
                    }}
                  >
                    {d === 365 ? '1 Año' : `${d} días`}
                  </button>
                ))}
              </div>

              {/* Preview de vencimiento */}
              <div
                className="mt-2.5 flex items-center gap-2 px-3 py-2 text-xs"
                style={{ background: activeTier.lightBg, border: `1px solid ${activeTier.lightBorder}` }}
              >
                <Calendar size={12} style={{ color: activeTier.color }} />
                <span className="text-slate-500">Acceso hasta:</span>
                <span className="font-black text-slate-800">{expiryPreview()}</span>
              </div>
            </div>

            {/* ── 3. Mensaje ── */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                3. Mensaje Personalizado{' '}
                <span className="text-slate-300 normal-case font-normal">(opcional)</span>
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                maxLength={280}
                rows={3}
                placeholder="Escribe un mensaje especial... (aparecerá en el correo)"
                className="w-full text-sm resize-none outline-none text-slate-700 placeholder:text-slate-300 p-3 border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-slate-50"
              />
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <MessageSquare size={9} /> Se incluirá en el correo de notificación
                </span>
                <span className="text-[10px] text-slate-400">{message.length}/280</span>
              </div>
            </div>

            {/* ── 4. Toggle email ── */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2.5">
                <Mail size={14} style={{ color: notifyEmail ? activeTier.color : '#94a3b8' }} />
                <div>
                  <p className="text-xs font-black text-slate-700 uppercase tracking-wider">Notificar por correo</p>
                  <p className="text-[10px] text-slate-400">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => setNotifyEmail(!notifyEmail)}
                className="w-10 h-5 relative transition-all duration-300 rounded-full"
                style={{
                  background: notifyEmail ? activeTier.color : '#e2e8f0',
                  border: `1px solid ${notifyEmail ? activeTier.color : '#cbd5e1'}`,
                }}
              >
                <span
                  className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-300"
                  style={{ left: notifyEmail ? 'calc(100% - 18px)' : '2px' }}
                />
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-xs font-mono">
                ❌ {error}
              </div>
            )}

            {/* CTA */}
            <button
              onClick={handleSendGift}
              disabled={loading}
              className="w-full py-3.5 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-60 text-white"
              style={{ background: activeTier.color }}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <Send size={15} />
                  Enviar {selectedDays === 365 ? '1 Año' : `${selectedDays} Días`} {activeTier.label}
                  {notifyEmail && ' + Email'}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
