import React, { useEffect, useState } from 'react';
import Masonry from 'masonry-layout';
import './Projects.css';
import AOS from 'aos';
import 'aos/dist/aos.css'; // You can also use <link> for styles

function Projects() {
    const [repos, setRepos] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 760);

    useEffect(() => {
        fetch('https://api.github.com/user/repos?per_page=100&page=1', {
            headers: {
                'Authorization': `token ${process.env.REACT_APP_GITHUB_TOKEN}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (Array.isArray(data)) {
                const sortedData = data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
                if (isMobile) {
                    setRepos(sortedData.slice(0, 4));
                } else {
                    setRepos(sortedData);
                }
            } else {
                console.error('Expected an array of data, but got:', data);
            }
        })
        .catch(error => {
            console.error('Failed to fetch repos:', error);
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
        const timer = setTimeout(() => {
            AOS.refresh();
        }, 500); // Wait for 500ms before refreshing AOS
    
        return () => clearTimeout(timer); // Clear the timer when the component unmounts or before next run
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
