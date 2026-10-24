# JAIPUR STONECRAFT — DISCONNECTED PAGE & ORPHAN REGISTER

**Audit Snapshot Timestamp:** 2026-10-21T10:05:54+05:30  
**Scope:** Exhaustive identification of all orphaned, inactive, empty, legacy, and disconnected records.

---

## SUMMARY OF DISCONNECTED ENTITIES

| Anomaly Category | Count | Primary Impact |
|---|---|---|
| **Categories with Missing/Unmapped Parent** | 0 categories in DB (40 products parked in `review-pending`) | 40 products have non-existent parent categories |
| **Inactive Categories in Database** | 61 categories | Excluded from static definitions, navigation, and sitemaps |
| **Inactive Subcategories in Database** | 23 subcategories | Excluded from static definitions, navigation, and sitemaps |
| **Subcategories with 0 Child Categories** | 5 subcategories | Dead-end containers in database |
| **Active Categories with 0 Products** | 8 categories | Live public category routes displaying empty catalogues |
| **Inactive Categories with 0 Products** | 61 categories | Inactive, 0 products |
| **Products in Draft Status** | 304 products | Stored in database, accessible via direct URL, hidden from navigation |
| **Products with Unmapped Parent Assignment** | 40 products | Parked in `review-pending`, not discoverable in navigation |
| **Legacy Category Redirects Configured** | 58 category redirects | Mapped in `next.config.mjs` and category page handler |
| **Legacy Subcategory Redirects Configured** | 12 subcategory redirects | Mapped in `next.config.mjs` |

---

## 1. Products with Missing or Invalid Parent Taxonomy (40 Items)

**Evidence:** Querying `SELECT * FROM products WHERE parent_category NOT IN (SELECT slug FROM categories)` returns exactly 40 products.  
All 40 products have `parent_subcategory = 'review-pending'` and `parent_category = 'review-pending'`.

