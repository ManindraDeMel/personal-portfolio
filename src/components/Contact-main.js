import React from 'react';
import { Link } from 'react-router-dom';
import './Contact-main.css';

function Contact() {
    return (
        <div className="contact-section" id="contact">
            <h2>Get in Touch</h2>
            <Link to="/contact" className="contact-button">Contact</Link>
        </div>
    );
}

export default Contact;
