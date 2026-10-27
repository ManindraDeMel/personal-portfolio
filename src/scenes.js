import {
  BufferAttribute,
  BufferGeometry,
  Color,
  ColorManagement,
  DoubleSide,
  DynamicDrawUsage,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  LinearSRGBColorSpace,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Plane,
  PlaneGeometry,
  Points,
  Raycaster,
  Scene,
  ShaderMaterial,
  TextureLoader,
  TorusKnotGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
  WireframeGeometry,
} from 'three';
import { START_TILT, cameraZ, makeSpecies } from './species.js';
import { FAMILIES } from './taxonomy.js';

// Colours come straight from the CSS tokens and should render exactly as written,
// so colour management is off and output stays in the same space.
ColorManagement.enabled = false;

const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

// Runs `frame(dt)` on every animation frame while `el` is on screen.
function whileVisible(el, frame) {
  let vis = false, raf = 0, last = 0;
  const loop = (now) => {
    raf = 0;
    if (!vis) return;
    const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
    last = now;
    frame(dt);
    raf = requestAnimationFrame(loop);
  };
  new IntersectionObserver(([e]) => {
    vis = e.isIntersecting;
    last = 0;
    if (vis && !raf) raf = requestAnimationFrame(loop);
  }, { rootMargin: '120px' }).observe(el);
}

function makeRenderer(host, alpha, onFit) {
  let redraw = null;
  const renderer = new WebGLRenderer({ canvas: host.querySelector('canvas.gl') || host.querySelector('canvas'), antialias: true, alpha });
  renderer.outputColorSpace = LinearSRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  if (alpha) renderer.setClearColor(0x000000, 0);
  const camera = new PerspectiveCamera(32, 1, 0.1, 100);
  const fit = () => {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (onFit) onFit(camera);
    if (redraw) redraw();
  };
  fit();
  new ResizeObserver(fit).observe(host);
  return { renderer, camera, onRedraw: (fn) => { redraw = fn; } };
}

// Hero: one point per species, clustered family > genus, long-tailed family sizes.
// Hovering a cluster lights it and draws its family-to-genus branches.
function speciesField({ reduce, onFieldReady, onFamily }) {
  const host = document.getElementById('field');
  const { renderer, camera, onRedraw } = makeRenderer(host, false, (cam) => {
    cam.position.z = cameraZ(cam.aspect);
  });
  const scene = new Scene();
  scene.background = new Color(css('--night'));

  const { pos, size, fam: famAttr, families } = makeSpecies();
  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(pos, 3));
  geo.setAttribute('size', new BufferAttribute(size, 1));
  geo.setAttribute('fam', new BufferAttribute(famAttr, 1));
  const mat = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uColor: { value: new Color(css('--night-fg')) },
      uPx: { value: renderer.getPixelRatio() },
      uFam: { value: -1 },
      uDim: { value: 0 },
    },
    vertexShader: `
      attribute float size; attribute float fam;
      uniform float uPx; uniform float uFam; uniform float uDim;
      varying float vFade; varying float vBoost;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        float isF = step(abs(fam - uFam), 0.5);
        gl_PointSize = size * uPx * (24.0 / -mv.z) * mix(1.0, mix(0.9, 2.0, isF), uDim);
        vFade = 1.0 - smoothstep(7.0, 15.5, -mv.z);
        vBoost = mix(1.0, mix(0.25, 1.6, isF), uDim);
      }`,
    fragmentShader: `
      uniform vec3 uColor; varying float vFade; varying float vBoost;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        gl_FragColor = vec4(uColor, min(1.0, (1.0 - smoothstep(0.28, 0.5, d)) * mix(0.16, 0.95, vFade) * vBoost));
      }`,
  });
  const points = new Points(geo, mat);
  const group = new Group();
  group.add(points);

  const maxGenera = families.reduce((m, f) => Math.max(m, f.gc.length), 1);
  const linePos = new Float32Array(maxGenera * 2 * 3);
  const lineGeo = new BufferGeometry();
  lineGeo.setAttribute('position', new BufferAttribute(linePos, 3));
  const lineMat = new LineBasicMaterial({ color: new Color(css('--night-fg')), transparent: true, opacity: 0 });
  group.add(new LineSegments(lineGeo, lineMat));
  scene.add(group);

  let current = -1, dimTarget = 0;
  function setFamily(f) {
    if (f === current) return;
    if (f < 0) { dimTarget = 0; current = -1; if (onFamily) onFamily(null); return; }
    current = f;
    if (onFamily) onFamily(families[f]);
    dimTarget = 1;
    mat.uniforms.uFam.value = f;
    const fam = families[f];
    let j = 0;
    fam.gc.forEach((g) => {
      linePos[j++] = fam.fc[0]; linePos[j++] = fam.fc[1]; linePos[j++] = fam.fc[2];
      linePos[j++] = g[0]; linePos[j++] = g[1]; linePos[j++] = g[2];
    });
    lineGeo.setDrawRange(0, fam.gc.length * 2);
    lineGeo.attributes.position.needsUpdate = true;
  }

  const raycaster = new Raycaster();
  raycaster.params.Points.threshold = 0.07;
  const ndc = new Vector2();
  let rx = START_TILT, ry = 0, vy = reduce ? 0 : 0.0016, drag = null, mx = 0, my = 0, pick = false;

  const render = () => {
    group.rotation.set(rx + my * 0.14, ry + mx * 0.22, 0);
    renderer.render(scene, camera);
  };
  const doPick = () => {
    pick = false;
    group.updateMatrixWorld();
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObject(points)[0];
    setFamily(hit ? famAttr[hit.index] : -1);
  };
  let downAt = null;
  host.addEventListener('pointerdown', (e) => {
    drag = { x: e.clientX, y: e.clientY };
    downAt = { x: e.clientX, y: e.clientY };
    try { host.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  });
  host.addEventListener('pointermove', (e) => {
    const b = host.getBoundingClientRect();
    mx = (e.clientX - b.left) / b.width - 0.5;
    my = (e.clientY - b.top) / b.height - 0.5;
    ndc.set(mx * 2, -my * 2);
    if (drag) {
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      drag = { x: e.clientX, y: e.clientY };
      ry += dx * 0.006;
      rx = Math.max(-1.2, Math.min(1.2, rx + dy * 0.004));
      vy = reduce ? 0 : dx * 0.0006;
    } else if (e.pointerType === 'mouse') {
      pick = true;
    }
    if (reduce) {
      if (pick) doPick();
      mat.uniforms.uDim.value = dimTarget;
      lineMat.opacity = 0.5 * dimTarget;
      render();
    }
  });
  const end = () => { drag = null; };
  host.addEventListener('pointerup', (e) => {
    if (e.pointerType !== 'mouse' && downAt && Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) < 8) {
      const b = host.getBoundingClientRect();
      ndc.set(((e.clientX - b.left) / b.width) * 2 - 1, -(((e.clientY - b.top) / b.height) * 2 - 1));
      doPick();
      if (reduce) { mat.uniforms.uDim.value = dimTarget; lineMat.opacity = 0.5 * dimTarget; render(); }
    }
    downAt = null;
    end();
  });
  host.addEventListener('pointercancel', () => { downAt = null; end(); });
  host.addEventListener('pointerleave', (e) => {
    if (e.pointerType !== 'mouse') return;
    mx = 0; my = 0; setFamily(-1);
    if (reduce) { mat.uniforms.uDim.value = 0; lineMat.opacity = 0; render(); }
  });
  render();
  onRedraw(render);
  host.classList.add('gl-on');
  if (onFieldReady) onFieldReady();
  if (!reduce) {
    whileVisible(host, () => {
      if (!drag) { ry += vy; vy += (0.0016 - vy) * 0.02; }
      if (pick) doPick();
      const u = mat.uniforms.uDim;
      u.value += (dimTarget - u.value) * 0.12;
      lineMat.opacity = 0.5 * u.value;
      render();
    });
  }
}

