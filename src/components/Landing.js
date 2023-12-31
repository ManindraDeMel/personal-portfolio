import React from 'react';
import './Landing.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithubSquare, faLinkedin, faInstagramSquare } from "@fortawesome/free-brands-svg-icons";
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <section id="introduction" className="landing">
            <div className="landing-content">
                <h1 data-aos="fade-up">Manindra de Mel</h1>
                <p className="short-description" data-aos="fade-up">
                Based in the heart of Canberra, I bring over 5 years of comprehensive experience in the IT industry. 
                My expertise ranges from data science and deep machine learning with <b>Python</b>, to website creation with <b>React/Vue/Svelte</b>, 
                and from low-level programming with <b>Assembly/C/C++</b>, to <b>Haskell</b> and functional programming. 
                I have also worked extensively with <b>Firebase, Android Studio, Google Cloud, AWS</b>, and other cloud infrastructure services. 
                The diversity of this field fuels my passion, and I thrive in the challenge of untangling complex computer science problems and weaving innovative, effective solutions. 
                My professional journey is driven by continuous learning and growth, as I relentlessly explore new tech trends and broaden my skill set. 
                In this dynamic industry, there's no challenge I won't embrace.
                </p>
                <div className="social-links-landing" data-aos="fade-up" data-aos-offset="-200">
                    <a href="https://www.linkedin.com/in/manindra-de-mel-413a79160/" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faLinkedin} size="2x" color="white"/>
                    </a>
                    <a href="https://github.com/ManindraDeMel" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faGithubSquare} size="2x" color="white"/>
                    </a>
                    <a href="https://www.instagram.com/mani.programming/" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faInstagramSquare} size="2x" color="white"/>
                    </a>
                </div>
                <div className="cta-container" data-aos="fade-up" data-aos-offset="-200"> 
                    <Link to="/contact" className="cta-btn">Contact</Link>
                </div>
            </div>
            <div className="landing-image" data-aos="fade-left">
                <img src="/assets/profile.jpg" alt="A portrait of Manindra" />
            </div>
        </section>
    );
};

export default Landing;
