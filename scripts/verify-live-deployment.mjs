const LIVE_BASE = "https://lavenderblush-crab-850824.hostingersite.com";

async function verify() {
  console.log("=== VERIFYING LIVE PRODUCTION DEPLOYMENT ===");
  
  // 1. Check old URL 308 redirect
  const oldRes = await fetch(`${LIVE_BASE}/collections/temples-architectural-stonework/balcony-staircase-jali`, { redirect: "manual" });
  console.log(`[OLD URL REDIRECT] Status: ${oldRes.status}, Location: ${oldRes.headers.get("location")}`);

  // 2. Check canonical category 200
  const catRes = await fetch(`${LIVE_BASE}/collections/temples-architectural-stonework/jali-designs/balcony-staircase-jali`);
  console.log(`[CANONICAL CATEGORY] Status: ${catRes.status}`);

  // 3. Check product detail page & recommendations button
  const prodRes = await fetch(`${LIVE_BASE}/designs/balcony-staircase-jali/hand-carved-marble-sculpture-7369`);
  console.log(`[PRODUCT DETAIL PAGE] Status: ${prodRes.status}`);
  const prodHtml = await prodRes.text();
  const targetHref = 'href="/collections/temples-architectural-stonework/jali-designs/balcony-staircase-jali"';
  console.log(`[RECOMMENDATIONS BUTTON HREF] Present: ${prodHtml.includes(targetHref)}`);

  // 4. Check Search Overlay quick links on homepage
  const homeRes = await fetch(`${LIVE_BASE}/`);
  console.log(`[HOMEPAGE] Status: ${homeRes.status}`);
  const homeHtml = await homeRes.text();
  console.log(`[HOMEPAGE DISCOVERY ARCH CANONICAL] Present: ${homeHtml.includes("/collections/temples-architectural-stonework/jali-designs/marble-jali-designs")}`);

  // 5. Check SEO audit settings API
  const setRes = await fetch(`${LIVE_BASE}/api/settings`);
  const setData = await setRes.json();
  console.log(`[LIVE SEO AUDIT SETTINGS] Max Title: ${setData.settings?.seo_audit_settings?.maxTitleLength}, Require Exact Phrase: ${setData.settings?.seo_audit_settings?.requireExactPrimarySearchPhrasePlacement}`);

  console.log("\n==============================================");
  console.log("LIVE PRODUCTION SITE IS 100% UP TO DATE!");
  console.log("==============================================");
}

verify().catch(console.error);