// Research: scroll-driven tiled inference on a real test quadrat.
function quadratFigure({ reduce, stageProgress }) {
  const host = document.getElementById('quad');
  const img = document.getElementById('quadImg');
  let dirty = true;
  const { renderer, camera } = makeRenderer(host, true, (cam) => {
    cam.position.z = 11 * Math.max(1, 1.05 / cam.aspect);
    dirty = true;
  });
  const scene = new Scene();
  const tex = new TextureLoader().load(img.currentSrc || img.src, () => { dirty = true; img.hidden = true; });
  const ink = new Color(css('--ink'));
  const n = 4, S = 4, t = S / n;
  const group = new Group();
  scene.add(group);
  const edgeMat = new LineBasicMaterial({ color: ink, transparent: true, opacity: 0 });
  const ghostEdge = new LineBasicMaterial({ color: ink, transparent: true, opacity: 0 });
  const tiles = [];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const geo = new PlaneGeometry(t, t);
      const uv = geo.attributes.uv;
      const u0 = c / n, u1 = (c + 1) / n, v0 = 1 - (r + 1) / n, v1 = 1 - r / n;
      uv.setXY(0, u0, v1); uv.setXY(1, u1, v1); uv.setXY(2, u0, v0); uv.setXY(3, u1, v0);
      const edges = new EdgesGeometry(geo);
      const mesh = new Mesh(geo, new MeshBasicMaterial({ map: tex, transparent: true }));
      mesh.add(new LineSegments(edges, edgeMat));
      const ghost = new Mesh(geo, new MeshBasicMaterial({ map: tex, transparent: true, opacity: 0, depthWrite: false }));
      ghost.add(new LineSegments(edges, ghostEdge));
      group.add(ghost);
      group.add(mesh);
      tiles.push({ mesh, ghost, r, c, bx: -S / 2 + t / 2 + c * t, by: S / 2 - t / 2 - r * t });
    }
  }

  const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
  const seg = (q, a, b) => ease((q - a) / (b - a));
  let mxs = 0, mys = 0, mxt = 0, myt = 0;
  function layout(q) {
    const a = seg(q, 0.02, 0.26);   // stand the frame up
    const b = seg(q, 0.30, 0.50);   // split into tiles
    const c = seg(q, 0.55, 0.74);   // second resolution
    const d = seg(q, 0.80, 0.97);   // aggregate
    group.rotation.x = -1.0 * (1 - a) + 0.22 * c * (1 - d) + mys * 0.2;
    group.rotation.y = 0.6 * c * (1 - d) + mxs * 0.3;
    group.rotation.z = 0.2 * (1 - a);
    const spread = 1 + (0.17 * b * (1 - d)) / t;
    const pull = 1 - 0.86 * d;
    edgeMat.opacity = 0.9 * b;
    ghostEdge.opacity = 0.9 * c * (1 - d);
    tiles.forEach((T, i) => {
      const x = T.bx * spread * pull, y = T.by * spread * pull;
      const wave = Math.sin((T.r + T.c) * 0.95) * 0.32 * b * (1 - c);
      const lift = d * i * 0.012;
      T.mesh.position.set(x, y, wave + lift);
      T.mesh.scale.setScalar(1 - 0.5 * d);
      T.ghost.position.set(x + 0.16 * c, y + 0.16 * c, wave - 1.15 * c + lift);
      T.ghost.scale.setScalar(1 - 0.5 * d);
      T.ghost.material.opacity = 0.5 * c * (1 - d);
    });
  }
  host.addEventListener('pointermove', (e) => {
    const b = host.getBoundingClientRect();
    mxt = (e.clientX - b.left) / b.width - 0.5;
    myt = (e.clientY - b.top) / b.height - 0.5;
  });
  host.addEventListener('pointerleave', () => { mxt = 0; myt = 0; });

  let ps = stageProgress(), drawn = -1, dmx = 0, dmy = 0;
  const frame = () => {
    const p = stageProgress();
    ps = reduce ? p : ps + (p - ps) * 0.1;
    if (!reduce) { mxs += (mxt - mxs) * 0.08; mys += (myt - mys) * 0.08; }
    const moved = Math.abs(mxs - dmx) > 0.0005 || Math.abs(mys - dmy) > 0.0005;
    if (!dirty && !moved && Math.abs(ps - drawn) < 0.0005) return;
    layout(ps);
    renderer.render(scene, camera);
    drawn = ps; dmx = mxs; dmy = mys; dirty = false;
  };
  frame();
  whileVisible(host, frame);
}

