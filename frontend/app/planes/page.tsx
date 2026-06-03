'use client';

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
      'Feedback básico de voz IA',
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
    desc: 'Membresía C-Suite definitiva con simulación de juntas de nivel de élite.',
    priceMonthly: 249,
    priceYearly: 1499,
    equivalentMonthly: 125,
    features: [
      'Acceso COMPLETO a todos los idiomas e IA Coach',
      'Boardroom Simulator interactivo (Escenarios M&A, VC Pitch, etc.)',
      'Módulo de Speech Analytics Avanzado (8 dimensiones fonéticas)',
      'Acreditación oficial "Executive Speech Standard"',
      'Certificados blockchain de OnixLingo verificables',
      'Descuentos en licencias corporativas adicionales',
      'Soporte prioritario 24/7 de OnixCorp'
    ],
    cta: 'Adquirir Executive',
    popular: true,
    color: 'amber'
  }
];

const faqs = [
  { q: '¿Cómo funciona la garantía de reembolso de 14 días de Paddle?', a: 'En cumplimiento con los Buyer Terms de nuestro Merchant of Record (Paddle.com), cuentas con una garantía incondicional de reembolso mínimo de 14 días calendario desde el momento del pago. Si decides cancelar dentro de este periodo, recibirás la devolución total del 100% de tu dinero de inmediato.' },
  { q: '¿Puedo cambiar de plan o cancelar en cualquier momento?', a: 'Sí, puedes subir de nivel, bajar o cancelar tu suscripción directamente desde tu panel de facturación en el dashboard con un solo clic. Si cancelas, seguirás teniendo acceso completo hasta que termine el periodo facturado.' },
  { q: '¿Qué es el multiplicador de boletos VIP x5?', a: 'Es un beneficio premium para planes Pro y Executive. Al completar un bloque de 50 palabras en dificultad Pro (velocidad máxima de 2 minutos), el sistema multiplica por cinco tus boletos del Sorteo Mensual de hardware de OnixCorp.' },
  { q: '¿Ofrecen descuentos corporativos para equipos enteros?', a: 'Sí, contamos con una calculadora B2B interactiva para compras por volumen a partir de 5 licencias. Esto incluye acceso multi-tenant de analíticas e integraciones seguras con SSO.' }
];

