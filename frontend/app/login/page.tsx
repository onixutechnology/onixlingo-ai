'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { User, Lock, Loader2, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

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
        // Guardamos el token en las cookies para que el resto de la app lo detecte
        if (data.access_token) {
          Cookies.set('access_token', data.access_token, { expires: 1 });
        }
        Cookies.set('username', data.username, { expires: 1 });
        
        // Redirigimos al LMS
        router.push('/dashboard');
      } else {
        setStatus('error');
        setErrorMessage(data.detail || 'Credenciales inválidas. Inténtalo de nuevo.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Error de conexión con el servidor.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-indigo-500/30">
      {/* HEADER LOGO Y TÍTULO */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-4">
          <Lock className="text-white" size={24} />
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight">
          Bienvenido de vuelta
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Ingresa tus credenciales para acceder a OnixLingo
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#0F1623] py-8 px-4 shadow-2xl shadow-indigo-500/5 border border-slate-800/60 sm:rounded-2xl sm:px-10 relative overflow-hidden">
          {/* Efecto de luz de fondo */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <form className="space-y-6 relative z-10" onSubmit={handleLogin}>
            
            {/* CAMPO USUARIO */}
            <div>
              <label htmlFor="username" className="block text-sm font-bold text-slate-300 mb-2">
                Usuario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-700 rounded-xl bg-[#0B0F19] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                  placeholder="Tu nombre de usuario"
                />
              </div>
            </div>

            {/* CAMPO CONTRASEÑA CON ENLACE DE RECUPERACIÓN */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-bold text-slate-300">
                  Contraseña
                </label>
                {/* 🚀 AQUÍ ESTÁ LA CONEXIÓN MÁGICA 🚀 */}
                <Link href="/forgot-password" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-slate-700 rounded-xl bg-[#0B0F19] text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* ALERTA DE ERROR */}
            {status === 'error' && (
              <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p>{errorMessage}</p>
              </div>
            )}

            {/* BOTÓN DE LOGIN */}
            <div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-[#0B0F19] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {status === 'loading' ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <>
                    Iniciar Sesión
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* ENLACE AL REGISTRO */}
          <div className="mt-6 text-center text-sm text-slate-400">
            ¿No tienes una cuenta?{' '}
            <Link href="/register" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
              Regístrate aquí
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
