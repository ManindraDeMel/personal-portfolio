import React, { useEffect, useState } from 'react';
import SectionHeader from './SectionHeader';
import Featured from './Featured';
import PORTFOLIO from '../data/portfolio';
import fetchSpotlight from '../service/fetchSpotlight';
import { ED_DISPLAY, ED_MONO, COLORS } from '../styles/editorial';
import { useIsMobile } from '../hooks/useMediaQuery';

function mapRepo(repo) {
  return {
    id: repo.id,
    name: repo.name,
    year: String(new Date(repo.updated_at).getFullYear()),
    lang: repo.language || '—',
    stars: typeof repo.stargazers_count === 'number' ? repo.stargazers_count : null,
    desc: repo.description || '',
    url: repo.html_url,
    private: !!repo.private,
  };
}

function Projects() {
  const [repos, setRepos] = useState([]);
  const [spotlight, setSpotlight] = useState(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchSpotlight().then(setSpotlight);
  }, []);

  useEffect(() => {
    const token = process.env.REACT_APP_GITHUB_TOKEN;
    if (!token) {
      console.warn('REACT_APP_GITHUB_TOKEN not set; skipping repo fetch.');
      return;
    }
    fetch('https://api.github.com/user/repos?per_page=100&page=1', {
      headers: { Authorization: `token ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error(`GitHub responded ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          console.error('Expected an array from GitHub, got:', data);
          return;
        }
        const mapped = data
          .filter((repo) => !repo.private)
          .map(mapRepo)
          .sort((a, b) => Number(b.year) - Number(a.year));
        setRepos(mapped);
      })
      .catch((err) => console.error('Failed to fetch repos:', err));
  }, []);

  const spotlightName = spotlight?.name?.toLowerCase();
  const filteredRepos = spotlightName
    ? repos.filter((r) => r.name.toLowerCase() !== spotlightName)
    : repos;
  const limit = isMobile ? 5 : 10;
  const tableRepos = filteredRepos.slice(0, limit);
  const hiddenCount = Math.max(0, filteredRepos.length - tableRepos.length);

  return (
    <section
      id="work"
      style={{
        padding: isMobile ? '56px 18px' : '90px 40px',
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      <SectionHeader number="03" title="Selected Work" sub="A curated index. Full archive on GitHub." />

      {spotlight && <Featured p={spotlight} />}

      <div style={{
        marginTop: isMobile ? 32 : 48,
        borderTop: `1px solid ${COLORS.borderStrong}`,
      }}>
        {!isMobile && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '60px 2.4fr 1fr 1fr 80px 4fr',
            gap: 24, padding: '12px 0',
            borderBottom: `1px solid ${COLORS.borderStrong}`,
            fontFamily: ED_MONO, fontSize: 10,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: COLORS.fgMuted,
          }}>
            <span>№</span>
            <span>Project</span>
            <span>Year</span>
            <span>Stack</span>
            <span style={{ textAlign: 'right' }}>★</span>
            <span>Description</span>
          </div>
        )}

        {tableRepos.map((p, i) => (
          <ProjectRow key={p.id} p={p} i={i} isMobile={isMobile} />
        ))}

        {tableRepos.length === 0 && (
          <div style={{
            padding: '32px 0', fontFamily: ED_MONO, fontSize: 12,
            color: COLORS.fgMuted, letterSpacing: '0.08em',
          }}>
            No repositories loaded yet. Check that REACT_APP_GITHUB_TOKEN is set.
          </div>
        )}
      </div>

      <a
        href={PORTFOLIO.socials.github}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 12,
          marginTop: isMobile ? 32 : 40,
          padding: '12px 20px',
          border: '1px solid rgba(245,243,238,0.3)',
          color: COLORS.fg, textDecoration: 'none',
          fontFamily: ED_MONO, fontSize: 11,
          letterSpacing: '0.16em', textTransform: 'uppercase',
        }}
      >
        {hiddenCount > 0 ? `See full archive · +${hiddenCount} more` : 'See full archive'}{' '}
        <span style={{ fontSize: 14 }}>→</span>
      </a>
    </section>
  );
}

function ProjectRow({ p, i, isMobile }) {
  if (isMobile) {
    return (
      <a
        href={p.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'block',
          padding: '18px 0',
          borderBottom: `1px solid ${COLORS.border}`,
          color: COLORS.fg, textDecoration: 'none',
        }}
      >
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          gap: 12, marginBottom: 8,
        }}>
          <span style={{
            fontFamily: ED_DISPLAY, fontSize: 22, lineHeight: 1.1,
            fontWeight: 500, letterSpacing: '-0.02em',
            textTransform: 'lowercase',
            wordBreak: 'break-word',
            flex: 1,
          }}>
            {p.name}
          </span>
          <span style={{ fontFamily: ED_MONO, fontSize: 11, color: COLORS.fgFaint }}>
            {String(i + 1).padStart(2, '0')}
          </span>
        </div>
        {p.desc && (
          <p style={{
            margin: '0 0 10px', fontSize: 13.5, lineHeight: 1.55, color: COLORS.fgDim,
          }}>
            {p.desc}
          </p>
        )}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 14,
          fontFamily: ED_MONO, fontSize: 11,
          letterSpacing: '0.06em',
          color: 'rgba(245,243,238,0.55)',
        }}>
          <span>{p.year}</span>
          <span style={{ textTransform: 'uppercase' }}>{p.lang}</span>
          <span>{p.stars != null ? `★ ${p.stars}` : '—'}</span>
        </div>
      </a>
    );
  }

  return (
    <a
      href={p.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'grid',
        gridTemplateColumns: '60px 2.4fr 1fr 1fr 80px 4fr',
        gap: 24, padding: '20px 0',
        borderBottom: `1px solid ${COLORS.border}`,
        color: COLORS.fg, textDecoration: 'none',
        transition: 'background 0.2s, padding 0.3s',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.paddingLeft = '16px';
        e.currentTarget.style.background = 'rgba(245,243,238,0.03)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.paddingLeft = '0px';
        e.currentTarget.style.background = 'transparent';
      }}
    >
      <span style={{ fontFamily: ED_MONO, fontSize: 12, color: COLORS.fgFaint }}>
        {String(i + 1).padStart(2, '0')}
      </span>
      <span style={{
        fontFamily: ED_DISPLAY, fontSize: 22, lineHeight: 1.1,
        fontWeight: 500, letterSpacing: '-0.02em',
        textTransform: 'lowercase',
      }}>
        {p.name}
      </span>
      <span style={{
        fontFamily: ED_MONO, fontSize: 12,
        color: 'rgba(245,243,238,0.65)', letterSpacing: '0.06em',
      }}>
        {p.year}
      </span>
      <span style={{
        fontFamily: ED_MONO, fontSize: 11,
        color: 'rgba(245,243,238,0.65)', letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}>
        {p.lang}
      </span>
      <span style={{
        fontFamily: ED_MONO, fontSize: 12,
        color: 'rgba(245,243,238,0.45)', textAlign: 'right',
      }}>
        {p.stars != null ? `★ ${p.stars}` : '—'}
      </span>
      <span style={{ fontSize: 14, lineHeight: 1.55, color: COLORS.fgDim }}>
        {p.desc}
      </span>
    </a>
  );
}

export default Projects;
