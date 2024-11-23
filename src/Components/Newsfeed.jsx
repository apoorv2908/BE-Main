import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './Styles/Newsfeed.css';

const news = [
  {
    imgSrc: "path/to/news1.jpg",
    admin: "Admin",
    date: "May 10, 2020",
    title: "Modern School the lovely valley team work",
    description: "the acquisition of knowledge, skills, values beliefs, and habits. Educational methods include teaching, training, storytelling",
    category: "College"
  },
  {
    imgSrc: "path/to/news2.jpg",
    admin: "Admin",
    date: "December 15, 2020",
    title: "Education is The Process of Facilitating Learning",
    description: "the acquisition of knowledge, skills, values beliefs, and habits. Educational methods include teaching, training, storytelling",
    category: "College"
  },
  {
    imgSrc: "path/to/news3.jpg",
    admin: "Admin",
    date: "October 15, 2020",
    title: "High school program starting soon 2021",
    description: "the acquisition of knowledge, skills, values beliefs, and habits. Educational methods include teaching, training, storytelling",
    category: "College"
  }
];

const Newsfeed = () => {
  return (
    <Container className="my-5">
<p className="mnr text-center mb-3 h6" style={{ color: "#0A1172" }}>NEWS UPDATES</p>
<h2 className="text-center mb-4">Latest news & events</h2>
      <Row>
        {news.map((item, index) => (
          <Col key={index} md={4} className="mb-4">
            <Card>
              <Card.Img variant="top" src={item.imgSrc} />
              <Card.Body>
                <Card.Subtitle className="mb-2 text-muted">{item.admin} <br /> {item.date}</Card.Subtitle>
                <Card.Title>{item.title}</Card.Title>
                <Card.Text>{item.description}</Card.Text>
                <Card.Text className="text-muted">{item.category}</Card.Text>
                <Button variant="link">Read More</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Newsfeed;
