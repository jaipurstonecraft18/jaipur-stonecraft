# Jaipur Stonecraft — V1 Atelier Website

Jaipur Stonecraft is a premium, contemporary, and responsive web catalog designed for a Jaipur-based stone craftsmanship atelier. The family behind the business has decades of traditional stone-carving heritage, and this website serves to showcase their expertise, collect custom client commissions, and generate business inquiries globally.

The presentation uses an editorial, high-end design layout resembling a contemporary art gallery or luxury architecture studio, prioritizing large imagery, clean typography, generous whitespace, and smooth transitions.

---

## 1. Technical Stack

* **Framework**: Next.js 16 (App Router)
* **Library**: React 19
* **Language**: JavaScript (ES6+)
* **Styling**: Vanilla CSS with CSS Modules for component isolation
* **Performance**: Next.js `<Image>` attributes for responsive resizing and lazy loading, next/font/google for layout-shift-free font loading (`Cormorant Garamond` and `Inter`).
* **Accessibility**: Keyboard skip-to-content links, responsive focus rings, and mobile menu tab-index isolation (`visibility: hidden` when closed).

---

## 2. Getting Started

### Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### Run Locally (Development Mode)
Start the hot-reloading development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the site.

### Build and Test (Production Mode)
To create an optimized production build and verify compiler output:
```bash
npm run build
npm run start
```

### Code Linting
Run the ESLint suite to confirm code styling and layout integrity:
```bash
npm run lint
```

---

## 3. Directory & Code Structure

The project follows a modular Next.js directory structure:

```text
├── app/                  # Page routes and layouts
│   ├── collections/      # Collections pages (/collections and /collections/[slug])
│   ├── contact/          # Contact page and inquiry form (/contact)
│   ├── craftsmanship/    # Craftsmanship processes page (/craftsmanship)
│   ├── custom-projects/  # Custom commissions showcase (/custom-projects)
│   ├── export/           # International logistics page (/export)
│   ├── our-story/        # Brand history and family heritage (/our-story)
│   ├── products/         # Product dynamic page (/products/[slug])
│   ├── projects/         # Case studies dynamic page (/projects/[slug])
│   ├── layout.js         # Global HTML wrapper, Google font imports, and Skip Link
│   └── page.js           # Homepage
├── components/           # Reusable UI components and CSS Modules
│   ├── Header/           # Sticky navigation and mobile menu overlay
│   ├── Footer/           # Global footer columns and legal links
│   ├── Gallery/          # Responsive image details gallery with alt-prefixes
│   ├── ContactForm/      # Validated interactive forms
│   └── ...               # Containers, buttons, cards, scroll animations
├── content/              # Structured JS data files
│   ├── collections.js    # Collection categories data
│   ├── products.js       # Product items catalog details
│   ├── projects.js       # Completed case studies portfolio
│   └── site.js           # Global contact, social URLs, and nav settings
├── public/               # Public assets
│   ├── images/           # Local photography assets (categorized by route)
│   └── favicon.ico       # Website favicon
├── styles/               # Global CSS files
│   └── globals.css       # Core variables (colors, spacing tokens, reset)
```

---

## 4. Developer Customization Guides

