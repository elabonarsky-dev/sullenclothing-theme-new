# Sullen Shopify OS 2.0 Theme

Vanilla Shopify Liquid theme generated from the Sullen rebuild handoff.

## Install
1. Zip the contents of this folder (not the folder itself):
   ```
   cd sullen-theme && zip -r ../sullen-theme-upload.zip . -x "*.DS_Store"
   ```
2. Shopify admin → **Online Store → Themes → Add theme → Upload zip**.

## Required setup in Shopify Admin
- **Navigation menus**: create handles `main-menu`, `mega-men`, `mega-women`, `mega-lifestyle`, plus footer menus.
- **Metafields** (namespace `sullen`):
  - Product: `artist_metaobject` (metaobject reference), `is_capsule` (boolean), `is_vault_exclusive` (boolean), `is_artist_series` (boolean), `tier_siblings` (list product reference), `tier_label` (text), `color_swatches` (list metaobject), `materials` (rich text), `size_chart_type` (text), `design_family` (text).
  - Metaobjects: `artist` (name, handle, portrait, bio), `color_swatch` (name, hex, image).
- **Settings → Theme settings**: pick brand logo, theme mode (dark/light/halloween/blaq-friday), set free-shipping threshold, paste Hudson NY Serif woff2 URL.
- **Search & Discovery app**: enable filters on collections (color, size, price).
- **Shopify Functions** (recommended): Cart Transform Function for "buy 3, cheapest free" bundles and Complete-the-Look discounts.
- **App Proxy** at `/apps/sullen` for dynamic features (Vault points, CCPA, newsletter) — wire to your own backend.

## File map
- `layout/theme.liquid` — global shell, body class drives theme mode.
- `templates/*.json` — section-based templates (OS 2.0).
- `sections/` — header, hero slider, tabbed collections, featured bundle, marketing image, social feed, PDP, collection, cart, search, account.
- `snippets/` — product card, badges, color swatch, bundle picker, cart drawer, mega menu, mobile nav, breadcrumbs, free-ship bar, icons.
- `assets/theme.css.liquid` — design tokens for 4 themes + full layout CSS.
- `assets/theme.js` — vanilla JS web components (cart drawer, hero slider, variant picker, sticky ATC).

## Notes
- All colors are HSL tokens driven by `config/settings_schema.json`.
- AJAX cart uses standard Shopify `/cart/*.js` endpoints. No external dependencies.
- No React, no Tailwind, no build step required.
