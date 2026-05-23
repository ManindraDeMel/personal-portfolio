import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from './SectionHeader';
import SpotlightCard from './SpotlightCard';
import fetchSpotlight from '../service/fetchSpotlight';
import { ED_MONO, COLORS } from '../styles/editorial';
import { useIsMobile } from '../hooks/useMediaQuery';

const FEATURED_SLUG = 'plantclef-2026';

function ResearchTeaser() {
  const [lead, setLead] = useState(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchSpotlight().then((items) => {
      const item = items.find((s) => s.slug === FEATURED_SLUG) || items[0];
      setLead(item || null);
    });
  }, []);

  return (
    <section
      id="research"
      style={{
        padding: isMobile ? '56px 18px' : '90px 40px',
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      <SectionHeader
        number="04"
        title="Research"
        sub="ML in academia and the wild."
      />

      {lead && (
        <div style={{ marginTop: isMobile ? 32 : 48 }}>
          <SpotlightCard p={lead} to={`/research/${lead.slug}`} />
        </div>
      )}

      <Link
        to="/research"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          marginTop: isMobile ? 28 : 36,
          fontFamily: ED_MONO, fontSize: 11,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: COLORS.fg, textDecoration: 'none',
          borderBottom: `1px solid ${COLORS.fg}`,
          paddingBottom: 4,
        }}
      >
        ↗ All research
      </Link>
    </section>
  );
}

export default ResearchTeaser;
