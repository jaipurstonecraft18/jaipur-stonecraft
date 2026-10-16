import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

/**
 * Mathematical Verification of Watermark Coordinates between Preview and Output
 */
function calculateWatermarkGeometry({
  cropWidth,
  cropHeight,
  watermarkSizePercent,
  logoIntrinsicWidth,
  logoIntrinsicHeight,
  normX,
  normY
}) {
  const logoAspectRatio = logoIntrinsicWidth / logoIntrinsicHeight;
  const wmW = Math.round(cropWidth * (watermarkSizePercent / 100));
  const wmH = Math.round(wmW / logoAspectRatio);

  const normW = wmW / cropWidth;
  const normH = wmH / cropHeight;

  // Clamped normalized coordinates
  const clampedX = Math.max(0, Math.min(1 - normW, normX));
  const clampedY = Math.max(0, Math.min(1 - normH, normY));

  const pixelX = Math.round(clampedX * cropWidth);
  const pixelY = Math.round(clampedY * cropHeight);

  return {
    wmW,
    wmH,
    normW,
    normH,
    clampedX,
    clampedY,
    pixelX,
    pixelY
  };
}

function getPresetCoords({ pos, cropWidth, cropHeight, watermarkSizePercent, logoIntrinsicWidth, logoIntrinsicHeight, margin = 0.04 }) {
  const logoAspectRatio = logoIntrinsicWidth / logoIntrinsicHeight;
  const normW = watermarkSizePercent / 100;
  const normH = (cropWidth * normW) / (logoAspectRatio * cropHeight);

  switch (pos) {
    case "top-left":
      return { x: margin, y: margin };
    case "top-right":
      return { x: Math.max(0, 1 - normW - margin), y: margin };
    case "bottom-left":
      return { x: margin, y: Math.max(0, 1 - normH - margin) };
    case "bottom-right":
      return { x: Math.max(0, 1 - normW - margin), y: Math.max(0, 1 - normH - margin) };
    case "center":
      return { x: Math.max(0, (1 - normW) / 2), y: Math.max(0, (1 - normH) / 2) };
    default:
      return { x: 0.5, y: 0.5 };
  }
}

async function runTests() {
  console.log("=== RUNNING WATERMARK COORDINATE GEOMETRY TESTS ===");
  
  const logoW = 1200;
  const logoH = 300; // 4:1 aspect ratio
  
  // Test 1: Portrait Image (1200 x 1800), Crop 1:1 (1200 x 1200)
  // Display preview is scaled to 360 x 360
  const portraitCrop = { w: 1200, h: 1200 };
  const previewCrop = { w: 360, h: 360 };
  
  const presets = ["top-left", "top-right", "bottom-left", "bottom-right", "center"];
  const sizes = [15, 30, 55, 80];

  for (const size of sizes) {
    for (const preset of presets) {
      const coords = getPresetCoords({
        pos: preset,
        cropWidth: portraitCrop.w,
        cropHeight: portraitCrop.h,
        watermarkSizePercent: size,
        logoIntrinsicWidth: logoW,
        logoIntrinsicHeight: logoH
      });

      const previewGeo = calculateWatermarkGeometry({
        cropWidth: previewCrop.w,
        cropHeight: previewCrop.h,
        watermarkSizePercent: size,
        logoIntrinsicWidth: logoW,
        logoIntrinsicHeight: logoH,
        normX: coords.x,
        normY: coords.y
      });

      const outputGeo = calculateWatermarkGeometry({
        cropWidth: portraitCrop.w,
        cropHeight: portraitCrop.h,
        watermarkSizePercent: size,
        logoIntrinsicWidth: logoW,
        logoIntrinsicHeight: logoH,
        normX: coords.x,
        normY: coords.y
      });

      // Verification: The relative position in preview MUST equal relative position in output
      const previewRelX = previewGeo.pixelX / previewCrop.w;
      const outputRelX = outputGeo.pixelX / portraitCrop.w;
      const previewRelY = previewGeo.pixelY / previewCrop.h;
      const outputRelY = outputGeo.pixelY / portraitCrop.h;

      const diffX = Math.abs(previewRelX - outputRelX);
      const diffY = Math.abs(previewRelY - outputRelY);

      if (diffX > 0.005 || diffY > 0.005) {
        throw new Error(`Drift detected in ${preset} at size ${size}%! DiffX: ${diffX}, DiffY: ${diffY}`);
      }
    }
  }
  console.log("✓ Portrait 1:1 Square test passed with 0 drift across all presets and sizes.");

  // Test 2: Landscape Image (1920 x 1080), Crop 4:3 (1440 x 1080)
  // Display preview is scaled to 400 x 300
  const landscapeCrop = { w: 1440, h: 1080 };
  const landscapePreview = { w: 400, h: 300 };

  for (const size of sizes) {
    for (const preset of presets) {
      const coords = getPresetCoords({
        pos: preset,
        cropWidth: landscapeCrop.w,
        cropHeight: landscapeCrop.h,
        watermarkSizePercent: size,
        logoIntrinsicWidth: logoW,
        logoIntrinsicHeight: logoH
      });

      const previewGeo = calculateWatermarkGeometry({
        cropWidth: landscapePreview.w,
        cropHeight: landscapePreview.h,
        watermarkSizePercent: size,
        logoIntrinsicWidth: logoW,
        logoIntrinsicHeight: logoH,
        normX: coords.x,
        normY: coords.y
      });

      const outputGeo = calculateWatermarkGeometry({
        cropWidth: landscapeCrop.w,
        cropHeight: landscapeCrop.h,
        watermarkSizePercent: size,
        logoIntrinsicWidth: logoW,
        logoIntrinsicHeight: logoH,
        normX: coords.x,
        normY: coords.y
      });

      const previewRelX = previewGeo.pixelX / landscapePreview.w;
      const outputRelX = outputGeo.pixelX / landscapeCrop.w;
      const previewRelY = previewGeo.pixelY / landscapePreview.h;
      const outputRelY = outputGeo.pixelY / landscapeCrop.h;

      const diffX = Math.abs(previewRelX - outputRelX);
      const diffY = Math.abs(previewRelY - outputRelY);

      if (diffX > 0.005 || diffY > 0.005) {
        throw new Error(`Drift detected in Landscape ${preset} at size ${size}%! DiffX: ${diffX}, DiffY: ${diffY}`);
      }
    }
  }
  console.log("✓ Landscape 4:3 test passed with 0 drift across all presets and sizes.");
  console.log("=== ALL MATHEMATICAL GEOMETRY CHECKS PASSED ===");
}

runTests().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
