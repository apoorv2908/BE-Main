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
    <div className="py-2">
      <div
        className="p-3 h3 mx-3 fw-bold text-uppercase"
        style={{
          background: "linear-gradient(to right, #192152, white)",
          color: "white",
          marginTop: "80px",
        }}
      >
        {book.book_name}
        <br></br>
        <span className="h6">{book.subject_name}</span>
        <span className="h6"> - {book.class_name}</span>
      </div>
      <div className="row m-5">
        <div className="col-md-6 d-flex flex-column align-items-center ">
          {book.book_cover && (
            <img
              src={`${config.apiBaseUrl}/admin/fullmarks-server/uploads/book_cover/${book.book_cover}`}
              alt="Book Cover"
              className="book-cover img-fluid rounded"
            />
          )}
        </div>

        <div
          className="col-md-5 mx-5"
          style={{ boxShadow: "0px 0px 3px snow" }}
        >
          <div className="d-flex justify-content-between mt-2">
            <h3 className="fw-bold text-uppercase">{book.book_name}</h3>
          </div>
          <p className="text-grey fst-italic pre-wrap">
            {book.book_description}
          </p>
          <hr />
          <div
            className="d-flex justify-content-center fs-5"
            style={{ gap: "20px" }}
          >
            <i
              className="bi bi-eye-fill"
              onClick={() => handleAllpageClick(book_id)}
            ></i>

            <div href={book.book_download_link}>
              <i className="bi bi-file-earmark-arrow-down"></i>
            </div>

            <i
              className="bi bi-file-arrow-down-fill"
              href={book.android_download_link}
            ></i>

            <i className="bi bi-share" onClick={handleShareClick}></i>
          </div>
          <hr></hr>
          <div className="fw-bold text-center text-underline">
            List of Chapters
          </div>
          <div className="mt-2">
            <ul style={{ listStyleType: "none" }}>
              {chapters.map((chapter) => (
                <div key={chapter.chapter_id}>
                  <li
                    onClick={() => handleChapterClick(chapter.chapter_id)}
                    className=" p-3 mt-2 bg-light custom-layout-chapters  rounded border"
                  >
                    {chapter.chapter_title}
                  </li>
                </div>
              ))}
            </ul>
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
