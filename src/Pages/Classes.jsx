import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./Styles/Classes.css";
import config from "../config";
import { decodeId } from "../Components/Access/EncodeDecode";
import { encodeId } from "../Components/Access/EncodeDecode";
import nrf from "./Assets/nrfimage.jpeg";

const Classes = () => {
  const { class_id } = useParams();
  const decodedId = decodeId(class_id); // Decode the ID for internal use
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [className, setClassName] = useState(""); // State for class name

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(
          `${config.apiBaseUrl}/fullmarks-user/navbar/fetchbooksforclasses.php?class_id=${decodedId}`
        );
        const data = await response.json();
        if (Array.isArray(data)) {
          setBooks(data);

          setClassName(data[0].class_name); // Adjust based on actual data
        } else {
          console.error("Unexpected response data:", data);
          setBooks([]);
          setClassName(className);
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
        setClassName(className);
      }
    };

    fetchBooks();
  }, [decodedId, class_id]); // Dependency array includes class_id

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredBooks = books.filter((book) =>
    book.book_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mt-2 py-2">
        <div>
          {className && (
            <div
              className="p-3 h3 mx-3 text-uppercase fw-bold"
              style={{
                background: "linear-gradient(to right, #192152, white)",
                color: "white",
                marginTop: "80px",
              }}
            >
              {className}
            </div>
          )}

          <div className="col-md-12 d-flex p-3 justify-content-between">
            <div className="text-black mt-2 h3 fw-bold">
              Explore Books for {className}
            </div>
            <div className="col-md-2">
              <input
                type="text"
                className="form-control"
                placeholder="Search by book name"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
        <div className="bg-white p-3 mt-3 mb-5 rounded">
          <div className="row mt-3">
            {filteredBooks.length === 0 ? (
              <div className="col-12 text-center">
                <img className="nfr-dim" src={nrf} alt="No books found" />
                <p className="fw-bold">No books found.</p>
              </div>
            ) : (
              filteredBooks.map((book) => (
                <div key={book.book_id} className="col-md-3 mb-4 d-flex">
                  <div className="book-item flex-grow-1 d-flex flex-column rounded">
                    <Link
                      to={`/book/${encodeId(book.book_id)}`}
                      className="book-link"
                    >
                      {book.book_cover && (
                        <div className="book-cover">
                          <img
                            src={`${config.apiBaseUrl}/admin/fullmarks-server/uploads/book_cover/${book.book_cover}`}
                            alt="Book Cover"
                            className="img-fluid"
                          />
                        </div>
                      )}
                    </Link>
                    <div className="h4 text-center fw-bold text-uppercase flex-grow-1">
                      <Link
                        to={`/book/${encodeId(book.book_id)}`}
                        className="book-link"
                      >
                        {book.book_name}
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classes;
