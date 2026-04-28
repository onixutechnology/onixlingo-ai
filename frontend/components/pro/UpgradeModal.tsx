'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { CheckCircle2, ShieldCheck, Zap, ArrowLeft, Loader2, Crown } from 'lucide-react';
import { useUIStore } from '@/store/uiStore'; 
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.onixlingo.onixu.company';

export const UpgradeModal = () => {
  const router = useRouter();
  const { setMode } = useUIStore(); 
  const [loading, setLoading] = useState(false);

  // 🔙 Función para cancelar y regresar al dashboard normal
  const handleCancel = () => {
    setMode('student'); 
    router.push('/dashboard'); 
  };

  // 💳 Función para iniciar el pago seguro con Stripe
  const handleCheckout = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('access_token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      // Llamamos a nuestro backend de FastAPI
      const response = await fetch(`${API_URL}/api/v1/billing/create-portal-session`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Redirige al portal de Stripe
        if (data.url) window.location.href = data.url; 
      } else {
        const errorData = await response.json();
        alert(`Error al iniciar pago: ${errorData.detail || 'Falla de conexión'}`);
      }
      
    } catch (error) {
      console.error("Error crítico al iniciar pago:", error);
      alert("No se pudo conectar con la pasarela de pagos segura.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl max-w-md w-full p-8 relative overflow-hidden shadow-[0_0_60px_rgba(245,158,11,0.15)]">
        
        {/* Decoración de fondo */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-amber-600/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 ring-1 ring-amber-500/30">
            <Crown size={32} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Titanium <span className="text-amber-500">Pro</span>
          </h2>
          <p className="text-slate-400 text-sm">Desbloquea el Nivel Ejecutivo C-Suite</p>
        </div>

        {/* Tarjeta de Precio */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 mb-8 text-center relative group">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent rounded-2xl pointer-events-none"></div>
          <div className="text-xs text-amber-500 font-bold uppercase tracking-widest mb-2 relative z-10">Oferta Lanzamiento</div>
          <div className="flex items-end justify-center gap-1 relative z-10">
            <span className="text-5xl font-bold text-white tracking-tighter">$49</span>
            <span className="text-slate-400 mb-1 font-medium">MXN / mes</span>
          </div>
          <p className="text-xs text-emerald-400 mt-4 font-bold bg-emerald-500/10 inline-flex items-center gap-1 px-4 py-1.5 rounded-full border border-emerald-500/20">
            <CheckCircle2 size={14} /> 7 días de prueba gratis incluidos
          </p>
        </div>

        <button 
          onClick={handleCheckout}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 relative z-10"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Zap size={20} fill="currentColor" /> 
          )}
          {loading ? 'CONECTANDO A STRIPE...' : 'INICIAR PRUEBA GRATIS'}
        </button>
        
        <button 
            onClick={handleCancel}
            disabled={loading}
            className="w-full mt-4 py-3 text-slate-400 text-sm font-medium hover:text-white transition-colors flex items-center justify-center gap-2 hover:bg-slate-800 rounded-xl disabled:opacity-50"
        >
            <ArrowLeft size={16} /> No por ahora, volver al Hub
        </button>

        <div className="mt-6 text-center border-t border-slate-800 pt-6">
          <p className="text-xs text-slate-500 mb-2 flex items-center justify-center gap-1 font-medium">
            <ShieldCheck size={14} className="text-emerald-500" />
            Pago seguro procesado por Stripe
          </p>
          <p className="text-[10px] text-slate-600 leading-relaxed">
            ¿Tienes un código VIP? Podrás ingresarlo en la siguiente pantalla.
          </p>
        </div>
      </div>
    </div>
  );
};