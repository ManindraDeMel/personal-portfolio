import React from 'react';
import ContactForm from './ContactForm';
import LocalTime from './LocalTime';
import PORTFOLIO from '../data/portfolio';
import { ED_DISPLAY, ED_MONO, COLORS } from '../styles/editorial';
import { useIsMobile } from '../hooks/useMediaQuery';

function ContactMain() {
  const tel = PORTFOLIO.phone.replace(/\s/g, '');
  const isMobile = useIsMobile();
  return (
    <section
      id="contact"
      style={{
        padding: isMobile ? '72px 18px 40px' : '120px 40px 60px',
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      <div style={{
        fontFamily: ED_MONO, fontSize: 11, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: COLORS.fgMuted,
        marginBottom: isMobile ? 20 : 32,
      }}>
        ¶ 07 — Let’s work together
      </div>
      <h2 style={{
        fontFamily: ED_DISPLAY, fontWeight: 500,
        fontSize: 'clamp(36px, 11vw, 110px)', lineHeight: 0.9,
        margin: 0, letterSpacing: '-0.045em', textTransform: 'uppercase',
      }}>
        Let’s work<br />
        <span style={{ WebkitTextStroke: '1.5px #f5f3ee', color: 'transparent' }}>
          together
        </span>.
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? 28 : 48,
        marginTop: isMobile ? 36 : 60,
      }}>
        <div style={{ paddingTop: 24, borderTop: `1px solid ${COLORS.borderStrong}` }}>
          <div style={{
            fontFamily: ED_MONO, fontSize: 11, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: COLORS.fgMuted, marginBottom: 24,
          }}>
            ¶ Inquire
          </div>
          <a
            href={`mailto:${PORTFOLIO.email}`}
            style={{
              fontFamily: ED_DISPLAY, fontWeight: 500,
              fontSize: 'clamp(18px, 5.2vw, 38px)',
              letterSpacing: '-0.025em', color: COLORS.fg,
              textDecoration: 'none',
              borderBottom: '1px solid rgba(245,243,238,0.4)',
              paddingBottom: 12, display: 'inline-block',
              wordBreak: 'break-all',
            }}
          >
            {PORTFOLIO.email} →
          </a>
        </div>
        <div style={{ paddingTop: 24, borderTop: `1px solid ${COLORS.borderStrong}` }}>
          <div style={{
            fontFamily: ED_MONO, fontSize: 11, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: COLORS.fgMuted, marginBottom: 24,
          }}>
            ¶ Contact
          </div>
          <a
            href={`tel:${tel}`}
            style={{
              fontFamily: ED_DISPLAY, fontWeight: 500,
              fontSize: 'clamp(20px, 5.2vw, 38px)',
              letterSpacing: '-0.025em', color: COLORS.fg,
              textDecoration: 'none', display: 'block', marginBottom: 16,
            }}
          >
            {PORTFOLIO.phone}
          </a>
          <p style={{
            fontFamily: ED_MONO, fontSize: 13, lineHeight: 1.7,
            color: COLORS.fgDim, margin: 0, letterSpacing: '0.02em',
          }}>
            {PORTFOLIO.address}
          </p>
        </div>
      </div>

      <ContactForm />

      <div style={{
        marginTop: isMobile ? 40 : 60,
        paddingTop: 20,
        borderTop: `1px solid ${COLORS.borderStrong}`,
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
        gap: isMobile ? 16 : 0,
        fontFamily: ED_MONO, fontSize: 12, letterSpacing: '0.06em',
      }}>
        <SocialCell first label="LinkedIn" handle="/manindra-de-mel" href={PORTFOLIO.socials.linkedin} isMobile={isMobile} index={0} />
        <SocialCell label="GitHub" handle="@ManindraDeMel" href={PORTFOLIO.socials.github} isMobile={isMobile} index={1} />
        <SocialCell label="Instagram" handle="@de_manindra_mel" href={PORTFOLIO.socials.instagram} isMobile={isMobile} index={2} />
        <SocialCell label="Local time" timeCell isMobile={isMobile} index={3} />
      </div>
    </section>
  );
}

function SocialCell({ label, handle, href, first, timeCell, isMobile, index }) {
  const showLeftBorder = isMobile ? (index % 2 === 1) : !first;
  return (
    <div style={{
      paddingRight: isMobile ? 8 : 16,
      paddingLeft: showLeftBorder ? (isMobile ? 14 : 24) : 0,
      borderLeft: showLeftBorder ? '1px solid rgba(245,243,238,0.15)' : 'none',
      minWidth: 0,
    }}>
      <div style={{
        color: 'rgba(245,243,238,0.65)',
        textTransform: 'uppercase', letterSpacing: '0.14em',
        fontSize: 10, marginBottom: 8,
      }}>
        {label}
      </div>
      {timeCell ? (
        <span style={{ color: COLORS.fg }}><LocalTime tz="Australia/Sydney" /></span>
      ) : (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: COLORS.fg, textDecoration: 'none',
            wordBreak: 'break-all',
          }}
        >
          {handle} <span aria-hidden="true" style={{ color: 'rgba(245,243,238,0.65)' }}>↗</span>
        </a>
      )}
    </div>
  );
}

export default ContactMain;
