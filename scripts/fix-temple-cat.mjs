import fs from "fs";
import path from "path";

const filePath = path.resolve("content/categories.js");
let content = fs.readFileSync(filePath, "utf-8");

content = content.replaceAll(
  'parentSubcategory: "custom-architectural-stonework"',
  (match, offset) => {
    // Check if the preceding text has temples-architectural-stonework
    const prev = content.slice(Math.max(0, offset - 200), offset);
    if (prev.includes('parentCollection: "temples-architectural-stonework"')) {
      return 'parentSubcategory: "architectural-components"';
    }
    return match;
  }
);

fs.writeFileSync(filePath, content, "utf-8");
console.log("Verified temples architectural components.");
