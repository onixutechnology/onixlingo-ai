import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 👇 ESTO ES EL PROXY MÁGICO
  async rewrites() {
    return [
      {
        source: '/api/:path*', // Cuando el frontend pida /api/...
        destination: 'http://127.0.0.1:8001/api/:path*', // ...Next.js lo envía al Backend
      },
    ]
  },
};

export default nextConfig;