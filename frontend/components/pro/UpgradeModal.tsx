'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { Check, ShieldCheck, Zap, ArrowLeft, Loader2, Crown, Info, X, CreditCard, Lock, Sparkles } from 'lucide-react';
import apiClient from '@/lib/apiClient';

interface UpgradeModalProps {
  onClose?: () => void;
  isEmbedded?: boolean;
}

export const UpgradeModal = ({ onClose, isEmbedded = false }: UpgradeModalProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [userId, setUserId] = useState<string | null>(null);

  // Estados para cupón promocional
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Estados para simulación de pago premium
  const [simulatedCheckoutTier, setSimulatedCheckoutTier] = useState<'pro' | 'executive' | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutProcessing, setCheckoutProcessing] = useState(false);
  const [checkoutStatusText, setCheckoutStatusText] = useState('Verificando detalles...');
  const [checkoutError, setCheckoutError] = useState('');

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
    // Si estamos en localhost, abrimos el formulario de simulación interactivo premium
    // COMENTADO PARA PERMITIR PRUEBAS DE PADDLE EN LOCALHOST
    // if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    //   setSimulatedCheckoutTier(tier);
    //   return;
    // }

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

  const handleSimulatedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
      setCheckoutError("Por favor completa todos los campos del formulario de pago.");
      return;
    }

    try {
      setCheckoutProcessing(true);
      setCheckoutError('');
      
      setCheckoutStatusText("Estableciendo túnel SSL seguro...");
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setCheckoutStatusText("Transmitiendo token corporativo...");
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setCheckoutStatusText("Registrando credenciales Alta Dirección...");
      await apiClient.post('/dev-activate-pro', { tier: simulatedCheckoutTier, billing_period: billingPeriod });
      
      setCheckoutSuccess(true);
    } catch (err: any) {
      console.error("Error en checkout simulado:", err);
      setCheckoutError("Ocurrió un error al autorizar el plan simulado.");
    } finally {
      setCheckoutProcessing(false);
    }
  };

  return (
    <div className={isEmbedded ? "w-full my-8" : "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-sky-950/40 backdrop-blur-md overflow-y-auto"}>
      <div className={`bg-sky-50 border border-sky-200 rounded-none max-w-5xl w-full p-6 sm:p-10 relative ${isEmbedded ? 'shadow-[0_10px_40px_rgba(14,165,233,0.1)] mx-auto' : 'shadow-[0_20px_80px_rgba(14,165,233,0.15)] my-8 transform scale-[0.70] origin-center'}`}>
        
        {/* Botón de cerrar */}
        {!isEmbedded && (
          <button 
            onClick={handleCancel}
            className="absolute top-5 right-5 text-sky-500 hover:text-sky-900 bg-sky-100 hover:bg-sky-200 p-2 rounded-full transition-all"
          >
            <X size={18} />
          </button>
        )}

        {/* Decoraciones de fondo */}
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-400/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="text-center mb-8 relative z-10">
          <span className="bg-sky-100 text-sky-700 text-[9px] font-black uppercase tracking-[0.25em] px-3 py-1 rounded-full border border-sky-200">
            Membresía Comercial
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-sky-950 mt-3 tracking-tighter uppercase font-serif italic">
            Elige tu plan de <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-700">OnixLingo</span>
          </h2>
          <p className="text-sky-700/80 text-xs mt-2 max-w-lg mx-auto">
            Desbloquea el inglés general o especialízate en el entorno corporativo global de alta dirección.
          </p>

          {/* Toggle Mensual/Anual */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className={`text-[10px] font-black uppercase tracking-wider ${billingPeriod === 'monthly' ? 'text-sky-700' : 'text-sky-400'}`}>
              Mensual
            </span>
            <button 
              onClick={() => setBillingPeriod(p => p === 'monthly' ? 'annual' : 'monthly')}
              className="w-12 h-6 bg-sky-200 rounded-full p-0.5 relative transition-all border border-sky-300"
            >
              <div className={`w-5 h-5 bg-sky-600 rounded-full transition-all ${billingPeriod === 'annual' ? 'translate-x-6 bg-[#D4AF37]/20' : ''}`} />
            </button>
            <span className={`text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${billingPeriod === 'annual' ? 'text-[#D4AF37]' : 'text-sky-400'}`}>
              Anual <span className="bg-emerald-100 text-[#D4AF37] text-[8px] px-1.5 py-0.5 border border-[#D4AF37]/30 rounded-full font-black uppercase">Ahorra hasta 50%</span>
            </span>
          </div>
        </div>

        {/* Rejilla de 3 Columnas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 items-stretch mb-10">
          
          {/* Tarjeta 1: FREE */}
          <div className="bg-white border border-sky-200 rounded-none p-6 flex flex-col justify-between hover:border-sky-300 transition-all shadow-none">
            <div>
              <div className="text-[10px] font-black text-sky-500 uppercase tracking-widest mb-1">BÁSICO</div>
              <h3 className="text-lg font-bold text-sky-950 mb-2">FREE</h3>
              <p className="text-sm text-slate-900 font-medium leading-relaxed mb-6">Para arrancar tus bases de forma guiada.</p>
              
              <div className="flex items-baseline gap-1 text-sky-950 mb-6">
                <span className="text-3xl font-black">$0</span>
                <span className="text-sky-500 text-xs font-semibold">MXN / mes</span>
              </div>
              
              <hr className="border-sky-100 mb-6" />
              
              <ul className="space-y-3.5 text-sm text-slate-900">
                <li className="flex gap-2.5 items-start">
                  <Check className="text-sky-500 shrink-0 mt-0.5" size={14} />
                  <span>Lecciones generales del nivel A1 (Inglés)</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <Check className="text-sky-500 shrink-0 mt-0.5" size={14} />
                  <span>Vocabulario limitado a <strong>1 lección al día</strong> (Inglés)</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <Check className="text-sky-500 shrink-0 mt-0.5" size={14} />
                  <span>Ajedrez limitado a <strong>2 puzzles al día</strong> (Inglés)</span>
                </li>
                <li className="flex gap-2.5 items-start text-sky-400">
                  <X className="shrink-0 mt-0.5" size={14} />
                  <span>Sin tutoría conversacional ni prácticas de IA.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <Check className="text-sky-500 shrink-0 mt-0.5" size={14} />
                  <span>Idiomas: Español, Francés, Chino</span>
                </li>
              </ul>
            </div>
            
            <div className="mt-8">
              <button 
                disabled 
                className="w-full py-3 bg-sky-50 text-sky-400 border border-sky-100 text-[10px] font-black uppercase tracking-widest rounded-none cursor-default"
              >
                Plan Activo por Defecto
              </button>
            </div>
          </div>

          {/* Tarjeta 2: PRO */}
          <div className="bg-sky-50 border-2 border-sky-300 rounded-none p-6 flex flex-col justify-between hover:border-sky-400 transition-all relative shadow-none">
            <div className="absolute top-0 right-6 -translate-y-1/2 bg-sky-500 text-slate-900 text-[7px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full shadow-none">
              RECOMENDADO
            </div>
            
            <div>
              <div className="text-[10px] font-black text-sky-600 uppercase tracking-widest mb-1">ESTÁNDAR</div>
              <h3 className="text-lg font-bold text-sky-950 mb-2">PRO</h3>
              <p className="text-sm text-slate-900 font-medium leading-relaxed mb-6">Acceso completo a todos los niveles estándar del idioma.</p>
              
              <div className="flex items-baseline gap-1 text-sky-950 mb-6">
                <span className="text-sm text-sky-400 line-through mr-1">{billingPeriod === 'monthly' ? '$199' : '$1499'}</span>
                <span className="text-3xl font-black text-sky-900">{billingPeriod === 'monthly' ? '$129' : '$799'}</span>
                <span className="text-sky-500 font-bold uppercase text-[8px] tracking-widest">MXN / {billingPeriod === 'monthly' ? 'mes' : 'año'}</span>
                {billingPeriod === 'annual' && (
                  <span className="text-[8px] text-[#D4AF37] font-bold ml-2">(Equivale a $66 MXN/mes)</span>
                )}
              </div>
              
              <hr className="border-sky-200 mb-6" />
              
              <ul className="space-y-3.5 text-sm text-slate-900">
                <li className="flex gap-2.5 items-start">
                  <Check className="text-sky-600 shrink-0 mt-0.5" size={14} />
                  <span><strong>Acceso ilimitado a las 900 lecciones</strong> (A1 a C1).</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <Check className="text-sky-600 shrink-0 mt-0.5" size={14} />
                  <span><strong>Sin anuncios publicitarios</strong> en el dashboard.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <Check className="text-sky-600 shrink-0 mt-0.5" size={14} />
                  <span>Vocabulario y diccionario ilimitados.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <Check className="text-sky-600 shrink-0 mt-0.5" size={14} />
                  <span>Ajedrez ilimitado (PvP + Arena táctica).</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <Check className="text-sky-600 shrink-0 mt-0.5" size={14} />
                  <span>Idiomas: Español, Francés, Chino</span>
                </li>
                <li className="flex gap-2.5 items-start text-sky-400">
                  <X className="shrink-0 mt-0.5" size={14} />
                  <span>Excluye: Temario Executive y Conversación IA.</span>
                </li>
              </ul>
            </div>
            
            <div className="mt-8">
              <button 
                onClick={() => handleSelectPlan('pro')}
                disabled={loading || couponLoading}
                className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-slate-900 font-black text-[10px] uppercase tracking-widest rounded-none transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-none shadow-sky-500/20"
              >
                {loading ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} fill="currentColor" />}
                ADQUIRIR PLAN PRO
              </button>
            </div>
          </div>

          {/* Tarjeta 3: EXECUTIVE */}
          <div className="bg-[#f0f7ff] border-2 border-amber-300 rounded-none p-6 flex flex-col justify-between hover:border-amber-400 transition-all relative shadow-none">
            <div className="absolute top-0 right-6 -translate-y-1/2 bg-[#D4AF37]/20 text-slate-900 text-[7px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full flex items-center gap-1 shadow-none">
              <Crown size={8} /> ALTA DIRECCIÓN ELITE
            </div>

            <div>
              <div className="text-[10px] font-black text-[#D4AF37] uppercase tracking-widest mb-1">TITANIUM</div>
              <h3 className="text-lg font-bold text-sky-950 mb-2">EXECUTIVE</h3>
              <p className="text-sm text-slate-900 font-medium leading-relaxed mb-6">El desbloqueo definitivo. Inglés de negocios y tutoría avanzada.</p>
              
              <div className="flex items-baseline gap-1 text-sky-950 mb-6">
                <span className="text-sm text-sky-400 line-through mr-1">
                  {billingPeriod === 'monthly' ? '$399' : '$2,999'}
                </span>
                <span className="text-3xl font-black text-sky-950">
                  {billingPeriod === 'monthly' ? '$249' : '$1,499'}
                </span>
                <span className="text-sky-500 text-xs font-semibold">MXN / {billingPeriod === 'monthly' ? 'mes' : 'año'}</span>
                {billingPeriod === 'annual' && (
                  <span className="text-[8px] text-[#D4AF37] font-bold ml-2">(Equivale a $125 MXN/mes)</span>
                )}
              </div>
              
              <hr className="border-sky-200 mb-6" />
              
              <ul className="space-y-3.5 text-sm text-slate-900">
                <li className="flex gap-2.5 items-start">
                  <Check className="text-[#D4AF37] shrink-0 mt-0.5" size={14} />
                  <span><strong>Desbloqueo de TODO el sistema</strong> sin restricciones.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <Check className="text-[#D4AF37] shrink-0 mt-0.5" size={14} />
                  <span><strong>Temario Executive completo</strong> (negociaciones, finanzas).</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <Check className="text-[#D4AF37] shrink-0 mt-0.5" size={14} />
                  <span><strong>Tutoría conversacional ilimitada por IA</strong>.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <Check className="text-[#D4AF37] shrink-0 mt-0.5" size={14} />
                  <span><strong>Acceso prioritario a sorteos premium</strong> físicos.</span>
                </li>
                <li className="flex gap-2.5 items-start">
                  <Check className="text-[#D4AF37] shrink-0 mt-0.5" size={14} />
                  <span><strong>Certificación oficial</strong> de OnixLingo.</span>
                </li>
              </ul>
            </div>
            
            <div className="mt-8">
              <button 
                onClick={() => handleSelectPlan('executive')}
                disabled={loading || couponLoading}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-black text-[10px] uppercase tracking-widest rounded-none transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-none shadow-amber-500/20"
              >
                {loading ? <Loader2 size={12} className="animate-spin" /> : <Crown size={12} fill="currentColor" />}
                ADQUIRIR PLAN EXECUTIVE
              </button>
            </div>
          </div>

        </div>

        {/* Divisor Cupón */}
        <div className="relative my-8 flex items-center justify-center">
          <div className="border-t border-sky-200 w-full"></div>
          <span className="bg-sky-50 px-4 text-[9px] text-sky-600 font-bold uppercase tracking-wider absolute">o canjea un código de acceso</span>
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
              className="flex-1 bg-white border border-sky-200 text-sky-950 rounded-none px-4 py-2.5 text-xs placeholder:text-sky-400 focus:outline-none focus:border-sky-500/50 transition-colors uppercase font-medium tracking-wider shadow-none"
            />
            <button
              type="submit"
              disabled={couponLoading || loading || !couponCode.trim()}
              className="bg-sky-600 hover:bg-sky-700 text-slate-900 font-bold px-4 py-2.5 rounded-none text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 shadow-none active:scale-95"
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
            <p className="text-center text-[10px] text-[#D4AF37] font-semibold mt-2 animate-pulse">🎉 {couponSuccess}</p>
          )}
        </div>

        <div className="mt-8 text-center border-t border-sky-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[10px] text-sky-600 flex items-center gap-1 font-medium">
            <ShieldCheck size={14} className="text-[#D4AF37]" />
            Transacciones seguras encriptadas SSL por Paddle.
          </span>
          {!isEmbedded && (
            <button 
              onClick={handleCancel}
              disabled={loading || couponLoading}
              className="text-[10px] text-sky-700 font-black hover:text-sky-950 uppercase tracking-widest transition-colors"
            >
              ← Volver al Hub
            </button>
          )}
        </div>

      </div>

      {/* ─── PASARELA DE CHECKOUT DE SIMULACIÓN PREMIUM ─── */}
      {simulatedCheckoutTier && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-sky-950/70 backdrop-blur-md animate-fade-in">
          <div className="bg-sky-50 border border-sky-200 max-w-4xl w-full p-6 md:p-8 relative shadow-[0_20px_60px_rgba(14,165,233,0.2)] flex flex-col md:flex-row gap-8 rounded-none transform scale-[0.80] origin-center">
            
            {/* Botón de cerrar */}
            <button 
              onClick={() => {
                if (!checkoutProcessing && !checkoutSuccess) {
                  setSimulatedCheckoutTier(null);
                  setCardNumber('');
                  setCardExpiry('');
                  setCardCvv('');
                  setCardName('');
                  setCheckoutError('');
                }
              }}
              className="absolute top-4 right-4 text-sky-500 hover:text-sky-900 bg-sky-100 hover:bg-sky-200 p-2 transition-all rounded-full"
              disabled={checkoutProcessing || checkoutSuccess}
            >
              <X size={16} />
            </button>

            {checkoutSuccess ? (
              /* PANTALLA DE ÉXITO */
              <div className="w-full text-center py-10 flex flex-col items-center justify-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-amber-100 border border-amber-300 flex items-center justify-center rounded-full shadow-[0_0_40px_rgba(245,158,11,0.2)]">
                    <Crown className="text-[#D4AF37]" size={40} />
                  </div>
                  <div className="absolute -top-1 -right-1 text-sky-500 animate-pulse">
                    <Sparkles size={20} />
                  </div>
                </div>
                
                <h3 className="text-2xl font-black text-sky-950 tracking-tighter uppercase font-serif italic mb-3">
                  ¡Membresía Activada con Éxito!
                </h3>
                <p className="text-xs text-sky-700 max-w-md mx-auto leading-relaxed mb-8">
                  Tu cuenta ha sido promovida al rango <strong className="text-[#D4AF37] font-bold">{simulatedCheckoutTier.toUpperCase()}</strong> en nuestro entorno de desarrollo. Ahora tienes acceso ilimitado a todo el material académico y simuladores en tiempo real.
                </p>

                <button
                  onClick={() => window.location.reload()}
                  className="px-8 py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-900 font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-none shadow-sky-500/20 rounded-none"
                >
                  Comenzar Entrenamiento
                </button>
              </div>
            ) : (
              /* FORMULARIO DE PAGO SIMULADO */
              <>
                {/* Columna Izquierda */}
                <div className="flex-1 flex flex-col justify-between border-b md:border-b-0 md:border-r border-sky-200 pb-6 md:pb-0 md:pr-8">
                  <div>
                    <span className="text-sky-600 text-[8px] font-black uppercase tracking-widest bg-sky-100 border border-sky-200 px-2 py-0.5 rounded-full">
                      Resumen de la Orden
                    </span>
                    <h3 className="text-xl font-black text-sky-950 mt-2 uppercase tracking-tight">
                      Plan {simulatedCheckoutTier === 'executive' ? 'Executive Titanium' : 'Pro Standard'}
                    </h3>
                    <p className="text-[10px] text-sky-600 mt-1">
                      Membresía comercial {billingPeriod === 'annual' ? 'anual de pago único' : 'mensual recurrente'}.
                    </p>

                    <div className="mt-4 bg-white p-4 border border-sky-100 rounded-none shadow-none">
                      <div className="flex justify-between text-xs text-sky-700">
                        <span>Membresía base</span>
                        <span className="font-semibold text-sky-950">
                          {simulatedCheckoutTier === 'executive' ? (billingPeriod === 'monthly' ? '$249.00' : '$1,499.00') : (billingPeriod === 'monthly' ? '$129.00' : '$799.00')} MXN
                      </span>
                      </div>
                      <div className="flex justify-between text-xs text-sky-700 mt-2">
                        <span>Impuestos (IVA 16%)</span>
                        <span>$0.00 MXN</span>
                      </div>
                      <div className="border-t border-sky-200 mt-3 pt-3 flex justify-between text-sm text-sky-950 font-bold">
                        <span>Total a pagar</span>
                        <span className="text-sky-600 font-black">
                          {simulatedCheckoutTier === 'executive' ? (billingPeriod === 'monthly' ? '$249.00' : '$1,499.00') : (billingPeriod === 'monthly' ? '$129.00' : '$799.00')} MXN
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* MOCKUP INTERACTIVO DE TARJETA */}
                  <div className="mt-8 relative w-full aspect-[1.586/1] bg-gradient-to-br from-blue-800 to-sky-900 border border-blue-700/80 p-5 flex flex-col justify-between shadow-xl overflow-hidden rounded-none">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-8 bg-gradient-to-br from-amber-200 via-amber-300 to-yellow-500 rounded-none border border-amber-100/50 shadow-inner p-1 flex flex-col justify-between">
                        <div className="border-b border-amber-800/10 h-1"></div>
                        <div className="border-b border-amber-800/10 h-1"></div>
                        <div className="border-b border-amber-800/10 h-1"></div>
                      </div>
                      <span className="text-slate-900 font-bold italic tracking-tighter text-sm uppercase drop-shadow-none">
                        {cardNumber.startsWith('4') ? 'Visa Pro' : cardNumber.startsWith('5') ? 'Mastercard' : 'Bank Card'}
                      </span>
                    </div>

                    <div className="text-lg md:text-xl font-mono text-slate-900 tracking-widest text-center my-4 font-black drop-shadow-none">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="text-left drop-shadow-none">
                        <p className="text-[7px] text-sky-200 uppercase tracking-wider font-semibold">Titular</p>
                        <p className="text-[10px] text-slate-900 font-bold tracking-wide truncate max-w-[120px] uppercase font-mono">
                          {cardName || 'NOMBRE DEL TITULAR'}
                        </p>
                      </div>
                      <div className="text-right drop-shadow-none">
                        <p className="text-[7px] text-sky-200 uppercase tracking-wider font-semibold">Vence</p>
                        <p className="text-[10px] text-slate-900 font-bold font-mono">
                          {cardExpiry || 'MM/YY'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Columna Derecha */}
                <div className="flex-1 flex flex-col justify-between">
                  <form onSubmit={handleSimulatedSubmit} className="space-y-4">
                    <div>
                      <h4 className="text-xs font-black text-sky-950 uppercase tracking-wider mb-3">Detalles de la Tarjeta</h4>
                      <div className="space-y-3.5">
                        <div>
                          <label className="block text-[8px] text-sky-700 font-bold uppercase tracking-wider mb-1">Nombre en la Tarjeta</label>
                          <input
                            type="text"
                            required
                            placeholder="EJ. JOHN SMITH"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value.toUpperCase())}
                            disabled={checkoutProcessing}
                            className="w-full bg-white border border-sky-200 text-sky-950 px-3 py-2 text-xs rounded-none shadow-none focus:outline-none focus:border-sky-500 transition-colors uppercase font-mono tracking-wider"
                          />
                        </div>

                        <div>
                          <label className="block text-[8px] text-sky-700 font-bold uppercase tracking-wider mb-1">Número de Tarjeta</label>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              maxLength={19}
                              placeholder="4111 2222 3333 4444"
                              value={cardNumber}
                              onChange={(e) => {
                                let val = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                                let matches = val.match(/\d{4,16}/g);
                                let match = matches && matches[0] || '';
                                let parts = [];
                                for (let i=0, len=match.length; i<len; i+=4) {
                                  parts.push(match.substring(i, i+4));
                                }
                                if (parts.length > 0) {
                                  setCardNumber(parts.join(' '));
                                } else {
                                  setCardNumber(val);
                                }
                              }}
                              disabled={checkoutProcessing}
                              className="w-full bg-white border border-sky-200 text-sky-950 px-3 py-2 text-xs rounded-none shadow-none focus:outline-none focus:border-sky-500 transition-colors font-mono tracking-widest pl-8"
                            />
                            <CreditCard size={14} className="absolute left-2.5 top-2.5 text-sky-400" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[8px] text-sky-700 font-bold uppercase tracking-wider mb-1">Vencimiento</label>
                            <input
                              type="text"
                              required
                              maxLength={5}
                              placeholder="MM/YY"
                              value={cardExpiry}
                              onChange={(e) => {
                                let val = e.target.value.replace(/[^0-9]/g, '');
                                if (val.length >= 2) {
                                  setCardExpiry(val.substring(0,2) + '/' + val.substring(2,4));
                                } else {
                                  setCardExpiry(val);
                                }
                              }}
                              disabled={checkoutProcessing}
                              className="w-full bg-white border border-sky-200 text-sky-950 px-3 py-2 text-xs rounded-none shadow-none focus:outline-none focus:border-sky-500 transition-colors font-mono text-center tracking-widest"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] text-sky-700 font-bold uppercase tracking-wider mb-1">CVC / CVV</label>
                            <input
                              type="password"
                              required
                              maxLength={4}
                              placeholder="•••"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, ''))}
                              disabled={checkoutProcessing}
                              className="w-full bg-white border border-sky-200 text-sky-950 px-3 py-2 text-xs rounded-none shadow-none focus:outline-none focus:border-sky-500 transition-colors font-mono text-center tracking-widest"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {checkoutError && (
                      <p className="text-[10px] text-rose-500 font-semibold animate-pulse">⚠️ {checkoutError}</p>
                    )}

                    {checkoutProcessing ? (
                      <div className="w-full py-3 bg-sky-50 border border-sky-200 rounded-none flex flex-col items-center justify-center gap-2">
                        <Loader2 size={16} className="animate-spin text-sky-500" />
                        <span className="text-[9px] font-black text-sky-600 uppercase tracking-widest animate-pulse">
                          {checkoutStatusText}
                        </span>
                      </div>
                    ) : (
                      <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-900 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-none shadow-sky-500/20 rounded-none"
                      >
                        <Lock size={12} />
                        Simular Pago Autorizado
                      </button>
                    )}
                  </form>

                  <div className="mt-6 text-center border-t border-sky-200 pt-4">
                    <span className="text-[8px] text-sky-600 flex items-center justify-center gap-1 font-semibold uppercase tracking-wider">
                      <ShieldCheck size={11} className="text-[#D4AF37]" />
                      Conexión Simulada Segura SSL de Grado Bancario.
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};