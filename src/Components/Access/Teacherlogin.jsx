import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Modal, Row, Col } from "react-bootstrap";
import config from "../../config";
import AuthContext from "./AuthContext";
import LoadingContext from "./LoadingContext";
import Teacherregister from "./Teacherregister";
import Loader from "./Loader";
import "../Styles/LoginReg.css";

const Teacherlogin = () => {
  const [isSignIn, setIsSignIn] = useState(true); // State for toggling between Sign In and Sign Up
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const { loading } = useContext(LoadingContext);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", loginEmail);
    formData.append("password", loginPassword);

    try {
      const response = await fetch(
        `${config.apiBaseUrl}/fullmarks-user/user/login.php`,
        { method: "POST", body: formData }
      );
      const data = await response.json();
      if (data.success) {
        login({
          id: data.id,
          name: data.name,
          email: loginEmail,
          role: "teacher",
          pic: data.profile_pic,
        });
        setLoginError("");
        navigate(`/teacher-dashboard/${data.id}`);
      } else {
        setLoginError("Username/password not found");
      }
    } catch (error) {
      console.error("Error:", error);
      setLoginError("Error during login");
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async () => {
    if (newPassword !== confirmPassword) {
      setForgotPasswordError("Passwords do not match");
      return;
    }

    const formData = new FormData();
    formData.append("email", forgotEmail);
    formData.append("newPassword", newPassword);

    try {
      const response = await fetch(
        `${config.apiBaseUrl}/fullmarks-user/user/forgotpassword.php`,
        { method: "POST", body: formData }
      );
      const data = await response.json();
      if (data.success) {
        alert("Password reset successful");
        setShowForgotPasswordModal(false);
        setForgotPasswordError("");
      } else {
        setForgotPasswordError("Failed to reset password");
      }
    } catch (error) {
      console.error("Error:", error);
      setForgotPasswordError("Error resetting password");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="auth-container py-2">
      <div
        className="p-3 h3 fw-bold"
        style={{
          background: "linear-gradient(to right, #192152,  white)",
          color: "white",
          marginTop: "80px",
        }}
      >
        TEACHER: LOGIN/REGISTRATION
      </div>
      <div className="d-flex justify-content-center mt-5">
        <Button
          variant={isSignIn ? "#192152" : "#192152"}
          onClick={() => setIsSignIn(true)}
          className="mx-2"
          style={{
            backgroundColor: "#192152",
            color: "white",
            borderRadius: "50px",
          }}
        >
          Sign In
        </Button>
        <Button
          variant={!isSignIn ? "#192152" : "#192152"}
          onClick={() => setIsSignIn(false)}
          className="mx-2"
          style={{
            backgroundColor: "#192152",
            color: "white",
            borderRadius: "50px",
          }}
        >
          Sign Up
        </Button>
      </div>

      <Row className="mt-4 px-4">
        {isSignIn ? (
          // Sign In Form
          <Col
            md={5}
            className="mx-auto mb-5 bg-light rounded"
            style={{ boxShadow: "0px 0px 3px #192152 " }}
          >
            <Form onSubmit={handleLogin} className="mb-5 pt-3 pb-3 fw-bold">
              <p>Enter Your Login Crendentials</p>
              <hr></hr>
              <Form.Group controlId="loginEmail">
                <Form.Label className="fw-bold">Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group controlId="loginPassword" className="mt-3">
                <Form.Label className="fw-bold">Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </Form.Group>
              <div className="d-flex justify-content-between mt-3">
                <span
                  onClick={() => setShowForgotPasswordModal(true)}
                  style={{ cursor: "pointer", color: "#0A1172" }}
                >
                  Forgot Password?
                </span>
                <Button type="submit" className="btn-custom">
                  Login
                </Button>
              </div>
              {loginError && (
                <div className="text-danger text-center mt-3">{loginError}</div>
              )}
            </Form>
          </Col>
        ) : (
          // Sign Up Form
          <Col
            md={8}
            className="mx-auto mb-5 bg-light rounded"
            style={{ boxShadow: "0px 0px 3px #192152 " }}
          >
            <Teacherregister />
          </Col>
        )}
      </Row>

      {/* Forgot Password Modal */}
      <Modal
        show={showForgotPasswordModal}
        onHide={() => setShowForgotPasswordModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="forgotEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="newPassword" className="mt-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="confirmPassword" className="mt-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
            {forgotPasswordError && (
              <div className="text-danger mt-2">{forgotPasswordError}</div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowForgotPasswordModal(false)}
          >
            Close
          </Button>
          <Button variant="primary" onClick={handleForgotPassword}>
            Reset Password
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Teacherlogin;
