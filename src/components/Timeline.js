import React from 'react';
import Node from './Node';
import './Timeline.css';

const Timeline = ({ data }) => (
    <div className="timeline" id='journey'>
        {data.map((node, index) => <Node key={index} data={node} index={index} />)}
    </div>
);

export default Timeline;
