'use client';
import LandingFooter from '@/components/LandingFooter';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  BrainCircuit, 
  Mic, 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Gem,
  Crown,
  Languages,
  LayoutGrid,
  Building2,
  Zap,
  Trophy,
  User
} from 'lucide-react';
import FloatingParticles from '@/components/FloatingParticles';
import LandingNavbar from '@/components/LandingNavbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-black selection:bg-[#D4AF37]/30 selection:text-black">
      
      <LandingNavbar />

      {/* --- SECCIÓN 1: HERO (NEGRO) --- */}
      <main className="pt-28 pb-12 px-6 relative overflow-hidden bg-slate-50">
        <FloatingParticles />
        
        <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in-up relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-none bg-white border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold uppercase tracking-widest shadow-none">
            <Sparkles size={12} className="text-[#D4AF37]" />
            El Sistema Universal
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] uppercase">
            Aprende Inglés, Francés, Chino y Ajedrez
          </h1>

          <p className="text-xl md:text-2xl text-slate-700 max-w-3xl mx-auto leading-relaxed font-light">
            La infraestructura que sostiene el crecimiento moderno. Desarrolla fluidez, confianza y estrategia bajo un mismo ecosistema profesional.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8">
            <Link href="/register" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-[#D4AF37] text-black border border-[#D4AF37] text-lg font-bold py-4 px-10 rounded-none shadow-xl shadow-[#D4AF37]/20 transition-all flex items-center justify-center gap-3 hover:-translate-y-1 hover:bg-[#b5952f] uppercase tracking-widest">
                Explorar Ecosistema <ArrowRight size={20} />
              </button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-white border border-gray-300 text-black hover:border-black hover:bg-white text-lg font-bold py-4 px-10 rounded-none transition-all shadow-none hover:shadow-none uppercase tracking-widest">
                Portal de Clientes
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* --- SECCIÓN 2: MÉTRICAS (BLANCA LIMPIA) --- */}
      <section className="py-20 bg-white border-y border-gray-200 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-none p-8 flex gap-4 items-start shadow-none hover:shadow-none transition-shadow animate-fade-in-up [animation-delay:200ms] opacity-0">
              <div className="p-3 bg-slate-50 text-slate-900 shrink-0"><LayoutGrid size={24} /></div>
              <div>
                <h4 className="font-bold text-black uppercase tracking-widest text-sm mb-2">Integración Total</h4>
                <p className="text-gray-800 text-sm leading-relaxed">Unión perfecta de software corporativo y educación en múltiples idiomas.</p>
              </div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-none p-8 flex gap-4 items-start shadow-none hover:shadow-none transition-shadow animate-fade-in-up [animation-delay:400ms] opacity-0">
              <div className="p-3 bg-slate-50 text-slate-900 shrink-0"><User size={24} /></div>
              <div>
                <h4 className="font-bold text-black uppercase tracking-widest text-sm mb-2">Capacitación Experta</h4>
                <p className="text-gray-800 text-sm leading-relaxed">Formamos para el dominio absoluto con simuladores de Sistema avanzados.</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-none p-8 flex gap-4 items-start shadow-none hover:shadow-none transition-shadow animate-fade-in-up [animation-delay:600ms] opacity-0">
              <div className="p-3 bg-slate-50 text-slate-900 shrink-0"><CheckCircle2 size={24} /></div>
              <div>
                <h4 className="font-bold text-black uppercase tracking-widest text-sm mb-2">Garantía Vitalicia</h4>
                <p className="text-gray-800 text-sm leading-relaxed">Soporte técnico blindado y actualización continua de lecciones.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN 3: ECOSISTEMA ESPACIAL (DORADO 20%) --- */}
      <section id="features" className="py-32 bg-[#D4AF37]/20 text-black relative z-10 border-b border-[#D4AF37]/30 overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-16 md:flex justify-between items-end border-b border-black/10 pb-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold text-black tracking-widest uppercase mb-4">Nuestro <span className="text-slate-900 bg-white px-2 py-1">Ecosistema</span></h2>
              <p className="text-black text-lg font-bold leading-relaxed">
                Tecnología de clase mundial diseñada para escalar sin límites, con máxima seguridad y un rendimiento operativo insuperable.
              </p>
            </div>
            <div className="hidden md:block">
              <button className="text-black font-bold uppercase tracking-widest text-sm hover:text-slate-900 transition-colors flex items-center gap-2 bg-[#D4AF37] px-4 py-2 border border-black">
                Explorar <ArrowRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Idiomas */}
            <div className="lg:col-span-2 group bg-white p-8 rounded-none border border-black hover:border-[#D4AF37] hover:-translate-y-1 transition-all duration-300 animate-fade-in-up opacity-0 [animation-delay:100ms]">
              <div className="w-12 h-12 bg-white text-slate-900 border border-black rounded-none flex items-center justify-center mb-6">
                <Languages size={24} />
              </div>
              <h3 className="text-2xl font-bold text-black mb-3 uppercase tracking-widest">Soberanía Multilingüe</h3>
              <p className="text-black font-medium leading-relaxed mb-6">
                Instrucción rigurosa de Inglés, Francés y Chino Mandarín adaptada a los estándares de competencia del MCER. Interacción acústica con avatares nativos y retroalimentación de pronunciación instantánea.
              </p>
            </div>

            {/* Ajedrez */}
            <div className="group bg-white p-8 rounded-none border border-black hover:border-[#D4AF37] hover:-translate-y-1 transition-all duration-300 animate-fade-in-up opacity-0 [animation-delay:200ms]">
              <div className="w-12 h-12 bg-white text-slate-900 border border-black rounded-none flex items-center justify-center mb-6">
                <Crown size={24} />
              </div>
              <h3 className="text-xl font-bold text-black mb-3 uppercase tracking-widest">Ajedrez Táctico</h3>
              <p className="text-black font-medium leading-relaxed text-sm">
                Entrenamiento y puzzles asistidos por Sistema. Analiza tus blunders y mejora tu cálculo bajo presión.
              </p>
            </div>

            {/* Simulación Ejecutiva */}
            <div className="group bg-white p-8 rounded-none border border-black hover:border-[#D4AF37] hover:-translate-y-1 transition-all duration-300 animate-fade-in-up opacity-0 [animation-delay:300ms]">
              <div className="w-12 h-12 bg-white text-slate-900 border border-black rounded-none flex items-center justify-center mb-6">
                <Building2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-black mb-3 uppercase tracking-widest">Simulación Alta Dirección</h3>
              <p className="text-black font-medium leading-relaxed text-sm">
                Negociaciones, reuniones de directorio y presentaciones frente a inversores controlados por sistemas corporativos.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* --- SECCIÓN METODOLOGÍA (TEXTO DENSO PARA ADSENSE) --- */}
      <section className="py-24 bg-white text-black relative z-10 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-widest uppercase mb-8">Nuestra <span className="text-[#D4AF37]">Metodología</span> de Aprendizaje</h2>
          <div className="space-y-6 text-gray-700 text-lg font-light leading-relaxed">
            <p>
              En OnixLingo, hemos desarrollado un enfoque pedagógico innovador que fusiona la lingüística computacional avanzada con la simulación de entornos corporativos reales. Nuestro sistema no se basa en la memorización aislada de vocabulario, sino en la inmersión total a través de conversaciones contextuales generadas por sistemas de evaluación adaptativa.
            </p>
            <p>
              Al interactuar con nuestros tutores virtuales en inglés, francés o chino mandarín, el sistema analiza en tiempo real la pronunciación, la sintaxis y la fluidez del usuario. Esta retroalimentación instantánea permite corregir errores fosilizados y acelerar la adquisición del idioma hasta un 300% más rápido que los métodos tradicionales, preparando a los ejecutivos para negociaciones de alto riesgo.
            </p>
            <p>
              Además, nuestra integración del ajedrez táctico sirve como un gimnasio cognitivo. Estudios demuestran que el pensamiento estratégico desarrollado en el tablero de ajedrez se traduce directamente en una mejor toma de decisiones bajo presión, complementando perfectamente las habilidades de comunicación intercultural que nuestros usuarios adquieren en la plataforma.
            </p>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN FAQ --- */}
      <section className="py-24 bg-slate-50 text-black relative z-10 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 tracking-widest uppercase mb-12 text-center">Preguntas Frecuentes</h2>
          <div className="space-y-8">
            <div className="bg-white p-6 border border-gray-200 hover:border-[#D4AF37]/50 transition-colors">
              <h3 className="text-xl font-bold text-slate-900 mb-3">¿Cómo funciona la evaluación automatizada?</h3>
              <p className="text-gray-700 font-light leading-relaxed">
                Nuestra tecnología de reconocimiento de voz de nivel empresarial captura tu discurso y lo compara con una inmensa base de datos de hablantes nativos. Evalúa tu cadencia, entonación y precisión gramatical en milisegundos, proporcionándote un reporte detallado después de cada sesión de simulación ejecutiva.
              </p>
            </div>
            <div className="bg-white p-6 border border-gray-200 hover:border-[#D4AF37]/50 transition-colors">
              <h3 className="text-xl font-bold text-slate-900 mb-3">¿Cómo mido mi progreso en el idioma?</h3>
              <p className="text-gray-700 font-light leading-relaxed">
                Nuestra plataforma proporciona reportes analíticos detallados y seguimiento en tiempo real de tu fluidez, vocabulario y precisión gramatical. Podrás ver tu evolución constante mediante métricas de rendimiento basadas en tus interacciones con nuestros tutores automatizados.
              </p>
            </div>
            <div className="bg-white p-6 border border-gray-200 hover:border-[#D4AF37]/50 transition-colors">
              <h3 className="text-xl font-bold text-slate-900 mb-3">¿Por qué integrar Ajedrez en una plataforma de idiomas?</h3>
              <p className="text-gray-700 font-light leading-relaxed">
                Los líderes corporativos necesitan tanto fluidez verbal como agilidad mental. El entrenamiento en ajedrez táctico desarrolla habilidades críticas como el reconocimiento de patrones, la evaluación posicional y el cálculo profundo; herramientas mentales indispensables para negociar contratos internacionales en un segundo o tercer idioma.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN 4: CTA FINAL CON PLANES MINIATURA --- */}
      <section className="py-24 bg-slate-50 text-center px-6 relative z-10 border-t border-gray-200">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight uppercase">
              El conocimiento global <br/>en tus manos.
            </h2>
            <p className="text-xl text-slate-700 font-light max-w-2xl mx-auto">
              Únete a OnixLingo y transforma la forma en la que aprendes, compites y te comunicas con el mundo. Elige el plan que mejor se adapte a tus objetivos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Free Plan */}
            <div className="bg-white border border-gray-200 p-8 flex flex-col justify-between hover:border-black transition-colors">
              <div>
                <h3 className="font-bold text-xl uppercase tracking-widest text-slate-900 mb-2">Free</h3>
                <p className="text-gray-500 text-sm mb-6">Exploración inicial del ecosistema.</p>
                <div className="text-4xl font-black text-black font-mono mb-6">$0 <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">/ mes</span></div>
                <ul className="space-y-3 mb-8 text-sm text-gray-700">
                  <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-slate-900 shrink-0"/> <span>Lecciones estándar</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-slate-900 shrink-0"/> <span>2 puzzles diarios</span></li>
                </ul>
              </div>
              <Link href="/register">
                <button className="w-full bg-white border border-black text-black font-bold uppercase tracking-widest py-3 text-sm hover:bg-slate-900 hover:text-white transition-colors">
                  Empezar Gratis
                </button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white border border-gray-200 p-8 flex flex-col justify-between hover:border-black transition-colors relative">
              <div>
                <h3 className="font-bold text-xl uppercase tracking-widest text-slate-900 mb-2">Pro</h3>
                <p className="text-gray-500 text-sm mb-6">Para profesionales independientes.</p>
                <div className="text-4xl font-black text-black font-mono mb-6">$129 <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">/ mes</span></div>
                <ul className="space-y-3 mb-8 text-sm text-gray-700">
                  <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-[#D4AF37] shrink-0"/> <span>Acceso ilimitado A1-C2</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-[#D4AF37] shrink-0"/> <span>Ajedrez ilimitado</span></li>
                </ul>
              </div>
              <Link href="/planes">
                <button className="w-full bg-slate-900 text-white font-bold uppercase tracking-widest py-3 text-sm hover:bg-black transition-colors">
                  Ver Detalles Pro
                </button>
              </Link>
            </div>

            {/* Executive Plan */}
            <div className="bg-white border-2 border-[#D4AF37] p-8 flex flex-col justify-between relative shadow-lg shadow-[#D4AF37]/10">
              <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-[10px] px-3 py-1">
                Recomendado
              </div>
              <div>
                <h3 className="font-bold text-xl uppercase tracking-widest text-slate-900 mb-2">Executive</h3>
                <p className="text-gray-500 text-sm mb-6">Membresía Alta Dirección definitiva.</p>
                <div className="text-4xl font-black text-black font-mono mb-6">$249 <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">/ mes</span></div>
                <ul className="space-y-3 mb-8 text-sm text-gray-700">
                  <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-[#D4AF37] shrink-0"/> <span>Simulador Corporativo</span></li>
                  <li className="flex items-start gap-2"><CheckCircle2 size={18} className="text-[#D4AF37] shrink-0"/> <span>Speech Analytics Avanzado</span></li>
                </ul>
              </div>
              <Link href="/planes">
                <button className="w-full bg-[#D4AF37] text-black font-bold uppercase tracking-widest py-3 text-sm hover:bg-[#b5952f] transition-colors">
                  Adquirir Executive
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <LandingFooter />

    </div>
  );
}
