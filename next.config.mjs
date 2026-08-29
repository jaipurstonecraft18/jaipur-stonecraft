/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "192.168.29.37",
    "192.168.29.37:3000",
    "192.168.29.36",
    "192.168.29.36:3000",
    "localhost:3000",
    "0.0.0.0:3000"
  ],
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85, 88, 90],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.backblazeb2.com",
        port: "",
        pathname: "/**",
      },
    ],
  experimental: {
    cpus: 2,
  },
};

export default nextConfig;
