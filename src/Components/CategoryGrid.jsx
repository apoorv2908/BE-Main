// src/CategoryGrid.js

import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import "./Styles/CategoryGrid.css"

const categories = [
  { id: 1, name: "Hindi", books: 2, img: "path/to/image1.jpg" },
  { id: 2, name: "Mathematics", books: 2, img: "path/to/image2.jpg" },
  { id: 3, name: "Computer Science", books: 2, img: "path/to/image3.jpg" },
  { id: 4, name: "English", books: 2, img: "path/to/image4.jpg" },
  { id: 5, name: "General Knowledge", books: 2, img: "path/to/image5.jpg" },
  { id: 6, name: "Science", books: 2, img: "path/to/image6.jpg" },
];

const CategoryGrid = () => {
  return (
    <Container className="py-5">
      <p className="text-center mb-3 h6 rn1">TOP CATEGORIES</p>
      <h2 className="text-center mb-4">Popular Subjects</h2>
      <Row>
        {categories.map(category => (
          <Col key={category.id} md={4} className="mb-4">
            <Card>
              <Card.Body className="text-center">
                <Card.Title>{category.name}</Card.Title>
                <Card.Text>{`${category.books} books`}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <div className="text-center mt-4">
        <Button variant="warning" className="px-4">View All Categories</Button>
      </div>
    </Container>
  );
};

export default CategoryGrid;
