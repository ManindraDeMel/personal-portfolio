import React from 'react';
import './Node.css';

const Node = ({ data, index }) => (
    <div className="node">
        <div className="node-circle"></div>
        <div className={`node-content ${index % 2 === 0 ? 'left' : 'right'}`}>
            <h3 className="node-year">{data.year}</h3>
            <ul className="node-achievements">
                {data.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                ))}
            </ul>
        </div>
    </div>
);
export default Node;
