'use client';

import Link from 'next/link';
import { 
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
  User,
  PieChart
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-indigo-500/30 selection:text-indigo-900">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-xl border-b border-slate-200 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-600/20">
              <span className="mt-0.5">O</span>
            </div>
            <span className="font-bold text-slate-900 tracking-tight text-xl">OnixLingo AI</span>
          </div>
          <div className="flex gap-8 items-center">
            <Link href="/ventas" className="hidden md:block text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
              Para Empresas
            </Link>
            <Link href="/login" className="hidden md:block text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
              Iniciar Sesión
            </Link>
            <Link href="/register">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 px-6 rounded-full transition-all shadow-md shadow-indigo-600/20 hover:shadow-lg hover:scale-105 active:scale-95">
                Crear Cuenta Gratis
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="pt-40 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-100 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest shadow-sm">
            <Sparkles size={12} className="text-indigo-600" />
            Ecosistema de Aprendizaje 2.0
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
            El multiverso de los idiomas.
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-light">
            No es solo inglés. Es una arquitectura completa con tutoría en tiempo real para dominar Inglés, Francés, Chino, y agudizar tu mente con Ajedrez estratégico.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8">
            <Link href="/register" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-indigo-600 text-white text-lg font-bold py-4 px-10 rounded-xl shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 hover:-translate-y-1 hover:bg-indigo-700">
                Comenzar Ahora <ArrowRight size={20} />
              </button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 hover:border-indigo-600 hover:text-indigo-600 text-lg font-semibold py-4 px-10 rounded-xl transition-all shadow-sm hover:shadow-md">
                Ya tengo cuenta
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* --- ECOSISTEMA BENTO GRID --- */}
      <section className="py-24 bg-white relative z-10 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 md:text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">Un Ecosistema Completo</h2>
            <p className="text-slate-600 text-xl font-light">
              Diferentes módulos diseñados para adaptarse a tu nivel, tus objetivos y tu estilo de aprendizaje.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Standard English & Multilang */}
            <div className="md:col-span-2 group bg-slate-50 p-8 rounded-3xl border border-slate-200 hover:border-indigo-300 transition-all duration-300 overflow-hidden relative">
              <div className="absolute right-[-5%] top-[-10%] opacity-5 group-hover:opacity-10 transition-opacity text-slate-900">
                <Globe size={200} />
              </div>
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <Languages size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Multilingüe Dinámico</h3>
              <p className="text-slate-600 leading-relaxed mb-6 max-w-md relative z-10">
                Cursos completos de Inglés, Francés y Chino Mandarín adaptados a las normativas del MCER. Interacciones con avatares nativos y corrección gramatical instantánea.
              </p>
              <div className="flex gap-2 relative z-10">
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 shadow-sm">🇺🇸 Inglés</span>
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 shadow-sm">🇫🇷 Francés</span>
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 shadow-sm">🇨🇳 Chino</span>
              </div>
            </div>

            {/* Chess / Ajedrez */}
            <div className="group bg-slate-50 p-8 rounded-3xl border border-slate-200 hover:border-emerald-300 transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <Crown size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Ajedrez Cognitivo</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Desarrolla el pensamiento estratégico. Aprende aperturas, tácticas y resolución de problemas interactuando con nuestra IA.
              </p>
            </div>

            {/* Vocabulary */}
            <div className="group bg-slate-50 p-8 rounded-3xl border border-slate-200 hover:border-pink-300 transition-all duration-300">
              <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center mb-6">
                <BookA size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Vocabulario</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Expansión léxica acelerada. Tarjetas de memoria inteligentes, repetición espaciada y contextos reales de uso.
              </p>
            </div>

            {/* OnixPro */}
            <div className="md:col-span-4 group bg-slate-900 p-8 rounded-3xl border border-amber-500/30 hover:border-amber-500/60 transition-all duration-300 flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-slate-900/10">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
                <Gem size={32} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-white">OnixPro Titanium</h3>
                  <span className="px-2 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase tracking-widest rounded">Executive</span>
                </div>
                <p className="text-slate-300 leading-relaxed max-w-3xl">
                  El Hub Ejecutivo para profesionales. Simulaciones de juntas de negocios, análisis de fonética de precisión, métricas de liderazgo y preparación corporativa intensiva de alto nivel.
                </p>
              </div>
              <div>
                <Link href="/register?tier=pro">
                  <button className="whitespace-nowrap px-6 py-3 bg-white hover:bg-amber-400 text-slate-900 rounded-xl font-bold transition-all shadow-md">
                    Descubrir Pro
                  </button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- CORE TECH FEATURES --- */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-2 shadow-sm">
              <BrainCircuit size={28} />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Motor Neuronal Cero Latencia</h4>
            <p className="text-slate-600 leading-relaxed text-sm">
              Conversaciones fluidas y naturales. Nuestro sistema procesa tus respuestas y adapta la dificultad en milisegundos.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2 shadow-sm">
              <Mic size={28} />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Análisis Fonético</h4>
            <p className="text-slate-600 leading-relaxed text-sm">
              Detección de pronunciación en tiempo real. Te decimos exactamente qué sonido ajustar para sonar como un hablante nativo.
            </p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-2 shadow-sm">
              <LayoutGrid size={28} />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Curriculum Evolutivo</h4>
            <p className="text-slate-600 leading-relaxed text-sm">
              No hay dos estudiantes iguales. La plataforma genera lecciones y escenarios basados estrictamente en tus puntos débiles.
            </p>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN PLANES (PERSONAL & B2B) --- */}
      <section className="py-24 bg-white border-t border-slate-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
              Planes diseñados para ti
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Ya sea que quieras potenciar tu crecimiento individual o capacitar a toda tu organización, tenemos la arquitectura lista.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Plan Personal */}
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6">
                  <User size={24} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Cuenta Personal</h3>
                <p className="text-slate-600 mb-6">
                  Avanza a tu propio ritmo. Accede a tutorías, ejercicios de pronunciación y vocabulario.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 size={18} className="text-indigo-500" /> Nivelación automática.
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 size={18} className="text-indigo-500" /> Acceso a Idiomas y Ajedrez.
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <CheckCircle2 size={18} className="text-indigo-500" /> Opción de upgrade a Pro Titanium.
                  </li>
                </ul>
              </div>
              <Link href="/register">
                <button className="w-full bg-white border border-slate-200 hover:border-indigo-600 text-slate-800 hover:text-indigo-600 font-bold py-3 px-6 rounded-xl transition-all shadow-sm">
                  Crear Cuenta Gratis
                </button>
              </Link>
            </div>

            {/* Plan Empresas */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute right-[-10%] top-[-10%] opacity-10">
                <Building2 size={200} className="text-indigo-400" />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mb-6">
                  <Building2 size={24} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Planes para Empresas</h3>
                <p className="text-slate-400 mb-6">
                  Soluciones de capacitación corporativa y licencias por volumen con control total.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 size={18} className="text-indigo-400" /> Dashboards y métricas de progreso.
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 size={18} className="text-indigo-400" /> Facturación centralizada B2B.
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 size={18} className="text-indigo-400" /> Preparación para certificaciones.
                  </li>
                </ul>
              </div>
              <Link href="/ventas" className="relative z-10">
                <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg">
                  Contactar a Ventas
                </button>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* --- TERMINAL DEMO --- */}
      <section className="py-32 bg-slate-50 overflow-hidden relative border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-20 relative z-10">
          <div className="flex-1 space-y-10">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
              Aprende conversando, <br/>no memorizando.
            </h2>
            <div className="space-y-6">
              <div className="flex gap-6 items-start">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 mt-1"><CheckCircle2 size={24} /></div>
                <div>
                  <h4 className="text-xl font-bold mb-2 text-slate-900">Entorno Libre de Juicios</h4>
                  <p className="text-slate-600 leading-relaxed">Practica a tu propio ritmo. Nuestro tutor IA tiene paciencia infinita y está disponible 24/7.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600 mt-1"><CheckCircle2 size={24} /></div>
                <div>
                  <h4 className="text-xl font-bold mb-2 text-slate-900">Feedback Contextual</h4>
                  <p className="text-slate-600 leading-relaxed">Correcciones explicadas al instante, entendiendo el contexto de lo que querías comunicar.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full">
            {/* Terminal Window (Kept dark for UI contrast) */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl relative">
              <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                </div>
                {/* Eliminado el texto de INTERFACE_AI_ACTIVE */}
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
      <section className="py-32 bg-white text-center px-6 border-t border-slate-200">
        <div className="max-w-4xl mx-auto space-y-10">
          <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
            El conocimiento global <br/>en tus manos.
          </h2>
          <p className="text-xl text-slate-600 font-light max-w-2xl mx-auto">
            Únete a OnixLingo y transforma la forma en la que aprendes, compites y te comunicas con el mundo.
          </p>
          <div className="flex flex-col items-center gap-4">
            <Link href="/register">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-bold py-5 px-12 rounded-full transition-all shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95">
                Crear Mi Cuenta Gratuita
              </button>
            </Link>
            <p className="text-sm text-slate-500 font-medium">Acceso inmediato a todos los módulos.</p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-50 py-12 px-6 text-sm text-slate-500 border-t border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-lg">OnixLingo AI</span>
            </div>
            <p className="text-xs">Ecosistema Educativo de Alta Disponibilidad</p>
          </div>
          <div className="flex gap-8 font-medium">
            <Link href="/ventas" className="hover:text-indigo-600 transition-colors">Ventas B2B</Link>
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Términos</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Soporte</a>
          </div>
          <p className="text-xs">© 2026 OnixuTechnology.</p>
        </div>
      </footer>

    </div>
  );
}