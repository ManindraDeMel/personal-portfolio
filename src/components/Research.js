import React, { useEffect, useState } from 'react';
import SectionHeader from './SectionHeader';
import ProseBlock from './ProseBlock';
import DataRow from './DataRow';
import fetchResearch from '../service/fetchResearch';
import { ED_DISPLAY, ED_MONO, COLORS } from '../styles/editorial';
import { useIsMobile, useIsTablet } from '../hooks/useMediaQuery';

function Research() {
  const [items, setItems] = useState([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchResearch().then(setItems);
  }, []);

  return (
    <section
      id="research"
      style={{
        padding: isMobile ? '56px 18px' : '90px 40px',
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      <SectionHeader
        number="04"
        title="Research"
        sub="ML in academia and the wild."
      />

      <div style={{
        marginTop: isMobile ? 32 : 56,
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? 28 : 40,
      }}>
        {items.map((p, i) => (
          <ResearchCard key={p.slug || i} p={p} index={i} />
        ))}
      </div>
    </section>
  );
}

function ResearchCard({ p, index }) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [open, setOpen] = useState(false);
  const stack = Array.isArray(p.stack) ? p.stack : [];

  const showCaseStudy = !isMobile || open;

  return (
    <article style={{
      border: '1px solid rgba(245,243,238,0.18)',
      background: index % 2 === 0 ? 'rgba(245,243,238,0.025)' : 'transparent',
    }}>
      {/* meta strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr',
        borderBottom: `1px solid ${COLORS.border}`,
        fontFamily: ED_MONO, fontSize: 10, letterSpacing: '0.16em',
        textTransform: 'uppercase', color: 'rgba(245,243,238,0.55)',
      }}>
        <div style={{ padding: isMobile ? '12px 14px' : '14px 20px' }}>
          ¶ {String(index + 1).padStart(2, '0')} — Research
        </div>
        <div style={{
          padding: isMobile ? '12px 14px' : '14px 20px',
          borderLeft: `1px solid ${COLORS.border}`,
        }}>
          {p.status}
        </div>
        <div style={{
          padding: isMobile ? '12px 14px' : '14px 20px',
          borderLeft: isMobile ? 'none' : `1px solid ${COLORS.border}`,
          borderTop: isMobile ? `1px solid ${COLORS.border}` : 'none',
        }}>
          {p.year}
        </div>
        <div style={{
          padding: isMobile ? '12px 14px' : '14px 20px',
          borderLeft: `1px solid ${COLORS.border}`,
          borderTop: isMobile ? `1px solid ${COLORS.border}` : 'none',
          textAlign: 'right', color: COLORS.fg,
        }}>
          {p.course || (p.role || '').toUpperCase()}
        </div>
      </div>

      {/* Title + blurb / data column */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isTablet ? '1fr' : '1.4fr 1fr',
        borderBottom: `1px solid ${COLORS.border}`,
      }}>
        <div style={{
          padding: isMobile ? '24px 16px' : '36px 32px',
          borderRight: isTablet ? 'none' : `1px solid ${COLORS.border}`,
          borderBottom: isTablet ? `1px solid ${COLORS.border}` : 'none',
        }}>
          <h3 style={{
            fontFamily: ED_DISPLAY, fontWeight: 500,
            fontSize: 'clamp(28px, 6.5vw, 54px)', lineHeight: 0.95,
            margin: 0, letterSpacing: '-0.035em',
            textTransform: 'uppercase', color: COLORS.fg,
            wordBreak: 'break-word',
          }}>
            {p.name}
          </h3>
          <p style={{
            margin: '20px 0 0', maxWidth: 640,
            fontSize: isMobile ? 14.5 : 16,
            lineHeight: 1.55,
            color: 'rgba(245,243,238,0.82)',
            letterSpacing: '-0.005em',
          }}>
            {p.blurb}
          </p>
          {isMobile && stack.length > 0 && (
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 6,
              marginTop: 18,
            }}>
              {stack.slice(0, 4).map((s) => (
                <span key={s} style={{
                  fontFamily: ED_MONO, fontSize: 10,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'rgba(245,243,238,0.7)',
                  border: '1px solid rgba(245,243,238,0.2)',
                  padding: '4px 10px', borderRadius: 999,
                }}>
                  {s}
                </span>
              ))}
              {stack.length > 4 && (
                <span style={{
                  fontFamily: ED_MONO, fontSize: 10,
                  letterSpacing: '0.1em', color: 'rgba(245,243,238,0.45)',
                  padding: '4px 4px',
                }}>
                  +{stack.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
        {!isMobile && (
          <div style={{
            padding: '36px 32px',
            fontFamily: ED_MONO, fontSize: 12, lineHeight: 1.9,
          }}>
            <DataRow k="Role" v={p.role} />
            <DataRow k="With" v={p.collaborators} />
            <DataRow k="Stack" v={stack.slice(0, 3).join(' · ')} />
            <DataRow k="Year" v={p.year} />
          </div>
        )}
      </div>

      {/* Case-study toggle on mobile */}
      {isMobile && (
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          style={{
            width: '100%', background: 'transparent',
            border: 'none', cursor: 'pointer',
            borderBottom: `1px solid ${COLORS.border}`,
            padding: '14px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontFamily: ED_MONO, fontSize: 11,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: COLORS.fg,
          }}
        >
          <span>{open ? '— Hide case study' : '+ Read case study'}</span>
          <span style={{
            fontSize: 16, color: COLORS.fgMuted,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s',
          }}>⌄</span>
        </button>
      )}

      {showCaseStudy && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: isTablet ? '1fr' : '1fr 1fr 1fr',
          padding: isMobile ? '24px 16px' : '40px 36px',
          gap: isMobile ? 24 : 36,
          borderBottom: `1px solid ${COLORS.border}`,
        }}>
          <ProseBlock label="¶ Problem" body={p.problem} />
          <ProseBlock label="¶ Approach" body={p.approach} />
          <ProseBlock label="¶ Outcome" body={p.outcome} />
        </div>
      )}

      {/* Footer: stack + live demo link */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: isMobile ? 10 : 0,
        padding: isMobile ? '14px 16px' : '16px 24px',
        fontFamily: ED_MONO, fontSize: 11,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: 'rgba(245,243,238,0.55)',
      }}>
        <span style={{ wordBreak: 'break-word' }}>
          {isMobile ? `Stack · ${stack.length} tools` : `Full stack — ${stack.join(' · ')}`}
        </span>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
          {p.paperUrl && (
            <a
              href={p.paperUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: COLORS.fgDim, textDecoration: 'none' }}
            >
              ↗ Paper
            </a>
          )}
          {p.repoUrl && (
            <a
              href={p.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: COLORS.fgDim, textDecoration: 'none' }}
            >
              ↗ Repo
            </a>
          )}
          {p.liveUrl && (
            <a
              href={p.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: COLORS.fg, textDecoration: 'none' }}
            >
              → Open demo
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default Research;
