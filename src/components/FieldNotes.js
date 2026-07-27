import React from 'react';
import PORTFOLIO from '../data/portfolio';
import { ED_MONO, COLORS } from '../styles/editorial';
import { useIsMobile } from '../hooks/useMediaQuery';

// Technical write-ups. Continues the story index numbering (05) so the home
// page reads as one sequence. Entries without a URL render as plain text
// until the write-up exists.
function FieldNotes() {
  const isMobile = useIsMobile();

  return (
    <section
      id="notes"
      style={{
        padding: isMobile ? '56px 18px' : '72px 40px',
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '56px 200px 1fr',
        gap: isMobile ? 10 : 28,
        alignItems: 'baseline',
      }}>
        {!isMobile && (
          <span style={{ fontFamily: ED_MONO, fontSize: 12, color: COLORS.fgFaint }}>
            04
          </span>
        )}
        <span style={{
          fontFamily: ED_MONO, fontSize: 10, letterSpacing: '0.16em',
          textTransform: 'uppercase', color: COLORS.fgMuted,
        }}>
          Field notes
        </span>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {PORTFOLIO.notes.map((n, i) => (
            <li
              key={n.title}
              style={{
                display: 'flex', justifyContent: 'space-between',
                gap: 20, flexWrap: 'wrap',
                padding: i === 0 ? '0 0 16px' : '16px 0',
                borderTop: i === 0 ? 'none' : `1px solid ${COLORS.border}`,
                fontSize: 16, letterSpacing: '-0.01em',
              }}
            >
              {n.url ? (
                <a href={n.url} style={{ color: COLORS.fg, textDecoration: 'none' }}>
                  {n.title} →
                </a>
              ) : (
                <span>{n.title}</span>
              )}
              <span style={{
                fontFamily: ED_MONO, fontSize: 10, letterSpacing: '0.14em',
                textTransform: 'uppercase', color: COLORS.fgMuted,
              }}>
                {n.state}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default FieldNotes;
