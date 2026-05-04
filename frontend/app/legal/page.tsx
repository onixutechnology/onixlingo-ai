'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, ShieldCheck, CreditCard, Mail } from 'lucide-react';

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState('terms');

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* HEADER SIMPLE */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center gap-4">
          <Link href="/" className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-black tracking-tight text-slate-800">
            OnixLingo <span className="text-indigo-600">Legal</span>
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-10">
        
        {/* SIDEBAR DE NAVEGACIÓN */}
        <div className="w-full md:w-64 shrink-0">
          <div className="sticky top-32 flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('terms')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'terms' ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100' : 'text-slate-500 hover:bg-white hover:text-slate-800'}`}
            >
              <FileText size={18} /> Términos y Condiciones
            </button>
            <button 
              onClick={() => setActiveTab('privacy')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'privacy' ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100' : 'text-slate-500 hover:bg-white hover:text-slate-800'}`}
            >
              <ShieldCheck size={18} /> Política de Privacidad
            </button>
            <button 
              onClick={() => setActiveTab('refunds')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'refunds' ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100' : 'text-slate-500 hover:bg-white hover:text-slate-800'}`}
            >
              <CreditCard size={18} /> Política de Reembolsos
            </button>
          </div>
        </div>

        {/* CONTENIDO LEGAL */}
        <div className="flex-1 bg-white p-8 md:p-12 rounded-[2rem] border border-slate-200 shadow-sm">
          
          {activeTab === 'terms' && (
            <div className="prose prose-slate max-w-none">
              <h2 className="text-3xl font-black mb-6 text-slate-900">Términos y Condiciones</h2>
              <p className="text-sm text-slate-500 mb-8">Última actualización: Mayo 2026</p>
              
              <h3 className="text-xl font-bold mt-8 mb-4">1. Aceptación de los Términos</h3>
              <p>Al acceder y utilizar OnixLingo (onixlingo.onixu.company), aceptas estar sujeto a estos Términos y Condiciones. Si no estás de acuerdo con alguna parte, no podrás acceder al servicio.</p>

              <h3 className="text-xl font-bold mt-8 mb-4">2. Proveedor de Pagos y Merchant of Record (IMPORTANTE)</h3>
              <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 text-indigo-900 font-medium">
                <p className="mb-0"><strong>Nuestro proceso de pago es gestionado por nuestro revendedor en línea Paddle.com.</strong> Paddle.com es el Merchant of Record (Vendedor Oficial) de todos nuestros pedidos. Paddle proporciona todas las consultas de servicio al cliente relativas a los pagos y procesa las devoluciones.</p>
              </div>

              <h3 className="text-xl font-bold mt-8 mb-4">3. Suscripción Titanium Pro</h3>
              <p>La suscripción a Titanium Pro otorga acceso a funciones avanzadas, simuladores y herramientas sin publicidad. El acceso se mantendrá mientras la suscripción mensual esté activa.</p>

              <h3 className="text-xl font-bold mt-8 mb-4">4. Propiedad Intelectual</h3>
              <p>Todo el contenido, currículum, código y diseño visual son propiedad de Onixu Technology y están protegidos por leyes de derechos de autor.</p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="prose prose-slate max-w-none">
              <h2 className="text-3xl font-black mb-6 text-slate-900">Política de Privacidad</h2>
              <p className="text-sm text-slate-500 mb-8">Última actualización: Mayo 2026</p>

              <h3 className="text-xl font-bold mt-8 mb-4">1. Recopilación de Datos</h3>
              <p>Recopilamos la información mínima necesaria para que la plataforma funcione: nombre, correo electrónico y métricas de progreso (XP, racha, lecciones completadas).</p>

              <h3 className="text-xl font-bold mt-8 mb-4">2. Datos de Pago</h3>
              <p><strong>OnixLingo no almacena, procesa ni tiene acceso a los datos de tu tarjeta de crédito o débito.</strong> Toda la información financiera es transmitida directamente y cifrada a través de nuestro Merchant of Record (Paddle.com), quien cumple con los más altos estándares de seguridad PCI-DSS.</p>

              <h3 className="text-xl font-bold mt-8 mb-4">3. Uso de la Información</h3>
              <p>Utilizamos tus datos únicamente para personalizar tu experiencia de aprendizaje, guardar tu progreso y enviar notificaciones operativas.</p>
            </div>
          )}

          {activeTab === 'refunds' && (
            <div className="prose prose-slate max-w-none">
              <h2 className="text-3xl font-black mb-6 text-slate-900">Política de Cancelación y Reembolsos</h2>
              <p className="text-sm text-slate-500 mb-8">Última actualización: Mayo 2026</p>

              <h3 className="text-xl font-bold mt-8 mb-4">1. Cancelación de Suscripción</h3>
              <p>Puedes cancelar tu suscripción a Titanium Pro en cualquier momento directamente desde tu panel de usuario o poniéndote en contacto con soporte. Al cancelar, conservarás el acceso a las funciones Pro hasta el final de tu ciclo de facturación actual.</p>

              <h3 className="text-xl font-bold mt-8 mb-4">2. Política de Reembolsos</h3>
              <p>Debido a la naturaleza digital de nuestro producto y a que ofrecemos un período de prueba gratuito (Trial) para evaluar la plataforma, <strong>no ofrecemos reembolsos por meses parciales no utilizados ni compras pasadas</strong> una vez que el cargo ha sido procesado con éxito.</p>
            </div>
          )}

          <div className="mt-16 pt-8 border-t border-slate-100 flex items-center gap-3 text-slate-500">
            <Mail size={20} />
            <p className="text-sm font-medium">¿Dudas legales? Contáctanos en: <strong>soporte@onixu.company</strong></p>
          </div>

        </div>
      </div>
    </div>
  );
}