'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Lock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const RAW_URL = process.env.NODE_ENV === 'production' ? 'https://api.onixlingo.onixu.company/api/v1' : 'http://127.0.0.1:5000/api/v1';
const API_URL = RAW_URL.endsWith('/api/v1') ? RAW_URL : `${RAW_URL.replace(/\/$/, '')}/api/v1`;

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Las contraseñas no coinciden.');
      return;
    }

    if (!token) {
      setStatus('error');
      setMessage('Enlace inválido o expirado.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: password }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Contraseña actualizada correctamente.');
      } else {
        setStatus('error');
        setMessage(data.detail || 'Error al actualizar la contraseña.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Error de conexión con el servidor.');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center relative z-10 animate-in zoom-in-95 duration-500">
        <div className="mx-auto flex items-center justify-center h-16 w-16 bg-slate-50 mb-4 border border-[#D4AF37]">
          <CheckCircle className="h-8 w-8 text-[#D4AF37]" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">¡Todo listo!</h3>
        <p className="text-slate-600 text-sm mb-6">{message}</p>
        <Link href="/login" className="w-full flex justify-center py-3 px-4 shadow-none text-sm font-bold text-black bg-[#D4AF37] hover:bg-[#b5952f] active:scale-[0.98] transition-all uppercase tracking-widest">
          Ir a iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
      {!token && (
        <div className="flex items-start gap-3 text-[#D4AF37] bg-red-900/10 p-4 border border-red-500/20 text-sm font-medium mb-4">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <p>No se detectó un token válido en la URL. Solicita un nuevo enlace desde la pantalla de inicio de sesión.</p>
        </div>
      )}

      <div>
        <label htmlFor="password" className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
          Nueva Contraseña
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-[#D4AF37] transition-colors" />
          </div>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-none bg-white text-slate-900 placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] text-xs font-bold transition-all"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
          Confirmar Contraseña
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-[#D4AF37] transition-colors" />
          </div>
          <input
            id="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-none bg-white text-slate-900 placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] text-xs font-bold transition-all"
            placeholder="••••••••"
          />
        </div>
      </div>

      {status === 'error' && (
        <div className="flex items-start gap-3 text-[#D4AF37] bg-red-900/10 p-4 border border-red-500/20 text-[9px] font-black uppercase tracking-tight animate-in shake">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{message}</p>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={status === 'loading' || !token}
          className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-none shadow-none shadow-[#D4AF37]/10 text-[9px] font-black uppercase tracking-[0.2em] text-black bg-[#D4AF37] hover:bg-[#b5952f] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {status === 'loading' ? <Loader2 className="animate-spin h-5 w-5" /> : 'Guardar nueva contraseña'}
        </button>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-[#D4AF37]/30 selection:text-slate-900">
      
      {/* Decoración de fondo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#D4AF37]/10 rounded-full blur-[120px]" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h2 className="mt-6 text-center text-3xl font-black text-slate-900 tracking-tight font-serif italic">
          Nueva Contraseña
        </h2>
        <p className="mt-2 text-center text-xs text-slate-500 font-bold uppercase tracking-widest">
          Asegúrate de usar una contraseña segura y que no olvides.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500 delay-150">
        <div className="bg-white py-8 px-6 shadow-2xl border border-slate-200 rounded-none sm:px-10 relative overflow-hidden">
          
          <Suspense fallback={<div className="text-center text-[#D4AF37] py-6"><Loader2 className="animate-spin h-8 w-8 mx-auto" /></div>}>
            <ResetPasswordForm />
          </Suspense>
          
        </div>
      </div>
    </div>
  );
}