export default function PlanesPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');
  const [employeeCount, setEmployeeCount] = useState(15);
  const [b2bPlanType, setB2bPlanType] = useState<'pro' | 'executive'>('executive');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getB2bDiscount = (count: number) => {
    if (count < 5) return 0;
    if (count <= 10) return 10;
    if (count <= 50) return 20;
    return 30;
  };

  const calculateB2bCost = () => {
    const basePrice = b2bPlanType === 'pro' ? 66 : 125; 
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
    <div className="min-h-screen bg-[#edf7f2] font-sans text-slate-800 selection:bg-indigo-500/20 selection:text-indigo-900">
      
      {/* NAVBAR */}
      <nav className="fixed w-full bg-[#edf7f2]/90 backdrop-blur-xl border-b border-emerald-100 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/20">
              <span>O</span>
            </div>
            <span className="font-bold text-slate-900 tracking-tight text-xl">OnixLingo</span>
          </Link>
          <div className="hidden md:flex gap-8 items-center text-sm font-semibold text-slate-600">
            <Link href="/caracteristicas" className="hover:text-indigo-600 transition-colors">Características</Link>
            <Link href="/vocabulario" className="hover:text-indigo-600 transition-colors">Vocabulario</Link>
            <Link href="/programa-ejecutivo" className="hover:text-indigo-600 transition-colors">Programa Ejecutivo</Link>
            <Link href="/planes" className="text-indigo-600 border-b-2 border-indigo-600 pb-1">Planes</Link>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/login" className="hidden md:block text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Iniciar Sesión</Link>
            <Link href="/register">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 px-4 md:px-6 transition-all shadow-md shadow-indigo-600/20 hover:scale-105">
                Crear Cuenta
              </button>
            </Link>
            {/* Botón menú móvil */}
            <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menú Móvil Desplegable */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-emerald-100 shadow-lg px-6 py-4 flex flex-col gap-4 text-sm font-semibold text-slate-600">
            <Link href="/caracteristicas" className="hover:text-indigo-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Características</Link>
            <Link href="/vocabulario" className="hover:text-indigo-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Vocabulario</Link>
            <Link href="/programa-ejecutivo" className="hover:text-indigo-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Programa Ejecutivo</Link>
            <Link href="/planes" className="text-indigo-600" onClick={() => setIsMenuOpen(false)}>Planes</Link>
            <div className="h-px bg-slate-200 my-2"></div>
            <Link href="/login" className="hover:text-indigo-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Iniciar Sesión</Link>
          </div>
        )}
      </nav>

      {/* HERO */}
      <header className="pt-36 pb-16 px-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-indigo-100/40 blur-[130px] opacity-40 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest shadow-sm">
            <Zap size={12} className="text-indigo-650 animate-pulse" />
            Tarifas Claras y Flexibles
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Planes de Membresía para tu<br />
            <span className="text-indigo-600">Aceleración Profesional.</span>
          </h1>
          <p className="text-lg text-slate-650 max-w-2xl mx-auto leading-relaxed font-light">
            Selecciona el plan adecuado para tus metas académicas. Todos nuestros pagos cuentan con la protección incondicional de Paddle.
          </p>

          {/* Toggle Period */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <span className={`text-xs font-bold uppercase tracking-wider ${billingPeriod === 'monthly' ? 'text-indigo-600' : 'text-slate-500'}`}>Mensual</span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className="w-12 h-7 bg-slate-200 border border-slate-350 p-1 flex items-center relative cursor-pointer"
            >
              <div className={`w-5 h-5 bg-indigo-600 transition-all ${billingPeriod === 'yearly' ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${billingPeriod === 'yearly' ? 'text-indigo-600' : 'text-slate-500'}`}>Anual</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-widest">Ahorra 20%</span>
            </div>
          </div>
        </div>
      </header>

      {/* PADDLE COMPLIANCE BADGE */}
      <section className="py-2 px-6">
        <div className="max-w-4xl mx-auto bg-white border border-emerald-100 p-5 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Shield size={22} />
          </div>
          <div className="space-y-0.5 text-center sm:text-left">
            <h4 className="font-bold text-slate-900 text-sm flex items-center justify-center sm:justify-start gap-1.5">
              Garantía de Reembolso Total de 14 Días
              <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[8px] font-bold">Paddle Verified</span>
            </h4>
            <p className="text-[11px] text-slate-550 leading-relaxed font-light">
              Procesado por <strong>Paddle</strong> como Merchant of Record. Cuentas con un periodo mínimo incondicional de 14 días para solicitar el reembolso total si no estás satisfecho.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING GRID */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((p) => {
            const isExecutive = p.name === 'Executive';
            const price = billingPeriod === 'monthly' ? p.priceMonthly : p.priceYearly;
            
            return (
              <div
                key={p.name}
                className={`bg-white border p-6 md:p-8 flex flex-col justify-between relative transition-all group ${isExecutive ? 'border-2 border-amber-500 shadow-xl ring-1 ring-amber-500/10' : 'border-slate-200 shadow-sm hover:border-slate-350 hover:shadow-md'}`}
              >
                {isExecutive && (
                  <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-amber-500 text-slate-950 font-black text-[8px] uppercase tracking-widest px-3 py-1">
                    C-Suite Recommended
                  </div>
                )}

                <div className="space-y-5">
                  <div>
                    <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight">{p.name}</h3>
                    <p className="text-xs text-slate-400 mt-2 min-h-[32px] font-light leading-relaxed">{p.desc}</p>
                  </div>

                  <div className="border-t border-b border-slate-105 py-5 flex flex-col gap-0.5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs font-bold text-slate-400">$</span>
                      <span className="text-4xl font-black text-slate-900 tracking-tight font-mono">{price}</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase">MXN / {billingPeriod === 'monthly' ? 'mes' : 'año'}</span>
                    </div>
                    {billingPeriod === 'yearly' && p.equivalentMonthly > 0 && (
                      <span className="text-[9px] font-bold text-emerald-600">
                        (Equivale a ${p.equivalentMonthly} MXN/mes)
                      </span>
                    )}
                  </div>

                  <ul className="space-y-3 pt-1">
                    {p.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-650 font-medium leading-relaxed">
                        <Check size={14} className={`shrink-0 mt-0.5 ${isExecutive ? 'text-amber-500' : 'text-indigo-600'}`} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-3">
                  <Link href={`/register?tier=${p.name.toLowerCase()}`} className="w-full block">
                    <button
                      className={`w-full py-3 px-5 font-bold text-xs uppercase tracking-widest transition-all ${isExecutive ? 'bg-amber-500 hover:bg-amber-600 text-slate-950' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
                    >
                      {p.cta}
                    </button>
                  </Link>
                  <p className="text-[9px] text-slate-450 text-center font-bold uppercase tracking-wider mt-3">
                    Garantía Paddle de 14 días
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* B2B BULK CALCULATOR */}
      <section className="py-20 px-6 bg-slate-900 text-white border-t border-slate-850 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-[400px] h-[300px] bg-indigo-500/5 blur-[120px] pointer-events-none rounded-none" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">Enterprise Calculator</span>
              <h2 className="text-3xl font-bold tracking-tight text-white leading-tight">
                Licenciamiento Corporativo B2B
              </h2>
              <p className="text-slate-400 leading-relaxed font-light text-xs">
                Añade colaboradores a tu plan corporativo de OnixCorp y obtén automáticamente descuentos por volumen en tu suscripción anual.
              </p>

              <div className="space-y-3 pt-3 font-medium text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Percent size={12} className="text-indigo-455" />
                  <span>5-10 colaboradores: <strong>10% descuento</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Percent size={12} className="text-indigo-455" />
                  <span>11-50 colaboradores: <strong>20% descuento</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Percent size={12} className="text-indigo-455" />
                  <span>51+ colaboradores: <strong>30% descuento</strong></span>
                </div>
              </div>
            </div>

            {/* Calculator Widget */}
            <div className="lg:col-span-7 bg-slate-950 border border-slate-800 p-6 md:p-8 shadow-2xl">
              <div className="space-y-5">
                
                <div className="flex gap-4 border-b border-slate-850 pb-3">
                  <button
                    onClick={() => setB2bPlanType('pro')}
                    className={`flex-1 pb-1.5 text-center text-xs font-bold transition-all border-b-2 ${b2bPlanType === 'pro' ? 'border-indigo-450 text-indigo-450' : 'border-transparent text-slate-500 hover:text-slate-400'}`}
                  >
                    Licencia Pro
                  </button>
                  <button
                    onClick={() => setB2bPlanType('executive')}
                    className={`flex-1 pb-1.5 text-center text-xs font-bold transition-all border-b-2 ${b2bPlanType === 'executive' ? 'border-amber-450 text-amber-450' : 'border-transparent text-slate-500 hover:text-slate-400'}`}
                  >
                    Licencia Executive
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-400">Colaboradores:</span>
                    <span className="text-white bg-slate-800 px-2 py-0.5 font-mono">{employeeCount} licencias</span>
                  </div>
                  <input
                    type="range" min="1" max="150" value={employeeCount}
                    onChange={(e) => setEmployeeCount(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-800 accent-indigo-500 transition-colors"
                  />
                </div>

                <div className="bg-slate-900 border border-slate-850 p-4 md:p-6 space-y-3 font-mono text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Costo base anual:</span>
                    <span className="line-through">${b2bResults.raw * 12} MXN</span>
                  </div>

                  <div className="flex justify-between items-center text-emerald-400 font-bold">
                    <span>Descuento aplicado:</span>
                    <span className="bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">-{b2bResults.discountPercent}% OFF</span>
                  </div>

                  <div className="flex justify-between text-slate-400 pb-3 border-b border-slate-850">
                    <span>Ahorro total:</span>
                    <span className="text-emerald-450">-${b2bResults.saved * 12} MXN / año</span>
                  </div>

                  <div className="flex justify-between items-baseline pt-1">
                    <span className="text-xs font-bold text-slate-350">Costo total proyectado:</span>
                    <div className="text-right">
                      <p className="text-2xl font-black text-white font-mono">${b2bResults.final} <span className="text-[10px] font-bold text-slate-500">MXN / mes</span></p>
                      <p className="text-[9px] text-slate-500 uppercase mt-0.5">Anualizado: ${b2bResults.final * 12} MXN</p>
                    </div>
                  </div>
                </div>

                <div className="pt-1">
                  <Link href={`/ventas/corporativa?licenses=${employeeCount}&tier=${b2bPlanType}`} className="w-full block">
                    <button className="w-full py-3 bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-650/15">
                      <Calculator size={12} /> Solicitar Cotización Formal
                    </button>
                  </Link>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="py-20 px-6 bg-white border-t border-emerald-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight font-serif">Tabla Comparativa</h2>
            <p className="text-slate-550 text-xs max-w-md mx-auto">Estudio detallado de los beneficios y límites de cada membresía.</p>
          </div>

          <div className="overflow-x-auto border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[9px] text-slate-450 font-bold uppercase tracking-wider border-b border-slate-200 font-mono">
                  <th className="p-3.5 border-r border-slate-200">Característica</th>
                  <th className="p-3.5 border-r border-slate-200">Free</th>
                  <th className="p-3.5 border-r border-slate-200">Pro</th>
                  <th className="p-3.5">Executive</th>
                </tr>
              </thead>
              <tbody className="text-xs text-slate-700 font-medium">
                {[
                  { name: 'Cursos de Idiomas (Inglés, Chino, Francés)', f: 'Lecciones básicas', p: 'Completo (A1 a C2)', e: 'Completo + Multi-accent' },
                  { name: 'Ajedrez Cognitivo Estratégico', f: '2 puzzles diarios', p: 'Ilimitado', e: 'Ilimitado + Tutor IA' },
                  { name: 'Drills de Vocabulario', f: 'Solo Fácil', p: 'Fácil, Medio y Pro', e: 'Acceso Total + SRS' },
                  { name: 'Multiplicador de Boletos VIP Sorteos', f: 'No', p: 'x5 Boost en Pro', e: 'x5 Boost en Pro' },
                  { name: 'Boardroom Simulator C-Suite', f: 'No', p: 'No', e: 'Ilimitado (60 unidades)' },
                  { name: 'Speech Analytics Diagnostics', f: 'Standard Feedback', p: 'Standard Feedback', e: 'Avanzado de 8 dimensiones fonéticas' },
                  { name: 'Acreditaciones Oficiales OnixCorp', f: 'No', p: 'No', e: 'Sí (Verificable blockchain)' }
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-900 border-r border-slate-200">{row.name}</td>
                    <td className="p-3.5 border-r border-slate-200 text-slate-500">{row.f}</td>
                    <td className="p-3.5 border-r border-slate-200 text-indigo-650 font-bold">{row.p}</td>
                    <td className="p-3.5 text-amber-700 font-black">{row.e}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQS */}
      <section className="py-20 px-6 bg-[#edf7f2] border-t border-emerald-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">Preguntas Frecuentes</h2>
            <p className="text-slate-500 text-xs">Respuestas rápidas sobre facturación y la pasarela de pago segura de Paddle.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="p-5 bg-white border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-900 text-sm flex items-start gap-2">
                  <HelpCircle size={15} className="text-indigo-600 mt-0.5 shrink-0" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-slate-550 leading-relaxed pl-6 font-light">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#e2efe7] py-10 px-6 text-sm text-slate-655 border-t border-emerald-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-bold text-slate-900">OnixLingo</span>
          <div className="flex gap-6 font-medium flex-wrap">
            <Link href="/planes" className="hover:text-indigo-600 transition-colors">Planes</Link>
            <Link href="/legal/privacy" className="hover:text-indigo-600 transition-colors">Privacidad</Link>
            <Link href="/legal/terms" className="hover:text-indigo-600 transition-colors">Términos</Link>
            <Link href="/legal/refunds" className="hover:text-indigo-600 transition-colors">Reembolsos</Link>
            <Link href="/legal/support" className="hover:text-indigo-600 transition-colors">Soporte</Link>
          </div>
          <div className="text-left md:text-right text-xs space-y-1">
            <p>© 2026 OnixuTechnology.</p>
            <p className="text-[10px] text-slate-550 font-light">Pagos procesados por Paddle, nuestro Merchant of Record.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
