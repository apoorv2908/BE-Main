import React, { useEffect, useState } from "react";
import { Card, Container, Carousel, Row, Col, Button } from "react-bootstrap";
import "./Styles/BookList.css";
import config from "../config";
import { Link } from "react-router-dom";
import { decodeId } from "../Components/Access/EncodeDecode";
import { encodeId } from "../Components/Access/EncodeDecode";

const BookList = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchPopularBooks();
  }, []);

  const fetchPopularBooks = async () => {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/fullmarks-user/home/fetchpopularbooks.php?status=Enabled`
      );
      const data = await response.json();
      if (data.success) {
        setBooks(data.books);
      } else {
        console.error("Failed to fetch popular books");
      }
    } catch (error) {
      console.error("Error fetching popular books:", error);
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
    <div className=" pt-3 m-5">
      <div className="  m-5 bg-light p-3 rounded border ">
        <p
          className="text-center about-title mb-5  h4  fw-bold"
          style={{ color: "#0A1172" }}
        >
          EXPLORE OUR POPULAR BOOKS
        </p>
        <Carousel>
          {bookChunks.map((chunk, index) => (
            <Carousel.Item key={index}>
              <Row>
                {chunk.map((book) => (
                  <Col key={book.book_id} sm={6} md={3} lg={3} className="mb-4">
                    <Card className="adjust p-1">
                      <Link
                        to={`/book/${encodeId(book.book_id)}`}
                        className="book-link"
                      >
                        {book.book_cover && (
                          <Card.Img
                            variant="top"
                            src={`${config.apiBaseUrl}/admin/fullmarks-server/uploads/book_cover/${book.book_cover}`}
                            alt={book.book_name}
                            style={{ objectFit: "cover" }}
                          />
                        )}
                      </Link>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Carousel.Item>
          ))}
        </Carousel>
        <div className="text-center mt-4">
          <Link to="./our-popular-books">
            <Button className="px-4 btn-custom">View All Books</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookList;
