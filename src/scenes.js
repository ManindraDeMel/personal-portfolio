import {
  BufferAttribute,
  BufferGeometry,
  Color,
  ColorManagement,
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

export function initScenes(opts) {
  // Each figure starts on its own, and only once it is near the viewport, so one
  // failure cannot take down the others and off-screen work never runs early.
  const plan = [['field', speciesField], ['rsStage', quadratFigure], ['waves', wavesField], ['meshfig', meshFigure]];
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
