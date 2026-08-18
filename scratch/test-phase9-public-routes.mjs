import http from 'http';

const ROUTES_TO_TEST = [
  '/',
  '/collections',
  '/collections/sculptures-statues',
  '/collections/sculptures-statues/hindu-sculptures',
  '/collections/sculptures-statues/hindu-sculptures/ganesh-ji',
  '/products',
  '/products?material=makrana-pure-white',
  '/products?collection=sculptures-statues',
  '/products?search=ganesh',
  '/products?sort=name',
  '/designs/ganesh-ji/seated-ganesh-with-modak',
  '/designs/ganesh-ji/blessing-ganesh-statue',
  '/knowledge',
  '/knowledge/how-makrana-marble-statues-are-carved',
  '/marble',
  '/craftsmanship',
  '/custom-projects',
  '/our-story',
  '/contact',
  '/search?q=statue',
  '/style-guide',
  '/sitemap.xml',
  '/robots.txt'
];

function fetchRoute(path) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    http.get(`http://localhost:3000${path}`, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        const duration = Date.now() - startTime;
        resolve({
          path,
          statusCode: res.statusCode,
          duration,
          contentLength: body.length,
          hasErrorText: body.includes("Internal Server Error") || body.includes("Unhandled Runtime Error"),
          is404Page: body.includes("This page could not be found") || body.includes("404")
        });
      });
    }).on('error', (err) => {
      resolve({
        path,
        statusCode: 500,
        error: err.message,
        duration: Date.now() - startTime
      });
    });
  });
}

async function runAudit() {
  console.log("=================================================");
  console.log("PHASE 9 — PUBLIC WEBSITE ROUTE RUNTIME AUDIT");
  console.log("=================================================\n");

  const results = [];
  let failCount = 0;

  for (const path of ROUTES_TO_TEST) {
    process.stdout.write(`Testing ${path.padEnd(55)} ... `);
    const res = await fetchRoute(path);
    results.push(res);

    if (res.statusCode === 200 && !res.hasErrorText) {
      console.log(`[PASS 200 OK] (${res.duration}ms, ${(res.contentLength / 1024).toFixed(1)} KB)`);
    } else {
      failCount++;
      console.log(`[FAIL HTTP ${res.statusCode}] (${res.duration}ms, ErrorText: ${res.hasErrorText})`);
    }
  }

  console.log("\n-------------------------------------------------");
  console.log(`TOTAL ROUTES TESTED: ${ROUTES_TO_TEST.length}`);
  console.log(`PASSED: ${ROUTES_TO_TEST.length - failCount}`);
  console.log(`FAILED: ${failCount}`);
  console.log("-------------------------------------------------\n");

  if (failCount > 0) {
    console.log("FAILED ROUTES DETAILS:");
    results.filter(r => r.statusCode !== 200 || r.hasErrorText).forEach(r => {
      console.log(` - ${r.path} -> Status ${r.statusCode}, error: ${r.error || 'Server Error in HTML'}`);
    });
    process.exit(1);
  } else {
    console.log("✅ ALL PUBLIC ROUTES VERIFIED 100% OPERATIONAL!");
    process.exit(0);
  }
}

runAudit();
