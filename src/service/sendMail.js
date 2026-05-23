import emailjs from '@emailjs/browser';
import PORTFOLIO from '../data/portfolio';

// Sends the contact form via EmailJS (browser-side, free tier 200/mo).
// The "public key", service id, and template id are all client-visible by
// design — EmailJS exposes them in every send request — so they live in
// source. The env-var overrides are kept for swapping accounts without a
// code change.
const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'RctMzoR5IssFsxF49';
const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || 'service_flq2nfh';
const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'template_kqd27uq';

export async function sendContactMessage({ name, email, subject, message }) {
  if (!PUBLIC_KEY || !SERVICE_ID || !TEMPLATE_ID) {
    console.warn('EmailJS env vars missing — falling back to mailto.');
    return false;
  }
  const finalSubject = (subject && subject.trim()) || `Inquiry from ${name}`;
  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        name,
        email,
        from_name: name,
        from_email: email,
        reply_to: email,
        subject: finalSubject,
        title: finalSubject,
        message,
        to_email: PORTFOLIO.email,
      },
      { publicKey: PUBLIC_KEY }
    );
    return true;
  } catch (error) {
    console.error('EmailJS send failed:', error);
    return false;
  }
}

export function buildMailto({ name, email, subject, message }) {
  const finalSubject = (subject && subject.trim()) || `Inquiry from ${name}`;
  const body = `From: ${name} <${email}>\n\n${message}`;
  return `mailto:${PORTFOLIO.email}?subject=${encodeURIComponent(finalSubject)}&body=${encodeURIComponent(body)}`;
}
