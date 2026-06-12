'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Building2, Users, Briefcase, Mail, Phone, Calculator, Check, ArrowRight,
  ShieldCheck, Loader2, Sparkles, Send, FileText, ChevronRight, AlertCircle,
  Clock, Globe, Server, CheckCircle2
} from 'lucide-react';

function CorporativaFormContent() {
  const searchParams = useSearchParams();
  
  // Capturar parámetros de la URL pasados desde la calculadora en planes
  const urlLicenses = searchParams.get('licenses');
  const urlTier = searchParams.get('tier');

  // Estados del Formulario
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenses, setLicenses] = useState(urlLicenses ? parseInt(urlLicenses) : 15);
  const [tier, setTier] = useState<'pro' | 'executive'>(urlTier === 'pro' ? 'pro' : 'executive');
  const [implementationDate, setImplementationDate] = useState('inmediato');
  const [notes, setNotes] = useState('');

  // Estados de carga e interfaz
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  // Sincronizar parámetros si cambian en la URL
  useEffect(() => {
    if (urlLicenses) setLicenses(parseInt(urlLicenses));
    if (urlTier) setTier(urlTier === 'pro' ? 'pro' : 'executive');
  }, [urlLicenses, urlTier]);

  // Cálculos de costo dinámicos en base a MXN para reflejar el embudo de ventas
  const getB2bDiscount = (count: number) => {
    if (count < 5) return 0;
    if (count <= 10) return 10;
    if (count <= 50) return 20;
    return 30;
  };

  const baseMonthlyPrice = tier === 'pro' ? 66 : 125; // Precios de base anual equivalentes
  const discountPercent = getB2bDiscount(licenses);
  const costPerMonthRaw = baseMonthlyPrice * licenses;
  const costPerMonthFinal = Math.round(costPerMonthRaw * (1 - discountPercent / 100));
  const annualSavings = Math.round((costPerMonthRaw - costPerMonthFinal) * 12);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validaciones básicas
    if (!companyName.trim() || !contactName.trim() || !email.trim() || !phone.trim()) {
      setFormError('Por favor complete todos los campos obligatorios.');
      return;
    }

    if (!email.includes('@')) {
      setFormError('Por favor ingrese un correo electrónico corporativo válido.');
      return;
    }

    setIsSubmitting(true);

    // Simular el envío al embudo corporativo
    try {
      // En un entorno real de producción, esto envía un POST a la API Relay de onixu.company:
      // await fetch('https://api.onixu.company/v1/corporate-lead', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ companyName, contactName, email, phone, licenses, tier, implementationDate, notes, costPerMonthFinal })
      // });
      
      await new Promise((resolve) => setTimeout(resolve, 1800)); // Simulación de red
      setIsSubmitted(true);
    } catch (err) {
      console.error(err);
      setFormError('Ocurrió un error de red al procesar tu solicitud. Intente de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
      
      {/* Columna Izquierda: Información de cotización y arquitectura de embudo */}
      <div className="lg:col-span-5 space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-black text-indigo-650 uppercase tracking-widest block">Licenciamiento Corporativo B2B</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Solicitud de Propuesta Formal
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed font-light">
            Completa la información de tu organización para estructurar tu cotización formal. Nuestro equipo de OnixLingo emitirá un documento oficial de facturación deducible de impuestos.
          </p>
        </div>

        {/* Resumen dinámico del requerimiento pre-llenado */}
        <div className="p-6 bg-white border border-black shadow-none space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-black/10">
            <h4 className="font-bold text-xs text-black uppercase tracking-wider flex items-center gap-1.5">
              <Calculator size={14} className="text-[#D4AF37]" />
              Resumen de Requerimiento
            </h4>
            <span className="px-2 py-0.5 bg-white text-[#D4AF37] text-[9px] font-bold uppercase">Pre-llenado</span>
          </div>

          <div className="space-y-2 text-xs text-gray-700 font-medium">
            <div className="flex justify-between">
              <span className="text-slate-500">Tipo de Licencias:</span>
              <span className="text-black font-bold uppercase">Membresía {tier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Número de Colaboradores:</span>
              <span className="text-black font-bold">{licenses} usuarios</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Descuento Volumétrico:</span>
              <span className="text-black font-bold">-{discountPercent}% OFF</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-black/10 items-baseline">
              <span className="text-black font-bold">Inversión Mensual Proyectada:</span>
              <span className="text-base font-black text-black font-mono">${costPerMonthFinal} MXN</span>
            </div>
            {annualSavings > 0 && (
              <div className="p-2 bg-[#D4AF37]/20 border border-[#D4AF37] text-[10px] text-black font-bold mt-1 text-center">
                🎉 Ahorro Anual Proyectado: ${annualSavings} MXN
              </div>
            )}
          </div>
        </div>

        {/* Explicación Técnica de la Conexión de Embudo (El Puente) */}
        <div className="p-6 bg-white text-slate-900 border border-slate-200 space-y-4">
          <h4 className="font-bold text-xs text-[#D4AF37] uppercase tracking-widest flex items-center gap-2">
            <Server size={14} />
            Arquitectura de Conexión (El Puente)
          </h4>
          <p className="text-[11px] text-slate-500 leading-relaxed font-light">
            ¿Cómo viajan los datos desde esta página de <strong>OnixLingo</strong> hasta tu correo corporativo en <strong>onixu.company</strong>?
          </p>

          <div className="space-y-3.5 text-[11px] text-slate-300">
            <div className="flex gap-3 items-start">
              <span className="w-5 h-5 rounded-full bg-slate-50 text-slate-200 flex items-center justify-center font-mono font-bold shrink-0 mt-0.5">1</span>
              <div>
                <p className="font-bold text-slate-900 mb-0.5">Disparador Webhook / API Relay:</p>
                <p className="font-light">Al enviar el formulario, el cliente envía un payload JSON seguro vía HTTPS a `https://api.onixu.company/v1/corporate-lead`.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="w-5 h-5 rounded-full bg-slate-50 text-slate-200 flex items-center justify-center font-mono font-bold shrink-0 mt-0.5">2</span>
              <div>
                <p className="font-bold text-slate-900 mb-0.5">SMTP Relay en tu Servidor:</p>
                <p className="font-light">Tu servidor API en `onixu.company` valida la firma del webhook, formatea un template HTML premium y lo envía a tu correo usando SMTP seguro.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="w-5 h-5 rounded-full bg-gray-800 text-slate-900 flex items-center justify-center font-mono font-bold shrink-0 mt-0.5">3</span>
              <div>
                <p className="font-bold text-slate-900 mb-0.5">Notificación CRM Automatizada:</p>
                <p className="font-light">Además de recibirlo en tu correo, el payload alimenta directamente tu CRM empresarial corporativo para seguimiento de ventas.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Columna Derecha: El Formulario */}
      <div className="lg:col-span-7 bg-white border border-black p-8 shadow-none relative">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-[#D4AF37]" />

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Formulario de Requerimiento</h3>
              <p className="text-xs text-slate-500">Todos los campos con (*) son requeridos de forma obligatoria.</p>
            </div>

            {formError && (
              <div className="p-3 bg-[#D4AF37]/10 border border-red-200 text-[#D4AF37] text-xs flex gap-2 items-center animate-pulse">
                <AlertCircle size={14} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Nombre de la Empresa */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Nombre de la Empresa *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"><Building2 size={14} /></span>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Ej. OnixLingo S.A."
                    className="w-full text-xs pl-10 pr-4 py-3 bg-white border border-black/20 focus:bg-white focus:border-black outline-none font-medium"
                  />
                </div>
              </div>

              {/* Nombre del Contacto */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Nombre del Contacto *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"><Briefcase size={14} /></span>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Ej. Ing. A. P. C."
                    className="w-full text-xs pl-10 pr-4 py-3 bg-white border border-black/20 focus:bg-white focus:border-black outline-none font-medium"
                  />
                </div>
              </div>

              {/* Correo Electrónico Corporativo */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Correo Corporativo *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"><Mail size={14} /></span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ej. aperez@onixu.company"
                    className="w-full text-xs pl-10 pr-4 py-3 bg-white border border-black/20 focus:bg-white focus:border-black outline-none font-medium"
                  />
                </div>
              </div>

              {/* Teléfono de Contacto */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Teléfono de Contacto *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"><Phone size={14} /></span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej. +52 55 1234 5678"
                    className="w-full text-xs pl-10 pr-4 py-3 bg-white border border-black/20 focus:bg-white focus:border-black outline-none font-medium"
                  />
                </div>
              </div>

              {/* Número de Licencias */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Número de Licencias *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={licenses}
                  onChange={(e) => setLicenses(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-xs px-4 py-3 bg-white border border-black/20 focus:bg-white focus:border-black outline-none font-medium"
                />
              </div>

              {/* Tipo de Plan */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Nivel de Membresía *</label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value as 'pro' | 'executive')}
                  className="w-full text-xs px-4 py-3 bg-white border border-black/20 focus:bg-white focus:border-black outline-none font-medium"
                >
                  <option value="pro">Pro (Estándar)</option>
                  <option value="executive">Executive (Alta Dirección Elite)</option>
                </select>
              </div>
            </div>

            {/* Fecha de Implementación */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Fecha Estimada de Implementación</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'inmediato', label: 'Inmediato' },
                  { id: '1mes', label: '1 a 3 meses' },
                  { id: '3meses', label: 'Más de 3 meses' }
                ].map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setImplementationDate(d.id)}
                    className={`py-2 px-1 text-center text-xs font-bold border transition-colors ${implementationDate === d.id ? 'border-black bg-white text-[#D4AF37]' : 'bg-white border-gray-200 hover:border-black text-gray-600'}`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notas y Requerimientos especiales */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Requerimientos Especiales / Notas</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej. Necesitamos integración con SSO corporativo o soporte personalizado para un dialecto específico..."
                className="w-full text-xs p-3 bg-white border border-black/20 focus:bg-white focus:border-black outline-none font-medium"
                rows={4}
              />
            </div>

            <div className="pt-4 border-t border-black/10 flex justify-between items-center gap-4">
              <span className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
                <ShieldCheck size={14} className="text-[#D4AF37]" />
                Auditoría E2E segura SOC2.
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-white hover:bg-slate-50 text-[#D4AF37] font-bold py-3.5 px-8 text-xs tracking-wider uppercase transition-all shadow-none active:scale-95 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Procesando...
                  </>
                ) : (
                  <>
                    <Send size={14} /> Solicitar Propuesta B2B
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center space-y-6 py-12">
            <div className="w-16 h-16 bg-[#D4AF37]/20 border border-[#D4AF37] text-black flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-black">¡Requerimiento B2B Recibido!</h3>
              <p className="text-slate-500 text-xs max-w-md mx-auto leading-relaxed">
                Los datos de tu cotización han sido procesados y transmitidos con éxito al embudo API de <strong>onixu.company</strong>. Recibirás la propuesta oficial y plan de estudios corporativo en tu correo corporativo en menos de 24 horas.
              </p>
            </div>

            <div className="bg-white border border-gray-200 p-4 max-w-sm mx-auto text-left text-xs space-y-1.5 text-gray-600 font-medium">
              <p>📩 <strong>Enviado a:</strong> {email}</p>
              <p>🏢 <strong>Empresa:</strong> {companyName}</p>
              <p>👤 <strong>Contacto:</strong> {contactName}</p>
              <p>👥 <strong>Licencias:</strong> {licenses} ({tier === 'pro' ? 'Pro' : 'Executive'})</p>
            </div>

            <div className="flex gap-4 justify-center pt-4">
              <button
                onClick={() => setIsSubmitted(false)}
                className="border border-black hover:bg-white hover:text-[#D4AF37] bg-white text-black font-bold py-2.5 px-8 text-xs uppercase tracking-wider transition-colors"
              >
                Crear Otra Solicitud
              </button>
              <Link href="/planes">
                <button className="bg-white hover:bg-slate-50 text-[#D4AF37] font-bold py-2.5 px-8 text-xs uppercase tracking-wider transition-all shadow-none">
                  Volver a Planes
                </button>
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function CorporativaPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-black selection:bg-[#D4AF37]/20 selection:text-black">
      
      {/* NAVBAR */}
      <nav className="fixed w-full bg-white/95 backdrop-blur-xl border-b border-black z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white flex items-center justify-center text-[#D4AF37] font-bold shadow-none shadow-black/20 border border-[#D4AF37]/30">
              <span>O</span>
            </div>
            <span className="font-bold text-black tracking-tight text-xl">OnixLingo</span>
          </Link>
          <div className="hidden md:flex gap-8 items-center text-sm font-semibold text-slate-500">
            <Link href="/caracteristicas" className="hover:text-black transition-colors">Características</Link>
            <Link href="/vocabulario" className="hover:text-black transition-colors">Vocabulario</Link>
            <Link href="/programa-ejecutivo" className="hover:text-black transition-colors">Programa Ejecutivo</Link>
            <Link href="/planes" className="hover:text-black transition-colors">Planes</Link>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/login" className="hidden md:block text-sm font-semibold text-slate-500 hover:text-black transition-colors">Iniciar Sesión</Link>
            <Link href="/register">
              <button className="bg-white hover:bg-slate-50 text-[#D4AF37] border border-[#D4AF37] text-sm font-semibold py-2.5 px-6 transition-all shadow-none">
                Crear Cuenta Gratis
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HEADER HERO */}
      <header className="pt-40 pb-12 px-6 text-center bg-white">
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-black tracking-tight leading-tight uppercase font-serif italic">
            Infraestructura de Licenciamiento <span className="text-[#D4AF37]">Corporativo B2B</span>
          </h1>
          <p className="text-base text-gray-600 max-w-xl mx-auto font-light">
            Portal interactivo de tarificación volumétrica para el despliegue a gran escala de planes lingüísticos de alto rendimiento dentro de organizaciones filiales de OnixLingo.
          </p>
        </div>
      </header>

      {/* Main Content Area Wrap in Suspense for useSearchParams */}
      <main className="pb-24 px-6 relative z-10 bg-white">
        <Suspense fallback={
          <div className="flex justify-center items-center py-24">
            <Loader2 className="animate-spin text-black" size={32} />
          </div>
        }>
          <CorporativaFormContent />
        </Suspense>
      </main>

      {/* FOOTER */}
      <footer className="bg-white py-10 px-6 text-sm text-slate-600 border-t border-[#D4AF37]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-bold text-slate-900">OnixLingo</span>
          <div className="flex gap-6 font-medium flex-wrap">
            <Link href="/planes" className="hover:text-[#D4AF37] transition-colors">Planes</Link>
            <Link href="/legal/privacy" className="hover:text-[#D4AF37] transition-colors">Privacidad</Link>
            <Link href="/legal/terms" className="hover:text-[#D4AF37] transition-colors">Términos</Link>
            <Link href="/legal/refunds" className="hover:text-[#D4AF37] transition-colors">Reembolsos</Link>
          </div>
          <p className="text-xs">© 2026 OnixuTechnology.</p>
        </div>
      </footer>

    </div>
  );
}
