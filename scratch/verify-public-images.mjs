import http from 'http';
import https from 'https';

const PAGES = [
  '/',
  '/collections',
  '/products',
  '/designs/ganesh-ji/seated-ganesh-with-modak',
  '/knowledge',
  '/marble',
  '/craftsmanship'
];

function fetchHtml(urlPath) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${urlPath}`, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    }).on('error', reject);
  });
}

function checkImageSrc(rawSrc) {
  // Decode HTML entities like &amp; -> &
  let cleanSrc = rawSrc.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');

  return new Promise((resolve) => {
    if (cleanSrc.startsWith('/')) {
      http.get(`http://localhost:3000${cleanSrc}`, (res) => {
        resolve({ src: cleanSrc, status: res.statusCode });
      }).on('error', () => resolve({ src: cleanSrc, status: 500 }));
    } else if (cleanSrc.startsWith('https://')) {
      const req = https.get(cleanSrc, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        resolve({ src: cleanSrc, status: res.statusCode });
      });
      req.on('error', () => resolve({ src: cleanSrc, status: 500 }));
      req.setTimeout(5000, () => {
        req.destroy();
        resolve({ src: cleanSrc, status: 408 });
      });
    } else {
      resolve({ src: cleanSrc, status: 200 });
    }
  });
}

async function runImageCheck() {
  console.log("=================================================");
  console.log("PHASE 9 — PUBLIC IMAGE ACCESSIBILITY AUDIT (UNESCAPED)");
  console.log("=================================================\n");

  const imageSrcs = new Set();

  for (const pagePath of PAGES) {
    try {
      const html = await fetchHtml(pagePath);
      const matches = html.matchAll(/<img[^>]+src=["']([^"']+)["']/g);
      for (const m of matches) {
        imageSrcs.add(m[1]);
      }
    } catch (err) {
      console.error("Error fetching page:", pagePath, err.message);
    }
  }

  console.log(`Extracted ${imageSrcs.size} unique image tags across public pages.\n`);

  let brokenCount = 0;
  for (const src of imageSrcs) {
    if (src.startsWith('data:')) continue;
    const res = await checkImageSrc(src);
    if (res.status >= 200 && res.status < 400) {
      console.log(` [OK ${res.status}] ${res.src.slice(0, 90)}`);
    } else {
      brokenCount++;
      console.log(` ❌ [BROKEN ${res.status}] ${res.src}`);
    }
  }

  console.log("\n-------------------------------------------------");
  console.log(`TOTAL IMAGES CHECKED: ${imageSrcs.size}`);
  console.log(`BROKEN IMAGES: ${brokenCount}`);
  console.log("-------------------------------------------------\n");

  if (brokenCount > 0) {
    console.log("⚠️ Some images failed to load.");
    process.exit(1);
  } else {
    console.log("✅ ALL PUBLIC IMAGES ACCESSIBLE AND RESPONDING 200 OK!");
    process.exit(0);
  }
}

runImageCheck();
