import React from 'react';
import './Landing.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithubSquare, faLinkedin, faInstagramSquare } from "@fortawesome/free-brands-svg-icons";

const Landing = () => {
    return (
        <section id="introduction" className="landing">
            <div className="landing-content">
                <h1>Manindra de Mel</h1>
                <p className="short-description">
                Based in the heart of Canberra, I bring over 5 years of comprehensive experience in the IT industry. 
                My spectrum of expertise spans from data science and deep machine learning with <b>Python</b> to website creation with <b>React/Vue/Svelte</b>, from low-level programming to <b>Haskell</b> and functional programming - there's no challenge I won't take on. 
                The diversity of this field ignites my passion, and it's in the weaving of complex computer science problems and innovative solutions where I truly thrive. 
                Continual learning and growth are the core of my professional journey, as I relentlessly explore new tech trends and expand my skills.
                </p>
                <div className="social-links">
                    <a href="[your LinkedIn URL]" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faLinkedin} size="2x" color="white"/>
                    </a>
                    <a href="[your GitHub URL]" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faGithubSquare} size="2x" color="white"/>
                    </a>
                    <a href="[your Instagram URL]" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faInstagramSquare} size="2x" color="white"/>
                    </a>
                </div>
                <div className="cta-container">
                    <a href="#contact" className="cta-btn">Get in Touch</a>
                </div>
            </div>
            <div className="landing-image">
                <img src="/assets/profile.jpg" alt="A portrait of Manindra" />
            </div>
        </section>
    );
};

export default Landing;
