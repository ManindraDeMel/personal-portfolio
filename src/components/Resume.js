import React from 'react';
import './Resume.css';

const Resume = () => {
  return (
    <div className="resume-section">
      <h2>Would you like to know more?</h2>
      <a href="/path-to-your-resume.pdf" className="download-button" download>
        Download My Resume
      </a>
    </div>
  );
};

export default Resume;
