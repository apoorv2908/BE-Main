import React, { useEffect, useState } from 'react';
import { Card, Container, Carousel, Row, Col, Button } from 'react-bootstrap';
import "./Styles/BookList.css"
import config from "../config"



const Popularbooks = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchPopularBooks();
  }, []);

  const fetchPopularBooks = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/fullmarks-user/home/fetchpopularbooks.php?status=Enabled`);
      const data = await response.json();
      if (data.success) {
        setBooks(data.books);
      } else {
        console.error('Failed to fetch popular books');
      }
    } catch (error) {
      console.error('Error fetching popular books:', error);
    }
  };

  const chunkArray = (array, chunkSize) => {
    const results = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      results.push(array.slice(i, i + chunkSize));
    }
    return results;
  };

  const bookChunks = chunkArray(books, 4);

  return (
    <div className= 'bg-light pt-3 m-5'>
            <p className="text-center mb-3 mt-5 h6 rn1" style={{ color: "#0A1172" }}>EXPLORE OUR POPULAR BOOKS</p>
      <div className= 'pt-2 d-flex justify-content-center h2 '>Our Popular Books</div>
    <div className= ' bg-light m-5'>                
      <Carousel >
        {bookChunks.map((chunk, index) => (
          <Carousel.Item key={index}>
            <Row>
              {chunk.map((book) => (
                <Col key={book.book_id} sm={6} md={4} lg={3} className="mb-4">
                  <Card>
                    {book.book_cover && (
                      <Card.Img
                        variant="top"
                        src={`${config.apiBaseUrl}/admin/fullmarks-server/uploads/book_cover/${book.book_cover}`}
                        alt={book.book_name}
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                    <Card.Body>
                      <Card.Title>{book.book_name}</Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Carousel.Item>
        ))}
      </Carousel>
      
    </div>
    </div>
  );
};

export default Popularbooks;
