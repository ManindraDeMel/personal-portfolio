import React, { useEffect, useState } from 'react';
import Masonry from 'masonry-layout';
import './Projects.css';
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles

function Projects() {
    const [repos, setRepos] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 760);

    useEffect(() => {
        fetch('https://api.github.com/user/repos', {
            headers: {
                'Authorization': `token ${process.env.REACT_APP_GITHUB_TOKEN}`
            }
        })
            .then(response => response.json())
            .then(data => {
                if (isMobile) {
                    setRepos(data.slice(0, 5));
                } else {
                    setRepos(data);
                }
            });
    }, [isMobile]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 760);
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    useEffect(() => {
        AOS.refresh();
    }, [repos]);
    

    useEffect(() => {
        new Masonry('.project-grid', {
            itemSelector: '.project-card',
            columnWidth: 200,
            fitWidth: true,
            gutter: 20,
            originLeft: true,
        });
    }, [repos]);

    return (
        <div className="project-section" id="projects">
            <h2>My Projects</h2>
            <div className="project-grid">
                {repos.map(repo => (
                    <div className="project-card" key={repo.id} data-aos="fade-up">
                        <h3>{repo.name}</h3>
                        <p>Last Updated: {new Date(repo.updated_at).toLocaleDateString()}</p>
                        <p>{repo.description || ''}</p>
                        {!repo.private && <a href={repo.html_url} target="_blank" rel="noopener noreferrer">View on GitHub</a>}
                    </div>
                ))}
            </div>
            {isMobile && <a href="https://github.com/ManindraDeMel" target="_blank" rel="noopener noreferrer" className="view-more-button">View More on GitHub</a>}
        </div>
    );
}

export default Projects;
