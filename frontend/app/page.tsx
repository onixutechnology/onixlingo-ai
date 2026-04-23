'use client';

import Link from 'next/link';
import { 
  Bot, 
  BrainCircuit, 
  Mic, 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  Gem,
  Crown,
  BookA,
  Languages,
  LayoutGrid,
  Building2,
  PieChart
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-900 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-900/20">
              <span className="mt-0.5">O</span>
            </div>
            <span className="font-bold text-white tracking-tight text-xl">OnixLingo AI</span>
          </div>
          <div className="flex gap-8 items-center">
            <Link href="/ventas" className="hidden md:block text-sm font-semibold text-slate-400 hover:text-white transition-colors">
              Para Empresas
            </Link>
            <Link href="/auth/login" className="hidden md:block text-sm font-semibold text-slate-400 hover:text-white transition-colors">
              Iniciar Sesión
            </Link>
            <Link href="/auth/register">
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2.5 px-6 rounded-full transition-all shadow-md shadow-indigo-600/20 hover:shadow-lg hover:scale-105 active:scale-95">
                Crear Cuenta Gratis
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold uppercase tracking-widest shadow-sm">
            <Sparkles size={12} className="text-indigo-400" />
            Ecosistema de Aprendizaje 2.0
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
            El multiverso de los idiomas. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-2xl">
              Potenciado por IA.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light">
            No es solo inglés. Es una arquitectura completa con tutoría en tiempo real para dominar Inglés, Francés, Chino, y agudizar tu mente con Ajedrez estratégico.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8">
            <Link href="/auth/register" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-white text-slate-950 text-lg font-bold py-4 px-10 rounded-xl shadow-xl shadow-white/10 transition-all flex items-center justify-center gap-3 hover:-translate-y-1 hover:bg-slate-100">
                Comenzar Ahora <ArrowRight size={20} />
              </button>
            </Link>
            <Link href="/auth/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white text-lg font-semibold py-4 px-10 rounded-xl transition-all shadow-sm hover:shadow-md">
                Ya tengo cuenta
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* --- ECOSISTEMA BENTO GRID --- */}
      <section className="py-24 bg-slate-950 relative z-10 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 md:text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Un Ecosistema Completo</h2>
            <p className="text-slate-400 text-xl font-light">
              Diferentes módulos diseñados para adaptarse a tu nivel, tus objetivos y tu estilo de aprendizaje.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Standard English & Multilang */}
            <div className="md:col-span-2 group bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-indigo-500/50 transition-all duration-300 overflow-hidden relative">
              <div className="absolute right-[-5%] top-[-10%] opacity-10 group-hover:opacity-20 transition-opacity">
                <Globe size={200} />
              </div>
              <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
                <Languages size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Multilingüe Dinámico</h3>
              <p className="text-slate-400 leading-relaxed mb-6 max-w-md relative z-10">
                Cursos completos de Inglés, Francés y Chino Mandarín adaptados a las normativas del MCER. Interacciones con avatares nativos y corrección gramatical instantánea.
              </p>
              <div className="flex gap-2 relative z-10">
                <span className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-bold text-slate-300">🇺🇸 Inglés</span>
                <span className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-bold text-slate-300">🇫🇷 Francés</span>
                <span className="px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-bold text-slate-300">🇨🇳 Chino</span>
              </div>
            </div>

            {/* Chess / Ajedrez */}
            <div className="group bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
                <Crown size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Ajedrez Cognitivo</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Desarrolla el pensamiento estratégico. Aprende aperturas, tácticas y resolución de problemas interactuando con nuestra IA.
              </p>
            </div>

            {/* Vocabulary */}
            <div className="group bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-pink-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-pink-500/20 text-pink-400 rounded-2xl flex items-center justify-center mb-6">
                <BookA size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Vocabulario</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                Expansión léxica acelerada. Tarjetas de memoria inteligentes, repetición espaciada y contextos reales de uso.
              </p>
            </div>

            {/* OnixPro */}
            <div className="md:col-span-4 group bg-gradient-to-r from-slate-900 to-slate-950 p-8 rounded-3xl border border-amber-500/30 hover:border-amber-500/60 transition-all duration-300 flex flex-col md:flex-row items-center gap-8 shadow-2xl shadow-amber-900/10">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 rounded-2xl flex items-center justify-center shadow-lg">
                <Gem size={32} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-white">OnixPro Titanium</h3>
                  <span className="px-2 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-widest rounded">Executive</span>
                </div>
                <p className="text-slate-400 leading-relaxed max-w-3xl">
                  El Hub Ejecutivo para profesionales. Simulaciones de juntas de negocios, análisis de fonética de precisión, métricas de liderazgo y preparación corporativa intensiva de alto nivel.
                </p>
              </div>
              <div>
                <Link href="/auth/register?tier=pro">
                  <button className="whitespace-nowrap px-6 py-3 bg-slate-800 hover:bg-amber-500 text-white hover:text-slate-950 rounded-xl font-bold transition-all border border-slate-700 hover:border-amber-400">
                    Descubrir Pro
                  </button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- CORE TECH FEATURES --- */}
      <section className="py-24 bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 bg-slate-800 text-blue-400 rounded-full flex items-center justify-center mb-2">
              <BrainCircuit size={28} />
            </div>
            <h4 className="text-xl font-bold text-white">Motor Neuronal Cero Latencia</h4>
            <p className="text-slate-400 leading-relaxed text-sm">
              Conversaciones fluidas y naturales. Nuestro sistema procesa tus respuestas y adapta la dificultad en milisegundos.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 bg-slate-800 text-emerald-400 rounded-full flex items-center justify-center mb-2">
              <Mic size={28} />
            </div>
            <h4 className="text-xl font-bold text-white">Análisis Fonético</h4>
            <p className="text-slate-400 leading-relaxed text-sm">
              Detección de pronunciación en tiempo real. Te decimos exactamente qué sonido ajustar para sonar como un hablante nativo.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 bg-slate-800 text-purple-400 rounded-full flex items-center justify-center mb-2">
              <LayoutGrid size={28} />
            </div>
            <h4 className="text-xl font-bold text-white">Curriculum Evolutivo</h4>
            <p className="text-slate-400 leading-relaxed text-sm">
              No hay dos estudiantes iguales. La plataforma genera lecciones y escenarios basados estrictamente en tus puntos débiles.
            </p>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN VENTAS B2B (CORPORATE SALES) --- */}
      <section className="py-24 bg-gradient-to-b from-slate-950 to-indigo-950/20 border-t border-slate-900 relative overflow-hidden">
        {/* Abstract background graphics */}
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest">
              <Building2 size={14} />
              OnixLingo para Empresas
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              Potencia el talento <br />de tu organización.
            </h2>
            <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
              Soluciones de capacitación corporativa y licencias por volumen. Obtén acceso a métricas centralizadas de progreso, facturación empresarial y programas adaptados a las necesidades de tu industria.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/ventas">
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95 flex items-center gap-2">
                  Contactar a Ventas
                </button>
              </Link>
              <div className="flex items-center gap-3 text-sm text-slate-400 font-medium px-4">
                <PieChart size={18} className="text-indigo-400" />
                Dashboards Analíticos B2B
              </div>
            </div>
          </div>
          <div className="flex-1 w-full relative">
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
              <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
                <h4 className="text-white font-bold tracking-wide">Reporte de Equipo: Q3</h4>
                <span className="text-emerald-400 text-sm font-bold bg-emerald-400/10 px-3 py-1 rounded-full">+24% Fluidez Global</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs">M</div>
                    <span className="text-slate-300 text-sm">Marketing Team</span>
                  </div>
                  <div className="w-1/3 bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-500 h-full w-[85%]"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs">S</div>
                    <span className="text-slate-300 text-sm">Sales Division</span>
                  </div>
                  <div className="w-1/3 bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-purple-500 h-full w-[92%]"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-xs">D</div>
                    <span className="text-slate-300 text-sm">Development</span>
                  </div>
                  <div className="w-1/3 bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-orange-500 h-full w-[64%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- TERMINAL DEMO --- */}
      <section className="py-32 bg-slate-950 overflow-hidden relative border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-20 relative z-10">
          <div className="flex-1 space-y-10">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              Aprende conversando, <br/>no memorizando.
            </h2>
            <div className="space-y-6">
              <div className="flex gap-6 items-start">
                <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400 mt-1"><CheckCircle2 size={24} /></div>
                <div>
                  <h4 className="text-xl font-bold mb-2 text-white">Entorno Libre de Juicios</h4>
                  <p className="text-slate-400 leading-relaxed">Practica a tu propio ritmo. Nuestro tutor IA tiene paciencia infinita y está disponible 24/7.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 mt-1"><CheckCircle2 size={24} /></div>
                <div>
                  <h4 className="text-xl font-bold mb-2 text-white">Feedback Contextual</h4>
                  <p className="text-slate-400 leading-relaxed">Correcciones explicadas al instante, entendiendo el contexto de lo que querías comunicar.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative">
              <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                <div className="text-xs font-mono text-slate-500">INTERFACE_AI_ACTIVE</div>
              </div>
              
              <div className="space-y-6 font-mono text-sm">
                <div className="flex gap-4">
                  <span className="text-indigo-400 font-bold">USER &gt;</span>
                  <span className="text-slate-300">I need order a coffee, but I dont know how.</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-emerald-400 font-bold">AI &gt;</span>
                  <span className="text-slate-300">Sure! A natural way to say it is "I would like to order a coffee, please." Notice the correction from 'need order' to 'would like to order'. Try saying it!</span>
                </div>
                <div className="flex gap-4 opacity-50">
                  <span className="text-indigo-400 font-bold">USER &gt;</span>
                  <span className="text-slate-300">I would like to order a coffee, please.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section className="py-32 bg-slate-900 text-center px-6 border-t border-slate-800">
        <div className="max-w-4xl mx-auto space-y-10">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
            El conocimiento global <br/>en tus manos.
          </h2>
          <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto">
            Únete a OnixLingo y transforma la forma en la que aprendes, compites y te comunicas con el mundo.
          </p>
          <div className="flex flex-col items-center gap-4">
            <Link href="/auth/register">
              <button className="bg-white hover:bg-slate-200 text-slate-900 text-xl font-bold py-5 px-12 rounded-full transition-all shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95">
                Crear Mi Cuenta Gratuita
              </button>
            </Link>
            <p className="text-sm text-slate-500 font-medium">Acceso inmediato a todos los módulos.</p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-950 py-12 px-6 text-sm text-slate-500 border-t border-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-lg">OnixLingo AI</span>
            </div>
            <p className="text-xs">Ecosistema Educativo de Alta Disponibilidad</p>
          </div>
          <div className="flex gap-8 font-medium">
            <Link href="/ventas" className="hover:text-white transition-colors">Ventas B2B</Link>
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Términos</a>
            <a href="#" className="hover:text-white transition-colors">Soporte</a>
          </div>
          <p className="text-xs">© 2026 OnixuTechnology.</p>
        </div>
      </footer>

    </div>
  );
}
