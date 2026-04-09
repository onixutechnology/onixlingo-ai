'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { User, Lock, Loader2, AlertCircle, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';

// Priorizamos la variable de entorno, pero usamos la URL de Render como fallback seguro
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://onixlingo-bckend.onrender.com';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
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
        // Almacenamiento seguro de tokens y sesión
        if (data.access_token) {
          Cookies.set('access_token', data.access_token, { 
            expires: 1, 
            secure: true, 
            sameSite: 'strict' 
          });
        }
        Cookies.set('username', data.username || username, { expires: 1 });
        
        // Redirección inmediata al Dashboard
        router.push('/dashboard');
        router.refresh(); 
      } else {
        setStatus('error');
        // Manejo detallado de errores del backend
        setErrorMessage(data.detail || 'Credenciales inválidas. Verifica tu usuario y contraseña.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      setStatus('error');
      setErrorMessage('No se pudo conectar con el servidor. Verifica tu conexión.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-500/30">
      {/* Decoración de fondo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="mx-auto h-14 w-14 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/20 mb-6 border border-indigo-400/20">
          <ShieldCheck className="text-white" size={32} />
        </div>
        <h2 className="text-4xl font-black text-white tracking-tight sm:text-4xl">
          Onix<span className="text-indigo-500">Lingo</span>
        </h2>
        <p className="mt-3 text-slate-400 font-medium">
          Enterprise Language Management System
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#0F1623]/80 backdrop-blur-xl py-8 px-6 shadow-2xl border border-slate-800/60 rounded-3xl sm:px-10">
          
          <form className="space-y-6" onSubmit={handleLogin}>
            {/* INPUT USUARIO */}
            <div>
              <label htmlFor="username" className="block text-sm font-bold text-slate-300 mb-2 ml-1">
                Usuario
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  id="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 border border-slate-700 rounded-xl bg-[#0B0F19]/50 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all sm:text-sm"
                  placeholder="Tu nombre de usuario"
                />
              </div>
            </div>

            {/* INPUT CONTRASEÑA */}
            <div>
              <div className="flex items-center justify-between mb-2 ml-1">
                <label htmlFor="password" className="block text-sm font-bold text-slate-300">
                  Contraseña
                </label>
                <Link href="/forgot-password" size-sm className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-11 py-3 border border-slate-700 rounded-xl bg-[#0B0F19]/50 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all sm:text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* ALERTA DE ERROR */}
            {status === 'error' && (
              <div className="flex items-start gap-3 text-red-400 bg-red-400/5 p-4 rounded-xl border border-red-400/20 text-sm animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{errorMessage}</p>
              </div>
            )}

            {/* BOTÓN DE ACCIÓN */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-600/20 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-[#0B0F19] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {status === 'loading' ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  Acceder al Sistema
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-8 pt-6 border-t border-slate-800/60 text-center">
            <p className="text-sm text-slate-400">
              ¿Eres nuevo en la plataforma?{' '}
              <Link href="/register" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                Crea una cuenta gratuita
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
