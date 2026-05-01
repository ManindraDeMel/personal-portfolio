import React, { useEffect, useRef, useState } from 'react';
import { ED_DISPLAY, ED_MONO, COLORS } from '../styles/editorial';
import { useIsMobile } from '../hooks/useMediaQuery';
import TypeReveal from './TypeReveal';

function NumberScramble({ target, duration = 650, steps = 12 }) {
  const ref = useRef(null);
  const [val, setVal] = useState(target);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ref.current || typeof window === 'undefined' || !window.IntersectionObserver) {
      setStarted(true);
      return;
    }
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setStarted(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      i++;
      if (i >= steps) {
        setVal(target);
        return;
      }
      setVal(String(Math.floor(Math.random() * 100)).padStart(2, '0'));
      setTimeout(tick, duration / steps);
    };
    setVal(String(Math.floor(Math.random() * 100)).padStart(2, '0'));
    const t = setTimeout(tick, duration / steps);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [started, target, duration, steps]);

  return <span ref={ref}>{val}</span>;
}

function SectionHeader({ number, title, sub }) {
  const isMobile = useIsMobile();
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr 1fr',
      gap: isMobile ? 12 : 40,
      alignItems: 'baseline',
      borderTop: `1px solid ${COLORS.borderStrong}`,
      paddingTop: isMobile ? 18 : 24,
    }}>
      <div style={{
        fontFamily: ED_MONO, fontSize: 11, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: COLORS.fgMuted,
      }}>
        ¶ <NumberScramble target={number} />
      </div>
      <h2 style={{
        fontFamily: ED_DISPLAY, fontWeight: 500,
        fontSize: 'clamp(32px, 8vw, 64px)', lineHeight: 0.92,
        margin: 0, letterSpacing: '-0.035em', textTransform: 'uppercase',
      }}>
        {title}
      </h2>
      <div style={{
        fontFamily: ED_MONO, fontSize: 11, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: COLORS.fgMuted,
        textAlign: isMobile ? 'left' : 'right',
        minHeight: '1.4em',
      }}>
        <TypeReveal prefix="" tail={String(sub ?? '')} speed={16} startDelay={250} />
      </div>
    </div>
  );
}

export default SectionHeader;
