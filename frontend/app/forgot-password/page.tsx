'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const RAW_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.onixlingo.onixu.company/api/v1';
const API_URL = RAW_URL.endsWith('/api/v1') ? RAW_URL : `${RAW_URL.replace(/\/$/, '')}/api/v1`;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(data.message || 'Te hemos enviado un enlace de recuperación al correo.');
      } else {
        setStatus('error');
        setMessage(data.detail || 'Ocurrió un error. Inténtalo de nuevo.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Error de conexión con el servidor.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-indigo-500/30">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-black text-white tracking-tight">
          Recuperar acceso
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Ingresa tu correo y te enviaremos un enlace mágico para restablecer tu contraseña.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#0F1623] py-8 px-4 shadow-2xl shadow-indigo-500/5 border border-slate-800/60 sm:rounded-2xl sm:px-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          {status === 'success' ? (
            <div className="text-center relative z-10">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/10 mb-4">
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">¡Revisa tu bandeja!</h3>
              <p className="text-slate-400 text-sm mb-6">{message}</p>
              <Link href="/login" className="w-full flex justify-center py-2.5 px-4 border border-slate-700 rounded-xl shadow-sm text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 focus:outline-none transition-all">
                Volver al inicio de sesión
              </Link>
            </div>
          ) : (
            <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-slate-300 mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-700 rounded-xl bg-[#0B0F19] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                    placeholder="tu@correo.com"
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
                  disabled={status === 'loading'}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-[#0B0F19] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? <Loader2 className="animate-spin h-5 w-5" /> : 'Enviar enlace mágico'}
                </button>
              </div>

              <div className="flex items-center justify-center mt-6">
                <Link href="/login" className="flex items-center gap-2 font-medium text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                  <ArrowLeft className="h-4 w-4" /> Volver al Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
