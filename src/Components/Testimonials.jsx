import React from 'react';
import { Container, Carousel } from 'react-bootstrap';
import './Styles/Testimonials.css';

const testimonials = [
  {
    text: "Professional, responsive, and able to keep up with ever-changing demand and tight deadlines: That's how I would describe Jeremy and his team at The Lorem Ipsum Company. When it comes to content marketing, you'll definitely get the 5-star treatment from the Lorem Ipsum Company.",
    name: "Losis Decosta",
    role: "Math Teacher",
    imgSrc: "path/to/student1.jpg"
  },
  {
    text: "Professional, responsive, and able to keep up with ever-changing demand and tight deadlines: That's how I would describe Jeremy and his team at The Lorem Ipsum Company. When it comes to content marketing, you'll definitely get the 5-star treatment from the Lorem Ipsum Company.",
    name: "Mahadi Monsura",
    role: "Student",
    imgSrc: "path/to/student2.jpg"
  }
];

const Testimonials = () => {
  return (
    <Container fluid className="my-5 p-5 testimonials bg-light">
         <p className="text-center mb-3 h6 rn1" style={{ color: "#0A1172" }}>TESTIMONIAL</p>
         <h2 className="text-center mb-4">What Students Saying</h2>
      <Carousel>
        {testimonials.map((testimonial, index) => (
          <Carousel.Item key={index}>
            <div className="d-flex flex-column align-items-center text-center">
              <p className="testimonial-text">{testimonial.text}</p>
              <div className="d-flex align-items-center">
                <img src={testimonial.imgSrc} alt={testimonial.name} className="testimonial-img" />
                <div className="testimonial-info">
                  <h5>{testimonial.name}</h5>
                  <p>{testimonial.role}</p>
                </div>
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </Container>
  );
};

export default Testimonials;
