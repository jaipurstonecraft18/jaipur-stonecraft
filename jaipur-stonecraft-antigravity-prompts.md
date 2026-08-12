============================================================
STEP 1 — PROJECT INSPECTION, DOCUMENTATION ANALYSIS & SETUP
============================================================

OBJECTIVE

Establish the technical foundation of the Jaipur Stonecraft website. Inspect the current workspace, understand the project requirements, and configure a clean Next.js project ready for a premium, image-first, inquiry-focused website.

READ / CONSIDER

Read all files in /docs before doing anything else:
/docs/PROJECT.md
/docs/REQUIREMENTS.md
/docs/DESIGN.md
/docs/PAGES.md
/docs/COMPONENTS.md
/docs/RULES.md
/docs/TASKS.md

These files define the entire project. Treat them as the source of truth for every decision in this step and all future steps.

CURRENT STATE

The workspace may be empty, or may already contain a partial project. Do not assume either. Inspect the workspace root first.

INSTRUCTIONS

1. Inspect the workspace. If a Next.js project already exists, understand its structure, dependencies, and configuration before changing anything. Do not delete or restart an existing project.
2. If the workspace is empty, initialize a new Next.js project using the App Router, JavaScript (not TypeScript), and CSS Modules for styling. Do not add Tailwind CSS. Do not add TypeScript. Do not add a UI component library.
3. Keep dependencies minimal. Only add packages that are clearly necessary (e.g. a lightweight icon package if needed later). Do not add state-management libraries, GraphQL, or CMS packages at this stage.
4. Set up the following top-level folder structure (adjust naming only if there is a clear Next.js convention reason to do so):
   /app — routes, following Next.js App Router conventions
   /components — reusable UI components
   /content — centralized JS content files (site.js, collections.js, products.js, projects.js, etc.)
   /public/images — organized into subfolders: /hero, /collections, /products, /projects, /craftsmanship, /brand
   /styles — global styles, variables, resets
5. Create a basic README.md placeholder (this will be expanded in a later step) noting that the project is Jaipur Stonecraft, built with Next.js, JavaScript, and CSS Modules.
6. Confirm the dev server runs cleanly with no errors.
7. Do not build any pages, components, or design system elements yet. This step is purely technical setup.

CONSTRAINTS

- Do not use TypeScript.
- Do not use Tailwind CSS.
- Do not add unnecessary dependencies.
- Do not build any UI, pages, or components in this step.
- Do not invent any business content.
- Do not restart or discard an existing project if one is found.

VERIFY

- Confirm `npm run dev` (or equivalent) starts without errors.
- Confirm the folder structure exists as described.
- Confirm no console errors appear on the default page.
- Confirm no unnecessary dependencies were added.

COMPLETION CRITERIA

The project runs locally with a clean Next.js App Router setup, the agreed folder structure exists, and no design or page work has been started yet.

STOP

Complete only this step. Verify the result. Do not begin future steps. Stop when this step is complete and wait for the next instruction.


============================================================
STEP 2 — DESIGN SYSTEM: TYPOGRAPHY, COLOR, SPACING & CORE UI PRIMITIVES
============================================================

OBJECTIVE

Implement the foundational design system — typography, color variables, spacing, containers, sections, and buttons — exactly as defined in DESIGN.md, so that every future component is built on a consistent, premium visual foundation.

READ / CONSIDER

Before implementing, read /docs/DESIGN.md and /docs/RULES.md.

CURRENT STATE

The Next.js project is initialized with the folder structure from Step 1. No design system or components exist yet. Continue from the existing implementation; do not recreate the project.

INSTRUCTIONS

1. Implement global CSS variables for the color palette exactly as defined in DESIGN.md:
   --color-charcoal: #1A1918
   --color-cream: #FCFBF9
   --color-bronze: #9E7B4F
   --color-stone-grey: #E8E4DF
   Do not introduce any additional colors outside this palette without explicit instruction.
2. Load and configure the typography system:
   - Heading font: Cormorant Garamond (fallback Georgia)
   - Body font: Inter (fallback system sans-serif)
   Use Next.js font optimization (next/font) to load these efficiently. Define heading and body type scales with generous line-height and letter-spacing appropriate for an editorial, luxury feel. Avoid heavy weights, excessive uppercase, and tight line spacing per DESIGN.md.
3. Implement a spacing system based on the 100–120px vertical section spacing guidance for desktop, scaling down responsibly on tablet and mobile. Use CSS variables or a consistent spacing scale rather than arbitrary magic numbers.
4. Build the Container component: max-width 1280px, consistent horizontal padding, responsive at all breakpoints.
5. Build the Section component: supports light background, dark background, standard spacing, and large spacing variants, per COMPONENTS.md.
6. Build PrimaryButton, SecondaryButton, and TextLink components per COMPONENTS.md and DESIGN.md:
   - PrimaryButton: Champagne Bronze or Charcoal depending on background, simple and refined, no pill shapes, no neon, no heavy shadows.
   - SecondaryButton: minimal outline or text-based.
   - TextLink: for secondary navigation and small contextual actions.
7. Define responsive breakpoints for desktop, tablet, and mobile, and document them clearly in the styles folder.
8. Implement a minimal, reusable animation utility (fade-in, gentle scale, scroll reveal) that respects `prefers-reduced-motion`. Keep this lightweight — do not add a heavy animation library unless clearly justified.
9. Create a simple style-guide or internal test route (e.g. /style-guide, not linked in navigation) that renders the color palette, typography scale, buttons, container, and sections so the implementation can be visually verified.

