# Upload Readiness Report — Sullen OS 2.0 Theme

## Biggest Fixes Made

### 1. Critical Render-Role Mismatch (FIXED)
`sections/product-tier-switcher.liquid` and `sections/sticky-add-to-cart.liquid` were being
called via `{% render %}` from inside `sections/product-info.liquid`. In Shopify, `{% render %}`
can only call **snippets** (`snippets/` folder). These two files had no `{% schema %}` blocks,
confirming they were inline fragments, not standalone sections.

**Fix:** Both files moved to `snippets/`. The `{% render %}` calls in `product-info.liquid` now
resolve correctly. Metafield key `tier_label` normalized to `sullen.tier` (with `tier_label`
and title as fallbacks) per handoff.

### 2. Cart Drawer Section API (FIXED)
`snippets/cart-drawer.liquid` was included in `layout/theme.liquid` via `{% render %}`, but
`theme.js` attempted to refresh it using Shopify's Sections Rendering API (`?sections=cart-drawer`).
Snippets are not accessible via the Sections API — only files in `sections/` are.

**Fix:** Moved to `sections/cart-drawer.liquid` with a `{% schema %}` block. Updated `layout/theme.liquid`
to use `{% section 'cart-drawer' %}`. The JS refresh now works correctly. Checkout anchor updated from
`/cart/checkout` to `/checkout` (more direct and reliable).

### 3. Footer Rendering Empty (FIXED)
`sections/footer-group.json` defined the footer section but had no `blocks` array. The footer section
requires blocks for its menu columns, newsletter signup, and social links.

**Fix:** Added four default blocks (`menu-shop`, `menu-help`, `newsletter`, `social`) to
`footer-group.json`. These can be customised in the Shopify Theme Editor.

### 4. 404 Template Used Wrong Section (FIXED)
`templates/404.json` pointed at `page-content` section. On a 404 response, Shopify does not
provide a `page` object — `page.title` and `page.content` both resolve to blank.

**Fix:** Created `sections/main-404.liquid` with hardcoded heading, body text, and a "Back to
home" CTA. All three are customisable in the Theme Editor. `templates/404.json` updated to use
`main-404`.

### 5. Related Products Dead Code + Missing Schema Label (FIXED)
`sections/related-products.liquid` had a dead `assign coll` line and the schema text setting
was missing a `label` field (required for the Theme Editor UI).

**Fix:** Removed dead assignment. Added proper `label` to schema. Added `data-recommendations-section`
and `data-product-id` attributes so the new async recommendations fetch in `theme.js` can
upgrade the fallback grid to real Shopify recommendations.

### 6. Product Recommendations JS (ADDED)
No JavaScript was fetching real product recommendations. The section would always fall back to
`collections.all`.

**Fix:** Added an async fetch in `theme.js` that calls `/recommendations/products?section_id=…&product_id=…`
and swaps in the real results when available, without replacing the fallback on error.

### 7. Dead Variable in product-badges.liquid (FIXED)
`{%- assign badges = '' -%}` was declared but never used.

**Fix:** Removed.

### 8. Mega-Menu CSS Full-Width Positioning (FIXED)
`.site-header__nav-item` had `position:relative`, which made the absolutely-positioned `.mega-menu`
anchor to the individual nav item rather than the full sticky header. This caused the mega menu
panel to appear at nav-item width instead of spanning the header.

**Fix:** Removed `position:relative` from `.site-header__nav-item`. The mega-menu now positions
relative to `.site-header` (which has `position:sticky`, establishing the containing block) and
correctly spans the full header width.

### 9. Cart Drawer JS Refresh Improved (FIXED)
The old `refresh()` method made sequential fetches with dead assignments. Rewritten to use
`Promise.all` for parallel fetches and cleaner DOM updates.

---

## Structural Issues Found and Their Status

| Issue | Status |
|---|---|
| `product-tier-switcher` called as snippet but was a section | Fixed |
| `sticky-add-to-cart` called as snippet but was a section | Fixed |
| `cart-drawer` snippet not accessible via Sections API | Fixed |
| `footer-group.json` had no blocks — footer was blank | Fixed |
| `404.json` used page-content which relies on nil `page` object | Fixed |
| `related-products` dead code + missing schema label | Fixed |
| Mega-menu width anchored to nav-item not header | Fixed |
| Dead variable in product-badges | Fixed |

---

## What Was Simplified

- `sticky-add-to-cart` and `product-tier-switcher` are now snippets (correct role) instead of orphaned section files
- Cart drawer checkout uses `/checkout` directly instead of the intermediate `/cart/checkout`
- Related-products fallback to `collections.all` is kept; real recommendations load async on top
- 404 page uses static hardcoded fallback text (safe and always works)
- Footer blocks are pre-populated with sensible defaults

Nothing was redesigned. All Liquid, CSS, and JS remains vanilla and Shopify-native.

---

## Remaining Risks Before Upload

### Low Risk
- **Font: Hudson NY Serif** — The `font_hudson_url` setting in Brand is blank by default. The
  `@font-face` rule fires only when the setting has a value. Until you upload the `.woff2` file
  and set the URL, the display font gracefully falls back to Georgia. Not a crash, but a visual
  gap until resolved.
- **Hero slider on homepage** — The default `index.json` configures one slide with no image.
  The slide will render empty dark space until an image is set in the Theme Editor. Not a crash.
- **Social feed** — `sections/social-feed.liquid` pulls from a `source_collection`. If the
  collection handle `t-shirts` doesn't exist, the grid renders empty. Not a crash.
- **Tabbed collections** — Default tabs reference `new`, `t-shirts`, `headwear` collection
  handles. Empty if those collections don't exist yet.
- **Related products** — Falls back to `collections.all` if recommendations haven't been
  configured in Shopify Search & Discovery.

### Medium Risk
- **Metafields** — The theme uses `sullen.*` namespace metafields throughout. If these haven't
  been defined in the Shopify admin, they resolve to blank (not crashes) but features like
  artist attribution, tier switcher, color swatches, and capsule badges will be invisible.
- **Mega menus** — Require navigation lists with handles `mega-men`, `mega-women`,
  `mega-lifestyle` to be created in Navigation admin. If absent, the mega menu panels render
  empty (not broken).
- **Footer menus** — The default footer-group.json references menu handles `footer` and
  `footer-help`. If those don't exist, the footer menu columns render blank links.

### Not a Risk (safe by design)
- All metafield references are nil-guarded
- All image references are nil-guarded
- All collection references gracefully handle empty/missing collections
- Cart, product form, and checkout flows use real Shopify-native patterns
