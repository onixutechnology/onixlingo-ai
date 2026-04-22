'use client';

import Link from 'next/link';
import { 
  Bot, 
  BrainCircuit, 
  Mic, 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  BarChart3, 
  Layers, 
  Sparkles,
  Gem
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* --- NAVBAR TITANIUM --- */}
      <nav className="fixed w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-900 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-900/20">
              <span className="mt-0.5">O</span>
            </div>
            <span className="font-light tracking-[0.2em] text-white uppercase text-lg">
              Onix<span className="font-bold text-amber-500">Pro</span>
            </span>
          </div>
          <div className="flex gap-8 items-center">
            <Link href="/auth/login" className="hidden md:block text-sm font-bold tracking-widest uppercase text-slate-400 hover:text-amber-400 transition-colors">
              Executive Login
            </Link>
            <Link href="/dashboard">
              <button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold tracking-widest uppercase py-3 px-6 rounded-full transition-all shadow-md shadow-amber-600/20 hover:shadow-lg hover:shadow-amber-500/40 hover:scale-105 active:scale-95">
                Iniciar Prueba
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION (Titanium) --- */}
      <main className="pt-40 pb-24 px-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 relative overflow-hidden">
        {/* Glow de fondo suave */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 relative z-10">
          
          {/* Badge Titanium */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-widest shadow-sm">
            <Gem size={12} fill="currentColor" />
            Titanium Edition
          </div>

          <h1 className="text-5xl md:text-7xl font-thin text-white tracking-tight leading-[1.1]">
            El idioma de los negocios. <br className="hidden md:block" />
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 drop-shadow-2xl">
              Sin límites.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light border-l-2 border-amber-500/50 pl-4">
            Domina el inglés corporativo con nuestra arquitectura de IA. <br className="hidden md:block" />
            Simulaciones inmersivas, corrección fonética ejecutiva y analíticas en tiempo real.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-sm font-bold uppercase tracking-widest py-4 px-10 rounded-xl shadow-xl shadow-amber-900/20 transition-all flex items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-amber-500/30">
                Acceder al Hub <ArrowRight size={18} />
              </button>
            </Link>
            <Link href="/avatar" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-600 hover:text-white text-sm font-bold uppercase tracking-widest py-4 px-10 rounded-xl transition-all shadow-sm hover:shadow-md">
                Ver Demo Tecnológica
              </button>
            </Link>
          </div>

          <p className="text-[10px] text-slate-500 font-bold pt-8 tracking-[0.2em] uppercase">
            Plataforma oficial para líderes en tecnología e industria
          </p>
        </div>
      </main>

      {/* --- STATS STRIP (Dark Mode) --- */}
      <div className="border-y border-slate-900 bg-slate-900/30 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div className="space-y-2">
            <p className="text-4xl font-black text-white tracking-tighter">B1-C2</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Nivel Ejecutivo</p>
          </div>
          <div className="space-y-2">
            <p className="text-4xl font-black text-white tracking-tighter">24/7</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Disponibilidad</p>
          </div>
          <div className="space-y-2">
            <p className="text-4xl font-black text-amber-400 tracking-tighter">0.2s</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Latencia IA</p>
          </div>
          <div className="space-y-2">
            <p className="text-4xl font-black text-white tracking-tighter">100%</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Personalizado</p>
          </div>
        </div>
      </div>

      {/* --- FEATURE GRID (Dark Bento Style) --- */}
      <section className="py-32 bg-slate-950 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20 md:text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-thin text-white tracking-tight">Arquitectura de <span className="font-bold">Aprendizaje Profundo</span></h2>
            <p className="text-slate-400 text-xl font-light">
              Nuestra plataforma es un ecosistema educativo impulsado por algoritmos avanzados para la alta dirección.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-slate-900/60 p-10 rounded-3xl border border-slate-800 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300">
              <div className="w-14 h-14 bg-slate-950 text-amber-500 rounded-2xl border border-slate-800 flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform">
                <BrainCircuit size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Motor Neuronal</h3>
              <p className="text-slate-400 leading-relaxed font-light">
                Análisis predictivo de errores y adaptación dinámica del currículo basado en tu rendimiento en tiempo real.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-slate-900/60 p-10 rounded-3xl border border-slate-800 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300">
              <div className="w-14 h-14 bg-slate-950 text-amber-500 rounded-2xl border border-slate-800 flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform">
                <Bot size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Contexto Infinito</h3>
              <p className="text-slate-400 leading-relaxed font-light">
                Simula juntas directivas o negociaciones B2B. El motor entiende matices, ironía y etiqueta corporativa.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-slate-900/60 p-10 rounded-3xl border border-slate-800 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
              <div className="w-14 h-14 bg-slate-950 text-emerald-500 rounded-2xl border border-slate-800 flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform">
                <Mic size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Fonética de Precisión</h3>
              <p className="text-slate-400 leading-relaxed font-light">
                Feedback instantáneo a nivel de fonema. Corrige tu acento y ritmo para presentaciones impecables.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-slate-900/60 p-10 rounded-3xl border border-slate-800 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
              <div className="w-14 h-14 bg-slate-950 text-blue-500 rounded-2xl border border-slate-800 flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform">
                <Layers size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Estándar MCER</h3>
              <p className="text-slate-400 leading-relaxed font-light">
                Estructura académica rigurosa alineada con estándares internacionales para validar tus competencias profesionales.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-slate-900/60 p-10 rounded-3xl border border-slate-800 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300">
              <div className="w-14 h-14 bg-slate-950 text-amber-500 rounded-2xl border border-slate-800 flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform">
                <BarChart3 size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Executive Dashboard</h3>
              <p className="text-slate-400 leading-relaxed font-light">
                Panel de control avanzado con KPIs de fluidez, expansión léxica y consistencia estructural.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-slate-900/60 p-10 rounded-3xl border border-slate-800 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
              <div className="w-14 h-14 bg-slate-950 text-purple-500 rounded-2xl border border-slate-800 flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform">
                <Globe size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Inteligencia Cultural</h3>
              <p className="text-slate-400 leading-relaxed font-light">
                Aprende más que palabras: domina las normas culturales y protocolos de negocios a nivel global.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- COMPARISON / TERMINAL DEMO --- */}
      <section className="py-32 bg-slate-900 overflow-hidden relative border-y border-slate-800">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-600 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-20 relative z-10">
          <div className="flex-1 space-y-10">
            <h2 className="text-4xl md:text-5xl font-thin tracking-tight text-white">La ventaja competitiva <br/><span className="font-bold">que estabas buscando.</span></h2>
            
            <div className="space-y-6">
              <div className="flex gap-6 items-start">
                <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 mt-1 border border-amber-500/20"><CheckCircle2 size={24} /></div>
                <div>
                  <h4 className="text-xl font-bold mb-2 text-white">Flexibilidad Total</h4>
                  <p className="text-slate-400 leading-relaxed font-light">Tu coach personal está disponible 24/7. Sin citas previas, sin cancelaciones, a tu propio ritmo.</p>
                </div>
              </div>
              
              <div className="flex gap-6 items-start">
                <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400 mt-1 border border-emerald-500/20"><CheckCircle2 size={24} /></div>
                <div>
                  <h4 className="text-xl font-bold mb-2 text-white">Entorno Seguro</h4>
                  <p className="text-slate-400 leading-relaxed font-light">Elimina el síndrome del impostor. Practica y perfecciona tu discurso en un entorno privado y de alta exigencia.</p>
                </div>
              </div>
              
              <div className="flex gap-6 items-start">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 mt-1 border border-blue-500/20"><CheckCircle2 size={24} /></div>
                <div>
                  <h4 className="text-xl font-bold mb-2 text-white">ROI Maximizado</h4>
                  <p className="text-slate-400 leading-relaxed font-light">Resultados acelerados y medibles para impulsar tu siguiente salto profesional.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full">
            <div className="bg-slate-950/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden ring-1 ring-white/5">
              <div className="flex items-center justify-between mb-8 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                </div>
                <div className="text-[10px] font-mono text-amber-500/70 tracking-widest uppercase font-bold">Session_ID: ONX-PRO</div>
              </div>
              
              <div className="space-y-6 font-mono text-sm">
                <div className="flex gap-4">
                  <span className="text-slate-500 font-bold">USER &gt;</span>
                  <span className="text-slate-300">I need to prepare for a Q4 board meeting pitch.</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-amber-500 font-bold">ONIX &gt;</span>
                  <span className="text-slate-300">Understood. I will simulate the role of a skeptical Board Member. Let's start with your revenue projections. Go ahead.</span>
                </div>
                <div className="flex gap-4 opacity-50">
                  <span className="text-slate-500 font-bold">USER &gt;</span>
                  <span className="text-slate-300">Okay, so our product helps companies...</span>
                </div>
                
                <div className="mt-8 p-4 bg-slate-900 rounded-xl border border-slate-800">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-3 font-bold">Real-time Telemetry</p>
                  <div className="flex items-center gap-2 text-emerald-400 text-xs">
                    <Sparkles size={12} /> <span>Grammar Check: 100% Accuracy</span>
                  </div>
                  <div className="flex items-center gap-2 text-amber-400 text-xs mt-2">
                    <BarChart3 size={12} /> <span>Tone Shift Required: More Persuasive</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section className="py-32 bg-slate-950 text-center px-6 border-t border-slate-900">
        <div className="max-w-4xl mx-auto space-y-10">
          <h2 className="text-4xl md:text-6xl font-thin text-white tracking-tight">
            Tu carrera no tiene límites. <br/>
            <span className="font-bold">Tu inglés tampoco debería.</span>
          </h2>
          <p className="text-xl text-slate-400 font-light max-w-2xl mx-auto">
            Únete a la plataforma elegida por ejecutivos y profesionales de alto rendimiento.
          </p>
          <div className="flex flex-col items-center gap-4 pt-4">
            <Link href="/dashboard">
              <button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-lg font-bold uppercase tracking-widest py-5 px-12 rounded-xl transition-all shadow-xl shadow-amber-900/30 hover:shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-3">
                <Gem size={20} fill="currentColor" />
                Ingresar al Hub
              </button>
            </Link>
            <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">
              Actualización a Titanium disponible
            </p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-950 border-t border-slate-900 py-16 px-6 text-sm text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="font-light tracking-[0.2em] text-white uppercase text-sm">
                Onix<span className="font-bold text-amber-500">Pro</span>
              </span>
            </div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-slate-600">Enterprise Learning Solutions</p>
          </div>
          
          <div className="flex gap-8 font-bold text-[10px] uppercase tracking-widest">
            <a href="#" className="hover:text-amber-400 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Términos</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Empresas</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Soporte</a>
          </div>
          
          <p className="text-[10px] tracking-widest uppercase font-bold text-slate-700">© 2026 OnixuTechnology.</p>
        </div>
      </footer>
    </div>
  );
}