CONSTRAINTS

- Do not introduce colors outside the four defined in DESIGN.md.
- Do not use Tailwind CSS.
- Do not build page-specific components yet (Header, Footer, Hero, cards, etc.) — this step is strictly the design system.
- Do not add heavy animation libraries.
- Do not skip reduced-motion support.

VERIFY

- Open the temporary style-guide route in the browser and visually confirm colors, typography, spacing, buttons, and sections match DESIGN.md.
- Confirm the site loads correctly on desktop, tablet, and mobile widths.
- Confirm no console errors.
- Confirm fonts load correctly with no layout shift issues.

COMPLETION CRITERIA

A working, visually verifiable design system exists: colors, typography, spacing, container, sections, and buttons, all matching DESIGN.md, with reduced-motion-aware animation utilities in place.

STOP

Complete only this step. Verify the result. Do not begin future steps. Stop when this step is complete and wait for the next instruction.


============================================================
STEP 3 — GLOBAL LAYOUT: HEADER, NAVIGATION, FOOTER & FOUNDATIONAL COMPONENTS
============================================================

OBJECTIVE

Build the global structural components that will appear on every page: Header (with transparent/light/dark states), desktop and mobile navigation, Footer, WhatsApp button, and Breadcrumbs.

READ / CONSIDER

Read /docs/COMPONENTS.md, /docs/DESIGN.md, and /docs/PAGES.md (Global Navigation section) before implementing.

CURRENT STATE

The design system from Step 2 exists (colors, typography, spacing, container, sections, buttons). No global layout components exist yet. Preserve all work from Step 1 and Step 2; do not recreate the design system.

INSTRUCTIONS

1. Build the Header component per COMPONENTS.md, supporting three states: transparent (for hero overlays), light background, and dark background. It should contain: logo (use a [BRAND LOGO] placeholder), navigation, and the "Request a Quote" primary CTA.
2. Implement desktop navigation using the items from PAGES.md: Home, Collections, Projects, Craftsmanship, Our Story, Export, Contact — with "Request a Quote" as the primary CTA, styled distinctly from the nav links.
3. Implement mobile navigation as a clean, spacious, accessible menu (e.g. slide-in or full-screen overlay), keyboard-navigable, with visible focus states, and easy access to "Request a Quote" and WhatsApp.
4. Build the Footer component per COMPONENTS.md: logo, short brand description (using placeholder copy consistent with RULES.md — do not invent unverified claims), navigation, collections links, contact info (using placeholders like [PHONE NUMBER], [EMAIL ADDRESS], [BUSINESS ADDRESS]), social links (using placeholders like [INSTAGRAM URL], [PINTEREST URL]), and legal links.
5. Build the WhatsAppButton component: persistent but subtle, especially prominent and easily tappable on mobile, using a placeholder [WHATSAPP NUMBER].
6. Build the Breadcrumbs component for future use on Collection, Product, Project, and Blog pages, per COMPONENTS.md.
7. Wire up routing placeholders (empty or minimal placeholder pages) for all top-level routes referenced in navigation, so links do not 404: /, /collections, /projects, /craftsmanship, /our-story, /export, /contact. Do not build out full page content yet — that happens in later steps.
8. Ensure the Header correctly switches between transparent/light/dark states depending on the page or section it sits on (this will be used starting with the homepage hero in Step 4).
9. Apply accessibility requirements from RULES.md: semantic HTML, proper aria labels for nav and menu toggles, keyboard operability, visible focus states, sufficient color contrast.

CONSTRAINTS

- Do not invent real contact information, social handles, or business claims — use explicit placeholders only.
- Do not build homepage or inner-page content in this step.
- Do not duplicate components that already exist in the design system from Step 2 — reuse Container, Section, buttons, and typography.
- Do not add a CMS or dynamic navigation data source; a simple content file (e.g. /content/site.js) is sufficient for nav items and contact placeholders.

VERIFY

- Confirm the Header renders correctly in transparent, light, and dark states.
- Confirm desktop and mobile navigation both work, including keyboard navigation and focus states.
- Confirm the Footer renders with correct placeholder content and links do not 404.
- Confirm the WhatsApp button is visible and functions (opens a WhatsApp link using the placeholder number) on both desktop and mobile.
- Confirm no horizontal overflow or layout breakage on any breakpoint.
- Confirm no console errors.

COMPLETION CRITERIA

A fully functional, accessible, responsive global layout exists — Header (all three states), desktop and mobile navigation, Footer, WhatsApp button, and Breadcrumbs — reused consistently and ready to wrap all future pages.

STOP

Complete only this step. Verify the result. Do not begin future steps. Stop when this step is complete and wait for the next instruction.


============================================================
STEP 4 — HOMEPAGE
============================================================

OBJECTIVE

Build the homepage — the most important page on the site — following the exact section structure in PAGES.md, with an exceptional, editorial, image-dominant hero and a composition that feels like a luxury stone atelier rather than a template.

READ / CONSIDER

Read /docs/PAGES.md (Section 1: HOME), /docs/DESIGN.md, and /docs/COMPONENTS.md before implementing.

CURRENT STATE

