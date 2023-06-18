import React from 'react';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <p>Made with ❤️ using React.js</p>
            <p>Copyright © {new Date().getFullYear()} Manindra</p>
        </footer>
    );
}

export default Footer;
