/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [],
    unoptimized: false,
  },
  // Nota: El limite de body por defecto en Next.js 16 es 10MB
  // Para archivos más grandes, usar streaming o servicios en la nube
  experimental: {
    serverActions: {
      bodySizeLimit: "200mb",
    },
  },
};

export default nextConfig;
