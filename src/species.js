// The hero's species cloud: one point per species in the PlantCLEF 2026 training
// manifest (7,806), grouped by their real families and genera (src/taxonomy.js).
// Seeded so the instant 2D poster (main.js) and the WebGL version (scenes.js) draw
// exactly the same cloud and can cross-fade seamlessly.

import { FAMILIES } from './taxonomy.js';

export const SPECIES = FAMILIES.reduce((a, [, genera]) => a + genera.reduce((b, n) => b + n, 0), 0);
export const START_TILT = 0.32;
export const cameraZ = (aspect) => 10.5 * Math.max(1, 1.25 / aspect);

// One point per species, grouped by real family and genus. Positions are seeded
// (so poster and WebGL match); only the layout is illustrative.
export function makeSpecies() {
  let seed = 7806;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const gauss = () => Math.sqrt(-2 * Math.log(1 - rnd())) * Math.cos(2 * Math.PI * rnd());
  const N = SPECIES, F = FAMILIES.length;
  const pos = new Float32Array(N * 3), size = new Float32Array(N), fam = new Float32Array(N);
  const families = [];
  let k = 0;
  for (let f = 0; f < F; f++) {
    const [name, genera, top, photo] = FAMILIES[f];
    const count = genera.reduce((a, n) => a + n, 0);
    // Scatter families round the sphere so the big ones don't bunch at one pole.
    const slot = (f * 97) % F;
    const y = 1 - ((slot + 0.5) / F) * 2, ring = Math.sqrt(1 - y * y), th = slot * 2.39996;
    const R = 2.1 + rnd() * 1.2;
    const fc = [Math.cos(th) * ring * R, y * R * 0.82, Math.sin(th) * ring * R];
    const spread = 0.1 + 0.32 * Math.sqrt(count / 1000);
    const gc = genera.map(() => {
      const s = spread * (0.45 + 0.55 * rnd());
      return [fc[0] + gauss() * s, fc[1] + gauss() * s, fc[2] + gauss() * s];
    });
    genera.forEach((n, gi) => {
      const g = gc[gi], tight = 0.045 + 0.03 * Math.sqrt(n / 10);
      for (let s = 0; s < n; s++, k++) {
        pos[k * 3] = g[0] + gauss() * tight;
        pos[k * 3 + 1] = g[1] + gauss() * tight;
        pos[k * 3 + 2] = g[2] + gauss() * tight;
        size[k] = 0.55 + rnd() * 1.0;
        fam[k] = f;
      }
    });
    families.push({ name, fc, gc, count, genera: genera.length, top, photo: !!photo });
  }
  return { pos, size, fam, families };
}

// Draws the cloud into a 2D canvas with the same camera the WebGL scene uses
// (32° vertical FOV, tilted START_TILT around x), so the first GL frame matches.
export function drawPoster(canvas, { background, color }) {
  const w = canvas.clientWidth, h = canvas.clientHeight;
  if (!w || !h) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const { pos, size } = makeSpecies();
  const aspect = w / h, camZ = cameraZ(aspect), t = Math.tan((16 * Math.PI) / 180);
  const cx = Math.cos(START_TILT), sx = Math.sin(START_TILT);
  const [r, g, b] = color;
  for (let i = 0; i < SPECIES; i++) {
    const x = pos[i * 3], y0 = pos[i * 3 + 1], z0 = pos[i * 3 + 2];
    const y = y0 * cx - z0 * sx, z = y0 * sx + z0 * cx;
    const depth = camZ - z;
    const px = ((x / depth / (t * aspect)) + 1) / 2 * canvas.width;
    const py = (1 - (y / depth / t)) / 2 * canvas.height;
    const fade = Math.min(1, Math.max(0, (15.5 - depth) / (15.5 - 7)));
    const f = fade * fade * (3 - 2 * fade);
    const radius = (size[i] * dpr * (24 / depth)) / 2;
    ctx.fillStyle = `rgba(${r},${g},${b},${(0.16 + 0.79 * f) * 0.85})`;
    ctx.beginPath();
    ctx.arc(px, py, Math.max(0.5, radius * 0.8), 0, 6.2832);
    ctx.fill();
  }
}
