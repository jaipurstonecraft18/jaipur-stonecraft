# Jaipur Stonecraft — AI Development Rules

## 1. Read Documentation First

Before making changes, read:

/docs/PROJECT.md
/docs/REQUIREMENTS.md
/docs/DESIGN.md
/docs/PAGES.md
/docs/COMPONENTS.md
/docs/RULES.md
/docs/TASKS.md

These files define the project.

---

# 2. Task Discipline

Always check TASKS.md.

Work on the current incomplete task before starting unrelated work.

Do not skip ahead unless explicitly instructed.

---

# 3. Do Not Invent Business Information

Never invent:

- Customers
- Clients
- Awards
- Certifications
- Testimonials
- Countries
- Years of operation
- Guarantees
- Production capabilities
- Technical specifications
- Materials
- Shipping claims
- Factory capabilities

If information is missing:

Use a placeholder or ask.

---

# 4. Brand Age

Jaipur Stonecraft is a new brand.

The family behind the brand has generations of craftsmanship experience.

Correct:

"Built on generations of craftsmanship."

Incorrect:

"Jaipur Stonecraft has been operating for generations."

---

# 5. No CAD / CNC Features in V1

Do not implement:

- CAD downloads
- BIM downloads
- CAD portal
- BIM portal
- CNC-related functionality
- CAD estimator
- Architect login
- Technical model library

These are future possibilities.

---

# 6. No Overengineering

V1 should be simple.

Do not build:

- Complex CRM
- Client dashboard
- Production tracking
- 3D product viewer
- Ecommerce checkout
- Payment system
- Complex project estimator

unless explicitly added to TASKS.md.

---

# 7. Design

Follow DESIGN.md.

Primary colors:

#1A1918
#FCFBF9
#9E7B4F
#E8E4DF

Do not introduce random colors.

---

# 8. Luxury Design

Prioritize:

- Whitespace
- Typography
- Photography
- Editorial layouts
- Large imagery
- Minimal UI
- Subtle animation

Avoid:

- Clutter
- Excessive cards
- Excessive gradients
- Generic templates
- Flashy animation
- Marketplace-style layouts
- Cheap-looking UI

---

# 9. Photography

Real Jaipur Stonecraft photography should always be preferred when available.

Do not use generic stock images when actual business images are available.

Images should be:

- High quality
- Properly cropped
- Optimized
- Responsive

---

# 10. Content

Writing should be:

- Refined
- Clear
- Confident
- Authentic
- Specific

Avoid:

- Empty luxury buzzwords
- Excessive adjectives
- Fake claims
- Generic AI marketing language

Do not write:

"Unparalleled world-class revolutionary craftsmanship."

Prefer:

"Handcrafted stonework shaped by generations of family craftsmanship."

---

# 11. SEO

Every page must have:

- Unique title
- Meta description
- H1
- Logical headings
- Clean URL
- Alt text
- Internal links

Do not keyword stuff.

SEO should support the user experience.

---

# 12. Accessibility

Use:

- Semantic HTML
- Proper labels
- Keyboard navigation
- Focus states
- Accessible forms
- Good contrast
- Alt text

---

# 13. Performance

Prioritize:

- Image optimization
- Lazy loading
- Responsive images
- Efficient fonts
- Minimal JavaScript
- Code splitting when appropriate

Do not add animations that materially harm performance.

---

# 14. Responsive

Always test:

- Mobile
- Tablet
- Desktop

Do not allow:

- Horizontal overflow
- Broken layouts
- Unreadable text
- Tiny buttons
- Overlapping elements

---

# 15. Components

Reuse existing components.

Before creating a new component:

1. Check COMPONENTS.md.
2. Check whether an existing component can be extended.
3. Only create a new component if necessary.

---

# 16. Images

Every meaningful image must have appropriate alt text.

Decorative images may use empty alt text where appropriate.

Never use filenames as visible content.

---

# 17. Forms

Forms must:

- Have clear labels
- Validate input
- Show useful error messages
- Show success state
- Work on mobile
- Prevent accidental duplicate submissions

---

# 18. Links

All internal links must work.

External links should open appropriately.

Never create fake links.

---

# 19. Testing

After every meaningful change:

- Check build
- Check console
- Check mobile
- Check desktop
- Check links
- Check forms where applicable

Do not mark a task complete if it is broken.

---

# 20. Documentation

If an implementation changes the architecture or behavior of the website:

Update the appropriate documentation.

---

# 21. Core Principle

Build the smallest correct solution.

Do not add complexity just because it is technically possible.
