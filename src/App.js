import React from "react";
import './App.css';

// Import your components
import Navbar from './components/Navbar';
import Landing from './components/Landing';
// import About from './components/About';
// import Skills from './components/Skills';
// import Resume from './components/Resume';
// import Projects from './components/Projects';
// import Testimonials from './components/Testimonials';
// import Contact from './components/Contact';
// import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Landing />
      {/* <About />
      <Skills />
      <Resume />
      <Projects />
      <Testimonials />
      <Contact />
      <Footer />  */}
    </div>
  );
}

export default App;
