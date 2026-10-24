import fs from "fs";
import path from "path";

const filePath = path.resolve("content/categories.js");
let content = fs.readFileSync(filePath, "utf-8");

// Subcategory replacement map (only for non-sculptures collections)
const replacements = [
  // Wall Art
  { from: 'parentSubcategory: "religious-spiritual-reliefs"', to: 'parentSubcategory: "religious-reliefs"' },
  { from: 'parentSubcategory: "indian-heritage-cultural-murals"', to: 'parentSubcategory: "stone-relief-panels"' },
  { from: 'parentSubcategory: "decorative-reliefs"', to: 'parentSubcategory: "stone-relief-panels"' },
  { from: 'parentSubcategory: "relief-panels"', to: 'parentSubcategory: "stone-relief-panels"' },
  { from: 'parentSubcategory: "custom-wall-art"', to: 'parentSubcategory: "stone-relief-panels"' },

  // Temples & Architectural
  { from: 'parentSubcategory: "home-mandirs"', to: 'parentSubcategory: "mandirs-temples"' },
  { from: 'parentSubcategory: "temple-architecture"', to: 'parentSubcategory: "mandirs-temples"' },
  { from: 'parentSubcategory: "mandir-temple"', to: 'parentSubcategory: "mandirs-temples"' },
  { from: 'parentSubcategory: "architectural-elements"', to: 'parentSubcategory: "architectural-components"' },
  { from: 'parentSubcategory: "other-temple-stone-parts"', to: 'parentSubcategory: "architectural-components"' },
  { from: 'parentSubcategory: "custom-architectural-stonework",\n    // (if under temples)', to: 'parentSubcategory: "architectural-components"' },
  { from: 'parentSubcategory: "jali"', to: 'parentSubcategory: "jali-designs"' },

  // Fountains
  { from: 'parentSubcategory: "classical-fountains"', to: 'parentSubcategory: "freestanding-fountains"' },
  { from: 'parentSubcategory: "sculptural-fountains"', to: 'parentSubcategory: "freestanding-fountains"' },
  { from: 'parentSubcategory: "architectural-water-features"', to: 'parentSubcategory: "wall-fountains"' },
  { from: 'parentSubcategory: "garden-fountains"', to: 'parentSubcategory: "freestanding-fountains"' },

  // Decorative Stone Art
  { from: 'parentSubcategory: "planters-tulsi-pots"', to: 'parentSubcategory: "planters"' },
  { from: 'parentSubcategory: "garden-outdoor-stone-art"', to: 'parentSubcategory: "planters"' },
  { from: 'parentSubcategory: "interior-stone-decor"', to: 'parentSubcategory: "pedestals-stands"' },
  { from: 'parentSubcategory: "small-sculptural-art"', to: 'parentSubcategory: "pedestals-stands"' },
  { from: 'parentSubcategory: "decorative-accents"', to: 'parentSubcategory: "pedestals-stands"' },

  // Custom Bespoke
  { from: 'parentSubcategory: "custom-architectural-projects"', to: 'parentSubcategory: "custom-architectural-stonework"' },
  { from: 'parentSubcategory: "custom-sculptures"', to: 'parentSubcategory: "custom-architectural-stonework"' },
  { from: 'parentSubcategory: "custom-portraits"', to: 'parentSubcategory: "custom-wall-art-reliefs"' }
];

// Special overrides
// devotional-relief-panels should be religious-reliefs
// marble-tulsi-pots should be tulsi-pots

let replacedCount = 0;
for (const r of replacements) {
  const count = (content.match(new RegExp(r.from, "g")) || []).length;
  if (count > 0) {
    content = content.replaceAll(r.from, r.to);
    replacedCount += count;
  }
}

// Ensure specific categories have their exact subcategory
content = content.replace(
  /"devotional-relief-panels":\s*{[\s\S]*?parentSubcategory:\s*"[^"]+"/,
  (match) => match.replace(/parentSubcategory:\s*"[^"]+"/, 'parentSubcategory: "religious-reliefs"')
);

content = content.replace(
  /"marble-tulsi-pots":\s*{[\s\S]*?parentSubcategory:\s*"[^"]+"/,
  (match) => match.replace(/parentSubcategory:\s*"[^"]+"/, 'parentSubcategory: "tulsi-pots"')
);

content = content.replace(
  /"commemorative-reliefs":\s*{[\s\S]*?parentSubcategory:\s*"[^"]+"/,
  (match) => match.replace(/parentSubcategory:\s*"[^"]+"/, 'parentSubcategory: "custom-wall-art-reliefs"')
);

fs.writeFileSync(filePath, content, "utf-8");
console.log(`Updated content/categories.js with ${replacedCount} subcategory alignments.`);
