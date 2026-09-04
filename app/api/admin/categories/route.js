import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { query, getOne, execute, initDB } from "@/lib/db/client.js";
import { isAuthorizedAdminRequest } from "@/lib/admin/auth.js";
import { safeUnlinkObsoleteUpload } from "@/lib/admin/uploads.js";

function revalidateTaxonomyRoutes(slug) {
  try {
    revalidatePath("/");
    revalidatePath("/collections");
    revalidatePath("/collections/[collection]", "page");
    revalidatePath("/collections/[collection]/[subcategory]", "page");
    revalidatePath("/collections/[collection]/[subcategory]/[category]", "page");
    if (slug) {
      revalidatePath(`/collections/${slug}`);
    }
  } catch (e) {
    console.error("[Revalidate Taxonomy Error]:", e);
  }
}

// GET: Fetch categories, collections & subcategories with product usage counts & sort orders
export async function GET(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await initDB();
    const rawCategories = await query("SELECT * FROM categories ORDER BY sort_order ASC, name ASC");
    const rawCollections = await query("SELECT * FROM collections ORDER BY name ASC");
    const rawSubcategories = await query("SELECT * FROM subcategories ORDER BY sort_order ASC, name ASC");

    const categories = await Promise.all(rawCategories.map(async (c) => {
      const usage = await getOne("SELECT COUNT(*) as count FROM products WHERE parent_category = ? OR parent_category = ?", [c.slug, c.name]);
      return {
        ...c,
        parentCollection: c.parent_collection_slug,
        parentSubcategory: c.parent_subcategory_slug,
        imageSrc: c.image_src,
        imageAlt: c.image_alt,
        sortOrder: c.sort_order ?? 0,
        isActive: Boolean(c.is_active ?? 1),
        usedByProductsCount: usage ? usage.count : 0
      };
    }));

    const subcategories = await Promise.all(rawSubcategories.map(async (s) => {
      const catCount = await getOne("SELECT COUNT(*) as count FROM categories WHERE parent_subcategory_slug = ?", [s.slug]);
      const usage = await getOne("SELECT COUNT(*) as count FROM products WHERE parent_subcategory = ? OR parent_subcategory = ?", [s.slug, s.name]);
      return {
        ...s,
        parentCollection: s.parent_collection_slug,
        imageSrc: s.image_src,
        sortOrder: s.sort_order ?? 0,
        isActive: Boolean(s.is_active ?? 1),
        categoryCount: catCount ? catCount.count : 0,
        usedByProductsCount: usage ? usage.count : 0
      };
    }));

    const collections = await Promise.all(rawCollections.map(async (col) => {
      const usage = await getOne("SELECT COUNT(*) as count FROM products WHERE parent_collection = ? OR parent_collection = ?", [col.slug, col.name]);
      const catCount = await getOne("SELECT COUNT(*) as count FROM categories WHERE parent_collection_slug = ?", [col.slug]);
      const subCount = await getOne("SELECT COUNT(*) as count FROM subcategories WHERE parent_collection_slug = ?", [col.slug]);
      return {
        ...col,
        imageSrc: col.image_src,
        isActive: Boolean(col.is_active ?? 1),
        usedByProductsCount: usage ? usage.count : 0,
        categoryCount: catCount ? catCount.count : 0,
        subcategoryCount: subCount ? subCount.count : 0
      };
    }));

    return NextResponse.json({ categories, collections, subcategories });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to fetch categories" }, { status: 500 });
  }
}

