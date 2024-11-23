import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import config from "../config";

const Mytest = () => {
  const navigate = useNavigate();
  const { test_id } = useParams(); // Get test_id from the URL

  const [testDetails, setTestDetails] = useState({
    testName: "",
    testDate: "",
    maximumMarks: "",
    schoolName: "",
    totalTimeAlloted: "",
    testInstructions: "",
  });
  const [questions, setQuestions] = useState([
    {
      resourceTitle: "",
      resourceType: "",
      totalMarks: "",
      questionImage: null,
      questionAnswer: "",
      allotedSection: "",
      mcqOptions: ["", "", "", ""],
      matchPair: { left: "", right: "" },
    },
  ]);
  const [isTestSaved, setIsTestSaved] = useState(false);

  const handleAddMoreQuestion = () => {
    setQuestions([
      ...questions,
      {
        resourceTitle: "",
        resourceType: "",
        totalMarks: "",
        questionImage: null,
        questionAnswer: "",
        allotedSection: "",
        mcqOptions: ["", "", "", ""],
        matchPair: { left: "", right: "" },
      },
    ]);
  };

  const handleTestDetailsSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("test_id", test_id); // Append the test_id from URL
      formData.append("testName", testDetails.testName);
      formData.append("testDate", testDetails.testDate);
      formData.append("maximumMarks", testDetails.maximumMarks);
      formData.append("schoolName", testDetails.schoolName);
      formData.append("totalTimeAlloted", testDetails.totalTimeAlloted);
      formData.append("testInstructions", testDetails.testInstructions);

      const response = await fetch(
        `${config.apiBaseUrl}/fullmarks-user/addtnl/addtestdetails.php`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (data.success) {
        alert("Test details added successfully");
        setIsTestSaved(true);
      } else {
        alert("Failed to add test details");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error adding test details");
    }
  };

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    try {
      for (const question of questions) {
        const formData = new FormData();
        formData.append("test_id", test_id); // Append the test_id from URL
        formData.append("resourceTitle", question.resourceTitle);
        formData.append("resourceType", question.resourceType);
        if (question.totalMarks)
          formData.append("totalMarks", question.totalMarks);
        if (question.questionImage)
          formData.append("questionImage", question.questionImage);
        if (question.questionAnswer)
          formData.append("questionAnswer", question.questionAnswer);
        if (question.allotedSection)
          formData.append("allotedSection", question.allotedSection);

        if (question.resourceType === "mcq") {
          question.mcqOptions.forEach((option, index) =>
            formData.append(`mcqOption${index + 1}`, option)
          );
        }

        if (question.resourceType === "match") {
          formData.append("leftMatch", question.matchPair.left);
          formData.append("rightMatch", question.matchPair.right);
        }

        const response = await fetch(
          `${config.apiBaseUrl}/fullmarks-user/addtnl/addquestion.php`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();
        if (!data.success) {
          alert("Failed to add question");
          return;
        }
      }
      alert("Questions added successfully");
      navigate("/question-bank");
    } catch (error) {
      console.error("Error:", error);
      alert("Error adding questions");
    }
  };

  const handleTestDetailsChange = (field, value) => {
    setTestDetails({ ...testDetails, [field]: value });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleMcqOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].mcqOptions[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          {/* Main content */}
          <div className="col-md-12">
            <div className="container mt-3">
              {/* Topbar */}
              <div className="row">
                {!isTestSaved ? (
                  <div className="col-md-12 bg-white shadow-lg p-3 mb-5 bg-white rounded">
                    <div className="text-grey h6 fw-bold">Test Details</div>
                    <hr></hr>
                    <form onSubmit={handleTestDetailsSubmit}>
                      {/* Test Details Form */}
                      <label className="fw-bold">
                        Test Name<span className="text-danger">*</span>
                      </label>
                      <br />
                      <input
                        type="text"
                        className="custom-input"
                        value={testDetails.testName}
                        required
                        onChange={(e) =>
                          handleTestDetailsChange("testName", e.target.value)
                        }
                      />
                      {/* Other form fields... */}
                      <br />
                      <label className="fw-bold">
                        Test Date<span className="text-danger">*</span>
                      </label>
                      <br />
                      <input
                        type="date"
                        className="custom-input"
                        value={testDetails.testDate}
                        required
                        onChange={(e) =>
                          handleTestDetailsChange("testDate", e.target.value)
                        }
                      />
                      <br />
                      <label className="fw-bold">
                        Maximum Marks<span className="text-danger">*</span>
                      </label>
                      <br />
                      <input
                        type="number"
                        className="custom-input"
                        value={testDetails.maximumMarks}
                        required
                        onChange={(e) =>
                          handleTestDetailsChange(
                            "maximumMarks",
                            e.target.value
                          )
                        }
                      />
                      <br />
                      <label className="fw-bold">
                        School Name<span className="text-danger">*</span>
                      </label>
                      <br />
                      <input
                        type="text"
                        className="custom-input"
                        value={testDetails.schoolName}
                        required
                        onChange={(e) =>
                          handleTestDetailsChange("schoolName", e.target.value)
                        }
                      />
                      <br />
                      <label className="fw-bold">
                        Total Time Alloted<span className="text-danger">*</span>
                      </label>
                      <br />
                      <input
                        type="text"
                        className="custom-input"
                        value={testDetails.totalTimeAlloted}
                        required
                        onChange={(e) =>
                          handleTestDetailsChange(
                            "totalTimeAlloted",
                            e.target.value
                          )
                        }
                      />
                      <br />
                      <label className="fw-bold">
                        Test Instructions<span className="text-danger">*</span>
                      </label>
                      <br />
                      <textarea
                        className="custom-input"
                        value={testDetails.testInstructions}
                        required
                        rows={5}
                        onChange={(e) =>
                          handleTestDetailsChange(
                            "testInstructions",
                            e.target.value
                          )
                        }
                      />
                      <br />

                      <div className="d-flex justify-content-end mt-3 ">
                        <button className="btn btn-primary" type="submit">
                          Save Test Details
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="col-md-12 bg-white shadow-lg p-3 mb-5 bg-white rounded">
                    <div className="text-grey h6 fw-bold">
                      Question Bank: Add Questions
                    </div>
                    <hr></hr>
                    <form onSubmit={handleQuestionSubmit}>
                      {/* Questions Form */}
                      {questions.map((question, index) => (
                        <div key={index} className="mb-5">
                          {/* Question Fields */}
                          <label className="fw-bold">
                            Question Type<span className="text-danger">*</span>
                          </label>
                          <br />
                          <select
                            className="custom-input cursor"
                            value={question.resourceType}
                            required
                            onChange={(e) =>
                              handleQuestionChange(
                                index,
                                "resourceType",
                                e.target.value
                              )
                            }
                          >
                            <option value="">-- Select Question Type --</option>
                            <option value="mcq">MCQ</option>
                            <option value="trueFalse">True/False</option>
                            <option value="short">Short Answer</option>
                            <option value="long">Long Answer</option>
                            <option value="match">Match the Columns</option>
                          </select>
                          {/* Other question fields... */}
                          <label className="fw-bold">
                            Enter Question{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <br />
                          <textarea
                            className="custom-input"
                            value={question.resourceTitle}
                            placeholder="Enter Question"
                            required
                            rows={5}
                            cols={50}
                            onChange={(e) =>
                              handleQuestionChange(
                                index,
                                "resourceTitle",
                                e.target.value
                              )
                            }
                          />
                          <br />
                          {question.resourceType === "mcq" &&
                            question.mcqOptions.map((option, optionIndex) => (
                              <div key={optionIndex} className="mx-5 mt-3 ">
                                <label className="fw-bold">
                                  Option {optionIndex + 1}
                                </label>
                                <input
                                  type="text"
                                  className="custom-input mt-1"
                                  value={option}
                                  onChange={(e) =>
                                    handleMcqOptionChange(
                                      index,
                                      optionIndex,
                                      e.target.value
                                    )
                                  }
                                />
                                <br />
                              </div>
                            ))}

                          {question.resourceType === "match" && (
                            <div className="d-flex justify-content-between mx-5 mt-4">
                              <div>
                                <label className="fw-bold">
                                  Left Side Match
                                </label>
                                <textarea
                                  type="text"
                                  className="custom-input mt-1"
                                  value={question.matchPair.left}
                                  onChange={(e) =>
                                    handleQuestionChange(index, "matchPair", {
                                      ...question.matchPair,
                                      left: e.target.value,
                                    })
                                  }
                                />
                                <br />
                              </div>
                              <div className="mt-3">
                                <i className="bi bi-arrows"></i>
                              </div>
                              <div>
                                <label className="fw-bold ">
                                  Right Side Match
                                </label>
                                <textarea
                                  type="text"
                                  className="custom-input mt-1"
                                  value={question.matchPair.right}
                                  onChange={(e) =>
                                    handleQuestionChange(index, "matchPair", {
                                      ...question.matchPair,
                                      right: e.target.value,
                                    })
                                  }
                                />
                                <br />
                              </div>
                            </div>
                          )}

                          <label className="fw-bold">
                            Alloted Section{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <br />
                          <input
                            type="text"
                            className="custom-input"
                            value={question.allotedSection}
                            placeholder="Enter Alloted Section"
                            required
                            onChange={(e) =>
                              handleQuestionChange(
                                index,
                                "allotedSection",
                                e.target.value
                              )
                            }
                          />
                          <br />
                          <label className="fw-bold">
                            Question Weightage
                            <span style={{ fontSize: "12px" }}>
                              (Total Marks)
                            </span>
                          </label>
                          <br />
                          <input
                            type="number"
                            className="custom-input"
                            value={question.totalMarks}
                            placeholder="Enter Total Marks"
                            onChange={(e) =>
                              handleQuestionChange(
                                index,
                                "totalMarks",
                                e.target.value
                              )
                            }
                          />
                          <br />
                          <br></br>
                          <label className="fw-bold">
                            Add Image for Question{" "}
                            <span style={{ fontSize: "12px" }}>(if any)</span>
                          </label>
                          <br />
                          <input
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={(e) =>
                              handleQuestionChange(
                                index,
                                "questionImage",
                                e.target.files[0]
                              )
                            }
                          />
                          <br />
                          <label className="fw-bold">
                            Answer of the Question
                          </label>
                          <br />
                          <textarea
                            className="custom-input"
                            value={question.questionAnswer}
                            placeholder="Enter Answer"
                            onChange={(e) =>
                              handleQuestionChange(
                                index,
                                "questionAnswer",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      ))}

                      <div className="d-flex justify-content-end mt-3 ">
                        <button
                          type="button"
                          className="btn btn-secondary me-3"
                          onClick={handleAddMoreQuestion}
                        >
                          Add More Question
                        </button>
                        <button className="btn btn-primary" type="submit">
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* End of main content */}
        </div>
      </div>
    </div>
  );
};

export default Mytest;
