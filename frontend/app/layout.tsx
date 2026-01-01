import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // <--- ¡ESTA LÍNEA ES LA CLAVE MÁGICA!

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
      <body className={inter.className}>{children}</body>
    </html>
  );
}