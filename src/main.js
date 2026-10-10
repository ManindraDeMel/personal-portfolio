import './styles.css';
import { drawPoster } from './species.js';

const root = document.documentElement;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const SETS = {
  any: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#%&*+=/<>',
  num: '0123456789',
};
const pickFrom = (set) => set[(Math.random() * set.length) | 0];
const keep = (c) => !/[A-Za-z0-9]/.test(c);

// Images shown under the cursor when hovering work, sites and papers.
const IMAGES = {
  cog: '/assets/img/shots/cog.webp',
  plan4me: '/assets/img/shots/plan4me.webp',
  chrome: '/assets/img/shots/chrome.webp',
  rocket: '/assets/img/shots/rocket.webp',
  kitchen: '/assets/img/shots/kitchen.webp',
  plantclef: '/assets/img/shots/plantclef.webp',
  mesh: '/assets/img/shots/mesh.webp',
  engine: '/assets/img/shots/engine.webp',
  quadrat: '/assets/img/quadrat.webp',
  paper: '/assets/img/paper-plantclef.webp',
  resume: '/assets/img/resume.webp',
};

// Scramble a single element to a new string (label swaps and the intro).
function scramble(el, text, dur, set) {
  const chars = SETS[set] || SETS.any;
  if (reduce) { el.textContent = text; return; }
  cancelAnimationFrame(el._sx);
  const t0 = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - t0) / dur);
    const settled = Math.floor(p * text.length);
    let out = '';
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      out += i < settled || keep(c) ? c : pickFrom(chars);
    }
    el.textContent = out;
    if (p < 1) el._sx = requestAnimationFrame(step);
  };
  el._sx = requestAnimationFrame(step);
}

// Decode every text node inside an element in place, keeping its markup.
function decode(el, dur, set) {
  if (reduce || !el) return;
  const chars = SETS[set] || SETS.any;
  const nodes = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    if (!n.data.trim()) continue;
    if (n._orig === undefined) n._orig = n.data;
    nodes.push(n);
  }
  cancelAnimationFrame(el._dec);
  const t0 = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - t0) / dur);
    nodes.forEach((node) => {
      const text = node._orig;
      const settled = Math.floor(p * text.length);
      let out = '';
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        out += i < settled || keep(c) ? c : pickFrom(chars);
      }
      node.data = out;
    });
    if (p < 1) el._dec = requestAnimationFrame(step);
  };
  el._dec = requestAnimationFrame(step);
}

// Only short labels scramble on hover: the host itself when it is plain text, or its .sx child.
document.querySelectorAll('[data-sx], [data-img]').forEach((host) => {
  const target = host.querySelector('.sx') || (host.children.length ? null : host);
  if (!target) return;
  const run = () => decode(target, 420, host.dataset.set);
  host.addEventListener('mouseenter', run);
  host.addEventListener('focus', run);
});
document.querySelectorAll('#workList a').forEach((a) => {
  a.addEventListener('mouseenter', () => a.querySelectorAll('.w-meta').forEach((m) => decode(m, 380)));
});

// Small labels decode once as they scroll into view.
if (!reduce && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      decode(e.target, 700);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-decode], .w-meta, .x-t, .x-s').forEach((el) => io.observe(el));
}

// Intro: runs once per session; the head script adds .intro before first paint.
const loader = document.getElementById('loader');
if (root.classList.contains('intro')) {
  const word = document.getElementById('loaderWord');
  const noise = Array.from(loader.querySelectorAll('.noise'));
  let revealed = false;
  const reveal = () => {
    if (revealed) return;
    revealed = true;
    try { sessionStorage.setItem('mdm-intro', '1'); } catch (e) { /* private mode */ }
    root.classList.remove('is-loading');
    loader.classList.add('out');
    setTimeout(() => root.classList.remove('intro'), 950);
  };
  const fill = () => noise.forEach((el) => {
    let s = '';
    const lines = 3 + ((Math.random() * 2) | 0);
    for (let l = 0; l < lines; l++) {
      const len = 8 + ((Math.random() * 12) | 0);
      for (let i = 0; i < len; i++) s += Math.random() < 0.12 ? ' ' : pickFrom(SETS.any);
      s += '\n';
    }
    el.textContent = s;
  });
  fill();
  const iv = setInterval(fill, 70);
  scramble(word, word.dataset.text, 900);
  setTimeout(() => { clearInterval(iv); noise.forEach((el) => { el.textContent = ''; }); }, 950);
  setTimeout(reveal, 1200);
  loader.addEventListener('click', reveal);
}

