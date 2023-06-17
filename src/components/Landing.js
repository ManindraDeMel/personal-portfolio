import React from 'react';
import './Landing.css';

const Landing = () => {
    return (
        <section id="introduction" className="intro">
            <div className="intro-content">
                <h1>Hello, I'm <span>Manindra de Mel</span></h1>
                <p>I'm a Full Stack Developer</p>
            </div>
            <div className="intro-image">
                <img src="/images/me.jpg" alt="John Doe" />
            </div>
        </section>
    );
};

export default Landing;
