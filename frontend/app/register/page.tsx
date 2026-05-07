'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, Mail, Lock, Loader2, AlertCircle, ArrowRight, CheckCircle2, ShieldPlus } from 'lucide-react';

const RAW_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.onixlingo.onixu.company/api/v1';
const API_URL = RAW_URL.endsWith('/api/v1') ? RAW_URL : `${RAW_URL.replace(/\/$/, '')}/api/v1`;

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCode = searchParams.get('ref'); // 🎁 Capturamos el código de referido si existe

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
      setErrorMessage('Las contraseñas no coinciden. Verifícalas e intenta de nuevo.');
      setStatus('error');
      return;
    }
    
    // 2. Validación de longitud de contraseña
    if (formData.password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          invited_by_code: refCode // 🔥 Enviamos el código al backend
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        // Redirigir al login después de 2.5 segundos para que vean el éxito
        setTimeout(() => router.push('/login'), 2500);
      } else {
        setStatus('error');
        setErrorMessage(data.detail || 'No se pudo crear la cuenta. Es posible que el usuario o email ya existan.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Error de conexión con el servidor. Verifica tu internet o intenta en unos minutos.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (status === 'success') {
    return (
      <div className="text-center space-y-4 py-8 animate-in zoom-in duration-500">
        <div className="mx-auto h-20 w-20 bg-emerald-100 rounded-full flex items-center justify-center border border-emerald-200 shadow-sm">
          <CheckCircle2 className="text-emerald-600" size={48} />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">¡Registro Exitoso!</h3>
        <p className="text-slate-500 font-medium">Tu cuenta ha sido creada. Preparando tu entorno seguro...</p>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleRegister}>
      
      {/* ALERTA DE REFERIDO (Opcional, para que el usuario sepa que su código funcionó) */}
      {refCode && status === 'idle' && (
        <div className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
          <ShieldPlus size={18} className="text-indigo-600" />
          <span>¡Código VIP detectado! Obtendrás 30 días gratis al registrarte.</span>
        </div>
      )}

      {/* USUARIO */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Usuario</label>
        <div className="relative group">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input
            type="text"
            name="username"
            required
            disabled={status === 'loading'}
            className="block w-full pl-12 pr-4 py-3.5 border border-slate-300 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all sm:text-sm disabled:opacity-50 disabled:bg-slate-50"
            placeholder="Ej: jacob_onix"
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* EMAIL */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Email Corporativo</label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input
            type="email"
            name="email"
            required
            disabled={status === 'loading'}
            className="block w-full pl-12 pr-4 py-3.5 border border-slate-300 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all sm:text-sm disabled:opacity-50 disabled:bg-slate-50"
            placeholder="tu@empresa.com"
            onChange={handleInputChange}
          />
        </div>
      </div>

      {/* CONTRASEÑAS EN GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative group">
          <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Contraseña</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="password"
              name="password"
              required
              disabled={status === 'loading'}
              className="block w-full pl-10 pr-4 py-3.5 border border-slate-300 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all text-sm disabled:opacity-50 disabled:bg-slate-50"
              placeholder="••••••••"
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="relative group">
          <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Confirmar</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="password"
              name="confirmPassword"
              required
              disabled={status === 'loading'}
              className="block w-full pl-10 pr-4 py-3.5 border border-slate-300 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all text-sm disabled:opacity-50 disabled:bg-slate-50"
              placeholder="••••••••"
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      {/* ERROR */}
      {status === 'error' && (
        <div className="flex items-start gap-3 text-red-600 bg-red-50 p-4 rounded-xl border border-red-200 text-sm font-medium animate-in shake">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{errorMessage}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full flex justify-center items-center gap-2 mt-2 py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-600/20 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none group"
      >
        {status === 'loading' ? (
          <Loader2 className="animate-spin h-5 w-5" />
        ) : (
          <>
            Crear mi Cuenta
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-500/30 selection:text-indigo-900">
      
      {/* Decoración de fondo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-300/20 rounded-full blur-[120px]" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mx-auto h-14 w-14 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20 mb-6">
          <ShieldPlus className="text-white" size={32} />
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">
          Únete a Onix<span className="text-indigo-600">Lingo</span>
        </h2>
        <p className="mt-3 text-slate-500 font-medium">
          Crea tu cuenta empresarial hoy mismo
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500 delay-150">
        <div className="bg-white/90 backdrop-blur-xl py-8 px-6 shadow-2xl shadow-slate-200/50 border border-slate-200 rounded-3xl sm:px-10">
          
          {/* Envolvemos el formulario en Suspense por el uso de useSearchParams */}
          <Suspense fallback={<div className="flex justify-center py-8"><Loader2 className="animate-spin text-indigo-600 h-8 w-8" /></div>}>
            <RegisterForm />
          </Suspense>

          <div className="mt-8 pt-6 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-500">
              ¿Ya eres parte de OnixLingo?{' '}
              <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}