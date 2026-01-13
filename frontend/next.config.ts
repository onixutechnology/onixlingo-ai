import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 👇 ESTO ES EL PROXY MÁGICO
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*', // Captura todo lo que empiece por /api/v1/
        // 👇 AQUÍ ESTABA EL ERROR: Debe apuntar a Render, no a localhost
        destination: 'https://onixlingo-bckend.onrender.com/api/v1/:path*', 
      },
    ]
  },
};

export default nextConfig;