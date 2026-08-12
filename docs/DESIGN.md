# Jaipur Stonecraft — Design System

## 1. Overall Direction

The website should feel like:

LUXURY STONE ATELIER

The visual language should combine:

- Indian heritage
- Contemporary architecture
- Luxury
- Craftsmanship
- Art
- Minimalism
- Editorial photography

The website should feel expensive because of:

- Composition
- Photography
- Typography
- Whitespace
- Materials
- Storytelling

Not because of excessive decoration.

---

# 2. Design Reference

The closest visual categories are:

- Luxury architecture studios
- Contemporary art galleries
- Luxury furniture brands
- High-end interior design studios
- Museum websites
- Luxury hospitality brands
- Premium craftsmanship brands

Avoid the visual language of:

- Wholesale marketplaces
- Generic marble websites
- IndiaMART
- Cheap handicraft stores
- Crowded ecommerce catalogs

---

# 3. Color Palette

## Charcoal Black

HEX:
#1A1918

Primary uses:

- Header
- Footer
- Dark sections
- Dark backgrounds
- Important text

---

## Warm Cream

HEX:
#FCFBF9

Primary uses:

- Main background
- Light sections
- Content areas
- Gallery backgrounds

This should be the dominant light background.

---

## Champagne Bronze

HEX:
#9E7B4F

Use as an accent.

Uses:

- Primary CTA
- Small highlights
- Active states
- Dividers
- Eyebrows
- Hover states

Use sparingly.

It should feel like a subtle metallic accent, not a bright gold website.

---

## Raw Stone Grey

HEX:
#E8E4DF

Uses:

- Borders
- Dividers
- Secondary backgrounds
- Subtle cards
- Hover backgrounds

---

# 4. Typography

## Heading Font

Primary:

Cormorant Garamond

Fallback:

Georgia

Use for:

- Hero headings
- Section headings
- Collection titles
- Editorial statements

Characteristics:

- Elegant
- Heritage
- Artistic
- Editorial

---

## Body Font

Primary:

Inter

Fallback:

System sans-serif

Use for:

- Paragraphs
- Navigation
- Buttons
- Product information
- Technical information
- Forms

---

# 5. Typography Rules

Headings should have breathing room.

Avoid:

- Extremely heavy headings
- Excessive uppercase
- Tight line spacing

Large headings should feel editorial.

Body text should remain highly readable.

---

# 6. Layout

Maximum content width:

1280px

Use generous whitespace.

Desktop sections should generally have approximately:

100–120px

vertical spacing where appropriate.

Do not make every section dense.

---

# 7. Hero

The homepage hero should be visually dominant.

Preferred media:

- High-quality video
- Cinematic artisan footage
- Large sculpture
- Luxury architectural installation
- Strong product photography

Potential hero video:
An artisan working on stone combined with finished craftsmanship.

Hero should contain:

- Short headline
- Supporting statement
- Primary CTA
- Secondary CTA

Avoid overcrowding the hero.

---

# 8. Photography

Photography is one of the most important elements of the website.

Prioritize:

- Large sculpture images
- Sculptures in beautiful environments
- Luxury homes
- Hotels
- Temples
- Gardens
- Architectural installations
- Close-up carving
- Stone texture
- Artisan hands
- Tools
- Material details
- Finished craftsmanship

Images should communicate scale and quality.

---

# 9. Image Style

Prefer:

- Natural lighting
- Architectural photography
- Controlled backgrounds
- Strong composition
- Close detail
- Texture
- Shadow
- Depth

Avoid:

- Low-resolution images
- Watermarked images
- Generic stock photography
- Over-edited images
- Excessive backgrounds
- Random product collages

---

# 10. Video

Video can be used for:

- Hero
- Craftsmanship
- Atelier story
- Product detail
- Project stories

Video should be:

- Cinematic
- Quiet
- Slow
- Authentic

Never autoplay audio.

---

# 11. Animation

Animation should be subtle.

Good:

