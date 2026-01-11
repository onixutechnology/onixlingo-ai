'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // 👈 1. Importamos Router
import { Check, ShieldCheck, Zap, ArrowLeft } from 'lucide-react';
import { useUIStore } from '@/store/uiStore'; // 👈 2. Importamos el Store para apagar el modo Pro

export const UpgradeModal = () => {
  // 🕵️ RASTREADOR
  console.trace("🚨 RASTREANDO MODAL: ¿Desde qué archivo me están llamando?");

  const router = useRouter();
  const { setMode } = useUIStore(); // 👈 3. Traemos la función para cambiar el diseño
  const [loading, setLoading] = useState(false);

  // 👇 4. Función para cancelar y regresar
  const handleCancel = () => {
    // Apagamos el switch visualmente (volvemos a modo standard)
    setMode('student'); 
    
    // Opcional: Aseguramos que se quede en el dashboard
    router.refresh();
  };

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            userId: 'usuario_demo_123', 
            userEmail: 'usuario@ejemplo.com' 
        })
      });
      
      const data = await response.json();
      if (data.url) window.location.href = data.url; 
      
    } catch (error) {
      console.error("Error al iniciar pago:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-950 border border-amber-500/30 rounded-3xl max-w-md w-full p-8 relative overflow-hidden shadow-[0_0_60px_rgba(245,158,11,0.15)]">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Titanium <span className="text-amber-500">Pro</span></h2>
          <p className="text-slate-400 text-sm">Desbloquea el Nivel Ejecutivo C-Suite</p>
        </div>

        {/* Tarjeta de Precio */}
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 mb-8 text-center relative group">
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent rounded-2xl"></div>
          <div className="text-xs text-amber-500 font-bold uppercase tracking-widest mb-2 relative z-10">Oferta Lanzamiento</div>
          <div className="flex items-end justify-center gap-1 relative z-10">
            <span className="text-5xl font-bold text-white tracking-tighter">$49</span>
            <span className="text-slate-400 mb-1 font-medium">MXN / mes</span>
          </div>
          <p className="text-xs text-emerald-400 mt-3 font-medium bg-emerald-500/10 inline-block px-3 py-1 rounded-full">
            🎁 7 días de prueba gratis incluidos
          </p>
        </div>

        <button 
          onClick={handleCheckout}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg hover:shadow-amber-500/25 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            'Conectando...'
          ) : (
            <>
              <Zap size={20} fill="currentColor" /> Iniciar Prueba Gratis
            </>
          )}
        </button>
        
        {/* 👇 5. NUEVO BOTÓN DE CANCELAR */}
        <button 
            onClick={handleCancel}
            className="w-full mt-4 py-2 text-slate-500 text-sm hover:text-white transition-colors flex items-center justify-center gap-2 hover:bg-white/5 rounded-lg"
        >
            <ArrowLeft size={16} /> No por ahora, volver al plan Gratuito
        </button>

        <div className="mt-6 text-center border-t border-slate-800/50 pt-4">
          <p className="text-xs text-slate-500 mb-1">
            <ShieldCheck size={12} className="inline mr-1" />
            Pago seguro procesado por Stripe
          </p>
          <p className="text-[10px] text-slate-600">
            ¿Tienes un código VIP? Podrás ingresarlo en la siguiente pantalla.
          </p>
        </div>
      </div>
    </div>
  );
};