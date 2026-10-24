import fs from "fs";
import path from "path";
import { categoriesData } from "../content/categories-data.js";
import { collectionsData } from "../content/collections.js";

const DIRS_TO_SCAN = ["components", "app", "content", "lib"];
const EXTENSIONS = [".js", ".jsx", ".ts", ".tsx", ".json", ".mjs"];

const allKnownSubcategories = new Set();
const allKnownCategories = new Set();
const allKnownCollections = new Set(Object.keys(collectionsData));

Object.values(collectionsData).forEach((col) => {
  (col.subcategories || []).forEach((sub) => {
    allKnownSubcategories.add(`${col.slug}/${sub.slug}`);
  });
});

Object.values(categoriesData).forEach((cat) => {
  allKnownCategories.add(`${cat.parentCollection}/${cat.parentSubcategory}/${cat.slug}`);
});

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === "node_modules" || file === ".next" || file === ".git") continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      if (EXTENSIONS.includes(path.extname(fullPath))) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

const urlRegex = /["'`](?:\/collections\/[a-zA-Z0-9_\-\/]+)["'`]/g;

const findings = [];

for (const dir of DIRS_TO_SCAN) {
  const files = walk(dir);
  for (const file of files) {
    // skip audit scripts and test files
    if (file.includes("test") || file.includes("verify") || file.includes("audit") || file.includes("seeders")) continue;
    const content = fs.readFileSync(file, "utf8");
    let match;
    while ((match = urlRegex.exec(content)) !== null) {
      const rawUrl = match[0].slice(1, -1);
      // ignore image assets like /images/collections/...
      if (rawUrl.startsWith("/images/")) continue;
      if (rawUrl.startsWith("/uploads/")) continue;
      
      const parts = rawUrl.replace(/^\/collections\/?/, "").split("/").filter(Boolean);
      
      findings.push({
        file: path.relative(process.cwd(), file),
        url: rawUrl,
        segments: parts.length,
        parts
      });
    }
  }
}

console.log(`Found ${findings.length} total static /collections/ link mentions.`);

const suspicious = findings.filter((f) => {
  if (f.segments === 0) return false; // /collections
  if (f.segments === 1) {
    // should be a collection
    return !allKnownCollections.has(f.parts[0]);
  }
  if (f.segments === 2) {
    // can be a subcategory (valid) OR an old 2-segment category (suspicious!)
    const isSub = allKnownSubcategories.has(`${f.parts[0]}/${f.parts[1]}`);
    if (isSub) return false;
    return true; // Not a known subcategory!
  }
  if (f.segments === 3) {
    // should be collection/subcategory/category
    const isCat = allKnownCategories.has(`${f.parts[0]}/${f.parts[1]}/${f.parts[2]}`);
    return !isCat;
  }
  return true;
});

console.log(`\nSuspicious or Outdated /collections/ links found: ${suspicious.length}`);
suspicious.forEach((s) => {
  console.log(`[${s.file}] -> ${s.url} (segments: ${s.segments})`);
});
