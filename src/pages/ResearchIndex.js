import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SectionHeader from '../components/SectionHeader';
import FadeUp from '../components/FadeUp';
import fetchSpotlight from '../service/fetchSpotlight';
import fetchResearch from '../service/fetchResearch';
import { ED_DISPLAY, ED_MONO, COLORS } from '../styles/editorial';
import { useIsMobile, useIsTablet } from '../hooks/useMediaQuery';

const FEATURED_SLUG = 'plantclef-2026';

function ResearchIndex() {
  const [items, setItems] = useState([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    Promise.all([fetchSpotlight(), fetchResearch()]).then(([spots, research]) => {
      const lead = spots.find((s) => s.slug === FEATURED_SLUG);
      const leadCard = lead
        ? {
            slug: lead.slug,
            name: lead.name,
            year: lead.year,
            status: lead.featured?.status,
            role: lead.featured?.role,
            collaborators: lead.featured?.collaborators,
            blurb: lead.desc,
          }
        : null;
      const restCards = research
        .filter((r) => r.slug !== FEATURED_SLUG)
        .map((r) => ({
          slug: r.slug,
          name: r.name,
          year: r.year,
          status: r.status,
          role: r.role,
          collaborators: r.collaborators,
          blurb: r.blurb,
        }));
      setItems(leadCard ? [leadCard, ...restCards] : restCards);
    });
  }, []);

  return (
    <section style={{
      padding: isMobile ? '32px 18px 80px' : '60px 40px 120px',
    }}>
      <Helmet>
        <title>Research — Manindra de Mel</title>
        <meta name="description" content="Research projects across machine learning, computer vision, and applied ML." />
      </Helmet>

      <FadeUp>
        <SectionHeader number="04" title="Research" sub="ML in academia and the wild." />
      </FadeUp>

      <div style={{
        marginTop: isMobile ? 32 : 56,
        display: 'flex', flexDirection: 'column',
        gap: isMobile ? 18 : 24,
      }}>
        {items.map((p, i) => (
          <FadeUp key={p.slug} delay={i * 60}>
            <IndexCard p={p} i={i} />
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

function IndexCard({ p, i }) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  return (
    <Link
      to={`/research/${p.slug}`}
      style={{
        display: 'block',
        border: '1px solid rgba(245,243,238,0.18)',
        background: i % 2 === 0 ? 'rgba(245,243,238,0.025)' : 'transparent',
        textDecoration: 'none', color: 'inherit',
        transition: 'transform 0.3s ease, border-color 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.borderColor = 'rgba(245,243,238,0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(245,243,238,0.18)';
      }}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr',
        borderBottom: `1px solid ${COLORS.border}`,
        fontFamily: ED_MONO, fontSize: 10, letterSpacing: '0.16em',
        textTransform: 'uppercase', color: 'rgba(245,243,238,0.55)',
      }}>
        <div style={{ padding: isMobile ? '12px 14px' : '14px 20px' }}>
          ¶ {String(i + 1).padStart(2, '0')}
        </div>
        <div style={{
          padding: isMobile ? '12px 14px' : '14px 20px',
          borderLeft: `1px solid ${COLORS.border}`,
        }}>
          {p.status || '—'}
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
          {(p.role || '').toUpperCase()}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isTablet ? '1fr' : '1.4fr 1fr',
        padding: isMobile ? '24px 16px' : '32px 30px',
        gap: isTablet ? 20 : 32,
      }}>
        <div>
          <h2 style={{
            fontFamily: ED_DISPLAY, fontWeight: 500,
            fontSize: 'clamp(26px, 5.5vw, 44px)', lineHeight: 0.95,
            margin: 0, letterSpacing: '-0.035em',
            textTransform: 'uppercase', color: COLORS.fg,
            wordBreak: 'break-word',
          }}>
            {p.name}
          </h2>
          {p.blurb && (
            <p style={{
              margin: '16px 0 0',
              fontSize: isMobile ? 14.5 : 15.5,
              lineHeight: 1.55,
              color: 'rgba(245,243,238,0.82)',
              letterSpacing: '-0.005em',
              maxWidth: 640,
            }}>
              {p.blurb}
            </p>
          )}
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: isTablet ? 'flex-start' : 'flex-end',
          fontFamily: ED_MONO, fontSize: 11,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: COLORS.fg,
        }}>
          {p.collaborators && (
            <div style={{ color: 'rgba(245,243,238,0.55)', letterSpacing: '0.08em' }}>
              With: <span style={{ color: COLORS.fg }}>{p.collaborators}</span>
            </div>
          )}
          <div style={{ marginTop: isTablet ? 14 : 0 }}>
            → Read case study
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ResearchIndex;