- Fade
- Slide
- Image reveal
- Gentle scale
- Smooth hover
- Scroll reveal

Avoid:

- Flashy transitions
- Excessive parallax
- Bouncing elements
- Large motion effects
- Distracting animations

---

# 12. Buttons

Buttons should be simple and refined.

Primary button:
Champagne Bronze or Charcoal depending on background.

Secondary button:
Minimal outline or text button.

Avoid:

- Huge pill buttons
- Neon colors
- Excessive shadows
- Overly rounded UI

---

# 13. Cards

Cards should be minimal.

Images should do most of the visual work.

Avoid putting every piece of information inside separate boxes.

Use cards only where they improve scanning.

---

# 14. Navigation

Navigation should be:

- Clean
- Minimal
- Spacious
- Easy to understand

Desktop navigation should prioritize:

Collections
Projects
Craftsmanship
Our Story
Export
Contact

Primary CTA:

Request a Quote

---

# 15. Mobile

Mobile must maintain the same premium feeling.

Prioritize:

- Large imagery
- Clear typography
- Simple navigation
- Easy contact
- WhatsApp access
- Fast loading
- Clear CTAs

---

# 16. Core Design Principle

The craftsmanship is the hero.

The website UI should frame and enhance the stonework.

It should never compete with it.

---

# 17. Homepage Redesign Refinement Rules (Stage 2)

## Color System & Accent Usage
- **Deep Charcoal / Near-Black (`#1A1918`)**: Primary dark base for hero overlay, headers, footers, and dark CTA sections.
- **Warm Ivory / Cream (`#FCFBF9`)**: Dominant light background for editorial content, introduction, and portfolio showcases.
- **Raw Stone Grey (`#E8E4DF`)**: Subtle dividers, card borders, and secondary background panels.
- **Champagne Bronze Accent (`#9E7B4F`)**: Used strictly as a **restrained accent** (eyebrow text, active navigation highlights, primary CTAs, focus indicators, hover accents). Never used as a dominant background fill.

## Visual Balance Principle
- **No Default Symmetric 3+2 or 4+1 Grids**: Avoid layout gaps or awkward single trailing boxes on wide desktop screens.
- **Asymmetric Editorial Composition**: Every grid must feature intentional layout hierarchy (e.g., 1 Featured Hero Spotlight + 2–3 Supporting Cards, or asymmetric 2-column feature blocks).
- **Container Scale**: Maximum width `1280px` with fluid section spacing (`clamp(3rem, 8vw, 7rem)`).

## Section-Transition Approach
- **Continuous Storytelling**: Sections transition smoothly via natural background tone shifts (`cream` -> `stone-grey` -> `charcoal`), subtle 1px stone-grey dividing lines, or full-bleed image breaks.
- **No Isolated Stacked Boxes**: Avoid wrapping every block in identical outlined boxes; let whitespace and typography define structural rhythm.

## Typography Hierarchy
- **Display Serif (`Cormorant Garamond`)**: Used for Hero H1, Section H2, editorial quotes, and collection hero titles. Rendered in light/regular weights (`font-weight: 300` or `400`) with subtle negative letter-spacing (`-0.01em` to `-0.02em`).
- **Functional Sans-Serif (`Inter`)**: Used for navigation, body text, buttons, specifications, and metadata. Eyebrow labels use uppercase Inter with wide tracking (`letter-spacing: 0.15em`, `font-size: 0.8rem`).

## Animation & Motion Approach
- **Entrance & Scroll Reveals**: Smooth fade-up / fade-scale reveals via `ScrollReveal` component using `--transition-smooth` (`0.4s cubic-bezier(0.16, 1, 0.3, 1)`).
- **Subtle Micro-Interactions**: Image hover zoom (`transform: scale(1.04)`), link arrow gap shift (`gap: 0.6rem`), button state transitions.
- **Reduced Motion**: Disables scale transforms and motion effects when `@media (prefers-reduced-motion: reduce)` is active.

