'use client';
import LandingFooter from '@/components/LandingFooter';
import LandingNavbar from '@/components/LandingNavbar';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Mail, Lock, Loader2, AlertCircle, ArrowRight, CheckCircle2, ShieldPlus, Eye, EyeOff } from 'lucide-react';
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
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
          secure: process.env.NODE_ENV === 'production', 
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
        <div className="mx-auto h-12 w-12 bg-white rounded-none flex items-center justify-center border border-[#D4AF37]">
          <CheckCircle2 className="text-[#D4AF37]" size={24} />
        </div>
        <h3 className="text-lg font-black text-slate-900 uppercase font-serif italic tracking-tighter">Proceso Completado</h3>
        <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em]">Redirección automática en curso...</p>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleRegister}>
      {refCode && (
        <div className="bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] px-4 py-2 rounded-none text-[8px] font-black uppercase tracking-widest flex items-center gap-2">
          <ShieldPlus size={14} />
          <span>Vínculo de Referencia Activado</span>
        </div>
      )}

      <div>
        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 text-center">Identificador de Usuario</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-4 w-4 text-slate-500" />
          </div>
          <input
            type="text"
            name="username"
            required
            disabled={status === 'loading'}
            value={formData.username}
            className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-none bg-white text-slate-900 placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] transition-all text-xs font-bold disabled:opacity-50"
            placeholder="Usuario_01"
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div>
        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 text-center">Correo Electrónico</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-4 w-4 text-slate-500" />
          </div>
          <input
            type="email"
            name="email"
            required
            disabled={status === 'loading'}
            value={formData.email}
            className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-none bg-white text-slate-900 placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] transition-all text-xs font-bold disabled:opacity-50"
            placeholder="tu@dominio.com"
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 text-center">Clave</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-slate-500" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              disabled={status === 'loading'}
              value={formData.password}
              className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-none bg-white text-slate-900 placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] transition-all text-xs font-bold disabled:opacity-50"
              placeholder="••••••••"
              onChange={handleInputChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={status === 'loading'}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-900 transition-colors"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 text-center">Verificación</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-slate-500" />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              required
              disabled={status === 'loading'}
              value={formData.confirmPassword}
              className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-none bg-white text-slate-900 placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] transition-all text-xs font-bold disabled:opacity-50"
              placeholder="••••••••"
              onChange={handleInputChange}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={status === 'loading'}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-900 transition-colors"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 text-center">Código de Acceso PRO (Opcional)</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ShieldPlus className="h-4 w-4 text-[#D4AF37]" />
          </div>
          <input
            type="text"
            name="invitedByCode"
            disabled={status === 'loading'}
            className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-none bg-white text-slate-900 placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] transition-all text-xs font-bold disabled:opacity-50"
            placeholder="ONX-YYYY-USR-XXXX"
            value={formData.invitedByCode}
            onChange={handleInputChange}
          />
        </div>
        <p className="mt-1.5 text-[8px] font-black text-slate-500 uppercase tracking-[0.15em] leading-normal text-center">
          Si tienes un código de acceso PRO, ingrésalo aquí para activar todos los beneficios.
        </p>
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-655 bg-[#D4AF37]/10 p-3 border border-red-100 text-[9px] font-black uppercase tracking-tight">
          <AlertCircle size={14} className="shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-none text-[9px] font-black uppercase tracking-[0.2em] text-black bg-[#D4AF37] hover:bg-[#b5952f] active:scale-95 shadow-none shadow-[#D4AF37]/10 transition-all disabled:cursor-not-allowed"
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
        <span className="bg-slate-50 px-3 text-[9px] text-slate-500 font-bold uppercase tracking-wider absolute">o inscríbete con</span>
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
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-slate-900">
        <LandingNavbar />
        
        {/* BOTTOM PANEL - FORM */}
        <div className="w-full flex-1 flex flex-col justify-center py-12 pt-32 px-6 sm:px-12 lg:px-24 relative z-10">
          <div className="max-w-[360px] w-full mx-auto space-y-6 bg-slate-50 border border-slate-200 p-8 shadow-2xl">
            
            {/* Logo and Header */}
            <div className="flex flex-col items-center text-center mb-2">
              <Link
                href="/"
                className="flex items-center gap-1.5 text-slate-600 hover:text-[#D4AF37] transition-colors text-[10px] font-black uppercase tracking-widest mb-4 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Regresar al inicio
              </Link>
              <Link href="/" className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-[#D4AF37] flex items-center justify-center text-black font-bold shadow-none shadow-[#D4AF37]/20 border border-[#D4AF37]/30">
                  <span>O</span>
                </div>
                <span className="font-extrabold text-slate-900 tracking-tight text-xl">OnixLingo</span>
              </Link>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-4">
                Nos alegra que estés aquí.
              </h2>
              <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                Crea tu cuenta para comenzar tu formación estratégica multilingüe y cognitiva.
              </p>
            </div>

            {/* FORM */}
            <Suspense fallback={<div className="flex justify-center py-8"><Loader2 className="animate-spin text-[#D4AF37] h-6 w-6" /></div>}>
              <RegisterForm />
            </Suspense>

            {/* Footer links */}
            <div className="mt-8 pt-6 border-t border-slate-200 text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                ¿Registro previo completado?{' '}
                <Link href="/login" className="text-[#D4AF37] hover:text-[#b5952f] transition-colors">
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