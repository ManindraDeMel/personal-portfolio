import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ED_MONO, COLORS } from '../styles/editorial';
import { useIsMobile, useIsWideDesktop } from '../hooks/useMediaQuery';

// Each link is either a section on the home page (kind: 'section') or a
// dedicated route (kind: 'route').
const LINKS = [
  { label: 'Index',    kind: 'section', target: 'top' },
  { label: 'Journey',  kind: 'section', target: 'journey' },
  { label: 'Work',     kind: 'route',   target: '/work' },
  { label: 'Research', kind: 'route',   target: '/research' },
  { label: 'Resume',   kind: 'section', target: 'resume' },
  { label: 'Words',    kind: 'section', target: 'words' },
  { label: 'Contact',  kind: 'section', target: 'contact' },
];

function smoothScrollTo(id) {
  if (id === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const Navbar = () => {
  const [active, setActive] = useState('Index');
  const isMobile = useIsMobile();
  const isWide = useIsWideDesktop();
  const showSides = !isMobile && isWide;
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    if (!isHome) {
      if (location.pathname.startsWith('/research')) setActive('Research');
      else if (location.pathname.startsWith('/work')) setActive('Work');
      else setActive('');
      return undefined;
    }
    const onScroll = () => {
      const y = window.scrollY + 120;
      let current = 'Index';
      for (const l of LINKS) {
        if (l.kind !== 'section') continue;
        if (l.target === 'top') continue;
        const el = document.getElementById(l.target);
        if (el && el.offsetTop <= y) current = l.label;
      }
      setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome, location.pathname]);

  const onLinkClick = (link) => (e) => {
    e.preventDefault();
    if (link.kind === 'route') {
      navigate(link.target);
      return;
    }
    if (isHome) {
      smoothScrollTo(link.target);
    } else {
      navigate(link.target === 'top' ? '/' : `/#${link.target}`);
    }
  };

  return (
    <nav
      aria-label="Section navigation"
      style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'grid',
        gridTemplateColumns: showSides ? '1fr auto 1fr' : '1fr',
        alignItems: 'center',
        padding: isMobile ? '12px 16px' : '20px 40px',
        borderBottom: `1px solid ${COLORS.border}`,
        background: 'rgba(10,10,10,0.72)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        fontFamily: ED_MONO, fontSize: 11,
        letterSpacing: '0.14em', textTransform: 'uppercase',
      }}
    >
      {showSides && (
        <div style={{ display: 'flex', gap: 28, color: COLORS.fgMuted, minWidth: 0 }}>
          <Link to="/" style={{ color: COLORS.fg, textDecoration: 'none' }}>Manindra de Mel</Link>
          <span aria-hidden="true">—</span>
          <span>Portfolio / Vol. 02</span>
        </div>
      )}
      <ul
        style={{
          display: 'flex',
          gap: isMobile ? 14 : 28,
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          justifyContent: 'center',
          listStyle: 'none', padding: 0, margin: 0,
        }}
      >
        {LINKS.map((l, i) => {
          const isActive = active === l.label;
          const href = l.kind === 'route' ? l.target : (l.target === 'top' ? '/' : `/#${l.target}`);
          return (
            <li key={l.label}>
              <a
                href={href}
                onClick={onLinkClick(l)}
                aria-current={isActive ? 'true' : undefined}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  padding: 0, font: 'inherit', letterSpacing: 'inherit',
                  textTransform: 'inherit',
                  color: isActive ? COLORS.fg : COLORS.fgMuted,
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
              >
                {!isMobile && (
                  <span aria-hidden="true" style={{ opacity: 0.7, marginRight: 6 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                )}
                {l.label}
              </a>
            </li>
          );
        })}
      </ul>
      {showSides && (
        <div style={{ textAlign: 'right', color: COLORS.fgMuted }}>
          Canberra, ACT · 35.28°S
        </div>
      )}
    </nav>
  );
};

export default Navbar;
