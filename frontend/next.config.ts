import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        // 👇 ASEGURA QUE DIGA 8001 AQUÍ TAMBIÉN
        destination: 'http://127.0.0.1:8001/api/v1/:path*', 
      },
    ]
  },
};

export default nextConfig;