import React from 'react';
import Node from './Node';
import './Timeline.css';

const Timeline = ({ data }) => (
    <div className="timeline">
        {data.map((node, index) => <Node key={index} data={node} />)}
    </div>
);

export default Timeline;
