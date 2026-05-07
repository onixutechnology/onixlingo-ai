'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Lock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const RAW_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.onixlingo.onixu.company/api/v1';
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
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-4 shadow-sm border border-emerald-200">
          <CheckCircle className="h-8 w-8 text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">¡Todo listo!</h3>
        <p className="text-slate-500 text-sm mb-6">{message}</p>
        <Link href="/login" className="w-full flex justify-center py-3 px-4 rounded-xl shadow-lg shadow-indigo-600/20 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all">
          Ir a iniciar sesión
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
      {!token && (
        <div className="flex items-start gap-3 text-amber-700 bg-amber-50 p-4 rounded-xl border border-amber-200 text-sm font-medium mb-4">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <p>No se detectó un token válido en la URL. Solicita un nuevo enlace desde la pantalla de inicio de sesión.</p>
        </div>
      )}

      <div>
        <label htmlFor="password" className="block text-sm font-bold text-slate-700 mb-2 ml-1">
          Nueva Contraseña
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          </div>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full pl-12 pr-4 py-3.5 border border-slate-300 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 sm:text-sm transition-all"
            placeholder="••••••••"
          />
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-bold text-slate-700 mb-2 ml-1">
          Confirmar Contraseña
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          </div>
          <input
            id="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block w-full pl-12 pr-4 py-3.5 border border-slate-300 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 sm:text-sm transition-all"
            placeholder="••••••••"
          />
        </div>
      </div>

      {status === 'error' && (
        <div className="flex items-start gap-3 text-red-600 bg-red-50 p-4 rounded-xl border border-red-200 text-sm font-medium animate-in shake">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{message}</p>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={status === 'loading' || !token}
          className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-600/20 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {status === 'loading' ? <Loader2 className="animate-spin h-5 w-5" /> : 'Guardar nueva contraseña'}
        </button>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-indigo-500/30 selection:text-indigo-900">
      
      {/* Decoración de fondo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-300/20 rounded-full blur-[120px]" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h2 className="mt-6 text-center text-3xl font-black text-slate-900 tracking-tight">
          Nueva Contraseña
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500 font-medium">
          Asegúrate de usar una contraseña segura y que no olvides.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500 delay-150">
        <div className="bg-white/90 backdrop-blur-xl py-8 px-6 shadow-2xl shadow-slate-200/50 border border-slate-200 rounded-3xl sm:px-10 relative overflow-hidden">
          
          <Suspense fallback={<div className="text-center text-indigo-600 py-6"><Loader2 className="animate-spin h-8 w-8 mx-auto" /></div>}>
            <ResetPasswordForm />
          </Suspense>
          
        </div>
      </div>
    </div>
  );
}