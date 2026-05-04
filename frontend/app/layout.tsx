import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// IMPORTAMOS EL PADDLE PROVIDER QUE ACABAS DE CREAR
import { PaddleProvider } from '@/components/providers/PaddleProvider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OnixLingo Tutor",
  description: "Tu tutor de idiomas con IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* ENVOLVEMOS LA APLICACIÓN CON EL PROVIDER */}
        <PaddleProvider>
          {children}
        </PaddleProvider>
      </body>
    </html>
  );
}