| Product ID | SKU | Product Name | Parent Collection | Parent Subcategory | Parent Category | Status |
|---|---|---|---|---|---|---|
| `bespoke-ancestral-portrait-carvings-sculpture` | `JSC-ANCE-BESP` | Bespoke Ancestral Portrait Carvings Sculpture | `custom-bespoke-creations` | `review-pending` | `review-pending` | `draft` |
| `bespoke-custom-monumental-sculptures-sculpture` | `JSC-CUST-BESP` | Bespoke Custom Monumental Sculptures Sculpture | `custom-bespoke-creations` | `review-pending` | `review-pending` | `draft` |
| `bespoke-lifesize-memorial-busts-sculpture` | `JSC-LIFE-BESP` | Bespoke Lifesize Memorial Busts Sculpture | `custom-bespoke-creations` | `review-pending` | `review-pending` | `draft` |
| `heritage-ancestral-portrait-carvings-design` | `JSC-ANCE-HERI` | Heritage Ancestral Portrait Carvings Design | `custom-bespoke-creations` | `review-pending` | `review-pending` | `draft` |
| `heritage-custom-monumental-sculptures-design` | `JSC-CUST-HERI` | Heritage Custom Monumental Sculptures Design | `custom-bespoke-creations` | `review-pending` | `review-pending` | `draft` |
| `heritage-lifesize-memorial-busts-design` | `JSC-LIFE-HERI` | Heritage Lifesize Memorial Busts Design | `custom-bespoke-creations` | `review-pending` | `review-pending` | `draft` |
| `royal-carved-ancestral-portrait-carvings` | `JSC-ANCE-ROYA` | Royal Carved Ancestral Portrait Carvings | `custom-bespoke-creations` | `review-pending` | `review-pending` | `draft` |
| `royal-carved-custom-monumental-sculptures` | `JSC-CUST-ROYA` | Royal Carved Custom Monumental Sculptures | `custom-bespoke-creations` | `review-pending` | `review-pending` | `draft` |
| `royal-carved-lifesize-memorial-busts` | `JSC-LIFE-ROYA` | Royal Carved Lifesize Memorial Busts | `custom-bespoke-creations` | `review-pending` | `review-pending` | `draft` |
| `traditional-ancestral-portrait-carvings` | `JSC-ANCE-TRAD` | Traditional Ancestral Portrait Carvings | `custom-bespoke-creations` | `review-pending` | `review-pending` | `draft` |
| `traditional-custom-monumental-sculptures` | `JSC-CUST-TRAD` | Traditional Custom Monumental Sculptures | `custom-bespoke-creations` | `review-pending` | `review-pending` | `draft` |
| `traditional-lifesize-memorial-busts` | `JSC-LIFE-TRAD` | Traditional Lifesize Memorial Busts | `custom-bespoke-creations` | `review-pending` | `review-pending` | `draft` |
| `bespoke-artisan-accessories-sculpture` | `JSC-ARTI-BESP` | Bespoke Artisan Accessories Sculpture | `decorative-stone-art` | `review-pending` | `review-pending` | `draft` |
| `bespoke-benches-seating-sculpture` | `JSC-BENC-BESP` | Bespoke Benches & Seating Sculpture | `decorative-stone-art` | `review-pending` | `review-pending` | `draft` |
| `bespoke-carved-stone-vases-sculpture` | `JSC-CARV-BESP` | Bespoke Carved Stone Vases Sculpture | `decorative-stone-art` | `review-pending` | `review-pending` | `draft` |
| `bespoke-decorative-bowls-sculpture` | `JSC-DECO-BESP` | Bespoke Decorative Bowls Sculpture | `decorative-stone-art` | `review-pending` | `review-pending` | `draft` |
| `bespoke-garden-lanterns-lamps-sculpture` | `JSC-GARD-BESP` | Bespoke Garden Lanterns & Lamps Sculpture | `decorative-stone-art` | `review-pending` | `review-pending` | `draft` |
| `bespoke-marble-urns-sculpture` | `JSC-MARB-BESP` | Bespoke Marble Urns Sculpture | `decorative-stone-art` | `review-pending` | `review-pending` | `draft` |
| `bespoke-tabletop-statuettes-sculpture` | `JSC-TABL-BESP` | Bespoke Tabletop Statuettes Sculpture | `decorative-stone-art` | `review-pending` | `review-pending` | `draft` |
| `heritage-artisan-accessories-design` | `JSC-ARTI-HERI` | Heritage Artisan Accessories Design | `decorative-stone-art` | `review-pending` | `review-pending` | `draft` |
| `heritage-benches-seating-design` | `JSC-BENC-HERI` | Heritage Benches & Seating Design | `decorative-stone-art` | `review-pending` | `review-pending` | `draft` |
| `heritage-carved-stone-vases-design` | `JSC-CARV-HERI` | Heritage Carved Stone Vases Design | `decorative-stone-art` | `review-pending` | `review-pending` | `draft` |
| `heritage-decorative-bowls-design` | `JSC-DECO-HERI` | Heritage Decorative Bowls Design | `decorative-stone-art` | `review-pending` | `review-pending` | `draft` |
| `heritage-garden-lanterns-lamps-design` | `JSC-GARD-HERI` | Heritage Garden Lanterns & Lamps Design | `decorative-stone-art` | `review-pending` | `review-pending` | `draft` |
| `heritage-marble-urns-design` | `JSC-MARB-HERI` | Heritage Marble Urns Design | `decorative-stone-art` | `review-pending` | `review-pending` | `draft` |
| `heritage-tabletop-statuettes-design` | `JSC-TABL-HERI` | Heritage Tabletop Statuettes Design | `decorative-stone-art` | `review-pending` | `review-pending` | `draft` |
| `royal-carved-artisan-accessories` | `JSC-ARTI-ROYA` | Royal Carved Artisan Accessories | `decorative-stone-art` | `review-pending` | `review-pending` | `draft` |
| `royal-carved-benches-seating` | `JSC-BENC-ROYA` | Royal Carved Benches & Seating | `decorative-stone-art` | `review-pending` | `review-pending` | `draft` |
| `royal-carved-carved-stone-vases` | `JSC-CARV-ROYA` | Royal Carved Carved Stone Vases | `decorative-stone-art` | `review-pending` | `review-pending` | `draft` |
| `royal-carved-decorative-bowls` | `JSC-DECO-ROYA` | Royal Carved Decorative Bowls | `decorative-stone-art` | `review-pending` | `review-pending` | `draft` |
| `royal-carved-garden-lanterns-lamps` | `JSC-GARD-ROYA` | Royal Carved Garden Lanterns & Lamps | `decorative-stone-art` | `review-pending` | `review-pending` | `draft` |
| `royal-carved-marble-urns` | `JSC-MARB-ROYA` | Royal Carved Marble Urns | `decorative-stone-art` | `review-pending` | `review-pending` | `draft` |
| `royal-carved-tabletop-statuettes` | `JSC-TABL-ROYA` | Royal Carved Tabletop Statuettes | `decorative-stone-art` | `review-pending` | `review-pending` | `draft` |
| `traditional-artisan-accessories` | `JSC-ARTI-TRAD` | Traditional Artisan Accessories | `decorative-stone-art` | `review-pending` | `review-pending` | `draft` |
| `traditional-benches-seating` | `JSC-BENC-TRAD` | Traditional Benches & Seating | `decorative-stone-art` | `review-pending` | `review-pending` | `draft` |
| `traditional-carved-stone-vases` | `JSC-CARV-TRAD` | Traditional Carved Stone Vases | `decorative-stone-art` | `review-pending` | `review-pending` | `draft` |
| `traditional-decorative-bowls` | `JSC-DECO-TRAD` | Traditional Decorative Bowls | `decorative-stone-art` | `review-pending` | `review-pending` | `draft` |
| `traditional-garden-lanterns-lamps` | `JSC-GARD-TRAD` | Traditional Garden Lanterns & Lamps | `decorative-stone-art` | `review-pending` | `review-pending` | `draft` |
| `traditional-marble-urns` | `JSC-MARB-TRAD` | Traditional Marble Urns | `decorative-stone-art` | `review-pending` | `review-pending` | `draft` |
| `traditional-tabletop-statuettes` | `JSC-TABL-TRAD` | Traditional Tabletop Statuettes | `decorative-stone-art` | `review-pending` | `review-pending` | `draft` |

