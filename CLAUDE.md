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

- `REACT_APP_GITHUB_TOKEN` — used in `src/components/Projects.js` to call `https://api.github.com/user/repos`. Token-scoped (the token's owner determines which repos appear; private repos are filtered out client-side). If unset, the project table falls back to an empty state with a console warning — the rest of the page still renders.
- `REACT_APP_FIREBASE_API_KEY`, `REACT_APP_FIREBASE_AUTH_DOMAIN`, `REACT_APP_FIREBASE_PROJECT_ID`, `REACT_APP_FIREBASE_STORAGE_BUCKET`, `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`, `REACT_APP_FIREBASE_APP_ID` — initialize Firestore in `src/firebase.js` for timeline, spotlight, and contact-form data.

## Deployment

Firebase Hosting, project `manindra-portfolio` (see `.firebaserc`). Two GitHub Actions workflows handle this automatically:

- `firebase-hosting-merge.yml` — push to `master` builds and deploys to the `live` channel
- `firebase-hosting-pull-request.yml` — PRs from same-repo branches build and deploy to a preview channel

`firebase.json` sets `public: build` and rewrites all paths to `/index.html` (SPA fallback).

## Architecture

Single-page editorial portfolio — one route, a stack of full-width sections rendered top-to-bottom in `src/App.js`. The sections are scroll-anchored by `id` (`journey`, `work`, `resume`, `words`, `contact`) and the `Navbar` smooth-scrolls to those IDs and tracks the active section via a scroll listener (no react-router, no react-scroll).

### Visual system

The design is intentionally inline-styled — every section is a single function component that owns its own styles object. Shared tokens live in `src/styles/editorial.js`:

- `ED_DISPLAY` — Helvetica Neue / Inter for display copy
- `ED_MONO` — JetBrains Mono for metadata, labels, captions
- `COLORS` — bg `#0a0a0a`, fg `#f5f3ee`, plus muted/dim/faint/border alpha variants

Fonts are loaded via Google Fonts in `public/index.html`. Global keyframes (`ed-marquee`) live in `src/index.css`. There are no per-component `.css` files anymore — the old CSS modules were removed when the design was ported.

### Data sources

Three runtime data sources, all gated behind env vars:

1. **Timeline** (`src/service/fetchTimeline.js`) — Firestore `timeline` collection, ordered by `year` desc.
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
   - `Projects.js` hides any GitHub repo whose name matches `spotlight.name` (case-insensitive) so the same project isn't shown twice — the featured block is rendered above the table by `Featured.js`.

3. **GitHub repos** (`src/components/Projects.js`) — `https://api.github.com/user/repos` with the bearer token. Mapped via `mapRepo()` into the editorial table row shape (`{ name, year, lang, stars, desc, url }`), private repos filtered out, sorted by year descending.

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

1. Create the component under `src/components/` — own its styles inline using `ED_*` and `COLORS` from `src/styles/editorial.js`. Use `<SectionHeader number title sub>` if it should match the existing section visual.
2. Give the section's root element a stable `id` (this is what the navbar scrolls to).
3. Mount it in `src/App.js` inside a `<FadeUp>` wrapper.
4. Add an entry to the `LINKS` array in `src/components/Navbar.js` — `{ label, href }` where `href` is the section id (or `'top'` for the page top).
