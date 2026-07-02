'use client';
import React, { useState, useEffect } from 'react';
import LandingNavbar from '@/components/LandingNavbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { User, Lock, Loader2, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

import apiClient from '@/lib/apiClient';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (status === 'error') setStatus('idle');
  }, [username, password]);

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setStatus('loading');
    setErrorMessage('');
    
    try {
      const { data } = await apiClient.post('/auth/google', {
        token: credentialResponse.credential
      });

      setStatus('success');
      
      if (data.access_token) {
        Cookies.set('access_token', data.access_token, { 
          expires: 1, 
          secure: process.env.NODE_ENV === 'production', 
          sameSite: 'lax',
          path: '/'
        });
      }
      Cookies.set('username', data.username, { expires: 1, path: '/' });
      
      try {
        const userRes = await apiClient.get('/users/me');
        const userData = userRes.data;
        setTimeout(() => {
          if (userData.role === 'admin') router.push('/admin');
          else router.push('/dashboard');
          router.refresh(); 
        }, 800);
      } catch (roleError) {
        setTimeout(() => { router.push('/dashboard'); router.refresh(); }, 800);
      }
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.response?.data?.detail || 'Fallo de autenticación con Google.');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const { data } = await apiClient.post('/auth/login', { username, password });
      setStatus('success');
      
      if (data.access_token) {
        Cookies.set('access_token', data.access_token, { 
          expires: 1, 
          secure: process.env.NODE_ENV === 'production', 
          sameSite: 'lax',
          path: '/'
        });
      }
      Cookies.set('username', data.username || username, { expires: 1, path: '/' });
      
      try {
        const userRes = await apiClient.get('/users/me');
        const userData = userRes.data;
        setTimeout(() => {
          if (userData.role === 'admin') router.push('/admin');
          else router.push('/dashboard');
          router.refresh(); 
        }, 800);
      } catch (roleError) {
        setTimeout(() => { router.push('/dashboard'); router.refresh(); }, 800);
      }
    } catch (error: any) {
      setStatus('error');
      const detail = error.response?.data?.detail;
      setErrorMessage(detail || 'Fallo de autenticación.');
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-slate-900">
        <LandingNavbar />
        
        {/* BOTTOM PANEL - FORM */}
        <div className="w-full flex-1 flex flex-col justify-center py-12 pt-32 px-6 sm:px-12 lg:px-24 relative z-10">
          <div className="max-w-[360px] w-full mx-auto space-y-6 bg-slate-50 border border-slate-200 p-8 shadow-2xl animate-scale-in opacity-0">
            
            {/* Logo and Header */}
            <div className="flex flex-col items-center text-center mb-2">
              <Link
                href="/"
                className="flex items-center gap-1.5 text-slate-500 hover:text-[#D4AF37] transition-colors text-[10px] font-black uppercase tracking-widest mb-4 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Regresar al inicio
              </Link>
              <Link href="/" className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-[#D4AF37]/20 flex items-center justify-center text-[#050510] font-bold shadow-none shadow-amber-500/20">
                  <span>O</span>
                </div>
                <span className="font-extrabold text-slate-900 tracking-tight text-xl">OnixLingo</span>
              </Link>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-4">
                Nos alegra que estés aquí.
              </h2>
              <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                Introduce tu identificador para acceder a los simuladores de la plataforma.
              </p>
            </div>

            {/* FORM */}
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label htmlFor="username" className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 text-center">
                  Identificador
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-300" />
                  </div>
                  <input
                    id="username"
                    type="text"
                    required
                    disabled={status === 'loading' || status === 'success'}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-none bg-white text-slate-900 placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/30 transition-all text-xs font-bold disabled:opacity-50"
                    placeholder="Usuario / Email"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <label htmlFor="password" className="block text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    Clave de Acceso
                  </label>
                  <span className="text-slate-300 text-[8px] font-black">·</span>
                  <Link href="/forgot-password" className="text-[8px] font-black text-[#D4AF37] hover:text-amber-400 transition-colors uppercase tracking-widest">
                    Recuperar
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-300" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={status === 'loading' || status === 'success'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-none bg-white text-slate-900 placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]/30 transition-all text-xs font-bold disabled:opacity-50"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={status === 'loading' || status === 'success'}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-655 bg-[#D4AF37]/10 p-3 border border-red-100 text-[9px] font-black uppercase tracking-tight">
                  <AlertCircle size={14} className="shrink-0" />
                  <p>{errorMessage}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className={`w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-none text-[9px] font-black uppercase tracking-[0.2em] text-[#050510] transition-all disabled:cursor-not-allowed
                  ${status === 'success' ? 'bg-[#D4AF37]/100' : 'bg-[#D4AF37]/20 hover:bg-amber-400 active:scale-95 shadow-none shadow-amber-500/10'}
                `}
              >
                {status === 'loading' ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : status === 'success' ? (
                  <>ACCESO AUTORIZADO</>
                ) : (
                  <>VALIDAR CREDENCIALES <ArrowRight size={14} /></>
                )}
              </button>
            </form>

            {/* Divisor Google */}
            <div className="relative my-6 flex items-center justify-center">
              <div className="border-t border-slate-200 w-full"></div>
              <span className="bg-slate-50 px-3 text-[9px] text-slate-500 font-bold uppercase tracking-wider absolute">o ingresa con</span>
            </div>

            {/* Botón de Google */}
            <div className="flex justify-center w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  setStatus('error');
                  setErrorMessage('Error al conectar con Google.');
                }}
                theme="outline"
                shape="square"
                text="signin_with"
                width="360"
              />
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                ¿Nueva incorporación?{' '}
                <Link href="/register" className="text-[#D4AF37] hover:text-amber-400 transition-colors">
                  Registro de Usuario
                </Link>
              </p>
            </div>
          </div>
        </div>

      </div>
    </GoogleOAuthProvider>
  );
}