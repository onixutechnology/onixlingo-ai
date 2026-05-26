'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { User, Lock, Loader2, AlertCircle, ArrowRight, Eye, EyeOff, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
          secure: true, 
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
          secure: true, 
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
      <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 px-4 font-sans selection:bg-teal-100 selection:text-teal-900 relative">
        
        <div className="sm:mx-auto sm:w-full sm:max-w-[400px] text-center relative z-10 mb-8">
          <div className="mx-auto h-10 w-10 bg-teal-600 flex items-center justify-center mb-4">
            <ShieldCheck className="text-white" size={20} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase font-serif italic leading-none">
            Onix<span className="text-teal-600">Lingo</span>
          </h2>
          <p className="mt-2 text-[8px] font-black text-slate-400 uppercase tracking-[0.4em]">
            Plataforma de Control Educativo
          </p>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-[400px] relative z-10">
          <div className="bg-white border border-slate-200 p-10 shadow-none rounded-none">
            <form className="space-y-6" onSubmit={handleLogin}>
              
              <div>
                <label htmlFor="username" className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">
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
                    className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-none bg-slate-50 text-slate-900 placeholder-slate-300 focus:outline-none focus:border-teal-600 transition-all text-[11px] font-bold disabled:opacity-50"
                    placeholder="Usuario / Email"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2 ml-1">
                  <label htmlFor="password" className="block text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    Clave de Acceso
                  </label>
                  <Link href="/forgot-password" className="text-[8px] font-black text-teal-600 hover:text-teal-700 transition-colors uppercase tracking-widest">
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
                    className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-none bg-slate-50 text-slate-900 placeholder-slate-300 focus:outline-none focus:border-teal-600 transition-all text-[11px] font-bold disabled:opacity-50"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={status === 'loading' || status === 'success'}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 border border-red-100 text-[9px] font-black uppercase tracking-tight">
                  <AlertCircle size={14} className="shrink-0" />
                  <p>{errorMessage}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className={`w-full flex justify-center items-center gap-2 py-4 px-4 rounded-none text-[9px] font-black uppercase tracking-[0.2em] text-white transition-all disabled:cursor-not-allowed
                  ${status === 'success' ? 'bg-emerald-600' : 'bg-slate-900 hover:bg-teal-600 active:scale-95'}
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
              <span className="bg-white px-3 text-[9px] text-slate-400 font-bold uppercase tracking-wider absolute">o ingresa con</span>
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
                width="320"
              />
            </div>

            <div className="mt-10 pt-8 border-t border-slate-100 text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                ¿Nueva incorporación?{' '}
                <Link href="/register" className="text-teal-600 hover:text-teal-700 transition-colors">
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