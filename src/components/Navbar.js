import React from 'react';
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <ul>
                <li><ScrollLink to="introduction" smooth={true} duration={1000} offset={-70}>Home</ScrollLink></li>
                <li><ScrollLink to="journey" smooth={true} duration={1000} offset={70}>Journey</ScrollLink></li>
                <li><ScrollLink to="resume" smooth={true} duration={1000} offset={-250}>Resume</ScrollLink></li>
                <li><ScrollLink to="projects" smooth={true} duration={1000} offset={-100}>Projects</ScrollLink></li>
                <li><ScrollLink to="testimonials" smooth={true} duration={1000} offset={-70}>Testimonials</ScrollLink></li>
                <li><Link to="/contact">Contact</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
