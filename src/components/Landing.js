import React from 'react';
import { ED_DISPLAY, ED_MONO, COLORS } from '../styles/editorial';
import { useIsMobile } from '../hooks/useMediaQuery';

const FACTS = [
  'Software engineer & ML researcher',
  'CS @ ANU',
  '5+ years',
  'Selectively available',
];

const Landing = () => {
  const isMobile = useIsMobile();
  return (
    <section style={{
      padding: isMobile ? '48px 18px 64px' : '80px 40px 100px',
      borderBottom: `1px solid ${COLORS.border}`,
    }}>
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
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr',
        gap: isMobile ? 32 : 60,
        alignItems: 'start',
        marginTop: isMobile ? 40 : 56,
      }}>
        <div>
          <p style={{
            fontFamily: ED_DISPLAY, fontWeight: 500,
            fontSize: isMobile ? 'clamp(22px, 6.4vw, 30px)' : 'clamp(24px, 3.2vw, 42px)',
            lineHeight: 1.12, letterSpacing: '-0.025em',
            maxWidth: '21em', margin: 0,
            textWrap: 'balance',
          }}>
            I build intelligent systems, from <Underlined>mobile AI products</Underlined>{' '}
            to <Underlined>computer vision</Underlined> and{' '}
            <Underlined>production platforms</Underlined>.
          </p>

          <div style={{
            display: 'flex', gap: 12, flexWrap: 'wrap',
            marginTop: isMobile ? 28 : 36,
            fontFamily: ED_MONO, fontSize: 12,
            letterSpacing: '0.08em', color: COLORS.fgDim,
          }}>
            {FACTS.map((f, i) => (
              <React.Fragment key={f}>
                {i > 0 && <span aria-hidden="true" style={{ color: COLORS.fgFaint }}>·</span>}
                <span>{f}</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        <div style={{
          aspectRatio: '3 / 4',
          maxHeight: isMobile ? 480 : 520,
          maxWidth: isMobile ? '100%' : 390,
          justifySelf: isMobile ? 'stretch' : 'end',
          width: '100%',
          overflow: 'hidden',
          background: '#1a1a1a',
        }}>
          <img
            src="/assets/portrait.jpg"
            alt="Manindra de Mel with his car"
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
      textUnderlineOffset: '6px',
      textDecorationColor: 'rgba(245,243,238,0.4)',
    }}>
      {children}
    </em>
  );
}

export default Landing;
