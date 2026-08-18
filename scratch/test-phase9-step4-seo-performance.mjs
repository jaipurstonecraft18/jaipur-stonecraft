import http from 'http';
import fs from 'fs';

const PAGES = [
  { name: 'Homepage', path: '/' },
  { name: 'Collections Hub', path: '/collections' },
  { name: 'Category Page', path: '/collections/sculptures-statues/hindu-sculptures/ganesh-ji' },
  { name: 'Product Listing', path: '/products' },
  { name: 'Product Detail', path: '/designs/ganesh-ji/seated-ganesh-with-modak' },
  { name: 'Knowledge Guide', path: '/knowledge/how-makrana-marble-statues-are-carved' },
  { name: 'Contact Page', path: '/contact' }
];

function fetchHtml(urlPath) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    http.get(`http://localhost:3000${urlPath}`, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const duration = Date.now() - startTime;
        resolve({ statusCode: res.statusCode, body, duration, size: body.length });
      });
    }).on('error', reject);
  });
}

function parseSeo(html) {
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
  const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i);
  const jsonLdMatches = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  
  const imgMatches = [...html.matchAll(/<img[^>]*>/gi)];
  let imgsWithAlt = 0;
  let imgsWithoutAlt = 0;

  imgMatches.forEach(imgHtml => {
    if (/alt=["'][^"']+["']/i.test(imgHtml[0])) {
      imgsWithAlt++;
    } else {
      imgsWithoutAlt++;
    }
  });

  return {
    title: titleMatch ? titleMatch[1] : null,
    metaDescription: metaDescMatch ? metaDescMatch[1] : null,
    canonical: canonicalMatch ? canonicalMatch[1] : null,
    ogTitle: ogTitleMatch ? ogTitleMatch[1] : null,
    jsonLdCount: jsonLdMatches.length,
    jsonLdTypes: jsonLdMatches.map(m => {
      try {
        const parsed = JSON.parse(m[1]);
        return parsed['@type'] || (parsed['@graph'] ? parsed['@graph'].map(g => g['@type']).join(',') : 'Graph');
      } catch (e) {
        return 'Raw';
      }
    }),
    imgsWithAlt,
    imgsWithoutAlt
  };
}

async function runAudit() {
  console.log("=================================================");
  console.log("PHASE 9 STEP 4 — PERFORMANCE & SEO AUDIT");
  console.log("=================================================\n");

  let graniteCountGlobal = 0;

  for (const page of PAGES) {
    console.log(`--- Page: ${page.name} (${page.path}) ---`);
    const res = await fetchHtml(page.path);
    const seo = parseSeo(res.body);

    // Granite compliance check on rendered HTML (case insensitive, excluding code guards)
    const bodyNoGuards = res.body.replace(/granite is strictly excluded/gi, "");
    const graniteMatches = (bodyNoGuards.match(/granite/gi) || []).length;
    graniteCountGlobal += graniteMatches;

    console.log(`  Response Time:      ${res.duration} ms`);
    console.log(`  HTML Transfer Size: ${(res.size / 1024).toFixed(1)} KB`);
    console.log(`  Title:              "${seo.title}"`);
    console.log(`  Meta Description:   "${seo.metaDescription ? seo.metaDescription.slice(0, 70) + '...' : 'NONE'}"`);
    console.log(`  Canonical URL:      ${seo.canonical || 'NONE'}`);
    console.log(`  OpenGraph Title:    ${seo.ogTitle || 'NONE'}`);
    console.log(`  JSON-LD Schemas:    ${seo.jsonLdCount} found (${seo.jsonLdTypes.join(', ')})`);
    console.log(`  Image Alt Text:     ${seo.imgsWithAlt} images with alt, ${seo.imgsWithoutAlt} missing alt`);
    console.log(`  Granite Check:      ${graniteMatches === 0 ? '✅ 100% COMPLIANT (0 mentions)' : `❌ NON-COMPLIANT (${graniteMatches} mentions)`}\n`);
  }

  // Check Sitemap & Robots
  console.log("--- XML Sitemap & Robots.txt ---");
  const sitemapRes = await fetchHtml('/sitemap.xml');
  const sitemapUrls = (sitemapRes.body.match(/<loc>/g) || []).length;
  console.log(`  /sitemap.xml:      Status HTTP ${sitemapRes.statusCode}, Size: ${(sitemapRes.size / 1024).toFixed(1)} KB, Total URLs: ${sitemapUrls}`);

  const robotsRes = await fetchHtml('/robots.txt');
  console.log(`  /robots.txt:       Status HTTP ${robotsRes.statusCode}, Size: ${robotsRes.size} bytes`);
  console.log(`  Robots directives: ${robotsRes.body.split('\n').join(' | ')}\n`);

  console.log("-------------------------------------------------");
  console.log(`GRANITE EXCLUSION COMPLIANCE: ${graniteCountGlobal === 0 ? '✅ 100% PASSED (0 mentions across all pages)' : '❌ FAILED'}`);
  console.log("-------------------------------------------------\n");

  if (graniteCountGlobal > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAudit();
