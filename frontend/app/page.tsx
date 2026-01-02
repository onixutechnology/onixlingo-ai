'use client';

import Link from 'next/link';
import { Bot, Gamepad2, Mic, Zap, ArrowRight, CheckCircle, Globe, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-600">
      
      {/* --- NAVBAR --- */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-[0_3px_0_0_#1e40af]">
              O
            </div>
            <span className="font-extrabold text-slate-700 tracking-wide text-xl">ONIXLINGO</span>
          </div>
          
          <div className="flex gap-4">
            <Link href="/auth/login" className="hidden md:block font-bold text-slate-400 hover:text-blue-500 transition-colors uppercase text-sm tracking-widest py-3">
              Ingresar
            </Link>
            <Link href="/dashboard">
              <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-6 rounded-xl shadow-[0_4px_0_0_#1e40af] active:shadow-none active:translate-y-1 transition-all">
                Empezar
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <main className="max-w-6xl mx-auto px-6 pt-16 pb-24 text-center lg:text-left flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        
        {/* Texto Hero */}
        <div className="flex-1 space-y-8">
          <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-800 leading-tight">
            La forma más <span className="text-blue-500">inteligente</span> de aprender idiomas.
          </h1>
          <p className="text-xl text-slate-400 font-medium max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Conversa con avatares de IA, completa misiones gamificadas y domina el inglés sin aburrirte.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <button className="w-full bg-green-500 hover:bg-green-400 text-white text-lg font-bold py-4 px-10 rounded-2xl shadow-[0_5px_0_0_#15803d] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-3">
                ¡COMENZAR AHORA! <ArrowRight size={24} />
              </button>
            </Link>
            <Link href="/avatar" className="w-full sm:w-auto">
              <button className="w-full bg-white border-2 border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-500 text-lg font-bold py-4 px-10 rounded-2xl shadow-[0_4px_0_0_#e2e8f0] active:shadow-none active:translate-y-1 transition-all">
                PROBAR DEMO 3D
              </button>
            </Link>
          </div>
        </div>

        {/* Imagen / Decoración Hero */}
        <div className="flex-1 relative animate-in fade-in zoom-in duration-1000">
           {/* Círculo decorativo de fondo */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-100 rounded-full opacity-50 blur-3xl -z-10"></div>
           
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-3xl shadow-xl border-2 border-slate-100 flex flex-col items-center gap-2 transform translate-y-8">
                  <Bot size={48} className="text-purple-500" />
                  <span className="font-bold text-slate-700">Tutor IA</span>
                  <span className="text-xs text-slate-400 font-bold bg-slate-100 px-2 py-1 rounded-full">24/7 Activo</span>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-xl border-2 border-slate-100 flex flex-col items-center gap-2">
                  <Gamepad2 size={48} className="text-green-500" />
                  <span className="font-bold text-slate-700">Gamificado</span>
                  <span className="text-xs text-slate-400 font-bold bg-slate-100 px-2 py-1 rounded-full">+XP Points</span>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-xl border-2 border-slate-100 flex flex-col items-center gap-2 transform -translate-y-4">
                  <Globe size={48} className="text-blue-500" />
                  <span className="font-bold text-slate-700">Inmersivo</span>
                  <span className="text-xs text-slate-400 font-bold bg-slate-100 px-2 py-1 rounded-full">Real-time</span>
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-xl border-2 border-slate-100 flex flex-col items-center gap-2 transform translate-y-4">
                  <Star size={48} className="text-orange-400" />
                  <span className="font-bold text-slate-700">Progreso</span>
                  <span className="text-xs text-slate-400 font-bold bg-slate-100 px-2 py-1 rounded-full">Nivel A1-C2</span>
              </div>
           </div>
        </div>
      </main>

      {/* --- SECCIÓN: LO QUE INCLUYE (SQUARES) --- */}
      <section className="bg-slate-50 py-24 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">
              Todo lo que necesitas para ser <span className="text-blue-500">fluido</span>
            </h2>
            <p className="text-slate-400 font-medium text-lg">Nuestra tecnología combina lo mejor de la educación tradicional con la Inteligencia Artificial.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* CARD 1 */}
            <div className="bg-white p-8 rounded-3xl border-2 border-slate-100 shadow-[0_8px_0_0_#e2e8f0] hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Bot size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-3">Avatar Inteligente</h3>
              <p className="text-slate-400 leading-relaxed font-medium">
                Practica conversaciones reales con un avatar 3D impulsado por Gemini AI que corrige tu pronunciación.
              </p>
            </div>

            {/* CARD 2 */}
            <div className="bg-white p-8 rounded-3xl border-2 border-slate-100 shadow-[0_8px_0_0_#e2e8f0] hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                <Globe size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-3">Ruta Estructurada</h3>
              <p className="text-slate-400 leading-relaxed font-medium">
                Un mapa de aprendizaje paso a paso, desde lo básico (A1) hasta conversaciones complejas (C1).
              </p>
            </div>

            {/* CARD 3 */}
            <div className="bg-white p-8 rounded-3xl border-2 border-slate-100 shadow-[0_8px_0_0_#e2e8f0] hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center mb-6">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-3">Gamificación</h3>
              <p className="text-slate-400 leading-relaxed font-medium">
                Gana experiencia (XP), mantén tu racha de días y compite contigo mismo para no perder el hábito.
              </p>
            </div>

            {/* CARD 4 */}
            <div className="bg-white p-8 rounded-3xl border-2 border-slate-100 shadow-[0_8px_0_0_#e2e8f0] hover:-translate-y-2 transition-transform duration-300">
              <div className="w-14 h-14 bg-blue-100 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <Mic size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-3">Reconocimiento de Voz</h3>
              <p className="text-slate-400 leading-relaxed font-medium">
                No solo escribas, ¡habla! El sistema escucha tu voz y valida si tu respuesta fue correcta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER SIMPLE --- */}
      <footer className="py-12 bg-white text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-slate-200 rounded text-slate-500 flex items-center justify-center font-bold text-xs">O</div>
            <span className="font-bold text-slate-300 tracking-widest">ONIXLINGO</span>
        </div>
        <p className="text-slate-400 text-sm font-medium">© 2025 OnixuTechnology. Todos los derechos reservados.</p>
        <div className="flex justify-center gap-6 mt-6">
            <Link href="/dashboard" className="text-slate-400 hover:text-blue-500 font-bold text-sm">Dashboard</Link>
            <Link href="#" className="text-slate-400 hover:text-blue-500 font-bold text-sm">Términos</Link>
            <Link href="#" className="text-slate-400 hover:text-blue-500 font-bold text-sm">Privacidad</Link>
        </div>
      </footer>

    </div>
  );
}