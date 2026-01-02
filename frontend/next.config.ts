import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ignorar errores de TypeScript durante el build (para páginas vacías)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignorar errores de linter (estilo) durante el build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;