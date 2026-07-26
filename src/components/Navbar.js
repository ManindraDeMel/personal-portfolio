import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ED_MONO, COLORS } from '../styles/editorial';
import { useIsMobile } from '../hooks/useMediaQuery';

// Each link is either a section on the home page (kind: 'section') or a
// dedicated route (kind: 'route').
const LINKS = [
  { label: 'Work',     kind: 'route',   target: '/work' },
  { label: 'Research', kind: 'route',   target: '/research' },
  { label: 'Notes',    kind: 'section', target: 'notes' },
  { label: 'Contact',  kind: 'section', target: 'contact' },
];

function smoothScrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const Navbar = () => {
  const [active, setActive] = useState('');
  const isMobile = useIsMobile();
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
      let current = '';
      for (const l of LINKS) {
        if (l.kind !== 'section') continue;
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
      navigate(`/#${link.target}`);
    }
  };

  return (
    <nav
      aria-label="Section navigation"
      style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: isMobile ? 14 : 24,
        flexWrap: 'wrap',
        padding: isMobile ? '14px 18px' : '20px 40px',
        borderBottom: `1px solid ${COLORS.border}`,
        background: 'rgba(10,10,10,0.72)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        fontFamily: ED_MONO, fontSize: 11,
        letterSpacing: '0.14em', textTransform: 'uppercase',
      }}
    >
      <Link to="/" style={{ color: COLORS.fg, textDecoration: 'none' }}>
        Manindra de Mel
      </Link>
      <ul
        style={{
          display: 'flex',
          gap: isMobile ? 16 : 28,
          flexWrap: 'wrap',
          listStyle: 'none', padding: 0, margin: 0,
        }}
      >
        {LINKS.map((l) => {
          const isActive = active === l.label;
          const href = l.kind === 'route' ? l.target : `/#${l.target}`;
          return (
            <li key={l.label}>
              <a
                href={href}
                onClick={onLinkClick(l)}
                aria-current={isActive ? 'true' : undefined}
                style={{
                  color: isActive ? COLORS.fg : COLORS.fgMuted,
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
              >
                {l.label}
              </a>
            </li>
          );
        })}
      </ul>
      {!isMobile && (
        <span style={{ color: COLORS.fgMuted }}>Canberra, AU</span>
      )}
    </nav>
  );
};

export default Navbar;
