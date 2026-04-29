# ZIP and Upload Instructions

## Which folder to zip

Zip the contents of the theme root folder:

```
sullen-shopify-theme/
```

The zip must contain these folders **at the top level** (not nested inside another folder):

```
assets/
config/
layout/
locales/
sections/
snippets/
templates/
```

## What NOT to include

Exclude the following from the zip:

- `.git/` (version control folder)
- `README.md`
- `UPLOAD_READINESS_REPORT.md`
- `MISSING_ADMIN_SETUP.md`
- `ZIP_INSTRUCTIONS.md`
- Any `.DS_Store` or `Thumbs.db` files
- Any `node_modules/` folder (none present in this theme)

## How to create the zip

### Windows (PowerShell — from inside the theme root):

```powershell
Compress-Archive -Path assets,config,layout,locales,sections,snippets,templates -DestinationPath sullen-theme.zip
```

### macOS / Linux (Terminal — from inside the theme root):

```bash
zip -r sullen-theme.zip assets config layout locales sections snippets templates
```

## How to upload as a draft theme

1. Go to your Shopify admin: **Online Store → Themes**
2. Scroll to the bottom of the page
3. Click **Add theme → Upload zip file**
4. Select `sullen-theme.zip`
5. Shopify will process the upload and create a new **draft theme** (it will NOT replace your live theme)
6. Once uploaded, click **Preview** to check it before publishing

## Validating before upload (optional)

If you have Shopify CLI installed:

```bash
shopify theme check
```

Run from the theme root. Fix any reported errors before zipping.
