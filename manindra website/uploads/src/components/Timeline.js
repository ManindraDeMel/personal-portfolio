import React, { useState, useRef } from 'react';
import Node from './Node';
import './Timeline.css';

const Timeline = ({ data }) => {
    const [showAll, setShowAll] = useState(false);
    const timelineRef = useRef(null);

    const handleShowMore = () => {
        setShowAll(!showAll);
        if (showAll) {
            timelineRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const nodesToShow = showAll ? data : data.slice(0, 2);

    return (
        <div className="timeline" id='journey' ref={timelineRef}>
            {nodesToShow.map((node, index) => (
                <Node key={index} data={node} index={index} />
            ))}
            {data.length > 2 && (
                <button onClick={handleShowMore}>
                    {showAll ? 'Show Less' : 'Explore More Milestones'}
                </button>
            )}
        </div>
    );
};

export default Timeline;
