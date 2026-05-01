import React, { useState } from 'react';
import SectionHeader from './SectionHeader';
import PORTFOLIO from '../data/portfolio';
import { ED_DISPLAY, ED_MONO, COLORS } from '../styles/editorial';
import { useIsMobile } from '../hooks/useMediaQuery';
import TypeReveal, { splitForTyping } from './TypeReveal';

function Testimonials() {
  const isMobile = useIsMobile();
  const [showAll, setShowAll] = useState(false);
  const all = PORTFOLIO.testimonials;
  const initial = isMobile ? 2 : all.length;
  const visible = showAll || !isMobile ? all : all.slice(0, initial);
  const hidden = all.length - visible.length;

  return (
    <section
      id="words"
      style={{
        padding: isMobile ? '56px 18px' : '90px 40px',
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      <SectionHeader number="06" title="Words" sub="From people I've worked with." />

      <div style={{
        marginTop: isMobile ? 32 : 60,
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? 18 : 32,
      }}>
        {visible.map((t, i) => (
          <figure
            key={i}
            style={{
              margin: 0,
              padding: isMobile ? 22 : 32,
              border: '1px solid rgba(245,243,238,0.15)',
              background: i % 3 === 0 ? 'rgba(245,243,238,0.025)' : 'transparent',
              display: 'flex', flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: isMobile ? 0 : 260,
            }}
          >
            <div style={{
              fontFamily: ED_DISPLAY, fontSize: 72,
              lineHeight: 0.5, color: 'rgba(245,243,238,0.3)',
              marginBottom: 16,
            }}>
              “
            </div>
            <blockquote style={{
              fontFamily: ED_DISPLAY,
              fontSize: isMobile ? 15.5 : 17,
              lineHeight: 1.45,
              fontWeight: 400, margin: 0, letterSpacing: '-0.012em',
              color: 'rgba(245,243,238,0.92)',
            }}>
              {(() => {
                const [head, tail] = splitForTyping(t.quote);
                return <TypeReveal prefix={head} tail={tail} speed={22} />;
              })()}
            </blockquote>
            <figcaption style={{
              marginTop: 24, paddingTop: 16,
              borderTop: '1px solid rgba(245,243,238,0.15)',
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              justifyContent: 'space-between',
              gap: isMobile ? 6 : 0,
              fontFamily: ED_MONO, fontSize: 11,
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              <span style={{ color: COLORS.fg }}>— {t.name}</span>
              <span style={{ color: COLORS.fgMuted }}>{t.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      {isMobile && hidden > 0 && (
        <button
          onClick={() => setShowAll(true)}
          style={{
            marginTop: 20,
            width: '100%',
            background: 'transparent',
            border: '1px solid rgba(245,243,238,0.3)',
            color: COLORS.fg, cursor: 'pointer',
            padding: '14px 20px',
            fontFamily: ED_MONO, fontSize: 11,
            letterSpacing: '0.16em', textTransform: 'uppercase',
          }}
        >
          + Show {hidden} more
        </button>
      )}
      {isMobile && showAll && all.length > initial && (
        <button
          onClick={() => setShowAll(false)}
          style={{
            marginTop: 12,
            width: '100%',
            background: 'transparent',
            border: '1px solid rgba(245,243,238,0.18)',
            color: COLORS.fgMuted, cursor: 'pointer',
            padding: '12px 20px',
            fontFamily: ED_MONO, fontSize: 11,
            letterSpacing: '0.16em', textTransform: 'uppercase',
          }}
        >
          — Collapse
        </button>
      )}
    </section>
  );
}

export default Testimonials;
