import React from 'react';
import { ED_MONO } from '../styles/editorial';

function ProseBlock({ label, body }) {
  return (
    <div>
      <div style={{
        fontFamily: ED_MONO, fontSize: 10, letterSpacing: '0.16em',
        textTransform: 'uppercase', color: 'rgba(245,243,238,0.55)',
        paddingBottom: 12, marginBottom: 16,
        borderBottom: '1px solid rgba(245,243,238,0.18)',
      }}>
        {label}
      </div>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: 'rgba(245,243,238,0.82)' }}>
        {body}
      </p>
    </div>
  );
}

export default ProseBlock;
