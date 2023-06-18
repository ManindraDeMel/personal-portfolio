import React from 'react';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <ul>
                <li><a href="#introduction">Home</a></li>
                <li><a href="#journey">Journey</a></li>
                <li><a href="#resume">Resume</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#testimonials">Testimonials</a></li>
                <li><a href="/contact">Contact</a></li> {/* This is changed to navigate to the Contact page */}
            </ul>
        </nav>
    );
};

export default Navbar;
