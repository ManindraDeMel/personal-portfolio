import React, { Suspense, lazy, useEffect, useState } from 'react';
import Landing from '../components/Landing';
import Marquee from '../components/Marquee';
import FadeUp from '../components/FadeUp';
import fetchTimelineData from '../service/fetchTimeline';

const Timeline = lazy(() => import('../components/Timeline'));
const WorkTeaser = lazy(() => import('../components/WorkTeaser'));
const ResearchTeaser = lazy(() => import('../components/ResearchTeaser'));
const Resume = lazy(() => import('../components/Resume'));
const Testimonials = lazy(() => import('../components/Testimonials'));
const ContactMain = lazy(() => import('../components/Contact-main'));
const Footer = lazy(() => import('../components/Footer'));

const SECTION_FALLBACK = (
  <div style={{ minHeight: 320 }} aria-hidden="true" />
);

function Home() {
  const [timelineData, setTimelineData] = useState([]);

  useEffect(() => {
    fetchTimelineData().then(setTimelineData);
  }, []);

  return (
    <>
      <FadeUp><Landing /></FadeUp>
      <FadeUp delay={80}><Marquee /></FadeUp>
      <Suspense fallback={SECTION_FALLBACK}>
        <FadeUp><Timeline data={timelineData} /></FadeUp>
        <FadeUp><WorkTeaser /></FadeUp>
        <FadeUp><ResearchTeaser /></FadeUp>
        <FadeUp><Resume /></FadeUp>
        <FadeUp><Testimonials /></FadeUp>
        <FadeUp><ContactMain /></FadeUp>
        <FadeUp><Footer /></FadeUp>
      </Suspense>
    </>
  );
}

export default Home;
