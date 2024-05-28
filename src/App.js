// App.js
import React, { useEffect, useState } from "react";
import './App.css';
import AOS from "aos";
import "aos/dist/aos.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Timeline from './components/Timeline';
import Projects from './components/Projects';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Contactmain from './components/Contact-main';
import Footer from './components/Footer';
import fetchTimelineData from './service/fetchTimeline';

function MainPage({ timelineData }) {
  return (
    <>
      <Navbar />
      <Landing />
      <Timeline data={timelineData} />
      {/* <Resume/> */}
      <Projects/>
      <Testimonials/>
      <Contactmain/>
      <Footer/>
    </>
  );
}

function App() {
  const [timelineData, setTimelineData] = useState([]);

  useEffect(() => {
    async function getData() {
      const data = await fetchTimelineData();
      setTimelineData(data);
      console.log('Data fetched from Firebase:', data);
    }
    getData();

    AOS.init({
      duration: 2000
    });
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<MainPage timelineData={timelineData} />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