### Breakdown by Collection:
- **`custom-bespoke-creations` (12 products):**  
  - `bespoke-ancestral-portrait-carvings-sculpture`  
  - `bespoke-custom-monumental-sculptures-sculpture`  
  - `bespoke-lifesize-memorial-busts-sculpture`  
  - `heritage-ancestral-portrait-carvings-design`  
  - `heritage-custom-monumental-sculptures-design`  
  - `heritage-lifesize-memorial-busts-design`  
  - `imperial-ancestral-portrait-carvings-statue`  
  - `imperial-custom-monumental-sculptures-statue`  
  - `imperial-lifesize-memorial-busts-statue`  
  - `royal-ancestral-portrait-carvings-craft`  
  - `royal-custom-monumental-sculptures-craft`  
  - `royal-lifesize-memorial-busts-craft`  

- **`decorative-stone-art` (28 products):**  
  - 4 products of type `artisan-accessories`  
  - 4 products of type `benches-seating`  
  - 4 products of type `carved-stone-vases`  
  - 4 products of type `decorative-bowls`  
  - 4 products of type `garden-lanterns-lamps`  
  - 4 products of type `marble-urns`  
  - 4 products of type `tabletop-statuettes`  

---

## 2. Active Categories with ZERO Products (8 Items)

**Evidence:** These 8 categories are marked `is_active = 1` in MySQL and exist in `content/categories.js`. Their public URL renders 200 OK, but displays "No products found".

