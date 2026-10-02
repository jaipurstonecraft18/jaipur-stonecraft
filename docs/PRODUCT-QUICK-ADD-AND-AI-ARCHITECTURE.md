# Jaipur Stonecraft — Mobile Quick Add & AI Architecture

## 1. Overview & Architecture

The Jaipur Stonecraft product ingestion pipeline supports two complementary authoring experiences operating against the same MySQL database and public schema:

1. **Mobile Quick Add (`/admin/products/quick-add`)**:
   - Touch-optimized, 3-step, photo-first wizard designed for non-technical users on mobile phones.
   - Automatically derives technical identifiers (SKU, slug, taxonomy hierarchy, SEO placeholders).
   - Offloads compute-heavy and rate-limited text/SEO tasks to an asynchronous background job queue.

2. **Full Product Studio (`/admin/products/[slug]`)**:
   - Advanced comprehensive administrative editor retaining 100% of product fields (craftsmanship, iconography, placement, care, specifications, FAQs, SEO, and raw attribute definitions).
   - Features a reconciled, unified Dimension & Weight editor (`Height`, `Width`, `Depth`, `Weight`) synchronized with legacy attribute keys.
   - Real-time AI job status indicator with manual trigger for re-enrichment.

```
                           MOBILE QUICK ADD
                   [ Step 1: Camera / Gallery Photos ]
                                   │
                                   ▼
                   [ Fast Gemini Vision Fact Extraction ]
                                   │
               ┌───────────────────┴───────────────────┐
               ▼ (Success / Partial)                   ▼ (Quota / Failure)
      [ Pre-filled Form Chips ]               [ Plain Missing Info Prompts ]
               └───────────────────┬───────────────────┘
                                   │
                                   ▼
                   [ Step 2: User Confirms / Edits ]
                                   │
                                   ▼
                   [ Step 3: Review & Publish / Draft ]
                                   │
                   ┌───────────────┴───────────────┐
                   ▼                               ▼
       [ Direct DB Product Save ]        [ Async Grok Job Queued ]
       (Instant feedback to user)         (ai_jobs table: pending)
                                                   │
                                                   ▼
                                         [ lib/ai/job-processor ]
                                         - Generates SEO & Descriptions
                                         - Respects User Overrides
                                         - Retries with Backoff
```

---

## 2. AI Responsibilities & Separation

| System | Role | Scope | Failure Impact |
|---|---|---|---|
| **Gemini 2.5 Flash / 1.5 Flash** | Vision Fact Extraction | Analyzes primary uploaded image to extract basic physical facts: `subject`, `material`, `productType`, `posture`, `color`, `finish`. | **Zero failure impact**. If offline or quota exhausted (HTTP 429), UI falls back to asking simple user questions. |
| **Grok (xAI)** | Text Generation & Enrichment | Consolidates description, craftsmanship, placement, maintenance, FAQs, and SEO meta tags using structured JSON. | **Zero failure impact**. Initial product save never blocks on Grok. Jobs process asynchronously. |
| **Taxonomy Matcher** | Deterministic Mapping | Maps visual facts to database categories, collections, and materials. **Strictly enforces granite exclusion**. | Guaranteed deterministic output with zero AI hallucination of catalog architecture. |

---

## 3. Gemini Vision Extraction & 3-State Fallback

`lib/ai/vision-fact-extractor.js` implements an adaptive strategy:
- **Optimization**: Compresses input image to max 1024px WebP using Sharp before dispatching to vision model.
- **Adaptive**: Checks primary image first; only queries secondary image if primary confidence is low.
- **3 States**:
  1. `FULL_SUCCESS`: Returns confidence score, identified facts, and matched taxonomy IDs.
  2. `PARTIAL_SUCCESS`: Identifies partial attributes (e.g., subject and type identified, material uncertain); UI prompts only for the uncertain field.
  3. `COMPLETE_FAILURE`: Triggered on network timeout, API error, or quota limit (HTTP 429). Returns clean fallback object listing missing fields without exposing technical errors.