The design system (Step 2) and global layout (Step 3) exist and are functional. The homepage route exists as a placeholder. Continue from the existing implementation; preserve the Header, Footer, WhatsApp button, and design system exactly as built.

INSTRUCTIONS

Build the following homepage sections in order, using existing components (Container, Section, buttons, SectionHeading) wherever possible, and creating new components only where COMPONENTS.md indicates they don't already exist:

1. Hero — Use the Hero component (image or video, heading, description, primary CTA "Explore Collections", secondary CTA "Discuss Your Project"). Use a placeholder [HERO IMAGE] or [HERO VIDEO]. Headline direction: something communicating "Stone, Shaped by Generations" per PAGES.md — do not invent unverified brand history; keep language consistent with RULES.md Section 4 (brand age). This hero must be visually dominant and sophisticated — avoid a generic centered-text-over-image layout; consider asymmetric composition, strong typographic hierarchy, and cinematic framing. The Header should render in its transparent state over this hero.
2. Introduction — A short brand introduction explaining that Jaipur Stonecraft is a new brand built on generational family craftsmanship. Use ImageWithText or a simple editorial text section.
3. Collections — Visual showcase of the five collection categories (Sacred Sanctuaries, Architectural Stone, Garden & Water, Luxury Stone Objects, Custom & Tribute) using CollectionCard components, linking to placeholder collection routes.
4. Craftsmanship — Showcase artisans, tools, stone, carving, and finishing using ImageWithText and/or Gallery components with placeholder imagery.
5. Featured Projects — Showcase a small set of placeholder finished projects using ProjectCard components.
6. Why Jaipur Stonecraft — Use FeatureCards for verified-claim-only trust points (e.g. Generational Craftsmanship, Custom Manufacturing, Skilled Artisans, Export Experience) with placeholder supporting copy flagged as needing review before launch.
7. Custom Projects — Explain that customers can bring their own idea, image, sketch, reference, or dimensions. CTA: "Start a Custom Project" linking to the future Custom Projects page.
8. Export — Brief introduction to international capability, using placeholder text, linking to the future Export page.
9. Final CTA — Use the CTASection component with "Request a Quote" as the primary action.

CONSTRAINTS

- Do not invent testimonials, awards, certifications, client names, country counts, or years of operation.
- Do not claim the brand itself has existed for generations — only the family craftsmanship.
- Do not create new components that duplicate existing ones (e.g. do not create a second card component if CollectionCard/ProjectCard already covers the need).
- Do not overcrowd the hero — follow DESIGN.md Section 7.
- Do not exceed reasonable card counts per section — avoid a dense, marketplace-like feel.

VERIFY

- Visually inspect the rendered homepage in the browser at desktop, tablet, and mobile widths.
- Confirm the Header transparent-to-solid transition (if used on scroll) works smoothly.
- Confirm all section CTAs link to the correct (even if placeholder) routes.
- Confirm no console errors and no layout overflow.
- Perform the visual self-critique from RULES.md/PROJECT prompt: Does this look like a premium stone atelier? Is imagery dominant? Is hierarchy strong? Does it look intentionally designed rather than templated? Improve before marking complete if not.

COMPLETION CRITERIA

A complete, polished, responsive homepage exists with all nine sections from PAGES.md, using only reused/appropriate components, placeholder content where real content is unavailable, and no fabricated business claims.

STOP

Complete only this step. Verify the result. Do not begin future steps. Stop when this step is complete and wait for the next instruction.


============================================================
STEP 5 — COLLECTIONS OVERVIEW & COLLECTION DETAIL TEMPLATE
============================================================

OBJECTIVE

Build the Collections overview page and a reusable Collection Detail page template covering the five collection categories defined in PROJECT.md and PAGES.md.

READ / CONSIDER

Read /docs/PAGES.md (Sections 2 and 3), /docs/PROJECT.md (Section 3), and /docs/COMPONENTS.md before implementing.

CURRENT STATE

Homepage, global layout, and design system are complete and functional. Continue from the existing implementation; reuse CollectionCard, SectionHeading, Gallery, Container, Section, and CTASection components rather than recreating them.

INSTRUCTIONS

1. Create a centralized content file (e.g. /content/collections.js) defining the five collections: Sacred Sanctuaries, Architectural Stone, Garden & Water, Luxury Stone Objects, Custom & Tribute — including name, short description, subcategories (from PROJECT.md Section 3), and placeholder image references. This file should be the single source of truth so future content edits don't require touching component code.
2. Build the Collections Overview page: an editorial grid or list (not a dense ecommerce catalog) showcasing all five collections using CollectionCard, each linking to its detail page.
3. Build a single, reusable Collection Detail page template (dynamic route, e.g. /app/collections/[slug]/page.js) that renders: Hero, collection introduction, featured products (placeholder ProductCards), large visual Gallery, craftsmanship information, materials, customization information, related projects, and an inquiry CTA — per PAGES.md Section 3.
4. Populate all five collection detail pages using the dynamic template and the centralized content file — do not create five separate hand-built page files.
5. Add Breadcrumbs to collection detail pages (Collections > [Collection Name]).
6. Ensure all product and project references on these pages point to placeholder/future routes without breaking navigation.

CONSTRAINTS

- Do not build the full product detail system yet — that is Step 6. Use lightweight ProductCard placeholders here.
- Do not build the full project system yet — that is Step 7. Use lightweight ProjectCard placeholders here.
- Do not create five separate static pages for the five collections — use one dynamic template driven by content data.
- Do not invent specific product specifications, dimensions, or materials — use clearly marked placeholders.
- Maintain the editorial, non-marketplace feel required by DESIGN.md.

