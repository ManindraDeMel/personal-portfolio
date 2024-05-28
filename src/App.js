import React, { useEffect } from "react";
import './App.css';
import AOS from "aos";
import "aos/dist/aos.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';




// Import
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Timeline from './components/Timeline';
//import Resume from './components/Resume';
import Projects from './components/Projects';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Contactmain from './components/Contact-main';
import Footer from './components/Footer';

const timelineData = [
  {
    year: "2018",
    subtitle: "Initiating the Programming Expedition",
    achievements: [
      "Ventured into the realms of Python, laying down the foundations of programming knowledge",
      "Contributed to open source during Google Code-in, experiencing the global development culture",
      "Undertook the Computer Algorithmic Thinking (CAT) test, exploring the intricacies of computational thinking"
    ]
  },
  {
    year: "2019",
    subtitle: "Venturing into Competitive Programming & Graphics Development",
    achievements: [
      "Accomplished High Distinction in the Australian Maths Competition (AMC), showcasing exceptional problem-solving skills",
      "Competed in the Australian Informatics Olympiad (AIO), testing algorithms and data structures knowledge",
      "Designed and developed a custom 3D graphics engine using C++, pushing the boundaries of graphical rendering",
      "Constructed a maze-solving robot, scripting in C and mastering the hardware-software interface",
      "Attained a role as a Junior Game Designer & Developer at the Academy of Interactive Entertainment, exploring the gaming industry"
    ]
  },
  {
    year: "2020",
    subtitle: "Advancing Skills in Game Development and Cybersecurity",
    achievements: [
      "Engaged in the Australian Informatics Olympiad (AIO) once again, continuing to refine competitive programming skills",
      "Participated in the International Mathematical Modeling Challenge (IMC^2), applying mathematics to real-world problems",
      "Crafted immersive games in Unity utilizing C#, further expanding game development abilities",
      "Explored the world of cybersecurity through penetration testing on HackTheBox platform",
      "Developed an in-browser game utilizing foundational web technologies - JavaScript, HTML, and CSS"
    ]
  },
  {
    year: "2021",
    subtitle: "Diving Deep into Machine Learning and Data Analysis",
    achievements: [
      "Authored a comprehensive research paper on the backpropagation algorithm, a cornerstone of neural networks",
      "Ventured into advanced Machine Learning, deblurring images using Convolutional Neural Networks (CNNs)",
      "Created a sophisticated deep learning chatbot using Long Short-Term Memory (LSTM) networks",
      "Collaborated in GovHack, solving societal issues through innovative use of public data",
      "Participated in the Computer Algorithmic Thinking (CAT) test, further strengthening computer science foundations",
      "Competed in the Oxford University Computing Challenge, solving problems in an international forum",
      "Achieved Runners-up position in the Code Quest by Lockheed Martin, showcasing software skills",
      "Celebrated as a <a href='https://www.youngictexplorers.net.au/act-2021/'>Regional winner of Young ICT</a>, receiving recognition for technology prowess",
      "Presented at the Australian National <a href='https://2021.pycon.org.au/program/KNBLPB/'>Python Convention (PyCon AU)</a>, sharing insights with the Python community",
      "Ventured into the automotive industry as a Freelance Data Analyst for <a href='https://local.infobel.com.au/AU105407752/quintet_automotive_contractors-canberra.html'>Quintet Automotive</a>",
      "Returned to the Australian Informatics Olympiad (AIO), consistently challenging problem-solving skills"
    ]
  },
  {
    year: "2022",
    subtitle: "Commencing the University Journey & Expanding Professional Experience",
    achievements: [
      "Studied Functional Programming using Haskell and Object-oriented programming with Java, diversifying programming paradigms at the <a href='https://www.anu.edu.au/'>Australian National University</a>",
      "Commenced working at <a href='https://www.linkedin.com/company/stomble?originalSubdomain=au'>Stomble</a> as a Backend Engineer, getting hands-on with AWS and server-side development",
      "Ventured into the freelancing world, offering services as a Full Stack web developer",
      "Applied data science skills in a freelance capacity as a data scientist & data analyst",
      "Immersed in fundamental computer science concepts, including program proofs, logic programming, array programming, and other paradigms at the <a href='https://www.anu.edu.au/'>Australian National University</a>"
    ]
  },  
  {
    year: "2023",
    subtitle: "Broadening Freelance Services & Exploring Innovative Projects",
    achievements: [
      "Engage in multifaceted technology roles including Full Stack Development, Database Management, DevOps, and Data Science at <a href='https://www.mhits.com.au/'>mHits AU</a>, part-time.",
      "Founded <a href='https://canberrawebsites.org/'>Canberrawebsites.org</a>, creating custom websites for local businesses",
      "Continued offering freelance services in website design, web development (Full Stack), data science, and data analysis",
      "Participated in ANU Formula Sport, a university-based club aiming to develop an autonomous racing car from scratch, gaining both hardware and software experience",
      "Embarked on a research project to develop a stock market trading model using Proximal Policy Optimization (PPO), a resource-efficient reinforcement learning technique, creating a synergy between finance and AI.",
      "Expanded freelancing to include stock trading bot development for US stocks, optimizing trading strategies with technology",
      "Contributed to the renowned <a href='https://github.com/OpenBMB/ChatDev'>ChatDev</a> project under OpenBmb as a DevOps Specialist.",
      "Secured 4th place in the <a href='https://www.aihackmelb.com/'>AI Hack Melbourne competition</a> with a pioneering AI-based <a href='http://team101.life/'>surgical scheduling tool.</a>"
    ]
  },
  {
    "year": "2024",
    "subtitle": "Specializing in Electronic Trading & Low-level Electronics Innovation",
    "achievements": [
      "Competed in the Jane Street Electronic Trading Challenge, applying complex quantitative trading strategies in a highly competitive, simulated electronic market. This experience honed my skills in algorithmic trading, financial modeling, and real-time decision-making under pressure.",
      "Developed a research proposal on <a href='https://realtimeenginetuning.web.app/'>Enhancing Engine Efficiency and Performance through Machine Learning - Real-Time Engine Tuning.</a> The project involved using ML algorithms for optimizing engine parameters in real-time, improving performance, efficiency, and environmental impact.",
      "Contributed to Research In <a href='https://aware-mesh-simplification.web.app/'> QEM Based Mesh Simplification, Leveraging Skeletonization & Convolutional Neutral Networks</a> to preserve mesh structure"
    ]
  }
];



function MainPage() {
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
