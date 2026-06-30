import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="prose prose-invert max-w-none text-slate-700">
      <h2 className="text-3xl font-black mb-6 text-slate-900 font-serif italic">Política de Privacidad</h2>
      <p className="text-sm text-[#D4AF37] mb-8 font-bold uppercase tracking-widest">Última actualización: Mayo 2026</p>

      <p className="mb-6 leading-relaxed">
        En <strong>Onixu Technology</strong>, valoramos y respetamos su privacidad. Esta Política de Privacidad describe cómo recopilamos, utilizamos, compartimos y protegemos la información personal obtenida a través de la plataforma <strong>OnixLingo</strong>.
      </p>

      <h3 className="text-xl font-bold mt-8 mb-4 text-[#D4AF37]">1. Datos Personales que Recopilamos</h3>
      <p className="mb-4 leading-relaxed">
        Recopilamos la información estrictamente necesaria para proveer y optimizar la experiencia de aprendizaje:
      </p>
      <ul className="list-disc pl-6 mb-4 space-y-2 text-sm text-slate-600">
        <li><strong>Información de Registro:</strong> Nombre de usuario, dirección de correo electrónico y credenciales de acceso.</li>
        <li><strong>Datos de Progreso:</strong> Lecciones completadas, estadísticas de rendimiento (XP, rachas), prácticas de pronunciación por voz y resultados de simuladores.</li>
        <li><strong>Información Técnica:</strong> Dirección IP, tipo de navegador e identificadores de dispositivo recopilados de manera automática para fines de seguridad y analítica básica.</li>
      </ul>

      <h3 className="text-xl font-bold mt-8 mb-4 text-[#D4AF37]">2. Protección y Cifrado de Datos Financieros</h3>
      <div className="bg-[#D4AF37]/10 p-6 rounded-none border border-[#D4AF37]/30 text-slate-900 font-medium my-6">
        <p className="mb-3">
          <strong>Garantía de Seguridad Financiera:</strong> OnixLingo y Onixu Technology no recopilan, almacenan ni procesan información de tarjetas de crédito o débito en sus servidores.
        </p>
        <p className="mb-0 text-sm opacity-90">
          Todas las transacciones y datos financieros se gestionan directamente a través de nuestro Merchant of Record, <strong>Paddle.com</strong>, de forma cifrada mediante protocolos seguros SSL/TLS, cumpliendo de manera estricta con los estándares de seguridad internacional PCI-DSS (Payment Card Industry Data Security Standard).
        </p>
      </div>

      <h3 className="text-xl font-bold mt-8 mb-4 text-[#D4AF37]">3. Uso de la Información</h3>
      <p className="mb-4 leading-relaxed">
        Utilizamos la información recolectada únicamente para:
      </p>
      <ul className="list-disc pl-6 mb-4 space-y-2 text-sm text-slate-600">
        <li>Proporcionar y personalizar las lecciones e interacción didáctica con el Sistema Analítico Avanzado.</li>
        <li>Registrar y mostrar el progreso del estudiante en la tabla de clasificación (Leaderboard).</li>
        <li>Enviar notificaciones operativas importantes (restablecimiento de contraseña, avisos de facturación).</li>
        <li>Prevenir fraudes y asegurar el correcto funcionamiento del software.</li>
      </ul>

      <h3 className="text-xl font-bold mt-8 mb-4 text-[#D4AF37]">4. Transferencia de Datos a Terceros</h3>
      <p className="mb-4 leading-relaxed">
        No vendemos ni alquilamos su información personal a terceros. Compartimos datos únicamente con proveedores de servicios de confianza necesarios para operar la Plataforma (por ejemplo, Paddle para el procesamiento de pagos e infraestructuras de hosting en la nube como Google Cloud y Vercel), quienes están obligados a mantener la confidencialidad de la información.
      </p>

      <h3 className="text-xl font-bold mt-8 mb-4 text-[#D4AF37]">5. Derechos del Usuario (Acceso y Eliminación)</h3>
      <p className="mb-4 leading-relaxed">
        Usted tiene derecho a acceder, corregir o solicitar la eliminación total de sus datos personales de nuestros sistemas en cualquier momento. Para ejercer estos derechos, puede enviar una solicitud formal a nuestro equipo a través del correo <strong>soporte@onixu.company</strong>.
      </p>
    </div>
  );
}
