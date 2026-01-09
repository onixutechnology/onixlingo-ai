'use client';
import { useState } from 'react';
import { Check, ShieldCheck, Zap } from 'lucide-react';

export const UpgradeModal = () => {
  // 🕵️ RASTREADOR: Esta línea nos dirá en la consola quién está importando este componente
  console.trace("🚨 RASTREANDO MODAL: ¿Desde qué archivo me están llamando?");

  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      // Llamamos a NUESTRO Backend
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            // En una app real, esto viene de tu sistema de login
            userId: 'usuario_demo_123', 
            userEmail: 'usuario@ejemplo.com' 
        })
      });
      
      const data = await response.json();
      
      // Si el Backend nos dio la URL de Stripe, vamos allá
      if (data.url) window.location.href = data.url; 
      
    } catch (error) {
      console.error("Error al iniciar pago:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
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
        
        <div className="mt-6 text-center">
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