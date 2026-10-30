import path from "path";
import fs from "fs/promises";
import fsSync from "fs";
import sharp from "sharp";

/**
 * Responsive breakpoint widths evaluated for Jaipur Stonecraft
 * Desktop Full-Width / Lightbox: 1920px
 * Tablet Landscape / Hero:       1280px
 * Desktop 3-Col Card / Grid:      960px
 * Tablet Portrait / Mobile Full:  640px
 * Mobile Card / Thumbnail:        400px
 */
export const RESPONSIVE_WIDTHS = [400, 640, 960, 1280, 1920];

/**
 * WebP Quality Profiles tailored for fine marble carving textures
 */
export const WEBP_PROFILES = {
  1920: { quality: 88, effort: 5, smartSubsample: true },
  1280: { quality: 86, effort: 5, smartSubsample: true },
  960:  { quality: 85, effort: 4, smartSubsample: true },
  640:  { quality: 84, effort: 4, smartSubsample: true },
  400:  { quality: 82, effort: 4, smartSubsample: false },
  card: { quality: 85, effort: 4, smartSubsample: true },
  display: { quality: 88, effort: 5, smartSubsample: true },
  thumb: { quality: 80, effort: 4, smartSubsample: false }
};

/**
 * Write file atomically using temporary file + rename to prevent partial reads
 */
async function writeFileAtomic(targetPath, buffer) {
  const dir = path.dirname(targetPath);
  await fs.mkdir(dir, { recursive: true });
  const tempPath = `${targetPath}.tmp.${process.pid}.${Date.now()}`;
  await fs.writeFile(tempPath, buffer);
  await fs.rename(tempPath, targetPath);
}

/**
 * Generate full suite of responsive and legacy WebP variants
 *
 * @param {Buffer|string} input - Image buffer or path to image file
 * @param {string} baseUploadDir - e.g. path.join(process.cwd(), "public", "uploads", "products")
 * @param {string} baseFilename - e.g. "blessing-ganesh-statue-1786961260375-3oy1r" (without extension)
 * @param {Object} options - { skipExisting: boolean, forceLegacy: boolean }
 * @returns {Promise<Object>} Metadata and generated paths
 */
export async function generateImageVariants(input, baseUploadDir, baseFilename, options = {}) {
  const { skipExisting = false } = options;

  let buffer;
  if (Buffer.isBuffer(input)) {
    buffer = input;
  } else if (typeof input === "string") {
    buffer = await fs.readFile(input);
  } else {
    throw new Error("Invalid input: expected Buffer or string file path");
  }

  // 1. Inspect image metadata & orientation
  const metadata = await sharp(buffer).metadata();
  if (!metadata || !metadata.width || !metadata.height) {
    throw new Error(`Invalid image metadata for ${baseFilename}`);
  }

  const origWidth = metadata.width;
  const origHeight = metadata.height;
  const webpFilename = `${baseFilename}.webp`;

  // Standard directories
  const subdirs = {
    w400: path.join(baseUploadDir, "w400"),
    w640: path.join(baseUploadDir, "w640"),
    w960: path.join(baseUploadDir, "w960"),
    w1280: path.join(baseUploadDir, "w1280"),
    w1920: path.join(baseUploadDir, "w1920"),
    display: path.join(baseUploadDir, "display"),
    card: path.join(baseUploadDir, "card"),
    thumb: path.join(baseUploadDir, "thumb")
  };

  const results = {
    baseFilename,
    originalWidth: origWidth,
    originalHeight: origHeight,
    variants: {}
  };

  const baseSharp = () => sharp(buffer).rotate();

  // 2. Generate 5 Responsive Width Variants
  for (const w of RESPONSIVE_WIDTHS) {
    const targetFile = path.join(subdirs[`w${w}`], webpFilename);

    if (skipExisting && fsSync.existsSync(targetFile)) {
      const stats = fsSync.statSync(targetFile);
      if (stats.size > 0) {
        results.variants[`w${w}`] = {
          path: targetFile,
          size: stats.size,
          skipped: true
        };
        continue;
      }
    }

    const profile = WEBP_PROFILES[w] || WEBP_PROFILES[960];
    const variantBuf = await baseSharp()
      .resize(w, null, {
        fit: "inside",
        withoutEnlargement: true // Strictly prevent upscaling
      })
      .webp(profile)
      .toBuffer();

    await writeFileAtomic(targetFile, variantBuf);

    results.variants[`w${w}`] = {
      path: targetFile,
      size: variantBuf.length,
      skipped: false
    };
  }

  // 3. Generate Legacy Backwards-Compatible Variants (display, card, thumb)
  // Display (up to 1920px)
  const displayFile = path.join(subdirs.display, webpFilename);
  if (!skipExisting || !fsSync.existsSync(displayFile)) {
    const dispBuf = await baseSharp()
      .resize(1920, 2400, { fit: "inside", withoutEnlargement: true })
      .webp(WEBP_PROFILES.display)
      .toBuffer();
    await writeFileAtomic(displayFile, dispBuf);
    results.variants.display = { path: displayFile, size: dispBuf.length };
  } else {
    results.variants.display = { path: displayFile, size: fsSync.statSync(displayFile).size, skipped: true };
  }

  // Card (up to 1080px)
  const cardFile = path.join(subdirs.card, webpFilename);
  if (!skipExisting || !fsSync.existsSync(cardFile)) {
    const cardBuf = await baseSharp()
      .resize(1080, 1350, { fit: "inside", withoutEnlargement: true })
      .webp(WEBP_PROFILES.card)
      .toBuffer();
    await writeFileAtomic(cardFile, cardBuf);
    results.variants.card = { path: cardFile, size: cardBuf.length };
  } else {
    results.variants.card = { path: cardFile, size: fsSync.statSync(cardFile).size, skipped: true };
  }

  // Thumb (400x400 cover)
  const thumbFile = path.join(subdirs.thumb, webpFilename);
  if (!skipExisting || !fsSync.existsSync(thumbFile)) {
    const thumbBuf = await baseSharp()
      .resize(400, 400, { fit: "cover", position: "center" })
      .webp(WEBP_PROFILES.thumb)
      .toBuffer();
    await writeFileAtomic(thumbFile, thumbBuf);
    results.variants.thumb = { path: thumbFile, size: thumbBuf.length };
  } else {
    results.variants.thumb = { path: thumbFile, size: fsSync.statSync(thumbFile).size, skipped: true };
  }

  return results;
}

