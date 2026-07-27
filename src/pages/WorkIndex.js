import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import SectionHeader from '../components/SectionHeader';
import SpotlightCard from '../components/SpotlightCard';
import RepoArchive from '../components/RepoArchive';
import Testimonials from '../components/Testimonials';
import FadeUp from '../components/FadeUp';
import fetchSpotlight from '../service/fetchSpotlight';
import { ED_MONO, COLORS } from '../styles/editorial';
import { useIsMobile } from '../hooks/useMediaQuery';

function WorkIndex() {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchSpotlight()
      .then((items) => setItems(items.filter((s) => s.category !== 'research')))
      .finally(() => setLoaded(true));
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
            {loaded ? 'No featured work published yet.' : 'Loading featured work…'}
          </div>
        )}
      </div>

      <div style={{ marginTop: isMobile ? 56 : 90 }}>
        <FadeUp>
          <RepoArchive excludeNames={items.map((s) => s?.name).filter(Boolean)} />
        </FadeUp>
      </div>

      <div style={{ marginTop: isMobile ? 24 : 40 }}>
        <FadeUp>
          <Testimonials />
        </FadeUp>
      </div>
    </section>
  );
}

export default WorkIndex;
