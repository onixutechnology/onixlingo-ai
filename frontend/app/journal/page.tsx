import React from 'react';
import LandingNavbar from '@/components/LandingNavbar';
import LandingFooter from '@/components/LandingFooter';
import Link from 'next/link';

export const metadata = {
  title: 'Journal & Artículos',
  description: 'Aprende sobre las últimas metodologías de aprendizaje de idiomas con tecnología cognitiva, estrategias de ajedrez corporativo y desarrollo profesional.',
};

export default function Journal() {
  const articles = [
    {
      id: 1,
      title: "Cómo los sistemas cognitivos están transformando el aprendizaje de idiomas en corporaciones",
      excerpt: "Descubre por qué las empresas líderes están abandonando los métodos tradicionales y apostando por tutores virtuales 24/7 para capacitar a sus equipos globales.",
      date: "23 Jun 2026",
      category: "Sistema Analítico Avanzado",
    },
    {
      id: 2,
      title: "5 Estrategias de Ajedrez que todo CEO debería conocer",
      excerpt: "El ajedrez no es solo un juego, es una simulación de guerra corporativa. Aprende a pensar tres jugadas por delante en tus próximas negociaciones.",
      date: "18 Jun 2026",
      category: "Ajedrez Táctico",
    },
    {
      id: 3,
      title: "El Mandarín como ventaja competitiva en 2027",
      excerpt: "Dominar el chino mandarín ya no es opcional si tu empresa busca expandirse a los mercados asiáticos. Conoce nuestra nueva metodología de asimilación rápida.",
      date: "10 Jun 2026",
      category: "Idiomas",
    },
    {
      id: 4,
      title: "Simulación de Alta Dirección: Entrenando con Avatares",
      excerpt: "Nuestros nuevos escenarios de simulación te permiten practicar presentaciones frente a una junta directiva hostil controlada por tecnología cognitiva.",
      date: "05 Jun 2026",
      category: "Desarrollo Ejecutivo",
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-black">
      <LandingNavbar />
      
      <main className="pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight uppercase mb-4">
              Journal OnixLingo
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light">
              Perspectivas, investigaciones y artículos sobre la intersección de la tecnología, la educación y el liderazgo estratégico.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {articles.map((article) => (
              <article key={article.id} className="bg-white border border-gray-200 p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest">{article.category}</span>
                  <span className="text-gray-400 text-xs font-medium">{article.date}</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3 leading-snug">
                  {article.title}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {article.excerpt}
                </p>
                <Link href={`#`} className="text-black font-bold uppercase tracking-widest text-sm hover:text-[#D4AF37] transition-colors flex items-center gap-2">
                  Leer Artículo
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button className="bg-white border border-gray-300 text-black hover:border-black hover:bg-gray-50 text-sm font-bold py-3 px-8 uppercase tracking-widest transition-colors">
              Cargar más artículos
            </button>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
