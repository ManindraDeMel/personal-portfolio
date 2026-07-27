import React from 'react';
import { Helmet } from 'react-helmet-async';
import SectionHeader from '../components/SectionHeader';
import FadeUp from '../components/FadeUp';
import PORTFOLIO from '../data/portfolio';
import { ED_DISPLAY, ED_MONO, COLORS } from '../styles/editorial';
import { useIsMobile } from '../hooks/useMediaQuery';

// Live embeds of shipped websites. Entries come from PORTFOLIO.sites;
// sites that refuse to iframe (X-Frame-Options / frame-ancestors) are
// flagged embed: false and render as a link card instead.
function SitesIndex() {
  const isMobile = useIsMobile();

  return (
    <section style={{
      padding: isMobile ? '32px 18px 80px' : '60px 40px 120px',
    }}>
      <Helmet>
        <title>Sites — Manindra de Mel</title>
        <meta name="description" content="Live websites designed, built, and shipped: products, e-commerce, and client platforms." />
      </Helmet>

      <FadeUp>
        <SectionHeader
          title="Sites"
          sub="Live, in production. Browse them right here."
        />
      </FadeUp>

      <div style={{
        marginTop: isMobile ? 32 : 56,
        display: 'flex', flexDirection: 'column',
        gap: isMobile ? 28 : 40,
      }}>
        {PORTFOLIO.sites.map((s, i) => (
          <FadeUp key={s.url} delay={i * 60}>
            <SiteCard s={s} isMobile={isMobile} />
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

function SiteCard({ s, isMobile }) {
  const host = s.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  return (
    <article style={{
      border: '1px solid rgba(245,243,238,0.18)',
      background: 'rgba(245,243,238,0.025)',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr auto' : '1fr 1fr 1fr auto',
        borderBottom: `1px solid ${COLORS.border}`,
        fontFamily: ED_MONO, fontSize: 10,
        letterSpacing: '0.16em', textTransform: 'uppercase',
        color: 'rgba(245,243,238,0.55)',
      }}>
        <div style={{ padding: isMobile ? '12px 14px' : '13px 20px', color: COLORS.fg }}>
          {s.name}
        </div>
        {!isMobile && (
          <>
            <div style={{ padding: '13px 20px', borderLeft: `1px solid ${COLORS.border}` }}>
              {s.role}
            </div>
            <div style={{ padding: '13px 20px', borderLeft: `1px solid ${COLORS.border}` }}>
              {s.year}
            </div>
          </>
        )}
        <a
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: isMobile ? '12px 14px' : '13px 20px',
            borderLeft: `1px solid ${COLORS.border}`,
            color: COLORS.fg, textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {host} ↗
        </a>
      </div>

      {s.desc && (
        <p style={{
          margin: 0,
          padding: isMobile ? '16px 14px' : '18px 20px',
          borderBottom: s.embed ? `1px solid ${COLORS.border}` : 'none',
          fontSize: 14, lineHeight: 1.55,
          color: COLORS.fgDim, letterSpacing: '-0.005em',
          maxWidth: '58em',
        }}>
          {s.desc}
        </p>
      )}

      {s.embed ? (
        <iframe
          src={s.url}
          title={`${s.name} — live site`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          style={{
            display: 'block',
            width: '100%',
            height: isMobile ? 480 : 640,
            border: 'none',
            background: '#111',
          }}
        />
      ) : (
        <a
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 14,
            padding: isMobile ? '48px 14px' : '72px 20px',
            color: COLORS.fg, textDecoration: 'none',
            fontFamily: ED_DISPLAY, fontWeight: 500,
            fontSize: 'clamp(20px, 3.4vw, 34px)',
            letterSpacing: '-0.025em', textTransform: 'uppercase',
          }}
        >
          Visit {s.name} <span aria-hidden="true">↗</span>
        </a>
      )}
    </article>
  );
}

export default SitesIndex;
