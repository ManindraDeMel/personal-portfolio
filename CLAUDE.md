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
- `src/main.js` — every interaction: intro text scramble, hover/scroll text decode (`decode()` walks text nodes, so markup is kept), ML/APP/SYS tags, menu overlay, Canberra clock, cursor-following hover images (`IMAGES` map → `public/assets/img/`), magnetic buttons, tilt, stat count-up, the research scroll stage (one step slides in at a time), the Extras documents deck (pinned fan-out on desktop, cover-flow row on phones, page riffle on hover), Extras list rules drawing in, copy-email.
- `src/species.js` — the seeded 7,806-point species cloud, one point per species in the PlantCLEF 2026 label set, grouped by its real families and genera from `src/taxonomy.js` (positions are illustrative) plus `drawPoster()`, which paints it into a 2D canvas instantly with the same camera as the WebGL scene.
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
- Car film (end of About): `public/assets/video/car-1080.mp4` (desktop) and `car-720.mp4` (≤900px), H.264 with AAC audio and faststart, motion-interpolated from the 24fps source to 60fps (`minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1`, which removes 24-on-60Hz judder) and encoded with ffmpeg (`-crf 27/28 -preset slow -movflags +faststart`), plus `car-poster.webp`. The `<video>` has no `src` or `poster` in the HTML on purpose: `main.js` sets both when it comes within 700px, plays muted only while on screen, and widens it from an inset frame as it scrolls in. Sound is opt-in through the button. Keep it that way so the clip never loads up front.
- Degree card: `docs/degree-1.webp` is the ANU certificate scan rotated upright (the source PDF is sideways; rotate 90° anticlockwise). The back, `docs/degree-seal.webp`, is a close-up of the seal only; keep signatures out of any enlarged crop. The card opens `docs/degree-full.webp`. The credential is also in the JSON-LD as `hasCredential`.
- Species cloud data: `src/taxonomy.js` is generated from the project's species prompt table (`arm-wision/PlantCLEF2026`, `experiments/002_bioclip_tile_zero_shot_v2_tpu/outputs/bioclip_all/prompt_table.csv`; each row's prompts name the family). 181 families, 1,446 genera, 7,806 species. Hovering (or tapping) a cluster shows the family card: name, counts, top three genera and a photo from `public/assets/img/families/{Family}.webp` (200px, loaded on demand).
- Family photos come from iNaturalist under CC0, CC BY or CC BY-SA only, and every one is credited on `public/credits.html` (linked from the footer). Never add a photo without adding its credit, and never use NC/ND-licensed photos.
- Documents deck (Extras): each card's `data-pages` lists page renders in `public/assets/img/docs/` (`{doc}-{page}.webp`, 720px wide, rendered from the PDFs at 110 dpi). The first page is the front face, the second the back; hovering (or the centred card on phones) riffles through the rest. Pick figure-heavy pages; title pages read as plain text at card size.

Note: "ARM-Wision" (arm-wision.github.io) is NOT a separate robotics project — it is the project site for the PlantCLEF 2026 submission and should always be displayed as "PlantCLEF 2026".

# Project Rules

Apply the claude-roast skill to every response and show the prompt score.
