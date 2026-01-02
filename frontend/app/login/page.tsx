'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProgressStore } from '@/store/progressStore'; 
import { LogIn, UserPlus, User, Lock, Mail, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

// Detecta automáticamente si estás en Local o en Render
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001';

export default function AuthPage() {
  const router = useRouter();
  const { loadProgressFromDB } = useProgressStore();

  // --- ESTADO DEL INTERRUPTOR (LOGIN vs REGISTER) ---
  const [isRegister, setIsRegister] = useState(false); // false = Login, true = Registro

  // Estados del formulario
  const [formData, setFormData] = useState({ username: '', password: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Limpiar formulario al cambiar de modo
  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError(null);
    setFormData({ username: '', password: '', email: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Seleccionamos el endpoint según el modo
    const endpoint = isRegister ? '/api/v1/register' : '/api/v1/login';
    const url = `${API_URL}${endpoint}`;

    try {
      console.log(`🔐 Conectando a: ${url}`);

      // Preparamos los datos (Email solo se envía si es registro)
      const payload = isRegister 
        ? formData 
        : { username: formData.username, password: formData.password };

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || "Ocurrió un error en la solicitud");
      }

      // --- LÓGICA DE ÉXITO ---
      if (isRegister) {
        // CASO 1: REGISTRO EXITOSO
        alert("¡Cuenta creada con éxito! Ahora inicia sesión.");
        toggleMode(); // Cambiamos automáticamente a la vista de Login
      } else {
        // CASO 2: LOGIN EXITOSO
        localStorage.setItem('currentUser', formData.username);
        
        if (data.progress) {
          loadProgressFromDB(data.progress);
        }
        
        router.push('/dashboard');
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 transition-all">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-100 overflow-hidden relative">
        
        {/* Header Visual Dinámico */}
        <div className={`p-8 text-center transition-colors duration-500 ${isRegister ? 'bg-purple-600' : 'bg-blue-600'}`}>
          <div className="mx-auto w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 text-white shadow-inner">
            {isRegister ? <UserPlus size={32} /> : <LogIn size={32} />}
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight animate-in fade-in slide-in-from-bottom-2">
            {isRegister ? 'Crear Cuenta' : 'Bienvenido'}
          </h1>
          <p className="text-white/80 mt-2 text-sm font-medium">
            {isRegister ? 'Únete a OnixLingo hoy mismo' : 'Accede a tu progreso'}
          </p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-3 border border-red-100 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={20} className="shrink-0" /> 
              <span className="font-semibold">{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* INPUT: USUARIO (Siempre visible) */}
            <div className="space-y-1">
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

            {/* INPUT: EMAIL (Solo visible en Registro) */}
            {isRegister && (
              <div className="space-y-1 animate-in fade-in slide-in-from-top-4">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1 tracking-wider">Correo Electrónico</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={20} />
                  <input 
                    type="email" 
                    placeholder="tucorreo@ejemplo.com" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all font-medium text-slate-700"
                    required
                  />
                </div>
              </div>
            )}

            {/* INPUT: CONTRASEÑA (Siempre visible) */}
            <div className="space-y-1">
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
            
            {/* BOTÓN DE ACCIÓN */}
            <button 
              disabled={loading}
              className={`w-full text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-6 ${isRegister ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/30' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'}`}
            >
              {loading ? <Loader2 className="animate-spin" /> : <>{isRegister ? 'Registrarse' : 'Ingresar'} <ArrowRight size={20} /></>}
            </button>
          </form>

          {/* TOGGLE (EL INTERRUPTOR) */}
          <div className="mt-8 text-center pt-6 border-t border-slate-100">
            <p className="text-slate-500 text-sm mb-2 font-medium">
              {isRegister ? '¿Ya tienes una cuenta?' : '¿Nuevo en la plataforma?'}
            </p>
            <button 
              onClick={toggleMode}
              className={`inline-flex items-center gap-1 font-black hover:underline transition-colors ${isRegister ? 'text-purple-600 hover:text-purple-700' : 'text-blue-600 hover:text-blue-700'}`}
            >
              {isRegister ? 'Inicia Sesión aquí' : 'Crear una cuenta gratis'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}