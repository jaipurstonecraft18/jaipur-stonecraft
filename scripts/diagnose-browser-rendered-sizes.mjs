import puppeteer from 'puppeteer';

async function diagnose() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 }); // Typical modern MacBook/Retina/HiDPI display
  
  console.log('--- Navigating to Homepage ---');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  
  // Evaluate discovery slider images
  const sliderImages = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('section [class*="railWrapper"] img'));
    return images.slice(0, 6).map(img => {
      const rect = img.getBoundingClientRect();
      return {
        alt: img.alt,
        src: img.src,
        currentSrc: img.currentSrc,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        renderedWidth: rect.width,
        renderedHeight: rect.height,
        dpr: window.devicePixelRatio
      };
    });
  });

  console.log('HOMEPAGE SLIDER IMAGES (at DPR=2, 1440px viewport):');
  for (const img of sliderImages) {
    console.log(`\nAlt: ${img.alt}`);
    console.log(`  currentSrc:     ${img.currentSrc}`);
    console.log(`  natural size:   ${img.naturalWidth} x ${img.naturalHeight}`);
    console.log(`  rendered CSS:   ${img.renderedWidth} x ${img.renderedHeight}`);
    const effectiveHeightNeeded = img.renderedHeight * img.dpr;
    const heightDeficit = (effectiveHeightNeeded - img.naturalHeight);
    console.log(`  DPR 2 pixels needed: ${img.renderedWidth * img.dpr} x ${effectiveHeightNeeded}`);
    console.log(`  Height shortfall:    ${heightDeficit > 0 ? `DEFICIT of ${heightDeficit}px (BLURRY / UPSCALE!)` : 'Sufficient'}`);
  }

  console.log('\n--- Navigating to Product Detail Page with Perspectives ---');
  // Navigate to Radha Krishna product which has 4 perspectives
  await page.goto('http://localhost:3000/designs/radha-krishna/radha-krishna-jugal-roop-with-gau-mata', { waitUntil: 'networkidle2' });
  
  const productImages = await page.evaluate(() => {
    // 1. Hero main image
    const mainImg = document.querySelector('[class*="mainImageFrame"] img');
    const mainRect = mainImg ? mainImg.getBoundingClientRect() : {};
    
    // 2. Perspective gallery images
    const perspImgs = Array.from(document.querySelectorAll('section[aria-label="Multiple Perspectives"] img'));
    
    return {
      main: mainImg ? {
        alt: mainImg.alt,
        currentSrc: mainImg.currentSrc,
        naturalWidth: mainImg.naturalWidth,
        naturalHeight: mainImg.naturalHeight,
        renderedWidth: mainRect.width,
        renderedHeight: mainRect.height,
      } : null,
      perspectives: perspImgs.map(img => {
        const rect = img.getBoundingClientRect();
        return {
          alt: img.alt,
          currentSrc: img.currentSrc,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          renderedWidth: rect.width,
          renderedHeight: rect.height,
        };
      })
    };
  });

  console.log('\nPRODUCT DETAIL:');
  console.log('MAIN HERO IMAGE:');
  if (productImages.main) {
    console.log(`  currentSrc:     ${productImages.main.currentSrc}`);
    console.log(`  natural size:   ${productImages.main.naturalWidth} x ${productImages.main.naturalHeight}`);
    console.log(`  rendered CSS:   ${productImages.main.renderedWidth} x ${productImages.main.renderedHeight}`);
  }

  console.log('\nPERSPECTIVE GALLERY IMAGES:');
  for (const img of productImages.perspectives) {
    console.log(`\nAlt: ${img.alt}`);
    console.log(`  currentSrc:     ${img.currentSrc}`);
    console.log(`  natural size:   ${img.naturalWidth} x ${img.naturalHeight}`);
    console.log(`  rendered CSS:   ${img.renderedWidth} x ${img.renderedHeight}`);
    const effectiveHeightNeeded = img.renderedHeight * 2;
    const heightDeficit = (effectiveHeightNeeded - img.naturalHeight);
    console.log(`  DPR 2 pixels needed: ${img.renderedWidth * 2} x ${effectiveHeightNeeded}`);
    console.log(`  Height shortfall:    ${heightDeficit > 0 ? `DEFICIT of ${heightDeficit}px (BLURRY / UPSCALE!)` : 'Sufficient'}`);
  }

  await browser.close();
}

diagnose().catch(err => {
  console.error(err);
  process.exit(1);
});
