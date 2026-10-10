import { defineConfig } from 'vite';

// Static build: one HTML page, hashed JS/CSS in build/static/ (cached as immutable
// by firebase.json), everything in public/ copied as-is. Firebase serves build/.
export default defineConfig({
  build: {
    outDir: 'build',
    assetsDir: 'static',
    target: 'es2020',
    // three.js lives in its own lazily loaded chunk (src/scenes.js), so its size
    // never blocks first paint.
    chunkSizeWarningLimit: 600,
  },
});
