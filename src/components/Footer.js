import React from 'react';
import { ED_MONO, COLORS } from '../styles/editorial';
import { useIsMobile } from '../hooks/useMediaQuery';

function Footer() {
  const isMobile = useIsMobile();
  return (
    <footer style={{
      padding: isMobile ? '24px 18px' : '28px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      gap: 16,
      flexWrap: 'wrap',
      fontFamily: ED_MONO, fontSize: 10,
      letterSpacing: '0.16em', textTransform: 'uppercase',
      color: COLORS.fgMuted,
    }}>
      <span>© {new Date().getFullYear()} Manindra de Mel</span>
      <span>Set in Helvetica Neue & JetBrains Mono</span>
    </footer>
  );
}

export default Footer;
