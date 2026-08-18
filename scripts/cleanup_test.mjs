import fs from "fs";
import path from "path";

const dirs = ["raw", "display", "card", "thumb"];
dirs.forEach((dir) => {
  const p = path.join(process.cwd(), "public", "uploads", "products", dir);
  if (fs.existsSync(p)) {
    const files = fs.readdirSync(p);
    files.forEach((f) => {
      if (f.includes("makrana-white-shiva-statue") || f.includes("makrana-ganesh-murti")) {
        fs.unlinkSync(path.join(p, f));
      }
    });
  }
});

const testDir = path.join(process.cwd(), "scripts", "test_assets");
if (fs.existsSync(testDir)) {
  fs.rmSync(testDir, { recursive: true, force: true });
}

console.log("Cleanup completed.");