| Category Slug | Category Name | Parent Subcategory | Parent Collection | Public Route |
|---|---|---|---|---|
| `marble-tulsi-pots` | **Marble Tulsi Pots** | `tulsi-pots` | `decorative-stone-art` | [`/collections/decorative-stone-art/tulsi-pots/marble-tulsi-pots`](/collections/decorative-stone-art/tulsi-pots/marble-tulsi-pots) |
| `custom-animal-figures` | **Custom Animal Figures** | `animal-bird-sculptures` | `sculptures-statues` | [`/collections/sculptures-statues/animal-bird-sculptures/custom-animal-figures`](/collections/sculptures-statues/animal-bird-sculptures/custom-animal-figures) |
| `abstract-form-sculptures` | **Abstract Form Sculptures** | `classical-artistic-sculptures` | `sculptures-statues` | [`/collections/sculptures-statues/classical-artistic-sculptures/abstract-form-sculptures`](/collections/sculptures-statues/classical-artistic-sculptures/abstract-form-sculptures) |
| `modernist-carvings` | **Modernist Carvings** | `classical-artistic-sculptures` | `sculptures-statues` | [`/collections/sculptures-statues/classical-artistic-sculptures/modernist-carvings`](/collections/sculptures-statues/classical-artistic-sculptures/modernist-carvings) |
| `lakshmi-ji` | **Lakshmi Ji** | `hindu-sculptures` | `sculptures-statues` | [`/collections/sculptures-statues/hindu-sculptures/lakshmi-ji`](/collections/sculptures-statues/hindu-sculptures/lakshmi-ji) |
| `bespoke-portrait-busts` | **Bespoke Portrait Busts** | `human-portrait-sculptures` | `sculptures-statues` | [`/collections/sculptures-statues/human-portrait-sculptures/bespoke-portrait-busts`](/collections/sculptures-statues/human-portrait-sculptures/bespoke-portrait-busts) |
| `full-body-figures` | **Full Body Figures** | `human-portrait-sculptures` | `sculptures-statues` | [`/collections/sculptures-statues/human-portrait-sculptures/full-body-figures`](/collections/sculptures-statues/human-portrait-sculptures/full-body-figures) |
| `artisan-figures` | **Artisan Figures** | `human-portrait-sculptures` | `sculptures-statues` | [`/collections/sculptures-statues/human-portrait-sculptures/artisan-figures`](/collections/sculptures-statues/human-portrait-sculptures/artisan-figures) |

---

## 3. Subcategories with ZERO Child Categories (5 Items)

**Evidence:** These 5 subcategories exist in the MySQL `subcategories` table, but have 0 corresponding records in `categories`. All 5 are currently marked `is_active = 0`.

| Subcategory ID | Subcategory Slug | Subcategory Name | Parent Collection | Status |
|---|---|---|---|---|
| `custom-bespoke-creations-custom-architectural-projects` | `custom-architectural-projects` | **Custom Architectural Projects** | `custom-bespoke-creations` | `inactive` |
| `decorative-stone-art-planters-tulsi-pots` | `planters-tulsi-pots` | **Marble & Stone Planters & Tulsi Pots** | `decorative-stone-art` | `inactive` |
| `decorative-stone-art-decorative-accents` | `decorative-accents` | **Decorative Accents** | `decorative-stone-art` | `inactive` |
| `temples-architectural-stonework-other-temple-stone-parts` | `other-temple-stone-parts` | **Other Temple & Stone Parts** | `temples-architectural-stonework` | `inactive` |
| `wall-art-reliefs-relief-panels` | `relief-panels` | **Stone Relief Panels** | `wall-art-reliefs` | `inactive` |

---

## 4. Inactive Taxonomy Entities in Database (23 Subcategories + 61 Categories)

These entities exist in MySQL from past data schemas or staging, but are deactivated (`is_active = 0`) and completely omitted from static application code (`content/collections.js` and `content/categories.js`).

