import React, { Suspense, lazy } from 'react';
import Landing from '../components/Landing';
import FadeUp from '../components/FadeUp';

const StoryIndex = lazy(() => import('../components/StoryIndex'));
const FieldNotes = lazy(() => import('../components/FieldNotes'));
const Resume = lazy(() => import('../components/Resume'));
const ContactMain = lazy(() => import('../components/Contact-main'));
const Footer = lazy(() => import('../components/Footer'));

const SECTION_FALLBACK = (
  <div style={{ minHeight: 320 }} aria-hidden="true" />
);

// Concept A — "The Index": one scroll, five moves.
// Masthead → thesis → four-part story index → field notes → contact.
function Home() {
  return (
    <>
      <FadeUp><Landing /></FadeUp>
      <Suspense fallback={SECTION_FALLBACK}>
        <FadeUp><StoryIndex /></FadeUp>
        <FadeUp><FieldNotes /></FadeUp>
        <FadeUp><Resume /></FadeUp>
        <FadeUp><ContactMain /></FadeUp>
        <FadeUp><Footer /></FadeUp>
      </Suspense>
    </>
  );
}

export default Home;