VERIFY

- Confirm the Collections overview links correctly to all five detail pages.
- Confirm the dynamic collection detail template renders correctly for each of the five slugs.
- Confirm breadcrumbs, gallery, and CTA sections work and are responsive.
- Confirm no console errors and no broken links.
- Check mobile, tablet, and desktop rendering.

COMPLETION CRITERIA

A working Collections overview page and a single reusable, content-driven Collection Detail template render all five collections correctly, responsively, and without fabricated content.

STOP

Complete only this step. Verify the result. Do not begin future steps. Stop when this step is complete and wait for the next instruction.


============================================================
STEP 6 — PRODUCT ARCHITECTURE & PRODUCT DETAIL PAGES
============================================================

OBJECTIVE

Build the product content architecture and a reusable Product Detail page template that presents individual products beautifully and drives inquiries, without any ecommerce functionality.

READ / CONSIDER

Read /docs/PAGES.md (Section 4), /docs/REQUIREMENTS.md (Sections 5–6), and /docs/COMPONENTS.md before implementing.

CURRENT STATE

Collections overview and collection detail template are complete. Continue from the existing implementation; reuse ProductCard, Gallery, Breadcrumbs, SectionHeading, and CTASection components.

INSTRUCTIONS

1. Create a centralized content file (e.g. /content/products.js) with a simple, clear data shape per product: name, category, collection reference, optional material, optional dimensions, description, customization notes, and image references. Only include fields that are actually meant to be populated — do not fabricate example data with invented specifications; use clearly labeled placeholders (e.g. "[MATERIAL]", "[DIMENSIONS]").
2. Build a reusable ProductCard component (if not already sufficiently covered by COMPONENTS.md) showing image, product name, category, optional material, and a link — explicitly no pricing per COMPONENTS.md.
3. Build a single dynamic Product Detail page template (e.g. /app/products/[slug]/page.js) containing: hero/gallery, product information (name, category, material, dimensions, description, customization), full gallery, craftsmanship context, customization explanation, related products, and a "Request a Quote" CTA — per PAGES.md Section 4.
4. Wire the Collection Detail pages (from Step 5) to link real placeholder ProductCards from the products content file instead of static placeholders.
5. Implement "Related Products" logic simply (e.g. by shared collection or category) without building a complex recommendation system.
6. Add Breadcrumbs (Collections > [Collection] > [Product]).

CONSTRAINTS

- Do not display any pricing anywhere.
- Do not invent real materials, dimensions, or specifications — use explicit placeholders.
- Do not build cart, checkout, or ecommerce functionality of any kind.
- Do not create a second card component if ProductCard already fits — reuse it.
- Keep the data structure simple JavaScript objects/arrays — no database or CMS integration in V1.

VERIFY

- Confirm at least a few sample products render correctly through the dynamic template.
- Confirm related products, breadcrumbs, and CTAs work correctly.
- Confirm collection detail pages now link to real (placeholder-content) product pages.
- Confirm responsive behavior and no console errors.
- Confirm no pricing appears anywhere on product pages.

COMPLETION CRITERIA

A content-driven, reusable product architecture exists: a centralized product content file and a single dynamic Product Detail template, correctly linked from Collection pages, with no fabricated specifications and no ecommerce functionality.

STOP

Complete only this step. Verify the result. Do not begin future steps. Stop when this step is complete and wait for the next instruction.


============================================================
STEP 7 — PROJECTS OVERVIEW, CATEGORIES & PROJECT DETAIL PAGES
============================================================

OBJECTIVE

Build the project/portfolio system: an overview page with category organization and a reusable Project Detail template for showcasing finished work in real environments.

READ / CONSIDER

Read /docs/PAGES.md (Sections 5 and 6), /docs/REQUIREMENTS.md (Section 7), and /docs/COMPONENTS.md before implementing.

CURRENT STATE

Collections and Products systems are complete and functional. Continue from the existing implementation; reuse ProjectCard, Gallery, Breadcrumbs, SectionHeading, and CTASection components.

INSTRUCTIONS

1. Create a centralized content file (e.g. /content/projects.js) with a simple data shape per project: name, project type/category (Residential, Hospitality, Temple, Commercial, Garden/Landscape, Memorial/Tribute, Custom), optional location, description, products used, materials, and image references — using placeholders where real information is not provided. Only mark projects as published if they represent real, verifiable content per REQUIREMENTS.md — for V1 placeholder purposes, clearly label sample entries as placeholders.
2. Build the Projects Overview page displaying ProjectCards (image, project name, project type, short description) with simple category filtering (a lightweight client-side filter by project type is acceptable — avoid a complex filtering system or external state library).
3. Build a single dynamic Project Detail page template (e.g. /app/projects/[slug]/page.js) containing: project title, hero image, project story, location (if available), project type, products used, materials, gallery, craftsmanship notes, final result, related work, and an inquiry CTA — per PAGES.md Section 6.
4. Link Featured Projects on the homepage (Step 4) and Related Projects on collection/product pages to this real content-driven system instead of static placeholders.
5. Add Breadcrumbs (Projects > [Project Type] > [Project Name] where appropriate).

CONSTRAINTS