### 4.1 Inactive Subcategories (23 Records)
| Subcategory Slug | Display Name | Parent Collection | DB ID |
|---|---|---|---|
| `custom-sculptures` | **Custom Sculptures** | `custom-bespoke-creations` | `custom-bespoke-creations-custom-sculptures` |
| `custom-portraits` | **Custom Portraits** | `custom-bespoke-creations` | `custom-bespoke-creations-custom-portraits` |
| `custom-architectural-projects` | **Custom Architectural Projects** | `custom-bespoke-creations` | `custom-bespoke-creations-custom-architectural-projects` |
| `interior-stone-decor` | **Interior Stone Décor** | `decorative-stone-art` | `decorative-stone-art-interior-stone-decor` |
| `planters-tulsi-pots` | **Marble & Stone Planters & Tulsi Pots** | `decorative-stone-art` | `decorative-stone-art-planters-tulsi-pots` |
| `small-sculptural-art` | **Small Sculptural Art** | `decorative-stone-art` | `decorative-stone-art-small-sculptural-art` |
| `decorative-accents` | **Decorative Accents** | `decorative-stone-art` | `decorative-stone-art-decorative-accents` |
| `garden-outdoor-stone-art` | **Garden & Outdoor Stone Art** | `decorative-stone-art` | `decorative-stone-art-garden-outdoor-stone-art` |
| `classical-fountains` | **Classical Fountains** | `fountains-water-features` | `fountains-water-features-classical-fountains` |
| `garden-fountains` | **Garden Fountains** | `fountains-water-features` | `fountains-water-features-garden-fountains` |
| `sculptural-fountains` | **Sculptural Fountains** | `fountains-water-features` | `fountains-water-features-sculptural-fountains` |
| `architectural-water-features` | **Architectural Water Features** | `fountains-water-features` | `fountains-water-features-architectural-water-features` |
| `home-mandirs` | **Home Mandirs** | `temples-architectural-stonework` | `temples-architectural-stonework-home-mandirs` |
| `mandir-temple` | **Mandir & Temple** | `temples-architectural-stonework` | `temples-architectural-stonework-mandir-temple` |
| `jali` | **Jali** | `temples-architectural-stonework` | `temples-architectural-stonework-jali` |
| `temple-architecture` | **Temple Architecture** | `temples-architectural-stonework` | `temples-architectural-stonework-temple-architecture` |
| `architectural-elements` | **Architectural Elements** | `temples-architectural-stonework` | `temples-architectural-stonework-architectural-elements` |
| `other-temple-stone-parts` | **Other Temple & Stone Parts** | `temples-architectural-stonework` | `temples-architectural-stonework-other-temple-stone-parts` |
| `religious-spiritual-reliefs` | **Religious & Spiritual Reliefs** | `wall-art-reliefs` | `wall-art-reliefs-religious-spiritual-reliefs` |
| `indian-heritage-cultural-murals` | **Indian Heritage & Cultural Murals** | `wall-art-reliefs` | `wall-art-reliefs-indian-heritage-cultural-murals` |
| `relief-panels` | **Stone Relief Panels** | `wall-art-reliefs` | `wall-art-reliefs-relief-panels` |
| `custom-wall-art` | **Custom Wall Art** | `wall-art-reliefs` | `wall-art-reliefs-custom-wall-art` |
| `decorative-reliefs` | **Decorative Reliefs** | `wall-art-reliefs` | `wall-art-reliefs-decorative-reliefs` |

