import React, { useEffect } from "react";
import './App.css';
import AOS from "aos";
import "aos/dist/aos.css";

// Import your components
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Timeline from './components/Timeline';

const timelineData = [
  {
    year: "2018",
    subtitle: "Sub-heading 1",
    achievements: ["Achievement 1", "Achievement 2", "Achievement 3"]
},
{
    year: "2019",
    subtitle: "Sub-heading 2",
    achievements: ["Achievement 1", "Achievement 2", "Achievement 3"]
},
];

function App() {
  useEffect(() => {
    AOS.init({
      duration : 2000
    });
  }, []);
  return (
    <div className="App">
      <Navbar />
      <Landing />
      <Timeline data={timelineData} />
    </div>
  );
}

export default App;