// POST: Add or Update Category or Collection
export async function POST(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await initDB();
    const body = await request.json();
    const { type = "category", payload } = body;

    if (!payload || !payload.name) {
      return NextResponse.json({ error: "Valid name is required" }, { status: 400 });
    }

    const trimmedName = payload.name.trim();
    if (trimmedName.toLowerCase().includes("granite")) {
      return NextResponse.json({ error: "Granite is strictly excluded from Jaipur Stonecraft." }, { status: 400 });
    }

    const slug = payload.slug
      ? payload.slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
      : trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    if (type === "collection") {
      const existing = await getOne("SELECT * FROM collections WHERE slug = ?", [slug]);
      if (existing) {
        await execute(`
          UPDATE collections SET
            name = ?,
            description = ?,
            image_src = ?,
            is_active = ?
          WHERE slug = ?
        `, [
          trimmedName,
          payload.description || existing.description || "",
          payload.imageSrc || existing.image_src || "",
          payload.isActive !== undefined ? (payload.isActive ? 1 : 0) : 1,
          slug
        ]);

        return NextResponse.json({
          success: true,
          message: `Collection "${trimmedName}" updated successfully.`,
          collection: { slug, name: trimmedName }
        });
      } else {
        await execute(`
          INSERT INTO collections (id, slug, name, description, image_src, is_active)
          VALUES (?, ?, ?, ?, ?, 1)
        `, [
          slug,
          slug,
          trimmedName,
          payload.description || `${trimmedName} collection by Jaipur Stonecraft`,
          payload.imageSrc || "https://placehold.co/800x500/E8E4DF/1A1918?text=Collection+Cover"
        ]);

        // Auto-create default subcategory for new collection
        const defaultSubSlug = `${slug}-general`;
        const existingSub = await getOne("SELECT id FROM subcategories WHERE slug = ?", [defaultSubSlug]);
        if (!existingSub) {
          await execute(`
            INSERT INTO subcategories (id, slug, parent_collection_slug, name, description, is_active)
            VALUES (?, ?, ?, ?, ?, 1)
          `, [
            defaultSubSlug,
            defaultSubSlug,
            slug,
            `${trimmedName} Items`,
            `General ${trimmedName} items subcategory`
          ]);
        }

        return NextResponse.json({
          success: true,
          message: `Collection "${trimmedName}" created successfully.`,
          collection: { slug, name: trimmedName }
        });
      }
    }

    // Category Creation / Update
    const parentCollectionSlug = payload.parentCollection || "sculptures-statues";
    const parentSubcategorySlug = payload.parentSubcategory || `${parentCollectionSlug}-general`;

    const existing = await getOne("SELECT * FROM categories WHERE slug = ?", [slug]);
    if (existing) {
      await execute(`
        UPDATE categories SET
          name = ?,
          parent_collection_slug = ?,
          parent_subcategory_slug = ?,
          description = ?,
          image_src = ?,
          image_alt = ?,
          is_active = ?
        WHERE slug = ?
      `, [
        trimmedName,
        parentCollectionSlug,
        parentSubcategorySlug,
        payload.description || existing.description || "",
        payload.imageSrc || existing.image_src || "",
        payload.imageAlt || existing.image_alt || `${trimmedName} hand-carved stone art`,
        payload.isActive !== undefined ? (payload.isActive ? 1 : 0) : 1,
        slug
      ]);

      return NextResponse.json({
        success: true,
        message: `Category "${trimmedName}" updated successfully.`,
        category: { slug, name: trimmedName, parentCollection: parentCollectionSlug, parentSubcategory: parentSubcategorySlug }
      });
    } else {
      await execute(`
        INSERT INTO categories (id, slug, parent_collection_slug, parent_subcategory_slug, name, description, image_src, image_alt, featured, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 1)
      `, [
        slug,
        slug,
        parentCollectionSlug,
        parentSubcategorySlug,
        trimmedName,
        payload.description || `${trimmedName} hand-carved sculptures and architectural stone art.`,
        payload.imageSrc || "https://placehold.co/800x500/E8E4DF/1A1918?text=Category+Cover",
        payload.imageAlt || `${trimmedName} hand-carved stone art in Jaipur`
      ]);

      return NextResponse.json({
        success: true,
        message: `Category "${trimmedName}" created successfully and integrated into catalogue.`,
        category: { slug, name: trimmedName, parentCollection: parentCollectionSlug, parentSubcategory: parentSubcategorySlug }
      });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to save category" }, { status: 500 });
  }
}