### 4.2 Inactive Categories (61 Records)
| Category Slug | Display Name | Parent Subcategory | Parent Collection | DB ID |
|---|---|---|---|---|
| `lifesize-memorial-busts` | **Lifesize Memorial Busts** | `custom-portraits` | `custom-bespoke-creations` | `lifesize-memorial-busts` |
| `ancestral-portrait-carvings` | **Ancestral Portrait Carvings** | `custom-portraits` | `custom-bespoke-creations` | `ancestral-portrait-carvings` |
| `bespoke-deity-statues` | **Bespoke Deity Statues** | `custom-sculptures` | `custom-bespoke-creations` | `bespoke-deity-statues` |
| `custom-monumental-sculptures` | **Custom Monumental Sculptures** | `custom-sculptures` | `custom-bespoke-creations` | `custom-monumental-sculptures` |
| `commissioned-statuary` | **Commissioned Statuary** | `custom-sculptures` | `custom-bespoke-creations` | `commissioned-statuary` |
| `stone-planters` | **Stone Planters** | `garden-outdoor-stone-art` | `decorative-stone-art` | `stone-planters` |
| `garden-lanterns-lamps` | **Garden Lanterns & Lamps** | `garden-outdoor-stone-art` | `decorative-stone-art` | `garden-lanterns-lamps` |
| `benches-seating` | **Benches & Seating** | `garden-outdoor-stone-art` | `decorative-stone-art` | `benches-seating` |
| `carved-stone-vases` | **Carved Stone Vases** | `interior-stone-decor` | `decorative-stone-art` | `carved-stone-vases` |
| `pedestals-plinths` | **Pedestals & Plinths** | `interior-stone-decor` | `decorative-stone-art` | `pedestals-plinths` |
| `marble-urns` | **Marble Urns** | `interior-stone-decor` | `decorative-stone-art` | `marble-urns` |
| `decorative-bowls` | **Decorative Bowls** | `interior-stone-decor` | `decorative-stone-art` | `decorative-bowls` |
| `tabletop-statuettes` | **Tabletop Statuettes** | `small-sculptural-art` | `decorative-stone-art` | `tabletop-statuettes` |
| `miniature-reliefs` | **Miniature Reliefs** | `small-sculptural-art` | `decorative-stone-art` | `miniature-reliefs` |
| `artisan-accessories` | **Artisan Accessories** | `small-sculptural-art` | `decorative-stone-art` | `artisan-accessories` |
| `poolside-stone-waterfalls` | **Poolside Stone Waterfalls** | `architectural-water-features` | `fountains-water-features` | `poolside-stone-waterfalls` |
| `spout-fountains` | **Spout Fountains** | `architectural-water-features` | `fountains-water-features` | `spout-fountains` |
| `heritage-palace-water-features` | **Heritage Palace Water Features** | `architectural-water-features` | `fountains-water-features` | `heritage-palace-water-features` |
| `tiered-water-fountains` | **Tiered Water Fountains** | `classical-fountains` | `fountains-water-features` | `tiered-water-fountains` |
| `central-courtyard-fountains` | **Central Courtyard Fountains** | `classical-fountains` | `fountains-water-features` | `central-courtyard-fountains` |
| `lotus-basin-fountains` | **Lotus Basin Fountains** | `classical-fountains` | `fountains-water-features` | `lotus-basin-fountains` |
| `pedestal-fountains` | **Pedestal Fountains** | `classical-fountains` | `fountains-water-features` | `pedestal-fountains` |
| `garden-fountains` | **Garden Fountains** | `garden-fountains` | `fountains-water-features` | `garden-fountains` |
| `figurative-water-sculptures` | **Figurative Water Sculptures** | `sculptural-fountains` | `fountains-water-features` | `figurative-water-sculptures` |
| `cascading-water-walls` | **Cascading Water Walls** | `sculptural-fountains` | `fountains-water-features` | `cascading-water-walls` |
| `abstract-water-sculptures` | **Abstract Water Sculptures** | `sculptural-fountains` | `fountains-water-features` | `abstract-water-sculptures` |
| `carved-pillars-columns` | **Carved Pillars & Columns** | `architectural-elements` | `temples-architectural-stonework` | `carved-pillars-columns` |
| `jali-screens` | **Jali Screens** | `architectural-elements` | `temples-architectural-stonework` | `jali-screens` |
| `stone-balustrades` | **Stone Balustrades** | `architectural-elements` | `temples-architectural-stonework` | `stone-balustrades` |
| `stone-door-frames` | **Stone Door Frames** | `architectural-elements` | `temples-architectural-stonework` | `stone-door-frames` |
| `bespoke-facade-elements` | **Bespoke Facade Elements** | `custom-architectural-stonework` | `temples-architectural-stonework` | `bespoke-facade-elements` |
| `custom-heritage-columns` | **Custom Heritage Columns** | `custom-architectural-stonework` | `temples-architectural-stonework` | `custom-heritage-columns` |
| `portico-carvings` | **Portico Carvings** | `custom-architectural-stonework` | `temples-architectural-stonework` | `portico-carvings` |
| `marble-home-temples` | **Marble Home Temples** | `home-mandirs` | `temples-architectural-stonework` | `marble-home-temples` |
| `carved-mandir-arches` | **Carved Mandir Arches** | `home-mandirs` | `temples-architectural-stonework` | `carved-mandir-arches` |
| `pooja-room-panels` | **Pooja Room Panels** | `home-mandirs` | `temples-architectural-stonework` | `pooja-room-panels` |
| `compact-wall-mandirs` | **Compact Wall Mandirs** | `home-mandirs` | `temples-architectural-stonework` | `compact-wall-mandirs` |
| `window-jali` | **Window Jali** | `jali` | `temples-architectural-stonework` | `window-jali` |
| `floor-standing-marble-mandir` | **Floor-Standing Marble Mandir** | `mandir-temple` | `temples-architectural-stonework` | `floor-standing-marble-mandir` |
| `large-marble-temple` | **Large Marble Temple** | `mandir-temple` | `temples-architectural-stonework` | `large-marble-temple` |
| `marble-pillars` | **Marble Pillars** | `pillars-columns` | `temples-architectural-stonework` | `marble-pillars` |
| `stone-pillars` | **Stone Pillars** | `pillars-columns` | `temples-architectural-stonework` | `stone-pillars` |
| `decorative-pillars` | **Decorative Pillars** | `pillars-columns` | `temples-architectural-stonework` | `decorative-pillars` |
| `shikhara-domes` | **Shikhara & Domes** | `temple-architecture` | `temples-architectural-stonework` | `shikhara-domes` |
| `garbhagriha-architecture` | **Garbhagriha Architecture** | `temple-architecture` | `temples-architectural-stonework` | `garbhagriha-architecture` |
| `pillared-mandapas` | **Pillared Mandapas** | `temple-architecture` | `temples-architectural-stonework` | `pillared-mandapas` |
| `intricate-torans` | **Intricate Torans** | `temple-architecture` | `temples-architectural-stonework` | `intricate-torans` |
| `architectural-accent-murals` | **Architectural Accent Murals** | `custom-wall-art` | `wall-art-reliefs` | `architectural-accent-murals` |
| `bespoke-feature-walls` | **Bespoke Feature Walls** | `custom-wall-art` | `wall-art-reliefs` | `bespoke-feature-walls` |
| `custom-crests-logos` | **Custom Crests & Logos** | `custom-wall-art` | `wall-art-reliefs` | `custom-crests-logos` |
| `floral-pattern-panels` | **Floral Pattern Panels** | `decorative-reliefs` | `wall-art-reliefs` | `floral-pattern-panels` |
| `geometric-carved-walls` | **Geometric Carved Walls** | `decorative-reliefs` | `wall-art-reliefs` | `geometric-carved-walls` |
| `botanical-reliefs` | **Botanical Reliefs** | `decorative-reliefs` | `wall-art-reliefs` | `botanical-reliefs` |
| `modern-textured-stone-walls` | **Modern Textured Stone Walls** | `decorative-reliefs` | `wall-art-reliefs` | `modern-textured-stone-walls` |
| `royal-court-panels` | **Royal Court Panels** | `indian-heritage-cultural-murals` | `wall-art-reliefs` | `royal-court-panels` |
| `traditional-procession-murals` | **Traditional Procession Murals** | `indian-heritage-cultural-murals` | `wall-art-reliefs` | `traditional-procession-murals` |
| `rajasthani-heritage-scenes` | **Rajasthani Heritage Scenes** | `indian-heritage-cultural-murals` | `wall-art-reliefs` | `rajasthani-heritage-scenes` |
| `jharokha-relief-panels` | **Jharokha Relief Panels** | `indian-heritage-cultural-murals` | `wall-art-reliefs` | `jharokha-relief-panels` |
| `temple-wall-murals` | **Temple Wall Murals** | `religious-spiritual-reliefs` | `wall-art-reliefs` | `temple-wall-murals` |
| `mandala-wall-art` | **Mandala Wall Art** | `religious-spiritual-reliefs` | `wall-art-reliefs` | `mandala-wall-art` |
| `tree-of-life-relief` | **Tree of Life Relief** | `religious-spiritual-reliefs` | `wall-art-reliefs` | `tree-of-life-relief` |

