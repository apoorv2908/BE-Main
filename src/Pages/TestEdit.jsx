import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import config from "../config";
import "bootstrap/dist/css/bootstrap.min.css";

const TestEdit = () => {
  const { test_id } = useParams();
  const history = useNavigate();
  const [formData, setFormData] = useState({
    test_name: "",
    test_date: "",
    test_code: "",
    test_type: "",
    school_name: "",
    school_logo: null,
    max_marks: "",
    time_allotted: "",
    number_of_sections: "",
    test_instructions: "",
    sections: [],
  });

  useEffect(() => {
    fetchTestDetails();
  }, [test_id]);

  const fetchTestDetails = async () => {
    try {
      const response = await fetch(
        `${config.apiBaseUrl}/fullmarks-user/addtnl/fetch_test_details.php?test_id=${test_id}`
      );
      const data = await response.json();
      setFormData(data);
    } catch (error) {
      console.error("Error fetching test details:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, school_logo: e.target.files[0] });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formPayload = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "sections") {
        formPayload.append(key, formData[key]);
      }
    });
    formPayload.append("sections", JSON.stringify(formData.sections));

    try {
      const response = await fetch(
        `${config.apiBaseUrl}/fullmarks-user/addtnl/edit_test.php`,
        {
          method: "POST",
          body: formPayload,
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        alert("Test updated successfully");
        history(`/test-list/${formData.teacher_id}`);
      } else {
        alert("Failed to update test");
      }
    } catch (error) {
      console.error("Error updating test:", error);
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <h2>Edit Test</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Test Name:</label>
          <input
            type="text"
            name="test_name"
            value={formData.test_name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Test Date:</label>
          <input
            type="date"
            name="test_date"
            value={formData.test_date}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Test Code (optional):</label>
          <input
            type="text"
            name="test_code"
            value={formData.test_code}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Test Type (optional):</label>
          <input
            type="text"
            name="test_type"
            value={formData.test_type}
            onChange={handleChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>School Name:</label>
          <input
            type="text"
            name="school_name"
            value={formData.school_name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>School Logo (optional):</label>
          <input
            type="file"
            name="school_logo"
            onChange={handleFileChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Maximum Marks:</label>
          <input
            type="number"
            name="max_marks"
            value={formData.max_marks}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Time Allotted (in minutes):</label>
          <input
            type="number"
            name="time_allotted"
            value={formData.time_allotted}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Number of Sections:</label>
          <input
            type="number"
            name="number_of_sections"
            value={formData.number_of_sections}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Test Instructions (optional):</label>
          <textarea
            name="test_instructions"
            value={formData.test_instructions}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {formData.sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="card mt-3">
            <div className="card-body">
              <h5>Section {sectionIndex + 1}</h5>
              <div className="form-group">
                <label>Section Name:</label>
                <input
                  type="text"
                  name="section_name"
                  value={section.section_name}
                  onChange={(e) => handleSectionChange(sectionIndex, e)}
                  className="form-control"
                />
              </div>
              {section.questions.map((question, questionIndex) => (
                <div key={questionIndex} className="form-group mt-3">
                  <h6>Question {questionIndex + 1}</h6>
                  <label>Question Text:</label>
                  <input
                    type="text"
                    name="question_text"
                    value={question.question_text}
                    onChange={(e) =>
                      handleQuestionChange(sectionIndex, questionIndex, e)
                    }
                    className="form-control"
                  />
                  <label>Question Type:</label>
                  <input
                    type="text"
                    name="question_type"
                    value={question.question_type}
                    onChange={(e) =>
                      handleQuestionChange(sectionIndex, questionIndex, e)
                    }
                    className="form-control"
                  />
                  <label>Marks:</label>
                  <input
                    type="number"
                    name="marks"
                    value={question.marks}
                    onChange={(e) =>
                      handleQuestionChange(sectionIndex, questionIndex, e)
                    }
                    className="form-control"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <button type="submit" className="btn btn-success mt-4">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default TestEdit;
