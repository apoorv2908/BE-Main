import React, { useState, useEffect } from "react";
import config from "../config";
import { Button, Form, Modal } from "react-bootstrap";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf"; // Import jsPDF
import { useNavigate } from "react-router-dom";

const TestGenerator = () => {
  const { teacher_id } = useParams();

  const [formData, setFormData] = useState({
    testTitle: "",
    testCode: "",
    testDate: "",
    schoolName: "",
    examType: "",
    maxMarks: "",
    timeAllowed: "",
    bookName: "", // This will hold the selected book's ID
    numOfSections: "",
    testInstructions: "",
    teacher_id: teacher_id,
  });

  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [chapters, setChapters] = useState([]);
  const [sections, setSections] = useState([]);

  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [fetchedQuestions, setFetchedQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [errors, setErrors] = useState({});

  const [currentSectionIndex, setCurrentSectionIndex] = useState(null);

  // State to manage the form step
  const [currentStep, setCurrentStep] = useState(1);

  // Toggle modal visibility
  const handleShowModal = () => setShowQuestionModal(true);
  const handleCloseModal = () => setShowQuestionModal(false);

  // Fetch books assigned to the teacher
  const fetchBooks = () => {
    fetch(
      `${config.apiBaseUrl}/fullmarks-user/user/fetchAssignedBooks.php?teacher_id=${teacher_id}`
    )
      .then((response) => response.json())
      .then((data) => {
        setBooks(data);
      })
      .catch((error) => console.error("Error fetching books:", error));
  };

  // Fetch chapters based on selected book_id
  const fetchChapters = (bookId) => {
    fetch(
      `${config.apiBaseUrl}/fullmarks-user/navbar/fetchchapters.php?book_id=${bookId}`
    )
      .then((response) => response.json())
      .then((data) => setChapters(data))
      .catch((error) => console.error("Error fetching chapters:", error));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Fetch chapters whenever selectedBook changes
  useEffect(() => {
    if (selectedBook) {
      fetchChapters(selectedBook);
    }
  }, [selectedBook]);

  // Update the formData and selectedBook whenever a book is selected
  const handleBookChange = (e) => {
    const bookId = e.target.value;
    setFormData({ ...formData, bookName: bookId });
    setSelectedBook(bookId); // Trigger chapters fetch
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleQuestionTypeChange = (sectionIndex, questionIndex, e) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions[questionIndex].questionType =
      e.target.value;
    setSections(newSections);
  };

  const handleQuestionTextChange = (sectionIndex, questionIndex, e) => {
    const newSections = [...sections];
    newSections[sectionIndex].questions[questionIndex].questionText =
      e.target.value;
    setSections(newSections);
  };

  const handleSectionChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setFormData({
      ...formData,
      numOfSections: value,
    });

    // Update the sections array with new number of sections
    const newSections = Array.from({ length: value }, (_, i) => ({
      sectionNumber: i + 1,
      sectionIntro: "",
      chapterName: "", // To store chapter_id
      questions: [],
    }));
    setSections(newSections);
  };

  const handleSectionFormChange = (index, e) => {
    const newSections = [...sections];
    newSections[index] = {
      ...newSections[index],
      [e.target.name]: e.target.value,
    };
    setSections(newSections);
  };

  const handleAddQuestion = (index) => {
    const newSections = [...sections];
    newSections[index].questions.push({ questionType: "", questionText: "" });
    setSections(newSections);
  };

  const navigate = useNavigate();

  const handleSave = async () => {
    const data = {
      ...formData,
      sections: sections,
    };

    try {
      const response = await fetch(
        `${config.apiBaseUrl}/fullmarks-user/addtnl/save_test.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        alert("Test saved successfully!");
        generatePDF(); // Generate the PDF when the test is saved

        // Redirect to the dashboard after saving
        navigate(`/teacher-dashboard/${teacher_id}`);
      } else {
        alert("There was an error saving the test.");
      }
    } catch (error) {
      console.error("There was an error saving the test!", error);
    }
  };

  // Step Navigation
  const handleNextStep = () => {
    if (validateForm()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.testTitle) newErrors.testTitle = "Test title is required";
    if (!formData.testDate) newErrors.testDate = "Test date is required";
    if (!formData.schoolName) newErrors.schoolName = "School name is required";
    if (!formData.maxMarks) newErrors.maxMarks = "Maximum marks are required";
    if (!formData.timeAllowed)
      newErrors.timeAllowed = "Time allowed is required";
    if (!formData.bookName) newErrors.bookName = "Book selection is required";
    if (!formData.numOfSections)
      newErrors.numOfSections = "Number of sections is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchQuestions = (chapterId) => {
    fetch(
      `${config.apiBaseUrl}/fullmarks-user/addtnl/fetch_question.php?chapter_id=${chapterId}`
    )
      .then((response) => response.json())
      .then((data) => setFetchedQuestions(data))
      .catch((error) => console.error("Error fetching questions:", error));
  };

  const handleSearchQuestionClick = (index) => {
    const chapterId = sections[index].chapterName;
    if (chapterId) {
      setCurrentSectionIndex(index); // Track which section is being modified
      fetchQuestions(chapterId); // Fetch questions for the selected chapter
      setShowQuestionModal(true); // Open the modal to display fetched questions
    } else {
      alert("Please select a chapter first.");
    }
  };

  const handleCheckboxChange = (question) => {
    setSelectedQuestions((prevSelected) => {
      if (prevSelected.includes(question)) {
        return prevSelected.filter((q) => q !== question);
      } else {
        return [...prevSelected, question];
      }
    });
  };

  const handleRemoveQuestion = (sectionIndex, questionIndex) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].questions.splice(questionIndex, 1);
    setSections(updatedSections);
  };

  const handleAddSelectedQuestions = () => {
    const updatedSections = [...sections];
    selectedQuestions.forEach((question) => {
      updatedSections[currentSectionIndex].questions.push({
        questionType: question.question_type,
        questionText: question.question_title,
      });
    });
    setSections(updatedSections);

    setFetchedQuestions((prevQuestions) =>
      prevQuestions.filter((question) => !selectedQuestions.includes(question))
    );

    setSelectedQuestions([]); // Clear selected questions
    handleCloseModal(); // Close modal
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Title of the question paper
    doc.setFontSize(16);
    doc.text(`Test Title: ${formData.testTitle}`, 10, 10);
    doc.setFontSize(12);
    doc.text(`Test Code: ${formData.testCode}`, 10, 20);
    doc.text(`Test Date: ${formData.testDate}`, 10, 30);
    doc.text(`School Name: ${formData.schoolName}`, 10, 40);
    doc.text(`Exam Type: ${formData.examType}`, 10, 50);
    doc.text(`Maximum Marks: ${formData.maxMarks}`, 10, 60);
    doc.text(`Time Allowed: ${formData.timeAllowed} minutes`, 10, 70);
    doc.text(`Instructions: ${formData.testInstructions}`, 10, 80);

    let yOffset = 100; // To dynamically place text

    sections.forEach((section, index) => {
      doc.setFontSize(14);
      doc.text(`Section ${index + 1}:`, 10, yOffset);
      doc.setFontSize(12);
      yOffset += 10;
      if (section.sectionIntro) {
        doc.text(`Introduction: ${section.sectionIntro}`, 10, yOffset);
        yOffset += 10;
      }

      section.questions.forEach((question, qIndex) => {
        doc.text(`${qIndex + 1}. ${question.questionText}`, 10, yOffset);
        yOffset += 10;

        // Check if new page needed
        if (yOffset > 270) {
          doc.addPage();
          yOffset = 20; // Reset yOffset for new page
        }
      });

      yOffset += 10; // Add some space after each section
    });

    // Save the PDF
    doc.save(`${formData.testTitle}_Question_Paper.pdf`);
  };

  return (
    <div>
      {currentStep === 1 && (
        <>
          <div
            className="p-3 h3 "
            style={{
              background:
                "linear-gradient(to right, #192152, #FF7F50, #FFA07A, white)",
              color: "white",
              marginTop: "80px",
            }}
          >
            TEST GENERATOR<br></br>
          </div>

          <form className="mb-5 mx-5 px-5 pb-3  rounded">
            <div
              className="p-1 mt-5 text-white mb-3 "
              style={{ backgroundColor: "#192152" }}
            >
              ENTER TEST DETAILS
            </div>
            <div className="input-container mt-5">
              <input
                type="text"
                name="testTitle"
                value={formData.testTitle}
                onChange={handleInputChange}
                className={`custom-input  ${
                  errors.testTitle ? "is-invalid" : ""
                }`}
                placeholder=" "
                required
              />
              <label className="input-label fw-bold">
                Test Title<span className="text-danger">*</span>
              </label>
              {errors.testTitle && (
                <div className="invalid-feedback">{errors.testTitle}</div>
              )}
            </div>

            <div class="input-container mt-5">
              <input
                type="text"
                name="testCode"
                value={formData.testCode}
                onChange={handleInputChange}
                required
                class="custom-input "
                placeholder=" "
              />
              <label class="input-label fw-bold">Test Code</label>
            </div>

            <div class="input-container mt-5">
              <input
                type="date"
                name="testDate"
                value={formData.testDate}
                onChange={handleInputChange}
                required
                className={`custom-input  ${
                  errors.testDate ? "is-invalid" : ""
                }`}
                placeholder=" "
              />
              <label class="input-label fw-bold">
                Test Date<span className="text-danger">*</span>
              </label>
              {errors.testDate && (
                <div className="invalid-feedback">{errors.testDate}</div>
              )}
            </div>

            <div class="input-container mt-5">
              <input
                type="text"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleInputChange}
                required
                className={`custom-input ${
                  errors.schoolName ? "is-invalid" : ""
                }`}
                placeholder=" "
              />
              <label class="input-label fw-bold">
                School Name<span className="text-danger">*</span>
              </label>
              {errors.schoolName && (
                <div className="invalid-feedback">{errors.schoolName}</div>
              )}
            </div>

            <div class="input-container mt-5">
              <input
                type="text"
                name="examType"
                value={formData.examType}
                onChange={handleInputChange}
                class="custom-input"
                placeholder=" "
                required
              />
              <label class="input-label fw-bold">Exam Type</label>
            </div>

            <div class="input-container mt-5">
              <input
                type="number"
                name="maxMarks"
                value={formData.maxMarks}
                onChange={handleInputChange}
                className={`custom-input  ${
                  errors.maxMarks ? "is-invalid" : ""
                }`}
                placeholder=" "
                required
              />
              <label class="input-label fw-bold">
                Maximum Marks<span className="text-danger">*</span>
              </label>
              {errors.maxMarks && (
                <div className="invalid-feedback">{errors.maxMarks}</div>
              )}
            </div>

            <div class="input-container mt-5">
              <input
                type="number"
                name="timeAllowed"
                value={formData.timeAllowed}
                onChange={handleInputChange}
                className={`custom-input ${
                  errors.maxMarks ? "is-invalid" : ""
                }`}
                placeholder=" "
                required
              />
              <label class="input-label fw-bold">
                Time Allowed<span className="text-danger ">*</span> (in minutes)
              </label>
              {errors.timeAllowed && (
                <div className="invalid-feedback">{errors.timeAllowed}</div>
              )}
            </div>

            <div class="input-container mt-5">
              <select
                id="selectBook"
                className={`custom-select ${
                  errors.selectBook ? "is-invalid" : ""
                }`}
                placeholder=" "
                value={formData.bookName}
                onChange={handleBookChange}
                required
              >
                <option value="">-- Select Book --</option>
                {books.map((book) => (
                  <option key={book.book_id} value={book.book_id}>
                    {book.book_name}
                  </option>
                ))}
              </select>
              <label htmlFor="selectBook" class="input-label">
                Select Book <span class="text-danger">*</span>
              </label>
              {errors.selectBook && (
                <div className="invalid-feedback">{errors.selectBook}</div>
              )}
            </div>

            <div class="input-container mt-5">
              <input
                type="number"
                name="numOfSections"
                value={formData.numOfSections}
                onChange={handleSectionChange}
                className={`custom-input ${
                  errors.numOfSections ? "is-invalid" : ""
                }`}
                placeholder=" "
                required
                min="1"
              />
              <label class="input-label fw-bold">
                Number of Section(s)<span className="text-danger">*</span>
              </label>
              {errors.numOfSections && (
                <div className="invalid-feedback">{errors.numOfSections}</div>
              )}
            </div>

            <div className="input-container mt-5">
              <textarea
                name="testInstructions"
                value={formData.testInstructions}
                onChange={handleInputChange}
                className="custom-input"
                placeholder=" "
              ></textarea>
              <label className="input-label fw-bold">Test Instructions</label>
            </div>

            <div className="d-flex justify-content-end mt-5">
              <Button onClick={handleNextStep} className="btn-custom">
                Next
              </Button>
            </div>
          </form>
        </>
      )}

      {currentStep === 2 && (
        <>
          <div
            className="p-3 h3 "
            style={{
              background:
                "linear-gradient(to right, #192152, #FF7F50, #FFA07A, white)",
              color: "white",
              marginTop: "80px",
            }}
          >
            TEST GENERATOR<br></br>
            <p className="h6">SECTION DETAILS</p>
          </div>

          {sections.map((section, index) => (
            <div key={index}>
              <h5 className="mt-5 px-5 mx-5 fw-bold text-uppercase">
                Section {index + 1}
              </h5>
              <div
                className="px-5 mx-5 border"
                style={{ boxShadow: "0px 0px 7px lightgrey" }}
              >
                <div class="input-container mt-5 ">
                  <input
                    type="text"
                    name="sectionIntro"
                    value={section.sectionIntro}
                    onChange={(e) => handleSectionFormChange(index, e)}
                    class="custom-input"
                    placeholder=" "
                  />
                  <label class="input-label fw-bold">
                    Section Introduction
                  </label>
                </div>

                <div className="input-container mt-5">
                  <select
                    className="custom-select"
                    name="chapterName"
                    value={sections[index].chapterName}
                    onChange={(e) => handleSectionFormChange(index, e)}
                    required
                  >
                    <option value="">-- Select Chapter --</option>
                    {chapters.map((chapter) => (
                      <option
                        key={chapter.chapter_id}
                        value={chapter.chapter_id}
                      >
                        {chapter.chapter_title}
                      </option>
                    ))}
                  </select>
                  <label
                    htmlFor="selectChapter"
                    className="input-label fw-bold"
                  >
                    Select Chapter <span className="text-danger">*</span>
                  </label>
                </div>
                <div class="input-container mt-5">
                  {section.questions.map((question, qIndex) => (
                    <div
                      key={qIndex}
                      className=" rounded border px-3 mb-4 mx-5"
                      style={{ boxShadow: "0px 0px 2px lightgrey" }}
                    >
                      <div className="fw-bold text-underline mt-2">
                        Question {qIndex + 1}:
                      </div>

                      <div class="input-container mt-5 ">
                        <select
                          value={question.questionType}
                          onChange={(e) =>
                            handleQuestionTypeChange(index, qIndex, e)
                          }
                          class="custom-input"
                          placeholder=" "
                        >
                          <option value="">-- Select Question Type --</option>
                          <option value="mcq">MCQ</option>
                          <option value="trueFalse">True/False</option>
                          <option value="short">Short Answer</option>
                          <option value="long">Long Answer</option>
                          <option value="match">Match the Columns</option>
                          <option value="scq">Single Choice Question</option>
                        </select>
                        <label class="input-label fw-bold">
                          Question Type
                          <span className="text-danger">*</span>
                        </label>

                        {question.questionType && (
                          <>
                            <div class="input-container mt-5">
                              <textarea
                                type="text"
                                value={question.questionText}
                                onChange={(e) =>
                                  handleQuestionTextChange(index, qIndex, e)
                                }
                                class="custom-input"
                                placeholder=" "
                              />
                              <label class="input-label fw-bold">
                                Enter Your Question
                                <span className="text-danger">*</span>
                              </label>
                            </div>
                            <Button
                              variant="danger"
                              className="mt-3"
                              onClick={() =>
                                handleRemoveQuestion(index, qIndex)
                              }
                            >
                              Remove Question
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  <div
                    className="d-flex justify-content-center mt-3 "
                    style={{ gap: "20px" }}
                  >
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => handleAddQuestion(index)}
                    >
                      Add Question
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => handleSearchQuestionClick(index)}
                    >
                      Search Questions
                    </button>
                    {/* Modal for Displaying Fetched Questions */}
                  </div>
                </div>
                {showQuestionModal && (
                  <Modal show={showQuestionModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                      <Modal.Title>Select Questions</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <ul className="list-group">
                        {fetchedQuestions
                          .filter(
                            (question) =>
                              !sections
                                .flatMap((section) => section.questions)
                                .some(
                                  (q) =>
                                    q.questionText === question.question_title
                                )
                          )
                          .map((question, index) => (
                            <li
                              key={index}
                              className="list-group-item d-flex align-items-center"
                            >
                              <input
                                type="checkbox"
                                checked={selectedQuestions.includes(question)}
                                onChange={() => handleCheckboxChange(question)}
                                className="form-check-input me-3"
                              />
                              <div>
                                <strong>Type:</strong> {question.question_type}
                                <br />
                                <strong>Question:</strong>{" "}
                                {question.question_title}
                                <div className="comb">
                                  {question.mcq_option_1}{" "}
                                  {question.mcq_option_2}{" "}
                                  {question.mcq_option_3}{" "}
                                  {question.mcq_option_4}{" "}
                                </div>
                                <div className="comb">
                                  {question.left_match} {question.right_match}
                                </div>
                              </div>
                            </li>
                          ))}
                      </ul>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                      </Button>
                      <Button
                        variant="primary"
                        onClick={handleAddSelectedQuestions}
                      >
                        Add Selected Questions
                      </Button>
                    </Modal.Footer>
                  </Modal>
                )}
              </div>
            </div>
          ))}
          <div
            className="d-flex justify-content-end mt-5 mb-5 mx-5"
            style={{ gap: "20px" }}
          >
            <Button onClick={handlePreviousStep} className="btn-custom">
              Previous
            </Button>
            <Button onClick={handleSave} className="btn-custom">
              Save and Print Test
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default TestGenerator;
