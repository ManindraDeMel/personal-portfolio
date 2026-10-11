import './styles.css';
import { drawPoster } from './species.js';

const root = document.documentElement;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
if (!reduce) root.classList.add('js-anim');

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
  paper: '/assets/img/docs/plantclef-3.webp',
  resume: '/assets/img/docs/resume-1.webp',
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
  host.addEventListener('mouseenter', () => decode(target, 420, host.dataset.set));
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
const behindMenu = [document.querySelector('main'), document.querySelector('footer'), document.querySelector('.brand')];
function setMenu(open) {
  btn.setAttribute('aria-expanded', String(open));
  scramble(btnLabel, open ? 'Close' : 'Menu', 380);
  root.classList.toggle('menu-open', open);
  behindMenu.forEach((el) => { el.inert = open; });
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
const hovImg = document.createElement('img');
hovImg.alt = '';
hovImg.decoding = 'async';
hov.querySelector('.hov-in').appendChild(hovImg);
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
        el.textContent = fmt(to * (1 - Math.pow(1 - p, 3)), dec) + (p >= 1 ? suf : '');
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach((el) => cio.observe(el));
}

// Extras lists: rules draw in from the left, one row after another.
document.querySelectorAll('.x-list').forEach((list) => {
  Array.from(list.children).forEach((li, k) => li.style.setProperty('--k', k));
});
if (!reduce && 'IntersectionObserver' in window) {
  const lio = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      lio.unobserve(e.target);
      e.target.classList.add('in');
    });
  }, { threshold: 0.25 });
  document.querySelectorAll('.x-list').forEach((el) => lio.observe(el));
} else {
  document.querySelectorAll('.x-list').forEach((el) => el.classList.add('in'));
}

// Documents: on desktop the deck pins and the stack fans out as you scroll;
// on narrow screens it becomes a swipeable row whose cards tilt past the centre.
const docsEl = document.getElementById('docs');
const deck = document.getElementById('deck');
const docCards = Array.from(deck.children);
const STACK_TILT = [-5, 3.5, -2.2, 6, -3.4];
const fanQuery = window.matchMedia('(min-width: 901px) and (hover: hover)');
const flowQuery = window.matchMedia('(max-width: 900px)');
const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
function layoutDocs() {
  if (!docsEl.classList.contains('is-fan')) return;
  const r = docsEl.getBoundingClientRect();
  const total = docsEl.offsetHeight - window.innerHeight;
  const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
  const f = ease((p - 0.04) / 0.5);
  const n = docCards.length, mid = (n - 1) / 2;
  const cw = docCards[0].offsetWidth;
  const spacing = Math.min(cw * 1.2, (deck.clientWidth - cw) / (n - 1));
  docCards.forEach((c, i) => {
    const d = i - mid;
    const x = d * (36 + (spacing - 36) * f);
    const y = -i * 5 * (1 - f) + d * d * 16 * f - Math.sin(p * Math.PI) * 10 * f;
    const rot = STACK_TILT[i % STACK_TILT.length] * (1 - f) + d * 3.4 * f;
    c.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) rotate(' + rot.toFixed(2) + 'deg)';
    c.style.setProperty('--r', rot.toFixed(2) + 'deg');
    c.style.zIndex = String(n - i);
  });
  deck.style.setProperty('--f', f.toFixed(3));
}
function flowDocs() {
  if (!flowQuery.matches || reduce) return;
  const box = deck.getBoundingClientRect();
  const centre = box.left + box.width / 2;
  docCards.forEach((c) => {
    const card = c.querySelector('.doc-card');
    const b = c.getBoundingClientRect();
    const d = Math.max(-1, Math.min(1, (b.left + b.width / 2 - centre) / box.width));
    card.style.transform = 'rotateY(' + (d * -32).toFixed(1) + 'deg) scale(' + (1 - Math.abs(d) * 0.12).toFixed(3) + ')';
  });
}
function setupDocs() {
  const fan = fanQuery.matches && !reduce;
  docsEl.classList.toggle('is-fan', fan);
  docCards.forEach((c) => {
    if (!fan) { c.style.transform = ''; c.style.zIndex = ''; c.style.removeProperty('--r'); }
    if (!flowQuery.matches) c.querySelector('.doc-card').style.transform = '';
  });
  layoutDocs();
  flowDocs();
}
let flowTick = false;
deck.addEventListener('scroll', () => {
  if (flowTick) return;
  flowTick = true;
  requestAnimationFrame(() => { flowTick = false; flowDocs(); });
}, { passive: true });
fanQuery.addEventListener('change', setupDocs);
flowQuery.addEventListener('change', setupDocs);
window.addEventListener('resize', () => requestAnimationFrame(layoutDocs), { passive: true });
setupDocs();
docCards.forEach((c) => c.addEventListener('mouseenter', () => decode(c.querySelector('.doc-t'), 420)));

