import React from 'react';
import { Link } from 'react-router-dom';
import PORTFOLIO from '../data/portfolio';
import { ED_DISPLAY, ED_MONO, COLORS } from '../styles/editorial';
import { useIsMobile } from '../hooks/useMediaQuery';

// The home page's centrepiece: a four-part reading order over the work —
// products, robotics/CV, research, systems. Each row links out to the
// project itself or the relevant index page.
function StoryIndex() {
  const isMobile = useIsMobile();

  return (
    <section
      id="story"
      style={{
        padding: isMobile ? '56px 18px' : '90px 40px',
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        gap: 24, flexWrap: 'wrap', marginBottom: isMobile ? 8 : 12,
      }}>
        <h2 style={{
          fontFamily: ED_DISPLAY, fontWeight: 500,
          fontSize: 'clamp(28px, 5vw, 56px)', lineHeight: 0.95,
          letterSpacing: '-0.035em', textTransform: 'uppercase', margin: 0,
        }}>
          The work,<br />in three parts
        </h2>
        {!isMobile && (
          <span style={{
            fontFamily: ED_MONO, fontSize: 11, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: COLORS.fgMuted,
          }}>
            A reading order, not a category list
          </span>
        )}
      </div>

      {PORTFOLIO.story.map((s, i) => (
        <StoryRow key={s.title} s={s} i={i} isMobile={isMobile} />
      ))}
    </section>
  );
}

function StoryRow({ s, i, isMobile }) {
  const inner = (
    <>
      {!isMobile && (
        <span style={{ fontFamily: ED_MONO, fontSize: 12, color: COLORS.fgFaint }}>
          {String(i + 1).padStart(2, '0')}
        </span>
      )}
      <span style={{
        fontFamily: ED_MONO, fontSize: 10, lineHeight: 1.7,
        letterSpacing: '0.16em', textTransform: 'uppercase', color: COLORS.fgMuted,
      }}>
        {s.part}
      </span>
      <span>
        <span style={{
          display: 'block',
          fontFamily: ED_DISPLAY, fontWeight: 500,
          fontSize: isMobile ? 30 : 'clamp(26px, 3.8vw, 44px)',
          lineHeight: 1, letterSpacing: '-0.03em',
          textTransform: 'uppercase', marginBottom: 10,
        }}>
          {s.title}
        </span>
        <span style={{
          display: 'block', fontSize: 15, lineHeight: 1.55,
          color: COLORS.fgDim, maxWidth: '34em', letterSpacing: '-0.005em',
        }}>
          {s.desc}
        </span>
      </span>
      <span style={{
        fontFamily: ED_MONO, fontSize: 11, lineHeight: 2,
        letterSpacing: '0.06em', color: COLORS.fgMuted,
        textAlign: isMobile ? 'left' : 'right',
      }}>
        {s.metaLines.map((m) => (
          <span key={m} style={{ display: isMobile ? 'inline' : 'block', marginRight: isMobile ? 14 : 0 }}>
            {m}
          </span>
        ))}
        <span style={{ display: isMobile ? 'inline' : 'block', color: COLORS.fg }}>
          {s.linkLabel}
        </span>
      </span>
    </>
  );

  const style = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : '56px 200px 1fr 240px',
    gap: isMobile ? 10 : 28,
    alignItems: 'baseline',
    padding: isMobile ? '26px 0' : '34px 0',
    borderTop: `1px solid ${COLORS.border}`,
    color: COLORS.fg,
    textDecoration: 'none',
    transition: 'background 0.2s, padding-left 0.25s',
  };
  const hover = {
    onMouseEnter: (e) => {
      e.currentTarget.style.background = 'rgba(245,243,238,0.03)';
      e.currentTarget.style.paddingLeft = '14px';
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.paddingLeft = '0px';
    },
  };

  if (s.external) {
    return (
      <a href={s.href} target="_blank" rel="noopener noreferrer" style={style} {...hover}>
        {inner}
      </a>
    );
  }
  return (
    <Link to={s.href} style={style} {...hover}>
      {inner}
    </Link>
  );
}

export default StoryIndex;
