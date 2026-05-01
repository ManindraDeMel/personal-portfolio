import React, { useEffect, useRef } from 'react';
import { ED_MONO } from '../styles/editorial';

const FRAME_BG =
  'repeating-linear-gradient(135deg, rgba(245,243,238,0.03) 0 1px, transparent 1px 14px), rgba(245,243,238,0.015)';

function VisualFrame({ label, tag, aspect, children, borderRight }) {
  return (
    <div style={{
      aspectRatio: aspect, position: 'relative',
      borderRight: borderRight ? '1px solid rgba(245,243,238,0.12)' : 'none',
      background: FRAME_BG,
      overflow: 'hidden',
    }}>
      {children}
      <span style={{
        position: 'absolute', left: 14, bottom: 12,
        fontFamily: ED_MONO, fontSize: 10, letterSpacing: '0.14em',
        textTransform: 'uppercase', color: 'rgba(245,243,238,0.6)',
      }}>
        {label}
      </span>
      <span style={{
        position: 'absolute', right: 14, top: 12,
        fontFamily: ED_MONO, fontSize: 9, letterSpacing: '0.14em',
        textTransform: 'uppercase', color: 'rgba(245,243,238,0.35)',
      }}>
        {tag}
      </span>
    </div>
  );
}

// 8x4 herbarium grid of stylized leaf silhouettes — represents the
// quadrat-tiled dataset.
function HerbariumGrid() {
  const cols = 8;
  const rows = 4;
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const seed = (r * cols + c + 1) * 17;
      const alpha = 0.2 + ((seed % 11) / 11) * 0.7;
      const rot = ((seed * 13) % 90) - 45;
      const scale = 0.6 + ((seed % 7) / 7) * 0.4;
      cells.push({ r, c, alpha, rot, scale });
    }
  }
  const cw = 100 / cols;
  const ch = 100 / rows;
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {cells.map(({ r, c, alpha, rot, scale }, i) => {
        const cx = c * cw + cw / 2;
        const cy = r * ch + ch / 2;
        return (
          <g
            key={i}
            transform={`translate(${cx},${cy}) rotate(${rot}) scale(${scale * 0.9})`}
          >
            <path
              d="M0,-5 C3,-4 4.5,-1.5 4.2,1.6 C3.8,4.5 1.6,5.4 0,5 C-1.6,5.4 -3.8,4.5 -4.2,1.6 C-4.5,-1.5 -3,-4 0,-5 Z"
              fill={`rgba(245,243,238,${alpha})`}
              stroke="rgba(245,243,238,0.25)"
              strokeWidth="0.2"
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1="0" y1="-5" x2="0" y2="5"
              stroke="rgba(10,10,10,0.45)"
              strokeWidth="0.15"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        );
      })}
    </svg>
  );
}

