import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    { pattern: /(bg|text|border|ring)-(blue|cyan|indigo|slate)-(50|100|500|600|700|800|900)/ },
    { pattern: /(bg|text|border)-(emerald|orange|purple|teal|rose)-(50|300|600)/ },
  ],
  theme: {
    extend: {
      colors: {
        // Nuestra paleta de marca amigable (Índigo/Violeta)
        brand: {
          50: '#eef2ff', // Fondo de página muy suave
          100: '#e0e7ff', // Fondo de tarjetas secundarias
          200: '#c7d2fe', // Bordes suaves
          500: '#6366f1', // Color principal vibrante
          600: '#4f46e5', // Color principal hover (más oscuro)
          700: '#4338ca', // Texto oscuro / títulos
        },
        // Acentos para gamificación (XP, Rachas)
        accent: {
          yellow: '#fbbf24', // Oro/Amarillo brillante
          orange: '#f97316', // Fuego/Naranja
        }
      },
      // Bordes extra redondeados estilo app moderna
      borderRadius: {
        '3xl': '2rem',
        '4xl': '2.5rem',
      },
      boxShadow: {
        // Sombras suaves y "gorditas" para botones
        'soft': '0 4px 6px -1px rgba(99, 102, 241, 0.1), 0 2px 4px -1px rgba(99, 102, 241, 0.06)',
        'button': '0 4px 0 0 #4338ca', // Sombra sólida estilo botón 3D (opcional)
      }
    },
  },
  plugins: [],
};
export default config;