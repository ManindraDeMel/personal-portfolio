import React from 'react';
import './Testimonials.css';

function Testimonials() {
    // Array of testimonials (replace these with your own testimonials)
    const testimonials = [
        { name: 'Client 1', comment: 'Great work!' },
        { name: 'Client 2', comment: 'Impressive project delivery.' },
        { name: 'Client 3', comment: 'Very professional.' },
        // Add more testimonials as needed
    ];

    return (
        <div className="testimonials-section" id="testimonials">
            <h2>Testimonials</h2>
            <div className="testimonials-container">
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="testimonial-card">
                        <h3>{testimonial.name}</h3>
                        <p>"{testimonial.comment}"</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Testimonials;