// Riffle: a card flips through its most interesting pages. Each flip loads the next
// page onto the hidden face first, so the turn always reveals a new page.
function makeRiffle(li) {
  const link = li.querySelector('.doc-card');
  const pages = (link.dataset.pages || '').split(',').filter(Boolean);
  const faces = [li.querySelector('.doc-front img'), li.querySelector('.doc-back img')];
  let shown = 0, timer = 0, warmed = false;
  const flip = (next) => {
    const flipped = li.classList.contains('is-flipped');
    faces[flipped ? 0 : 1].src = pages[next];
    li.classList.toggle('is-flipped', !flipped);
    shown = next;
  };
  return {
    start(every) {
      if (pages.length < 2 || timer) return;
      if (!warmed) { warmed = true; pages.forEach((u) => { const i = new Image(); i.src = u; }); }
      flip((shown + 1) % pages.length);
      timer = setInterval(() => flip((shown + 1) % pages.length), every);
    },
    stop() {
      clearInterval(timer);
      timer = 0;
      if (shown !== 0) flip(0);
    },
  };
}
const riffles = docCards.map(makeRiffle);
if (!reduce) {
  docCards.forEach((li, i) => {
    li.addEventListener('mouseenter', () => { if (canHover) riffles[i].start(1150); });
    li.addEventListener('mouseleave', () => riffles[i].stop());
    const link = li.querySelector('.doc-card');
    link.addEventListener('focus', () => riffles[i].start(1400));
    link.addEventListener('blur', () => riffles[i].stop());
  });
  // Phones: once the row settles, the centred card riffles on its own.
  let settle = 0, active = -1;
  const riffleCentred = () => {
    if (!flowQuery.matches) return;
    const box = deck.getBoundingClientRect();
    const centre = box.left + box.width / 2;
    let best = -1, bestD = Infinity;
    docCards.forEach((c, i) => {
      const b = c.getBoundingClientRect();
      const d = Math.abs(b.left + b.width / 2 - centre);
      if (d < bestD) { bestD = d; best = i; }
    });
    if (best === active) return;
    if (active >= 0) riffles[active].stop();
    active = best;
    if (best >= 0) riffles[best].start(1800);
  };
  deck.addEventListener('scroll', () => { clearTimeout(settle); settle = setTimeout(riffleCentred, 180); }, { passive: true });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting) riffleCentred();
      else if (active >= 0) { riffles[active].stop(); active = -1; }
    }, { threshold: 0.5 }).observe(deck);
  }
}

// Car film: loads only when near, plays muted while on screen, opens from an
// inset frame to full bleed as it scrolls in. Sound is opt-in.
const driveFrame = document.getElementById('driveFrame');
const driveVideo = document.getElementById('driveVideo');
const driveSound = document.getElementById('driveSound');
const driveLabel = driveSound.querySelector('.sx');
let driveLoaded = false, driveVisible = false;
const loadDrive = () => {
  if (driveLoaded) return;
  driveLoaded = true;
  const small = window.matchMedia('(max-width: 900px)').matches;
  driveVideo.poster = '/assets/video/car-poster.webp';
  driveVideo.src = small ? '/assets/video/car-720.mp4' : '/assets/video/car-1080.mp4';
  driveVideo.preload = 'auto';
};
const playDrive = () => { const p = driveVideo.play(); if (p && p.catch) p.catch(() => {}); };
// Loop: the element has the loop attribute; this restarts it if a browser ever stops at the end.
driveVideo.loop = true;
driveVideo.addEventListener('ended', () => { driveVideo.currentTime = 0; if (driveVisible) playDrive(); });
if ('IntersectionObserver' in window) {
  new IntersectionObserver(([e]) => { if (e.isIntersecting) loadDrive(); }, { rootMargin: '700px 0px' }).observe(driveFrame);
  new IntersectionObserver(([e]) => {
    driveVisible = e.isIntersecting;
    if (driveVisible && (!reduce || !driveVideo.muted)) { loadDrive(); playDrive(); }
    else if (!driveVisible) driveVideo.pause();
  }, { threshold: 0.35 }).observe(driveFrame);
} else {
  loadDrive();
}
if (reduce) driveLabel.textContent = 'Play with sound';
driveSound.addEventListener('click', () => {
  loadDrive();
  const on = driveVideo.muted;
  driveVideo.muted = !on;
  driveSound.setAttribute('aria-pressed', String(on));
  scramble(driveLabel, on ? 'Sound on' : (reduce ? 'Play with sound' : 'Sound off'), 300);
  if (on) playDrive();
  else if (reduce) driveVideo.pause();
});
// Transform-only (scale the frame, counter-zoom the video) so scrolling never
// repaints the playing video; skipped entirely when off screen or unchanged.
let driveK = -1;
function layoutDrive() {
  if (reduce) return;
  const r = driveFrame.getBoundingClientRect();
  const vh = window.innerHeight;
  if (r.bottom < -50 || r.top > vh + 50) return;
  const q = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.85)));
  const k = Math.round((1 - ease(q)) * 1000) / 1000;
  if (k === driveK) return;
  driveK = k;
  driveFrame.style.setProperty('--s', (1 - k * 0.14).toFixed(3));
  driveFrame.style.setProperty('--zoom', (1 + k * 0.18).toFixed(3));
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
    layoutDocs();
    layoutDrive();
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