// ML / APP / SYS tags: expand on hover, take turns ticking while idle.
const tagsEl = document.getElementById('tags');
const tagEls = Array.from(tagsEl.querySelectorAll('a'));
let tagHover = false;
tagEls.forEach((a) => {
  a.addEventListener('mouseenter', () => scramble(a, a.dataset.full, 320));
  a.addEventListener('mouseleave', () => scramble(a, a.dataset.short, 260));
  a.addEventListener('focus', () => scramble(a, a.dataset.full, 320));
  a.addEventListener('blur', () => scramble(a, a.dataset.short, 260));
});
tagsEl.addEventListener('mouseenter', () => { tagHover = true; });
tagsEl.addEventListener('mouseleave', () => { tagHover = false; });
if (!reduce) {
  let ti = 0;
  setInterval(() => {
    if (tagHover || document.hidden) return;
    const a = tagEls[ti++ % tagEls.length];
    a.classList.add('tick');
    setTimeout(() => a.classList.remove('tick'), 600);
  }, 2200);
}

// Canberra clock with a blinking colon
const clock = document.getElementById('clock');
try {
  const f = new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Sydney', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZoneName: 'short' });
  const tick = () => {
    const parts = f.formatToParts(new Date());
    const get = (t) => (parts.find((p) => p.type === t) || {}).value || '';
    clock.innerHTML = get('hour') + '<span class="colon">:</span>' + get('minute') + ' ' + get('timeZoneName');
  };
  tick();
  setInterval(tick, 15000);
} catch (e) { /* keep static label */ }

// Menu overlay
const btn = document.getElementById('menuBtn');
const btnLabel = btn.querySelector('.sx');
const menu = document.getElementById('menu');
const isOpen = () => btn.getAttribute('aria-expanded') === 'true';
function setMenu(open) {
  btn.setAttribute('aria-expanded', String(open));
  scramble(btnLabel, open ? 'Close' : 'Menu', 380);
  root.classList.toggle('menu-open', open);
  if (open) {
    menu.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('open')));
    menu.querySelectorAll('.menu-list a > span:first-child').forEach((s, i) => setTimeout(() => decode(s, 520), 120 + i * 60));
    setTimeout(() => { const a = menu.querySelector('a'); if (a) a.focus({ preventScroll: true }); }, 350);
  } else {
    menu.classList.remove('open');
    setTimeout(() => { if (!isOpen()) menu.hidden = true; }, reduce ? 0 : 760);
  }
}
btn.addEventListener('click', () => setMenu(!isOpen()));
menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && isOpen()) { setMenu(false); btn.focus(); }
});
menu.querySelectorAll('.menu-list a').forEach((a) => a.addEventListener('mouseenter', () => decode(a.querySelector('.mono'), 360, 'num')));

// Hover image that follows the cursor (pointer devices only)
const hov = document.getElementById('hov');
const hovImg = hov.querySelector('img');
if (canHover && !reduce) {
  let x = 0, y = 0, tx = 0, ty = 0, raf = 0, on = false;
  const loop = () => {
    x += (tx - x) * 0.18;
    y += (ty - y) * 0.18;
    hov.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
    raf = (on || Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5) ? requestAnimationFrame(loop) : 0;
  };
  document.addEventListener('mousemove', (e) => {
    tx = e.clientX; ty = e.clientY;
    if (on && !raf) raf = requestAnimationFrame(loop);
  }, { passive: true });
  document.querySelectorAll('[data-img]').forEach((el) => {
    el.addEventListener('mouseenter', (e) => {
      const src = IMAGES[el.dataset.img];
      if (!src) return;
      if (!hov.classList.contains('on')) { x = tx = e.clientX; y = ty = e.clientY; }
      on = true;
      hov.classList.toggle('lg', el.dataset.imgSize === 'lg');
      if (hovImg.getAttribute('src') !== src) {
        hovImg.src = src;
        hov.classList.remove('fresh');
        void hov.offsetWidth;
        hov.classList.add('fresh');
      }
      hov.classList.add('on');
      if (!raf) raf = requestAnimationFrame(loop);
    });
    el.addEventListener('mouseleave', () => { on = false; hov.classList.remove('on'); });
  });
  // Warm the cache once the page is idle so the first hover is instant.
  const warm = () => Object.values(IMAGES).forEach((src) => { const i = new Image(); i.decoding = 'async'; i.src = src; });
  window.addEventListener('load', () => {
    if (window.requestIdleCallback) requestIdleCallback(warm, { timeout: 4000 });
    else setTimeout(warm, 2500);
  });
}

