import React from 'react';
import './Node.css';

const Node = ({ data, index }) => (
    <div className="node">
        <div className="node-circle"></div>
        <div className={`node-content ${index % 2 === 0 ? 'left' : 'right'}`} data-aos="fade-up">
            <h3 className={`node-year ${index % 2 === 0 ? 'left' : 'right'}`}>{data.year}</h3>
            <p className={`node-subtitle ${index % 2 === 0 ? 'left' : 'right'}`}>{data.subtitle}</p>
            <ul className={`node-achievements ${index % 2 === 0 ? 'left' : 'right'}`}>
                {data.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                ))}
            </ul>
        </div>
    </div>
);

export default Node;
