# Missing Admin Setup — Sullen OS 2.0 Theme

Everything below must be configured in the Shopify admin **after** uploading the theme as a draft.
None of these are blockers for upload — the theme will preview safely without them — but they are
required for the full experience to work.

---

## 1. Navigation (Online Store → Navigation)

| Handle | Purpose |
|---|---|
| `main-menu` | Primary header nav links (Men, Women, Lifestyle, Collaborations, etc.) |
| `mega-men` | Second-level links for the Men mega menu (columns → sub-links) |
| `mega-women` | Second-level links for the Women mega menu |
| `mega-lifestyle` | Second-level links for the Lifestyle mega menu |
| `footer` | Footer "Shop" column links |
| `footer-help` | Footer "Help" column links (FAQ, Returns, Contact, etc.) |

**Mega-menu structure:** Each `mega-*` link list uses top-level items as column headings, with
child links as the items within each column.

---

## 2. Collections

| Handle | Where used |
|---|---|
| `new` | Tabbed collections — "New" tab on homepage |
| `t-shirts` | Tabbed collections — "Tees" tab; Featured bundle; Social feed source |
| `headwear` | Tabbed collections — "Headwear" tab |

Collections referenced in the Theme Editor can be changed at any time. The handles above match
the defaults in `templates/index.json`.

---

## 3. Pages (Online Store → Pages)

| Handle / Slug | Purpose |
|---|---|
| `vault` | "Join The Vault" CTA from hero and marketing sections |
| `do-not-sell` | CCPA link in footer (California Do Not Sell) |
| Artist pages at `/pages/artists/[handle]` | Artist profile pages linked from product cards and PDP |

---

## 4. Metafields (Settings → Custom data)

### Product metafields (namespace: `sullen`)

| Key | Type | Purpose |
|---|---|---|
| `artist_metaobject` | Metaobject reference | Links product to an artist metaobject |
| `materials` | Multi-line text | Materials & care accordion on PDP |
| `tier_siblings` | List of product references | Products sharing the same design across tiers |
| `tier` | Single-line text | Tier label shown in tier switcher (e.g. "Regular Tee", "Premium Tee") |
| `color_swatches` | JSON / metaobject list | Color swatches shown on product card |
| `is_capsule` | Boolean | Shows "Capsule" badge on product card |
| `is_vault_exclusive` | Boolean | Shows "Vault" badge |
| `is_artist_series` | Boolean | Shows "Artist Series" badge |

### Collection metafields (namespace: `sullen`)

| Key | Type | Purpose |
|---|---|---|
| `capsule_status` | Single-line text | Collection-level capsule flag (per handoff, capsule state lives on collections) |

---

## 5. Metaobjects (Settings → Custom data → Metaobjects)

### Artist (`artist`)

| Field | Type |
|---|---|
| `name` | Single-line text |
| `handle` | Single-line text (used as URL slug) |
| `portrait` | Image reference |

The PDP links to `/pages/artists/{{ artist.handle }}` — you'll need to create those pages manually
or build an artist page template.

---

## 6. Shopify Search & Discovery (Apps → Search & Discovery)

- Enable **product filtering** on collection pages
  - Recommended filters: Size, Color, Price, Product type, Artist
- Enable **product recommendations** for the "You may also like" section on PDPs
  - The theme fetches recommendations via the Recommendations API automatically

---

## 7. Theme Settings to Configure (Online Store → Themes → Customize)

| Setting | Where | Action |
|---|---|---|
| Logo | Brand | Upload SVG or PNG |
| Favicon | Brand | Upload 32×32 PNG |
| Hudson NY Serif font URL | Brand | Upload `.woff2` to Files and paste CDN URL |
| Social URLs | Social | Add Instagram, Facebook, YouTube, TikTok URLs |
| Free shipping threshold | Cart | Defaults to $75 — adjust as needed |
| Hero slide image | Homepage → Hero slider → Slide 1 | Upload hero image |
| Marketing image section | Homepage → Marketing image | Upload background image |

---

## 8. Files (Content → Files)

| File | Purpose |
|---|---|
| Hudson NY Serif `.woff2` | Brand font — upload and set URL in Theme Settings |
| Any hero images not served from Products | Hero slider slides |
| Any marketing section background images | Marketing image section |