---

## 5. Draft Products Accessible Directly but Hidden from Browsing (304 Items)

**Evidence:**
1. `app/collections/[collection]/[subcategory]/[category]/page.js` invokes:
   `SELECT * FROM products WHERE parent_category = ? AND status = 'published'`
   Therefore, 304 draft products are **filtered out** of category product grids.
2. `app/designs/[category]/[design]/page.js` invokes:
   `SELECT * FROM products WHERE slug = ? AND parent_category = ?` without checking `status`.
   Therefore, any of the 304 draft products can be viewed if a user knows the exact URL.
3. `app/sitemap.js` queries `status = 'published'`, so draft products are **excluded from the sitemap**.

---

## 6. Configured Legacy Redirects Register

The project has redirect rules configured in two locations:
1. `next.config.mjs` (Next.js server-level 301 redirects)
2. `app/collections/[collection]/[subcategory]/[category]/page.js` (Component-level `LEGACY_CATEGORY_REDIRECTS`)

### 6.1 Subcategory Redirects in `next.config.mjs`
| Legacy Source URL | Destination URL | Status Code |
|---|---|---|
| `/collections/temples-architectural-stonework/mandir-temple` | `/collections/temples-architectural-stonework/mandirs-temples` | 308 (permanent: true) |
| `/collections/temples-architectural-stonework/home-mandirs` | `/collections/temples-architectural-stonework/mandirs-temples` | 308 (permanent: true) |
| `/collections/temples-architectural-stonework/temple-architecture` | `/collections/temples-architectural-stonework/mandirs-temples` | 308 (permanent: true) |
| `/collections/temples-architectural-stonework/jali` | `/collections/temples-architectural-stonework/jali-designs` | 308 (permanent: true) |
| `/collections/temples-architectural-stonework/architectural-elements` | `/collections/temples-architectural-stonework/architectural-components` | 308 (permanent: true) |
| `/collections/temples-architectural-stonework/other-temple-stone-parts` | `/collections/temples-architectural-stonework/architectural-components` | 308 (permanent: true) |
| `/collections/wall-art-reliefs/relief-panels` | `/collections/wall-art-reliefs/stone-relief-panels` | 308 (permanent: true) |
| `/collections/fountains-water-features/water-fountains` | `/collections/fountains-water-features/freestanding-fountains` | 308 (permanent: true) |
| `/collections/decorative-stone-art/garden-outdoor-stone-art` | `/collections/decorative-stone-art/planters` | 308 (permanent: true) |
| `/collections/decorative-stone-art/interior-stone-decor` | `/collections/decorative-stone-art/pedestals-stands` | 308 (permanent: true) |
| `/collections/decorative-stone-art/small-sculptural-art` | `/collections/decorative-stone-art/pedestals-stands` | 308 (permanent: true) |
| `/collections/decorative-stone-art/decorative-accents` | `/collections/decorative-stone-art/pedestals-stands` | 308 (permanent: true) |
| `/collections/custom-bespoke-creations/custom-architectural-projects` | `/collections/custom-bespoke-creations/custom-architectural-stonework` | 308 (permanent: true) |
| `/collections/custom-bespoke-creations/custom-portraits` | `/collections/custom-bespoke-creations/custom-wall-art-reliefs` | 308 (permanent: true) |
| `/collections/custom-bespoke-creations/custom-sculptures` | `/collections/custom-bespoke-creations/custom-architectural-stonework` | 308 (permanent: true) |

### 6.2 Component-Level Legacy Category Redirects in `page.js`
58 category-level slugs are redirected to new canonical paths (e.g., `compact-wall-mandirs` → `/collections/temples-architectural-stonework/mandirs-temples/small-marble-mandir-for-home`).

---

## 7. Redirect Chains and Loops Analysis

- **Loop Check:** All destinations in `next.config.mjs` point to active, non-redirected routes. No redirect loops were detected.
- **Product Slug Fallback:** In `app/designs/[category]/[design]/page.js`, if a product is accessed with an incorrect category slug, the code attempts to look up the product by slug alone and issues a `permanentRedirect` to the correct `/designs/[true_category]/[slug]`.
  - *Risk:* If a product slug is queried that has `parent_category = 'review-pending'`, requesting it with an invalid category will redirect to `/designs/review-pending/[slug]`, which renders 200 OK without a category breadcrumb.
