import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true, // Opcional: para evitar problemas con optimización de imágenes
  },
};

export default nextConfig;