- Do not publish or fabricate specific client names, exact locations, or claims that cannot be verified — keep such fields as explicit placeholders per RULES.md.
- Do not build a complex filtering/search system — a simple category filter is sufficient for V1.
- Do not create a second card or gallery component if existing ones suffice.
- Do not add project comparison, saving, or other ecommerce-adjacent functionality.

VERIFY

- Confirm the Projects overview renders and the category filter works correctly.
- Confirm the dynamic Project Detail template renders correctly for multiple sample projects.
- Confirm homepage "Featured Projects" and related-work sections elsewhere now pull from this content file.
- Confirm responsive behavior, breadcrumbs, and no console errors.

COMPLETION CRITERIA

A working, content-driven project/portfolio system exists: overview page with category filtering and a reusable Project Detail template, correctly integrated with the homepage and collection/product pages.

STOP

Complete only this step. Verify the result. Do not begin future steps. Stop when this step is complete and wait for the next instruction.


============================================================
STEP 8 — OUR STORY, CRAFTSMANSHIP & EXPORT PAGES
============================================================

OBJECTIVE

Build the three brand-trust pages — Our Story, Craftsmanship, and Export — that build emotional connection, demonstrate the human process behind the work, and give international customers confidence.

READ / CONSIDER

Read /docs/PAGES.md (Sections 7, 8, 9) and /docs/RULES.md (Section 4, Brand Age) before implementing.

CURRENT STATE

Homepage, Collections, Products, and Projects systems are complete. Continue from the existing implementation; reuse ImageWithText, Gallery, SectionHeading, FeatureCards, and CTASection components — do not build new page-specific components unless COMPONENTS.md does not already cover the need.

INSTRUCTIONS

1. Build the Our Story page per PAGES.md Section 8: family background, generational craftsmanship, Jaipur/artisan culture, business journey, why Jaipur Stonecraft was created, and vision for the future. Use placeholder narrative copy that strictly respects RULES.md Section 4 — the family craft heritage is generational, the brand itself is new. Do not imply the company/brand has existed for generations.
2. Build the Craftsmanship page per PAGES.md Section 7, with clearly separated sections for: Stone (sourcing/selection), Design (idea to physical piece), Carving, Finishing, Quality (inspection standards), Packaging, and Export (journey from Jaipur to customer). Use ImageWithText and Gallery components with placeholder photography/video slots ([ARTISAN IMAGE], [FACTORY IMAGE], etc.).
3. Build the Export page per PAGES.md Section 9: export experience, countries served, packaging, shipping, documentation, communication process, custom order handling, and international inquiry process — using explicit placeholders for any unconfirmed claims (e.g. [EXPORT INFORMATION], country lists). Do not invent specific countries or shipment counts.
4. Ensure all three pages link naturally to relevant CTAs (Request a Quote / Contact) and to each other where contextually relevant (e.g. Craftsmanship linking to Our Story).
5. Add each page to the global navigation verification — confirm links from Step 3's navigation now resolve to real content instead of placeholders.

CONSTRAINTS

- Do not invent verified facts: no fabricated countries, years, certifications, or client claims.
- Do not create new one-off components for these pages if ImageWithText/Gallery/FeatureCards/SectionHeading already fit.
- Keep all three pages editorial and story-driven, not dense or listicle-like, per DESIGN.md.

VERIFY

- Visually review all three pages at desktop, tablet, and mobile widths.
- Confirm no fabricated business claims appear anywhere.
- Confirm navigation links to these three pages now resolve correctly (no more placeholders).
- Confirm no console errors.
- Apply the visual self-critique questions from PROJECT.md-derived guidance: does this feel like a heritage craftsmanship house rather than generic marketing copy?

COMPLETION CRITERIA

Our Story, Craftsmanship, and Export pages are complete, on-brand, free of fabricated claims, fully responsive, and properly linked from global navigation.

STOP

Complete only this step. Verify the result. Do not begin future steps. Stop when this step is complete and wait for the next instruction.


============================================================
STEP 9 — CUSTOM PROJECTS PAGE & CONTACT/INQUIRY SYSTEM
============================================================

OBJECTIVE

Build the two highest-conversion pages on the site: the Custom Projects page (for high-value bespoke work) and the Contact page, including a shared, premium, accessible inquiry form system.

READ / CONSIDER

Read /docs/PAGES.md (Sections 10 and 11), /docs/REQUIREMENTS.md (Sections 8–9), /docs/COMPONENTS.md (ContactForm, WhatsAppButton), and /docs/RULES.md (Section 17, Forms) before implementing.

CURRENT STATE

All brand and catalog pages are complete. Continue from the existing implementation; reuse the WhatsAppButton, CTASection, and ProcessSteps components. Build a single reusable ContactForm/inquiry form component rather than separate forms per page.

INSTRUCTIONS

