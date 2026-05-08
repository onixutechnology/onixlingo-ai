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
  User
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-300 selection:bg-indigo-500/30 selection:text-indigo-200 overflow-hidden">

      {/* --- BACKGROUND DECORATORS --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* --- NAVBAR COMPACTO --- */}
      <nav className="fixed w-full bg-slate-950/80 backdrop-blur-xl border-b border-white/10 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center text-white font-bold shadow-[0_0_10px_rgba(79,70,229,0.4)]">
              <span className="text-xs">O</span>
            </div>
            <span className="font-bold text-white tracking-tight text-lg">OnixLingo AI</span>
          </div>
          <div className="flex gap-6 items-center">
            <Link href="/ventas" className="hidden md:block text-xs font-semibold text-slate-400 hover:text-white transition-colors">
              Para Empresas
            </Link>
            <Link href="/login" className="hidden md:block text-xs font-semibold text-slate-400 hover:text-white transition-colors">
              Iniciar Sesión
            </Link>
            <Link href="/register">
              <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 px-5 rounded-md transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] border border-indigo-500/50 active:scale-95">
                Crear Cuenta
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION COMPACTO --- */}
      <main className="pt-32 pb-16 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
            <Sparkles size={12} className="text-indigo-400" />
            Ecosistema de Aprendizaje 2.0
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1]">
            El multiverso de los idiomas.
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            No es solo inglés. Es una arquitectura completa con tutoría en tiempo real para dominar Inglés, Francés, Chino, y agudizar tu mente con Ajedrez estratégico.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link href="/register" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-indigo-600 text-white text-sm font-bold py-3 px-8 rounded-lg shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:bg-indigo-500 border border-indigo-500/50">
                Comenzar Ahora <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-white/5 border border-white/10 text-white hover:bg-white/10 text-sm font-semibold py-3 px-8 rounded-lg transition-all backdrop-blur-md">
                Ya tengo cuenta
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* --- ECOSISTEMA BENTO GRID (GLASSMORPHISM) --- */}
      <section className="py-16 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-10 md:text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl font-bold text-white tracking-tight">Arquitectura Modular</h2>
            <p className="text-slate-400 text-sm font-medium">
              Diferentes módulos diseñados para adaptarse a tu nivel y objetivos corporativos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Standard English & Multilang */}
            <div className="md:col-span-2 group bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-indigo-500/50 transition-all duration-300 overflow-hidden relative backdrop-blur-sm">
              <div className="absolute right-[-5%] top-[-10%] opacity-5 group-hover:opacity-10 transition-opacity text-white">
                <Globe size={150} />
              </div>
              <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 rounded-xl flex items-center justify-center mb-4">
                <Languages size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Multilingüe Dinámico</h3>
              <p className="text-slate-400 leading-relaxed text-sm mb-6 max-w-sm relative z-10">
                Cursos de Inglés, Francés y Chino Mandarín adaptados al MCER. Interacciones nativas y corrección al instante.
              </p>
              <div className="flex gap-2 relative z-10">
                <span className="px-2 py-1 bg-white/10 border border-white/10 rounded-md text-[10px] font-bold text-slate-300">🇺🇸 Inglés</span>
                <span className="px-2 py-1 bg-white/10 border border-white/10 rounded-md text-[10px] font-bold text-slate-300">🇫🇷 Francés</span>
                <span className="px-2 py-1 bg-white/10 border border-white/10 rounded-md text-[10px] font-bold text-slate-300">🇨🇳 Chino</span>
              </div>
            </div>

            {/* Chess / Ajedrez */}
            <div className="group bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-emerald-500/50 transition-all duration-300 backdrop-blur-sm">
              <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
                <Crown size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Ajedrez Cognitivo</h3>
              <p className="text-slate-400 leading-relaxed text-xs">
                Desarrolla el pensamiento estratégico. Aprende aperturas y tácticas interactuando en nuestra arena multijugador.
              </p>
            </div>

            {/* Vocabulary */}
            <div className="group bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-rose-500/50 transition-all duration-300 backdrop-blur-sm">
              <div className="w-10 h-10 bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl flex items-center justify-center mb-4">
                <BookA size={20} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Vocabulario B2B</h3>
              <p className="text-slate-400 leading-relaxed text-xs">
                Expansión léxica acelerada con repetición espaciada y contextos reales del mundo empresarial.
              </p>
            </div>

            {/* OnixPro */}
            <div className="md:col-span-4 group bg-slate-900/80 p-6 rounded-2xl border border-amber-500/30 hover:border-amber-500/60 transition-all duration-300 flex flex-col md:flex-row items-center gap-6 shadow-[0_0_20px_rgba(245,158,11,0.1)] backdrop-blur-md">
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-xl flex items-center justify-center shadow-lg">
                <Gem size={28} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-xl font-bold text-white">OnixPro Titanium</h3>
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[9px] font-bold uppercase tracking-widest rounded shadow-sm">Executive</span>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">
                  El Hub Ejecutivo para profesionales. Simulaciones de juntas, análisis fonético y preparación corporativa de alto nivel.
                </p>
              </div>
              <div>
                <Link href="/register?tier=pro">
                  <button className="whitespace-nowrap px-5 py-2.5 bg-white/10 border border-white/20 hover:bg-white hover:text-slate-900 text-white rounded-lg text-sm font-bold transition-all">
                    Descubrir Pro
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECCIÓN PLANES (PERSONAL & B2B) --- */}
      <section className="py-16 relative z-10 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10 space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Licenciamiento y Acceso
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plan Personal */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col justify-between hover:bg-white/10 transition-colors">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 rounded-lg flex items-center justify-center border border-indigo-500/20">
                    <User size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Cuenta Individual</h3>
                </div>
                <p className="text-slate-400 text-sm mb-6">
                  Avanza a tu propio ritmo. Accede a tutorías, ejercicios y métricas personales.
                </p>
                <ul className="space-y-2.5 mb-8">
                  <li className="flex items-center gap-3 text-sm text-slate-300">
                    <CheckCircle2 size={16} className="text-indigo-500" /> Nivelación automática.
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-300">
                    <CheckCircle2 size={16} className="text-indigo-500" /> Acceso a Idiomas y Ajedrez.
                  </li>
                </ul>
              </div>
              <Link href="/register">
                <button className="w-full bg-white/5 border border-white/10 hover:border-indigo-500 hover:bg-indigo-500/10 text-white text-sm font-bold py-2.5 rounded-lg transition-all">
                  Crear Cuenta Gratis
                </button>
              </Link>
            </div>

            {/* Plan Empresas */}
            <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden backdrop-blur-md shadow-[0_0_30px_rgba(79,70,229,0.1)]">
              <div className="absolute right-[-10%] top-[-10%] opacity-10">
                <Building2 size={150} className="text-indigo-400" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center shadow-lg">
                    <Building2 size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Licencias B2B</h3>
                </div>
                <p className="text-slate-400 text-sm mb-6">
                  Soluciones de capacitación corporativa con control y paneles de administración.
                </p>
                <ul className="space-y-2.5 mb-8">
                  <li className="flex items-center gap-3 text-sm text-slate-300">
                    <CheckCircle2 size={16} className="text-indigo-400" /> Dashboards empresariales.
                  </li>
                  <li className="flex items-center gap-3 text-sm text-slate-300">
                    <CheckCircle2 size={16} className="text-indigo-400" /> Facturación centralizada.
                  </li>
                </ul>
              </div>
              <Link href="/ventas" className="relative z-10">
                <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold py-2.5 rounded-lg transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] border border-indigo-500/50">
                  Contactar a Ventas
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- TERMINAL DEMO --- */}
      <section className="py-16 relative z-10 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Feedback de Precisión.
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="p-1.5 bg-indigo-500/20 border border-indigo-500/30 rounded-md text-indigo-400 mt-1"><CheckCircle2 size={18} /></div>
                <div>
                  <h4 className="text-sm font-bold mb-1 text-white">Entorno Libre de Juicios</h4>
                  <p className="text-slate-400 text-sm">El tutor IA tiene paciencia infinita 24/7.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="p-1.5 bg-violet-500/20 border border-violet-500/30 rounded-md text-violet-400 mt-1"><CheckCircle2 size={18} /></div>
                <div>
                  <h4 className="text-sm font-bold mb-1 text-white">Corrección Contextual</h4>
                  <p className="text-slate-400 text-sm">Entiende el contexto de negocios al instante.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="bg-slate-900 border border-white/10 rounded-xl p-5 shadow-2xl">
              <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-600"></div>
              </div>
              <div className="space-y-4 font-mono text-[11px] leading-relaxed">
                <div className="flex gap-3">
                  <span className="text-indigo-400 font-bold">USER_</span>
                  <span className="text-slate-300">I need order a coffee, but I dont know how.</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-emerald-400 font-bold">SYS_&nbsp;</span>
                  <span className="text-slate-400">Notice the correction from 'need order' to 'would like to order'. Try: "I would like to order a coffee, please."</span>
                </div>
                <div className="flex gap-3 opacity-50">
                  <span className="text-indigo-400 font-bold">USER_</span>
                  <span className="text-slate-300">I would like to order a coffee, please.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER COMPACTO --- */}
      <footer className="bg-slate-950 py-8 px-6 text-xs text-slate-500 border-t border-white/5 relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">OnixLingo AI</span>
            <span>© {new Date().getFullYear()} Onixu Technology.</span>
          </div>
          <div className="flex gap-6 font-medium">
            <Link href="/ventas" className="hover:text-white transition-colors">Ventas B2B</Link>
            <Link href="/legal" className="hover:text-white transition-colors">Privacidad & Términos</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}