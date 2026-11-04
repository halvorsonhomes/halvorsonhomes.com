# halvorsonhomes.com

Static marketing site for Halvorson Homes, a family-operated custom home builder in Florida. Built with [Eleventy](https://www.11ty.dev/) (11ty).

## Tech stack

| Tool | Version | Purpose |
|------|---------|---------|
| Eleventy | 3.1.6 | Static site generator |
| @11ty/eleventy-img | 7.1.1 | Image optimization (WebP conversion, responsive srcset) |
| js-yaml | 5.4.2 | Parse design YAML files in the data pipeline |
| Nunjucks | (bundled) | Templating |
| Font Awesome | 6.5.1 (CDN) | Icons (PDF, 3D cube, expand, etc.) |
| Google model-viewer | 3.5.0 (CDN) | 3D model viewer web component |

## Development

```bash
npm install
npm start        # dev server at http://localhost:8080 with live reload
npm run build    # production build → _site/
```

## Project structure

```
src/
├── _data/
│   ├── designs.js      # async data file — reads YAML, processes images through eleventy-img
│   ├── nav.json        # site navigation items
│   └── site.json       # site-wide metadata (title, year, url, description)
├── _designs/           # one YAML file per home design (see Design YAML below)
├── _includes/
│   └── layouts/
│       ├── base.njk    # HTML shell, nav, footer
│       └── page.njk    # simple content page wrapper
├── css/
│   └── style.css       # all styles — no preprocessor
├── images/
│   └── designs/
│       └── {slug}/     # per-design image folder (see Images below)
├── js/
│   ├── designs.js            # sort & filter logic for the designs index
│   ├── design-detail.js      # photo carousel + lightbox
│   ├── floor-plan-viewer.js  # floor plan fullscreen dialog with zoom
│   └── model-viewer-dialog.js # 3D model dialog open/close
├── designs/
│   └── design.njk      # per-design detail page (paginated from designs data)
├── designs.njk         # designs index page
├── about.md
├── contact.md
└── index.md
.eleventy.js            # Eleventy config
```

## Adding a design

1. Create `src/_designs/the-your-design-name.yaml` (see schema below).
2. Create `src/images/designs/the-your-design-name/` and add images:
   - `elevation.jpg` — hero image shown first in the carousel and on the index card
   - `floor-plan.png` — shown in the floor plan section of the detail page
   - Any other `.jpg`/`.jpeg`/`.png`/`.webp` files — added to the carousel automatically, sorted alphabetically
3. Optionally drop in a PDF and/or GLB model file in the same folder and reference them in the YAML.

That's it — the page is generated automatically on the next build.

## Design YAML schema

```yaml
name: The Curacao          # display name
slug: the-curacao          # used for the URL (/designs/the-curacao/) and image folder path
image: /images/designs/the-curacao/elevation.jpg  # fallback card image (overridden at build by optimised version)
floor_plan: /images/designs/the-curacao/floor-plan.png
pdf: /images/designs/the-curacao/the-curacao.pdf       # optional — shows a PDF download button
model: /images/designs/the-curacao/the-curacao.glb     # optional — shows a 3D model button
description: A spacious 3 bedroom 2 bath home with a zero corner sliding glass door.
bedrooms: 3
bathrooms: 2
living_sqft: 2307
total_sqft: 3376
garage: 3                  # number of garage stalls
features:
  - Chef's kitchen with island
  - Large Lanai
  - Zero Corner Door
```

## Image pipeline

`src/_data/designs.js` runs at build time and passes every image through `@11ty/eleventy-img`:

- **Output sizes:** 800w and 1600w
- **Output formats:** WebP (primary) + JPEG (fallback)
- **Output directory:** `_site/images/opt/`
- **URL path:** `/images/opt/`

Processed images are referenced via `<picture>` + `srcset` in the carousel; the browser picks the right size automatically.

The floor plan goes through the same pipeline so it also serves a WebP version.

## 3D models

When a design has a `model:` field pointing to a `.glb` file, the detail page shows a **View 3D Model** button. Clicking it opens a fullscreen `<dialog>` containing a `<model-viewer>` element (Google's web component) with orbit controls and auto-rotate.

The `src` attribute is only set on the viewer when the dialog opens, and cleared on close, so the model is not downloaded until the user asks for it.

**Workflow to get a model on the site:**

1. In ArchiCAD: File → Save As → 3D (OBJ format). No SSA subscription needed for export.
2. Convert OBJ → GLB: open Blender (free), import the OBJ, then File → Export → glTF 2.0 (`.glb`). Keep the file under ~20 MB for a good experience.
3. Drop the `.glb` in `src/images/designs/{slug}/` and add `model: /images/designs/{slug}/filename.glb` to the YAML.

## Sort & filter (designs index)

Client-side only — no server needed. Data attributes on each `.design-card` element drive it:

| Attribute | Value |
|-----------|-------|
| `data-name` | design name (for alphabetical sort) |
| `data-living` | living sq ft |
| `data-total` | total sq ft |
| `data-garage` | garage stalls |

`src/js/designs.js` reads these attributes and re-orders / shows/hides cards on change.

## Site metadata

Edit `src/_data/site.json` to change the site title, copyright year, base URL, or description.

Edit `src/_includes/layouts/base.njk` to change the footer text (license number is there).

## License

Private — all rights reserved. Halvorson Homes © 2026.
