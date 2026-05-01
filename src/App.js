import React, { useEffect, useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Marquee from './components/Marquee';
import Timeline from './components/Timeline';
import Projects from './components/Projects';
import Research from './components/Research';
import Resume from './components/Resume';
import Testimonials from './components/Testimonials';
import ContactMain from './components/Contact-main';
import Footer from './components/Footer';
import FadeUp from './components/FadeUp';
import fetchTimelineData from './service/fetchTimeline';

function App() {
  const [timelineData, setTimelineData] = useState([]);

  useEffect(() => {
    fetchTimelineData().then(setTimelineData);
  }, []);

  return (
    <div className="App">
      <Navbar />
      <FadeUp><Landing /></FadeUp>
      <FadeUp delay={80}><Marquee /></FadeUp>
      <FadeUp><Timeline data={timelineData} /></FadeUp>
      <FadeUp><Projects /></FadeUp>
      <FadeUp><Research /></FadeUp>
      <FadeUp><Resume /></FadeUp>
      <FadeUp><Testimonials /></FadeUp>
      <FadeUp><ContactMain /></FadeUp>
      <FadeUp><Footer /></FadeUp>
    </div>
  );
}

export default App;
