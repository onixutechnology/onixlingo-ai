'use client';
import LandingFooter from '@/components/LandingFooter';
import LandingNavbar from '@/components/LandingNavbar';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Check, Shield, Zap, HelpCircle, ArrowRight, Percent, Calculator, Menu, X
} from 'lucide-react';

const plans = [
  {
    name: 'Free',
    desc: 'Acceso inicial para exploración del ecosistema de idiomas.',
    priceMonthly: 0,
    priceYearly: 0,
    equivalentMonthly: 0,
    features: [
      'Acceso a lecciones estándar (Inglés, Francés, Chino)',
      '2 puzzles diarios de Ajedrez Cognitivo',
      'Modo Fácil en bloques de vocabulario',
      'Feedback básico de voz Sistema',
      'Acceso al dashboard global'
    ],
    cta: 'Empezar Gratis',
    popular: false,
    color: 'slate'
  },
  {
    name: 'Pro',
    desc: 'El plan idóneo para profesionales independientes y entusiastas.',
    priceMonthly: 129,
    priceYearly: 799,
    equivalentMonthly: 66,
    features: [
      'Acceso ilimitado a currículum completo A1-C2',
      'Puzzles de Ajedrez Cognitivo ILIMITADOS',
      'Modo Pro de Vocabulario con boost de boletos VIP x5',
      'Análisis de voz fonético estándar',
      'Participación automática en sorteos de hardware',
      'Soporte prioritario por correo'
    ],
    cta: 'Obtener Pro',
    popular: false,
    color: 'indigo'
  },
  {
    name: 'Executive',
    desc: 'Membresía Alta Dirección definitiva con simulación de juntas de nivel de élite.',
    priceMonthly: 249,
    priceYearly: 1499,
    equivalentMonthly: 125,
    features: [
      'Acceso COMPLETO a todos los idiomas e Sistema Coach',
      'Corporativo Simulator interactivo (Escenarios M&A, VC Pitch, etc.)',
      'Módulo de Speech Analytics Avanzado (8 dimensiones fonéticas)',
      'Acreditación oficial "Executive Speech Standard"',
      'Reportes ejecutivos de rendimiento detallados',
      'Descuentos en licencias corporativas adicionales',
      'Soporte prioritario 24/7 de OnixLingo'
    ],
    cta: 'Adquirir Executive',
    popular: true,
    color: 'amber'
  }
];

const faqs = [
  { q: '¿Cómo funciona la garantía de reembolso de 14 días de Paddle?', a: 'En cumplimiento con los Buyer Terms de nuestro Merchant of Record (Paddle.com), cuentas con una garantía incondicional de reembolso mínimo de 14 días calendario desde el momento del pago. Si decides cancelar dentro de este periodo, recibirás la devolución total del 100% de tu dinero de inmediato.' },
  { q: '¿Puedo cambiar de plan o cancelar en cualquier momento?', a: 'Sí, puedes subir de nivel, bajar o cancelar tu suscripción directamente desde tu panel de facturación en el dashboard con un solo clic. Si cancelas, seguirás teniendo acceso completo hasta que termine el periodo facturado.' },
  { q: '¿Qué es el multiplicador de boletos VIP x5?', a: 'Es un beneficio premium para planes Pro y Executive. Al completar un bloque de 50 palabras en dificultad Pro (velocidad máxima de 2 minutos), el sistema multiplica por cinco tus boletos del Sorteo Mensual de hardware de OnixLingo.' },
  { q: '¿Ofrecen descuentos corporativos para equipos enteros?', a: 'Sí, contamos con una calculadora B2B interactiva para compras por volumen a partir de 5 licencias. Esto incluye acceso multi-tenant de analíticas e integraciones seguras con SSO.' }
];

const API_URL = process.env.NODE_ENV === 'production' ? 'https://api.onixlingo.onixu.company' : 'http://127.0.0.1:8022';