// Research: the BioCLIP 2.5 ViT-H/14 encoder as fine-tuned for PlantCLEF 2026, at its real
// sizes. A quadrat tile is cut into 14 px patches (16 × 16 at 224 px and 24 × 24 at 336 px,
// taking turns); the patch tokens and the CLS token pass through the 32 transformer blocks,
// the lower 28 frozen and the last 4 fine-tuned, with attention arcs inside each. The CLS
// embedding (1,024-d) then feeds the family, genus and species heads, drawn with one dot
// per class in taxonomic order, where a few species light up with their genus and family.
function modelFigure({ reduce }) {
  const host = document.getElementById('modelGl');
  const tags = Array.from(host.querySelectorAll('.mt'));
  const tileTag = tags.find((el) => el.dataset.at === 'tile');
  const ink = new Color(css('--ink')), ink2 = new Color(css('--ink-2')), ink3 = new Color(css('--ink-3'));
  const px = Math.min(window.devicePixelRatio || 1, 2);
  const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
  const seg = (t, a, b) => ease((t - a) / (b - a));

  // The pipeline runs along x and each block is an L × L square across it.
  const L = 2, BLOCKS = 32, FROZEN = 28, DS = 0.02, MAXG = 24;
  const bx = Array.from({ length: BLOCKS }, (_, i) => -2 + Math.min(i, FROZEN - 1) * 0.1 + Math.max(0, i - FROZEN + 1) * 0.24);
  const IN_X = bx[0] - 0.55, TILE_X = IN_X - 1.9, CLS_X = bx[BLOCKS - 1] + 2.4, HEAD_X = CLS_X + 0.8, TOP = L / 2 + 0.3;
  const sheetX = (s) => {
    if (s < 0) return IN_X;
    const i = Math.min(BLOCKS - 2, Math.floor(s));
    return bx[i] + (bx[i + 1] - bx[i]) * Math.min(1, s - i);
  };

  // Image-like things (the tile, tokens, heads) are laid out in plane coordinates, u right
  // and v up. On wide screens the plane stands upright across the pipeline; on narrow ones
  // the pipeline runs downwards, the planes lie flat and u, v turn with them.
  let vertical = false;
  const toPlane = (u, v, out, o) => {
    if (vertical) { out[o + 1] = u; out[o + 2] = -v; } else { out[o + 1] = v; out[o + 2] = u; }
  };

  // Heads: family, genus, species, one dot per class in taxonomic order. Side by side to
  // the right of the stack on wide screens, in a column under it on narrow ones.
  const genusOf = [], familyOf = [];
  FAMILIES.forEach(([, genera], f) => genera.forEach((n) => { for (let k = 0; k < n; k++) genusOf.push(familyOf.length); familyOf.push(f); }));
  const heads = [[FAMILIES.length, 14], [familyOf.length, 39], [genusOf.length, 89]].map(([n, cols]) => ({ n, cols, w: (cols - 1) * DS, h: (Math.ceil(n / cols) - 1) * DS }));
  let total = 0;
  heads.forEach((hd) => { hd.start = total; total += hd.n; });
  const spreadHeads = () => {
    let u = 0.5, v = -0.2;
    heads.forEach((hd) => {
      if (vertical) { hd.cu = 0; hd.cv = v - hd.h / 2; v -= hd.h + 0.3; } else { hd.cu = u + hd.w / 2; hd.cv = 0; u += hd.w + 0.45; }
    });
  };
  // a fixed sub-spacing jitter keeps the dense grids from showing moiré
  const jit = (k) => ((Math.sin(k * 12.9898) * 43758.5453) % 1) * 0.35 * DS;
  const dotAt = (hd, k, out, o) => {
    out[o] = HEAD_X;
    toPlane(hd.cu - hd.w / 2 + (k % hd.cols) * DS + jit(k), hd.cv + hd.h / 2 - Math.floor(k / hd.cols) * DS + jit(k + 7919), out, o);
  };

  const scene = new Scene();
  const rig = new Group(), turn = new Group(), pipe = new Group();
  scene.add(rig);
  rig.add(turn);
  turn.add(pipe);

  const dots = (n, size, alpha) => {
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(new Float32Array(n * 3), 3).setUsage(DynamicDrawUsage));
    geo.setAttribute('size', new BufferAttribute(new Float32Array(n).fill(size), 1));
    geo.setAttribute('alpha', new BufferAttribute(new Float32Array(n).fill(alpha), 1).setUsage(DynamicDrawUsage));
    const p = new Points(geo, new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uColor: { value: ink }, uPx: { value: px }, uA: { value: 1 } },
      vertexShader: `
        attribute float size; attribute float alpha; uniform float uPx; varying float vA;
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * uPx;
          vA = alpha;
        }`,
      fragmentShader: `
        uniform vec3 uColor; uniform float uA; varying float vA;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          gl_FragColor = vec4(uColor, vA * uA * (1.0 - smoothstep(0.32, 0.5, d)));
        }`,
    }));
    p.frustumCulled = false;
    pipe.add(p);
    return p;
  };
  const lines = (n, color, opacity) => {
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(new Float32Array(n * 6), 3).setUsage(DynamicDrawUsage));
    const l = new LineSegments(geo, new LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false }));
    l.frustumCulled = false;
    pipe.add(l);
    return l;
  };
  const square = (out, x, s) => {
    const h = s / 2, c = [[-h, -h], [h, -h], [h, h], [-h, h]];
    for (let k = 0; k < 4; k++) out.push(x, ...c[k], x, ...c[(k + 1) % 4]);
  };

  // Blocks: the frozen ones light grey, the fine-tuned four in ink with an inner square and
  // a faint fill. Each darkens while the tokens pass through.
  const bPos = [], bSpan = [];
  bx.forEach((x, i) => {
    const s = bPos.length / 3;
    square(bPos, x, L);
    if (i >= FROZEN) square(bPos, x, L - 0.14);
    bSpan.push([s, bPos.length / 3]);
  });
  const bGeo = new BufferGeometry();
  bGeo.setAttribute('position', new BufferAttribute(new Float32Array(bPos), 3));
  const bCol = new Float32Array(bPos.length);
  bGeo.setAttribute('color', new BufferAttribute(bCol, 3));
  const blocks = new LineSegments(bGeo, new LineBasicMaterial({ vertexColors: true }));
  blocks.frustumCulled = false;
  pipe.add(blocks);
  const fills = bx.slice(FROZEN).map((x) => {
    const m = new Mesh(new PlaneGeometry(L, L), new MeshBasicMaterial({ color: ink, transparent: true, opacity: 0.04, depthWrite: false, side: DoubleSide }));
    m.position.x = x;
    m.rotation.y = Math.PI / 2;
    pipe.add(m);
    return m;
  });
  // Brackets over the frozen and the fine-tuned blocks.
  const br = [];
  for (const [a, b] of [[0, FROZEN - 1], [FROZEN, BLOCKS - 1]]) {
    br.push(bx[a], TOP, 0, bx[b], TOP, 0, bx[a], TOP, 0, bx[a], TOP - 0.1, 0, bx[b], TOP, 0, bx[b], TOP - 0.1, 0);
  }
  lines(br.length / 6, ink2, 0.9).geometry.attributes.position.array.set(br);

  // The tile: up to 24 × 24 textured patches cut from one quadrat tile (row 2, column 3 of 4).
  const tex = new TextureLoader().load('/assets/img/quadrat.webp', () => { if (reduce) draw(0); });
  const pGeo = new BufferGeometry();
  const pPos = new Float32Array(MAXG * MAXG * 12), pUv = new Float32Array(MAXG * MAXG * 8), pIdx = [];
  for (let k = 0; k < MAXG * MAXG; k++) pIdx.push(k * 4, k * 4 + 1, k * 4 + 2, k * 4, k * 4 + 2, k * 4 + 3);
  pGeo.setAttribute('position', new BufferAttribute(pPos, 3).setUsage(DynamicDrawUsage));
  pGeo.setAttribute('uv', new BufferAttribute(pUv, 2));
  pGeo.setIndex(pIdx);
  const patchMat = new MeshBasicMaterial({ map: tex, transparent: true, side: DoubleSide, depthWrite: false });
  const patches = new Mesh(pGeo, patchMat);
  patches.frustumCulled = false;
  pipe.add(patches);
  // a faint copy stays in place while the patches are away
  const ghostGeo = new BufferGeometry();
  ghostGeo.setAttribute('position', new BufferAttribute(new Float32Array(12), 3));
  ghostGeo.setAttribute('uv', new BufferAttribute(new Float32Array([0.5, 0.5, 0.75, 0.5, 0.75, 0.75, 0.5, 0.75]), 2));
  ghostGeo.setIndex([0, 1, 2, 0, 2, 3]);
  pipe.add(new Mesh(ghostGeo, new MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.14, side: DoubleSide, depthWrite: false })));
  const tf = [];
  square(tf, TILE_X, L);
  lines(4, ink3, 1).geometry.attributes.position.array.set(tf);
  const grid = lines((MAXG - 1) * 2, ink, 0);

  // Tokens: [0] is CLS, then one per patch. Attention arcs join tokens inside a block.
  const tokens = dots(MAXG * MAXG + 1, 2.4, 0);
  const tokUV = new Float32Array((MAXG * MAXG + 1) * 2);
  const ARCS = 26, SEG = 10;
  const arcs = lines(ARCS * SEG, ink, 0);
  const pairs = new Int32Array(ARCS * 2);

  // The CLS embedding, branches to the heads, the heads, and a few picked species joined
  // to their genus and family.
  const emb = dots(1024, 1.2, 0.5);
  const ep = emb.geometry.attributes.position.array;
  for (let k = 0; k < 1024; k++) { ep[k * 3] = CLS_X; ep[k * 3 + 1] = ((k >> 5) - 15.5) * 0.018; ep[k * 3 + 2] = ((k & 31) - 15.5) * 0.018; }
  const branches = lines(heads.length, ink2, 0);
  const headDots = dots(total, 2, 0.22);
  const MAXHI = 6, LSEG = 8;
  const hi = dots(MAXHI * 3, 4.5, 1);
  const links = lines(MAXHI * 2 * LSEG, ink, 0);
  let picks = [];

  // Everything that depends on the layout.
  const placeHeads = () => {
    const g = ghostGeo.attributes.position;
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([a, b], k) => { g.array[k * 3] = TILE_X + 0.005; toPlane((a * L) / 2, (b * L) / 2, g.array, k * 3); });
    g.needsUpdate = true;
    spreadHeads();
    const hp = headDots.geometry.attributes.position.array;
    heads.forEach((hd) => { for (let k = 0; k < hd.n; k++) dotAt(hd, k, hp, (hd.start + k) * 3); });
    headDots.geometry.attributes.position.needsUpdate = true;
    const a = hi.geometry.attributes.position.array, l = links.geometry.attributes.position.array;
    picks.forEach((s, j) => {
      const g = genusOf[s];
      dotAt(heads[2], s, a, j * 9);
      dotAt(heads[1], g, a, j * 9 + 3);
      dotAt(heads[0], familyOf[g], a, j * 9 + 6);
      for (let e = 0; e < 2; e++) {
        const p = j * 9 + e * 3, q = p + 3;
        for (let m = 0; m < LSEG; m++) {
          for (let k = 0; k < 2; k++) {
            const t = (m + k) / LSEG, o = ((j * 2 + e) * LSEG + m) * 6 + k * 3;
            l[o] = a[p] + 1.2 * t * (1 - t);
            l[o + 1] = a[p + 1] + (a[q + 1] - a[p + 1]) * t;
            l[o + 2] = a[p + 2] + (a[q + 2] - a[p + 2]) * t;
          }
        }
      }
    });
    hi.geometry.setDrawRange(0, picks.length * 3);
    links.geometry.setDrawRange(0, picks.length * 2 * LSEG * 2);
    hi.geometry.attributes.position.needsUpdate = true;
    links.geometry.attributes.position.needsUpdate = true;
  };

  let G = 16, run = -1, lastBlock = -2;
  const setRun = (k) => {
    run = k;
    G = k % 2 ? 24 : 16;
    tileTag.textContent = G * 14 + ' px, ' + G + ' × ' + G + ' patches';
    for (let r = 0; r < G; r++) {
      for (let c = 0; c < G; c++) {
        const i = r * G + c, a = 0.5 + (c / G) * 0.25, b = 0.5 + ((c + 1) / G) * 0.25;
        const top = 0.75 - (r / G) * 0.25, bot = 0.75 - ((r + 1) / G) * 0.25;
        pUv.set([a, bot, b, bot, b, top, a, top], i * 8);
        tokUV[(i + 1) * 2] = ((c + 0.5) / G - 0.5) * L;
        tokUV[(i + 1) * 2 + 1] = (0.5 - (r + 0.5) / G) * L;
      }
    }
    tokUV[0] = 0;
    tokUV[1] = L / 2 + 0.22;
    pGeo.attributes.uv.needsUpdate = true;
    pGeo.setDrawRange(0, G * G * 6);
    const size = tokens.geometry.attributes.size;
    size.array.fill(G > 16 ? 1.8 : 2.4);
    size.array[0] = 5;
    size.needsUpdate = true;
    tokens.geometry.setDrawRange(0, G * G + 1);
    picks = Array.from({ length: reduce ? 4 : 3 + Math.floor(Math.random() * 4) }, () => Math.floor(Math.random() * genusOf.length));
    placeHeads();
  };
  const pickPairs = () => {
    for (let k = 0; k < ARCS; k++) {
      pairs[k * 2] = k < 8 ? 0 : 1 + Math.floor(Math.random() * G * G);
      pairs[k * 2 + 1] = 1 + Math.floor(Math.random() * G * G);
    }
  };

  // Labels: an anchor in pipeline space and which side of it the text sits on. On narrow
  // screens they all move to the right of the pipeline.
  const v3 = new Vector3(), tint = new Color(), A = [0, 0, 0], B = [0, 0, 0];
  const ABOVE = 'translate(-50%, -100%)', ABOVE_L = 'translate(0, -100%)', BELOW_R = 'translate(-12px, 6px)', RIGHT = 'translate(8px, -50%)';
  const label = (at) => {
    const V = vertical;
    if (at === 'tile') return [[TILE_X, L / 2 + 0.2, V ? 0 : -L / 2], V ? RIGHT : ABOVE_L];
    if (at === 'frozen') return [[V ? (bx[0] + bx[FROZEN - 1]) / 2 : bx[0], TOP + 0.06, 0], V ? RIGHT : ABOVE_L];
    if (at === 'tuned') return [[(bx[FROZEN] + bx[BLOCKS - 1]) / 2, TOP + 0.06, 0], V ? RIGHT : ABOVE];
    if (at === 'cls') return [[CLS_X, V ? 0.4 : -0.4, 0], V ? RIGHT : BELOW_R];
    const hd = heads[['family', 'genus', 'species'].indexOf(at)], o = [HEAD_X, 0, 0];
    if (V) toPlane(hd.cu + hd.w / 2 + 0.06, hd.cv, o, 0); else toPlane(hd.cu, hd.cv + hd.h / 2 + 0.1, o, 0);
    return [o, V ? RIGHT : ABOVE];
  };

  let camera, renderer, onRedraw, w = 0, h = 0, mxs = 0, mys = 0, mxt = 0, myt = 0, clock = 0;
  const pose = () => {
    if (vertical) rig.rotation.set(0.62 + mys * 0.15, -0.32 + mxs * 0.3, 0);
    else rig.rotation.set(0.26 + mys * 0.15, 0.92 + mxs * 0.3, 0);
  };
  // Fit the camera to the whole pipeline, labels included, for the current layout.
  const fitCam = (cam) => {
    w = host.clientWidth;
    h = host.clientHeight;
    vertical = cam.aspect < 1;
    turn.rotation.z = vertical ? -Math.PI / 2 : 0;
    pose();
    placeHeads();
    cam.fov = 24;
    cam.updateProjectionMatrix();
    rig.updateMatrixWorld(true);
    const box = [];
    for (const x of [TILE_X, bx[BLOCKS - 1]]) for (const a of [-1, 1]) for (const b of [-1, 1]) box.push([x, (a * L) / 2, (b * L) / 2]);
    tags.forEach((el) => box.push(label(el.dataset.at)[0]));
    heads.forEach((hd) => {
      for (const [a, b] of [[-1, -1], [1, 1]]) { const p = [HEAD_X, 0, 0]; toPlane(hd.cu + (a * hd.w) / 2, hd.cv + (b * hd.h) / 2, p, 0); box.push(p); }
    });
    const pts = box.map((p) => new Vector3(...p).applyMatrix4(pipe.matrixWorld));
    const aim = pts.reduce((a, p) => a.add(p), new Vector3()).multiplyScalar(1 / pts.length);
    const place = (d) => { cam.position.set(aim.x, aim.y, aim.z + d); cam.lookAt(aim); cam.updateMatrixWorld(); };
    // NDC window for the geometry: room above for labels on wide screens, a lane on the
    // right for them on narrow ones
    const [ax0, ax1, ay0, ay1] = vertical ? [-0.94, 0.1, -0.95, 0.95] : [-0.96, 0.9, -0.95, 0.84];
    const bounds = () => {
      const r = [Infinity, -Infinity, Infinity, -Infinity];
      pts.forEach((p) => { v3.copy(p).project(cam); r[0] = Math.min(r[0], v3.x); r[1] = Math.max(r[1], v3.x); r[2] = Math.min(r[2], v3.y); r[3] = Math.max(r[3], v3.y); });
      return r;
    };
    // closest distance that fits the window, then shift so the bounds sit in its middle
    let d = 20;
    for (let pass = 0; pass < 3; pass++) {
      let lo = 1, far = 150;
      for (let k = 0; k < 22; k++) {
        d = (lo + far) / 2;
        place(d);
        const [x0, x1, y0, y1] = bounds();
        if (x1 - x0 < ax1 - ax0 && y1 - y0 < ay1 - ay0) far = d; else lo = d;
      }
      d = far;
      place(d);
      const [x0, x1, y0, y1] = bounds(), hh = d * Math.tan((cam.fov * Math.PI) / 360);
      aim.x += ((x0 + x1) / 2 - (ax0 + ax1) / 2) * hh * cam.aspect;
      aim.y += ((y0 + y1) / 2 - (ay0 + ay1) / 2) * hh;
    }
    place(d);
  };
  ({ renderer, camera, onRedraw } = makeRenderer(host, true, fitCam));

  const T = 9.6;
  function draw(time) {
    const k = Math.floor(time / T);
    if (k !== run) setRun(k);
    const t = time - k * T, R = reduce;
    const tileIn = R ? 1 : seg(t, 0, 0.4);
    const gridOn = R ? 1 : seg(t, 0.35, 0.75) * (1 - seg(t, 0.95, 1.4));
    const split = R ? 1 : seg(t, 0.45, 0.9);
    // block index of the token sheet: the frozen 28 quickly, the fine-tuned 4 slowly
    const s = R ? -9 : t < 2.35 ? -1 : t < 4.55 ? ((t - 2.35) / 2.2) * (FROZEN - 1) : Math.min(BLOCKS - 1, FROZEN - 1 + ((t - 4.55) / 1.4) * (BLOCKS - FROZEN));
    const out = R ? 1 : seg(t, 6.0, 6.45);
    const clsGo = R ? 1 : seg(t, 6.0, 6.8);
    const fade = R ? 0 : seg(t, 9.0, 9.5);
    const embOn = (R ? 1 : seg(t, 6.5, 7.0)) * (1 - fade);
    const brOn = R ? 1 : seg(t, 6.8, 7.5);
    const headOn = (R ? 1 : seg(t, 7.2, 7.7)) * (1 - fade);
    const hiOn = (R ? 1 : seg(t, 7.6, 8.1)) * (1 - fade);

    // Patches fly from the tile to the input, shrinking into their tokens.
    patchMat.opacity = tileIn;
    const n = G * G, X = sheetX(s), tp = tokens.geometry.attributes.position.array, ta = tokens.geometry.attributes.alpha.array;
    for (let i = 0; i < n; i++) {
      const d = 0.95 + (0.75 * i) / n, f = R ? 0 : seg(t, d, d + 0.55);
      const sc = f >= 1 ? 0 : ((1 - 0.8 * f) * (1 - 0.14 * split) * L) / G / 2;
      const cu = tokUV[(i + 1) * 2] * (1 + 0.08 * split), cv = tokUV[(i + 1) * 2 + 1] * (1 + 0.08 * split);
      const x = TILE_X + (IN_X - TILE_X) * f, o = i * 12;
      pPos[o] = pPos[o + 3] = pPos[o + 6] = pPos[o + 9] = x;
      toPlane(cu - sc, cv - sc, pPos, o);
      toPlane(cu + sc, cv - sc, pPos, o + 3);
      toPlane(cu + sc, cv + sc, pPos, o + 6);
      toPlane(cu - sc, cv + sc, pPos, o + 9);
      const j = (i + 1) * 3;
      tp[j] = X + (s >= 0 && s < BLOCKS - 1 ? 0.04 * Math.sin(i * 1.7 + t * 7) : 0);
      toPlane(tokUV[(i + 1) * 2], tokUV[(i + 1) * 2 + 1], tp, j);
      ta[i + 1] = (R ? 0 : seg(f, 0.75, 1)) * (1 - out);
    }
    pGeo.attributes.position.needsUpdate = true;
    // CLS rides above the grid, then leaves for the embedding.
    toPlane(tokUV[0], tokUV[1], tp, 0);
    tp[0] = X + (CLS_X - X) * clsGo;
    tp[1] *= 1 - clsGo;
    tp[2] *= 1 - clsGo;
    ta[0] = (R ? 1 : seg(t, 1.6, 2.0)) * (1 - fade);
    tokens.geometry.attributes.position.needsUpdate = true;
    tokens.geometry.attributes.alpha.needsUpdate = true;

    // the patch grid drawn over the tile before it splits
    const gp = grid.geometry.attributes.position.array;
    for (let i = 1; i < G; i++) {
      const q = (i / G - 0.5) * L, o = (i - 1) * 12;
      gp[o] = gp[o + 3] = gp[o + 6] = gp[o + 9] = TILE_X - 0.01;
      toPlane(q, -L / 2, gp, o);
      toPlane(q, L / 2, gp, o + 3);
      toPlane(-L / 2, q, gp, o + 6);
      toPlane(L / 2, q, gp, o + 9);
    }
    grid.geometry.setDrawRange(0, (G - 1) * 4);
    grid.geometry.attributes.position.needsUpdate = true;
    grid.material.opacity = 0.7 * gridOn;

    // Blocks darken around the tokens.
    for (let i = 0; i < BLOCKS; i++) {
      const near = s >= 0 && t < 6.2 ? Math.max(0, 1 - Math.abs(s - i) / 1.6) : 0;
      tint.copy(i < FROZEN ? ink3 : ink).lerp(ink, near);
      for (let m = bSpan[i][0]; m < bSpan[i][1]; m++) tint.toArray(bCol, m * 3);
      if (i >= FROZEN) fills[i - FROZEN].material.opacity = 0.035 + 0.08 * near;
    }
    bGeo.attributes.color.needsUpdate = true;

    // Attention arcs in the current block, new pairs in each block.
    const live = s >= 0 && t < 6.0;
    arcs.material.opacity = live ? 0.45 * seg(t, 2.35, 2.5) : 0;
    if (live) {
      const b = Math.round(s);
      if (b !== lastBlock) { lastBlock = b; pickPairs(); }
      const ap = arcs.geometry.attributes.position.array;
      for (let a = 0; a < ARCS; a++) {
        toPlane(tokUV[pairs[a * 2] * 2], tokUV[pairs[a * 2] * 2 + 1], A, 0);
        toPlane(tokUV[pairs[a * 2 + 1] * 2], tokUV[pairs[a * 2 + 1] * 2 + 1], B, 0);
        const bulge = 0.12 + (0.3 * Math.hypot(A[1] - B[1], A[2] - B[2])) / L;
        for (let m = 0; m < SEG; m++) {
          for (let e = 0; e < 2; e++) {
            const q = (m + e) / SEG, o = (a * SEG + m) * 6 + e * 3;
            ap[o] = X - bulge * 4 * q * (1 - q);
            ap[o + 1] = A[1] + (B[1] - A[1]) * q;
            ap[o + 2] = A[2] + (B[2] - A[2]) * q;
          }
        }
      }
      arcs.geometry.attributes.position.needsUpdate = true;
    } else lastBlock = -2;

    // embedding, branches, heads
    emb.material.uniforms.uA.value = embOn;
    const bp = branches.geometry.attributes.position.array;
    heads.forEach((hd, i) => {
      toPlane(hd.cu * brOn, hd.cv * brOn, B, 0);
      bp.set([CLS_X, 0, 0, CLS_X + (HEAD_X - CLS_X) * brOn, B[1], B[2]], i * 6);
    });
    branches.geometry.attributes.position.needsUpdate = true;
    branches.material.opacity = 0.8 * Math.min(brOn, 1 - fade);
    headDots.material.uniforms.uA.value = 0.5 + 0.5 * headOn;
    hi.material.uniforms.uA.value = hiOn;
    links.material.opacity = 0.6 * hiOn;

    renderer.render(scene, camera);
    tags.forEach((el) => {
      const [p, side] = label(el.dataset.at);
      v3.set(...p).applyMatrix4(pipe.matrixWorld).project(camera);
      el.style.transform = 'translate(' + (((v3.x + 1) / 2) * w).toFixed(1) + 'px, ' + (((1 - v3.y) / 2) * h).toFixed(1) + 'px) ' + side;
    });
  }

  host.addEventListener('pointermove', (e) => {
    const b = host.getBoundingClientRect();
    mxt = (e.clientX - b.left) / b.width - 0.5;
    myt = (e.clientY - b.top) / b.height - 0.5;
  });
  host.addEventListener('pointerleave', () => { mxt = 0; myt = 0; });
  draw(0);
  onRedraw(() => draw(clock));
  host.classList.add('gl-on');
  if (reduce) return;
  whileVisible(host, (dt) => {
    clock += dt;
    mxs += (mxt - mxs) * 0.06;
    mys += (myt - mys) * 0.06;
    pose();
    draw(clock);
  });
}

