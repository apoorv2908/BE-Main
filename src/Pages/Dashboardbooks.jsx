import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Styles/BookDetails.css";
import config from "../config";
import AuthContext from "../Components/Access/AuthContext";
import LoginRequiredModal from "../Components/Access/LoginRequiredModal";
import { Dropdown } from "react-bootstrap"; // Import Bootstrap Dropdown

const Dashboardbooks = () => {
  const { book_id } = useParams();
  const [book, setBook] = useState({});
  const [allpages, setAllpages] = useState([]); // Storing pages as an array
  const [chapters, setChapters] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false); // State for showing the modal
  const { user } = useContext(AuthContext); // Get the user from the AuthContext
  const navigate = useNavigate(); // Get the navigate function from react-router-dom

  useEffect(() => {
    fetch(
      `${config.apiBaseUrl}/fullmarks-user/user/fetchbookdetails.php?book_id=${book_id}`
    )
      .then((response) => response.json())
      .then((data) => setBook(data))
      .catch((error) => console.error("Error fetching book details:", error));

    fetch(
      `${config.apiBaseUrl}/fullmarks-user/navbar/fetchchapters.php?book_id=${book_id}`
    )
      .then((response) => response.json())
      .then((data) => setChapters(data))
      .catch((error) => console.error("Error fetching chapters:", error));

    fetch(
      `${config.apiBaseUrl}/fullmarks-user/home/fetchallbook.php?book_id=${book_id}`
    )
      .then((response) => response.json())
      .then((data) => setAllpages(data)) // Store the pages in state
      .catch((error) => console.error("Error fetching book pages:", error));
  }, [book_id]);

  // Handle Chapter click (already in place)
  const handleChapterClick = (chapterId) => {
    if (user) {
      navigate(`/chapterpages/${chapterId}`);
    } else {
      setShowLoginModal(true);
    }
  };

  // Handle the View Book button click
  const handleAllpageClick = (bookId) => {
    if (user) {
      // Ensure pages have been fetched before navigating
      if (allpages && allpages.length > 0) {
        navigate(`/book-page/${bookId}`); // Navigate to the book pages route
      } else {
        alert("No pages available for this book!");
      }
    } else {
      setShowLoginModal(true);
    }
  };

  // Handle Share Book
  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="mt-5 bg-white p-3 mb-5 rounded">
      <div className="row">
        <div className="border diskcha">
          <p className="text-center h2 mt-4 text-uppercase fw-bold text-white">
            {book.book_name}/ {book.class_name}/ {book.subject_name}
          </p>
        </div>
        <div className="col-md-4 d-flex flex-column align-items-center">
          {book.book_cover && (
            <img
              src={`${config.apiBaseUrl}/admin/fullmarks-server/uploads/book_cover/${book.book_cover}`}
              alt="Book Cover"
              className="book-cover hipi img-fluid rounded"
            />
          )}
        </div>

        <div className="col-md-1"></div>

        <div className="col-md-7 bg-light">
          <div className="d-flex justify-content-between mt-2">
            <h4 className="fw-bold">{book.book_name}</h4>
            <div>
              <Dropdown className="mt-2">
                <Dropdown.Toggle id="dropdown-basic">
                  <i className="bi bi-three-dots-vertical"></i>{" "}
                  {/* Menu Icon */}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleAllpageClick(book_id)}>
                    <i className="bi bi-eye-fill"></i> View Book
                  </Dropdown.Item>
                  <Dropdown.Item as="a" href={book.book_download_link} download>
                    <i className="bi bi-file-earmark-arrow-down"></i> Download
                    Book
                  </Dropdown.Item>

                  {/* Android TPG Download */}
                  <Dropdown.Item
                    as="a"
                    href={book.android_download_link}
                    download
                  >
                    <i className="bi bi-file-arrow-down-fill"></i> Download TPG
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleShareClick}>
                    <i className="bi bi-share"></i> Share Book
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <p className="text-grey fst-italic pre-wrap">
            {book.book_description}
          </p>
          <hr />
          <div className="fw-bold text-center text-underline">Chapters:</div>
          <div className="mt-2">
            <ol>
              {chapters.map((chapter) => (
                <div key={chapter.chapter_id}>
                  <li
                    className="challa rounded mt-4"
                    onClick={() => handleChapterClick(chapter.chapter_id)}
                  >
                    {chapter.chapter_title}
                  </li>
                  <hr />
                </div>
              ))}
            </ol>
          </div>
        </div>
      </div>
      <LoginRequiredModal
        show={showLoginModal}
        handleClose={() => setShowLoginModal(false)}
      />
    </div>
  );
};

export default Dashboardbooks;
