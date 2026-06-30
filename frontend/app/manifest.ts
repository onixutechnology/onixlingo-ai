import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'OnixLingo Enterprise Language Training',
    short_name: 'OnixLingo',
    description: 'Plataforma de aprendizaje de idiomas de alto rendimiento impulsada por el Sistema Analítico Avanzado para ejecutivos y profesionales de OnixLingo.',
    start_url: '/',
    display: 'standalone',
    background_color: '#edf7f2',
    theme_color: '#4f46e5',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      }
    ],
  };
}
