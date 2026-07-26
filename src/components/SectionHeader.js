import React from 'react';
import { ED_DISPLAY, ED_MONO, COLORS } from '../styles/editorial';
import { useIsMobile } from '../hooks/useMediaQuery';

// Static editorial section header: optional mono number, display title,
// optional mono sub line on the right.
function SectionHeader({ number, title, sub }) {
  const isMobile = useIsMobile();
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr 1fr',
      gap: isMobile ? 12 : 40,
      alignItems: 'baseline',
      borderTop: `1px solid ${COLORS.borderStrong}`,
      paddingTop: isMobile ? 18 : 24,
    }}>
      <div style={{
        fontFamily: ED_MONO, fontSize: 11, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: COLORS.fgMuted,
      }}>
        {number || ''}
      </div>
      <h2 style={{
        fontFamily: ED_DISPLAY, fontWeight: 500,
        fontSize: 'clamp(32px, 8vw, 64px)', lineHeight: 0.92,
        margin: 0, letterSpacing: '-0.035em', textTransform: 'uppercase',
      }}>
        {title}
      </h2>
      {sub && (
        <div style={{
          fontFamily: ED_MONO, fontSize: 11, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: COLORS.fgMuted,
          textAlign: isMobile ? 'left' : 'right',
        }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export default SectionHeader;
