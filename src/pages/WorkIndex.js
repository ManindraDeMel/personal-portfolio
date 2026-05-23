import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SectionHeader from '../components/SectionHeader';
import SpotlightCard from '../components/SpotlightCard';
import FadeUp from '../components/FadeUp';
import fetchSpotlight from '../service/fetchSpotlight';
import { ED_MONO, COLORS } from '../styles/editorial';
import { useIsMobile } from '../hooks/useMediaQuery';

function WorkIndex() {
  const [items, setItems] = useState([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchSpotlight().then(setItems);
  }, []);

  return (
    <section style={{
      padding: isMobile ? '32px 18px 80px' : '60px 40px 120px',
    }}>
      <Helmet>
        <title>Selected Work — Manindra de Mel</title>
        <meta name="description" content="Featured projects across product, research, and infrastructure." />
      </Helmet>

      <FadeUp>
        <SectionHeader
          number="03"
          title="Selected Work"
          sub="Featured projects with full case studies."
        />
      </FadeUp>

      <div style={{
        marginTop: isMobile ? 32 : 56,
        display: 'flex', flexDirection: 'column',
        gap: isMobile ? 20 : 28,
      }}>
        {items.map((p, i) => (
          <FadeUp key={p.slug || i} delay={i * 60}>
            <SpotlightCard p={p} to={`/work/${p.slug}`} />
          </FadeUp>
        ))}
        {items.length === 0 && (
          <div style={{
            padding: '32px 0',
            fontFamily: ED_MONO, fontSize: 12,
            color: COLORS.fgMuted, letterSpacing: '0.08em',
          }}>
            Loading featured work…
          </div>
        )}
      </div>

      <div style={{
        marginTop: isMobile ? 40 : 60,
        paddingTop: 24,
        borderTop: `1px solid ${COLORS.borderStrong}`,
      }}>
        <Link
          to="/#work"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            fontFamily: ED_MONO, fontSize: 11,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: COLORS.fgDim, textDecoration: 'none',
            borderBottom: `1px solid ${COLORS.border}`,
            paddingBottom: 4,
          }}
        >
          ← Back to home archive
        </Link>
      </div>
    </section>
  );
}

export default WorkIndex;