// PUT: Cover image, status, or display order quick update
export async function PUT(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await initDB();
    const body = await request.json();

    // 1. Batch Reorder Handler
    if (body.action === "reorder") {
      const { type = "subcategory", items = [] } = body;
      if (type === "subcategory") {
        for (const item of items) {
          if (item.slug && typeof item.sortOrder === "number") {
            await execute("UPDATE subcategories SET sort_order = ? WHERE slug = ?", [item.sortOrder, item.slug]);
          }
        }
      } else if (type === "category") {
        for (const item of items) {
          if (item.slug && typeof item.sortOrder === "number") {
            await execute("UPDATE categories SET sort_order = ? WHERE slug = ?", [item.sortOrder, item.slug]);
          }
        }
      }
      revalidateTaxonomyRoutes();
      return NextResponse.json({ success: true, message: `Updated display order for ${items.length} ${type}(s).` });
    }

    // 2. Individual Item Update
    const { slug, imageSrc, imageAlt, isActive, sortOrder, type = "category" } = body;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    revalidateTaxonomyRoutes(slug);

    if (type === "collection") {
      if (imageSrc !== undefined) {
        const oldCol = await getOne("SELECT image_src FROM collections WHERE slug = ?", [slug]);
        await execute("UPDATE collections SET image_src = ? WHERE slug = ?", [imageSrc, slug]);
        if (oldCol?.image_src && oldCol.image_src !== imageSrc) {
          await safeUnlinkObsoleteUpload(oldCol.image_src);
        }
      }
      if (isActive !== undefined) {
        await execute("UPDATE collections SET is_active = ? WHERE slug = ?", [isActive ? 1 : 0, slug]);
      }
      return NextResponse.json({ success: true, message: `Updated collection "${slug}".` });
    } else if (type === "subcategory") {
      if (imageSrc !== undefined) {
        const oldSub = await getOne("SELECT image_src FROM subcategories WHERE slug = ?", [slug]);
        await execute("UPDATE subcategories SET image_src = ? WHERE slug = ?", [imageSrc, slug]);
        if (oldSub?.image_src && oldSub.image_src !== imageSrc) {
          await safeUnlinkObsoleteUpload(oldSub.image_src);
        }
      }
      if (isActive !== undefined) {
        await execute("UPDATE subcategories SET is_active = ? WHERE slug = ?", [isActive ? 1 : 0, slug]);
      }
      if (sortOrder !== undefined) {
        await execute("UPDATE subcategories SET sort_order = ? WHERE slug = ?", [Number(sortOrder), slug]);
      }
      return NextResponse.json({ success: true, message: `Updated subcategory "${slug}".` });
    } else {
      if (imageSrc !== undefined) {
        const oldCat = await getOne("SELECT image_src FROM categories WHERE slug = ?", [slug]);
        await execute("UPDATE categories SET image_src = ?, image_alt = ? WHERE slug = ?", [imageSrc, imageAlt || "", slug]);
        if (oldCat?.image_src && oldCat.image_src !== imageSrc) {
          await safeUnlinkObsoleteUpload(oldCat.image_src);
        }
      }
      if (isActive !== undefined) {
        await execute("UPDATE categories SET is_active = ? WHERE slug = ?", [isActive ? 1 : 0, slug]);
      }
      if (sortOrder !== undefined) {
        await execute("UPDATE categories SET sort_order = ? WHERE slug = ?", [Number(sortOrder), slug]);
      }
      return NextResponse.json({ success: true, message: `Updated category "${slug}".` });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to update" }, { status: 500 });
  }
}

// DELETE: Safe deletion or archiving
export async function DELETE(request) {
  if (!isAuthorizedAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await initDB();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const type = searchParams.get("type") || "category";

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    if (type === "collection") {
      // Check product and category references
      const prodUsage = await getOne("SELECT COUNT(*) as count FROM products WHERE parent_collection = ?", [slug]);
      const catUsage = await getOne("SELECT COUNT(*) as count FROM categories WHERE parent_collection_slug = ?", [slug]);
      const totalUsage = (prodUsage ? prodUsage.count : 0) + (catUsage ? catUsage.count : 0);

      if (totalUsage > 0) {
        // Soft archive instead of hard delete to preserve data integrity
        await execute("UPDATE collections SET is_active = 0 WHERE slug = ?", [slug]);
        return NextResponse.json({
          success: true,
          message: `Collection archived safely. (Referenced by ${catUsage?.count || 0} categories and ${prodUsage?.count || 0} products)`
        });
      }

      await execute("DELETE FROM collections WHERE slug = ?", [slug]);
      return NextResponse.json({ success: true, message: `Collection "${slug}" deleted permanently.` });
    } else if (type === "subcategory") {
      const prodUsage = await getOne("SELECT COUNT(*) as count FROM products WHERE parent_subcategory = ?", [slug]);
      const catUsage = await getOne("SELECT COUNT(*) as count FROM categories WHERE parent_subcategory_slug = ?", [slug]);
      const totalUsage = (prodUsage ? prodUsage.count : 0) + (catUsage ? catUsage.count : 0);

      if (totalUsage > 0) {
        await execute("UPDATE subcategories SET is_active = 0 WHERE slug = ?", [slug]);
        return NextResponse.json({
          success: true,
          message: `Subcategory archived safely. (Referenced by ${catUsage?.count || 0} categories and ${prodUsage?.count || 0} products)`
        });
      }

      await execute("DELETE FROM subcategories WHERE slug = ?", [slug]);
      return NextResponse.json({ success: true, message: `Subcategory "${slug}" deleted permanently.` });
    } else {
      const prodUsage = await getOne("SELECT COUNT(*) as count FROM products WHERE parent_category = ?", [slug]);
      if (prodUsage && prodUsage.count > 0) {
        await execute("UPDATE categories SET is_active = 0 WHERE slug = ?", [slug]);
        return NextResponse.json({
          success: true,
          message: `Category archived safely. (Referenced by ${prodUsage.count} product(s))`
        });
      }

      await execute("DELETE FROM categories WHERE slug = ?", [slug]);
      return NextResponse.json({ success: true, message: `Category "${slug}" deleted permanently.` });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to delete" }, { status: 500 });
  }
}
