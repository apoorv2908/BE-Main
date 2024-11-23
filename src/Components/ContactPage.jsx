import React, { useState } from "react";
import { Form, Button, Col, Row, Container } from "react-bootstrap";
import "./Styles/ContactPage.css";
import config from "../config";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${config.apiBaseUrl}/fullmarks-user/addtnl/reachusout.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response from server:", data);
        if (data.success) {
          setMessage(data.message);
          setFormData({
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            message: "",
          });
        } else {
          setError(data.message);
        }
      })
      .catch((error) => {
        console.error("Error submitting form:", error);
        setError("There was an error submitting the form. Please try again.");
      });
  };

  return (
    <div className=" py-2">
      <div
        className="p-3 h3 mx-3 text-center fw-bold"
        style={{
          background:
            "linear-gradient(to right, #192152, #FF7F50, #FFA07A, white)",
          color: "white",
          marginTop: "80px",
        }}
      >
        CONTACT US
      </div>
      <Row className="mt-4 mb-5 pb-5 bg-light rounded  px-4">
        <Col md={6} className="contact-form mt-3">
          <h2>Reach out to us!</h2>
          <p>
            Got a question about Lancer? Are you interested in partnering with
            us? Have some suggestions or just want to say hi? Contact us.
          </p>
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFirstName">
              <Form.Control
                type="text"
                name="first_name"
                placeholder="First name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <br />
            <Form.Group controlId="formLastName">
              <Form.Control
                type="text"
                name="last_name"
                placeholder="Last name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <br />
            <Form.Group controlId="formEmail">
              <Form.Control
                type="email"
                name="email"
                placeholder="Your Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <br />
            <Form.Group controlId="formPhone">
              <Form.Control
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
              />
            </Form.Group>
            <br />
            <Form.Group controlId="formMessage">
              <Form.Control
                as="textarea"
                name="message"
                rows={5}
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <br />
            <Button variant="primary" type="submit" className="btn-custom">
              Submit
            </Button>
          </Form>
        </Col>
        <Col md={6} className="customer-care mt-3">
          <h2>Get in touch with us</h2>
          <p>
            Not sure where to start? Need help adding that extra mojo to your
            landing page? Just send us a note or get in touch with us:
          </p>
          <div className="customer-care-info">
            <i className="fa fa-map-marker me-3"></i>B-38, KC Tower, Adarsh
            Nagar, New Delhi - 110033<br></br>
            <i className="fas fa-phone me-2"></i> 011-41612670<br></br>
            <i className="fas fa-envelope me-2"></i> info@binaryedu.in
          </div>

          <h3 className="mt-4">Other ways to connect</h3>
          <p>
            <span>📘</span> Be the first on your block to get product updates,
            announcements, read stories. Join us on{" "}
            <a href="https://www.facebook.com/officialbinaryeducation">
              Facebook
            </a>{" "}
            and{" "}
            <a href="https://www.instagram.com/officialbinaryeducation">
              Instagram
            </a>
          </p>
        </Col>
      </Row>
    </div>
  );
};

export default ContactPage;
