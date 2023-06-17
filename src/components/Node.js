import React from 'react';
import './Node.css';

const Node = ({ data }) => (
    <div className="node">
        <div className="node-year">{data.year}</div>
        <ul className="node-achievements">
            {data.achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
            ))}
        </ul>
    </div>
);

export default Node;
