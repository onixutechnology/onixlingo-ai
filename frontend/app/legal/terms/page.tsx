import React from 'react';

export default function TermsPage() {
  return (
    <div className="prose prose-slate max-w-none">
      <h2 className="text-3xl font-black mb-6 text-slate-900">Términos y Condiciones de Uso</h2>
      <p className="text-sm text-slate-500 mb-8">Última actualización: Mayo 2026</p>

      <p className="mb-6 leading-relaxed">
        El presente documento establece los Términos y Condiciones bajo los cuales se regula el acceso y uso de la plataforma <strong>OnixLingo</strong> (en adelante, &ldquo;la Plataforma&rdquo; o &ldquo;el Servicio&rdquo;), operada bajo la propiedad legal de <strong>Onixu Technology</strong>.
      </p>

      <h3 className="text-xl font-bold mt-8 mb-4">1. Aceptación de los Términos</h3>
      <p className="mb-4 leading-relaxed">
        Al registrarse, acceder o utilizar OnixLingo de cualquier forma, usted acepta de manera expresa e irrevocable cumplir y estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguno de los términos aquí estipulados, deberá abstenerse de usar el servicio de forma inmediata.
      </p>

      <h3 className="text-xl font-bold mt-8 mb-4">2. Relación de Facturación y Merchant of Record</h3>
      <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 text-indigo-900 font-medium my-6">
        <p className="mb-3">
          <strong>IMPORTANTE:</strong> Nuestro proceso de cobro, facturación y procesamiento de pagos es gestionado en su totalidad por nuestro revendedor autorizado y Merchant of Record (Vendedor Oficial), <strong>Paddle.com Market Limited</strong> (en adelante, &ldquo;Paddle&rdquo;).
        </p>
        <p className="mb-0 text-sm opacity-90">
          Paddle se encarga de procesar todas las transacciones, gestionar las consultas de servicio al cliente relativas a cobros, procesar devoluciones y aplicar los impuestos locales correspondientes. Al contratar una suscripción o realizar un pago a través de OnixLingo, usted acepta regirse también por los términos de servicio de Paddle.
        </p>
      </div>

      <h3 className="text-xl font-bold mt-8 mb-4">3. Membresías y Niveles de Servicio</h3>
      <p className="mb-4 leading-relaxed">
        OnixLingo ofrece tres niveles de servicio comerciales con diferentes límites y características operativas:
      </p>
      <ul className="list-disc pl-6 mb-4 space-y-2 text-sm text-slate-600">
        <li><strong>Plan Free (Básico):</strong> Nivel de servicio gratuito con un sistema diario de energía (100% de energía al día). Las lecciones generales (nivel A1) consumen 50% de energía por sesión, las lecciones de vocabulario (bloque de 50 palabras) consumen 30% con un límite estricto de 1 lección diaria, y cada puzzle de ajedrez consume 10% con un límite de 2 puzzles diarios. No incluye acceso a las prácticas de conversación con Inteligencia Artificial (Speech Tutor) e incluye anuncios publicitarios en el dashboard.</li>
        <li><strong>Plan Pro (Estándar):</strong> Acceso ilimitado y libre de anuncios a las 900 lecciones generales (niveles A1 a C1), con energía ilimitada, vocabulario y ajedrez sin restricciones. Excluye lecciones del temario Executive y tutoría conversacional por IA (Speech Tutor).</li>
        <li><strong>Plan Executive (Titanium):</strong> Desbloqueo total y absoluto de la plataforma con energía ilimitada. Incluye todas las lecciones generales (A1 a C1), el módulo de negocios (Temario Executive completo), acceso ilimitado a Speech Tutor (tutoría conversacional por IA) y práctica libre de ajedrez sin anuncios ni restricciones operativas.</li>
      </ul>

      <h3 className="text-xl font-bold mt-8 mb-4">4. Propiedad Intelectual</h3>
      <p className="mb-4 leading-relaxed">
        Todo el contenido, bases de datos, código fuente, lecciones, currículums de idiomas, algoritmos de análisis de voz, logotipos, diseños y material didáctico presentados en la Plataforma son propiedad exclusiva de <strong>Onixu Technology</strong> o de sus licenciantes, y están protegidos por las leyes internacionales de derechos de autor y propiedad intelectual.
      </p>

      <h3 className="text-xl font-bold mt-8 mb-4">5. Limitación de Responsabilidad</h3>
      <p className="mb-4 leading-relaxed">
        Onixu Technology provee la Plataforma &ldquo;tal cual&rdquo; y no garantiza que el servicio esté libre de interrupciones o errores puntuales. En ningún caso Onixu Technology será responsable por daños indirectos, incidentales o consecuentes derivados del uso o la imposibilidad de uso del software.
      </p>

      <h3 className="text-xl font-bold mt-8 mb-4">6. Modificaciones de los Términos</h3>
      <p className="mb-4 leading-relaxed">
        Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento para adaptarlos a novedades legislativas o mejoras operativas del servicio. El uso continuo de la plataforma posterior a dichas modificaciones constituirá la aceptación de los nuevos términos.
      </p>
    </div>
  );
}
