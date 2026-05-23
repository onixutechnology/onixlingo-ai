'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { Check, ShieldCheck, Zap, ArrowLeft, Loader2, Crown, Info, X } from 'lucide-react';
import apiClient from '@/lib/apiClient';

interface UpgradeModalProps {
  onClose?: () => void;
}

export const UpgradeModal = ({ onClose }: UpgradeModalProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [userId, setUserId] = useState<string | null>(null);

  // Estados para cupón promocional
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  useEffect(() => {
    apiClient.get('/users/me')
      .then(res => setUserId(res.data.id))
      .catch(err => console.error("Error getting user id for checkout:", err));
  }, []);

  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else {
      router.push('/dashboard'); 
    }
  };

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

      setTimeout(() => {
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

  const handleSelectPlan = async (tier: 'pro' | 'executive') => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      const confirmDev = window.confirm(
        `🔧 [Modo Desarrollo Activo]\nNo se pudo conectar con Paddle (requiere credenciales en producción).\n\n¿Deseas activar el plan ${tier.toUpperCase()} (${billingPeriod}) localmente de forma gratuita para realizar pruebas de desarrollo?`
      );
      if (confirmDev) {
        try {
          setLoading(true);
          await apiClient.post('/dev-activate-pro', { tier });
          alert(`🚀 ¡Plan ${tier.toUpperCase()} Activado! Tu cuenta local ahora tiene privilegios completos.`);
          window.location.reload();
          return;
        } catch (devErr) {
          console.error("Error al activar plan en desarrollo:", devErr);
        } finally {
          setLoading(false);
        }
      }
    }

    const paddle = (window as any).Paddle;
    if (!paddle) {
      alert("El sistema de pagos no está listo. Por favor, desactiva tu AdBlocker e intenta de nuevo.");
      return;
    }

    const priceId = tier === 'executive' 
      ? (billingPeriod === 'monthly' ? (process.env.NEXT_PUBLIC_PADDLE_PRICE_EXEC_MONTHLY || 'pri_exec_m') : (process.env.NEXT_PUBLIC_PADDLE_PRICE_EXEC_ANNUAL || 'pri_exec_a'))
      : (billingPeriod === 'monthly' ? (process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_MONTHLY || 'pri_pro_m') : (process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_ANNUAL || 'pri_pro_a'));

    try {
      setLoading(true);
      paddle.Checkout.open({
        items: [{ priceId: priceId, quantity: 1 }],
        customData: {
          internal_user_id: userId,
          tier: tier
        }
      });
    } catch (checkoutErr) {
      console.error("Error during checkout invocation:", checkoutErr);
      alert("Ocurrió un error al abrir el portal de pagos seguro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full p-6 sm:p-10 relative shadow-[0_0_80px_rgba(20,184,166,0.15)] my-8">
        
        {/* Botón de cerrar */}
        <button 
          onClick={handleCancel}
          className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-2 rounded-full transition-all"
        >
          <X size={18} />
        </button>

        {/* Decoraciones de fondo */}
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="text-center mb-8 relative z-10">
          <span className="bg-teal-500/10 text-teal-400 text-[9px] font-black uppercase tracking-[0.25em] px-3 py-1 rounded-full border border-teal-500/20">
            Membresía Comercial
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 tracking-tighter uppercase font-serif italic">
            Elige tu plan de <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-amber-400">OnixLingo</span>
          </h2>
          <p className="text-slate-400 text-xs mt-2 max-w-lg mx-auto">
            Desbloquea el inglés general o especialízate en el entorno corporativo global de alta dirección.
          </p>

          {/* Toggle Mensual/Anual */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className={`text-[10px] font-black uppercase tracking-wider ${billingPeriod === 'monthly' ? 'text-teal-400' : 'text-slate-400'}`}>
              Mensual
            </span>
            <button 
              onClick={() => setBillingPeriod(p => p === 'monthly' ? 'annual' : 'monthly')}
              className="w-12 h-6 bg-slate-800 rounded-full p-0.5 relative transition-all border border-slate-700"
            >
              <div className={`w-5 h-5 bg-teal-500 rounded-full transition-all ${billingPeriod === 'annual' ? 'translate-x-6 bg-amber-500' : ''}`} />
            </button>
            <span className={`text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${billingPeriod === 'annual' ? 'text-amber-400' : 'text-slate-400'}`}>
              Anual <span className="bg-emerald-500/10 text-emerald-400 text-[8px] px-1.5 py-0.5 border border-emerald-500/20 rounded-none font-black uppercase">Ahorra hasta 50%</span>
            </span>
          </div>
        </div>

        {/* Rejilla de 3 Columnas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 items-stretch mb-10">
          
          {/* Tarjeta 1: FREE */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">BÁSICO</div>
              <h3 className="text-lg font-bold text-white mb-2">FREE</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">Para arrancar tus bases de forma guiada.</p>
              
              <div className="flex items-baseline gap-1 text-white mb-6">
                <span className="text-sm text-slate-500 line-through mr-1">$399</span>
                <span className="text-3xl font-black text-white">$249</span>
                <span className="text-slate-400 font-bold uppercase text-[8px] tracking-widest">MXN / mes</span>
              </div>
              
              <hr className="border-slate-800/50 mb-6" />
              
              <ul className="space-y-3.5 text-xs text-slate-300">
                <li className="flex gap-2.5 items-start">
                  <Check className="text-teal-400 shrink-0 mt-0.5" size={14} />
                  <span>Lecciones generales del nivel A1 (Inglés)</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <Check className="text-teal-400 shrink-0 mt-0.5" size={14} />
                  <span>Vocabulario limitado a <strong>1 lección al día</strong> (Inglés)</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <Check className="text-teal-400 shrink-0 mt-0.5" size={14} />
                  <span>Ajedrez limitado a <strong>2 puzzles al día</strong> (Inglés)</span>
                </li>
                <li className="flex gap-2.5 items-start text-slate-500">
                  <X className="shrink-0 mt-0.5 text-red-500/50" size={14} />
                  <span>Sin tutoría conversacional ni prácticas de IA.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <Check className="text-teal-400 shrink-0 mt-0.5" size={14} />
                  <span>Idiomas: Español, Francés, Chino</span>
                </li>
                <li className="flex gap-2.5 items-start text-slate-500">
                  <Info className="shrink-0 mt-0.5 text-slate-600" size={14} />
                  <span>Energía máxima de 100% (recarga automática diaria).</span>
                </li>
              </ul>
            </div>
            
            <div className="mt-8">
              <button 
                disabled 
                className="w-full py-3 bg-slate-800 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl cursor-default"
              >
                Plan Activo por Defecto
              </button>
            </div>
          </div>

          {/* Tarjeta 2: PRO */}
          <div className="bg-slate-950/90 border border-teal-500/20 rounded-2xl p-6 flex flex-col justify-between hover:border-teal-500/40 transition-all relative shadow-lg">
            <div className="absolute top-0 right-6 -translate-y-1/2 bg-teal-500 text-slate-950 text-[7px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-none">
              RECOMENDADO
            </div>
            
            <div>
              <div className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-1">ESTÁNDAR</div>
              <h3 className="text-lg font-bold text-white mb-2">PRO</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">Acceso completo a todos los niveles estándar del idioma.</p>
              
              <div className="flex items-baseline gap-1 text-white mb-6">
                <span className="text-sm text-slate-500 line-through mr-1">{billingPeriod === 'monthly' ? '$199' : '$1499'}</span>
                <span className="text-3xl font-black text-white">{billingPeriod === 'monthly' ? '$129' : '$799'}</span>
                <span className="text-slate-400 font-bold uppercase text-[8px] tracking-widest">MXN / {billingPeriod === 'monthly' ? 'mes' : 'año'}</span>
                {billingPeriod === 'annual' && (
                  <span className="text-[8px] text-emerald-400 font-bold ml-2">(Equivale a $66 MXN/mes)</span>
                )}
              </div>
              
              <hr className="border-slate-800 mb-6" />
              
              <ul className="space-y-3.5 text-xs text-slate-300">
                <li className="flex gap-2.5 items-start">
                  <Check className="text-teal-400 shrink-0 mt-0.5" size={14} />
                  <span><strong>Acceso ilimitado a las 900 lecciones</strong> (A1 a C1).</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <Check className="text-teal-400 shrink-0 mt-0.5" size={14} />
                  <span><strong>Sin anuncios publicitarios</strong> en el dashboard.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <Check className="text-teal-400 shrink-0 mt-0.5" size={14} />
                  <span>Vocabulario y diccionario ilimitados.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <Check className="text-teal-400 shrink-0 mt-0.5" size={14} />
                  <span>Ajedrez ilimitado (PvP + Arena táctica).</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <Check className="text-teal-400 shrink-0 mt-0.5" size={14} />
                  <span>Idiomas: Español, Francés, Chino</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <Check className="text-teal-400 shrink-0 mt-0.5" size={14} />
                  <span>Acceso a sorteos premium según número de usuarios</span>
                </li>
                <li className="flex gap-2.5 items-start text-slate-500">
                  <X className="shrink-0 mt-0.5 text-red-500/50" size={14} />
                  <span>Excluye: Temario Executive y Conversación IA.</span>
                </li>
              </ul>
            </div>
            
            <div className="mt-8">
              <button 
                onClick={() => handleSelectPlan('pro')}
                disabled={loading || couponLoading}
                className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5"
              >
                {loading ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} fill="currentColor" />}
                ADQUIRIR PLAN PRO
              </button>
            </div>
          </div>

          {/* Tarjeta 3: EXECUTIVE */}
          <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-500/50 transition-all relative shadow-[0_0_30px_rgba(245,158,11,0.08)]">
            <div className="absolute top-0 right-6 -translate-y-1/2 bg-amber-500 text-slate-950 text-[7px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-none flex items-center gap-1">
              <Crown size={8} /> C-SUITE ELITE
            </div>

            <div>
              <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">TITANIUM</div>
              <h3 className="text-lg font-bold text-white mb-2">EXECUTIVE</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">El desbloqueo definitivo. Inglés de negocios y tutoría avanzada.</p>
              
              <div className="flex items-baseline gap-1 text-white mb-6">
                <span className="text-3xl font-black">
                  {billingPeriod === 'monthly' ? '$249' : '$1,499'}
                </span>
                <span className="text-slate-400 text-xs font-semibold">MXN / {billingPeriod === 'monthly' ? 'mes' : 'año'}</span>
                {billingPeriod === 'annual' && (
                  <span className="text-[8px] text-amber-400 font-bold ml-2">(Equivale a $125 MXN/mes)</span>
                )}
              </div>
              
              <hr className="border-slate-800 mb-6" />
              
              <ul className="space-y-3.5 text-xs text-slate-300">
                <li className="flex gap-2.5 items-start">
                  <Check className="text-amber-500 shrink-0 mt-0.5" size={14} />
                  <span><strong>Desbloqueo de TODO el sistema</strong> sin restricciones.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <Check className="text-amber-500 shrink-0 mt-0.5" size={14} />
                  <span><strong>Temario Executive completo</strong> (negociaciones, finanzas).</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <Check className="text-amber-500 shrink-0 mt-0.5" size={14} />
                  <span><strong>Tutoría conversacional ilimitada por IA</strong>.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <Check className="text-amber-500 shrink-0 mt-0.5" size={14} />
                  <span><strong>Acceso prioritario a los Sorteos Premium Físicos</strong>.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <Check className="text-amber-500 shrink-0 mt-0.5" size={14} />
                  <span><strong>Certificación de estudios oficial</strong> de OnixLingo.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <Check className="text-amber-500 shrink-0 mt-0.5" size={14} />
                  <span>Idiomas: Español, Francés, Chino</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <Check className="text-amber-500 shrink-0 mt-0.5" size={14} />
                  <span>Acceso ilimitado a sorteos premium</span>
                </li>
              </ul>
            </div>
            
            <div className="mt-8">
              <button 
                onClick={() => handleSelectPlan('executive')}
                disabled={loading || couponLoading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/10"
              >
                {loading ? <Loader2 size={12} className="animate-spin" /> : <Crown size={12} fill="currentColor" />}
                ADQUIRIR PLAN EXECUTIVE
              </button>
            </div>
          </div>

        </div>

        {/* Divisor Cupón */}
        <div className="relative my-8 flex items-center justify-center">
          <div className="border-t border-slate-800 w-full"></div>
          <span className="bg-slate-900 px-4 text-[9px] text-slate-500 font-bold uppercase tracking-wider absolute">o canjea un código de acceso</span>
        </div>

        {/* Formulario Cupón */}
        <div className="max-w-md mx-auto relative z-10">
          <form onSubmit={handleRedeemCoupon} className="flex gap-2">
            <input
              type="text"
              placeholder="Escribe tu código promocional..."
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              disabled={couponLoading || loading}
              className="flex-1 bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs placeholder:text-slate-700 focus:outline-none focus:border-teal-500/50 transition-colors uppercase font-medium tracking-wider"
            />
            <button
              type="submit"
              disabled={couponLoading || loading || !couponCode.trim()}
              className="bg-slate-800 hover:bg-slate-700 text-teal-400 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 border border-slate-700 active:scale-95"
            >
              {couponLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                'Aplicar'
              )}
            </button>
          </form>
          {couponError && (
            <p className="text-center text-[10px] text-rose-500 font-medium mt-2 animate-pulse">⚠️ {couponError}</p>
          )}
          {couponSuccess && (
            <p className="text-center text-[10px] text-emerald-400 font-semibold mt-2 animate-pulse">🎉 {couponSuccess}</p>
          )}
        </div>

        <div className="mt-8 text-center border-t border-slate-800/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
            <ShieldCheck size={14} className="text-emerald-500" />
            Transacciones seguras encriptadas SSL por Paddle.
          </span>
          <button 
            onClick={handleCancel}
            disabled={loading || couponLoading}
            className="text-[10px] text-slate-400 font-black hover:text-white uppercase tracking-widest transition-colors"
          >
            ← Volver al Hub
          </button>
        </div>

      </div>
    </div>
  );
};