// Magnetic buttons and tilting media
if (canHover && !reduce) {
  document.querySelectorAll('[data-magnet]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const b = el.getBoundingClientRect();
      const dx = e.clientX - (b.left + b.width / 2), dy = e.clientY - (b.top + b.height / 2);
      el.style.transform = 'translate(' + (dx * 0.3).toFixed(1) + 'px,' + (dy * 0.45).toFixed(1) + 'px)';
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
  document.querySelectorAll('[data-tilt]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const b = el.getBoundingClientRect();
      const px = (e.clientX - b.left) / b.width - 0.5, py = (e.clientY - b.top) / b.height - 0.5;
      el.style.transform = 'perspective(900px) rotateY(' + (px * 6).toFixed(2) + 'deg) rotateX(' + (-py * 6).toFixed(2) + 'deg)';
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

// "Let's talk" letters ripple on hover
const cta = document.getElementById('ctaWord');
const ctaText = cta.textContent;
cta.textContent = '';
Array.from(ctaText).forEach((ch, i) => {
  const s = document.createElement('span');
  s.textContent = ch;
  s.style.setProperty('--i', i);
  cta.appendChild(s);
});

// Stats count up once when they come into view
const fmt = (v, dec) => v.toLocaleString('en-AU', { minimumFractionDigits: dec, maximumFractionDigits: dec });
if (!reduce && 'IntersectionObserver' in window) {
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      const el = e.target, to = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), suf = el.dataset.suf || '';
      const t0 = performance.now(), dur = 1300;
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        el.textContent = fmt(to * (1 - Math.pow(1 - p, 3)), dec) + suf;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach((el) => cio.observe(el));
}

// Research scroll stage: one step at a time slides in, plus the progress line
const stage = document.getElementById('rsStage');
const steps = Array.from(document.getElementById('rsSteps').children);
const bar = document.getElementById('rsProgress');
export const stageProgress = () => {
  const r = stage.getBoundingClientRect();
  const total = stage.offsetHeight - window.innerHeight;
  return total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
};
let activeStep = 0;
const mark = document.getElementById('mark');
let ticking = false;
const onScroll = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    ticking = false;
    mark.style.setProperty('--rot', (window.scrollY * 0.06).toFixed(1) + 'deg');
    const p = stageProgress();
    const i = p < 0.29 ? 0 : p < 0.53 ? 1 : p < 0.78 ? 2 : 3;
    if (i !== activeStep) {
      steps.forEach((s, j) => { s.classList.toggle('is-on', j === i); s.classList.toggle('is-past', j < i); });
      decode(steps[i].querySelector('b'), 520);
      activeStep = i;
    }
    bar.style.transform = 'scaleX(' + p.toFixed(3) + ')';
  });
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Copy email
const copyBtn = document.getElementById('copyEmail');
const emailEl = document.getElementById('email');
copyBtn.addEventListener('click', () => {
  const say = (msg) => {
    scramble(copyBtn, msg, 300);
    setTimeout(() => scramble(copyBtn, 'Copy', 300), 1600);
  };
  const selectIt = () => {
    const r = document.createRange();
    r.selectNodeContents(emailEl);
    const s = window.getSelection();
    s.removeAllRanges();
    s.addRange(r);
    say('Selected');
  };
  try {
    navigator.clipboard.writeText(emailEl.textContent.trim()).then(() => say('Copied'), selectIt);
  } catch (e) { selectIt(); }
});

// Hero cloud: a 2D poster is drawn straight away (no network, a few ms), then the
// WebGL version cross-fades in once three.js has loaded.
const field = document.getElementById('field');
const poster = field.querySelector('canvas.poster');
const hex = (v) => { const h = v.trim().replace('#', ''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); };
const paintPoster = () => drawPoster(poster, {
  background: getComputedStyle(root).getPropertyValue('--night').trim(),
  color: hex(getComputedStyle(root).getPropertyValue('--night-fg')),
});
paintPoster();
const posterRO = new ResizeObserver(() => { if (!field.classList.contains('gl-on')) paintPoster(); });
posterRO.observe(field);

// three.js lives in its own chunk. Pointer devices fetch it when the page goes idle;
// touch devices wait for the first scroll or tap, so phones never pay for it up front.
let started = false;
const load3D = () => {
  if (started) return;
  started = true;
  import('./scenes.js')
    .then((m) => m.initScenes({ reduce, stageProgress, onFieldReady: () => posterRO.disconnect() }))
    .catch((e) => console.error('3D failed to start', e));
};
if (canHover) {
  const whenIdle = () => (window.requestIdleCallback ? requestIdleCallback(load3D, { timeout: 2000 }) : setTimeout(load3D, 600));
  if (document.readyState === 'complete') whenIdle();
  else window.addEventListener('load', whenIdle, { once: true });
} else {
  ['scroll', 'touchstart', 'pointerdown', 'keydown'].forEach((type) => window.addEventListener(type, load3D, { once: true, passive: true }));
}
