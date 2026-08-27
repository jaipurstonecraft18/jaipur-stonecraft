import { query, getOne } from "./client.js";
import { projectsData } from "@/content/projects.js";

/**
 * Get all published projects from database with safe fallback to content/projects.js
 */
export async function getAllProjectsFromDB(typeFilter = null) {
  try {
    let rows;
    if (typeFilter && typeFilter !== "All") {
      rows = await query("SELECT * FROM projects WHERE status = 'published' AND type = ? ORDER BY sort_order ASC, created_at DESC", [typeFilter]);
    } else {
      rows = await query("SELECT * FROM projects WHERE status = 'published' ORDER BY sort_order ASC, created_at DESC");
    }

    if (rows && rows.length > 0) {
      return rows.map((r) => ({
        ...r,
        gallery: JSON.parse(r.gallery || "[]"),
        productsUsed: JSON.parse(r.products_used || "[]")
      }));
    }
  } catch (e) {
    console.error("[DB Projects Query Error]:", e);
  }

  // Safe fallback to static projectsData
  const fallbackList = Object.values(projectsData);
  if (typeFilter && typeFilter !== "All") {
    return fallbackList.filter((p) => p.type === typeFilter);
  }
  return fallbackList;
}

/**
 * Get single project by slug from database with safe fallback
 */
export async function getProjectBySlugFromDB(slug) {
  try {
    const row = await getOne("SELECT * FROM projects WHERE slug = ? OR id = ?", [slug, slug]);
    if (row) {
      return {
        ...row,
        gallery: JSON.parse(row.gallery || "[]"),
        productsUsed: JSON.parse(row.products_used || "[]")
      };
    }
  } catch (e) {
    console.error("[DB Single Project Query Error]:", e);
  }

  return projectsData[slug] || null;
}
