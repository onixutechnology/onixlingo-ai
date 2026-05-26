'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Mail, Lock, Loader2, AlertCircle, ArrowRight, CheckCircle2, ShieldPlus } from 'lucide-react';
import Cookies from 'js-cookie';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import apiClient from '@/lib/apiClient';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get('ref');

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    invitedByCode: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (refCode) {
      setFormData(prev => ({ ...prev, invitedByCode: refCode }));
    }
  }, [refCode]);

  useEffect(() => {
    if (status === 'error') setStatus('idle');
  }, [formData]);

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
      
      router.push('/dashboard');
      router.refresh();
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.response?.data?.detail || 'Fallo de autenticación con Google.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Discrepancia en contraseñas.');
      setStatus('error');
      return;
    }
    if (formData.password.length < 6) {
      setErrorMessage('Seguridad insuficiente (Min 6).');
      setStatus('error');
      return;
    }

    setStatus('loading');
    try {
      await apiClient.post('/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        invited_by_code: formData.invitedByCode.trim()
      });
      setStatus('success');
      setTimeout(() => router.push('/login'), 2500);
    } catch (error: any) {
      setStatus('error');
      const detail = error.response?.data?.detail;
      setErrorMessage(detail || 'Fallo en registro.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (status === 'success') {
    return (
      <div className="text-center space-y-6 py-10">
        <div className="mx-auto h-12 w-12 bg-emerald-50 rounded-none flex items-center justify-center border border-emerald-200">
          <CheckCircle2 className="text-emerald-600" size={24} />
        </div>
        <h3 className="text-lg font-black text-slate-900 uppercase font-serif italic tracking-tighter">Proceso Completado</h3>
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Redirección automática en curso...</p>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleRegister}>
      {refCode && (
        <div className="bg-teal-50 border border-teal-100 text-teal-700 px-4 py-2 rounded-none text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
          <ShieldPlus size={14} />
          <span>Vínculo de Referencia Activado</span>
        </div>
      )}

      <div>
        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Identificador de Usuario</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
          <input
            type="text"
            name="username"
            required
            className="block w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-none bg-slate-50 text-slate-900 text-[11px] font-bold focus:outline-none focus:border-teal-600 transition-all placeholder-slate-300"
            placeholder="Usuario_01"
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div>
        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Correo Institucional</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
          <input
            type="email"
            name="email"
            required
            className="block w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-none bg-slate-50 text-slate-900 text-[11px] font-bold focus:outline-none focus:border-teal-600 transition-all placeholder-slate-300"
            placeholder="tu@dominio.com"
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Clave</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
            <input
              type="password"
              name="password"
              required
              className="block w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-none bg-slate-50 text-slate-900 text-[11px] font-bold focus:outline-none focus:border-teal-600 transition-all placeholder-slate-300"
              placeholder="••••••••"
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div>
          <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Verificación</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
            <input
              type="password"
              name="confirmPassword"
              required
              className="block w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-none bg-slate-50 text-slate-900 text-[11px] font-bold focus:outline-none focus:border-teal-600 transition-all placeholder-slate-300"
              placeholder="••••••••"
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
      <div>
        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Código de Acceso Institucional (Opcional)</label>
        <div className="relative">
          <ShieldPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-600" />
          <input
            type="text"
            name="invitedByCode"
            className="block w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-none bg-slate-50 text-slate-900 text-[11px] font-bold focus:outline-none focus:border-teal-600 transition-all placeholder-slate-300"
            placeholder="ONX-YYYY-USR-XXXX (Opcional)"
            value={formData.invitedByCode}
            onChange={handleInputChange}
          />
        </div>
        <p className="mt-1 text-[8px] font-black text-slate-400 uppercase tracking-[0.15em] leading-normal">
          Opcional. Si dispones de un código de acceso o invitación institucional, ingrésalo aquí.
        </p>
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 border border-red-100 text-[9px] font-black uppercase tracking-tight">
          <AlertCircle size={14} className="shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full flex justify-center items-center gap-2 py-4 px-4 rounded-none text-[9px] font-black uppercase tracking-[0.2em] text-white bg-teal-600 hover:bg-teal-700 active:scale-95 transition-all disabled:opacity-50"
      >
        {status === 'loading' ? (
          <Loader2 className="animate-spin h-4 w-4" />
        ) : (
          <>REGISTRAR NUEVO USUARIO <ArrowRight size={14} /></>
        )}
      </button>

      {/* Divisor Google */}
      <div className="relative my-6 flex items-center justify-center">
        <div className="border-t border-slate-200 w-full"></div>
        <span className="bg-white px-3 text-[9px] text-slate-400 font-bold uppercase tracking-wider absolute">o inscríbete con</span>
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
          text="signup_with"
          width="360"
        />
      </div>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 px-4 font-sans selection:bg-teal-100 selection:text-teal-900 relative">
        
        <div className="sm:mx-auto sm:w-full sm:max-w-[440px] text-center relative z-10 mb-8">
          <div className="mx-auto h-10 w-10 bg-teal-600 flex items-center justify-center mb-4">
            <ShieldPlus className="text-white" size={20} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase font-serif italic leading-none">
            Inscripción Onix<span className="text-teal-600">Lingo</span>
          </h2>
          <p className="mt-2 text-[8px] font-black text-slate-400 uppercase tracking-[0.4em]">
            Alta de Cuenta Institucional
          </p>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-[440px] relative z-10">
          <div className="bg-white border border-slate-200 p-10 shadow-none rounded-none">
            <Suspense fallback={<div className="flex justify-center py-8"><Loader2 className="animate-spin text-teal-600 h-6 w-6" /></div>}>
              <RegisterForm />
            </Suspense>

            <div className="mt-8 pt-8 border-t border-slate-100 text-center">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                ¿Registro previo completado?{' '}
                <Link href="/login" className="text-teal-600 hover:text-teal-700 transition-colors">
                  Iniciar Sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}