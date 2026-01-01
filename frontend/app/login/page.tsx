'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProgressStore } from '@/store/progressStore'; // Importamos el store

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { loadProgressFromDB } = useProgressStore(); // Necesitaremos crear esto

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const endpoint = isRegister ? '/api/v1/register' : '/api/v1/login';
    
    try {
      const res = await fetch(`http://127.0.0.1:8001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        alert(data.detail || "Error");
        return;
      }

      if (isRegister) {
        alert("¡Cuenta creada! Ahora inicia sesión.");
        setIsRegister(false);
      } else {
        // LOGIN EXITOSO
        // Guardamos usuario en localStorage simple para saber quién es
        localStorage.setItem('currentUser', username);
        
        // Cargamos el progreso que vino de la DB al Store de Zustand
        loadProgressFromDB(data.progress);
        
        router.push('/dashboard');
      }
    } catch (err) {
      alert("Error conectando con el servidor");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        <h1 className="text-3xl font-black text-slate-800 mb-2 text-center">
          {isRegister ? 'Crear Cuenta' : 'Bienvenido'}
        </h1>
        <p className="text-slate-400 text-center mb-8">Guarda tu racha y progreso.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" placeholder="Usuario" 
            value={username} onChange={e => setUsername(e.target.value)}
            className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-200"
          />
          <input 
            type="password" placeholder="Contraseña" 
            value={password} onChange={e => setPassword(e.target.value)}
            className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-200"
          />
          
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95">
            {isRegister ? 'REGISTRARSE' : 'ENTRAR'}
          </button>
        </form>

        <button 
          onClick={() => setIsRegister(!isRegister)}
          className="w-full mt-4 text-slate-500 font-bold text-sm hover:text-blue-500"
        >
          {isRegister ? '¿Ya tienes cuenta? Entra aquí' : '¿Nuevo? Crea una cuenta'}
        </button>
      </div>
    </div>
  );
}