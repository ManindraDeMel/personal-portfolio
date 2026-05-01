import emailjs from '@emailjs/browser';
import PORTFOLIO from '../data/portfolio';

// Sends the contact form via EmailJS (browser-side, free tier 200/mo).
// Setup:
//   1. https://www.emailjs.com — create account, connect a Gmail service
//   2. Build a template that consumes: from_name, from_email, subject, message,
//      reply_to. Set the template's "To Email" to your inbox.
//   3. Copy Public Key, Service ID, Template ID into .env / CI secrets:
//        REACT_APP_EMAILJS_PUBLIC_KEY
//        REACT_APP_EMAILJS_SERVICE_ID
//        REACT_APP_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;

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
