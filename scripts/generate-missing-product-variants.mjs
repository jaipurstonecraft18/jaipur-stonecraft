import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function generateMissing() {
  const displayDir = path.join(process.cwd(), 'public/uploads/products/display');
  const cardDir = path.join(process.cwd(), 'public/uploads/products/card');
  const thumbDir = path.join(process.cwd(), 'public/uploads/products/thumb');
  
  if (!fs.existsSync(cardDir)) fs.mkdirSync(cardDir, { recursive: true });
  if (!fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir, { recursive: true });

  const displayFiles = fs.readdirSync(displayDir).filter(f => /\.(webp|jpg|png)$/i.test(f));
  console.log(`Checking ${displayFiles.length} display files...`);

  let generatedCard = 0;
  let generatedThumb = 0;

  for (const file of displayFiles) {
    const baseName = file.replace(/\.[^.]+$/, '');
    const srcPath = path.join(displayDir, file);
    
    // Check if raw master exists
    let masterPath = srcPath;
    const rawCandidates = [
      path.join(process.cwd(), 'public/uploads/products/raw', `${baseName}.jpg`),
      path.join(process.cwd(), 'public/uploads/products/raw', `${baseName}.png`),
      path.join(process.cwd(), 'public/uploads/products/raw', `${baseName}.jpeg`),
      path.join(process.cwd(), 'public/uploads/products/raw', `${baseName}.webp`),
    ];
    for (const cand of rawCandidates) {
      if (fs.existsSync(cand)) {
        masterPath = cand;
        break;
      }
    }

    // Card variant (max 1080px wide/tall)
    const targetCard = path.join(cardDir, `${baseName}.webp`);
    if (!fs.existsSync(targetCard)) {
      await sharp(masterPath)
        .rotate()
        .resize(1080, 1440, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85, smartSubsample: true, effort: 4 })
        .toFile(targetCard);
      generatedCard++;
    }

    // Thumb variant (max 400x400)
    const targetThumb = path.join(thumbDir, `${baseName}.webp`);
    if (!fs.existsSync(targetThumb)) {
      await sharp(masterPath)
        .rotate()
        .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82, smartSubsample: true, effort: 4 })
        .toFile(targetThumb);
      generatedThumb++;
    }
  }

  console.log(`Finished! Generated ${generatedCard} missing card variants and ${generatedThumb} missing thumb variants.`);
}

generateMissing().catch(console.error);
