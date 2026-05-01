import React, { Suspense, lazy, useEffect, useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Marquee from './components/Marquee';
import FadeUp from './components/FadeUp';
import fetchTimelineData from './service/fetchTimeline';

const Timeline = lazy(() => import('./components/Timeline'));
const Projects = lazy(() => import('./components/Projects'));
const Research = lazy(() => import('./components/Research'));
const Resume = lazy(() => import('./components/Resume'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const ContactMain = lazy(() => import('./components/Contact-main'));
const Footer = lazy(() => import('./components/Footer'));

const SECTION_FALLBACK = (
  <div style={{ minHeight: 320 }} aria-hidden="true" />
);

function App() {
  const [timelineData, setTimelineData] = useState([]);

  useEffect(() => {
    fetchTimelineData().then(setTimelineData);
  }, []);

  return (
    <div className="App">
      <a href="#main-content" className="skip-to-content">Skip to content</a>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <FadeUp><Landing /></FadeUp>
        <FadeUp delay={80}><Marquee /></FadeUp>
        <Suspense fallback={SECTION_FALLBACK}>
          <FadeUp><Timeline data={timelineData} /></FadeUp>
          <FadeUp><Projects /></FadeUp>
          <FadeUp><Research /></FadeUp>
          <FadeUp><Resume /></FadeUp>
          <FadeUp><Testimonials /></FadeUp>
          <FadeUp><ContactMain /></FadeUp>
          <FadeUp><Footer /></FadeUp>
        </Suspense>
      </main>
    </div>
  );
}

export default App;
