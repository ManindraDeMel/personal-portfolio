import React from 'react';
import PORTFOLIO from '../data/portfolio';
import { ED_DISPLAY, ED_MONO, COLORS } from '../styles/editorial';
import { useIsMobile } from '../hooks/useMediaQuery';

function Marquee() {
  const isMobile = useIsMobile();
  const items = PORTFOLIO.marquee;
  const loop = [...items, ...items, ...items];
  return (
    <div style={{
      borderBottom: `1px solid ${COLORS.border}`,
      overflow: 'hidden',
      padding: isMobile ? '14px 0' : '20px 0',
      fontFamily: ED_DISPLAY,
    }}>
      <div style={{
        display: 'flex',
        gap: isMobile ? 28 : 48,
        whiteSpace: 'nowrap',
        animation: `ed-marquee ${isMobile ? 40 : 60}s linear infinite`,
        fontFamily: ED_DISPLAY,
        fontSize: isMobile ? 22 : 32,
        fontWeight: 500,
        letterSpacing: '-0.03em', textTransform: 'uppercase',
      }}>
        {loop.map((x, i) => {
          const isFirstSegment = i < items.length;
          return (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center',
              gap: isMobile ? 28 : 48,
              color: i % 2 === 0 ? COLORS.fg : 'rgba(245,243,238,0.35)',
              ...(isFirstSegment && {
                opacity: 0,
                animation: `ed-fade-up 0.55s ${0.08 + i * 0.06}s ease forwards`,
              }),
            }}>
              {x}
              <span style={{
                fontFamily: ED_MONO, fontSize: 12,
                color: 'rgba(245,243,238,0.3)', letterSpacing: '0.1em',
              }}>+</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default Marquee;
