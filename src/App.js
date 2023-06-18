import React, { useEffect } from "react";
import './App.css';
import AOS from "aos";
import "aos/dist/aos.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';




// Import
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Timeline from './components/Timeline';
import Resume from './components/Resume';
import Projects from './components/Projects';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Contactmain from './components/Contact-main';
import Footer from './components/Footer';

const timelineData = [
  {
    year: "2018",
    subtitle: "Embarking on the Programming Journey",
    achievements: ["First began learning the basic of Python & Programming", "Participated in Google Code-in", "Undertook CAT (Computer Algorithmic Thinking) test"]
  },
  {
    year: "2019",
    subtitle: "Stepping into Competitive Programming",
    achievements: ["Achieved High Distinction in AMC (Australian Maths Competition)",
                   "Participated in AIO (Australian Informatics Olympiad)",
                   "Created a custom 3D graphics engine in C++",
                   "Built a maze-solving robot in C",
                   "Junior Game Designer & Developer at the Academy of Interactive Entertainment"]
  },
  {
    year: "2020",
    subtitle: "Expanding Horizons amidst Calm",
    achievements: ["Participated in AIO again",
                   "Participated in IMC^2 (International Mathematical Modeling Challenge)",
                   "Created games in Unity using C#",
                   "Tried penetration testing on HackTheBox",
                   "Created the first in-browser game using basic JS, HTML, and CSS"]
  },
  {
    year: "2021",
    subtitle: "Venturing into the World of Machine Learning",
    achievements: ["Wrote a research paper on backpropagation",
                   "Worked on deep deblurring with CNNs (Convolutional Neural Networks)",
                   "Created a deep learning chatbot with LSTMs",
                   "Competed in GovHack",
                   "Undertook CAT test again",
                   "Participated in Oxford University Computing Challenge",
                   "Runners up for Code Quest Lockheed Martin",
                   "Regional winner of Young ICT",
                   "Presented at Australian National Python Convention (PyCon AU)",
                   "Worked as a Freelance Data Analyst at Quintet Automotive",
                   "Participated in AIO yet again"]
  },
  {
    year: "2022",
    subtitle: "Embarking on the University Adventure",
    achievements: [
      "Studied Functional Programming with Haskell",
      "Studied Object-oriented programming with Java",
      "Began working at Stomble as a Backend Engineer with AWS",
      "Began working as a freelance web designer & web developer (Full stack)",
      "Began working as a freelance data scientist & data analyst",
      "Learnt fundamental computer science concepts including program proofs, logic programming, array programming, and other paradigms"
    ]
  },  
  {
    year: "2023",
    subtitle: "Expanding Horizons as a Freelancer",
    achievements: [
      "Founded Canberrawebsites.org",
      "Continued working as a freelance website designer & web developer (Full Stack)",
      "Continued working as a freelance data scientist & data analyst",
      "Joined a university-based club called ANU Formula Sport, where we are developing and building an autonomous racing car from scratch, handling both the software and hardware aspects",
      "Started researching and developing a reinforcement learning model (Q Learning) for stock market trading",
      "Became a freelance stock trading bot developer for US stocks"
    ]
  }  
];


function MainPage() {
  return (
    <>
      <Navbar />
      <Landing />
      <Timeline data={timelineData} />
      <Resume/>
      <Projects/>
      <Testimonials/>
      <Contactmain/>
      <Footer/>
    </>
  );
}

function App() {
  useEffect(() => {
    AOS.init({
      duration : 2000
    });
  }, []);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