1. Build a single reusable inquiry form component (ContactForm) supporting the fields required across both REQUIREMENTS.md and PAGES.md: name, email, phone, WhatsApp, country, project type, product/category, approximate dimensions, requirements/message, and optional file upload. Allow this component to be configured (e.g. via props) to show the fuller custom-project field set on the Custom Projects page and a simpler set on the general Contact page — per RULES.md Section 17, keep it as simple as each context requires.
2. Implement client-side validation with clear, accessible error messaging, a visible success state after submission, and protection against accidental duplicate submissions (e.g. disabling the submit button while processing). Since V1 has no backend/CRM, wire submission to a simple, clearly documented mechanism (e.g. a placeholder API route or mailto/formsubmission service stub) and clearly comment in the code where a real submission handler should be connected later.
3. Build the Custom Projects page per PAGES.md Section 10: headline direction "Your Vision. Our Craftsmanship.", explanation of the process using the ProcessSteps component (Discuss, Design, Craft, Inspect, Deliver — or the 7-step variant listed in PAGES.md if more appropriate to this page), the full inquiry form including reference upload, and a "Start a Custom Project" CTA framing.
4. Build the Contact page per PAGES.md Section 11: a simpler contact form, WhatsApp access, phone, email, location, brief business information, using placeholders where real details are unavailable.
5. Ensure both pages implement accessible forms: proper labels, keyboard navigation, visible focus states, sufficient contrast, and descriptive error/success messaging.
6. Ensure WhatsApp, phone, and email links function correctly (using placeholder values) via `tel:`, `mailto:`, and `wa.me` link formats.

CONSTRAINTS

- Do not build a real backend, CRM, or database integration — a clearly marked, simple placeholder submission handler is sufficient for V1, per RULES.md Section 6.
- Do not create two separate form components — use one reusable, configurable ContactForm.
- Do not skip validation, success states, or accessibility requirements.
- Do not invent real contact information — use explicit placeholders.

VERIFY

- Submit the form in a test scenario and confirm validation, success state, and duplicate-submission protection all work.
- Confirm the Custom Projects and Contact pages both render correctly and responsively.
- Confirm WhatsApp/phone/email links work correctly with placeholder values.
- Confirm keyboard-only navigation can complete the form.
- Confirm no console errors.

COMPLETION CRITERIA

A single reusable, accessible, validated inquiry form powers both a complete Custom Projects page and a complete Contact page, with working (placeholder) contact channels and no backend overengineering.

STOP

Complete only this step. Verify the result. Do not begin future steps. Stop when this step is complete and wait for the next instruction.


============================================================
STEP 10 — SEO IMPLEMENTATION
============================================================

OBJECTIVE

Implement complete, natural, non-keyword-stuffed SEO across every page: metadata, heading structure, clean URLs, canonical tags, Open Graph data, sitemap, robots.txt, and structured data where appropriate.

READ / CONSIDER

Read /docs/REQUIREMENTS.md (Section 4) and /docs/RULES.md (Section 11) before implementing.

CURRENT STATE

All pages (Home, Collections, Collection Detail, Products, Projects, Project Detail, Our Story, Craftsmanship, Export, Custom Projects, Contact) exist and function. Continue from the existing implementation; do not restructure routes or rewrite page content beyond what SEO implementation requires.

INSTRUCTIONS

1. Audit every route and confirm each has exactly one clear H1 and a logical H2/H3 hierarchy. Fix any pages with missing, duplicate, or incorrect heading structure.
2. Implement Next.js Metadata API (generateMetadata or static metadata exports) for every page/template: unique, natural page titles and meta descriptions per page and per dynamic product/collection/project entry (generated from the centralized content files, not hardcoded per page).
3. Implement canonical URLs for every page.
4. Implement Open Graph metadata (title, description, image, type, url) for every page, using placeholder OG images where real images are not yet available.
5. Confirm all URLs are clean and human-readable (e.g. /collections/sacred-sanctuaries, /products/[slug], /projects/[slug]) — adjust slugs in content files if needed.
6. Add descriptive, accurate alt text to every meaningful image across the site (derived from content data where possible); use empty alt text only for genuinely decorative images.
7. Add internal linking where naturally appropriate (e.g. related products/projects, collection cross-links) — do not force unnatural links.
8. Generate a sitemap.xml (Next.js sitemap generation) covering all static and dynamic routes.
9. Generate a robots.txt allowing appropriate crawling and referencing the sitemap.
10. Add structured data (JSON-LD) where appropriate — e.g. Organization schema on the homepage, BreadcrumbList schema on pages with breadcrumbs — without over-engineering or adding schema types that don't apply to this business model (no Product/Offer schema with pricing, since there is no ecommerce pricing).

CONSTRAINTS

- Do not keyword-stuff titles, descriptions, or content.
- Do not hardcode duplicate metadata across pages — derive from content files/templates.
- Do not add ecommerce-oriented structured data (e.g. Offer/price schema).
- Do not change page URLs in a way that breaks internal links already built in previous steps — update all references consistently if slugs change.

VERIFY

- Spot-check page source/metadata for at least: Home, one Collection, one Product, one Project, Our Story, Contact — confirm unique titles, descriptions, canonical tags, and OG tags.
- Confirm sitemap.xml and robots.txt are accessible and correctly formatted.
- Confirm every image has appropriate alt text (or intentionally empty alt for decorative images).
- Confirm heading hierarchy is correct across all page types.
- Confirm no console errors.

COMPLETION CRITERIA

Every page has correct, unique, natural SEO metadata, canonical URLs, Open Graph data, proper heading structure, descriptive alt text, working sitemap.xml and robots.txt, and appropriate structured data — with no keyword stuffing or fabricated data.

STOP

Complete only this step. Verify the result. Do not begin future steps. Stop when this step is complete and wait for the next instruction.


============================================================
STEP 11 — PERFORMANCE & ACCESSIBILITY OPTIMIZATION
============================================================

