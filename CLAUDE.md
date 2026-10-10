# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

A static site built with Vite (no framework). Node 22.

- `npm run dev` — dev server at http://localhost:5173
- `npm run build` — production build into `build/` (the directory Firebase Hosting serves)
- `npm run preview` — serve the production build at http://localhost:4173

There is no test suite. Check changes with a production build plus a Lighthouse run against `npm run preview`; the page currently scores 100 across performance, accessibility, best practices and SEO on both mobile and desktop, so treat any drop as a regression.

## Deployment

Firebase Hosting, project `manindra-portfolio` (see `.firebaserc`). Two GitHub Actions workflows handle this automatically:

- `firebase-hosting-merge.yml` — push to `master` builds and deploys to the `live` channel
- `firebase-hosting-pull-request.yml` — PRs from same-repo branches build and deploy to a preview channel

`firebase.json` serves `build/` with clean URLs and no SPA rewrite (unknown paths get `public/404.html`). The old React routes (`/work`, `/research`, `/sites` and their sub-paths) 301 to the matching section anchors on `/`. Hashed bundles in `/static/` and fonts are cached as immutable; images for 30 days; HTML/XML/TXT/JSON for 5 minutes.

## Architecture

One page, `index.html`, with all content in the HTML so crawlers and no-JS visitors get everything. JavaScript only adds motion.

- `index.html` — markup plus the full SEO head: title, description, canonical, Open Graph/Twitter tags, JSON-LD (`ProfilePage`, `Person`, `WebSite`, and a `ScholarlyArticle` per paper), font preloads, and a tiny inline script that adds `.intro` on the first visit of a session (before first paint) so the intro screen never flashes.
- `src/main.js` — every interaction: intro text scramble, hover/scroll text decode (`decode()` walks text nodes, so markup is kept), ML/APP/SYS tags, menu overlay, Canberra clock, cursor-following hover images (`IMAGES` map → `public/assets/img/`), magnetic buttons, tilt, stat count-up, the research scroll stage (one step slides in at a time), copy-email.
- `src/species.js` — the seeded 7,806-point species cloud (one point per species in the PlantCLEF 2026 manifest; layout illustrative) plus `drawPoster()`, which paints it into a 2D canvas instantly with the same camera as the WebGL scene.
- `src/scenes.js` — the four three.js figures: hero species cloud (hover a cluster to light its family → genus branches), scroll-driven 4×4 tiled-inference quadrat, footer ripple field, and the mesh-simplification wireframe knot. Loaded as a separate chunk: pointer devices fetch it when the page goes idle, touch devices on first scroll/tap. Each figure initialises only when it nears the viewport. `ColorManagement` is disabled so colours match the CSS tokens exactly.
- `src/styles.css` — all styles. Tokens live on `:root`; fonts are self-hosted in `public/assets/fonts/` (Instrument Serif, Instrument Sans, JetBrains Mono).

### Performance rules

These keep Lighthouse at 100; don't undo them without a reason:

- Nothing heavy on the critical path: three.js stays in the lazy `scenes.js` chunk.
- The hero headline must be painted at first render (the intro only nudges it 14%), so it is the LCP element rather than the scrambling intro text.
- Every `<img>` has `width`/`height`; below-the-fold images use `loading="lazy"`.
- Images are WebP in `public/assets/img/`; hover screenshots are in `shots/` at ≤960px wide.

### Content

- Work rows, research, testimonials and extras are plain HTML in `index.html`. Keep the section counts in `(NN)` labels and the menu in sync when adding or removing items.
- Testimonials must be real quotes from the named client. Don't write placeholder quotes in a client's name.
- When adding a paper, also add a `ScholarlyArticle` to the JSON-LD in the head.
- `public/sitemap.xml` and `robots.txt` are hand-written; update `lastmod` when content changes.
- `public/assets/img/og.jpg` is the 1200×630 social preview.

Note: "ARM-Wision" (arm-wision.github.io) is NOT a separate robotics project — it is the project site for the PlantCLEF 2026 submission and should always be displayed as "PlantCLEF 2026".

# Project Rules

Apply the claude-roast skill to every response and show the prompt score.