### How to Add a New Product
All product information is stored inside [content/products.js](file:///d:/jsc/jsc%20web1/content/products.js). To add a product:
1. Open the file and insert a new object key matching the URL slug:
   ```javascript
   "custom-marble-fireplace": {
     slug: "custom-marble-fireplace",
     name: "Bespoke Sculpted Fireplace",
     collectionSlug: "luxury-stone-objects",
     category: "Luxury Stone Objects",
     material: "Makrana Pure White Marble",
     dimensions: "H: 4.5ft, W: 6ft, D: 1.5ft",
     description: "A hand-carved classical mantlepiece showcasing detailed ionic flutings...",
     customization: "Available to custom widths and relief drawings.",
     imageSrc: "/images/products/fireplace-hero.png", // Hero Image
     gallery: [
       "/images/products/fireplace-detail-1.png",
       "/images/products/fireplace-detail-2.png"
     ]
   }
   ```
2. Place the corresponding image assets under the `public/images/` path.
3. Next.js will automatically generate the dynamic route `/products/custom-marble-fireplace` at compile time.

### How to Add a New Project Case Study
Project portfolio data is stored inside [content/projects.js](file:///d:/jsc/jsc%20web1/content/projects.js). To add a project:
1. Open the file and insert a new object key matching the project slug:
   ```javascript
   "rajasthan-haveli": {
     slug: "rajasthan-haveli",
     name: "Heritage Haveli Restorations",
     type: "Residential",
     collectionSlug: "architectural-stone",
     location: "Jodhpur, Rajasthan",
     description: "Restoration of structural arches and floral screens...",
     materials: "Bansi Paharpur Pink Sandstone",
     craftsmanship: "We carved 24 matching floral arches using traditional chisels...",
     finalResult: "Stone arches shipped and retrofitted into HAVELI wood supports.",
     imageSrc: "/images/projects/haveli-hero.png",
     productsUsed: [
       { name: "Ornate Structural Arch", slug: "ornate-arch" }
     ],
     gallery: [
       "/images/projects/haveli-detail-1.png",
       "/images/projects/haveli-detail-2.png"
     ]
   }
   ```
2. Next.js automatically maps this to `/projects/rajasthan-haveli`.

### How to Change Contact Details
To update phone numbers, emails, WhatsApp link triggers, physical addresses, or social media links, edit the `contact` block in [content/site.js](file:///d:/jsc/jsc%20web1/content/site.js):
```javascript
contact: {
  phone: "+91 98765 43210",
  email: "office@jaipurstonecraft.com",
  whatsapp: "+91 98765 43210",
  whatsappLink: "https://wa.me/919876543210",
  address: "Atelier Plaza, Jaipur, Rajasthan, India",
  instagram: "https://instagram.com/jaipurstonecraft",
  pinterest: "https://pinterest.com/jaipurstonecraft",
}
```

### How to Change Design Tokens (Colors & Spacing)
* **Colors**: Update the CSS variable values inside the `:root` block of [styles/globals.css](file:///d:/jsc/jsc%20web1/styles/globals.css):
  ```css
  --color-charcoal: #1A1918;
  --color-cream: #FCFBF9;
  --color-bronze: #9E7B4F;
  --color-stone-grey: #E8E4DF;
  ```
* **Typography**: Fonts are configured in [app/layout.js](file:///d:/jsc/jsc%20web1/app/layout.js). If you need to change fonts, import the new font from `next/font/google` and configure the CSS variable mapping inside the root layout component.

---

## 5. Deployment Guidelines

This project is fully ready to be deployed on **Vercel** or other cloud platforms hosting Next.js:
1. Connect the repository to your hosting account (e.g. Vercel).
2. Configure the build command as `npm run build` and output folder as `.next`.
3. The platform will automatically deploy and serve static assets while optimizing images on request.

---

## 6. Before Launch Checklist

The current codebase uses placeholder coordinates, placeholder assets, and placeholder content. **Before launching this website to production, make sure to replace the following:**

* **[ ] Logo & Visual Brand Identity**: Replace text-only navigation header logo with the finalized SVG logo or branding graphics.
* **[ ] Brand Contact Information**:
  * Replace `[PHONE NUMBER]` with the studio's primary telephone number inside `content/site.js`.
  * Replace `[EMAIL ADDRESS]` with the studio's official email address.
  * Replace `[BUSINESS ADDRESS]` with the studio's registered workshop address.
  * Update `whatsappLink` and `whatsapp` numbers with the coordination manager's active phone coordinates.
* **[ ] Social Media Links**: Replace the dummy `[INSTAGRAM URL]` and `[PINTEREST URL]` placeholders in `content/site.js` and footer with verified account handles.
* **[ ] Real Photography & Video Assets**:
  * Replace all `https://placehold.co/...` mock images in `content/products.js`, `content/projects.js`, and `content/collections.js` with compressed, optimized `.jpg` or `.webp` photographs of actual Jaipur Stonecraft carvings and workshop layouts.
  * Replace all hero media references in homepage and category templates.
* **[ ] Final Business Copy & Details**:
  * Replace text block placeholders (such as `[LOCATION]`, `[MATERIALS]`, and project description stubs) in `content/projects.js` with verified, accurate case studies.
  * Update sitemap and metadata domains to point to the correct, live production domain (e.g. `https://jaipurstonecraft.com`) rather than local configurations.
