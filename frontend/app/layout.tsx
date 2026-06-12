import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// IMPORTAMOS EL PADDLE PROVIDER QUE ACABAS DE CREAR
import { PaddleProvider } from '@/components/providers/PaddleProvider';
import PwaInstallPrompt from '@/components/PwaInstallPrompt';
import EnergyRegenerator from '@/components/EnergyRegenerator';

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "OnixLingo | AI-Powered Enterprise Language Training",
    template: "%s | OnixLingo"
  },
  description: "Plataforma de aprendizaje de idiomas de alto rendimiento impulsada por Inteligencia Artificial para ejecutivos y profesionales de OnixLingo.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "OnixLingo",
  },
  formatDetection: {
    telephone: false,
  },
  keywords: ["idiomas", "IA", "ejecutivos", "B2B", "English training", "Ajedrez PvP", "OnixLingo"],
  authors: [{ name: "OnixLingo Engineering" }],
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://onixlingo.com",
    title: "OnixLingo | El futuro del aprendizaje corporativo",
    description: "Domina nuevos idiomas con simulaciones de negocios realistas y tecnología de punta.",
    siteName: "OnixLingo",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OnixLingo Platform Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OnixLingo | AI Language Tutor",
    description: "IA aplicada al entrenamiento de idiomas para equipos de alto desempeño.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

import Script from 'next/script';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1609709638618518"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="font-sans text-slate-900 antialiased">
        {/* ENVOLVEMOS LA APLICACIÓN CON EL PROVIDER */}
        <PaddleProvider>
          <EnergyRegenerator />
          {children}
        </PaddleProvider>
        <PwaInstallPrompt />
      </body>
    </html>
  );
}