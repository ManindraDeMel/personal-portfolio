import React from 'react';

function DataRow({ k, v, delay }) {
  const animate = typeof delay === 'number';
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      borderBottom: '1px dashed rgba(245,243,238,0.12)',
      padding: '4px 0',
      ...(animate && {
        opacity: 0,
        animation: `ed-fade-up 0.5s ${delay}s ease forwards`,
      }),
    }}>
      <span style={{
        color: 'rgba(245,243,238,0.45)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}>{k}</span>
      <span style={animate ? {
        display: 'inline-block',
        opacity: 0,
        animation: `ed-slide-in 0.5s ${delay + 0.15}s ease forwards`,
      } : undefined}>{v}</span>
    </div>
  );
}

export default DataRow;
