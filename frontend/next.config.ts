import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ignorar errores de TypeScript durante el build
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;