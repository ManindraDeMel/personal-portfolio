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

    // Reverse the data array and then slice it based on the state
    const reversedData = data.slice().reverse();
    const nodesToShow = showAll ? reversedData : reversedData.slice(0, 2);

    return (
        <div className="timeline" id='journey' ref={timelineRef}>
            {nodesToShow.map((node, index) => (
                <Node key={index} data={node} index={index} />
            ))}
            {reversedData.length > 2 && (
                <button onClick={handleShowMore}>
                    {showAll ? 'Show Less' : 'Explore More Milestones'}
                </button>
            )}
        </div>
    );
};

export default Timeline;
