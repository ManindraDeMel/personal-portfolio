import React from 'react';
import SectionHeader from './SectionHeader';
import { ED_DISPLAY, ED_MONO, COLORS } from '../styles/editorial';
import { useIsMobile } from '../hooks/useMediaQuery';

const PDF_PATH = '/assets/ManindradeMelResume.pdf';
const PREVIEW_PATH = '/assets/resume-preview.png';

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
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? 32 : 56,
        alignItems: 'start',
      }}>
        <DocumentFrame isMobile={isMobile} />

        <div style={{
          display: 'flex', flexDirection: 'column',
          gap: isMobile ? 24 : 36,
          alignItems: 'flex-start',
          paddingTop: isMobile ? 0 : 12,
        }}>
          <h3 style={{
            fontFamily: ED_DISPLAY, fontWeight: 500,
            fontSize: 'clamp(28px, 7vw, 60px)', lineHeight: 0.95,
            margin: 0, letterSpacing: '-0.035em',
            textTransform: 'uppercase', color: COLORS.fg,
          }}>
            Would you like<br />to know more?
          </h3>

          <p style={{
            margin: 0, maxWidth: 420,
            fontSize: isMobile ? 14.5 : 16,
            lineHeight: 1.55,
            color: 'rgba(245,243,238,0.78)',
            letterSpacing: '-0.005em',
          }}>
            Single-page A4. Selected work, research, recognition, stack, education.
            Open or download — the file is current as of {new Date().getFullYear()}.
          </p>

          <div style={{
            fontFamily: ED_MONO, fontSize: 11, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: COLORS.fgMuted,
          }}>
            ¶ Document — PDF · 1 page
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <a
              href={PDF_PATH}
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
            <a
              href={PDF_PATH}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 14,
                padding: '14px 24px',
                border: `1px solid ${COLORS.border}`,
                color: COLORS.fgDim, textDecoration: 'none',
                fontFamily: ED_MONO, fontSize: 12, letterSpacing: '0.16em',
                textTransform: 'uppercase',
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = COLORS.fg;
                e.currentTarget.style.color = COLORS.fg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = COLORS.border;
                e.currentTarget.style.color = COLORS.fgDim;
              }}
            >
              ↗ Open in tab
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function DocumentFrame({ isMobile }) {
  return (
    <a
      href={PDF_PATH}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open Manindra de Mel resume PDF in a new tab"
      style={{
        display: 'block',
        border: '1px solid rgba(245,243,238,0.18)',
        background: 'rgba(245,243,238,0.025)',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'transform 0.35s ease, box-shadow 0.35s ease',
        maxWidth: isMobile ? '100%' : 520,
        marginInline: 'auto',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 14px 38px rgba(0,0,0,0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        borderBottom: `1px solid ${COLORS.border}`,
        fontFamily: ED_MONO, fontSize: 10,
        letterSpacing: '0.16em', textTransform: 'uppercase',
        color: 'rgba(245,243,238,0.55)',
      }}>
        <div style={{ padding: '12px 16px' }}>★ Document</div>
        <div style={{
          padding: '12px 16px',
          borderLeft: `1px solid ${COLORS.border}`,
        }}>
          A4 · PDF
        </div>
        <div style={{
          padding: '12px 16px',
          borderLeft: `1px solid ${COLORS.border}`,
          textAlign: 'right',
          color: COLORS.fg,
        }}>
          01 / 01
        </div>
      </div>

      <div style={{
        position: 'relative',
        background: '#f5f3ee',
        overflow: 'hidden',
      }}>
        <img
          src={PREVIEW_PATH}
          alt="Resume page 1 preview"
          loading="lazy"
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
          }}
        />
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderTop: `1px solid ${COLORS.border}`,
        padding: '12px 16px',
        fontFamily: ED_MONO, fontSize: 10,
        letterSpacing: '0.16em', textTransform: 'uppercase',
        color: 'rgba(245,243,238,0.55)',
      }}>
        <span>Click to open full PDF</span>
        <span style={{ color: COLORS.fg }}>↗</span>
      </div>
    </a>
  );
}

export default Resume;
