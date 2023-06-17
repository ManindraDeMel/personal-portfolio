import React, { useEffect } from 'react';
import Masonry from 'masonry-layout';
import './Projects.css';

function Projects() {
    useEffect(() => {
        new Masonry('.project-grid', {
            itemSelector: '.project-card',
            columnWidth: 200,
            fitWidth: true,
            gutter: 20,
            originLeft: true,
        });
    }, []);

    return (
        <div className="project-section">
            <h2>My Projects</h2>
            <div className="project-grid">
                <div className="project-card" style={{ height: `${Math.random() * 100 + 150}px` }}>
                    <h3>Project 1</h3>
                    <p>January 2022</p>
                    <p>A short description of Project 1.</p>
                    <a href="https://github.com/username/project1" target="_blank" rel="noopener noreferrer">View on GitHub</a>
                </div>
                <div className="project-card" style={{ height: `${Math.random() * 100 + 150}px` }}>
                    <h2>Project 2</h2>
                    <p>February 2022</p>
                    <p>A short description of Project 2.</p>
                    <a href="https://github.com/username/project2" target="_blank" rel="noopener noreferrer">View on GitHub</a>
                </div>
                {/* Repeat for each project */}
            </div>
        </div>
    );
}

export default Projects;
