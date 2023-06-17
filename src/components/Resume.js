import React from 'react';
import './Resume.css';

const Resume = () => {
  return (
    <div className="resume-section" >
      <h2 data-aos="fade-up">Would you like to know more?</h2>
      <a href="/assets/ManindradeMelResume.pdf" className="download-button" download data-aos="fade-up" >Download My Resume</a>
    </div>
  );
};

export default Resume;
