import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.steampowered.com',
      },
      {
        protocol: 'https',
        hostname: '**', // ✅ fonctionne pour https
      },
      {
        protocol: 'http',
        hostname: '**', // ✅ pour les URLs http comme spaceflightnow.com
      },
    ],
  },
};

export default nextConfig;
