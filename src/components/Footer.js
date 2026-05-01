import React from 'react';
import { ED_MONO, COLORS } from '../styles/editorial';
import { useIsMobile } from '../hooks/useMediaQuery';

function Footer() {
  const isMobile = useIsMobile();
  return (
    <footer style={{
      padding: isMobile ? '24px 18px' : '40px',
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
      gap: isMobile ? 8 : 0,
      fontFamily: ED_MONO, fontSize: 10,
      letterSpacing: '0.16em', textTransform: 'uppercase',
      color: COLORS.fgMuted,
      textAlign: isMobile ? 'left' : 'left',
    }}>
      <span>© {new Date().getFullYear()} Manindra de Mel</span>
      <span style={{ textAlign: isMobile ? 'left' : 'center' }}>
        Set in Helvetica Neue & JetBrains Mono
      </span>
      <span style={{ textAlign: isMobile ? 'left' : 'right' }}>
        Vol. 02 / Issue № 14
      </span>
    </footer>
  );
}

export default Footer;
