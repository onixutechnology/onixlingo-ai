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
  };  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    { title: "Soberanía Multilingüe", description: "Aprende Inglés, Francés, Chino Mandarín y Ajedrez en una sola plataforma integrada.", highlight: "MCER Avanzado" },
    { title: "Simulador Boardroom C-Suite", description: "Entrena oratoria corporativa, pitch de inversión y diplomacia directiva.", highlight: "Feedback Acústico" },
    { title: "Ajedrez Cognitivo", description: "Potencia tu capacidad de análisis táctico y toma de decisiones ejecutivas.", highlight: "Pensamiento Estratégico" },
    { title: "Repetición Espaciada SRS", description: "Asimila más de 3,000 términos clave e incorpora vocabulario técnico y diplomático.", highlight: "Retención Científica" },
    { title: "Negociación Global", description: "Desarrolla habilidades de persuasión en escenarios de alto nivel con stakeholders.", highlight: "Liderazgo Directivo" },
    { title: "Inmersión Fonométrica", description: "Perfecciona tu pronunciación y acento con métricas exactas e instantáneas.", highlight: "Precisión 98.4%" },
    { title: "Resolución de Conflictos", description: "Aprende el lenguaje de la mediación y gestión de crisis en entornos complejos.", highlight: "Diplomacia" },
    { title: "Finanzas Internacionales", description: "Domina el vocabulario de fusiones, adquisiciones y mercados bursátiles.", highlight: "Vocabulario C-Suite" },
    { title: "Oratoria de Impacto", description: "Estructura discursos que inspiran y movilizan a tu organización hacia el éxito.", highlight: "Comunicación Efectiva" },
    { title: "Visión Estratégica", description: "Anticipa movimientos del mercado y desarrolla tácticas con ajedrez.", highlight: "Análisis Crítico" },
    { title: "Networking Ejecutivo", description: "Construye relaciones sólidas y expansivas con socios clave en el mundo.", highlight: "Relaciones Globales" },
    { title: "Agilidad Mental", description: "Resuelve problemas bajo presión de tiempo con ejercicios cognitivos.", highlight: "Rendimiento Óptimo" },
    { title: "Liderazgo Intercultural", description: "Gestiona equipos diversos con empatía y comprensión profunda de culturas.", highlight: "Gestión de Equipos" },
    { title: "Presentaciones C-Level", description: "Comunica resultados financieros y estrategias de crecimiento con claridad.", highlight: "Storytelling" },
    { title: "Pensamiento Lateral", description: "Encuentra soluciones innovadoras a desafíos empresariales mediante estrategia.", highlight: "Innovación" },
    { title: "Gramática Avanzada", description: "Estructura contratos, correos y reportes con una precisión impecable.", highlight: "Redacción Ejecutiva" },
    { title: "Simulaciones de Crisis", description: "Practica tu respuesta ante situaciones de estrés y protege la reputación.", highlight: "Manejo de Crisis" },
    { title: "Dominio de Mandarín", description: "Abre las puertas al mercado asiático con fluidez en acuerdos comerciales.", highlight: "Expansión Asiática" },
    { title: "Excelencia en Francés", description: "Comunícate con elegancia y precisión en los mercados europeos francófonos.", highlight: "Alcance Europeo" },
    { title: "Fluidez en Inglés", description: "Consolida tu presencia como líder en el idioma universal de los negocios.", highlight: "Estándar Global" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
      <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
        
        {/* TOP PANEL - CAROUSEL */}
        <div className="w-full flex-none bg-sky-50 flex flex-col md:flex-row items-center justify-between p-3 sm:px-8 lg:px-12 relative overflow-hidden border-b border-sky-100 min-h-[60px]">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-teal-200/40 blur-[80px] opacity-60 rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[150px] h-[150px] bg-sky-200/40 blur-[60px] opacity-40 rounded-full pointer-events-none" />

          {/* Top tagline */}
          <div className="relative z-10 flex items-center mb-1 md:mb-0">
            <span className="px-2 py-0.5 bg-teal-100 border border-teal-200 text-teal-700 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
              Executive Speeches
            </span>
          </div>

          {/* Active Slide Display */}
          <div className="relative z-10 w-full md:flex-1 text-center md:text-right overflow-hidden ml-0 md:ml-4">
            <div className="relative h-10 flex flex-col justify-center">
              {slides.map((s, idx) => (
                <div
                  key={idx}
                  className={`transition-all duration-700 w-full flex flex-col md:flex-row items-center md:justify-end gap-1 md:gap-3 ${activeSlide === idx ? 'opacity-100 translate-y-0 absolute' : 'opacity-0 translate-y-2 absolute hidden'}`}
                >
                  <span className="text-sky-600 font-mono text-xs font-black uppercase tracking-wider hidden lg:block whitespace-nowrap">
                    {s.highlight}
                  </span>
                  <h3 className="text-base font-black text-slate-900 tracking-tight whitespace-nowrap">
                    {s.title}
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed font-medium hidden md:block truncate max-w-[60%]">
                    {s.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Slide Indicators */}
            <div className="flex gap-0.5 mt-0.5 justify-center md:justify-end">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-[2px] transition-all duration-300 rounded-none ${activeSlide === idx ? 'w-3 bg-teal-500' : 'w-1 bg-slate-300 hover:bg-slate-400'}`}
                  title={`Diapositiva ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM PANEL - FORM */}
        <div className="w-full flex-1 flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-24 bg-white relative z-10">
          <div className="max-w-[360px] w-full mx-auto space-y-6">
            
            {/* Logo and Header */}
            <div className="flex flex-col items-center text-center mb-2">
              <Link
                href="/"
                className="flex items-center gap-1.5 text-slate-400 hover:text-teal-600 transition-colors text-[10px] font-black uppercase tracking-widest mb-4 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Regresar al inicio
              </Link>
              <Link href="/" className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-teal-600 flex items-center justify-center text-white font-bold shadow-lg shadow-teal-600/20">
                  <span>O</span>
                </div>
                <span className="font-extrabold text-slate-900 tracking-tight text-xl">OnixLingo</span>
              </Link>
              <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight mt-4">
                Nos alegra que estés aquí.
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
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
                    className="block w-full pl-10 pr-4 py-3 border border-slate-200 rounded-none bg-slate-50 text-slate-900 placeholder-slate-350 focus:outline-none focus:border-teal-600 transition-all text-xs font-bold disabled:opacity-50"
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
                    className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-none bg-slate-50 text-slate-900 placeholder-slate-355 focus:outline-none focus:border-teal-600 transition-all text-xs font-bold disabled:opacity-50"
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
                <div className="flex items-center gap-2 text-red-655 bg-red-50 p-3 border border-red-100 text-[9px] font-black uppercase tracking-tight">
                  <AlertCircle size={14} className="shrink-0" />
                  <p>{errorMessage}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className={`w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-none text-[9px] font-black uppercase tracking-[0.2em] text-white transition-all disabled:cursor-not-allowed
                  ${status === 'success' ? 'bg-emerald-600' : 'bg-slate-900 hover:bg-teal-600 active:scale-95 shadow-md shadow-slate-900/10'}
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
                width="360"
              />
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
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