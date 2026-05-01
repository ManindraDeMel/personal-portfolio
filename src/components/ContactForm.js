import React, { useState } from 'react';
import { sendContactMessage, buildMailto } from '../service/sendMail';
import { ED_DISPLAY, ED_MONO, COLORS } from '../styles/editorial';
import PORTFOLIO from '../data/portfolio';
import { useIsMobile } from '../hooks/useMediaQuery';

const initial = { name: '', email: '', subject: '', message: '' };

function ContactForm() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState('idle');
  const [focused, setFocused] = useState('');
  const isMobile = useIsMobile();

  const ready = form.name && form.email && form.message;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!ready || status === 'sending') return;
    setStatus('sending');
    const ok = await sendContactMessage(form);
    if (ok) {
      setStatus('sent');
      setForm(initial);
    } else {
      setStatus('error');
      window.location.href = buildMailto(form);
    }
  };

  return (
    <div style={{
      marginTop: isMobile ? 48 : 72,
      paddingTop: isMobile ? 24 : 36,
      borderTop: `1px solid ${COLORS.borderStrong}`,
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 2.2fr',
        gap: isMobile ? 28 : 48,
      }}>
        <div>
          <div style={{
            fontFamily: ED_MONO, fontSize: 11, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: COLORS.fgMuted, marginBottom: 24,
          }}>
            ¶ Send a brief
          </div>
          <h3 style={{
            fontFamily: ED_DISPLAY, fontWeight: 500,
            fontSize: 'clamp(22px, 6vw, 40px)', lineHeight: 0.95,
            margin: 0, letterSpacing: '-0.035em', color: COLORS.fg,
            textTransform: 'uppercase',
          }}>
            Or fill out<br />the form.
          </h3>
          <p style={{
            fontFamily: ED_MONO, fontSize: 12, lineHeight: 1.7,
            color: 'rgba(245,243,238,0.6)',
            marginTop: isMobile ? 20 : 32,
            maxWidth: 280, letterSpacing: '0.02em',
          }}>
            Engineering work, research collaborations, or anything in between.
            Replies typically inside 48 hours.
          </p>
          {!isMobile && (
            <div style={{
              marginTop: 32,
              fontFamily: ED_MONO, fontSize: 10, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: 'rgba(245,243,238,0.6)',
            }}>
              <KvDashed k="Form ID" v="FRM·001" />
              <KvDashed k="Routing" v={`→ ${PORTFOLIO.email.split('@')[0]}@…`} last />
            </div>
          )}
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <Field
            name="name" label="01 — Name"
            value={form.name}
            focused={focused === 'name'}
            onFocus={() => setFocused('name')}
            onBlur={() => setFocused('')}
            onChange={(v) => setForm({ ...form, name: v })}
            placeholder="Your full name"
            isMobile={isMobile}
          />
          <Field
            name="email" label="02 — Email" type="email"
            value={form.email}
            focused={focused === 'email'}
            onFocus={() => setFocused('email')}
            onBlur={() => setFocused('')}
            onChange={(v) => setForm({ ...form, email: v })}
            placeholder="you@domain.com"
            isMobile={isMobile}
          />
          <Field
            name="subject" label="03 — Subject"
            value={form.subject}
            focused={focused === 'subject'}
            onFocus={() => setFocused('subject')}
            onBlur={() => setFocused('')}
            onChange={(v) => setForm({ ...form, subject: v })}
            placeholder="What's it about?"
            optional
            isMobile={isMobile}
          />
          <Field
            name="message" label="04 — Message"
            value={form.message}
            focused={focused === 'message'}
            onFocus={() => setFocused('message')}
            onBlur={() => setFocused('')}
            onChange={(v) => setForm({ ...form, message: v })}
            placeholder="Tell me about it…"
            multiline
            isMobile={isMobile}
          />

          <div style={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: isMobile ? 16 : 0,
            marginTop: 24,
          }}>
            <div style={{
              fontFamily: ED_MONO, fontSize: 10, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: COLORS.fgMuted,
            }}>
              {statusText(status, ready)}
            </div>
            <button
              type="submit"
              disabled={!ready || status === 'sending'}
              style={{
                background: ready && status !== 'sent' ? COLORS.fg : 'transparent',
                color: ready && status !== 'sent' ? '#0a0a0a' : COLORS.fgFaint,
                border: '1px solid ' + (ready && status !== 'sent' ? COLORS.fg : 'rgba(245,243,238,0.3)'),
                padding: isMobile ? '14px 20px' : '12px 24px',
                fontFamily: ED_MONO, fontSize: 11, letterSpacing: '0.18em',
                textTransform: 'uppercase',
                cursor: ready && status !== 'sending' ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                width: isMobile ? '100%' : 'auto',
              }}
            >
              {status === 'sent' ? 'Sent ✓' :
                status === 'sending' ? 'Sending…' : 'Send Message →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function statusText(status, ready) {
  if (status === 'sending') return '→ Sending your message…';
  if (status === 'sent') return '✓ Sent — thank you. I\'ll be in touch.';
  if (status === 'error') return '⚠ Couldn\'t send — opening your mail client instead.';
  return ready ? '→ Ready to send' : '→ Fill in name, email and message to continue';
}

function KvDashed({ k, v, last }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      padding: '6px 0',
      borderBottom: last ? 'none' : '1px dashed rgba(245,243,238,0.12)',
    }}>
      <span>{k}</span><span>{v}</span>
    </div>
  );
}

function Field({
  name, label, type = 'text', value, focused, onFocus, onBlur, onChange,
  placeholder, multiline = false, optional = false, isMobile = false,
}) {
  const hasValue = !!value;
  const labelColor = focused || hasValue
    ? 'rgba(245,243,238,0.85)'
    : 'rgba(245,243,238,0.65)';
  return (
    <label style={{
      display: 'block',
      paddingTop: 14, paddingBottom: 10,
      borderBottom: `1px solid ${focused ? 'rgba(245,243,238,0.5)' : 'rgba(245,243,238,0.18)'}`,
      transition: 'border-color 0.2s',
    }}>
      <div style={{
        fontFamily: ED_MONO, fontSize: 10, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: labelColor,
        marginBottom: 8,
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span>{label}</span>
        <span style={{ color: 'rgba(245,243,238,0.55)' }}>
          {optional ? 'OPTIONAL' : 'REQUIRED'}
        </span>
      </div>
      {multiline ? (
        <textarea
          name={name}
          value={value}
          rows={4}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%', background: 'transparent', border: 'none', outline: 'none',
            color: COLORS.fg,
            fontFamily: ED_DISPLAY,
            fontSize: isMobile ? 16 : 17,
            lineHeight: 1.45,
            letterSpacing: '-0.01em', resize: 'vertical', padding: 0,
          }}
        />
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={
            name === 'email' ? 'email' :
            name === 'name' ? 'name' : 'off'
          }
          style={{
            width: '100%', background: 'transparent', border: 'none', outline: 'none',
            color: COLORS.fg,
            fontFamily: ED_DISPLAY,
            fontSize: isMobile ? 16 : 20,
            lineHeight: 1.3,
            letterSpacing: '-0.02em', padding: 0,
          }}
        />
      )}
    </label>
  );
}

export default ContactForm;
