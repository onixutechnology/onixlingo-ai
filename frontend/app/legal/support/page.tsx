import React from 'react';
import { Mail, Clock, HelpCircle, ShieldAlert } from 'lucide-react';

export default function SupportPage() {
  return (
    <div className="prose prose-slate max-w-none">
      <h2 className="text-3xl font-black mb-6 text-slate-900">Soporte y Contacto</h2>
      <p className="text-sm text-slate-500 mb-8">Última actualización: Mayo 2026</p>

      <p className="mb-8 leading-relaxed text-slate-600">
        En <strong>Onixu Technology</strong> estamos comprometidos con brindarle una excelente experiencia de aprendizaje en <strong>OnixLingo</strong>. Si experimenta problemas técnicos, dudas de facturación o requiere soporte relativo a su cuenta, ponemos a su disposición los canales de atención oficiales.
      </p>

      {/* CANALES DE CONTACTO CARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-indigo-100 text-indigo-700 flex items-center justify-center rounded-xl mb-4">
              <Mail size={20} />
            </div>
            <h4 className="text-base font-black text-slate-900 mb-2 uppercase tracking-tight">Correo de Soporte</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Escríbenos directamente para cualquier duda técnica, de contenido o solicitudes especiales de cuentas.
            </p>
          </div>
          <span className="text-sm font-bold text-indigo-600">soporte@onixu.company</span>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 bg-emerald-100 text-emerald-700 flex items-center justify-center rounded-xl mb-4">
              <Clock size={20} />
            </div>
            <h4 className="text-base font-black text-slate-900 mb-2 uppercase tracking-tight">Tiempo de Respuesta</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Nuestro equipo operativo atiende solicitudes en días laborables de lunes a viernes.
            </p>
          </div>
          <span className="text-sm font-bold text-emerald-600">24 a 48 horas hábiles</span>
        </div>
      </div>

      <h3 className="text-xl font-bold mt-8 mb-4">Preguntas Frecuentes de Soporte</h3>
      
      <div className="space-y-6 mt-6">
        <div className="border-b border-slate-100 pb-4">
          <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <HelpCircle size={16} className="text-indigo-500 shrink-0" />
            ¿Cómo cancelo mi suscripción?
          </h4>
          <p className="text-sm text-slate-500 mt-2 pl-6">
            Puedes cancelarla en cualquier momento desde tu panel de usuario haciendo clic en tu foto de perfil, entrando a <strong>Profile / Perfil</strong> y pulsando el botón de gestión de suscripción. Alternativamente, envíanos un correo y nosotros procesamos tu baja.
          </p>
        </div>

        <div className="border-b border-slate-100 pb-4">
          <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <HelpCircle size={16} className="text-indigo-500 shrink-0" />
            Tengo un cobro no reconocido en mi estado de cuenta
          </h4>
          <p className="text-sm text-slate-500 mt-2 pl-6">
            Todos los cobros de OnixLingo aparecen bajo el nombre de nuestro Merchant of Record: <strong>PADDLE.COM</strong>. Si no reconoces una transacción o consideras que hay un cobro doble, por favor contáctanos de inmediato enviando tu ID de transacción de Paddle para aclararlo.
          </p>
        </div>

        <div className="pb-4">
          <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <ShieldAlert size={16} className="text-indigo-500 shrink-0" />
            Reporte de Fallos Técnicos
          </h4>
          <p className="text-sm text-slate-500 mt-2 pl-6">
            Si la IA no reconoce tu pronunciación de voz o experimentas fallas en el simulador de ajedrez, te recomendamos limpiar el caché del navegador e intentar de nuevo. Si persiste, envíanos una captura de pantalla y detalles del dispositivo al correo de soporte para que ingeniería lo resuelva.
          </p>
        </div>
      </div>
    </div>
  );
}
