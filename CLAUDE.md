# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

This is a Create React App project (`react-scripts` 5.0.1).

- `npm start` — dev server at http://localhost:3000
- `npm run build` — production build into `build/` (the directory Firebase Hosting serves)
- `npm test` — Jest in watch mode via `react-scripts test`
- `npm test -- --watchAll=false` — single CI-style run
- `npm test -- src/App.test.js` — run a single test file
- `npm test -- -t "test name"` — run tests by name pattern

There is no separate lint command; ESLint runs as part of `react-scripts start`/`build` using the `react-app` + `react-app/jest` config in `package.json`.

`src/setupTests.js` polyfills `IntersectionObserver` for jsdom because the `FadeUp` component depends on it. Don't remove that polyfill or every test that mounts a `FadeUp` (i.e. `App`) will throw.

## Required environment variables

The app reads these at build time via `process.env.*` and degrades gracefully if missing. Place them in `.env` locally; in CI they come from GitHub Actions secrets (see `.github/workflows/firebase-hosting-*.yml`):

- `REACT_APP_GITHUB_TOKEN` — used in `src/components/RepoArchive.js` (mounted on `/work`) to call `https://api.github.com/user/repos`. Token-scoped (the token's owner determines which repos appear; private repos are filtered out client-side). If unset, the archive table falls back to an empty state with a console warning — the rest of the page still renders.
- `REACT_APP_FIREBASE_API_KEY`, `REACT_APP_FIREBASE_AUTH_DOMAIN`, `REACT_APP_FIREBASE_PROJECT_ID`, `REACT_APP_FIREBASE_STORAGE_BUCKET`, `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`, `REACT_APP_FIREBASE_APP_ID` — initialize Firestore in `src/firebase.js` for timeline, spotlight, and contact-form data. `src/firebase.js` hardcodes the (public-by-design) web config as fallbacks because the GitHub Actions secrets were removed at some point and deployed builds otherwise ship with `undefined` config, silently breaking every Firestore fetch.

## Deployment

Firebase Hosting, project `manindra-portfolio` (see `.firebaserc`). Two GitHub Actions workflows handle this automatically:

- `firebase-hosting-merge.yml` — push to `master` builds and deploys to the `live` channel
- `firebase-hosting-pull-request.yml` — PRs from same-repo branches build and deploy to a preview channel

`firebase.json` sets `public: build` and rewrites all paths to `/index.html` (SPA fallback).

## Architecture

Routed editorial portfolio (react-router, lazy-loaded pages in `src/App.js`):

- `/` — `src/pages/Home.js`, the "Index" layout: `Landing` (name + thesis + portrait) → `StoryIndex` (three-part reading order: products / ML research / systems, data in `PORTFOLIO.story`) → `FieldNotes` (write-ups, `PORTFOLIO.notes`) → `Resume` → `ContactMain` → `Footer`. Sections `notes`, `resume`, and `contact` are scroll-anchored by `id`.
- `/work` — `src/pages/WorkIndex.js`: spotlight cards, then `RepoArchive` (GitHub repo table, capped at 8 rows desktop / 5 mobile with show-more/collapse), then `Testimonials`.
- `/sites` — `src/pages/SitesIndex.js`: live iframes of shipped websites from `PORTFOLIO.sites`; entries with `embed: false` (sites sending `X-Frame-Options`, e.g. rocketremit.com) render as link cards instead.
- `/research` — `src/pages/ResearchIndex.js`; `/work/:slug` and `/research/:slug` — `src/pages/ProjectDetail.js`.

The `Navbar` mixes route links (Work, Research, Sites) and home-section links (Notes, Resume, Contact) via the `LINKS` array (`{ label, kind: 'route' | 'section', target }`). `Timeline.js` and `ContactForm.js` are currently unmounted but kept (content-bearing; the timeline still has Firestore data behind it).

Note: "ARM-Wision" (arm-wision.github.io) is NOT a separate robotics project — it is the project site for the PlantCLEF 2026 submission and should always be displayed as "PlantCLEF 2026".

### Visual system

The design is intentionally inline-styled — every section is a single function component that owns its own styles object. Shared tokens live in `src/styles/editorial.js`:

- `ED_DISPLAY` — Helvetica Neue / Inter for display copy
- `ED_MONO` — JetBrains Mono for metadata, labels, captions
- `COLORS` — bg `#0a0a0a`, fg `#f5f3ee`, plus muted/dim/faint/border alpha variants

Fonts are loaded via Google Fonts in `public/index.html`. Global keyframes (`ed-fade-up`, `ed-slide-in`) live in `src/index.css`. There are no per-component `.css` files anymore — the old CSS modules were removed when the design was ported. The design is deliberately quiet: `FadeUp` is the only reveal mechanism (the old marquee/typing/number-scramble effects were removed in the declutter redesign).

### Data sources

Three runtime data sources, all gated behind env vars:

1. **Timeline** (`src/service/fetchTimeline.js`) — Firestore `timeline` collection, ordered by `year` desc. Currently unused (the Journey section was removed from the home page in the declutter redesign) but the fetcher, component, and data are intact if it's remounted.
   - Doc shape: `{ year, subtitle, points: string[] }` (new) or `{ year, subtitle, achievements: string[] }` (legacy).
   - The fetcher normalizes both into `{ year, subtitle, points }`. `Timeline.js` strips any HTML tags from `points` before rendering — Firestore is the trusted authoring surface, but raw HTML is no longer rendered.
   - Documents are de-duped client-side by `${year}-${subtitle}`.

2. **Spotlight (featured project)** (`src/service/fetchSpotlight.js`) — Firestore `spotlight` collection. Returns the most recent active doc, or `null` if none.
   - Required query indexes: composite `(active ASC, order DESC)`. Firestore will print the index-creation URL in the console the first time the query runs.
   - Doc shape:
     ```
     { name, year, lang, stars, desc, url?, active: bool, order: number,
       featured: { status, role, collaborators, problem, approach, outcome, stack: string[] } }
     ```
   - On `/work`, `RepoArchive` hides any GitHub repo whose name matches a spotlight `name` (case-insensitive) so the same project isn't shown twice — spotlights render as `SpotlightCard`s above the archive table.

3. **GitHub repos** (`src/components/RepoArchive.js`, mounted on `/work`) — `https://api.github.com/user/repos` with the bearer token. Mapped via `mapRepo()` into the editorial table row shape (`{ name, year, lang, stars, desc, url }`), private repos filtered out, sorted by stars descending.

### Contact form (Firestore-mediated email)

`src/service/sendMail.js` sends form submissions by writing a doc to the Firestore `mail` collection in the shape expected by the official Firebase **"Trigger Email from Firestore"** extension (`firebase/firestore-send-email`). The extension watches that collection and dispatches via SMTP — no custom Cloud Function needed. To wire up delivery in a fresh project:

```
firebase ext:install firebase/firestore-send-email
```

When prompted, set `MAIL_COLLECTION=mail` and provide SMTP credentials. Mail is routed to `manindrademel@yahoo.com.au` (read from `src/data/portfolio.js`); the form sets `replyTo` to the submitter so replying in the inbox just works.

If the Firestore write fails (offline, rules block, extension not installed), `sendMail.js` falls back to opening the visitor's mail client via `mailto:` — the form still does something useful even without the extension.

### Animations

`src/components/FadeUp.js` is the only reveal mechanism — IntersectionObserver-based, replaces the old AOS dependency. Wrap any section that should fade up in `<FadeUp>` (the entire `App.js` does this). The component disconnects its observer once shown, so there's no continuous scroll work.

### Adding a new section

1. Create the component under `src/components/` — own its styles inline using `ED_*` and `COLORS` from `src/styles/editorial.js`. Use `<SectionHeader title sub>` if it should match the existing section visual (the `number` prop is optional).
2. Give the section's root element a stable `id` (this is what the navbar scrolls to).
3. Mount it in `src/pages/Home.js` inside a `<FadeUp>` wrapper.
4. Add an entry to the `LINKS` array in `src/components/Navbar.js` — `{ label, kind: 'section', target }` where `target` is the section id (routes use `kind: 'route'` with a path).

The home page is intentionally sparse (thesis → story index → notes → contact). Before adding a section to it, prefer a route page — the declutter redesign moved the repo table, testimonials, timeline, résumé block, and contact form off the home page on purpose.

# Project Rules

Apply the claude-roast skill to every response and show the prompt score.
