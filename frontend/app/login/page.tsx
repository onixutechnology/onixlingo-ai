'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { User, Lock, Loader2, AlertCircle, ArrowRight, Eye, EyeOff, ShieldCheck, CheckCircle2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.onixlingo.onixu.company';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Limpiar estados al escribir para mejorar la UX
  useEffect(() => {
    if (status === 'error') setStatus('idle');
  }, [username, password]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        // Almacenamiento seguro de tokens y sesión
        if (data.access_token) {
          Cookies.set('access_token', data.access_token, { 
            expires: 1, 
            secure: true, 
            sameSite: 'strict',
            path: '/'
          });
        }
        Cookies.set('username', data.username || username, { expires: 1, path: '/' });
        
        // Pequeña pausa para que el usuario vea el check verde de éxito
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh(); 
        }, 800);

      } else {
        setStatus('error');
        setErrorMessage(data.detail || 'Credenciales inválidas. Verifica tu usuario y contraseña.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      setStatus('error');
      setErrorMessage('El servidor está inactivo o hay un problema de red. Por favor, intenta de nuevo.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-500/30 selection:text-indigo-900">
      {/* Decoración de fondo adaptada a modo claro */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-300/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-300/20 rounded-full blur-[120px]" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mx-auto h-14 w-14 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20 mb-6">
          <ShieldCheck className="text-white" size={32} />
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight sm:text-4xl">
          Onix<span className="text-indigo-600">Lingo</span>
        </h2>
        <p className="mt-3 text-slate-500 font-medium">
          Enterprise Language Management System
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500 delay-150">
        <div className="bg-white/90 backdrop-blur-xl py-8 px-6 shadow-2xl shadow-slate-200/50 border border-slate-200 rounded-3xl sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            
            {/* INPUT USUARIO */}
            <div>
              <label htmlFor="username" className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                Usuario
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <input
                  id="username"
                  type="text"
                  required
                  disabled={status === 'loading' || status === 'success'}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 border border-slate-300 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all sm:text-sm disabled:opacity-50 disabled:bg-slate-50"
                  placeholder="Tu nombre de usuario"
                />
              </div>
            </div>

            {/* INPUT CONTRASEÑA */}
            <div>
              <div className="flex items-center justify-between mb-2 ml-1">
                <label htmlFor="password" className="block text-sm font-bold text-slate-700">
                  Contraseña
                </label>
                <Link href="/forgot-password" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={status === 'loading' || status === 'success'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-12 py-3.5 border border-slate-300 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all sm:text-sm disabled:opacity-50 disabled:bg-slate-50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={status === 'loading' || status === 'success'}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* ALERTA DE ERROR */}
            {status === 'error' && (
              <div className="flex items-start gap-3 text-red-600 bg-red-50 p-4 rounded-xl border border-red-200 text-sm animate-in shake">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-medium">{errorMessage}</p>
              </div>
            )}

            {/* BOTÓN DE ACCIÓN */}
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className={`w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-lg text-sm font-bold text-white transition-all group disabled:cursor-not-allowed
                ${status === 'success' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20 active:scale-[0.98]'}
              `}
            >
              {status === 'loading' ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : status === 'success' ? (
                <>
                  <CheckCircle2 className="h-5 w-5" /> ¡Acceso Concedido!
                </>
              ) : (
                <>
                  Acceder al Sistema
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-500">
              ¿Eres nuevo en la plataforma?{' '}
              <Link href="/register" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                Crea una cuenta gratuita
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}