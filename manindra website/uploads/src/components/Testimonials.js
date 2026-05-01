import React from 'react';
import './Testimonials.css';

function Testimonials() {
    // Array of testimonials (replace these with your own testimonials)
    const testimonials = [
        { 
            name: 'John Sarkis, CEO of Stomble', 
            comment: 'As a team leader for our backend team, Manindra demonstrated an exemplary level of technical proficiency and leadership skills. His understanding and application of AWS services were instrumental in the successful implementation of our backend operations. Additionally, Manindra\'s communication skills were top-notch. He effectively coordinated tasks between the team and the startup\'s CEO, ensuring smooth operations and timely delivery of our projects. His ability to articulate complex technical concepts in an understandable way greatly facilitated our decision-making process. We highly recommend Manindra for any team that requires a combination of technical expertise and effective leadership.'
        },
        { 
            name: 'Josh Garretson, Extension Astrophysics, ANU', 
            comment: 'Manindra has consistently demonstrated a strong work ethic and highly developed organisational skills. He is always prepared for class and completes work on time or ahead of schedule. His analytical and problem-solving skills have developed rapidly over the two years that I have taught him, and he has demonstrated an especially strong capability for solving problems which require a mixture of physical and computational thinking. He plans well and knows when and how to ask for help or clarification. His communication skills, cooperative nature, and enthusiasm motivate his peers and make him a strong team player.' 
        },
        {
            name: 'Tom Cook, Founder of Our Tutor',
            comment: 'Manindra took the time to understand my business and target audience. He translated that understanding into a visually stunning and user-friendly interface that truly represents the essence of my brand. His attention to detail and dedication to the project were evident in every interaction. The website has received numerous positive feedback from our customers and has significantly boosted our online presence.'
        },        
        {
            name: 'Quintet Automotive',
            comment: 'Manindra provided excellent service in the areas of data analysis and web scraping for our automotive business. His in-depth understanding of data analytics and ability to extract and process relevant information from various web sources was truly impressive. This, combined with his ability to understand and anticipate our needs, greatly contributed to our data-driven decision-making process. His consistent delivery, clear communication, and commitment to meeting our needs was commendable. We strongly recommend Manindra for any organization in need of expert data analysis and web scraping services.'
        }
        // Add more testimonials as needed
    ];
    
    

    return (
        <div className="testimonials-section" id="testimonials">
            <div className="testimonials-container">
                {testimonials.map((testimonial, index) => (
                    <div key={index} className={`testimonial ${index % 2 === 0 ? 'left' : 'right'}`} data-aos="fade-up">
                        <p>"{testimonial.comment}"</p>
                        <h3>- {testimonial.name}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Testimonials;
