import http from 'http';

const BASE = 'http://localhost:3000';

const endpoints = [
  '/',
  '/products',
  '/collections/temples-architectural-stonework',
  '/collections/temples-architectural-stonework/jali-designs',
  '/collections/temples-architectural-stonework/jali-designs/balcony-staircase-jali',
  '/products/hand-carved-white-marble-geometric-jali',
  '/api/settings',
  '/admin/login',
  '/sitemap.xml',
  '/robots.txt'
];

async function check(url) {
  const res = await fetch(`${BASE}${url}`);
  const status = res.status;
  const contentType = res.headers.get('content-type') || '';
  const text = await res.text();
  console.log(`[${status}] ${url} (${contentType}, ${text.length} bytes)`);
  if (status >= 400) {
    throw new Error(`Failed endpoint ${url} with status ${status}`);
  }
}

async function run() {
  console.log('Testing key site endpoints on Next.js 16.4.3...');
  for (const ep of endpoints) {
    await check(ep);
  }
  console.log('\nAll key site endpoints verified successfully (200 OK)!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