// Footer: rippling dot field under the address, after the three.js points examples.
function wavesField({ reduce }) {
  const wrap = document.getElementById('addrWrap');
  const host = document.getElementById('waves');
  const { renderer, camera, onRedraw } = makeRenderer(host, true, (cam) => {
    cam.position.set(0, 5.2, 14);
    cam.lookAt(0, 0, 0);
  });
  const scene = new Scene();
  const COLS = 160, ROWS = 28, GAP = 0.34;
  const pos = new Float32Array(COLS * ROWS * 3);
  let i = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      pos[i++] = (c - (COLS - 1) / 2) * GAP;
      pos[i++] = 0;
      pos[i++] = (r - (ROWS - 1) / 2) * GAP;
    }
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(pos, 3));
  const mat = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new Vector3(999, 0, 999) },
      uOn: { value: 0 },
      uColor: { value: new Color(css('--ink')) },
      uPx: { value: renderer.getPixelRatio() },
    },
    vertexShader: `
      uniform float uTime; uniform vec3 uMouse; uniform float uOn; uniform float uPx; varying float vA;
      void main() {
        vec3 p = position;
        float w = sin(p.x * 0.42 + uTime * 0.8) * 0.22 + cos(p.z * 0.7 + p.x * 0.12 + uTime * 0.6) * 0.16;
        float d = distance(p.xz, uMouse.xz);
        float rip = exp(-d * d * 0.12) * sin(d * 2.2 - uTime * 4.5) * 0.7 * uOn;
        p.y += w + rip;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uPx * (1.4 + abs(rip) * 1.8) * (16.0 / -mv.z);
        vA = (1.0 - smoothstep(9.0, 26.0, -mv.z)) * (0.4 + abs(rip) * 0.9);
      }`,
    fragmentShader: `
      uniform vec3 uColor; varying float vA;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        if (d > 0.5) discard;
        gl_FragColor = vec4(uColor, (1.0 - smoothstep(0.25, 0.5, d)) * min(vA, 1.0));
      }`,
  });
  scene.add(new Points(geo, mat));

  const raycaster = new Raycaster();
  const plane = new Plane(new Vector3(0, 1, 0), 0);
  const hit = new Vector3();
  const ndc = new Vector2();
  let onTarget = 0;
  wrap.addEventListener('pointermove', (e) => {
    const b = host.getBoundingClientRect();
    ndc.set(((e.clientX - b.left) / b.width) * 2 - 1, -(((e.clientY - b.top) / b.height) * 2 - 1));
    raycaster.setFromCamera(ndc, camera);
    if (raycaster.ray.intersectPlane(plane, hit)) { mat.uniforms.uMouse.value.copy(hit); onTarget = 1; }
  });
  wrap.addEventListener('pointerleave', () => { onTarget = 0; });
  renderer.render(scene, camera);
  onRedraw(() => renderer.render(scene, camera));
  if (!reduce) {
    whileVisible(host, (dt) => {
      mat.uniforms.uTime.value += dt;
      mat.uniforms.uOn.value += (onTarget - mat.uniforms.uOn.value) * 0.06;
      renderer.render(scene, camera);
    });
  }
}

