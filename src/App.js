import React from "react";
import './App.css';

// Import your components
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Timeline from './components/Timeline';

const timelineData = [
  {
      year: "2019",
      achievements: ["Achievement 1", "Achievement 2", "Achievement 3"]
  },
  {
      year: "2020",
      achievements: ["Achievement 1", "Achievement 2", "Achievement 3"]
  },
  // Add more years and achievements here...
];

function App() {
  return (
    <div className="App">
      <Navbar />
      <Landing />
      <Timeline data={timelineData} />
    </div>
  );
}

export default App;
