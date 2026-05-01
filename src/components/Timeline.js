import React, { useEffect, useRef, useState } from 'react';
import SectionHeader from './SectionHeader';
import { ED_DISPLAY, ED_MONO, COLORS } from '../styles/editorial';
import { useIsMobile, useIsTablet } from '../hooks/useMediaQuery';

const stripTags = (s) => String(s ?? '').replace(/<[^>]*>/g, '');

const Timeline = ({ data }) => {
  const [active, setActive] = useState(0);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  if (!data || data.length === 0) {
    return (
      <section
        id="journey"
        style={{
          padding: isMobile ? '56px 18px' : '90px 40px',
          borderBottom: `1px solid ${COLORS.border}`,
        }}
      >
        <SectionHeader number="02" title="Journey" sub="Loading…" />
      </section>
    );
  }

  if (isMobile) {
    return <MobileTimeline data={data} />;
  }

  const safeActive = Math.min(active, data.length - 1);
  const current = data[safeActive];

  return (
    <section
      id="journey"
      style={{
        padding: '90px 40px',
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      <SectionHeader number="02" title="Journey" sub="A short index of milestones, in reverse." />

      <div style={{
        display: 'grid',
        gridTemplateColumns: isTablet ? '1fr' : '1fr 2fr',
        gap: 64,
        marginTop: 60,
      }}>
        <div>
          {data.map((j, i) => (
            <button
              key={`${j.year}-${i}`}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              style={{
                width: '100%', textAlign: 'left',
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: '20px 0',
                borderBottom: `1px solid ${COLORS.border}`,
                color: safeActive === i ? COLORS.fg : COLORS.fgFaint,
                transition: 'color 0.3s',
                fontFamily: ED_DISPLAY,
                display: 'flex', alignItems: 'baseline',
                gap: 24,
                flexWrap: 'wrap',
              }}
            >
              <span style={{
                fontSize: safeActive === i ? 60 : 42,
                lineHeight: 1,
                transition: 'all 0.4s cubic-bezier(.2,.8,.2,1)',
                fontWeight: safeActive === i ? 600 : 400,
              }}>
                {j.year}
              </span>
              <span style={{
                fontFamily: ED_MONO,
                fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
                opacity: safeActive === i ? 1 : 0,
                transform: safeActive === i ? 'translateX(0)' : 'translateX(-10px)',
                transition: 'all 0.3s',
              }}>
                ↳ {j.subtitle}
              </span>
            </button>
          ))}
        </div>

        <div style={{
          position: isTablet ? 'static' : 'sticky',
          top: 100,
          alignSelf: 'start',
        }}>
          <div style={{
            fontFamily: ED_MONO, fontSize: 10, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: COLORS.fgMuted, marginBottom: 20,
            display: 'flex', justifyContent: 'space-between',
          }}>
            <span>Detail · {current.year}</span>
            <span>
              {String(safeActive + 1).padStart(2, '0')} /{' '}
              {String(data.length).padStart(2, '0')}
            </span>
          </div>
          <h3 style={{
            fontFamily: ED_DISPLAY,
            fontSize: 28,
            fontWeight: 500,
            lineHeight: 1.2, margin: '0 0 24px', letterSpacing: '-0.01em',
          }}>
            {current.subtitle}
          </h3>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {current.points.map((p, i) => (
              <li key={i} style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr',
                gap: 16,
                padding: '20px 0',
                borderTop: `1px solid ${COLORS.border}`,
              }}>
                <span style={{
                  fontFamily: ED_MONO, fontSize: 11,
                  color: COLORS.fgFaint, letterSpacing: '0.1em',
                }}>
                  ¶ {String(i + 1).padStart(2, '0')}
                </span>
                <p style={{
                  margin: 0,
                  fontSize: 14,
                  lineHeight: 1.65,
                  color: 'rgba(245,243,238,0.85)',
                }}>
                  {stripTags(p)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

// Mobile timeline: vertical rail with nodes for each year.
// As you scroll the rail "fills in" using IntersectionObserver progress.
// Tap a node header to expand/collapse its points.
function MobileTimeline({ data }) {
  const [open, setOpen] = useState(() => new Set([0]));
  const [progress, setProgress] = useState(0);
  const railRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.IntersectionObserver) return;
    const obs = new IntersectionObserver(
      (entries) => {
        let maxIdx = -1;
        entries.forEach((e) => {
          const idx = Number(e.target.dataset.idx);
          if (e.isIntersecting && idx > maxIdx) maxIdx = idx;
        });
        if (maxIdx >= 0) {
          setProgress((prev) => Math.max(prev, maxIdx));
        }
      },
      { rootMargin: '-30% 0px -30% 0px', threshold: 0 }
    );
    itemRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, [data.length]);

  const toggle = (i) => {
    setOpen((s) => {
      const next = new Set(s);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const fillPct = data.length <= 1 ? 100 : ((progress + 0.5) / data.length) * 100;

  return (
    <section
      id="journey"
      style={{
        padding: '56px 18px',
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      <SectionHeader number="02" title="Journey" sub="A short index of milestones, in reverse." />

      <div style={{
        marginTop: 32,
        display: 'flex', justifyContent: 'space-between',
        fontFamily: ED_MONO, fontSize: 10,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        color: COLORS.fgMuted,
        marginBottom: 14,
      }}>
        <span>↓ {data.length} milestones</span>
        <span>
          {String(Math.min(progress + 1, data.length)).padStart(2, '0')} /{' '}
          {String(data.length).padStart(2, '0')}
        </span>
      </div>

      <div style={{ position: 'relative', paddingLeft: 4 }} ref={railRef}>
        {/* Static rail — full length, dim */}
        <div style={{
          position: 'absolute',
          left: 13, top: 8, bottom: 8,
          width: 1,
          background: 'rgba(245,243,238,0.18)',
        }} />
        {/* Animated fill rail */}
        <div style={{
          position: 'absolute',
          left: 13, top: 8,
          width: 1,
          height: `calc(${fillPct}% - 16px)`,
          background: COLORS.fg,
          transition: 'height 0.6s cubic-bezier(.2,.8,.2,1)',
        }} />

        {data.map((j, i) => (
          <MobileTimelineRow
            key={`${j.year}-${i}`}
            ref={(el) => { itemRefs.current[i] = el; }}
            idx={i}
            entry={j}
            isOpen={open.has(i)}
            onToggle={() => toggle(i)}
            reached={i <= progress}
          />
        ))}
      </div>
    </section>
  );
}

const MobileTimelineRow = React.forwardRef(function MobileTimelineRow(
  { idx, entry, isOpen, onToggle, reached },
  ref
) {
  return (
    <div
      ref={ref}
      data-idx={idx}
      style={{
        display: 'grid',
        gridTemplateColumns: '28px 1fr',
        columnGap: 14,
        paddingTop: idx === 0 ? 0 : 4,
        paddingBottom: 4,
      }}
    >
      <div style={{ position: 'relative', minHeight: 28 }}>
        <span style={{
          position: 'absolute',
          left: 4, top: 8,
          width: 11, height: 11,
          borderRadius: '50%',
          background: reached ? COLORS.fg : 'transparent',
          border: `1px solid ${reached ? COLORS.fg : 'rgba(245,243,238,0.4)'}`,
          boxShadow: isOpen ? `0 0 0 4px rgba(245,243,238,0.12)` : 'none',
          transform: isOpen ? 'scale(1.15)' : 'scale(1)',
          transition: 'all 0.3s cubic-bezier(.2,.8,.2,1)',
          zIndex: 1,
        }} />
      </div>

      <div style={{
        borderBottom: `1px solid ${COLORS.border}`,
        paddingBottom: isOpen ? 14 : 0,
        transition: 'padding 0.3s',
      }}>
        <button
          onClick={onToggle}
          aria-expanded={isOpen}
          style={{
            width: '100%', textAlign: 'left',
            background: 'transparent', border: 'none', cursor: 'pointer',
            padding: '4px 0 14px',
            display: 'flex', alignItems: 'baseline',
            justifyContent: 'space-between', gap: 10,
            fontFamily: ED_DISPLAY,
            color: COLORS.fg,
          }}
        >
          <span style={{
            display: 'flex', alignItems: 'baseline',
            gap: 12, flexWrap: 'wrap', minWidth: 0,
          }}>
            <span style={{
              fontFamily: ED_DISPLAY,
              fontSize: isOpen ? 36 : 28,
              lineHeight: 1,
              fontWeight: isOpen ? 600 : 500,
              color: reached ? COLORS.fg : COLORS.fgFaint,
              transition: 'all 0.35s cubic-bezier(.2,.8,.2,1)',
            }}>
              {entry.year}
            </span>
            <span style={{
              fontFamily: ED_MONO, fontSize: 10,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: isOpen ? COLORS.fg : COLORS.fgMuted,
            }}>
              ↳ {entry.subtitle}
            </span>
          </span>
          <span style={{
            fontFamily: ED_MONO, fontSize: 16,
            color: COLORS.fgMuted,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s',
            flexShrink: 0,
          }}>
            ⌄
          </span>
        </button>

        <div style={{
          overflow: 'hidden',
          maxHeight: isOpen ? 2000 : 0,
          opacity: isOpen ? 1 : 0,
          transition: isOpen
            ? 'max-height 0.5s ease, opacity 0.35s 0.05s ease'
            : 'max-height 0.3s ease, opacity 0.15s ease',
        }}>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {entry.points.map((p, i) => (
              <li key={i} style={{
                display: 'grid',
                gridTemplateColumns: '32px 1fr',
                gap: 12,
                padding: '11px 0',
                borderTop: i === 0 ? 'none' : `1px solid ${COLORS.border}`,
              }}>
                <span style={{
                  fontFamily: ED_MONO, fontSize: 10,
                  color: COLORS.fgFaint, letterSpacing: '0.1em',
                }}>
                  ¶ {String(i + 1).padStart(2, '0')}
                </span>
                <p style={{
                  margin: 0, fontSize: 13, lineHeight: 1.6,
                  color: 'rgba(245,243,238,0.85)',
                }}>
                  {stripTags(p)}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
});

export default Timeline;