// Research: a wireframe knot that loses detail as the cursor moves right.
function meshFigure({ reduce }) {
  const host = document.getElementById('meshfig');
  const { renderer, camera, onRedraw } = makeRenderer(host, true, (cam) => { cam.position.z = 10.5 * Math.max(1, 1 / cam.aspect); });
  const scene = new Scene();
  const mat = new LineBasicMaterial({ color: new Color(css('--ink')), transparent: true, opacity: 0.8 });
  const LEVELS = [[160, 20], [110, 14], [72, 10], [48, 8], [32, 6], [20, 5], [12, 4], [8, 3]];
  const cache = [];
  const geoFor = (i) => cache[i] || (cache[i] = new WireframeGeometry(new TorusKnotGeometry(1.35, 0.42, LEVELS[i][0], LEVELS[i][1], 2, 3)));
  const knot = new LineSegments(geoFor(0), mat);
  scene.add(knot);
  let level = 0, clock = 0, hoverX = null;
  const setLevel = (i) => {
    i = Math.max(0, Math.min(LEVELS.length - 1, i));
    if (i !== level) { level = i; knot.geometry = geoFor(i); }
  };
  host.addEventListener('pointermove', (e) => {
    const b = host.getBoundingClientRect();
    hoverX = (e.clientX - b.left) / b.width;
    if (reduce) { setLevel(Math.round(hoverX * (LEVELS.length - 1))); renderer.render(scene, camera); }
  });
  host.addEventListener('pointerleave', () => { hoverX = null; });
  renderer.render(scene, camera);
  onRedraw(() => renderer.render(scene, camera));
  if (reduce) return;
  whileVisible(host, (dt) => {
    clock += dt;
    const q = hoverX !== null ? hoverX : (Math.sin(clock * 0.6) + 1) / 2;
    setLevel(Math.round(q * (LEVELS.length - 1)));
    knot.rotation.x += dt * 0.22;
    knot.rotation.y += dt * 0.32;
    renderer.render(scene, camera);
  });
}

