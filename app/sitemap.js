import { collectionsData } from "@/content/collections";
import { categoriesData } from "@/content/categories";
import { designsData } from "@/content/designs";
import { marbleHubData } from "@/content/marble";
import { projectsData } from "@/content/projects";

export default function sitemap() {
  const baseUrl = "https://jaipurstonecraft.com";

  // 1. Static Routes
  const staticRoutes = [
    "",
    "/collections",
    "/marble",
    "/projects",
    "/craftsmanship",
    "/our-story",
    "/export",
    "/custom-projects",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  // 2. Marble Hub Sub-Pages
  const marbleRoutes = Object.keys(marbleHubData).map((slug) => ({
    url: `${baseUrl}/marble/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // 3. Dynamic Level 1 Collections Routes
  const collectionRoutes = Object.values(collectionsData).map((col) => ({
    url: `${baseUrl}/collections/${col.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // 4. Dynamic Level 2 Subcategory Routes
  const subcategoryRoutes = [];
  Object.values(collectionsData).forEach((col) => {
    col.subcategories.forEach((sub) => {
      subcategoryRoutes.push({
        url: `${baseUrl}/collections/${col.slug}/${sub.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    });
  });

  // 5. Dynamic Level 3 Category Landing Routes
  const categoryRoutes = Object.values(categoriesData).map((cat) => ({
    url: `${baseUrl}/collections/${cat.parentCollection}/${cat.parentSubcategory}/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // 6. Dynamic Level 4 Design Detail Routes
  const designRoutes = Object.values(designsData).map((design) => ({
    url: `${baseUrl}/designs/${design.parentCategory}/${design.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // 7. Dynamic Projects Routes
  const projectRoutes = Object.keys(projectsData).map((slug) => ({
    url: `${baseUrl}/projects/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...marbleRoutes,
    ...collectionRoutes,
    ...subcategoryRoutes,
    ...categoryRoutes,
    ...designRoutes,
    ...projectRoutes,
  ];
}
