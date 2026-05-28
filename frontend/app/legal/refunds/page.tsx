import React from 'react';

export default function RefundsPage() {
  return (
    <div className="prose prose-slate max-w-none">
      <h2 className="text-3xl font-black mb-6 text-slate-900">Política de Cancelación y Reembolsos</h2>
      <p className="text-sm text-slate-500 mb-8">Última actualización: Mayo 2026</p>

      <p className="mb-6 leading-relaxed">
        En <strong>Onixu Technology</strong> buscamos ofrecer el mejor servicio de aprendizaje de idiomas a través de <strong>OnixLingo</strong>. Esta política describe los términos de cancelación y reembolso aplicables a todas nuestras membresías de pago (Pro y Executive).
      </p>

      <h3 className="text-xl font-bold mt-8 mb-4">1. Cancelación de Suscripciones</h3>
      <p className="mb-4 leading-relaxed">
        Usted puede cancelar su suscripción en cualquier momento. La cancelación se puede solicitar directamente desde la sección de perfil/facturación dentro de su panel de usuario en la Plataforma o enviando un correo electrónico a <strong>soporte@onixu.company</strong>.
      </p>
      <p className="mb-4 leading-relaxed">
        <strong>Efecto de la Cancelación:</strong> Al cancelar la suscripción, usted conservará el acceso a las características de pago contratadas hasta la fecha de finalización del periodo de facturación actual (ya sea mensual o anual). No se le volverá a realizar ningún cargo automático futuro.
      </p>

      <h3 className="text-xl font-bold mt-8 mb-4">2. Política de Reembolso — 14 Días</h3>

      <div className="bg-teal-50 p-6 rounded-xl border border-teal-200 text-teal-900 font-medium my-6">
        <p className="mb-0 text-base">
          <strong>Garantía de 14 días:</strong> Si no está satisfecho con su suscripción de OnixLingo por cualquier motivo, puede solicitar un reembolso completo dentro de los <strong>14 días calendario</strong> siguientes a la fecha de su primer pago o renovación. No se requiere justificación alguna para ejercer este derecho.
        </p>
      </div>

      <p className="mb-4 leading-relaxed">
        Esta política cumple con los <strong>Buyer Terms de Paddle.com</strong>, nuestro Merchant of Record. Para solicitar un reembolso dentro del período de 14 días, contáctenos en <strong>soporte@onixu.company</strong> indicando su correo de registro y número de transacción.
      </p>

      <ul className="list-disc pl-6 mb-4 space-y-2 text-sm text-slate-600">
        <li><strong>Planes Mensuales:</strong> Reembolso completo disponible dentro de los primeros 14 días naturales desde la fecha de cargo.</li>
        <li><strong>Planes Anuales:</strong> Reembolso completo disponible dentro de los primeros 14 días naturales desde la fecha de cargo. Transcurrido dicho periodo, el reembolso será proporcional al tiempo no utilizado, evaluado caso a caso.</li>
        <li><strong>Cargos Erróneos o Duplicados:</strong> Si se identifica un cargo doble o erróneo debido a un fallo en el sistema de pagos, se procesará la devolución del importe excedente de manera inmediata tras la validación técnica del caso, independientemente del período transcurrido.</li>
      </ul>

      <h3 className="text-xl font-bold mt-8 mb-4">3. Cómo Solicitar un Reembolso</h3>
      <p className="mb-4 leading-relaxed">
        Para solicitar un reembolso dentro del período de 14 días, siga estos pasos:
      </p>
      <ol className="list-decimal pl-6 mb-4 space-y-2 text-sm text-slate-600">
        <li>Envíe un correo electrónico a <strong>soporte@onixu.company</strong> con el asunto: <em>"Solicitud de Reembolso"</em>.</li>
        <li>Incluya su nombre completo, correo de registro y el número de transacción o recibo de pago.</li>
        <li>Nuestro equipo procesará su solicitud en un plazo máximo de <strong>2 días hábiles</strong>.</li>
      </ol>

      <h3 className="text-xl font-bold mt-8 mb-4">4. Gestión de Devoluciones a través de Paddle</h3>
      <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 text-amber-900 font-medium my-6">
        <p className="mb-3">
          <strong>Procesamiento por Merchant of Record:</strong> Al ser <strong>Paddle.com</strong> nuestro Merchant of Record (Vendedor Oficial), todas las solicitudes de reembolso aprobadas formalmente son ejecutadas y devueltas a su método de pago original a través de su infraestructura de transacciones.
        </p>
        <p className="mb-0 text-sm opacity-90">
          El tiempo en el que se ve reflejado el importe devuelto en su cuenta bancaria dependerá del procesador de pagos de Paddle y de las políticas de su entidad financiera emisora (generalmente toma de 5 a 10 días hábiles).
        </p>
      </div>

      <h3 className="text-xl font-bold mt-8 mb-4">5. Disputas de Pago</h3>
      <p className="mb-4 leading-relaxed">
        Le recomendamos encarecidamente ponerse en contacto con nuestro departamento de soporte técnico y facturación en <strong>soporte@onixu.company</strong> antes de iniciar una disputa o contracargo con su banco. Nuestro equipo trabajará de manera expedita junto con Paddle para resolver cualquier inconveniente con sus cobros.
      </p>
    </div>
  );
}
