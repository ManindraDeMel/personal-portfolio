import React, { useEffect, useState } from 'react';
import { ED_MONO, COLORS } from '../styles/editorial';
import { useIsMobile } from '../hooks/useMediaQuery';

const LINKS = [
  { label: 'Index',    href: 'top' },
  { label: 'Journey',  href: 'journey' },
  { label: 'Work',     href: 'work' },
  { label: 'Research', href: 'research' },
  { label: 'Resume',   href: 'resume' },
  { label: 'Words',    href: 'words' },
  { label: 'Contact',  href: 'contact' },
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

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + 120;
      let current = 'Index';
      for (const l of LINKS) {
        if (l.href === 'top') continue;
        const el = document.getElementById(l.href);
        if (el && el.offsetTop <= y) current = l.label;
      }
      setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr auto 1fr',
      alignItems: 'center',
      padding: isMobile ? '12px 16px' : '20px 40px',
      borderBottom: `1px solid ${COLORS.border}`,
      background: 'rgba(10,10,10,0.72)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      fontFamily: ED_MONO, fontSize: 11,
      letterSpacing: '0.14em', textTransform: 'uppercase',
    }}>
      {!isMobile && (
        <div style={{ display: 'flex', gap: 28, color: COLORS.fgMuted }}>
          <span style={{ color: COLORS.fg }}>Manindra de Mel</span>
          <span>—</span>
          <span>Portfolio / Vol. 02</span>
        </div>
      )}
      <div style={{
        display: 'flex',
        gap: isMobile ? 14 : 28,
        flexWrap: isMobile ? 'wrap' : 'nowrap',
        justifyContent: 'center',
      }}>
        {LINKS.map((l, i) => (
          <button
            key={l.label}
            onClick={() => smoothScrollTo(l.href)}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              padding: 0, font: 'inherit', letterSpacing: 'inherit',
              textTransform: 'inherit',
              color: active === l.label ? COLORS.fg : COLORS.fgMuted,
              transition: 'color 0.2s',
            }}
          >
            {!isMobile && (
              <span style={{ opacity: 0.4, marginRight: 6 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
            )}
            {l.label}
          </button>
        ))}
      </div>
      {!isMobile && (
        <div style={{ textAlign: 'right', color: COLORS.fgMuted }}>
          Canberra, ACT · 35.28°S
        </div>
      )}
    </nav>
  );
};

export default Navbar;