// About: a flat low-poly wireframe of the portrait's head-and-shoulders silhouette
// (portrait-bust.json, tools/portrait-bust.swift), lined up with the photo and drawn as
// light lines on black, the outline brighter than the inside. Each time main.js shows it
// (a 'bust' event) it replays the mesh's edge collapses: vertices glide into their
// neighbours down to a coarse shell, hold, then split back out to full detail.
function bustFigure({ reduce }) {
  if (reduce) return;
  const scanEl = document.getElementById('portrait');
  const host = scanEl.querySelector('.scan-bust');
  const canvas = host.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const line = css('--night-fg');
  let beat = null, drawn = -1, dpr = 1;
  const fit = () => {
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    drawn = -1;
  };
  fit();
  new ResizeObserver(fit).observe(host);
  scanEl.addEventListener('bust', (e) => {
    beat = { t0: performance.now(), ms: e.detail.ms, depth: e.detail.depth };
    drawn = -1;
  });
  fetch('/assets/img/portrait-bust.json').then((r) => r.json()).then(({ v, f, c }) => {
    const n = v.length / 2, pos = Float64Array.from(v);
    // Edges on one triangle only are the silhouette (and the frame cuts); the rest are inside.
    const faces = new Map();
    for (let i = 0; i < f.length; i += 3) {
      for (let k = 0; k < 3; k++) {
        const a = f[i + k], b = f[i + ((k + 1) % 3)], key = a < b ? a * n + b : b * n + a;
        faces.set(key, (faces.get(key) || 0) + 1);
      }
    }
    const outline = [], inside = [];
    faces.forEach((k, key) => (k === 1 ? outline : inside).push(Math.floor(key / n), key % n));
    // When each vertex collapses and into which neighbour.
    const col = new Float64Array(n).fill(Infinity), to = new Int32Array(n);
    for (let i = 0; i < c.length; i += 2) { col[c[i]] = i / 2; to[c[i]] = c[i + 1]; }
    // A target always collapses later than its source, so latest-first resolves chains.
    const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => (col[a] === col[b] ? 0 : col[a] < col[b] ? 1 : -1));
    const N = c.length / 2, WIN = Math.max(6, N * 0.07);
    const collapseTo = (x) => {
      for (const i of order) {
        const a = i * 2;
        if (!(x > col[i])) { pos[a] = v[a]; pos[a + 1] = v[a + 1]; continue; }
        let s = Math.min(1, (x - col[i]) / WIN);
        s = s * s * (3 - 2 * s);
        const b = to[i] * 2;
        pos[a] = v[a] + (pos[b] - v[a]) * s;
        pos[a + 1] = v[a + 1] + (pos[b + 1] - v[a + 1]) * s;
      }
    };
    // y spans [-1, 1] over the frame height, centred, as in the photo
    const draw = () => {
      const W = canvas.width, H = canvas.height, k = H / 2;
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = line;
      ctx.lineWidth = dpr;
      ctx.lineJoin = 'round';
      [[inside, 0.42], [outline, 0.95]].forEach(([e, alpha]) => {
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        for (let i = 0; i < e.length; i += 2) {
          const a = e[i] * 2, b = e[i + 1] * 2;
          ctx.moveTo(W / 2 + pos[a] * k, k - pos[a + 1] * k);
          ctx.lineTo(W / 2 + pos[b] * k, k - pos[b + 1] * k);
        }
        ctx.stroke();
      });
    };
    scanEl.classList.add('has-bust');
    whileVisible(scanEl, () => {
      if (!beat) return;
      const { t0, ms, depth } = beat;
      const t = (performance.now() - t0) / ms;
      if (t >= 1) beat = null;
      // full detail at both ends, coarsest through the middle
      const q = Math.min(1, Math.max(0, Math.min((t - 0.06) / 0.34, (0.94 - t) / 0.34)));
      const x = q * q * (3 - 2 * q) * depth * (N + WIN);
      if (x === drawn) return;
      drawn = x;
      collapseTo(x);
      draw();
    });
  }).catch(() => {});
}

export function initScenes(opts) {
  // Each figure starts on its own, and only once it is near the viewport, so one
  // failure cannot take down the others and off-screen work never runs early.
  const plan = [['field', speciesField], ['rsStage', quadratFigure], ['model', modelFigure], ['waves', wavesField], ['meshfig', meshFigure], ['portrait', bustFigure]];
  plan.forEach(([id, fn]) => {
    const el = document.getElementById(id);
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      try { fn(opts); } catch (e) { console.error(fn.name, e); }
    }, { rootMargin: '400px 0px' });
    io.observe(el);
  });
}
