'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useProgressStore } from '@/store/progressStore'; 
import { LogIn, User, Lock, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

// Detecta automáticamente si estás en Local o en Render
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001';

export default function LoginPage() {
  const router = useRouter();
  const { loadProgressFromDB } = useProgressStore();

  // Estados
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log(`🔐 Conectando a: ${API_URL}/api/v1/login`);

      const res = await fetch(`${API_URL}/api/v1/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || "Usuario o contraseña incorrectos");
      }

      // LOGIN EXITOSO
      // 1. Guardar sesión
      localStorage.setItem('currentUser', formData.username);
      
      // 2. Cargar progreso (si existe)
      if (data.progress) {
        loadProgressFromDB(data.progress);
      }
      
      // 3. Redirigir al Dashboard
      router.push('/dashboard');

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-100 overflow-hidden">
        
        {/* Header Visual */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 text-white shadow-inner">
            <LogIn size={32} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">Bienvenido</h1>
          <p className="text-blue-100 mt-2 text-sm font-medium">Accede a tu cuenta OnixLingo</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-3 border border-red-100 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={20} className="shrink-0" /> 
              <span className="font-semibold">{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-wider">Usuario</label>
              <div className="relative group">
                <User className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Ej. onixuser" 
                  value={formData.username} 
                  onChange={e => setFormData({...formData, username: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-slate-700"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-wider">Contraseña</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-medium text-slate-700"
                  required
                />
              </div>
            </div>
            
            <button 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/30 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Ingresar al Dashboard <ArrowRight size={20} /></>}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-slate-100">
            <p className="text-slate-500 text-sm mb-2 font-medium">¿Nuevo en la plataforma?</p>
            {/* OJO: Aquí asumo que tu ruta de registro es /register o /auth/register. Ajusta el href si es necesario */}
            <Link 
              href="/register" 
              className="inline-flex items-center gap-1 text-blue-600 font-black hover:text-blue-700 hover:underline transition-colors"
            >
              Crear una cuenta gratis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}