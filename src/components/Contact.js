import React from 'react';
import './Contact.css';
import { Link } from 'react-router-dom'; // import Link from react-router-dom

function Contact() {
    return (
        <div className="contact-section">
            <Link to="/" className="back-arrow">←</Link> {/* This is the back arrow, linking to the homepage */}
            <h1>Get in Touch</h1> {/* Make this a h1 for a larger heading */}
            <div className="left-column">
                <h3>Professional Inquiry</h3>
                <p>manindrademel@yahoo.com.au</p>
                {/* Include your social media icons here */}
            </div>
            <div className="right-column">
                {/* Include your phone number here */}
            </div>
        </div>
    );
}

export default Contact;
