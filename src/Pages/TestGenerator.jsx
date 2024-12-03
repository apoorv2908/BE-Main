import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import config from "../config";
import "./Styles/TestGenerator.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";

const TestGenerator = () => {
  const { teacherId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    teacherId: teacherId,
    testName: "",
    testDate: "",
    testCode: "",
    testType: "",
    schoolName: "",
    schoolLogo: null,
    maxMarks: "",
    timeAllotted: "",
    numberOfSections: "",
    testInstructions: "",
    sections: [],
  });

  const [showSectionForm, setShowSectionForm] = useState(false);
  const [showQuestionBank, setShowQuestionBank] = useState(false);
  const [questionBank, setQuestionBank] = useState([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(null);
  const [assignedBooks, setAssignedBooks] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState("");
  const [selectedChapterId, setSelectedChapterId] = useState("");
  const testRef = useRef();

  useEffect(() => {
    fetchAssignedBooks();
  }, [teacherId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, schoolLogo: e.target.files[0] });
  };

  const handleSectionChange = (index, e) => {
    const sections = [...formData.sections];
    sections[index][e.target.name] = e.target.value;
    setFormData({ ...formData, sections });
  };

  const handleQuestionChange = (sectionIndex, questionIndex, e) => {
    const sections = [...formData.sections];
    sections[sectionIndex].questions[questionIndex][e.target.name] =
      e.target.value;
    setFormData({ ...formData, sections });
  };

  const handleQuestionImageChange = (sectionIndex, questionIndex, e) => {
    const sections = [...formData.sections];
    sections[sectionIndex].questions[questionIndex].questionImage =
      e.target.files[0];
    setFormData({ ...formData, sections });
  };

  const addSection = () => {
    if (
      formData.testName &&
      formData.testDate &&
      formData.schoolName &&
      formData.maxMarks &&
      formData.timeAllotted &&
      formData.numberOfSections
    ) {
      setFormData({
        ...formData,
        sections: [
          ...formData.sections,
          {
            sectionName: "",
            questions: [
              {
                questionText: "",
                questionType: "",
                marks: "",
                options: ["", "", "", ""],
                questionImage: null,
              },
            ],
          },
        ],
      });
      setShowSectionForm(true);
    } else {
      alert("Please fill in all required test details before adding sections.");
    }
  };

  const addQuestion = (sectionIndex) => {
    const sections = [...formData.sections];
    sections[sectionIndex].questions.push({
      questionText: "",
      questionType: "",
      marks: "",
      options: ["", "", "", ""],
      questionImage: null,
    });
    setFormData({ ...formData, sections });
  };

  const deleteSection = (sectionIndex) => {
    const sections = [...formData.sections];
    sections.splice(sectionIndex, 1);
    setFormData({ ...formData, sections });
  };

  const deleteQuestion = (sectionIndex, questionIndex) => {
    const sections = [...formData.sections];
    sections[sectionIndex].questions.splice(questionIndex, 1);
    setFormData({ ...formData, sections });
  };

  const fetchAssignedBooks = () => {
    fetch(
      `${config.apiBaseUrl}/fullmarks-user/user/fetchAssignedBooks.php?teacher_id=${teacherId}`
    )
      .then((response) => response.json())
      .then((data) => setAssignedBooks(data))
      .catch((error) => console.error("Error fetching assigned books:", error));
  };

  const fetchChapters = (bookId) => {
    fetch(
      `${config.apiBaseUrl}/fullmarks-user/navbar/fetchchapters.php?book_id=${bookId}`
    )
      .then((response) => response.json())
      .then((data) => setChapters(data))
      .catch((error) => console.error("Error fetching chapters:", error));
  };

  const fetchQuestionBank = (chapterId) => {
    fetch(
      `${config.apiBaseUrl}/fullmarks-user/addtnl/fetch_question.php?chapter_id=${chapterId}`
    )
      .then((response) => response.json())
      .then((data) => setQuestionBank(data))
      .catch((error) => console.error("Error fetching questions:", error));
  };

  const openQuestionBank = (sectionIndex) => {
    setCurrentSectionIndex(sectionIndex);
    setShowQuestionBank(true);
  };

  const handleBookChange = (e) => {
    setSelectedBookId(e.target.value);
    fetchChapters(e.target.value);
  };

  const handleChapterChange = (e) => {
    setSelectedChapterId(e.target.value);
    fetchQuestionBank(e.target.value);
  };

  const addQuestionFromBank = (question) => {
    const sections = [...formData.sections];
    sections[currentSectionIndex].questions.push({
      questionText: question.question_title,
      questionType: question.question_type,
      questionImage: question.question_image
        ? `${config.apiBaseUrl}/admin/fullmarks-server/uploads/question_image/${question.question_image}`
        : null,
      marks: question.total_marks,
      options: [
        question.mcq_option_1,
        question.mcq_option_2,
        question.mcq_option_3,
        question.mcq_option_4,
      ].filter(Boolean),
    });
    setFormData({ ...formData, sections });
    setShowQuestionBank(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields for sections and questions
    for (const section of formData.sections) {
      if (!section.sectionName) {
        alert("Please fill in all required section details.");
        return;
      }
      for (const question of section.questions) {
        if (
          !question.questionText ||
          !question.questionType ||
          !question.marks
        ) {
          alert("Please fill in all required question details.");
          return;
        }
      }
    }

    const formPayload = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "sections") {
        formPayload.append(key, formData[key]);
      }
    });

    // Prepare sections and questions for submission
    formPayload.append(
      "sections",
      JSON.stringify(
        formData.sections.map((section) => ({
          ...section,
          questions: section.questions.map((question) => {
            const { questionImage, ...rest } = question;
            return rest;
          }),
        }))
      )
    );

    // Append images if they are file objects (not URLs)
    formData.sections.forEach((section, sectionIndex) => {
      section.questions.forEach((question, questionIndex) => {
        if (
          question.questionImage &&
          typeof question.questionImage !== "string"
        ) {
          formPayload.append(
            `sections[${sectionIndex}][questions][${questionIndex}][questionImage]`,
            question.questionImage
          );
        }
      });
    });

    try {
      const response = await fetch(
        `${config.apiBaseUrl}/fullmarks-user/addtnl/add_test.php`,
        {
          method: "POST",
          body: formPayload,
        }
      );
      const data = await response.json();
      console.log("Test Created Successfully:", data);
      navigate(`/teacher-dashboard/${teacherId}`);
    } catch (error) {
      console.error("Error creating test:", error);
    }
  };

  const handlePrint = () => {
    const input = testRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10);
      pdf.save("test-details.pdf");
    });
  };

  return (
    <div>
      <div
        className="p-3 h3 mx-3 text-uppercase fw-bold"
        style={{
          background: "linear-gradient(to right, #192152,  white)",
          color: "white",
          marginTop: "80px",
        }}
      >
        Test Generator
      </div>
      <div className="mx-5 mt-5 mb-5" ref={testRef}>
        {" "}
        <form onSubmit={handleSubmit} style={{ marginBottom: "100px" }}>
          <p className=" fw-bold text-center h5 p-2 bg-light">
            ENTER TEST DETAILS
          </p>
          <div>
            <label>
              Test Title<span className="text-danger fs-5">*</span>
            </label>
            <input
              type="text"
              name="testName"
              value={formData.testName}
              onChange={handleChange}
              required
              placeholder="Enter Test Title"
            />
          </div>
          <div className="mt-4">
            <label>
              Test Date<span className="text-danger fs-5">*</span>
            </label>
            <input
              type="date"
              name="testDate"
              value={formData.testDate}
              onChange={handleChange}
              placeholder="Enter Test Date"
              required
            />
          </div>
          <div className="mt-4">
            <label>Test Code</label>
            <input
              type="text"
              name="testCode"
              value={formData.testCode}
              onChange={handleChange}
              placeholder="Enter Test Code"
            />
          </div>
          <div className="mt-4">
            <label>Test Type </label>
            <input
              type="text"
              name="testType"
              value={formData.testType}
              onChange={handleChange}
              placeholder="Enter Test Type"
            />
          </div>
          <div className="mt-4">
            <label>
              School Name<span className="text-danger fs-5">*</span>
            </label>
            <input
              type="text"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleChange}
              placeholder="Enter School Name"
              required
            />
          </div>
          <div className="mt-4">
            <label>School Logo </label>
            <input
              type="file"
              name="schoolLogo"
              onChange={handleFileChange}
              className="form-control"
            />
          </div>
          <div className="mt-4">
            <label>
              Maximum Marks <span className="text-danger fs-5">*</span>
            </label>
            <input
              type="number"
              name="maxMarks"
              value={formData.maxMarks}
              onChange={handleChange}
              placeholder="Maximum Marks"
              required
            />
          </div>
          <div className="mt-4">
            <label>
              Time Allotted (in minutes)
              <span className="text-danger fs-5">*</span>
            </label>
            <input
              type="number"
              name="timeAllotted"
              value={formData.timeAllotted}
              onChange={handleChange}
              placeholder="Total Time Allotted (in minutes)"
              required
            />
          </div>
          <div className="mt-4">
            <label>
              Number of Sections<span className="text-danger fs-5">*</span>
            </label>
            <input
              type="number"
              name="numberOfSections"
              value={formData.numberOfSections}
              onChange={handleChange}
              placeholder="Total Number of Sections"
              required
            />
          </div>
          <div className="mt-4">
            <label>Test Instructions (optional):</label>
            <textarea
              name="testInstructions"
              value={formData.testInstructions}
              onChange={handleChange}
              placeholder="Add Test Instructions"
            />
          </div>

          {showSectionForm &&
            formData.sections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <hr></hr>
                <p className=" fw-bold text-center mb-3 h5 p-2 bg-light">
                  ENTER SECTION DETAILS
                </p>
                <div className="d-flex justify-content-between">
                  <h4>Section {sectionIndex + 1}</h4>

                  <button
                    type="button"
                    onClick={() => deleteSection(sectionIndex)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete Section
                  </button>
                </div>
                <label className="mt-4">
                  Section Name <span className="text-danger fs-5">*</span>
                </label>
                <input
                  type="text"
                  name="sectionName"
                  value={section.sectionName}
                  onChange={(e) => handleSectionChange(sectionIndex, e)}
                  placeholder="Enter Section Name"
                />

                {section.questions.map((question, questionIndex) => (
                  <div
                    key={questionIndex}
                    className="mx-5 border p-3 m-3 rounded"
                    style={{ boxShadow: "0px 0px 3px lightgrey" }}
                  >
                    <label className="mt-4">
                      Question {questionIndex + 1}{" "}
                      <span className="text-danger fs-5">*</span>
                    </label>
                    <input
                      type="text"
                      name="questionText"
                      value={question.questionText}
                      placeholder="Enter Question"
                      required
                      onChange={(e) =>
                        handleQuestionChange(sectionIndex, questionIndex, e)
                      }
                    />
                    <label className="mt-4">Question Image</label>
                    {question.questionImage &&
                    typeof question.questionImage === "string" ? (
                      <div>
                        <img
                          src={question.questionImage}
                          alt="Question"
                          style={{ width: "100px", height: "auto" }}
                        />
                      </div>
                    ) : null}
                    <input
                      type="file"
                      name="questionImage"
                      className="form-control"
                      onChange={(e) =>
                        handleQuestionImageChange(
                          sectionIndex,
                          questionIndex,
                          e
                        )
                      }
                    />
                    <label className="mt-4">
                      Question Type <span className="text-danger fs-5">*</span>
                    </label>
                    <select
                      name="questionType"
                      value={question.questionType}
                      required
                      className="form-control"
                      onChange={(e) =>
                        handleQuestionChange(sectionIndex, questionIndex, e)
                      }
                    >
                      <option value="">Select Type</option>
                      <option value="mcq">MCQ</option>
                      <option value="short">Short</option>
                      <option value="long">Long</option>
                      <option value="match">Match</option>
                      <option value="truefalse">True/False</option>
                    </select>
                    <label className="mt-4">
                      Question Marks <span className="text-danger fs-5">*</span>
                    </label>
                    <input
                      type="number"
                      name="marks"
                      placeholder="Add Question Marks"
                      value={question.marks}
                      onChange={(e) =>
                        handleQuestionChange(sectionIndex, questionIndex, e)
                      }
                    />
                    {question.questionType === "mcq" && (
                      <div>
                        <label>Options:</label>
                        {question.options.map((option, optionIndex) => (
                          <input
                            key={optionIndex}
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const sections = [...formData.sections];
                              sections[sectionIndex].questions[
                                questionIndex
                              ].options[optionIndex] = e.target.value;
                              setFormData({ ...formData, sections });
                            }}
                          />
                        ))}
                      </div>
                    )}
                    <div className="d-flex justify-content-end mt-3">
                      <button
                        type="button"
                        className="btn-danger btn btn-sm"
                        onClick={() =>
                          deleteQuestion(sectionIndex, questionIndex)
                        }
                      >
                        Delete Question
                      </button>
                    </div>
                  </div>
                ))}

                <div
                  className="d-flex justify-content-center "
                  style={{ gap: "20px" }}
                >
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => addQuestion(sectionIndex)}
                  >
                    Add More Questions
                  </button>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => openQuestionBank(sectionIndex)}
                  >
                    Search Questions
                  </button>
                </div>
              </div>
            ))}
          <hr></hr>
          <div
            className="mt-3 d-flex justify-content-end"
            style={{ gap: "20px" }}
          >
            <button
              type="button"
              className=" btn btn-primary "
              onClick={addSection}
            >
              Add Section
            </button>
            <button type="submit" className="btn btn-primary ">
              Create Test
            </button>
          </div>
        </form>
        {showQuestionBank && (
          <div className="question-bank-popup">
            <div className="d-flex justify-content-between">
              <h4> Question Bank</h4>

              <button
                className=" btn btn-danger btn-sm"
                type="button"
                onClick={() => setShowQuestionBank(false)}
              >
                X
              </button>
            </div>
            <hr></hr>
            <div>
              <label>Select Book</label>
              <select value={selectedBookId} onChange={handleBookChange}>
                <option value="">Select Book</option>
                {assignedBooks && assignedBooks.length > 0 ? (
                  assignedBooks.map((book) => (
                    <option key={book.book_id} value={book.book_id}>
                      {book.book_name}
                    </option>
                  ))
                ) : (
                  <option value="">No books assigned</option>
                )}
              </select>
            </div>
            <div style={{ overflowY: "scroll" }}>
              <div>
                <label className="mt-4">Select Chapter</label>
                <select
                  value={selectedChapterId}
                  onChange={handleChapterChange}
                >
                  <option value="">Select Chapter</option>
                  {chapters && chapters.length > 0 ? (
                    chapters.map((chapter) => (
                      <option
                        key={chapter.chapter_id}
                        value={chapter.chapter_id}
                      >
                        {chapter.chapter_title}
                      </option>
                    ))
                  ) : (
                    <option value="">No chapters available</option>
                  )}
                </select>
              </div>

              <table className="table table-bordered mt-4">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Marks</th>
                    <th>Options/Matches</th>
                    <th>Image</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {questionBank && questionBank.length > 0 ? (
                    questionBank.map((question, index) => (
                      <tr key={index}>
                        <td>{question.question_title}</td>
                        <td>{question.question_type}</td>
                        <td>{question.total_marks}</td>
                        <td>
                          {question.question_type === "mcq" ? (
                            <ul>
                              <li>Option 1: {question.mcq_option_1}</li>
                              <li>Option 2: {question.mcq_option_2}</li>
                              <li>Option 3: {question.mcq_option_3}</li>
                              <li>Option 4: {question.mcq_option_4}</li>
                            </ul>
                          ) : question.question_type === "match" ? (
                            <ul>
                              <li>Right Match: {question.right_match}</li>
                              <li>Left Match: {question.left_match}</li>
                            </ul>
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td>
                          {question.question_image ? (
                            <img
                              src={`${config.apiBaseUrl}/admin/fullmarks-server/uploads/question_image/${question.question_image}`}
                              alt="Question"
                              style={{ width: "100px", height: "auto" }}
                            />
                          ) : (
                            "No Image"
                          )}
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-success btn-sm"
                            onClick={() => addQuestionFromBank(question)}
                          >
                            Add
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        No questions available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestGenerator;
