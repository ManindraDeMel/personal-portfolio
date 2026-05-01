import React, { useEffect, useRef, useState } from 'react';

// Splits a quote so that the last sentence is the part to type.
// Falls back to typing the last ~30% of the string if no sentence boundary
// is found or the resulting tail is degenerate.
export function splitForTyping(text) {
  if (!text) return ['', ''];
  const match = String(text).match(/^([\s\S]+[.!?]\s+)([^.!?]+[.!?]?)\s*$/);
  if (match) {
    const head = match[1];
    const tail = match[2].trim();
    if (tail.length >= 8 && tail.length <= text.length * 0.55) {
      return [head, tail];
    }
  }
  const idx = Math.max(0, Math.floor(text.length * 0.7));
  return [text.slice(0, idx), text.slice(idx)];
}

// Renders `prefix` immediately, then types out `tail` character-by-character
// once scrolled into view. Adds a blinking cursor while typing and for a beat
// after, then removes it.
export default function TypeReveal({
  prefix = '',
  tail = '',
  speed = 28,
  startDelay = 120,
  cursor = '▍',
  style,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [chars, setChars] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (!ref.current || typeof window === 'undefined' || !window.IntersectionObserver) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.15 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    setChars(0);
    setShowCursor(true);
  }, [tail]);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    let iv;
    const start = setTimeout(() => {
      iv = setInterval(() => {
        if (cancelled) return;
        setChars((c) => {
          if (c >= tail.length) {
            clearInterval(iv);
            setTimeout(() => !cancelled && setShowCursor(false), 1200);
            return c;
          }
          return c + 1;
        });
      }, speed);
    }, startDelay);
    return () => {
      cancelled = true;
      clearTimeout(start);
      if (iv) clearInterval(iv);
    };
  }, [visible, tail, speed, startDelay]);

  // Reduced-motion users get the full text immediately.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setChars(tail.length);
      setShowCursor(false);
    }
  }, [tail.length]);

  return (
    <span ref={ref} style={style}>
      {prefix}
      {tail.slice(0, chars)}
      {showCursor && (
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            marginLeft: 1,
            color: 'rgba(245,243,238,0.7)',
            animation: 'ed-cursor-blink 1s steps(2, start) infinite',
          }}
        >
          {cursor}
        </span>
      )}
    </span>
  );
}
