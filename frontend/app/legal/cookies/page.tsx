import React from 'react';
import LandingNavbar from '@/components/LandingNavbar';
import LandingFooter from '@/components/LandingFooter';

export const metadata = {
  title: 'Política de Cookies',
  description: 'Política de Cookies de OnixLingo',
};

export default function CookiesPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 text-black">
      <LandingNavbar />
      
      <main className="pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="max-w-3xl mx-auto bg-white border border-gray-200 p-8 md:p-12 shadow-sm">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight uppercase mb-8 border-b border-gray-200 pb-4">
            Política de Cookies
          </h1>

          <div className="space-y-6 text-gray-700 leading-relaxed font-light">
            <p><strong>Última actualización:</strong> 23 de Junio de 2026</p>

            <h2 className="text-xl font-bold text-black mt-8 mb-4 uppercase tracking-widest">1. ¿Qué son las cookies?</h2>
            <p>
              Una cookie es un pequeño fichero de texto que se almacena en su navegador cuando visita casi cualquier página web. Su utilidad es que la web sea capaz de recordar su visita cuando vuelva a navegar por esa página. Las cookies suelen almacenar información de carácter técnico, preferencias personales, personalización de contenidos, estadísticas de uso, enlaces a redes sociales, acceso a cuentas de usuario, etc.
            </p>

            <h2 className="text-xl font-bold text-black mt-8 mb-4 uppercase tracking-widest">2. Uso de Google AdSense y Cookies de Terceros</h2>
            <p>
              En <strong>OnixLingo</strong> utilizamos proveedores externos, incluido Google, que utilizan cookies para mostrar anuncios relevantes basados en las visitas anteriores de un usuario a nuestro sitio web o a otros sitios en Internet.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>El uso de cookies de publicidad permite a Google y a sus socios mostrar anuncios basados en las visitas realizadas a nuestros sitios o a otros sitios de Internet.</li>
              <li>Los usuarios pueden inhabilitar la publicidad personalizada. Para ello, deberán acceder a Preferencias de anuncios (o bien acceder a www.aboutads.info para inhabilitar el uso de cookies para la publicidad personalizada por parte de proveedores externos).</li>
            </ul>

            <h2 className="text-xl font-bold text-black mt-8 mb-4 uppercase tracking-widest">3. Tipos de cookies utilizadas en este sitio web</h2>
            <p>
              Siguiendo las directrices de las agencias de protección de datos procedemos a detallar el uso de cookies que hace esta web con el fin de informarle con la máxima exactitud posible.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Cookies Propias:</strong> Son aquellas que se envían al equipo terminal del usuario desde un equipo o dominio gestionado por el propio editor y desde el que se presta el servicio solicitado por el usuario.</li>
              <li><strong>Cookies de Terceros:</strong> Son aquellas que se envían al equipo terminal del usuario desde un equipo o dominio que no es gestionado por el editor, sino por otra entidad que trata los datos obtenidos a través de las cookies. (Ej: Google Analytics, Google AdSense).</li>
            </ul>

            <h2 className="text-xl font-bold text-black mt-8 mb-4 uppercase tracking-widest">4. Desactivación o eliminación de cookies</h2>
            <p>
              En cualquier momento podrá ejercer su derecho de desactivación o eliminación de cookies de este sitio web. Estas acciones se realizan de forma diferente en función del navegador que esté usando. Aquí le dejamos una guía rápida para los navegadores más populares:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4 text-sm">
              <li><strong>Chrome:</strong> Configuración - Privacidad y seguridad - Cookies y otros datos de sitios.</li>
              <li><strong>Firefox:</strong> Opciones - Privacidad y seguridad - Cookies y datos del sitio.</li>
              <li><strong>Safari:</strong> Preferencias - Privacidad.</li>
              <li><strong>Edge:</strong> Configuración - Cookies y permisos del sitio.</li>
            </ul>

            <h2 className="text-xl font-bold text-black mt-8 mb-4 uppercase tracking-widest">5. Notas Adicionales</h2>
            <p>
              Ni esta web ni sus representantes legales se hacen responsables ni del contenido ni de la veracidad de las políticas de privacidad que puedan tener los terceros mencionados en esta política de cookies. Los navegadores web son las herramientas encargadas de almacenar las cookies y desde este lugar debe efectuar su derecho a eliminación o desactivación de las mismas.
            </p>

            <p className="mt-8 pt-8 border-t border-gray-200">
              Si tiene alguna duda o consulta sobre esta política de cookies, no dude en comunicarse con nosotros a través de la sección de soporte.
            </p>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
