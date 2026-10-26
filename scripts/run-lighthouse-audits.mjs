import { execSync } from "child_process";
import fs from "fs/promises";
import path from "path";

const TARGET_URL = "http://localhost:3000/";
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUTPUT_DIR = path.join(process.cwd(), "artifacts", "lighthouse-audits");

async function runLighthouse(formFactor, runIndex) {
  const jsonPath = path.join(OUTPUT_DIR, `${formFactor}-run-${runIndex}.json`);
  const isMobile = formFactor === "mobile";
  
  const cmd = `npx -y lighthouse ${TARGET_URL} ` +
    `--output=json --output-path="${jsonPath}" ` +
    `--chrome-flags="--headless --no-sandbox --disable-gpu" ` +
    (isMobile ? `--form-factor=mobile --screenEmulation.mobile=true ` : `--preset=desktop `) +
    `--quiet`;

  const env = { ...process.env, CHROME_PATH };

  console.log(`Running Lighthouse ${formFactor} audit #${runIndex}...`);
  execSync(cmd, { env, stdio: "ignore", timeout: 90000 });

  const rawJson = await fs.readFile(jsonPath, "utf-8");
  const data = JSON.parse(rawJson);

  const categories = data.categories || {};
  const audits = data.audits || {};

  const perfScore = Math.round((categories.performance?.score || 0) * 100);
  const a11yScore = Math.round((categories.accessibility?.score || 0) * 100);
  const bpScore = Math.round((categories["best-practices"]?.score || 0) * 100);
  const seoScore = Math.round((categories.seo?.score || 0) * 100);

  const fcp = audits["first-contentful-paint"]?.numericValue || 0;
  const lcp = audits["largest-contentful-paint"]?.numericValue || 0;
  const tbt = audits["total-blocking-time"]?.numericValue || 0;
  const cls = audits["cumulative-layout-shift"]?.numericValue || 0;
  const totalByteWeight = audits["total-byte-weight"]?.numericValue || 0;

  const lcpElement = audits["largest-contentful-paint-element"]?.details?.items?.[0]?.node?.snippet || "N/A";

  const networkItems = audits["network-requests"]?.details?.items || [];
  const imageRequests = networkItems
    .filter(req => req.resourceType === "Image")
    .sort((a, b) => b.transferSize - a.transferSize)
    .slice(0, 3)
    .map(r => ({
      url: r.url.replace("http://localhost:3000", ""),
      sizeKB: Math.round(r.transferSize / 1024),
      mimeType: r.mimeType
    }));

  return {
    formFactor,
    runIndex,
    perfScore,
    a11yScore,
    bpScore,
    seoScore,
    fcpMs: Math.round(fcp),
    lcpMs: Math.round(lcp),
    tbtMs: Math.round(tbt),
    cls: Number(cls.toFixed(3)),
    totalTransferKB: Math.round(totalByteWeight / 1024),
    lcpElement: lcpElement.slice(0, 80),
    topImages: imageRequests
  };
}

function calculateMedian(arr, key) {
  const sorted = [...arr].map(item => item[key]).sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const desktopRuns = [];
  for (let i = 1; i <= 3; i++) {
    const res = await runLighthouse("desktop", i);
    desktopRuns.push(res);
  }

  const mobileRuns = [];
  for (let i = 1; i <= 3; i++) {
    const res = await runLighthouse("mobile", i);
    mobileRuns.push(res);
  }

  const summary = {
    desktop: {
      runs: desktopRuns,
      median: {
        perfScore: calculateMedian(desktopRuns, "perfScore"),
        a11yScore: calculateMedian(desktopRuns, "a11yScore"),
        bpScore: calculateMedian(desktopRuns, "bpScore"),
        seoScore: calculateMedian(desktopRuns, "seoScore"),
        fcpMs: calculateMedian(desktopRuns, "fcpMs"),
        lcpMs: calculateMedian(desktopRuns, "lcpMs"),
        tbtMs: calculateMedian(desktopRuns, "tbtMs"),
        cls: calculateMedian(desktopRuns, "cls"),
        totalTransferKB: calculateMedian(desktopRuns, "totalTransferKB")
      }
    },
    mobile: {
      runs: mobileRuns,
      median: {
        perfScore: calculateMedian(mobileRuns, "perfScore"),
        a11yScore: calculateMedian(mobileRuns, "a11yScore"),
        bpScore: calculateMedian(mobileRuns, "bpScore"),
        seoScore: calculateMedian(mobileRuns, "seoScore"),
        fcpMs: calculateMedian(mobileRuns, "fcpMs"),
        lcpMs: calculateMedian(mobileRuns, "lcpMs"),
        tbtMs: calculateMedian(mobileRuns, "tbtMs"),
        cls: calculateMedian(mobileRuns, "cls"),
        totalTransferKB: calculateMedian(mobileRuns, "totalTransferKB")
      }
    }
  };

  console.log("\n=================== DESKTOP AUDITS (3 RUNS & MEDIAN) ===================");
  console.table(desktopRuns.map(r => ({
    Run: r.runIndex,
    Performance: r.perfScore,
    Accessibility: r.a11yScore,
    "Best Practices": r.bpScore,
    SEO: r.seoScore,
    "LCP (ms)": r.lcpMs,
    "FCP (ms)": r.fcpMs,
    "TBT (ms)": r.tbtMs,
    CLS: r.cls,
    "Transfer (KB)": r.totalTransferKB
  })));
  console.log("DESKTOP MEDIAN:", summary.desktop.median);

  console.log("\n=================== MOBILE AUDITS (3 RUNS & MEDIAN) ===================");
  console.table(mobileRuns.map(r => ({
    Run: r.runIndex,
    Performance: r.perfScore,
    Accessibility: r.a11yScore,
    "Best Practices": r.bpScore,
    SEO: r.seoScore,
    "LCP (ms)": r.lcpMs,
    "FCP (ms)": r.fcpMs,
    "TBT (ms)": r.tbtMs,
    CLS: r.cls,
    "Transfer (KB)": r.totalTransferKB
  })));
  console.log("MOBILE MEDIAN:", summary.mobile.median);

  await fs.writeFile(path.join(OUTPUT_DIR, "lighthouse-summary.json"), JSON.stringify(summary, null, 2));
  console.log("\nDetailed Lighthouse JSON reports and summary saved to artifacts/lighthouse-audits/");
}

main().catch(console.error);
