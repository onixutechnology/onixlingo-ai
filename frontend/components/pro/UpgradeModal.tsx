'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { CheckCircle2, ShieldCheck, Zap, ArrowLeft, Loader2, Crown } from 'lucide-react';
import { useUIStore } from '@/store/uiStore'; 
import apiClient from '@/lib/apiClient';

export const UpgradeModal = () => {
  const router = useRouter();
  const { setMode } = useUIStore(); 
  const [loading, setLoading] = useState(false);

  // Estados para cupón promocional
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // 🔙 Función para cancelar y regresar al dashboard normal
  const handleCancel = () => {
    setMode('student'); 
    router.push('/dashboard'); 
    router.refresh();
  };

  // 🎫 Función para canjear cupón promocional directo
  const handleRedeemCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    try {
      setCouponLoading(true);
      setCouponError('');
      setCouponSuccess('');

      const response = await apiClient.post('/billing/redeem-coupon', {
        code: couponCode.trim()
      });

      setCouponSuccess(response.data.message || "¡Cupón canjeado con éxito!");
      setCouponCode('');

      // Recargar e ir al dashboard después del éxito
      setTimeout(() => {
        setMode('professional');
        router.push('/dashboard');
        router.refresh();
        window.location.reload();
      }, 1500);

    } catch (error: any) {
      console.error("Error canjeando cupón:", error);
      const errMsg = error.response?.data?.detail || "El cupón no es válido o ya fue utilizado.";
      setCouponError(errMsg);
    } finally {
      setCouponLoading(false);
    }
  };

  // 💳 Función para iniciar el pago seguro con Paddle
  const handleCheckout = async () => {
    try {
      setLoading(true);
      
      // Llamamos a nuestro backend de FastAPI para crear la sesión de portal o checkout
      const response = await apiClient.post('/billing/create-portal-session');
      
      if (response.data.url) {
        window.location.href = response.data.url; 
      } else {
        alert("El portal de facturación requiere configuración en el backend.");
      }
      
    } catch (error: any) {
      console.error("Error crítico al iniciar pago:", error);
      
      // Bypass para desarrollo local
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const confirmDev = window.confirm(
          "🔧 [Modo Desarrollo Activo]\nNo se pudo conectar con Paddle (requiere credenciales en producción).\n\n¿Deseas activar el plan Titanium Pro localmente de forma gratuita para realizar pruebas de desarrollo?"
        );
        if (confirmDev) {
          try {
            await apiClient.post('/billing/dev-activate-pro');
            alert("🚀 ¡Titanium Pro Activado! Tu cuenta local ahora tiene privilegios completos.");
            setMode('professional');
            router.push('/dashboard');
            router.refresh();
            window.location.reload();
            return;
          } catch (devErr) {
            console.error("Error al activar Pro en desarrollo:", devErr);
          }
        }
      }
      
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
          disabled={loading || couponLoading}
          className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-black rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100 relative z-10"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Zap size={20} fill="currentColor" /> 
          )}
          {loading ? 'CONECTANDO...' : 'INICIAR PRUEBA GRATIS'}
        </button>

        {/* Divisor */}
        <div className="relative my-6 z-10 flex items-center justify-center">
          <div className="border-t border-slate-800 w-full"></div>
          <span className="bg-slate-900 px-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider absolute">o canjea un cupón</span>
        </div>

        {/* Sección de Cupón */}
        <form onSubmit={handleRedeemCoupon} className="space-y-3 relative z-10">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ej. TZ89P2M4QX"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              disabled={couponLoading || loading}
              className="flex-1 bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 text-sm placeholder:text-slate-700 focus:outline-none focus:border-amber-500/50 transition-colors uppercase font-medium tracking-wider"
            />
            <button
              type="submit"
              disabled={couponLoading || loading || !couponCode.trim()}
              className="bg-slate-800 hover:bg-slate-700 text-amber-500 font-bold px-4 py-3 rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 border border-slate-700 active:scale-95"
            >
              {couponLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                'Aplicar'
              )}
            </button>
          </div>
          {couponError && (
            <p className="text-xs text-rose-500 font-medium px-1 animate-pulse">⚠️ {couponError}</p>
          )}
          {couponSuccess && (
            <p className="text-xs text-emerald-400 font-semibold px-1 animate-pulse">🎉 {couponSuccess}</p>
          )}
        </form>
        
        <button 
            onClick={handleCancel}
            disabled={loading || couponLoading}
            className="w-full mt-4 py-3 text-slate-400 text-sm font-medium hover:text-white transition-colors flex items-center justify-center gap-2 hover:bg-slate-800 rounded-xl disabled:opacity-50"
        >
            <ArrowLeft size={16} /> No por ahora, volver al Hub
        </button>

        <div className="mt-6 text-center border-t border-slate-800 pt-6">
          <p className="text-xs text-slate-500 mb-2 flex items-center justify-center gap-1 font-medium">
            <ShieldCheck size={14} className="text-emerald-500" />
            Pago seguro procesado por Paddle
          </p>
          <p className="text-[10px] text-slate-600 leading-relaxed">
            Suscripción segura y encriptada.
          </p>
        </div>
      </div>
    </div>
  );
};
