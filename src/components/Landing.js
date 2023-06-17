import React from 'react';
import './Landing.css';

const Landing = () => {
    return (
        <section id="introduction" className="landing">
            <div className="landing-content">
                <h1>Manindra de Mel</h1>
                <p className="profession-text">I'm a Full stack developer</p>
                <p className="short-description">
                Based in the heart of Canberra, I bring over 5 years of extensive experience in the IT industry, where I have honed my skills in various domains. 
                What truly drives me is the thrill of solving complex computer science problems, designing innovative and effective solutions, 
                and continuously learning and growing in this dynamic field. In my free time, I love exploring new tech trends and expanding my skill set..
                </p>
                <div className="social-links">
                    <a href="[your LinkedIn URL]" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    <a href="[your GitHub URL]" target="_blank" rel="noopener noreferrer">GitHub</a>
                    <a href="[your Instagram URL]" target="_blank" rel="noopener noreferrer">Instagram</a>
                </div>
                <div className="cta-container">
                    <a href="#contact" className="cta-btn">Get in Touch</a>
                </div>
            </div>
            <div className="landing-image">
                <img src="/assets/profile.jpg" alt="A portrait of me" />
            </div>
        </section>
    );
};

export default Landing;
