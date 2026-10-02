export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/api/",
        "/style-guide",
        "/search",
      ],
    },
    sitemap: "https://jaipurstonecraft.com/sitemap.xml",
  };
}