---

## 4. Database-Backed AI Job Queue (`ai_jobs`)

Asynchronous enrichment jobs are stored in the MySQL database table `ai_jobs`:

```sql
CREATE TABLE ai_jobs (
  id VARCHAR(64) PRIMARY KEY,
  product_slug VARCHAR(255) NOT NULL,
  job_type VARCHAR(64) NOT NULL DEFAULT 'enrich_product',
  provider VARCHAR(64) NOT NULL DEFAULT 'grok',
  status ENUM('pending', 'processing', 'completed', 'retrying', 'failed', 'waiting_for_user') NOT NULL DEFAULT 'pending',
  attempt_count INT NOT NULL DEFAULT 0,
  max_attempts INT NOT NULL DEFAULT 3,
  payload_json JSON,
  result_json JSON,
  error_message TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_ai_jobs_product_slug (product_slug),
  INDEX idx_ai_jobs_status (status)
);
```

### Job States:
- `pending`: Newly enqueued job awaiting processing.
- `processing`: Worker is currently invoking Grok.
- `completed`: Content enriched and merged into product table.
- `retrying`: Transient error encountered; scheduled with exponential backoff.
- `waiting_for_user`: Quota or rate limit exceeded; pauses hammering provider and waits for manual retry.
- `failed`: Exceeded maximum attempts (3) without success.

---

## 5. Manual Override Protection Rule

**The user's manual input is permanently authoritative.**
When Grok generates rich content in `lib/ai/content-enricher.js`:
- If `customFields.product_name` exists, AI generation will **not** overwrite `name`.
- If the user modified `summary` or `description`, existing text is preserved.
- Retrying an AI job merges fields conservatively, never wiping user edits.

---

## 6. Required Fields & Minimum Upload Bar

To create a valid draft or published product via Quick Add:
- **At least 1 product photo**
- **Product Name** (auto-suggested or typed)
- **Category** (auto-matched or selected from chips)
- **Material** (auto-matched or selected; granite strictly excluded)
- **Product Type** (statue, temple, fountain, etc.)

Technical fields generated automatically:
- SKU (`JSC-[CAT]-[TIMESTAMP]`)
- URL Slug (sanitized transliterated string)
- Primary & Secondary Search Phrases (seed tags from category + material)

---

## 7. Unified Dimension & Weight Reconciliation

The legacy system had duplicated dimension attributes rendered out of logical order.
`ProductStudio.js` and `Product.js` now expose a unified card:
- **Height (inches)**
- **Width (inches)**
- **Depth (inches)**
- **Weight (kg)**

Data is synchronized across both `product.attributes.dimensions` (object) and legacy attribute keys (`dimensions_height_inches`, `dimensions_width_inches`, `dimensions_depth_inches`, `approximate_weight_kg`) maintaining 100% backward compatibility with public product views.

---

## 8. Environment Variables & Troubleshooting

### Required Server Environment Variables:
```env
# Gemini API Key (Vision Fact Extraction)
GEMINI_API_KEY=your_gemini_api_key

# Grok / xAI API Key (Text Generation & SEO)
GROK_API_KEY=your_xai_grok_api_key

# Database Connection (MySQL)
DATABASE_URL=mysql://user:password@localhost:3306/jaipur_stonecraft
```

### Troubleshooting AI Jobs:
1. **View Job Status**:
   - Check the admin banner at `/admin/products/[slug]`.
   - Or query via API: `GET /api/admin/ai/jobs?productSlug=[slug]`.
2. **Re-run a Stuck or Failed Job**:
   - Click "Re-run AI Enrichment" on the Product Studio page.
   - Or dispatch: `POST /api/admin/ai/jobs` with `{ action: 'process_pending' }`.
3. **Provider Rate Limits**:
   - When HTTP 429 occurs, jobs transition to `waiting_for_user`. No continuous hammering occurs. Click "Re-run AI Enrichment" once quota resets.
