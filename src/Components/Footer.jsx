import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Styles/Footer.css';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import config from "../config"; // Ensure this imports your config file

const Footer = () => {
    const [email, setEmail] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertVariant, setAlertVariant] = useState('success'); // 'success' or 'danger'

    const handleSubscribe = (e) => {
        e.preventDefault();

        fetch(`${config.apiBaseUrl}/fullmarks-user/addtnl/subscribe_newsletter.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded' // Ensure the correct content type for form data
            },
            body: new URLSearchParams({ email }) // Use URLSearchParams to format the data correctly
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                setAlertMessage(data.error);
                setAlertVariant('danger');
            } else {
                setAlertMessage("Thank you for subscribing!");
                setAlertVariant('success');
                setEmail(''); // Clear the input field
            }
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000); // Hide the alert after 3 seconds
        })
        .catch(error => {
            setAlertMessage("An error occurred. Please try again.");
            setAlertVariant('danger');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000); // Hide the alert after 3 seconds
        });
    };

    return (
        <footer className="text-white pt-5 pb-4" style={{ backgroundColor: "#000029" }}>
            <Container>
                <Row>
                    <Col md={4} className="mb-4">
                        <h5 className="text-uppercase">Binary Education</h5>
                        <p>
                            Welcome to our Computer Series, your gateway to a world of computer education designed specifically for students from Class 1 to 8, following the CBSE Board syllabus. At Binary Education, we understand the critical role of computer education in the modern era and have curated a collection of the best computer school books for young learners.
                        </p>
                        <div className="d-flex sidebar-social">
                            <Link target="_blank" to="https://www.facebook.com/officialbinaryeducation"><i className="fab fa-facebook"></i></Link>
                            <Link target="_blank" to="https://www.instagram.com/officialbinaryeducation/"><i className="fab fa-instagram"></i></Link>
                            <Link target="_blank" to="https://www.youtube.com/@binary-education-pvt-ltd"><i className="fab fa-youtube"></i></Link>
                            <Link target="_blank" to="https://www.linkedin.com/company/officialbinaryeducation/"><i className="fab fa-linkedin"></i></Link>
                        </div>
                    </Col>
                    <Col md={4} className="mb-4">
                        <h5 className="text-uppercase">Address</h5>
                        <ul className="list-unstyled">
                            <li>
                                <i className="fa fa-map-marker me-3"></i>B-38, KC Tower, Adarsh Nagar, New Delhi - 110033
                            </li>
                            <li>
                                <i className="fas fa-phone me-2"></i> 011-41612670
                            </li>
                            <li>
                                <i className="fas fa-envelope me-2"></i> info@binaryedu.in
                            </li>
                        </ul>
                    </Col>
                    <Col md={2} className="mb-4">
                        <h5 className="text-uppercase">Publication</h5>
                        <ul className="list-unstyled">
                            <li><Link to="/">Books</Link></li>
                            <li><Link to="/">Subjects</Link></li>
                            <li><Link to="/">Login/Register</Link></li>
                        </ul>
                    </Col>
                    <Col md={2} className="mb-4">
                        <h5 className="text-uppercase">Subscribe to Newsletter</h5>
                        <Form onSubmit={handleSubscribe}>
                            <Form.Control
                                type="email"
                                placeholder="Enter Your Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Button variant="primary" type="submit" className="mt-2">Submit</Button>
                        </Form>
                        {showAlert && (
                            <Alert variant={alertVariant} className="mt-2">
                                {alertMessage}
                            </Alert>
                        )}
                    </Col>
                </Row>
            </Container>
            <div className="bg-secondary text-center py-3">
                <Container>
                    <Row>
                        <Col>
                            &copy; 2024 All Rights Reserved. Developed By Aritone Global Ventures
                        </Col>
                    </Row>
                </Container>
            </div>
        </footer>
    );
};

export default Footer;
