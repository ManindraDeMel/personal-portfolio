import React from 'react';
import PORTFOLIO from '../data/portfolio';
import { ED_DISPLAY, ED_MONO, COLORS } from '../styles/editorial';
import { useIsMobile } from '../hooks/useMediaQuery';

const RESUME_PATH = '/assets/ManindradeMelResume.pdf';

function ContactMain() {
  const isMobile = useIsMobile();
  return (
    <section
      id="contact"
      style={{
        padding: isMobile ? '72px 18px 56px' : '120px 40px 90px',
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
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

      <a
        href={`mailto:${PORTFOLIO.email}`}
        style={{
          display: 'inline-block',
          marginTop: isMobile ? 36 : 56,
          fontFamily: ED_DISPLAY, fontWeight: 500,
          fontSize: 'clamp(18px, 5.2vw, 32px)',
          letterSpacing: '-0.02em', color: COLORS.fg,
          textDecoration: 'none',
          borderBottom: '1px solid rgba(245,243,238,0.4)',
          paddingBottom: 8,
          wordBreak: 'break-all',
        }}
      >
        {PORTFOLIO.email} →
      </a>

      <div style={{
        marginTop: isMobile ? 32 : 40,
        display: 'flex', gap: 28, flexWrap: 'wrap',
        fontFamily: ED_MONO, fontSize: 11,
        letterSpacing: '0.14em', textTransform: 'uppercase',
      }}>
        <ContactLink href={PORTFOLIO.socials.github} label="GitHub ↗" newTab />
        <ContactLink href={PORTFOLIO.socials.linkedin} label="LinkedIn ↗" newTab />
        <ContactLink href={RESUME_PATH} label="Résumé (PDF) ↓" download />
      </div>
    </section>
  );
}

function ContactLink({ href, label, newTab, download }) {
  return (
    <a
      href={href}
      {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...(download ? { download: true } : {})}
      style={{ color: COLORS.fgMuted, textDecoration: 'none', transition: 'color 0.2s' }}
      onMouseEnter={(e) => { e.currentTarget.style.color = COLORS.fg; }}
      onMouseLeave={(e) => { e.currentTarget.style.color = COLORS.fgMuted; }}
    >
      {label}
    </a>
  );
}

export default ContactMain;
