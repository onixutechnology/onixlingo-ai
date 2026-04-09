'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Loader2, AlertCircle, ArrowRight, CheckCircle2, ShieldPlus } from 'lucide-react';

// URL de tu backend en Render
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://onixlingo-bckend.onrender.com';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Limpiar errores al escribir
  useEffect(() => {
    if (status === 'error') setStatus('idle');
  }, [formData]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Validación básica de contraseñas
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        // Redirigir al login después de 2 segundos para que vean el éxito
        setTimeout(() => router.push('/login'), 2500);
      } else {
        setStatus('error');
        setErrorMessage(data.detail || 'No se pudo crear la cuenta. Intenta con otro usuario o email.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Error de conexión con el servidor de OnixLingo.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-500/30">
      {/* Decoración de fondo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="mx-auto h-14 w-14 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/20 mb-6 border border-indigo-400/20">
          <ShieldPlus className="text-white" size={32} />
        </div>
        <h2 className="text-4xl font-black text-white tracking-tight">
          Únete a Onix<span className="text-indigo-500">Lingo</span>
        </h2>
        <p className="mt-3 text-slate-400 font-medium">
          Crea tu cuenta empresarial hoy mismo
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#0F1623]/80 backdrop-blur-xl py-8 px-6 shadow-2xl border border-slate-800/60 rounded-3xl sm:px-10">
          
          {status === 'success' ? (
            <div className="text-center space-y-4 py-8 animate-in zoom-in duration-500">
              <div className="mx-auto h-20 w-20 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 className="text-emerald-500" size={48} />
              </div>
              <h3 className="text-2xl font-bold text-white">¡Registro Exitoso!</h3>
              <p className="text-slate-400">Tu cuenta ha sido creada. Redirigiendo al panel de acceso...</p>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleRegister}>
              {/* USUARIO */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2 ml-1">Usuario</label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-3 h-5 w-5 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="text"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-slate-700 rounded-xl bg-[#0B0F19]/50 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                    placeholder="Ej: jacob_onix"
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2 ml-1">Email Corporativo</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-3 h-5 w-5 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                  <input
                    type="email"
                    required
                    className="w-full pl-11 pr-4 py-3 border border-slate-700 rounded-xl bg-[#0B0F19]/50 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                    placeholder="tu@onixu.company"
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              {/* CONTRASEÑAS EN GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2 ml-1">Contraseña</label>
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-3 border border-slate-700 rounded-xl bg-[#0B0F19]/50 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                    placeholder="••••••••"
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-300 mb-2 ml-1">Confirmar</label>
                  <input
                    type="password"
                    required
                    className="w-full px-4 py-3 border border-slate-700 rounded-xl bg-[#0B0F19]/50 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all"
                    placeholder="••••••••"
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                </div>
              </div>

              {/* ERROR */}
              {status === 'error' && (
                <div className="flex items-center gap-3 text-red-400 bg-red-400/5 p-4 rounded-xl border border-red-400/20 text-sm animate-in shake">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p>{errorMessage}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-600/20 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <>
                    Crear mi Cuenta
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-slate-800/60 text-center">
            <p className="text-sm text-slate-400">
              ¿Ya eres parte de OnixLingo?{' '}
              <Link href="/login" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
