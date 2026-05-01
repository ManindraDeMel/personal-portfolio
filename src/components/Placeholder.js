import React from 'react';
import { ED_MONO } from '../styles/editorial';

function Placeholder({ label, aspect }) {
  return (
    <div style={{
      aspectRatio: aspect, position: 'relative',
      borderRight: '1px solid rgba(245,243,238,0.12)',
      background:
        'repeating-linear-gradient(135deg, rgba(245,243,238,0.04) 0 1px, transparent 1px 14px), rgba(245,243,238,0.015)',
      overflow: 'hidden',
    }}>
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.18 }}
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <line x1="0" y1="0" x2="100" y2="100" stroke="#f5f3ee" strokeWidth="0.3" vectorEffect="non-scaling-stroke" />
        <line x1="100" y1="0" x2="0" y2="100" stroke="#f5f3ee" strokeWidth="0.3" vectorEffect="non-scaling-stroke" />
      </svg>
      <span style={{
        position: 'absolute', left: 16, bottom: 14,
        fontFamily: ED_MONO, fontSize: 10, letterSpacing: '0.14em',
        textTransform: 'uppercase', color: 'rgba(245,243,238,0.55)',
      }}>
        {label}
      </span>
      <span style={{
        position: 'absolute', right: 16, top: 14,
        fontFamily: ED_MONO, fontSize: 9, letterSpacing: '0.14em',
        textTransform: 'uppercase', color: 'rgba(245,243,238,0.6)',
      }}>
        IMG
      </span>
    </div>
  );
}

export default Placeholder;
