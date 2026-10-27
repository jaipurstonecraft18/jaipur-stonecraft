export default function robots() {
  const disallowedPaths = [
    "/admin",
    "/admin/",
    "/api",
    "/api/",
    "/style-guide",
    "/search",
  ];

  return {
    rules: [
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "Claude-Web",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowedPaths,
      },
    ],
    sitemap: "https://jaipurstonecraft.com/sitemap.xml",
  };
}
