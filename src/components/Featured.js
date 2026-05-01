import React, { useState } from 'react';
import DataRow from './DataRow';
import ProseBlock from './ProseBlock';
import { HerbariumPanel, EmbeddingPanel, PipelinePanel } from './SpotlightVisuals';
import { ED_DISPLAY, ED_MONO, COLORS } from '../styles/editorial';
import { useIsMobile, useIsTablet } from '../hooks/useMediaQuery';

function Featured({ p }) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [open, setOpen] = useState(false);
  if (!p || !p.featured) return null;
  const f = p.featured;
  const stack = Array.isArray(f.stack) ? f.stack : [];

  const showCaseStudy = !isMobile || open;

  return (
    <div style={{
      marginTop: isMobile ? 24 : 32,
      border: '1px solid rgba(245,243,238,0.18)',
      background: 'rgba(245,243,238,0.025)',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr',
        borderBottom: `1px solid ${COLORS.border}`,
        fontFamily: ED_MONO, fontSize: 10, letterSpacing: '0.16em',
        textTransform: 'uppercase', color: 'rgba(245,243,238,0.55)',
      }}>
        <div style={{ padding: isMobile ? '12px 14px' : '14px 20px' }}>★ Spotlight</div>
        <div style={{
          padding: isMobile ? '12px 14px' : '14px 20px',
          borderLeft: `1px solid ${COLORS.border}`,
        }}>
          {f.status}
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
          {p.stars != null ? `★ ${p.stars} · ` : ''}{p.lang}
        </div>
      </div>

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
            fontSize: 'clamp(32px, 8vw, 64px)', lineHeight: 0.92,
            margin: 0, letterSpacing: '-0.04em',
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
            {p.desc}
          </p>
          {isMobile && stack.length > 0 && (
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 6,
              marginTop: 18,
            }}>
              {stack.slice(0, 4).map((s, i) => (
                <span key={s} style={{
                  fontFamily: ED_MONO, fontSize: 10,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'rgba(245,243,238,0.7)',
                  border: '1px solid rgba(245,243,238,0.2)',
                  padding: '4px 10px', borderRadius: 999,
                  opacity: 0,
                  animation: `ed-fade-up 0.45s ${0.1 + i * 0.08}s ease forwards`,
                }}>
                  {s}
                </span>
              ))}
              {stack.length > 4 && (
                <span style={{
                  fontFamily: ED_MONO, fontSize: 10,
                  letterSpacing: '0.1em', color: 'rgba(245,243,238,0.65)',
                  padding: '4px 4px',
                  opacity: 0,
                  animation: `ed-fade-up 0.45s ${0.1 + 4 * 0.08}s ease forwards`,
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
            <DataRow k="Role" v={f.role} delay={0.15} />
            <DataRow k="With" v={f.collaborators} delay={0.27} />
            <DataRow k="Stack" v={stack.slice(0, 3).join(' · ')} delay={0.39} />
            <DataRow k="Year" v={p.year} delay={0.51} />
          </div>
        )}
      </div>

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

      {p.visuals === 'herbarium' && !isMobile && (
        <>
          <div style={{
            display: 'grid', gridTemplateColumns: '1.4fr 1fr',
            borderBottom: `1px solid ${COLORS.border}`,
          }}>
            <HerbariumPanel aspect="16 / 10" />
            <EmbeddingPanel aspect="5 / 4" borderRight={false} />
          </div>
          <div style={{ borderBottom: `1px solid ${COLORS.border}` }}>
            <PipelinePanel aspect="16 / 4" borderRight={false} />
          </div>
        </>
      )}
      {p.visuals === 'herbarium' && isMobile && (
        <>
          <div style={{ borderBottom: `1px solid ${COLORS.border}` }}>
            <HerbariumPanel aspect="16 / 9" borderRight={false} />
          </div>
          <div style={{ borderBottom: `1px solid ${COLORS.border}` }}>
            <PipelinePanel aspect="16 / 6" borderRight={false} />
          </div>
        </>
      )}

      {showCaseStudy && (
        <>
          {isMobile && (
            <div style={{
              padding: '20px 16px',
              borderBottom: `1px solid ${COLORS.border}`,
              fontFamily: ED_MONO, fontSize: 12, lineHeight: 1.9,
            }}>
              <DataRow k="Role" v={f.role} delay={0.05} />
              <DataRow k="With" v={f.collaborators} delay={0.17} />
              <DataRow k="Year" v={p.year} delay={0.29} />
            </div>
          )}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isTablet ? '1fr' : '1fr 1fr 1fr',
            padding: isMobile ? '24px 16px' : '48px 40px',
            gap: isMobile ? 24 : 40,
          }}>
            <ProseBlock label="¶ Problem" body={f.problem} />
            <ProseBlock label="¶ Approach" body={f.approach} />
            <ProseBlock label="¶ Outcome" body={f.outcome} />
          </div>
        </>
      )}

      <div style={{
        borderTop: `1px solid ${COLORS.border}`,
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
        {p.url && (
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: COLORS.fg, textDecoration: 'none' }}
          >
            → Open repo
          </a>
        )}
      </div>
    </div>
  );
}

export default Featured;
