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
      fontFamily: {
        sans: ['"Times New Roman"', 'Times', 'serif'],
      },
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
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-right': {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'fade-in-down': 'fade-in-down 0.8s ease-out forwards',
        'fade-in-right': 'fade-in-right 0.8s ease-out forwards',
        'scale-in': 'scale-in 0.5s ease-out forwards',
      }
    },
  },
  plugins: [],
};
export default config;