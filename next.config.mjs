/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
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
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
  async redirects() {
    return [
      // Temples & Architectural Stonework
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
        source: "/collections/temples-architectural-stonework/temple-architecture",
        destination: "/collections/temples-architectural-stonework/mandirs-temples",
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
        destination: "/collections/temples-architectural-stonework/architectural-components",
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

      // Wall Art & Reliefs
      {
        source: "/collections/wall-art-reliefs/relief-panels",
        destination: "/collections/wall-art-reliefs/stone-relief-panels",
        permanent: true,
      },
      {
        source: "/collections/wall-art-reliefs/relief-panels/:category",
        destination: "/collections/wall-art-reliefs/stone-relief-panels/:category",
        permanent: true,
      },
      {
        source: "/collections/wall-art-reliefs/religious-spiritual-reliefs",
        destination: "/collections/wall-art-reliefs/religious-reliefs",
        permanent: true,
      },
      {
        source: "/collections/wall-art-reliefs/decorative-reliefs",
        destination: "/collections/wall-art-reliefs/stone-relief-panels",
        permanent: true,
      },
      {
        source: "/collections/wall-art-reliefs/indian-heritage-cultural-murals",
        destination: "/collections/wall-art-reliefs/stone-relief-panels",
        permanent: true,
      },
      {
        source: "/collections/wall-art-reliefs/custom-wall-art",
        destination: "/collections/wall-art-reliefs/stone-relief-panels",
        permanent: true,
      },

      // Fountains & Water Features
      {
        source: "/collections/fountains-water-features/garden-fountains",
        destination: "/collections/fountains-water-features/freestanding-fountains",
        permanent: true,
      },
      {
        source: "/collections/fountains-water-features/garden-fountains/:category",
        destination: "/collections/fountains-water-features/freestanding-fountains/:category",
        permanent: true,
      },
      {
        source: "/collections/fountains-water-features/classical-fountains",
        destination: "/collections/fountains-water-features/freestanding-fountains",
        permanent: true,
      },
      {
        source: "/collections/fountains-water-features/sculptural-fountains",
        destination: "/collections/fountains-water-features/freestanding-fountains",
        permanent: true,
      },
      {
        source: "/collections/fountains-water-features/architectural-water-features",
        destination: "/collections/fountains-water-features/wall-fountains",
        permanent: true,
      },

      // Decorative Stone Art
      {
        source: "/collections/decorative-stone-art/planters-tulsi-pots",
        destination: "/collections/decorative-stone-art/planters",
        permanent: true,
      },
      {
        source: "/collections/decorative-stone-art/planters-tulsi-pots/:category",
        destination: "/collections/decorative-stone-art/planters/:category",
        permanent: true,
      },
      {
        source: "/collections/decorative-stone-art/garden-outdoor-stone-art/benches-seating",
        destination: "/collections/decorative-stone-art",
        permanent: true,
      },
      {
        source: "/collections/decorative-stone-art/garden-outdoor-stone-art/garden-lanterns-lamps",
        destination: "/collections/decorative-stone-art",
        permanent: true,
      },
      {
        source: "/collections/decorative-stone-art/interior-stone-decor/carved-stone-vases",
        destination: "/collections/decorative-stone-art",
        permanent: true,
      },
      {
        source: "/collections/decorative-stone-art/interior-stone-decor/decorative-bowls",
        destination: "/collections/decorative-stone-art",
        permanent: true,
      },
      {
        source: "/collections/decorative-stone-art/interior-stone-decor/marble-urns",
        destination: "/collections/decorative-stone-art",
        permanent: true,
      },
      {
        source: "/collections/decorative-stone-art/small-sculptural-art/artisan-accessories",
        destination: "/collections/decorative-stone-art",
        permanent: true,
      },
      {
        source: "/collections/decorative-stone-art/small-sculptural-art/tabletop-statuettes",
        destination: "/collections/decorative-stone-art",
        permanent: true,
      },
      {
        source: "/collections/decorative-stone-art/garden-outdoor-stone-art",
        destination: "/collections/decorative-stone-art/planters",
        permanent: true,
      },
      {
        source: "/collections/decorative-stone-art/interior-stone-decor",
        destination: "/collections/decorative-stone-art/pedestals-stands",
        permanent: true,
      },
      {
        source: "/collections/decorative-stone-art/small-sculptural-art",
        destination: "/collections/decorative-stone-art/pedestals-stands",
        permanent: true,
      },
      {
        source: "/collections/decorative-stone-art/decorative-accents",
        destination: "/collections/decorative-stone-art/pedestals-stands",
        permanent: true,
      },

      // Custom & Bespoke Creations
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
        source: "/collections/custom-bespoke-creations/custom-portraits/ancestral-portrait-carvings",
        destination: "/collections/custom-bespoke-creations",
        permanent: true,
      },
      {
        source: "/collections/custom-bespoke-creations/custom-portraits/lifesize-memorial-busts",
        destination: "/collections/custom-bespoke-creations",
        permanent: true,
      },
      {
        source: "/collections/custom-bespoke-creations/custom-portraits",
        destination: "/collections/custom-bespoke-creations/custom-wall-art-reliefs",
        permanent: true,
      },
      {
        source: "/collections/custom-bespoke-creations/custom-portraits/:category",
        destination: "/collections/custom-bespoke-creations/custom-wall-art-reliefs/:category",
        permanent: true,
      },
      {
        source: "/collections/custom-bespoke-creations/custom-sculptures",
        destination: "/collections/custom-bespoke-creations/custom-architectural-stonework",
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
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' data: https://fonts.gstatic.com",
          "img-src 'self' data: blob: https://placehold.co https://images.unsplash.com https://*.hostingersite.com",
          "media-src 'self' data: blob: https://*.hostingersite.com",
          "connect-src 'self' https://placehold.co https://*.hostingersite.com https://generativelanguage.googleapis.com https://api.groq.com",
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
            value: "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
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
