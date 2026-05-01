import React from 'react';
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

// t-SNE-style scatter cluster of points — represents BioCLIP embedding space
// with separable plant-species clusters.
function EmbeddingScatter() {
  const clusters = [
    { cx: 28, cy: 32, n: 14, spread: 9 },
    { cx: 64, cy: 22, n: 12, spread: 7 },
    { cx: 78, cy: 58, n: 16, spread: 11 },
    { cx: 32, cy: 70, n: 18, spread: 10 },
    { cx: 52, cy: 50, n: 10, spread: 6 },
    { cx: 18, cy: 52, n: 9, spread: 6 },
  ];
  const dots = [];
  let seed = 1;
  const rng = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  clusters.forEach((cl, ci) => {
    for (let i = 0; i < cl.n; i++) {
      const a = rng() * Math.PI * 2;
      const r = rng() * cl.spread;
      const x = cl.cx + Math.cos(a) * r;
      const y = cl.cy + Math.sin(a) * r;
      const size = 0.6 + rng() * 0.6;
      const alpha = 0.45 + rng() * 0.5;
      dots.push({ x, y, size, alpha, ci });
    }
  });
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
    >
      {[20, 40, 60, 80].map((p) => (
        <line
          key={`h${p}`}
          x1="0" x2="100" y1={p} y2={p}
          stroke="rgba(245,243,238,0.06)"
          strokeWidth="0.3"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {[20, 40, 60, 80].map((p) => (
        <line
          key={`v${p}`}
          y1="0" y2="100" x1={p} x2={p}
          stroke="rgba(245,243,238,0.06)"
          strokeWidth="0.3"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {dots.map((d, i) => (
        <circle
          key={i}
          cx={d.x} cy={d.y} r={d.size}
          fill={`rgba(245,243,238,${d.alpha})`}
        />
      ))}
    </svg>
  );
}

// Pipeline diagram: tile -> BioCLIP -> multi-label.
function BioClipPipeline() {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect
        x="6" y="34" width="22" height="22"
        fill="none"
        stroke="rgba(245,243,238,0.5)"
        strokeWidth="0.4"
        vectorEffect="non-scaling-stroke"
      />
      {[0, 1, 2, 3].map((i) => (
        <line
          key={`tile-h-${i}`}
          x1="6" x2="28"
          y1={34 + (22 / 4) * i + 22 / 8}
          y2={34 + (22 / 4) * i + 22 / 8}
          stroke="rgba(245,243,238,0.2)"
          strokeWidth="0.25"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <line
          key={`tile-v-${i}`}
          y1="34" y2="56"
          x1={6 + (22 / 4) * i + 22 / 8}
          x2={6 + (22 / 4) * i + 22 / 8}
          stroke="rgba(245,243,238,0.2)"
          strokeWidth="0.25"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <text
        x="17" y="66"
        fontFamily="JetBrains Mono, monospace"
        fontSize="3.4"
        fill="rgba(245,243,238,0.6)"
        textAnchor="middle"
        letterSpacing="0.5"
      >TILE</text>

      <line
        x1="28" y1="45" x2="38" y2="45"
        stroke="rgba(245,243,238,0.4)"
        strokeWidth="0.35"
        vectorEffect="non-scaling-stroke"
      />
      <polygon
        points="38,45 35.5,43.5 35.5,46.5"
        fill="rgba(245,243,238,0.5)"
      />

      <rect
        x="38" y="32" width="28" height="26"
        fill="rgba(245,243,238,0.04)"
        stroke="rgba(245,243,238,0.5)"
        strokeWidth="0.4"
        vectorEffect="non-scaling-stroke"
      />
      <text
        x="52" y="44"
        fontFamily="Helvetica Neue, sans-serif"
        fontSize="4.2"
        fill="rgba(245,243,238,0.95)"
        textAnchor="middle"
        fontWeight="600"
      >BioCLIP</text>
      <text
        x="52" y="50"
        fontFamily="JetBrains Mono, monospace"
        fontSize="3"
        fill="rgba(245,243,238,0.5)"
        textAnchor="middle"
      >ViT-L/14</text>
      <text
        x="52" y="66"
        fontFamily="JetBrains Mono, monospace"
        fontSize="3.4"
        fill="rgba(245,243,238,0.6)"
        textAnchor="middle"
        letterSpacing="0.5"
      >ENCODER</text>

      <line
        x1="66" y1="45" x2="76" y2="45"
        stroke="rgba(245,243,238,0.4)"
        strokeWidth="0.35"
        vectorEffect="non-scaling-stroke"
      />
      <polygon
        points="76,45 73.5,43.5 73.5,46.5"
        fill="rgba(245,243,238,0.5)"
      />

      <g transform="translate(76,32)">
        {[
          { y: 2, label: 'Quercus robur', alpha: 0.95, fill: 0.85 },
          { y: 8, label: 'Plantago lanc.', alpha: 0.7,  fill: 0.55 },
          { y: 14, label: 'Trifolium prat.', alpha: 0.55, fill: 0.4 },
          { y: 20, label: 'Achillea mille.', alpha: 0.4, fill: 0.25 },
        ].map((row, i) => (
          <g key={i}>
            <rect x="0" y={row.y} width={2.2 + row.fill * 16} height="3.5"
                  fill={`rgba(245,243,238,${row.fill})`} />
            <text
              x="0" y={row.y - 0.4}
              fontFamily="JetBrains Mono, monospace"
              fontSize="2.4"
              fill={`rgba(245,243,238,${row.alpha})`}
              letterSpacing="0.3"
            >{row.label}</text>
          </g>
        ))}
      </g>
      <text
        x="86" y="66"
        fontFamily="JetBrains Mono, monospace"
        fontSize="3.4"
        fill="rgba(245,243,238,0.6)"
        textAnchor="middle"
        letterSpacing="0.5"
      >LABELS</text>
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
    <VisualFrame label="02 · Embedding space" tag="UMAP" aspect={aspect} borderRight={borderRight}>
      <EmbeddingScatter />
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
