import React from 'react';
import SectionHeader from './SectionHeader';
import { ED_DISPLAY, ED_MONO, COLORS } from '../styles/editorial';
import { useIsMobile } from '../hooks/useMediaQuery';

function Resume() {
  const isMobile = useIsMobile();
  return (
    <section
      id="resume"
      style={{
        padding: isMobile ? '56px 18px' : '90px 40px',
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      <SectionHeader number="05" title="Resume" sub="Want the long version?" />
      <div style={{
        marginTop: isMobile ? 32 : 60,
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr',
        gap: isMobile ? 28 : 48,
        alignItems: isMobile ? 'start' : 'end',
      }}>
        <h3 style={{
          fontFamily: ED_DISPLAY, fontWeight: 500,
          fontSize: 'clamp(28px, 7vw, 60px)', lineHeight: 0.95,
          margin: 0, letterSpacing: '-0.035em',
          textTransform: 'uppercase', color: COLORS.fg,
        }}>
          Would you like<br />to know more?
        </h3>
        <div style={{
          display: 'flex', flexDirection: 'column',
          alignItems: isMobile ? 'flex-start' : 'flex-end',
          gap: 24,
        }}>
          <div style={{
            fontFamily: ED_MONO, fontSize: 11, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: COLORS.fgMuted,
            textAlign: isMobile ? 'left' : 'right',
          }}>
            ¶ Document — PDF
          </div>
          <a
            href="/assets/ManindradeMelResume.pdf"
            download
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 14,
              padding: '14px 24px',
              border: `1px solid ${COLORS.fg}`,
              color: COLORS.fg, textDecoration: 'none',
              fontFamily: ED_MONO, fontSize: 12, letterSpacing: '0.16em',
              textTransform: 'uppercase',
              transition: 'background 0.2s, color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = COLORS.fg;
              e.currentTarget.style.color = '#0a0a0a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = COLORS.fg;
            }}
          >
            ↓ Download résumé
          </a>
        </div>
      </div>
    </section>
  );
}

export default Resume;
