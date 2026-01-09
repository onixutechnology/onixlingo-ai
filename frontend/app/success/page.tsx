'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight, Shield, Sparkles } from 'lucide-react';
import { useUIStore } from '@/store/uiStore'; // Asumiendo que usas tu store para cambiar el modo

export default function SuccessPage() {
  const router = useRouter();
  const { setMode } = useUIStore(); // Para forzar el modo profesional visualmente

  // 🪄 MAGIA: Activación Inmediata
  useEffect(() => {
    // 1. Guardamos la "Bandera VIP" en el navegador
    localStorage.setItem('onix_tier', 'TITANIUM');
    
    // 2. Cambiamos el estado global a 'professional' para que la UI se adapte
    setMode('professional');
    
    console.log("🏆 ¡Modo Titanium Activado exitosamente!");
  }, [setMode]);

  const handleContinue = () => {
    // Refuerzo de seguridad al hacer clic
    localStorage.setItem('onix_tier', 'TITANIUM');
    router.push('/dashboard/pro');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans selection:bg-amber-500/30 overflow-hidden relative">
      
      {/* Fondo con efectos de luz ambiental */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-indigo-600/20 rounded-full blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-amber-500/10 rounded-full blur-[128px] animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-lg w-full bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-[2rem] p-8 md:p-12 text-center shadow-2xl shadow-black/80 ring-1 ring-white/10">
        
        {/* Icono Animado con Destello */}
        <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative w-full h-full bg-gradient-to-tr from-emerald-500 to-emerald-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/40 animate-bounce">
                <CheckCircle size={48} className="text-white" strokeWidth={3} />
            </div>
            {/* Estrellitas decorativas */}
            <Sparkles className="absolute -top-2 -right-2 text-amber-400 animate-spin-slow" size={24} />
            <Sparkles className="absolute bottom-0 -left-4 text-amber-400 animate-ping" size={16} />
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-tight">
          ¡Bienvenido a la Élite!
        </h1>
        <p className="text-slate-400 text-lg mb-10 leading-relaxed">
          Tu acceso <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 font-bold">Titanium Pro</span> ha sido activado correctamente.
        </p>

        {/* Lista de beneficios desbloqueados */}
        <div className="bg-slate-800/50 rounded-2xl p-6 mb-10 border border-slate-700/50 text-left relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h3 className="text-slate-200 font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10">
            <Shield size={14} className="text-indigo-400"/> Arsenal Desbloqueado:
          </h3>
          <ul className="space-y-3 relative z-10">
            {['Simulador de Entrevistas IA', 'Certificación TOEIC Ilimitada', 'Modo Offline & Sin Anuncios'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-300 text-sm font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Botón de Acción Principal */}
        <button 
            onClick={handleContinue}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-indigo-500/40 hover:-translate-y-1 flex items-center justify-center gap-2 group border border-indigo-500/50"
        >
            Ir a mi Dashboard Ejecutivo
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
        
        <p className="mt-8 text-[10px] text-slate-600 uppercase tracking-wider font-bold">
          Recibo enviado a tu correo electrónico
        </p>
      </div>
    </div>
  );
}