// Interactive 3D embedding scatter — drag to rotate, auto-rotates when idle.
// Same monochrome editorial palette as the rest of the spotlight visuals;
// renders into a canvas with hand-rolled perspective projection (no deps).
function EmbeddingScatter3D() {
  const canvasRef = useRef(null);
  const hintRef = useRef(null);
  const stateRef = useRef({ rx: -0.35, ry: 0.55, drag: null });

  const pointsRef = useRef(null);
  if (!pointsRef.current) {
    let seed = 1;
    const rng = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    const clusters = [
      { cx: -32, cy: -14, cz:   2, n: 16, spread: 10 },
      { cx:  22, cy: -28, cz:  18, n: 14, spread:  8 },
      { cx:  34, cy:  20, cz: -14, n: 18, spread: 12 },
      { cx: -24, cy:  28, cz:  22, n: 20, spread: 11 },
      { cx:   2, cy:   2, cz: -24, n: 12, spread:  7 },
      { cx: -38, cy:  10, cz: -16, n: 11, spread:  7 },
    ];
    const pts = [];
    clusters.forEach((cl, ci) => {
      for (let i = 0; i < cl.n; i++) {
        const u = rng();
        const v = rng();
        const theta = Math.acos(2 * u - 1);
        const phi = 2 * Math.PI * v;
        const r = Math.sqrt(rng()) * cl.spread;
        const x = cl.cx + r * Math.sin(theta) * Math.cos(phi);
        const y = cl.cy + r * Math.sin(theta) * Math.sin(phi);
        const z = cl.cz + r * Math.cos(theta);
        const size = 0.9 + rng() * 0.8;
        const alpha = 0.55 + rng() * 0.4;
        pts.push({ x, y, z, ci, size, alpha });
      }
    });
    pointsRef.current = pts;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf = 0;
    let lastT = performance.now();
    let interacted = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const cubeSize = 48;
    const corners = [];
    for (let i = 0; i < 8; i++) {
      corners.push([
        (i & 1 ? 1 : -1) * cubeSize,
        (i & 2 ? 1 : -1) * cubeSize,
        (i & 4 ? 1 : -1) * cubeSize,
      ]);
    }
    const edges = [
      [0,1],[2,3],[4,5],[6,7],
      [0,2],[1,3],[4,6],[5,7],
      [0,4],[1,5],[2,6],[3,7],
    ];

    const draw = (t) => {
      const dt = Math.min(0.05, (t - lastT) / 1000);
      lastT = t;
      const s = stateRef.current;
      if (!s.drag) {
        s.ry += dt * 0.22;
      }

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      const cosX = Math.cos(s.rx);
      const sinX = Math.sin(s.rx);
      const cosY = Math.cos(s.ry);
      const sinY = Math.sin(s.ry);
      const focal = Math.min(w, h) * 1.6;
      const baseScale = Math.min(w, h) / 160;
      const cx = w / 2;
      const cy = h / 2;
      const camZ = 180;

      const project = (x, y, z) => {
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;
        const y1 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;
        const denom = camZ + z2;
        const persp = focal / denom;
        return {
          px: x1 * persp * baseScale * 0.6 + cx,
          py: y1 * persp * baseScale * 0.6 + cy,
          z: z2,
          scale: persp / focal,
        };
      };

      // Wireframe cube
      ctx.strokeStyle = 'rgba(245,243,238,0.10)';
      ctx.lineWidth = 0.6;
      const projCorners = corners.map(([x, y, z]) => project(x, y, z));
      ctx.beginPath();
      edges.forEach(([a, b]) => {
        ctx.moveTo(projCorners[a].px, projCorners[a].py);
        ctx.lineTo(projCorners[b].px, projCorners[b].py);
      });
      ctx.stroke();

      // Axis ticks (D1/D2/D3) anchored at the −,−,− corner
      const origin = project(-cubeSize, -cubeSize, -cubeSize);
      const axes = [
        { v: project(-cubeSize + 16, -cubeSize, -cubeSize), label: 'D1' },
        { v: project(-cubeSize, -cubeSize + 16, -cubeSize), label: 'D2' },
        { v: project(-cubeSize, -cubeSize, -cubeSize + 16), label: 'D3' },
      ];
      ctx.strokeStyle = 'rgba(245,243,238,0.32)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      axes.forEach((a) => {
        ctx.moveTo(origin.px, origin.py);
        ctx.lineTo(a.v.px, a.v.py);
      });
      ctx.stroke();
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.fillStyle = 'rgba(245,243,238,0.5)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      axes.forEach((a) => ctx.fillText(a.label, a.v.px, a.v.py));

      // Depth-sorted points
      const projected = pointsRef.current.map((p) => ({ p, q: project(p.x, p.y, p.z) }));
      projected.sort((a, b) => b.q.z - a.q.z);
      projected.forEach(({ p, q }) => {
        const depth = (q.z + cubeSize) / (cubeSize * 2);
        const fade = 0.55 + Math.max(0, Math.min(1, 1 - depth)) * 0.45;
        const alpha = Math.max(0.15, Math.min(1, p.alpha * fade));
        const r = Math.max(0.6, p.size * (0.6 + (1 - depth) * 0.9));
        ctx.fillStyle = `rgba(245,243,238,${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(q.px, q.py, r, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const dismissHint = () => {
      if (interacted) return;
      interacted = true;
      const el = hintRef.current;
      if (el) el.style.opacity = '0';
    };

    const onPointerDown = (e) => {
      stateRef.current.drag = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = 'grabbing';
      try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
      dismissHint();
    };
    const onPointerMove = (e) => {
      const s = stateRef.current;
      if (!s.drag) return;
      const dx = e.clientX - s.drag.x;
      const dy = e.clientY - s.drag.y;
      s.ry += dx * 0.008;
      s.rx += dy * 0.008;
      const limit = Math.PI / 2 - 0.05;
      if (s.rx > limit) s.rx = limit;
      if (s.rx < -limit) s.rx = -limit;
      s.drag = { x: e.clientX, y: e.clientY };
    };
    const onPointerUp = (e) => {
      stateRef.current.drag = null;
      canvas.style.cursor = 'grab';
      try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
    };
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerUp);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('pointerleave', onPointerUp);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          cursor: 'grab',
          touchAction: 'none',
        }}
      />
      <span
        ref={hintRef}
        style={{
          position: 'absolute', right: 14, bottom: 12,
          fontFamily: ED_MONO, fontSize: 9, letterSpacing: '0.16em',
          textTransform: 'uppercase', color: 'rgba(245,243,238,0.45)',
          pointerEvents: 'none',
          transition: 'opacity 0.6s ease',
        }}
      >
        Drag · rotate
      </span>
    </>
  );
}

// Pipeline diagram: tile -> BioCLIP encoder -> multi-label.
// Wide viewBox so it fills a full-width 16:4 strip cleanly.
function BioClipPipeline() {
  const labels = [
    { y: 6,  label: 'Quercus robur',   alpha: 0.95, fill: 0.85 },
    { y: 18, label: 'Plantago lanc.',  alpha: 0.7,  fill: 0.55 },
    { y: 30, label: 'Trifolium prat.', alpha: 0.55, fill: 0.4 },
    { y: 42, label: 'Achillea mille.', alpha: 0.4,  fill: 0.25 },
  ];
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      viewBox="0 0 200 50"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* tile grid */}
      <rect
        x="10" y="10" width="34" height="34"
        fill="none"
        stroke="rgba(245,243,238,0.5)"
        strokeWidth="0.4"
        vectorEffect="non-scaling-stroke"
      />
      {[1, 2, 3].map((i) => (
        <line
          key={`tile-h-${i}`}
          x1="10" x2="44"
          y1={10 + (34 / 4) * i}
          y2={10 + (34 / 4) * i}
          stroke="rgba(245,243,238,0.2)"
          strokeWidth="0.25"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {[1, 2, 3].map((i) => (
        <line
          key={`tile-v-${i}`}
          y1="10" y2="44"
          x1={10 + (34 / 4) * i}
          x2={10 + (34 / 4) * i}
          stroke="rgba(245,243,238,0.2)"
          strokeWidth="0.25"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <text
        x="27" y="49"
        fontFamily="JetBrains Mono, monospace"
        fontSize="3"
        fill="rgba(245,243,238,0.55)"
        textAnchor="middle"
        letterSpacing="0.5"
      >01 · TILE</text>

      {/* arrow tile -> encoder */}
      <line
        x1="44" y1="27" x2="64" y2="27"
        stroke="rgba(245,243,238,0.35)"
        strokeWidth="0.35"
        vectorEffect="non-scaling-stroke"
      />
      <polygon
        points="64,27 61,25.5 61,28.5"
        fill="rgba(245,243,238,0.5)"
      />

      {/* encoder block */}
      <rect
        x="64" y="8" width="60" height="38"
        fill="rgba(245,243,238,0.04)"
        stroke="rgba(245,243,238,0.5)"
        strokeWidth="0.4"
        vectorEffect="non-scaling-stroke"
      />
      <text
        x="94" y="24"
        fontFamily="Helvetica Neue, sans-serif"
        fontSize="5.4"
        fill="rgba(245,243,238,0.95)"
        textAnchor="middle"
        fontWeight="600"
      >BioCLIP</text>
      <text
        x="94" y="32"
        fontFamily="JetBrains Mono, monospace"
        fontSize="3.2"
        fill="rgba(245,243,238,0.55)"
        textAnchor="middle"
        letterSpacing="0.4"
      >ViT-L/14 · 448px</text>
      <text
        x="94" y="49"
        fontFamily="JetBrains Mono, monospace"
        fontSize="3"
        fill="rgba(245,243,238,0.55)"
        textAnchor="middle"
        letterSpacing="0.5"
      >02 · ENCODER</text>

      {/* arrow encoder -> labels */}
      <line
        x1="124" y1="27" x2="144" y2="27"
        stroke="rgba(245,243,238,0.35)"
        strokeWidth="0.35"
        vectorEffect="non-scaling-stroke"
      />
      <polygon
        points="144,27 141,25.5 141,28.5"
        fill="rgba(245,243,238,0.5)"
      />

      {/* label probabilities */}
      <g transform="translate(144,2)">
        {labels.map((row, i) => (
          <g key={i}>
            <text
              x="0" y={row.y - 1}
              fontFamily="JetBrains Mono, monospace"
              fontSize="2.6"
              fill={`rgba(245,243,238,${row.alpha})`}
              letterSpacing="0.3"
            >{row.label}</text>
            <rect
              x="0" y={row.y} width={2 + row.fill * 44} height="4"
              fill={`rgba(245,243,238,${row.fill})`}
            />
          </g>
        ))}
      </g>
      <text
        x="170" y="49"
        fontFamily="JetBrains Mono, monospace"
        fontSize="3"
        fill="rgba(245,243,238,0.55)"
        textAnchor="middle"
        letterSpacing="0.5"
      >03 · LABELS</text>
    </svg>
  );
}

export function HerbariumPanel({ aspect = '16 / 10', borderRight = true }) {
  return (
    <VisualFrame label="01 · Quadrat tiling" tag="DATA" aspect={aspect} borderRight={borderRight}>
      <HerbariumGrid />
    </VisualFrame>
  );
}

export function EmbeddingPanel({ aspect = '4 / 5', borderRight = true }) {
  return (
    <VisualFrame label="02 · Embedding space" tag="UMAP · 3D" aspect={aspect} borderRight={borderRight}>
      <EmbeddingScatter3D />
    </VisualFrame>
  );
}

export function PipelinePanel({ aspect = '4 / 5', borderRight = false }) {
  return (
    <VisualFrame label="03 · BioCLIP pipeline" tag="ARCH" aspect={aspect} borderRight={borderRight}>
      <BioClipPipeline />
    </VisualFrame>
  );
}
