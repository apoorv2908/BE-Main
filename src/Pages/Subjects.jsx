import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./Styles/Classes.css";
import config from "../config";
import { decodeId } from "../Components/Access/EncodeDecode";
import { encodeId } from "../Components/Access/EncodeDecode";
import nrf from "./Assets/nrfimage.jpeg";

const Subjects = () => {
  const { subject_id } = useParams();
  const decodedId = decodeId(subject_id); // Decode the ID for internal use
  const [books, setBooks] = useState([]);
  const [subjectContent, setSubjectContent] = useState(""); // State for subject content
  const [subjectName, setSubjectName] = useState(""); // State for subject name
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch both books and subject details (including subject name)
    fetch(
      `${config.apiBaseUrl}/fullmarks-user/navbar/fetchbooksforsubjects.php?subject_id=${decodedId}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setBooks(data.books);
          setSubjectContent(data.subjectContent); // Set subject content
          setSubjectName(data.subjectName); // Set subject name
        } else {
          console.error("Unexpected response data:", data);
          setBooks([]);
          setSubjectName(data.subjectName); // Still set the subject name even if no books
        }
      })
      .catch((error) => console.error("Error fetching book details:", error));
  }, [subject_id]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredBooks = books.filter((book) =>
    book.book_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="py-2">
        <div>
          {subjectName && (
            <div
              className="p-3 h3 mx-3 text-center text-uppercase fw-bold"
              style={{
                background:
                  "linear-gradient(to right, #192152, #FF7F50, #FFA07A, white)",
                color: "white ",
                marginTop: "80px",
              }}
            >
              Books for {subjectName}
            </div>
          )}
        </div>

        <hr></hr>
        {/* Display the subject content */}
        <div className="bg-light p-3 mt-3 rounded">
          <div dangerouslySetInnerHTML={{ __html: subjectContent }} />
        </div>
        <div className="bg-white  p-3 mb-5 rounded">
          <div className="col-md-12 d-flex justify-content-between">
            {subjectName && (
              <div className="text-black h3 fw-bold">
                Explore our {subjectName} Series
              </div>
            )}
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
          <div className="row mt-3">
            {filteredBooks.length === 0 && (
              <div className="col-12 text-center mt-5 mb-5">
                <img className="nfr-dim" src={nrf} alt="No Books Found" />
                <p className="fw-bold">No books found.</p>
              </div>
            )}
            {filteredBooks.map((book) => (
              <div key={book.book_id} className="col-md-3 mb-4">
                <div className="book-item rounded">
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
                  <div className="h4 text-center">
                    <Link
                      to={`/book/${encodeId(book.book_id)}`}
                      className="book-link"
                    >
                      {book.book_name}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subjects;
