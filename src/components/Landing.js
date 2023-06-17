import React from 'react';
import './Landing.css';

const Landing = () => {
    return (
        <section id="introduction" className="landing">
            <div className="landing-content">
                <h1>Hello, I'm [Your Name]</h1>
                <p className="profession-text">I'm a [Your Profession]</p>
                <div className="cta-container">
                    <a href="#contact" className="cta-btn">Get in Touch</a>
                </div>
            </div>
            <div className="landing-image">
                <img src="path-to-your-image" alt="A portrait of you" />
            </div>
        </section>
    );
};

export default Landing;
