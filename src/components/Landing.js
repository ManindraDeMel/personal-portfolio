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
                Based in the heart of Canberra, I bring over 5 years of extensive experience in the IT industry, where I have honed my skills in various domains. 
                What truly drives me is the thrill of solving complex computer science problems, designing innovative and effective solutions, 
                and continuously learning and growing in this dynamic field. In my free time, I love exploring new tech trends and expanding my skill set..
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
