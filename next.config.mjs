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
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    cpus: 2,
  },
};

export default nextConfig;
