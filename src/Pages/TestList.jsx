import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import config from "../config";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const TestList = () => {
  const { teacher_id } = useParams();
  const [tests, setTests] = useState([]);
  const [editing, setEditing] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [testToDelete, setTestToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = () => {
    fetch(
      `${config.apiBaseUrl}/fullmarks-user/addtnl/fetch_test.php?teacher_id=${teacher_id}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === "success") {
          setTests(data.data);
        } else {
          console.error("Error fetching tests:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching tests:", error));
  };

  const handleEditToggle = (testId, sectionId) => {
    setEditing({ testId, sectionId });
  };

  const handleSave = async (testId, sectionId, updatedData) => {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/fullmarks-user/addtnl/update_section.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ testId, sectionId, updatedData }),
        }
      );
      if (response.ok) {
        setEditing({});
        fetchTests(); // Refresh the data
      } else {
        throw new Error("Error updating section");
      }
    } catch (error) {
      console.error("Error saving test data:", error);
    }
  };

  const handleDeleteTest = async () => {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/fullmarks-user/addtnl/delete_test.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ testId: testToDelete }),
        }
      );
      if (response.ok) {
        setShowDeleteModal(false);
        setTestToDelete(null);
        fetchTests(); // Refresh the data
      } else {
        throw new Error("Error deleting test");
      }
    } catch (error) {
      console.error("Error deleting test:", error);
    }
  };

  const handleDownloadPDF = (test) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Test Title: ${test.test_title}`, 10, 10);
    doc.setFontSize(12);
    doc.text(`Test Date: ${test.test_date}`, 10, 20);
    doc.text(`Max Marks: ${test.max_marks}`, 10, 30);

    let yOffset = 50;
    test.sections.forEach((section, index) => {
      doc.setFontSize(14);
      doc.text(`Section ${index + 1}:`, 10, yOffset);
      doc.setFontSize(12);
      yOffset += 10;
      doc.text(`Introduction: ${section.section_intro}`, 10, yOffset);
      yOffset += 10;

      section.questions.forEach((question, qIndex) => {
        doc.text(
          `${qIndex + 1}. [${question.question_type}] ${
            question.question_title
          }`,
          10,
          yOffset
        );
        yOffset += 10;

        if (yOffset > 270) {
          doc.addPage();
          yOffset = 20;
        }
      });

      yOffset += 10;
    });

    doc.save(`${test.test_title}_Question_Paper.pdf`);
  };

  const handleEditClick = (testId) => {
    navigate(`/edit-test/${testId}`);
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between mt-4 mb-4">
        <h2>Test List</h2>
        <Link to={`/test-generator/${teacher_id}`}>
          <button className="btn btn-primary">+ Add New Test</button>
        </Link>
      </div>

      {/* Check if tests array is empty */}
      {tests.length === 0 ? (
        <div className="text-center mt-5">
          <h4>No tests found</h4>
          <p>Click on "Add New Test" to create one.</p>
        </div>
      ) : (
        tests.map((test) => (
          <div
            key={test.test_id}
            className="card mb-3"
            style={{ boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h5>Test Title: {test.test_title}</h5>
                  <p className="card-text">
                    <strong>Date:</strong> {test.test_date} <br />
                    <strong>Max Marks:</strong> {test.max_marks}
                  </p>
                </div>
                <div
                  className="d-flex align-items-start"
                  style={{ gap: "10px" }}
                >
                  <button className="btn">
                    <i className="bi bi-file-earmark-arrow-down"></i>
                  </button>
                  <button
                    className="btn"
                    onClick={() => handleEditClick(test.test_id)}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn"
                    onClick={() => {
                      setTestToDelete(test.test_id);
                      setShowDeleteModal(true);
                    }}
                  >
                    <i className="bi bi-trash3-fill"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this test?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteTest}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TestList;
