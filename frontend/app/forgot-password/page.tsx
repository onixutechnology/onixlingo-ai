'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, ArrowRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import apiClient from '@/lib/apiClient';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const { data } = await apiClient.post('/auth/forgot-password', { email });
      setStatus('success');
      setMessage(data.message || 'Enlace de recuperación enviado.');
    } catch (error: any) {
      setStatus('error');
      const detail = error.response?.data?.detail;
      setMessage(detail || 'Error de conexión.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 px-4 font-sans selection:bg-teal-100 selection:text-teal-900 relative">

      <div className="sm:mx-auto sm:w-full sm:max-w-[400px] text-center relative z-10 mb-8">
        <div className="mx-auto h-10 w-10 bg-teal-600 flex items-center justify-center mb-4">
          <Mail className="text-white" size={20} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase font-serif italic leading-none">
          Recuperar <span className="text-teal-600">Acceso</span>
        </h2>
        <p className="mt-2 text-[8px] font-black text-slate-400 uppercase tracking-[0.4em]">
          Protocolo de Restablecimiento de Credenciales
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-[400px] relative z-10">
        <div className="bg-white border border-slate-200 p-10 shadow-none rounded-none">

          {status === 'success' ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 bg-emerald-50 border border-emerald-100 mb-6">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase font-serif italic mb-4">Verifique su Correo</h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed mb-8">
                {message}
              </p>
              <Link href="/login">
                <button className="w-full py-4 bg-slate-900 text-white text-[9px] font-black uppercase tracking-[0.2em] hover:bg-teal-600 transition-all">
                  Retornar al Sistema
                </button>
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">
                  Dirección Institucional
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-300" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-none bg-slate-50 text-slate-900 placeholder-slate-300 focus:outline-none focus:border-teal-600 transition-all text-[11px] font-bold"
                    placeholder="ejemplo@empresa.com"
                  />
                </div>
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 border border-red-100 text-[9px] font-black uppercase tracking-tight">
                  <AlertCircle size={14} className="shrink-0" />
                  <p>{message}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex justify-center items-center gap-2 py-4 px-4 bg-teal-600 text-white text-[9px] font-black uppercase tracking-[0.2em] hover:bg-teal-700 active:scale-95 transition-all shadow-md shadow-teal-600/20 disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <>SOLICITAR ENLACE <ArrowRight size={14} /></>
                )}
              </button>

              <div className="flex items-center justify-center pt-4 border-t border-slate-100">
                <Link href="/login" className="flex items-center gap-2 text-[9px] font-black text-slate-400 hover:text-teal-600 transition-colors uppercase tracking-[0.2em]">
                  <ArrowLeft size={12} /> Cancelar y Volver
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
