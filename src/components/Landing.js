import React from 'react';
import DataRow from './DataRow';
import TypeReveal from './TypeReveal';
import { ED_DISPLAY, ED_MONO, COLORS } from '../styles/editorial';
import { useIsMobile, useIsTablet } from '../hooks/useMediaQuery';

const Landing = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  return (
    <section style={{
      padding: isMobile ? '32px 18px 56px' : '60px 40px 90px',
      borderBottom: `1px solid ${COLORS.border}`,
    }}>
      {!isMobile && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 60,
          alignItems: 'end',
          marginBottom: 60,
        }}>
          <div style={{
            fontFamily: ED_MONO, fontSize: 11, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: COLORS.fgMuted,
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginBottom: 6, paddingBottom: 6,
              borderBottom: '1px solid rgba(245,243,238,0.15)',
            }}>
              <span>Vol. 02</span><span>2026 Edition</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span>Issue</span><span>№ 14</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>A portfolio of</span><span>computer-science work</span>
            </div>
          </div>
          <div style={{
            fontFamily: ED_MONO, fontSize: 11, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: COLORS.fgMuted,
            textAlign: 'right',
          }}>
            <div>Software · Research · Systems</div>
            <div style={{ marginTop: 6 }}>Available for select work</div>
          </div>
        </div>
      )}

      <h1 style={{
        fontFamily: ED_DISPLAY, fontWeight: 500,
        fontSize: 'clamp(48px, 14vw, 150px)',
        lineHeight: 0.86, letterSpacing: '-0.05em',
        margin: 0, textWrap: 'balance', textTransform: 'uppercase',
      }}>
        Manindra<br />
        <span style={{ WebkitTextStroke: '1.5px #f5f3ee', color: 'transparent' }}>
          de Mel
        </span>
        <span style={{
          fontFamily: ED_MONO, fontSize: 14, letterSpacing: '0.1em',
          textTransform: 'uppercase', verticalAlign: 'top',
          marginLeft: 18, color: 'rgba(245,243,238,0.65)',
        }}>
          ★
        </span>
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile
          ? '1fr'
          : isTablet
            ? '1fr 1fr'
            : '1.4fr 1fr 0.9fr',
        gap: isMobile ? 28 : 48,
        marginTop: isMobile ? 36 : 60,
        alignItems: 'start',
      }}>
        <div style={isTablet && !isMobile ? { gridColumn: '1 / -1' } : undefined}>
          <div style={{
            fontFamily: ED_MONO, fontSize: 10, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: COLORS.fgMuted, marginBottom: 16,
          }}>
            ¶ Introduction
          </div>
          <p style={{
            fontFamily: ED_DISPLAY,
            fontSize: isMobile ? 17 : 20,
            lineHeight: 1.4,
            margin: 0, color: COLORS.fg, letterSpacing: '-0.005em',
          }}>
            <TypeReveal
              prefix={(
                <>
                  Software engineer based in Canberra. I work across{' '}
                  <Underlined>machine-learning research</Underlined>,{' '}
                  <Underlined>systems programming</Underlined>, and the{' '}
                  <Underlined>web</Underlined>{' '}
                </>
              )}
              tail="— currently studying CS at ANU, and taking on a small number of outside engagements each year."
              speed={18}
              startDelay={420}
            />
          </p>
        </div>

        <div style={{
          borderLeft: isMobile ? 'none' : '1px solid rgba(245,243,238,0.15)',
          paddingLeft: isMobile ? 0 : 32,
          fontFamily: ED_MONO, fontSize: 12, lineHeight: 1.8,
          color: COLORS.fgDim,
        }}>
          <DataRow k="Based in" v="Canberra, AU" delay={0.15} />
          <DataRow k="Role" v="Engineer / Researcher" delay={0.25} />
          <DataRow k="Studying" v="CS @ ANU" delay={0.35} />
          <DataRow k="Experience" v="5+ years" delay={0.45} />
          <DataRow k="Status" v="Selectively open" delay={0.55} />
        </div>

        <div style={{
          aspectRatio: '3 / 4',
          maxHeight: isMobile ? 480 : 'none',
          overflow: 'hidden',
          background: '#1a1a1a',
        }}>
          <img
            src="/assets/portrait.jpg"
            alt="Portrait of Manindra de Mel"
            width="600"
            height="800"
            fetchpriority="high"
            decoding="async"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </div>
      </div>
    </section>
  );
};

function Underlined({ children }) {
  return (
    <em style={{
      fontStyle: 'normal',
      textDecoration: 'underline',
      textDecorationThickness: '1px',
      textUnderlineOffset: '4px',
      textDecorationColor: 'rgba(245,243,238,0.4)',
    }}>
      {children}
    </em>
  );
}

export default Landing;
