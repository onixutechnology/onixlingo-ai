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
            Completa la información de tu organización para estructurar tu cotización formal. Nuestro equipo de OnixCorp emitirá un documento oficial de facturación deducible de impuestos.
          </p>
        </div>

        {/* Resumen dinámico del requerimiento pre-llenado */}
        <div className="p-6 bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-3 border-b border-slate-100">
            <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calculator size={14} className="text-indigo-600" />
              Resumen de Requerimiento
            </h4>
            <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-150 text-indigo-700 text-[9px] font-bold uppercase">Pre-llenado</span>
          </div>

          <div className="space-y-2 text-xs text-slate-600 font-medium">
            <div className="flex justify-between">
              <span className="text-slate-400">Tipo de Licencias:</span>
              <span className="text-slate-950 font-bold uppercase">Membresía {tier}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Número de Colaboradores:</span>
              <span className="text-slate-950 font-bold">{licenses} usuarios</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Descuento Volumétrico:</span>
              <span className="text-emerald-600 font-bold">-{discountPercent}% OFF</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-100/65 items-baseline">
              <span className="text-slate-900 font-bold">Inversión Mensual Proyectada:</span>
              <span className="text-base font-black text-slate-950 font-mono">${costPerMonthFinal} MXN</span>
            </div>
            {annualSavings > 0 && (
              <div className="p-2 bg-emerald-50 text-[10px] text-emerald-700 font-bold mt-1 text-center">
                🎉 Ahorro Anual Proyectado: ${annualSavings} MXN
              </div>
            )}
          </div>
        </div>

        {/* Explicación Técnica de la Conexión de Embudo (El Puente) */}
        <div className="p-6 bg-slate-900 text-slate-200 border border-slate-800 space-y-4">
          <h4 className="font-bold text-xs text-amber-400 uppercase tracking-widest flex items-center gap-2">
            <Server size={14} />
            Arquitectura de Conexión (El Puente)
          </h4>
          <p className="text-[11px] text-slate-400 leading-relaxed font-light">
            ¿Cómo viajan los datos desde esta página de <strong>OnixLingo</strong> hasta tu correo corporativo en <strong>onixu.company</strong>?
          </p>

          <div className="space-y-3.5 text-[11px] text-slate-350">
            <div className="flex gap-3 items-start">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center font-mono font-bold shrink-0 mt-0.5">1</span>
              <div>
                <p className="font-bold text-white mb-0.5">Disparador Webhook / API Relay:</p>
                <p className="font-light">Al enviar el formulario, el cliente envía un payload JSON seguro vía HTTPS a `https://api.onixu.company/v1/corporate-lead`.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center font-mono font-bold shrink-0 mt-0.5">2</span>
              <div>
                <p className="font-bold text-white mb-0.5">SMTP Relay en tu Servidor:</p>
                <p className="font-light">Tu servidor API en `onixu.company` valida la firma del webhook, formatea un template HTML premium y lo envía a tu correo usando SMTP seguro.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-200 flex items-center justify-center font-mono font-bold shrink-0 mt-0.5">3</span>
              <div>
                <p className="font-bold text-white mb-0.5">Notificación CRM Automatizada:</p>
                <p className="font-light">Además de recibirlo en tu correo, el payload alimenta directamente tu CRM empresarial corporativo para seguimiento de ventas.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Columna Derecha: El Formulario */}
      <div className="lg:col-span-7 bg-white border border-slate-200 p-8 shadow-md relative">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600" />

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Formulario de Requerimiento</h3>
              <p className="text-xs text-slate-400">Todos los campos con (*) son requeridos de forma obligatoria.</p>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex gap-2 items-center animate-pulse">
                <AlertCircle size={14} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Nombre de la Empresa */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-650 uppercase tracking-wider block">Nombre de la Empresa *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Building2 size={14} /></span>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Ej. OnixCorp S.A."
                    className="w-full text-xs pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 outline-none font-medium"
                  />
                </div>
              </div>

              {/* Nombre del Contacto */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-650 uppercase tracking-wider block">Nombre del Contacto *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Briefcase size={14} /></span>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Ej. Ing. Alejandro Pérez"
                    className="w-full text-xs pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 outline-none font-medium"
                  />
                </div>
              </div>

              {/* Correo Electrónico Corporativo */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-650 uppercase tracking-wider block">Correo Corporativo *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={14} /></span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ej. aperez@onixu.company"
                    className="w-full text-xs pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 outline-none font-medium"
                  />
                </div>
              </div>

              {/* Teléfono de Contacto */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-650 uppercase tracking-wider block">Teléfono de Contacto *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Phone size={14} /></span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej. +52 55 1234 5678"
                    className="w-full text-xs pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 outline-none font-medium"
                  />
                </div>
              </div>

              {/* Número de Licencias */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-650 uppercase tracking-wider block">Número de Licencias *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={licenses}
                  onChange={(e) => setLicenses(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 outline-none font-medium"
                />
              </div>

              {/* Tipo de Plan */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-650 uppercase tracking-wider block">Nivel de Membresía *</label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value as 'pro' | 'executive')}
                  className="w-full text-xs px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 outline-none font-medium"
                >
                  <option value="pro">Pro (Estándar)</option>
                  <option value="executive">Executive (C-Suite Elite)</option>
                </select>
              </div>
            </div>

            {/* Fecha de Implementación */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-650 uppercase tracking-wider block">Fecha Estimada de Implementación</label>
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
                    className={`py-2 px-1 text-center text-xs font-bold border transition-colors ${implementationDate === d.id ? 'border-indigo-650 bg-indigo-50 text-indigo-700' : 'bg-slate-50 border-slate-200 hover:border-slate-350 text-slate-600'}`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notas y Requerimientos especiales */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-650 uppercase tracking-wider block">Requerimientos Especiales / Notas</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej. Necesitamos integración con SSO corporativo o soporte personalizado para un dialecto específico..."
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-indigo-500 outline-none font-medium"
                rows={4}
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center gap-4">
              <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                <ShieldCheck size={14} className="text-emerald-500" />
                Auditoría E2E segura SOC2.
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-8 text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 flex items-center gap-2"
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
            <div className="w-16 h-16 bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">¡Requerimiento B2B Recibido!</h3>
              <p className="text-slate-550 text-xs max-w-md mx-auto leading-relaxed">
                Los datos de tu cotización han sido procesados y transmitidos con éxito al embudo API de <strong>onixu.company</strong>. Recibirás la propuesta oficial y plan de estudios corporativo en tu correo corporativo en menos de 24 horas.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 max-w-sm mx-auto text-left text-xs space-y-1.5 text-slate-600 font-medium">
              <p>📩 <strong>Enviado a:</strong> {email}</p>
              <p>🏢 <strong>Empresa:</strong> {companyName}</p>
              <p>👤 <strong>Contacto:</strong> {contactName}</p>
              <p>👥 <strong>Licencias:</strong> {licenses} ({tier === 'pro' ? 'Pro' : 'Executive'})</p>
            </div>

            <div className="flex gap-4 justify-center pt-4">
              <button
                onClick={() => setIsSubmitted(false)}
                className="border border-slate-300 hover:border-slate-400 bg-white text-slate-700 font-bold py-2.5 px-8 text-xs uppercase tracking-wider transition-colors"
              >
                Crear Otra Solicitud
              </button>
              <Link href="/planes">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-8 text-xs uppercase tracking-wider transition-all shadow-md">
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
    <div className="min-h-screen bg-[#edf7f2] font-sans text-slate-800 selection:bg-indigo-500/20 selection:text-indigo-900">
      
      {/* NAVBAR */}
      <nav className="fixed w-full bg-[#edf7f2]/95 backdrop-blur-xl border-b border-emerald-100 z-50">
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
            <Link href="/planes" className="hover:text-indigo-600 transition-colors">Planes</Link>
          </div>
          <div className="flex gap-4 items-center">
            <Link href="/login" className="hidden md:block text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Iniciar Sesión</Link>
            <Link href="/register">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 px-6 transition-all shadow-md shadow-indigo-600/20">
                Crear Cuenta Gratis
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HEADER HERO */}
      <header className="pt-40 pb-12 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight uppercase font-serif italic">
            Infraestructura de Licenciamiento <span className="text-indigo-600">Corporativo B2B</span>
          </h1>
          <p className="text-base text-slate-550 max-w-xl mx-auto font-light">
            Portal interactivo de tarificación volumétrica para el despliegue a gran escala de planes lingüísticos de alto rendimiento dentro de organizaciones filiales de OnixCorp.
          </p>
        </div>
      </header>

      {/* Main Content Area Wrap in Suspense for useSearchParams */}
      <main className="pb-24 px-6 relative z-10">
        <Suspense fallback={
          <div className="flex justify-center items-center py-24">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
          </div>
        }>
          <CorporativaFormContent />
        </Suspense>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#e2efe7] py-10 px-6 text-sm text-slate-600 border-t border-emerald-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-bold text-slate-900">OnixLingo</span>
          <div className="flex gap-6 font-medium flex-wrap">
            <Link href="/planes" className="hover:text-indigo-600 transition-colors">Planes</Link>
            <Link href="/legal/privacy" className="hover:text-indigo-600 transition-colors">Privacidad</Link>
            <Link href="/legal/terms" className="hover:text-indigo-600 transition-colors">Términos</Link>
            <Link href="/legal/refunds" className="hover:text-indigo-600 transition-colors">Reembolsos</Link>
          </div>
          <p className="text-xs">© 2026 OnixuTechnology.</p>
        </div>
      </footer>

    </div>
  );
}
