'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Lock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001';

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
      const res = await fetch(`${API_URL}/api/v1/auth/reset-password`, {
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
      <div className="text-center relative z-10">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/10 mb-4">
          <CheckCircle className="h-8 w-8 text-emerald-500" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">¡Todo listo!</h3>
        <p className="text-slate-400 text-sm mb-6">{message}</p>
        <Link href="/login" className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-all">
          Ir a iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
      {!token && (
        <div className="flex items-center gap-2 text-amber-400 bg-amber-400/10 p-3 rounded-lg border border-amber-400/20 text-sm font-medium mb-4">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>No se detectó un token válido en la URL.</p>
        </div>
      )}

      <div>
        <label htmlFor="password" className="block text-sm font-bold text-slate-300 mb-2">
          Nueva Contraseña
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-slate-500" />
          </div>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-700 rounded-xl bg-[#0B0F19] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-bold text-slate-300 mb-2">
          Confirmar Contraseña
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-slate-500" />
          </div>
          <input
            id="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-700 rounded-xl bg-[#0B0F19] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
            placeholder="••••••••"
          />
        </div>
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20 text-sm font-medium">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{message}</p>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={status === 'loading' || !token}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-[#0B0F19] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? <Loader2 className="animate-spin h-5 w-5" /> : 'Guardar nueva contraseña'}
        </button>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-indigo-500/30">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-black text-white tracking-tight">
          Nueva Contraseña
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Asegúrate de usar una contraseña segura y que no olvides.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#0F1623] py-8 px-4 shadow-2xl shadow-indigo-500/5 border border-slate-800/60 sm:rounded-2xl sm:px-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <Suspense fallback={<div className="text-center text-indigo-400 py-6"><Loader2 className="animate-spin h-8 w-8 mx-auto" /></div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
