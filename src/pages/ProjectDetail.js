import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DataRow from '../components/DataRow';
import ProseBlock from '../components/ProseBlock';
import { HerbariumPanel, EmbeddingPanel, PipelinePanel } from '../components/SpotlightVisuals';
import FadeUp from '../components/FadeUp';
import fetchProjectBySlug from '../service/fetchProject';
import { ED_DISPLAY, ED_MONO, COLORS } from '../styles/editorial';
import { useIsMobile, useIsTablet } from '../hooks/useMediaQuery';

function ProjectDetail({ context }) {
  const { slug } = useParams();
  const [p, setP] = useState(undefined);
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  useEffect(() => {
    let active = true;
    setP(undefined);
    fetchProjectBySlug(slug).then((data) => {
      if (active) setP(data);
    });
    return () => { active = false; };
  }, [slug]);

  const indexHref = context === 'research' ? '/research' : '/work';
  const indexLabel = context === 'research' ? 'research' : 'selected work';

  if (p === undefined) {
    return <PageFrame><div style={{ padding: '120px 24px', fontFamily: ED_MONO, color: COLORS.fgMuted }}>Loading…</div></PageFrame>;
  }
  if (p === null) {
    return (
      <PageFrame>
        <Helmet><title>{`Not found — Manindra de Mel`}</title></Helmet>
        <div style={{ padding: isMobile ? '64px 18px' : '120px 40px' }}>
          <h1 style={{
            fontFamily: ED_DISPLAY, fontWeight: 500,
            fontSize: 'clamp(36px, 8vw, 80px)', lineHeight: 0.95,
            margin: 0, letterSpacing: '-0.04em', textTransform: 'uppercase',
          }}>
            Not found
          </h1>
          <p style={{
            marginTop: 24, color: COLORS.fgDim,
            fontSize: 16, lineHeight: 1.55,
          }}>
            No project with the slug "{slug}". It may have been moved or hasn't been written up yet.
          </p>
          <Link to={indexHref} style={backLinkStyle}>← Back to {indexLabel}</Link>
        </div>
      </PageFrame>
    );
  }

  const hasCase = p.problem || p.approach || p.outcome;
  const links = [
    p.liveUrl && p.liveUrl !== p.url ? { href: p.liveUrl, label: '→ Live demo' } : null,
    p.paperUrl ? { href: p.paperUrl, label: '↗ Paper' } : null,
    p.repoUrl ? { href: p.repoUrl, label: '↗ Repo' } : null,
    p.url ? { href: p.url, label: /github\.com/i.test(p.url) ? '↗ Repo' : '↗ Project site' } : null,
  ].filter(Boolean);
  const seenHrefs = new Set();
  const uniqueLinks = links.filter((l) => (seenHrefs.has(l.href) ? false : seenHrefs.add(l.href)));

  return (
    <PageFrame>
      <Helmet>
        <title>{`${p.name} — Manindra de Mel`}</title>
        <meta name="description" content={p.blurb || p.problem?.slice(0, 160) || `${p.name} case study.`} />
      </Helmet>

      <FadeUp>
        <header style={{
          padding: isMobile ? '32px 18px 24px' : '60px 40px 32px',
          borderBottom: `1px solid ${COLORS.border}`,
        }}>
          <Link to={indexHref} style={{ ...backLinkStyle, marginBottom: 24 }}>← Back to {indexLabel}</Link>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr',
            borderTop: `1px solid ${COLORS.border}`,
            borderBottom: `1px solid ${COLORS.border}`,
            marginTop: 28,
            fontFamily: ED_MONO, fontSize: 10, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: 'rgba(245,243,238,0.55)',
          }}>
            <Cell isMobile={isMobile}>★ {context === 'research' ? 'Research' : 'Project'}</Cell>
            <Cell isMobile={isMobile} left>{p.status}</Cell>
            <Cell isMobile={isMobile} left>{p.year}</Cell>
            <Cell isMobile={isMobile} left right strong>{p.lang || p.role?.toUpperCase()}</Cell>
          </div>

          <h1 style={{
            fontFamily: ED_DISPLAY, fontWeight: 500,
            fontSize: 'clamp(40px, 11vw, 110px)', lineHeight: 0.9,
            margin: '40px 0 0', letterSpacing: '-0.045em',
            textTransform: 'uppercase', color: COLORS.fg,
            wordBreak: 'break-word',
          }}>
            {p.name}
          </h1>

          {p.blurb && (
            <p style={{
              margin: '24px 0 0',
              maxWidth: 760,
              fontSize: isMobile ? 15.5 : 18,
              lineHeight: 1.5,
              color: 'rgba(245,243,238,0.82)',
              letterSpacing: '-0.005em',
            }}>
              {p.blurb}
            </p>
          )}
        </header>
      </FadeUp>

      <FadeUp>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isTablet ? '1fr' : '1fr 1fr 1fr 1fr',
          padding: isMobile ? '24px 18px' : '40px 40px',
          gap: isMobile ? 20 : 32,
          borderBottom: `1px solid ${COLORS.border}`,
          fontFamily: ED_MONO, fontSize: 12, lineHeight: 1.9,
        }}>
          <DataRow k="Role" v={p.role} />
          <DataRow k="With" v={p.collaborators} />
          <DataRow k="Year" v={p.year} />
          <DataRow k="Status" v={p.status} />
        </div>
      </FadeUp>

      {p.visuals === 'herbarium' && (
        <FadeUp>
          {!isMobile ? (
            <>
              <div style={{
                display: 'grid', gridTemplateColumns: '1.4fr 1fr',
                borderBottom: `1px solid ${COLORS.border}`,
              }}>
                <HerbariumPanel aspect="16 / 10" />
                <EmbeddingPanel aspect="5 / 4" borderRight={false} />
              </div>
              <div style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <PipelinePanel aspect="16 / 4" borderRight={false} />
              </div>
            </>
          ) : (
            <>
              <div style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <HerbariumPanel aspect="16 / 9" borderRight={false} />
              </div>
              <div style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <PipelinePanel aspect="16 / 6" borderRight={false} />
              </div>
            </>
          )}
        </FadeUp>
      )}

      {hasCase && (
        <FadeUp>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isTablet ? '1fr' : '1fr 1fr 1fr',
            padding: isMobile ? '32px 18px' : '60px 40px',
            gap: isMobile ? 28 : 40,
            borderBottom: `1px solid ${COLORS.border}`,
          }}>
            <ProseBlock label="¶ Problem" body={p.problem} />
            <ProseBlock label="¶ Approach" body={p.approach} />
            <ProseBlock label="¶ Outcome" body={p.outcome} />
          </div>
        </FadeUp>
      )}

      <FadeUp>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: isMobile ? 16 : 0,
          padding: isMobile ? '24px 18px' : '32px 40px',
          fontFamily: ED_MONO, fontSize: 11,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: 'rgba(245,243,238,0.65)',
          borderBottom: `1px solid ${COLORS.border}`,
        }}>
          <span style={{ wordBreak: 'break-word' }}>
            {isMobile ? `Stack · ${p.stack.length} tools` : `Full stack — ${p.stack.join(' · ')}`}
          </span>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {uniqueLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: COLORS.fg, textDecoration: 'none' }}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </FadeUp>

      <FadeUp>
        <div style={{
          padding: isMobile ? '40px 18px 80px' : '80px 40px 120px',
          textAlign: 'center',
        }}>
          <Link to={indexHref} style={backLinkStyle}>← Back to {indexLabel}</Link>
        </div>
      </FadeUp>
    </PageFrame>
  );
}

const backLinkStyle = {
  display: 'inline-flex', alignItems: 'center', gap: 10,
  fontFamily: ED_MONO, fontSize: 11,
  letterSpacing: '0.16em', textTransform: 'uppercase',
  color: COLORS.fgDim, textDecoration: 'none',
  borderBottom: `1px solid ${COLORS.border}`,
  paddingBottom: 4,
};

function Cell({ children, isMobile, left, right, strong }) {
  return (
    <div style={{
      padding: isMobile ? '12px 14px' : '14px 20px',
      borderLeft: left && !isMobile ? `1px solid ${COLORS.border}` : 'none',
      borderTop: isMobile && (left || right) ? `1px solid ${COLORS.border}` : 'none',
      textAlign: right ? 'right' : 'left',
      color: strong ? COLORS.fg : 'inherit',
    }}>
      {children}
    </div>
  );
}

function PageFrame({ children }) {
  return (
    <section style={{ minHeight: '60vh' }}>{children}</section>
  );
}

export default ProjectDetail;
