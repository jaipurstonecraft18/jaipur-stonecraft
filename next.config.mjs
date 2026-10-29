/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  allowedDevOrigins: [
    "192.168.29.37",
    "192.168.29.37:3000",
    "192.168.29.36",
    "192.168.29.36:3000",
    "10.78.18.49",
    "10.78.18.49:3000",
    "localhost:3000",
    "0.0.0.0:3000"
  ],
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 80, 82, 85, 88, 90, 92],
    deviceSizes: [390, 430, 640, 750, 828, 1080, 1200, 1440, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "jaipurstonecraft.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.jaipurstonecraft.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.hostingersite.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    cpus: 2,
  },
  async redirects() {
    return [
      // ==========================================
      // A. Temples & Architectural Stonework (4 main categories)
      // Active: mandirs-temples, jali-designs, pillars-columns, architectural-components
      // ==========================================
      {
        source: "/collections/temples-architectural-stonework/mandir-temple",
        destination: "/collections/temples-architectural-stonework/mandirs-temples",
        permanent: true,
      },
      {
        source: "/collections/temples-architectural-stonework/mandir-temple/:category",
        destination: "/collections/temples-architectural-stonework/mandirs-temples/:category",
        permanent: true,
      },
      {
        source: "/collections/temples-architectural-stonework/home-mandirs",
        destination: "/collections/temples-architectural-stonework/mandirs-temples",
        permanent: true,
      },
      {
        source: "/collections/temples-architectural-stonework/home-mandirs/:category",
        destination: "/collections/temples-architectural-stonework/mandirs-temples/:category",
        permanent: true,
      },
      {
        source: "/collections/temples-architectural-stonework/temple-architecture",
        destination: "/collections/temples-architectural-stonework/mandirs-temples",
        permanent: true,
      },
      {
        source: "/collections/temples-architectural-stonework/temple-architecture/:category",
        destination: "/collections/temples-architectural-stonework/mandirs-temples/:category",
        permanent: true,
      },
      {
        source: "/collections/temples-architectural-stonework/jali",
        destination: "/collections/temples-architectural-stonework/jali-designs",
        permanent: true,
      },
      {
        source: "/collections/temples-architectural-stonework/jali/:category",
        destination: "/collections/temples-architectural-stonework/jali-designs/:category",
        permanent: true,
      },
      {
        source: "/collections/temples-architectural-stonework/architectural-elements",
        destination: "/collections/temples-architectural-stonework/pillars-columns",
        permanent: true,
      },
      {
        source: "/collections/temples-architectural-stonework/architectural-elements/:category",
        destination: "/collections/temples-architectural-stonework/pillars-columns/:category",
        permanent: true,
      },
      {
        source: "/collections/temples-architectural-stonework/other-temple-stone-parts",
        destination: "/collections/temples-architectural-stonework/architectural-components",
        permanent: true,
      },
      {
        source: "/collections/temples-architectural-stonework/other-temple-stone-parts/:category",
        destination: "/collections/temples-architectural-stonework/architectural-components/:category",
        permanent: true,
      },
      {
        source: "/collections/temples-architectural-stonework/custom-architectural-stonework",
        destination: "/collections/temples-architectural-stonework/architectural-components",
        permanent: true,
      },

      // ==========================================
      // B. Wall Art & Reliefs (3 main categories)
      // Active: religious-spiritual-wall-art, heritage-decorative-wall-art, custom-wall-art-reliefs
      // ==========================================
      {
        source: "/collections/wall-art-reliefs/religious-reliefs",
        destination: "/collections/wall-art-reliefs/religious-spiritual-wall-art",
        permanent: true,
      },
      {
        source: "/collections/wall-art-reliefs/religious-reliefs/:category",
        destination: "/collections/wall-art-reliefs/religious-spiritual-wall-art/:category",
        permanent: true,
      },
      {
        source: "/collections/wall-art-reliefs/wall-murals",
        destination: "/collections/wall-art-reliefs/religious-spiritual-wall-art",
        permanent: true,
      },
      {
        source: "/collections/wall-art-reliefs/wall-murals/:category",
        destination: "/collections/wall-art-reliefs/religious-spiritual-wall-art/:category",
        permanent: true,
      },
      {
        source: "/collections/wall-art-reliefs/religious-spiritual-reliefs",
        destination: "/collections/wall-art-reliefs/religious-spiritual-wall-art",
        permanent: true,
      },
      {
        source: "/collections/wall-art-reliefs/religious-spiritual-reliefs/:category",
        destination: "/collections/wall-art-reliefs/religious-spiritual-wall-art/:category",
        permanent: true,
      },
      {
        source: "/collections/wall-art-reliefs/stone-relief-panels",
        destination: "/collections/wall-art-reliefs/heritage-decorative-wall-art",
        permanent: true,
      },
      {
        source: "/collections/wall-art-reliefs/stone-relief-panels/:category",
        destination: "/collections/wall-art-reliefs/heritage-decorative-wall-art/:category",
        permanent: true,
      },
      {
        source: "/collections/wall-art-reliefs/relief-panels",
        destination: "/collections/wall-art-reliefs/heritage-decorative-wall-art",
        permanent: true,
      },
      {
        source: "/collections/wall-art-reliefs/relief-panels/:category",
        destination: "/collections/wall-art-reliefs/heritage-decorative-wall-art/:category",
        permanent: true,
      },
      {
        source: "/collections/wall-art-reliefs/decorative-reliefs",
        destination: "/collections/wall-art-reliefs/heritage-decorative-wall-art",
        permanent: true,
      },
      {
        source: "/collections/wall-art-reliefs/decorative-reliefs/:category",
        destination: "/collections/wall-art-reliefs/heritage-decorative-wall-art/:category",
        permanent: true,
      },
      {
        source: "/collections/wall-art-reliefs/indian-heritage-cultural-murals",
        destination: "/collections/wall-art-reliefs/heritage-decorative-wall-art",
        permanent: true,
      },
      {
        source: "/collections/wall-art-reliefs/indian-heritage-cultural-murals/:category",
        destination: "/collections/wall-art-reliefs/heritage-decorative-wall-art/:category",
        permanent: true,
      },
      {
        source: "/collections/wall-art-reliefs/custom-wall-art",
        destination: "/collections/wall-art-reliefs/custom-wall-art-reliefs",
        permanent: true,
      },
      {
        source: "/collections/wall-art-reliefs/custom-wall-art/:category",
        destination: "/collections/wall-art-reliefs/custom-wall-art-reliefs/:category",
        permanent: true,
      },
      {
        source: "/collections/custom-bespoke-creations/custom-wall-art-reliefs",
        destination: "/collections/wall-art-reliefs/custom-wall-art-reliefs",
        permanent: true,
      },
      {
        source: "/collections/custom-bespoke-creations/custom-wall-art-reliefs/:category",
        destination: "/collections/wall-art-reliefs/custom-wall-art-reliefs/:category",
        permanent: true,
      },

      // ==========================================
      // C. Fountains & Water Features (3 main categories)
      // Active: tiered-classical-fountains, wall-freestanding-fountains, sculptural-water-features
      // ==========================================
      {
        source: "/collections/fountains-water-features/tiered-fountains",
        destination: "/collections/fountains-water-features/tiered-classical-fountains",
        permanent: true,
      },
      {
        source: "/collections/fountains-water-features/tiered-fountains/:category",
        destination: "/collections/fountains-water-features/tiered-classical-fountains/:category",
        permanent: true,
      },
      {
        source: "/collections/fountains-water-features/classical-fountains",
        destination: "/collections/fountains-water-features/tiered-classical-fountains",
        permanent: true,
      },
      {
        source: "/collections/fountains-water-features/classical-fountains/:category",
        destination: "/collections/fountains-water-features/tiered-classical-fountains/:category",
        permanent: true,
      },
      {
        source: "/collections/fountains-water-features/wall-fountains",
        destination: "/collections/fountains-water-features/wall-freestanding-fountains",
        permanent: true,
      },
      {
        source: "/collections/fountains-water-features/wall-fountains/:category",
        destination: "/collections/fountains-water-features/wall-freestanding-fountains/:category",
        permanent: true,
      },
      {
        source: "/collections/fountains-water-features/freestanding-fountains",
        destination: "/collections/fountains-water-features/wall-freestanding-fountains",
        permanent: true,
      },
      {
        source: "/collections/fountains-water-features/freestanding-fountains/:category",
        destination: "/collections/fountains-water-features/wall-freestanding-fountains/:category",
        permanent: true,
      },
      {
        source: "/collections/fountains-water-features/garden-fountains",
        destination: "/collections/fountains-water-features/wall-freestanding-fountains",
        permanent: true,
      },
      {
        source: "/collections/fountains-water-features/garden-fountains/:category",
        destination: "/collections/fountains-water-features/wall-freestanding-fountains/:category",
        permanent: true,
      },
      {
        source: "/collections/fountains-water-features/sculptural-fountains",
        destination: "/collections/fountains-water-features/sculptural-water-features",
        permanent: true,
      },
      {
        source: "/collections/fountains-water-features/sculptural-fountains/:category",
        destination: "/collections/fountains-water-features/sculptural-water-features/:category",
        permanent: true,
      },
      {
        source: "/collections/fountains-water-features/architectural-water-features",
        destination: "/collections/fountains-water-features/sculptural-water-features",
        permanent: true,
      },
      {
        source: "/collections/fountains-water-features/architectural-water-features/:category",
        destination: "/collections/fountains-water-features/sculptural-water-features/:category",
        permanent: true,
      },

      // ==========================================
      // D. Decorative Stone Art (3 main categories)
      // Active: planters-tulsi-pots, pedestals-stands, decorative-garden-stone-art
      // ==========================================
      {
        source: "/collections/decorative-stone-art/planters",
        destination: "/collections/decorative-stone-art/planters-tulsi-pots",
        permanent: true,
      },
      {
        source: "/collections/decorative-stone-art/planters/:category",
        destination: "/collections/decorative-stone-art/planters-tulsi-pots/:category",
        permanent: true,
      },
      {
        source: "/collections/decorative-stone-art/tulsi-pots",
        destination: "/collections/decorative-stone-art/planters-tulsi-pots",
        permanent: true,
      },
      {
        source: "/collections/decorative-stone-art/tulsi-pots/:category",
        destination: "/collections/decorative-stone-art/planters-tulsi-pots/:category",
        permanent: true,
      },
      {
        source: "/collections/decorative-stone-art/pedestals-plinths-stands",
        destination: "/collections/decorative-stone-art/pedestals-stands",
        permanent: true,
      },
      {
        source: "/collections/decorative-stone-art/garden-outdoor-stone-art",
        destination: "/collections/decorative-stone-art/decorative-garden-stone-art",
        permanent: true,
      },
      {
        source: "/collections/decorative-stone-art/garden-outdoor-stone-art/:category",
        destination: "/collections/decorative-stone-art/decorative-garden-stone-art/:category",
        permanent: true,
      },
      {
        source: "/collections/decorative-stone-art/interior-stone-decor",
        destination: "/collections/decorative-stone-art/decorative-garden-stone-art",
        permanent: true,
      },
      {
        source: "/collections/decorative-stone-art/interior-stone-decor/:category",
        destination: "/collections/decorative-stone-art/decorative-garden-stone-art/:category",
        permanent: true,
      },
      {
        source: "/collections/decorative-stone-art/small-sculptural-art",
        destination: "/collections/decorative-stone-art/decorative-garden-stone-art",
        permanent: true,
      },
      {
        source: "/collections/decorative-stone-art/small-sculptural-art/:category",
        destination: "/collections/decorative-stone-art/decorative-garden-stone-art/:category",
        permanent: true,
      },
      {
        source: "/collections/decorative-stone-art/decorative-accents",
        destination: "/collections/decorative-stone-art/decorative-garden-stone-art",
        permanent: true,
      },
      {
        source: "/collections/decorative-stone-art/decorative-accents/:category",
        destination: "/collections/decorative-stone-art/decorative-garden-stone-art/:category",
        permanent: true,
      },

      // ==========================================
      // E. Custom & Bespoke Creations (2 main categories)
      // Active: custom-architectural-stonework, custom-sculptures-portraits-reliefs
      // ==========================================
      {
        source: "/collections/custom-bespoke-creations/custom-architectural-projects",
        destination: "/collections/custom-bespoke-creations/custom-architectural-stonework",
        permanent: true,
      },
      {
        source: "/collections/custom-bespoke-creations/custom-architectural-projects/:category",
        destination: "/collections/custom-bespoke-creations/custom-architectural-stonework/:category",
        permanent: true,
      },
      {
        source: "/collections/custom-bespoke-creations/custom-sculptures",
        destination: "/collections/custom-bespoke-creations/custom-sculptures-portraits-reliefs",
        permanent: true,
      },
      {
        source: "/collections/custom-bespoke-creations/custom-sculptures/:category",
        destination: "/collections/custom-bespoke-creations/custom-sculptures-portraits-reliefs/:category",
        permanent: true,
      },
      {
        source: "/collections/custom-bespoke-creations/custom-portraits",
        destination: "/collections/custom-bespoke-creations/custom-sculptures-portraits-reliefs",
        permanent: true,
      },
      {
        source: "/collections/custom-bespoke-creations/custom-portraits/:category",
        destination: "/collections/custom-bespoke-creations/custom-sculptures-portraits-reliefs/:category",
        permanent: true,
      },
    ];
  },
  async headers() {
    const isProd = process.env.NODE_ENV === "production";

    const securityHeaders = [
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      {
        key: "X-Frame-Options",
        value: "SAMEORIGIN",
      },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
      },
      {
        key: "X-DNS-Prefetch-Control",
        value: "on",
      },
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://*.googletagmanager.com",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' data: https://fonts.gstatic.com",
          "img-src 'self' data: blob: https://placehold.co https://images.unsplash.com https://jaipurstonecraft.com https://*.jaipurstonecraft.com https://*.hostingersite.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
          "media-src 'self' data: blob: https://jaipurstonecraft.com https://*.jaipurstonecraft.com https://*.hostingersite.com",
          "connect-src 'self' https://placehold.co https://jaipurstonecraft.com https://*.jaipurstonecraft.com https://*.hostingersite.com https://generativelanguage.googleapis.com https://api.groq.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
          "frame-ancestors 'self'",
          "form-action 'self'",
          "base-uri 'self'",
        ].join("; "),
      },
      ...(isProd
        ? [
            {
              key: "Strict-Transport-Security",
              value: "max-age=31536000; includeSubDomains; preload",
            },
          ]
        : []),
    ];

    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },

      {
        source: "/((?!api|_next/static|_next/image|favicon.ico|images|uploads|videos).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-cache, must-revalidate",
          },
          {
            key: "CDN-Cache-Control",
            value: "no-store",
          },
          {
            key: "Surrogate-Control",
            value: "no-store",
          },
        ],
      },
      {
        source: "/uploads/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/videos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
