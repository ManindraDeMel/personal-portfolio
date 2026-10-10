# Manindra de Mel — portfolio

Personal site for Manindra de Mel, software engineer and ML researcher in Canberra. Live at https://manindra-portfolio.web.app/.

A single static page built with Vite, with three.js figures loaded lazily so the first paint stays fast. It scores 100 for performance, accessibility, best practices and SEO in Lighthouse on mobile and desktop.

## Local setup

```bash
npm install
npm run dev
```

`npm run build` writes the production site to `build/`, and `npm run preview` serves it.

## Deployment

Pushing to `master` deploys to Firebase Hosting through GitHub Actions. Pull requests get a preview channel.

## License

MIT.