export default function PlanesPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');
  const [employeeCount, setEmployeeCount] = useState(15);
  const [b2bPlanType, setB2bPlanType] = useState<'pro' | 'executive'>('executive');
  const [dynamicPrices, setDynamicPrices] = useState({
    pro_monthly: 129,
    pro_yearly: 799,
    exec_monthly: 249,
    exec_yearly: 1499
  });

  React.useEffect(() => {
    fetch(`${API_URL}/api/v1/billing/public/pricing`)
      .then(res => res.json())
      .then(data => {
        setDynamicPrices({
          pro_monthly: data.display_price_pro_monthly || 129,
          pro_yearly: data.display_price_pro_yearly || 799,
          exec_monthly: data.display_price_exec_monthly || 249,
          exec_yearly: data.display_price_exec_yearly || 1499
        });
      })
      .catch(err => console.error("Error fetching pricing:", err));
  }, []);
  
  const getB2bDiscount = (count: number) => {
    if (count < 5) return 0;
    if (count <= 10) return 10;
    if (count <= 50) return 20;
    return 30;
  };

  const calculateB2bCost = () => {
    // Para B2B usamos el equivalente mensual del plan anual
    const proMonthlyEq = Math.round(dynamicPrices.pro_yearly / 12);
    const execMonthlyEq = Math.round(dynamicPrices.exec_yearly / 12);
    const basePrice = b2bPlanType === 'pro' ? proMonthlyEq : execMonthlyEq; 
    const rawCost = basePrice * employeeCount;
    const discount = getB2bDiscount(employeeCount);
    const discountedCost = rawCost * (1 - discount / 100);
    return {
      raw: Math.round(rawCost),
      discountPercent: discount,
      saved: Math.round(rawCost * (discount / 100)),
      final: Math.round(discountedCost)
    };
  };

  const b2bResults = calculateB2bCost();

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 selection:bg-[#D4AF37]/20/20 selection:text-indigo-900">
      
      {/* NAVBAR */}
      <LandingNavbar />

      {/* HERO (BLACK) */}
      <header className="pt-28 pb-12 px-6 text-center relative overflow-hidden bg-slate-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#D4AF37]/10 blur-[130px] opacity-40 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase tracking-widest shadow-none">
            <Zap size={12} className="text-[#D4AF37] animate-pulse" />
            Tarifas Claras y Flexibles
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Planes de Membresía para tu<br />
            <span className="text-[#D4AF37]">Aceleración Profesional.</span>
          </h1>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed font-light">
            Selecciona el plan adecuado para tus metas académicas. Todos nuestros pagos cuentan con la protección incondicional de Paddle.
          </p>

          {/* Toggle Period */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <span className={`text-xs font-bold uppercase tracking-wider ${billingPeriod === 'monthly' ? 'text-slate-900' : 'text-slate-500'}`}>Mensual</span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className="w-12 h-7 bg-white border border-gray-600 p-1 flex items-center relative cursor-pointer"
            >
              <div className={`w-5 h-5 bg-[#D4AF37] transition-all ${billingPeriod === 'yearly' ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${billingPeriod === 'yearly' ? 'text-slate-900' : 'text-slate-500'}`}>Anual</span>
              <span className="px-2 py-0.5 bg-[#D4AF37]/20 text-[#D4AF37] text-[9px] font-black uppercase tracking-widest">Ahorra 20%</span>
            </div>
          </div>
        </div>
      </header>

      {/* PADDLE COMPLIANCE BADGE (WHITE) */}
      <section className="py-2 px-6 bg-white border-y border-black">
        <div className="max-w-4xl mx-auto bg-white border border-black p-5 flex flex-col sm:flex-row items-center gap-4 shadow-none">
          <div className="w-10 h-10 bg-white text-[#D4AF37] flex items-center justify-center shrink-0">
            <Shield size={22} />
          </div>
          <div className="space-y-0.5 text-center sm:text-left">
            <h4 className="font-bold text-black text-sm flex items-center justify-center sm:justify-start gap-1.5">
              Garantía de Reembolso Total de 14 Días
              <span className="px-2 py-0.5 bg-white border border-black text-black text-[8px] font-bold">Paddle Verified</span>
            </h4>
            <p className="text-[11px] text-gray-700 leading-relaxed font-light">
              Procesado por <strong>Paddle</strong> como Merchant of Record. Cuentas con un periodo mínimo incondicional de 14 días para solicitar el reembolso total si no estás satisfecho.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING GRID (GOLD 20%) */}
      <section className="py-12 px-6 bg-[#D4AF37]/20 border-b border-black">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((p) => {
            const isExecutive = p.name === 'Executive';
            const isPro = p.name === 'Pro';
            
            let priceMonthly = p.priceMonthly;
            let priceYearly = p.priceYearly;
            
            if (isPro) {
              priceMonthly = dynamicPrices.pro_monthly;
              priceYearly = dynamicPrices.pro_yearly;
            } else if (isExecutive) {
              priceMonthly = dynamicPrices.exec_monthly;
              priceYearly = dynamicPrices.exec_yearly;
            }
            
            const price = billingPeriod === 'monthly' ? priceMonthly : priceYearly;
            const equivalentMonthly = Math.round(priceYearly / 12);
            
            return (
              <div
                key={p.name}
                className={`bg-white border p-6 md:p-8 flex flex-col justify-between relative transition-all group ${isExecutive ? 'border-2 border-black shadow-xl ring-1 ring-black/10' : 'border-black/20 shadow-none hover:border-black/50 hover:shadow-none'}`}
              >
                {isExecutive && (
                  <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-white text-[#D4AF37] font-black text-[8px] uppercase tracking-widest px-3 py-1">
                    Alta Dirección Recommended
                  </div>
                )}

                <div className="space-y-5">
                  <div>
                    <h3 className="font-black text-xl text-black uppercase tracking-tight">{p.name}</h3>
                    <p className="text-xs text-gray-600 mt-2 min-h-[32px] font-medium leading-relaxed">{p.desc}</p>
                  </div>

                  <div className="border-t border-b border-black/10 py-5 flex flex-col gap-0.5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs font-bold text-slate-500">$</span>
                      <span className="text-4xl font-black text-black tracking-tight font-mono">{price}</span>
                      <span className="text-[9px] text-slate-500 font-bold uppercase">MXN / {billingPeriod === 'monthly' ? 'mes' : 'año'}</span>
                    </div>
                    {billingPeriod === 'yearly' && equivalentMonthly > 0 && (
                      <span className="text-[9px] font-bold text-black/70">
                        (Equivale a ${equivalentMonthly} MXN/mes)
                      </span>
                    )}
                  </div>

                  <ul className="space-y-3 pt-1">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-gray-800 font-medium leading-relaxed">
                        <Check size={14} className={`shrink-0 mt-0.5 ${isExecutive ? 'text-[#D4AF37]' : 'text-black'}`} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-3">
                  <Link href={`/register?tier=${p.name.toLowerCase()}`} className="w-full block">
                    <button
                      className={`w-full py-3 px-5 font-bold text-xs uppercase tracking-widest transition-all ${isExecutive ? 'bg-[#D4AF37] hover:bg-[#b5952f] text-black border border-[#D4AF37]' : 'bg-white hover:bg-gray-800 text-slate-900'}`}
                    >
                      {p.cta}
                    </button>
                  </Link>
                  <p className="text-[9px] text-slate-500 text-center font-bold uppercase tracking-wider mt-3">
                    Garantía Paddle de 14 días
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* B2B BULK CALCULATOR (WHITE) */}
      <section className="py-20 px-6 bg-white text-black border-b border-black relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-[400px] h-[300px] bg-[#D4AF37]/10 blur-[120px] pointer-events-none rounded-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs font-black text-black uppercase tracking-widest bg-[#D4AF37] px-2 py-1">Enterprise Calculator</span>
              <h2 className="text-3xl font-bold tracking-tight text-black leading-tight">
                Licenciamiento Corporativo B2B
              </h2>
              <p className="text-gray-600 leading-relaxed font-light text-xs">
                Añade colaboradores a tu plan corporativo de OnixLingo y obtén automáticamente descuentos por volumen en tu suscripción anual.
              </p>

              <div className="space-y-3 pt-3 font-medium text-xs text-gray-700">
                <div className="flex items-center gap-2">
                  <Percent size={12} className="text-black" />
                  <span>5-10 colaboradores: <strong>10% descuento</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Percent size={12} className="text-black" />
                  <span>11-50 colaboradores: <strong>20% descuento</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Percent size={12} className="text-[#D4AF37]" />
                  <span>51+ colaboradores: <strong>30% descuento</strong></span>
                </div>
              </div>
            </div>

            {/* Calculator Widget */}
            <div className="lg:col-span-7 bg-white border border-black p-6 md:p-8 shadow-2xl">
              <div className="space-y-5">
                
                <div className="flex gap-4 border-b border-black/20 pb-3">
                  <button
                    onClick={() => setB2bPlanType('pro')}
                    className={`flex-1 pb-1.5 text-center text-xs font-bold transition-all border-b-2 ${b2bPlanType === 'pro' ? 'border-black text-black' : 'border-transparent text-slate-500 hover:text-black'}`}
                  >
                    Licencia Pro
                  </button>
                  <button
                    onClick={() => setB2bPlanType('executive')}
                    className={`flex-1 pb-1.5 text-center text-xs font-bold transition-all border-b-2 ${b2bPlanType === 'executive' ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-transparent text-slate-500 hover:text-black'}`}
                  >
                    Licencia Executive
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-gray-600">Colaboradores:</span>
                    <span className="text-slate-900 bg-white px-2 py-0.5 font-mono">{employeeCount} licencias</span>
                  </div>
                  <input
                    type="range" min="1" max="150" value={employeeCount}
                    onChange={(e) => setEmployeeCount(parseInt(e.target.value))}
                    className="w-full h-1 bg-gray-200 accent-black transition-colors"
                  />
                </div>

                <div className="bg-white border border-black p-4 md:p-6 space-y-3 font-mono text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Costo base anual:</span>
                    <span className="line-through">${b2bResults.raw * 12} MXN</span>
                  </div>

                  <div className="flex justify-between items-center text-black font-bold">
                    <span>Descuento aplicado:</span>
                    <span className="bg-[#D4AF37]/20 px-2 py-0.5 border border-[#D4AF37]">-{b2bResults.discountPercent}% OFF</span>
                  </div>

                  <div className="flex justify-between text-gray-600 pb-3 border-b border-black/20">
                    <span>Ahorro total:</span>
                    <span className="text-black font-bold">-${b2bResults.saved * 12} MXN / año</span>
                  </div>

                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-xs font-bold text-gray-700">Costo total proyectado:</span>
                    <div className="text-right">
                      <p className="text-2xl font-black text-black font-mono">${b2bResults.final} <span className="text-[10px] font-bold text-slate-500">MXN / mes</span></p>
                      <p className="text-[9px] text-slate-500 uppercase mt-0.5">Anualizado: ${b2bResults.final * 12} MXN</p>
                    </div>
                  </div>
                </div>

                <div className="pt-1">
                  <Link href={`/ventas/corporativa?licenses=${employeeCount}&tier=${b2bPlanType}`} className="w-full block">
                    <button className="w-full py-3 bg-white hover:bg-slate-50 text-[#D4AF37] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-none border border-[#D4AF37]">
                      <Calculator size={12} /> Solicitar Cotización Formal
                    </button>
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* COMPARISON TABLE (BLACK) */}
      <section className="py-20 px-6 bg-slate-50 text-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight font-serif">Tabla Comparativa</h2>
            <p className="text-slate-600 text-xs max-w-md mx-auto">Estudio detallado de los beneficios y límites de cada membresía.</p>
          </div>

          <div className="overflow-x-auto border border-black bg-slate-50">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-[9px] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 font-mono">
                  <th className="p-3.5 border-r border-slate-200">Característica</th>
                  <th className="p-3.5 border-r border-slate-200">Free</th>
                  <th className="p-3.5 border-r border-slate-200">Pro</th>
                  <th className="p-3.5">Executive</th>
                </tr>
              </thead>
              <tbody className="text-xs text-slate-700 font-medium">
                {[
                  { name: 'Cursos de Idiomas (Inglés, Chino, Francés)', f: 'Lecciones básicas', p: 'Completo (A1 a C2)', e: 'Completo + Multi-accent' },
                  { name: 'Ajedrez Cognitivo Estratégico', f: '2 puzzles diarios', p: 'Ilimitado', e: 'Ilimitado + Tutor automatizado' },
                  { name: 'Drills de Vocabulario', f: 'Solo Fácil', p: 'Fácil, Medio y Pro', e: 'Acceso Total + SRS' },
                  { name: 'Multiplicador de Boletos VIP Sorteos', f: 'No', p: 'x5 Boost en Pro', e: 'x5 Boost en Pro' },
                  { name: 'Corporativo Simulator Alta Dirección', f: 'No', p: 'No', e: 'Ilimitado (60 unidades)' },
                  { name: 'Speech Analytics Diagnostics', f: 'Standard Feedback', p: 'Standard Feedback', e: 'Avanzado de 8 dimensiones fonéticas' },
                  { name: 'Reportes Ejecutivos de Progreso', f: 'No', p: 'No', e: 'Sí' }
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-200 hover:bg-white/50">
                    <td className="p-3.5 font-bold text-slate-900 border-r border-slate-200">{row.name}</td>
                    <td className="p-3.5 border-r border-slate-200 text-slate-500">{row.f}</td>
                    <td className="p-3.5 border-r border-slate-200 text-slate-700 font-bold">{row.p}</td>
                    <td className="p-3.5 text-[#D4AF37] font-black">{row.e}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQS (WHITE) */}
      <section className="py-20 px-6 bg-white border-y border-black text-black">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-3xl font-bold text-black">Preguntas Frecuentes</h2>
            <p className="text-gray-600 text-xs">Respuestas rápidas sobre facturación y la pasarela de pago segura de Paddle.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="p-5 bg-white border border-black space-y-1">
                <h4 className="font-bold text-black text-sm flex items-start gap-2">
                  <HelpCircle size={15} className="text-[#D4AF37] mt-0.5 shrink-0" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-gray-700 leading-relaxed pl-6 font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <LandingFooter />
    </div>
  );
}
