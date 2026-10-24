/**
 * Jaipur Stonecraft — Comprehensive End-to-End Verification Suite
 * Tests public website routes, 308 redirects, search, sitemap, database integrity, and Admin API security.
 */

import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { createSessionToken } from '../lib/admin/auth.js';

if (!process.env.DATABASE_URL && fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function runVerification() {
  console.log('='.repeat(80));
  console.log('JAIPUR STONECRAFT — TAXONOMY & ADMIN FULL E2E SUITE');
  console.log('Target:', BASE_URL);
  console.log('='.repeat(80));

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${message}`);
      failed++;
    }
  }

  // -------------------------------------------------------------
  // 1. PUBLIC COLLECTION ROUTES (All 6 collections must return 200)
  // -------------------------------------------------------------
  console.log('\n--- 1. PUBLIC COLLECTION ROUTES ---');
  const collections = [
    'sculptures-statues',
    'wall-art-reliefs',
    'temples-architectural-stonework',
    'fountains-water-features',
    'decorative-stone-art',
    'custom-bespoke-creations'
  ];

  for (const col of collections) {
    try {
      const res = await fetch(`${BASE_URL}/collections/${col}`, { redirect: 'manual' });
      assert(res.status === 200, `GET /collections/${col} -> ${res.status}`);
    } catch (e) {
      assert(false, `GET /collections/${col} threw error: ${e.message}`);
    }
  }

  // -------------------------------------------------------------
  // 2. HTTP 308 PERMANENT REDIRECTS FOR RETIRED/LEGACY PATHS
  // -------------------------------------------------------------
  console.log('\n--- 2. HTTP 308 PERMANENT REDIRECTS ---');
  const redirectTests = [
    {
      source: '/collections/temples-architectural-stonework/mandir-temple',
      target: '/collections/temples-architectural-stonework/mandirs-temples'
    },
    {
      source: '/collections/temples-architectural-stonework/home-mandirs',
      target: '/collections/temples-architectural-stonework/mandirs-temples'
    },
    {
      source: '/collections/temples-architectural-stonework/jali',
      target: '/collections/temples-architectural-stonework/jali-designs'
    },
    {
      source: '/collections/wall-art-reliefs/religious-spiritual-reliefs',
      target: '/collections/wall-art-reliefs/religious-reliefs'
    },
    {
      source: '/collections/wall-art-reliefs/relief-panels',
      target: '/collections/wall-art-reliefs/stone-relief-panels'
    },
    {
      source: '/collections/fountains-water-features/garden-fountains',
      target: '/collections/fountains-water-features/freestanding-fountains'
    },
    {
      source: '/collections/decorative-stone-art/planters-tulsi-pots',
      target: '/collections/decorative-stone-art/planters'
    }
  ];

  for (const test of redirectTests) {
    try {
      const res = await fetch(`${BASE_URL}${test.source}`, { redirect: 'manual' });
      const location = res.headers.get('location');
      const isRedirect = (res.status === 308 || res.status === 307 || res.status === 301);
      assert(isRedirect && location === test.target, `Redirect ${test.source} -> ${res.status} to ${location} (expected ${test.target})`);
    } catch (e) {
      assert(false, `Redirect test ${test.source} threw error: ${e.message}`);
    }
  }

  // -------------------------------------------------------------
  // 3. SEARCH DISCOVERY API
  // -------------------------------------------------------------
  console.log('\n--- 3. SEARCH ENGINE VERIFICATION ---');
  const searchQueries = [
    'religious relief',
    'stone mural',
    'marble jali',
    'mandir',
    'wall fountain'
  ];

  for (const q of searchQueries) {
    try {
      const res = await fetch(`${BASE_URL}/api/search?q=${encodeURIComponent(q)}&limit=5`);
      const data = await res.json();
      assert(res.status === 200, `Search query "${q}" returned status 200`);
      const count = data.totalCount || (data.products?.length || 0) + (data.categories?.length || 0);
      assert(count > 0, `Search query "${q}" returned ${count} total items (products: ${data.products?.length || 0}, categories: ${data.categories?.length || 0})`);
    } catch (e) {
      assert(false, `Search query "${q}" failed: ${e.message}`);
    }
  }

  // -------------------------------------------------------------
  // 4. SITEMAP ROUTE & RETIRED URL FILTERING
  // -------------------------------------------------------------
  console.log('\n--- 4. SITEMAP VERIFICATION ---');
  try {
    const res = await fetch(`${BASE_URL}/sitemap.xml`);
    const xml = await res.text();
    assert(res.status === 200, `GET /sitemap.xml returned 200`);
    assert(xml.includes('https://jaipurstonecraft.com/collections/sculptures-statues'), `Sitemap contains sculptures-statues`);
    assert(xml.includes('https://jaipurstonecraft.com/collections/temples-architectural-stonework/mandirs-temples'), `Sitemap contains approved subcategory mandirs-temples`);
    assert(!xml.includes('/mandir-temple<'), `Sitemap excludes deactivated legacy slug /mandir-temple`);
    assert(!xml.includes('/decorative-accents<'), `Sitemap excludes generic unapproved /decorative-accents`);
  } catch (e) {
    assert(false, `Sitemap check failed: ${e.message}`);
  }

  // -------------------------------------------------------------
  // 5. DATABASE INTEGRITY & ABSOLUTE PARITY (MySQL)
  // -------------------------------------------------------------
  console.log('\n--- 5. DATABASE INTEGRITY & PROTECTED COLLECTION PARITY ---');
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('DATABASE_URL not set');
    failed++;
  } else {
    const parsed = new URL(dbUrl);
    const connection = await mysql.createConnection({
      host: parsed.hostname,
      port: parsed.port ? parseInt(parsed.port, 10) : 3306,
      user: parsed.username,
      password: parsed.password,
      database: parsed.pathname.replace(/^\//, '')
    });

    try {
      // Total products
      const [[{ totalProducts }]] = await connection.query('SELECT COUNT(*) as totalProducts FROM products');
      assert(totalProducts === 320, `Total products preserved: ${totalProducts} === 320`);

      // Sculptures & statues count
      const [[{ sculptureCount }]] = await connection.query(
        "SELECT COUNT(*) as sculptureCount FROM products WHERE parent_collection = 'sculptures-statues'"
      );
      assert(sculptureCount === 127, `Protected collection sculptures-statues count: ${sculptureCount} === 127 (Exact Parity)`);

      // Active subcategories count
      const [[{ activeSubcatCount }]] = await connection.query(
        "SELECT COUNT(*) as activeSubcatCount FROM subcategories WHERE is_active = 1"
      );
      assert(activeSubcatCount === 20, `Approved active subcategories: ${activeSubcatCount} === 20`);

      // Granite query
      const [graniteProducts] = await connection.query(
        "SELECT id, name FROM products WHERE LOWER(name) LIKE '%granite%' OR LOWER(short_description) LIKE '%granite%' OR LOWER(detailed_description) LIKE '%granite%'"
      );
      assert(graniteProducts.length === 0, `Strict Zero Granite rule: found ${graniteProducts.length} occurrences`);

      const [graniteCategories] = await connection.query(
        "SELECT id, name FROM categories WHERE LOWER(name) LIKE '%granite%'"
      );
      assert(graniteCategories.length === 0, `Strict Zero Granite categories: found ${graniteCategories.length} occurrences`);

    } finally {
      await connection.end();
    }
  }

  // -------------------------------------------------------------
  // 6. ADMIN API SECURITY & REJECTION GUARDS
  // -------------------------------------------------------------
  console.log('\n--- 6. ADMIN API SECURITY & ENFORCEMENT ---');
  const sessionToken = createSessionToken();

  // Test 6.1: Unauthorized GET
  try {
    const res = await fetch(`${BASE_URL}/api/admin/categories`);
    assert(res.status === 401, `GET /api/admin/categories without auth -> 401 Unauthorized (got ${res.status})`);
  } catch (e) {
    assert(false, `Unauthorized check failed: ${e.message}`);
  }

  // Test 6.2: Authorized GET
  try {
    const res = await fetch(`${BASE_URL}/api/admin/categories`, {
      headers: {
        'Authorization': `Bearer ${sessionToken}`
      }
    });
    const data = await res.json();
    assert(res.status === 200, `GET /api/admin/categories with auth -> 200 OK`);
    assert(data.collections && data.collections.length === 6, `Returned exactly 6 approved collections in Admin API`);
  } catch (e) {
    assert(false, `Authorized GET categories failed: ${e.message}`);
  }

  // Test 6.3: Attempt to mutate protected Sculptures & Statues taxonomy (Must return 403)
  try {
    const res = await fetch(`${BASE_URL}/api/admin/categories`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'category',
        payload: {
          name: 'New Test Deity',
          slug: 'new-test-deity',
          parentCollection: 'sculptures-statues',
          parentSubcategory: 'hindu-god-goddess-statues'
        }
      })
    });
    const data = await res.json();
    assert(res.status === 403, `POST /api/admin/categories into sculptures-statues rejected with 403 Forbidden (got ${res.status})`);
    assert(data.error && data.error.toLowerCase().includes('protected'), `Rejection message specifically cites protected taxonomy: "${data.error}"`);
  } catch (e) {
    assert(false, `Protected category mutation check failed: ${e.message}`);
  }

  // Test 6.4: Attempt to create Granite category (Must return 400)
  try {
    const res = await fetch(`${BASE_URL}/api/admin/categories`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'category',
        payload: {
          name: 'Granite Pillar',
          slug: 'granite-pillar',
          parentCollection: 'temples-architectural-stonework',
          parentSubcategory: 'pillars-columns'
        }
      })
    });
    const data = await res.json();
    assert(res.status === 400, `POST /api/admin/categories with granite rejected with 400 (got ${res.status})`);
    assert(data.error && data.error.toLowerCase().includes('granite'), `Rejection specifically flags granite: "${data.error}"`);
  } catch (e) {
    assert(false, `Granite rejection check failed: ${e.message}`);
  }

  // Test 6.5: Attempt to modify a product's collection out of Sculptures & Statues (Must return 403)
  try {
    const res = await fetch(`${BASE_URL}/api/admin/products/bespoke-buddha-statues-sculpture`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${sessionToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        parentCollection: 'wall-art-reliefs',
        parentCategory: 'wall-murals'
      })
    });
    const data = await res.json();
    assert(res.status === 403, `PUT /api/admin/products/:id moving sculptures-statues rejected with 403 Forbidden (got ${res.status})`);
    assert(data.error && data.error.toLowerCase().includes('protected'), `Rejection flags protected collection: "${data.error}"`);
  } catch (e) {
    assert(false, `Protected product reassignment check failed: ${e.message}`);
  }

  // -------------------------------------------------------------
  // SUMMARY
  // -------------------------------------------------------------
  console.log('\n' + '='.repeat(80));
  console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('='.repeat(80));

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runVerification().catch(err => {
  console.error('Verification suite encountered unhandled error:', err);
  process.exit(1);
});
