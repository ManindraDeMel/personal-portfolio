import React from 'react';
import { Link } from 'react-router-dom';
import { ED_DISPLAY, ED_MONO, COLORS } from '../styles/editorial';
import { useIsMobile, useIsTablet } from '../hooks/useMediaQuery';

// Compact teaser card for the home page. Reuses the spotlight/research data
// shape: { name, desc | blurb, year, status, role, collaborators, stack }.
function SpotlightCard({ p, to }) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  if (!p) return null;
  const status = p.status || p.featured?.status;
  const role = p.role || p.featured?.role;
  const collaborators = p.collaborators || p.featured?.collaborators;
  const stack = Array.isArray(p.stack) ? p.stack : p.featured?.stack || [];
  const blurb = p.blurb || p.desc;

  return (
    <Link
      to={to}
      style={{
        display: 'block',
        border: '1px solid rgba(245,243,238,0.18)',
        background: 'rgba(245,243,238,0.025)',
        color: 'inherit',
        textDecoration: 'none',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 14px 38px rgba(0,0,0,0.5)';
        e.currentTarget.style.borderColor = 'rgba(245,243,238,0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
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
        <div style={{ padding: isMobile ? '12px 14px' : '14px 20px' }}>★ Spotlight</div>
        <div style={{
          padding: isMobile ? '12px 14px' : '14px 20px',
          borderLeft: `1px solid ${COLORS.border}`,
        }}>
          {status || '—'}
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
          {p.lang || (role || '').toUpperCase()}
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isTablet ? '1fr' : '1.4fr 1fr',
      }}>
        <div style={{
          padding: isMobile ? '24px 16px' : '32px 30px',
          borderRight: isTablet ? 'none' : `1px solid ${COLORS.border}`,
          borderBottom: isTablet ? `1px solid ${COLORS.border}` : 'none',
        }}>
          <h3 style={{
            fontFamily: ED_DISPLAY, fontWeight: 500,
            fontSize: 'clamp(26px, 6vw, 48px)', lineHeight: 0.95,
            margin: 0, letterSpacing: '-0.035em',
            textTransform: 'uppercase', color: COLORS.fg,
            wordBreak: 'break-word',
          }}>
            {p.name}
          </h3>
          {blurb && (
            <p style={{
              margin: '16px 0 0', maxWidth: 640,
              fontSize: isMobile ? 14.5 : 15.5,
              lineHeight: 1.55,
              color: 'rgba(245,243,238,0.82)',
              letterSpacing: '-0.005em',
            }}>
              {blurb}
            </p>
          )}
        </div>
        {!isTablet && (
          <div style={{
            padding: '32px 30px',
            fontFamily: ED_MONO, fontSize: 12, lineHeight: 1.9,
            display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between', minHeight: 0,
          }}>
            <div>
              {role && <Row k="Role" v={role} />}
              {collaborators && <Row k="With" v={collaborators} />}
              {stack.length > 0 && <Row k="Stack" v={stack.slice(0, 3).join(' · ')} />}
            </div>
            <div style={{
              marginTop: 18,
              fontFamily: ED_MONO, fontSize: 11,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              color: COLORS.fg,
            }}>
              → Read case study
            </div>
          </div>
        )}
      </div>

      {isTablet && (
        <div style={{
          padding: '14px 20px',
          borderTop: `1px solid ${COLORS.border}`,
          fontFamily: ED_MONO, fontSize: 11,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color: COLORS.fg,
        }}>
          → Read case study
        </div>
      )}
    </Link>
  );
}

function Row({ k, v }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '90px 1fr',
      gap: 12, padding: '4px 0',
    }}>
      <span style={{ color: 'rgba(245,243,238,0.55)' }}>{k}</span>
      <span style={{ color: COLORS.fg }}>{v}</span>
    </div>
  );
}

export default SpotlightCard;
