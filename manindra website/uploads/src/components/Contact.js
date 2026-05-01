import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithubSquare, faInstagramSquare } from '@fortawesome/free-brands-svg-icons';
import './Contact.css';

function Contact() {
    return (
        <div className="contact-section">
            <h1 data-aos="fade-up">Let's work together</h1>
            <div className="contact-info" data-aos="fade-up">
                <div className="info-column">
                    <h2>Inquire</h2>
                    <p>manindrademel@yahoo.com.au</p>
                </div>
                <div className="info-column">
                    <h2>Contact</h2>
                    <p> +61 498 842 763</p>
                    <p>Gunghalin Area, Canberra ACT, 2914 AUSTRALIA</p>
                </div>
            </div>
            <div className="social-links" data-aos="fade-up">
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
        </div>
    );
}

export default Contact;
