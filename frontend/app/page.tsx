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
  Sparkles 
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      
      {/* --- NAVBAR PROFESIONAL --- */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-xl border-b border-slate-100 z-50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-slate-900/20">
              <span className="mt-0.5">O</span>
            </div>
            <span className="font-bold text-slate-900 tracking-tight text-xl">OnixLingo AI</span>
          </div>
          
          <div className="flex gap-8 items-center">
            <Link href="/auth/login" className="hidden md:block text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors">
              Iniciar Sesión
            </Link>
            <Link href="/dashboard">
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-6 rounded-full transition-all shadow-md shadow-blue-600/20 hover:shadow-lg hover:scale-105 active:scale-95">
                Comenzar Gratis
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION (Ultra Clean) --- */}
      <main className="pt-40 pb-24 px-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white">
        <div className="max-w-5xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          {/* Badge sutil y genérico */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-widest shadow-sm">
            <Sparkles size={12} className="text-blue-600" />
            Nueva Generación 2.0
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
            Inglés fluido para <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">profesionales globales.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto leading-relaxed font-light">
            Domina el idioma de los negocios con nuestra arquitectura de IA. <br className="hidden md:block" />
            Simulaciones inmersivas, corrección fonética y adaptación en tiempo real.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white text-lg font-semibold py-4 px-10 rounded-xl shadow-xl shadow-slate-900/20 transition-all flex items-center justify-center gap-3 hover:-translate-y-1">
                Acceder a la Plataforma <ArrowRight size={20} />
              </button>
            </Link>
            <Link href="/avatar" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 text-lg font-semibold py-4 px-10 rounded-xl transition-all shadow-sm hover:shadow-md">
                Ver Demo Tecnológica
              </button>
            </Link>
          </div>
          
          <p className="text-xs text-slate-400 font-medium pt-4 tracking-wide">
            UTILIZADO POR LÍDERES EN TECNOLOGÍA Y NEGOCIOS
          </p>
        </div>
      </main>

      {/* --- STATS STRIP (Minimalist) --- */}
      <div className="border-y border-slate-100 bg-slate-50/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div className="space-y-2">
                <p className="text-4xl font-black text-slate-900 tracking-tighter">A1-C2</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Estándar MCER</p>
            </div>
            <div className="space-y-2">
                <p className="text-4xl font-black text-slate-900 tracking-tighter">24/7</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Disponibilidad</p>
            </div>
            <div className="space-y-2">
                <p className="text-4xl font-black text-slate-900 tracking-tighter">0.2s</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Latencia IA</p>
            </div>
            <div className="space-y-2">
                <p className="text-4xl font-black text-slate-900 tracking-tighter">100%</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Personalizado</p>
            </div>
        </div>
      </div>

      {/* --- FEATURE GRID (Bento Grid Style) --- */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20 md:text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">Arquitectura de Aprendizaje Profundo</h2>
            <p className="text-slate-500 text-xl font-light">
              Nuestra plataforma no es solo una app, es un ecosistema educativo impulsado por algoritmos avanzados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-slate-50 p-10 rounded-3xl border border-slate-100 hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300">
              <div className="w-14 h-14 bg-white text-indigo-600 rounded-2xl border border-slate-100 flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                <BrainCircuit size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Motor Neuronal</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                Análisis predictivo de errores y adaptación dinámica del currículo basado en tu rendimiento en tiempo real.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-slate-50 p-10 rounded-3xl border border-slate-100 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
              <div className="w-14 h-14 bg-white text-blue-600 rounded-2xl border border-slate-100 flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                <Bot size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Contexto Infinito</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                Simula entrevistas de trabajo, negociaciones o charlas casuales. El avatar entiende matices, ironía y formalidad.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-slate-50 p-10 rounded-3xl border border-slate-100 hover:border-emerald-100 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
              <div className="w-14 h-14 bg-white text-emerald-600 rounded-2xl border border-slate-100 flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                <Mic size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Fonética de Precisión</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                Feedback instantáneo a nivel de fonema. Corrige tu acento y entonación con visualización de ondas sonoras.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-slate-50 p-10 rounded-3xl border border-slate-100 hover:border-purple-100 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
              <div className="w-14 h-14 bg-white text-purple-600 rounded-2xl border border-slate-100 flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                <Layers size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Certificación MCER</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                Estructura académica rigurosa alineada con estándares internacionales para validar tus competencias.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group bg-slate-50 p-10 rounded-3xl border border-slate-100 hover:border-orange-100 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300">
              <div className="w-14 h-14 bg-white text-orange-600 rounded-2xl border border-slate-100 flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                <BarChart3 size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Métricas Avanzadas</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                Dashboard ejecutivo con KPIs de fluidez, expansión de vocabulario y consistencia gramatical.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group bg-slate-50 p-10 rounded-3xl border border-slate-100 hover:border-pink-100 hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-300">
              <div className="w-14 h-14 bg-white text-pink-600 rounded-2xl border border-slate-100 flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                <Globe size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Inteligencia Cultural</h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                Aprende más que palabras: domina las normas culturales y etiquetas de negocios globales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- COMPARISON / WHY US --- */}
      <section className="py-32 bg-slate-900 text-white overflow-hidden relative">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-20 relative z-10">
            <div className="flex-1 space-y-10">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">La ventaja competitiva que estabas buscando.</h2>
                <div className="space-y-6">
                    <div className="flex gap-6 items-start">
                        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 mt-1"><CheckCircle2 size={24} /></div>
                        <div>
                            <h4 className="text-xl font-bold mb-2">Flexibilidad Total</h4>
                            <p className="text-slate-400 leading-relaxed">Tu tutor personal está disponible 24/7. Sin citas previas, sin cancelaciones, a tu propio ritmo.</p>
                        </div>
                    </div>
                    <div className="flex gap-6 items-start">
                        <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 mt-1"><CheckCircle2 size={24} /></div>
                        <div>
                            <h4 className="text-xl font-bold mb-2">Entorno Seguro</h4>
                            <p className="text-slate-400 leading-relaxed">Elimina la ansiedad social. Practica, comete errores y mejora en un entorno privado y libre de juicios.</p>
                        </div>
                    </div>
                    <div className="flex gap-6 items-start">
                        <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400 mt-1"><CheckCircle2 size={24} /></div>
                        <div>
                            <h4 className="text-xl font-bold mb-2">ROI Maximizado</h4>
                            <p className="text-slate-400 leading-relaxed">Acceso ilimitado y resultados acelerados por una fracción del costo de la educación tradicional.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="flex-1 w-full">
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 border border-slate-700 shadow-2xl relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                         <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                         </div>
                         <div className="text-xs font-mono text-slate-500">SESSION_ID: 8492X</div>
                    </div>
                    
                    <div className="space-y-6 font-mono text-sm">
                        <div className="flex gap-4">
                            <span className="text-blue-400 font-bold">USER &gt;</span>
                            <span className="text-slate-300">I want to prepare for a pitch meeting.</span>
                        </div>
                        <div className="flex gap-4">
                             <span className="text-emerald-400 font-bold">AI &gt;</span>
                             <span className="text-slate-300">Understood. I will simulate the role of a Venture Capitalist. Let's start with your value proposition. Go ahead.</span>
                        </div>
                        <div className="flex gap-4 opacity-50">
                             <span className="text-blue-400 font-bold">USER &gt;</span>
                             <span className="text-slate-300">Okay, so our product helps companies...</span>
                        </div>
                        
                        <div className="mt-8 p-4 bg-slate-900/50 rounded-lg border border-slate-700">
                             <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Real-time Feedback</p>
                             <div className="flex items-center gap-2 text-green-400 text-xs">
                                <Sparkles size={12} /> <span>Grammar check: 100%</span>
                             </div>
                             <div className="flex items-center gap-2 text-yellow-400 text-xs mt-1">
                                <Sparkles size={12} /> <span>Tone: Persuasive</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section className="py-32 bg-white text-center px-6">
        <div className="max-w-4xl mx-auto space-y-10">
            <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">Tu carrera no tiene límites. <br/>Tu inglés tampoco debería.</h2>
            <p className="text-xl text-slate-500 font-light max-w-2xl mx-auto">Únete a la plataforma elegida por ejecutivos y profesionales de alto rendimiento.</p>
            
            <div className="flex flex-col items-center gap-4">
                <Link href="/dashboard">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-5 px-12 rounded-full transition-all shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:scale-105 active:scale-95">
                        Iniciar Prueba Gratuita
                    </button>
                </Link>
                <p className="text-sm text-slate-400 font-medium">14 días de prueba Premium. Sin compromiso.</p>
            </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-50 border-t border-slate-200 py-16 px-6 text-sm text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center text-white font-bold text-xs">O</div>
                    <span className="font-bold text-slate-900 text-lg">OnixLingo AI</span>
                </div>
                <p className="text-xs text-slate-400">Enterprise Learning Solutions</p>
            </div>
            
            <div className="flex gap-8 font-medium">
                <a href="#" className="hover:text-slate-900 transition-colors">Privacidad</a>
                <a href="#" className="hover:text-slate-900 transition-colors">Términos</a>
                <a href="#" className="hover:text-slate-900 transition-colors">Empresas</a>
                <a href="#" className="hover:text-slate-900 transition-colors">Soporte</a>
            </div>
            
            <p className="text-xs">© 2025 OnixuTechnology. Todos los derechos reservados.</p>
        </div>
      </footer>

    </div>
  );
}