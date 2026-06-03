import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

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

export default withSerwist(nextConfig);