OBJECTIVE

Optimize the site for speed and Core Web Vitals given its image/video-heavy nature, and complete accessibility hardening across the entire site.

READ / CONSIDER

Read /docs/REQUIREMENTS.md (Sections 3 and 13) and /docs/RULES.md (Sections 13 and 12) before implementing.

CURRENT STATE

All pages and SEO are complete and functional. Continue from the existing implementation; this step should not change page structure or content, only optimize how it's delivered and rendered.

INSTRUCTIONS

1. Audit all images across the site and confirm they use Next.js Image (`next/image`) with correct sizing, responsive `sizes` attributes, and appropriate formats — never raw `<img>` tags for content images.
2. Confirm lazy loading is applied correctly to below-the-fold images and galleries, while hero/above-the-fold imagery uses priority loading where appropriate.
3. Audit any video usage (hero, craftsmanship) and confirm videos are compressed, use appropriate poster images, never autoplay audio, and don't block initial page render.
4. Audit font loading (from Step 2) and confirm it uses `next/font` correctly with proper fallbacks and no layout shift (check for font-display behavior).
5. Audit all client components (`"use client"`) across the codebase and confirm each one is genuinely necessary (e.g. interactive forms, mobile nav toggle, filters). Convert any component that doesn't need client-side interactivity back to a server component.
6. Remove any unused dependencies, dead code, or unnecessary JavaScript identified during the audit.
7. Review animations from Step 2 and confirm they remain lightweight and don't cause layout thrashing or excessive re-renders; confirm reduced-motion support still works.
8. Run a Lighthouse (or equivalent) audit on key pages (Home, a Collection Detail page, a Product Detail page) and address any significant Core Web Vitals issues found (LCP, CLS, INP).
9. Complete an accessibility pass across the whole site: confirm semantic HTML throughout, correct form labels, visible focus states on every interactive element, sufficient color contrast against the defined palette, keyboard operability of navigation/forms/galleries/filters, and descriptive alt text (cross-check with Step 10's work).
10. Add/verify a "skip to content" link for keyboard users.

CONSTRAINTS

- Do not change page content, copy, or visual design in this step — only performance and accessibility implementation.
- Do not remove functionality while optimizing — confirm everything still works after each change.
- Do not add new heavy dependencies to "fix" performance — prefer removing/optimizing existing code.

VERIFY

- Run Lighthouse or equivalent on Home, a Collection Detail page, and a Product Detail page; record scores.
- Confirm keyboard-only navigation works across the entire site (nav, forms, galleries, filters).
- Confirm color contrast passes WCAG AA for text against its background across the palette.
- Confirm no console errors and the build succeeds.
- Confirm previously verified functionality (Steps 3–9) still works after optimization.

COMPLETION CRITERIA

The site is materially optimized for performance (correct image/video/font handling, minimized client JavaScript, healthy Core Web Vitals on key pages) and passes a thorough accessibility review, with no loss of existing functionality.

STOP

Complete only this step. Verify the result. Do not begin future steps. Stop when this step is complete and wait for the next instruction.


============================================================
STEP 12 — RESPONSIVE REFINEMENT & CROSS-DEVICE TESTING
============================================================

OBJECTIVE

Deliberately refine and verify the responsive experience across desktop, tablet, and mobile for every page, ensuring the premium feeling is preserved at every breakpoint — not just "shrunk" from desktop.

READ / CONSIDER

Read /docs/DESIGN.md (Section 15, Mobile) and /docs/REQUIREMENTS.md (Section 2) and /docs/RULES.md (Section 14) before implementing.

CURRENT STATE

All pages, SEO, performance, and accessibility work are complete. Continue from the existing implementation; this step is about refinement and verification, not new features.

INSTRUCTIONS

1. Go through every page type (Home, Collections overview, Collection Detail, Product Detail, Projects overview, Project Detail, Our Story, Craftsmanship, Export, Custom Projects, Contact) at mobile, tablet, and desktop widths, and check specifically for:
   - Hero composition and legibility on small screens
   - Navigation usability (mobile menu, WhatsApp access)
   - Typography scaling (headings should still feel editorial, not cramped)
   - Image cropping/aspect ratios (no awkward crops or stretched images)
   - CTA placement and tap-target sizing (minimum comfortable tap area)
   - Form usability on mobile (field sizing, keyboard types where relevant e.g. email/tel inputs)
   - Gallery/filter behavior on touch devices
   - No horizontal overflow anywhere
2. Fix any issues found — this may include adjusting breakpoints, grid/flex layouts, image aspect-ratio handling, or component-level responsive CSS. Prefer refining existing CSS Modules over introducing new layout systems.
3. Specifically verify the WhatsApp button and primary CTA remain easily accessible on mobile without obstructing content (per DESIGN.md Section 15).
4. Verify touch interactions (mobile nav toggle, gallery lightbox if implemented, filters) work smoothly without relying on hover-only states.
5. Confirm large desktop widths (e.g. ultra-wide) also look intentional and don't leave awkward empty space or over-stretched content outside the 1280px container.

CONSTRAINTS

- Do not introduce new pages, sections, or components in this step — focus on refining existing responsive behavior.
- Do not sacrifice the premium visual feeling for mobile — apply DESIGN.md Section 15 (large imagery, clear typography, simple navigation) rather than a generic mobile-shrink approach.
- Do not change desktop layouts unnecessarily while fixing mobile/tablet issues — verify desktop still matches prior approval after any shared-component changes.

VERIFY

- Manually check every page at three representative widths (e.g. ~375px mobile, ~768px tablet, ~1440px desktop) and confirm no overflow, broken layout, unreadable text, tiny buttons, or overlapping elements per RULES.md Section 14.
- Confirm forms, navigation, WhatsApp, phone, and email links all work correctly on mobile.
- Confirm previous functionality (Steps 3–11) still works after refinement.
- Confirm no console errors.

COMPLETION CRITERIA

Every page delivers a deliberately designed, premium, fully functional experience at mobile, tablet, and desktop widths, with no layout defects and no loss of prior functionality.

STOP

Complete only this step. Verify the result. Do not begin future steps. Stop when this step is complete and wait for the next instruction.


============================================================
STEP 13 — FINAL VISUAL POLISH, README, & FULL QA FOR LAUNCH READINESS
============================================================

OBJECTIVE

Perform final visual art-direction polish across the whole site, write a complete developer-friendly README, and run a comprehensive final QA pass to confirm the V1 website is production-ready.

READ / CONSIDER

Read all of /docs (PROJECT.md, REQUIREMENTS.md, DESIGN.md, PAGES.md, COMPONENTS.md, RULES.md, TASKS.md) one more time before this final step, since it validates the entire build against the original specification.

CURRENT STATE

All pages, the design system, SEO, performance, accessibility, and responsive refinement are complete. This is the final step before launch preparation. Continue from the existing implementation; do not rebuild or restructure anything that already passes review — only polish and fix.

INSTRUCTIONS

1. Visual self-critique pass: go through every page in the browser and evaluate against these questions from the project brief:
   - Does this look like a high-end luxury brand?
   - Does this look like a premium stone atelier, contemporary art gallery, or architectural studio — not IndiaMART or a generic marble site?
   - Is the visual hierarchy strong and is imagery dominant?
   - Are there too many cards or too many buttons anywhere?
   - Does the mobile version feel equally polished as desktop?
   - Does anything look like an obvious, generic AI-generated template?
   Fix any issues found — this may include spacing adjustments, typography refinement, card density reduction, or composition improvements. Keep changes consistent with the established design system; do not introduce new colors, fonts, or component patterns.
2. Content audit: search the entire site for any fabricated business information — invented testimonials, awards, certifications, client names, country counts, years of operation, guarantees, or technical capabilities — per RULES.md Section 3. Replace any such content with explicit, clearly labeled placeholders.
3. Brand-age audit: confirm no copy anywhere implies Jaipur Stonecraft the brand/company has existed for generations — only the family craftsmanship, per RULES.md Section 4.
4. Scope audit: confirm no V1-excluded features exist anywhere (CAD/BIM portals, CNC features, architect login, client dashboard, production tracking, 3D configurator, complex estimator, CRM, ecommerce checkout, online payments, sample-box ecommerce) per REQUIREMENTS.md Section 14 and TASKS.md "FUTURE — NOT V1".
5. Write or finalize README.md covering: what the project is, tech stack used, how to install, how to run locally, how to build, where pages live, where components live, where content files live, where images live, how to add a new product, how to add a new project, how to change contact information, how to change colors, how to change typography, and how to deploy — written for a developer with basic Next.js/React knowledge, per RULES.md Section 20 guidance and the project's target developer comfort level.
6. Full final QA pass:
   - All pages load and render correctly
   - Global navigation works on all pages
   - Mobile, tablet, and desktop all verified
   - No horizontal overflow anywhere
   - All forms work, validate, and show success/error states correctly
   - All contact links (WhatsApp, phone, email) work with placeholder values
   - All internal links work — no 404s
   - All images have appropriate alt text
   - No fabricated business claims remain anywhere
   - SEO metadata, sitemap, and robots.txt all present and correct
   - Accessibility basics verified (keyboard nav, focus states, contrast, labels)
   - Console is clean across all pages
   - Production build succeeds with no errors or unexpected warnings
   - Overall performance is reasonable (recheck Lighthouse on Home and one dynamic page)
   - Design feels visually consistent and premium across the entire site
7. Document any known placeholders that must be replaced before real launch (e.g. in a clearly labeled "Before Launch Checklist" section of the README) — logo, real photography/video, real contact details, real business copy, real product/project data.

CONSTRAINTS

- Do not add any new features or pages beyond what TASKS.md and PAGES.md define for V1.
- Do not introduce new design elements, colors, or fonts during polish — refine within the existing system only.
- Do not mark this step, or the project, complete if any fabricated business claims, broken links, console errors, or failing builds remain.

VERIFY

- Complete the full final QA checklist above and record the outcome of each item.
- Confirm the production build (`next build` or equivalent) completes successfully.
- Confirm the README accurately reflects the final project structure.

COMPLETION CRITERIA

The Jaipur Stonecraft V1 website is visually polished, fully QA'd, free of fabricated content and out-of-scope features, documented with a clear README, and ready for domain connection, hosting configuration, and launch (Phase 14 in TASKS.md, to be handled as a separate infrastructure step outside this codebase-focused sequence).

STOP

Complete only this step. Verify the result. This is the final step in the implementation sequence — do not proceed to infrastructure/domain/hosting tasks (Phase 14 of TASKS.md) unless explicitly instructed. Stop when this step is complete and wait for the next instruction.
