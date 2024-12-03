import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import config from "../config";
import "bootstrap/dist/css/bootstrap.min.css";
import jsPDF from "jspdf";
import "jspdf-autotable";

const TestList = () => {
  const { teacher_id } = useParams();
  const [tests, setTests] = useState([]);
  const [activeSections, setActiveSections] = useState({});

  useEffect(() => {
    fetchTests();
  }, [teacher_id]);

  const fetchTests = () => {
    fetch(
      `${config.apiBaseUrl}/fullmarks-user/addtnl/fetch_test.php?teacher_id=${teacher_id}`
    )
      .then((response) => response.json())
      .then((data) => setTests(data))
      .catch((error) => console.error("Error fetching assigned books:", error));
  };

  const toggleSection = (testId, sectionIndex) => {
    setActiveSections((prevActiveSections) => ({
      ...prevActiveSections,
      [testId]:
        prevActiveSections[testId] === sectionIndex ? null : sectionIndex,
    }));
  };

  const downloadPDF = (test) => {
    const doc = new jsPDF();

    // School logo

    // School name
    doc.setFontSize(16);
    doc.text(test.school_name, 105, 35, { align: "center" });

    // Horizontal line
    doc.line(10, 55, 200, 55);

    // Test details
    doc.setFontSize(20);
    doc.text(test.test_name, 105, 65, { align: "center" });

    // Test metadata
    doc.setFontSize(10);
    doc.text(`Test Code: ${test.test_code || "N/A"}`, 14, 80);
    doc.text(`Number of Sections: ${test.number_of_sections}`, 14, 88);
    doc.text(`Test Date: ${test.test_date}`, 160, 80);
    doc.text(`Max Marks: ${test.max_marks}`, 160, 88);
    doc.text(`Time Allotted: ${test.time_allotted} minutes`, 14, 96);

    // Horizontal line
    doc.line(10, 100, 200, 100);

    // Test instructions
    doc.text("Test Instructions:", 108, 105, { align: "center" });
    doc.text(test.test_instructions || "N/A", 14, 116);

    // Horizontal line
    doc.line(10, 120, 200, 120);

    // Sections
    let currentY = 130;
    test.sections.forEach((section, sectionIndex) => {
      doc.setFontSize(12);
      doc.text(`Section ${sectionIndex + 1}`, 14, currentY);
      currentY += 10;

      section.questions.forEach((question, questionIndex) => {
        // Question Text
        doc.setFontSize(10);
        doc.text(
          `Question ${questionIndex + 1}: ${question.question_text}`,
          14,
          currentY
        );

        // Marks
        doc.text(` ${question.marks}`, 180, currentY, { align: "right" });
        currentY += 8;

        // Options (only if question type is MCQ)
        if (
          question.question_type === "mcq" &&
          question.options &&
          question.options !== "null"
        ) {
          const options = JSON.parse(question.options);
          doc.text(`Options: ${options.join(", ")}`, 14, currentY);
          currentY += 8;
        }

        // Question image
        if (question.question_image) {
          const imageUrl = `${config.apiBaseUrl}/${question.question_image}`;
          doc.addImage(imageUrl, "JPEG", 14, currentY, 50, 30);
          currentY += 35;
        } else {
          currentY += 5;
        }
      });

      // Horizontal line after each section
      doc.line(10, currentY, 200, currentY);
      currentY += 10;
    });

    doc.save(`${test.test_name}.pdf`);
  };

  const deleteTest = (testId) => {
    fetch(`${config.apiBaseUrl}/fullmarks-user/addtnl/delete_test.php`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `test_id=${testId}`,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          alert("Test deleted successfully.");
          fetchTests(); // Refresh the list of tests after deleting
        } else {
          alert(data.message);
        }
      })
      .catch((error) => console.error("Error deleting test:", error));
  };

  return (
    <div className="container test-list">
      <div className="d-flex justify-content-end">
        <Link to={`/test-generator/${teacher_id}`}>
          <button className="btn btn-custom ">+ Add New Test</button>
        </Link>
      </div>

      {tests.length > 0 ? (
        tests.map((test) => (
          <div key={test.test_id} className="card ">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h4>{test.test_name}</h4>

                <div>
                  <Link to={`/edit-test/${test.test_id}`}>
                    <button className="btn mb-3 mr-2 btn-warning mx-2 btn-sm">
                      <i className="bi bi-pencil mx-1"></i>
                    </button>
                  </Link>
                  <button
                    className="btn mb-3 btn-success btn-sm"
                    onClick={() => downloadPDF(test)}
                  >
                    <i className="bi bi-file-earmark-arrow-down mx-1 "></i>
                  </button>
                  <button
                    className="btn mb-3 btn-danger btn-sm mx-2"
                    onClick={() => deleteTest(test.test_id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
              <div className="d-flex justify-content-start comb">
                <p className="card-text ">
                  <strong className="mx-1">Created On: </strong>{" "}
                  {test.test_date}
                </p>
                <i className="bi bi-dot"></i>
                <p className="card-text ">
                  <strong>Maximum Marks:</strong> {test.max_marks}
                </p>
                <i className="bi bi-dot"></i>
                <p className="card-text">
                  <strong>Time Allotted:</strong> {test.time_allotted} minutes
                </p>
                <i className="bi bi-dot"></i>
                <p className="card-text">
                  <strong>Number of Sections:</strong> {test.number_of_sections}
                </p>
              </div>
              <hr></hr>

              {test.sections && test.sections.length > 0 && (
                <div
                  className="accordion mt-3"
                  id={`accordion-${test.test_id}`}
                >
                  {test.sections.map((section, sectionIndex) => (
                    <div key={section.section_id} className="card mt-2">
                      <div
                        className="card-header d-flex justify-content-between align-items-center"
                        onClick={() =>
                          toggleSection(test.test_id, sectionIndex)
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <h5 className="mb-0">{section.section_name}</h5>
                        <button className="btn btn-link">
                          {activeSections[test.test_id] === sectionIndex
                            ? "Hide"
                            : "Show"}{" "}
                          Section
                        </button>
                      </div>
                      {activeSections[test.test_id] === sectionIndex && (
                        <div className="card-body">
                          {section.questions &&
                            section.questions.length > 0 && (
                              <div className="questions">
                                {section.questions.map(
                                  (question, questionIndex) => (
                                    <div
                                      key={question.question_id}
                                      className="question-item mb-3"
                                    >
                                      <p className="text-center">
                                        <strong>
                                          Question {questionIndex + 1}
                                        </strong>
                                      </p>
                                      <p>
                                        <strong>Question Text:</strong>{" "}
                                        {question.question_text}
                                      </p>
                                      <p>
                                        <strong>Question Type:</strong>{" "}
                                        {question.question_type}
                                      </p>
                                      <p>
                                        <strong>Marks:</strong> {question.marks}
                                      </p>
                                      {question.question_type === "mcq" &&
                                        question.options &&
                                        question.options !== "null" && (
                                          <p>
                                            <strong>Options:</strong>{" "}
                                            {JSON.parse(question.options).join(
                                              ", "
                                            )}
                                          </p>
                                        )}
                                      {question.question_image && (
                                        <img
                                          src={`${config.apiBaseUrl}/${question.question_image}`}
                                          alt="Question"
                                          className="img-fluid question-image"
                                        />
                                      )}
                                    </div>
                                  )
                                )}
                                <hr></hr>
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No tests available</p>
      )}
    </div>
  );
};

export default TestList;
