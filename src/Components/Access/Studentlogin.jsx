import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Modal, Container, Row, Col, Card } from 'react-bootstrap';
import config from '../../config';
import AuthContext from './AuthContext';
import LoadingContext from './LoadingContext';
import Studentregister from './Studentregister';
import Loader from './Loader';
import '../Styles/LoginReg.css';
import banner from '../Assets/banner-4.jpg';

const Studentlogin = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const { loading } = useContext(LoadingContext);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('email', loginEmail);
    formData.append('password', loginPassword);

    try {
      const response = await fetch(`${config.apiBaseUrl}/fullmarks-user/user/studentlogin.php`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        login({ id: data.id, name: data.name, email: loginEmail, role: 'student', pic: data.profile_pic });
        setLoginError('');
        navigate(`/student-dashboard/${data.id}`);
      } else {
        setLoginError('Username/password not found');
      }
    } catch (error) {
      console.error('Error:', error);
      setLoginError('Error during login');
    }
  };

  const handleForgotPassword = async () => {
    if (newPassword !== confirmPassword) {
      setForgotPasswordError('Passwords do not match');
      return;
    }

    const formData = new FormData();
    formData.append('email', forgotEmail);
    formData.append('newPassword', newPassword);

    try {
      const response = await fetch(`${config.apiBaseUrl}/fullmarks-user/user/forgotpasswordstudent.php`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        alert('Password reset successful');
        setShowForgotPasswordModal(false);
        setForgotPasswordError('');
      } else {
        setForgotPasswordError('Failed to reset password');
      }
    } catch (error) {
      console.error('Error:', error);
      setForgotPasswordError('Error resetting password');
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      

      <Container className="contact-page ">
      <Row className="mt-4 mb-2">
      <div className= 'border disk'>
      </div> 
        <Col md={4} className=" mt-3 comb  ">
          <h2>Login (Student)</h2>
          <hr className= 'bg-light'></hr>
         
        
        
          <Form onSubmit={handleLogin} className= ' bg-light p-3'>
          <p className= 'text-success'>Enter your Login Credentials</p>
                  <Form.Group controlId="loginEmail" className="mt-3">
                      <Form.Label className="fw-bold text-dark">Email*</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter your email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="loginPassword" className="mt-4">
                      <Form.Label className="fw-bold text-dark">Password*</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <div className="d-flex justify-content-end mt-3">
                      <Button type="submit" className="btn-custom">Login</Button>
                    </div>
                    <div className="mt-2 d-flex justify-content-end">
                      <span onClick={() => setShowForgotPasswordModal(true)} style={{ cursor: 'pointer', color: '#0A1172' }}>Forgot Password?</span>
                    </div>
                    {loginError && <div className="text-danger text-center mt-3">{loginError}</div>}
                  </Form>
        </Col>
        <Col md={1} className=" mt-3 comb">
         
        </Col>
        <Col md={7} className=" mt-3 comb bg-light">
          <h2>Registration (Student)</h2>
          <hr></hr>
          <Studentregister />
         
        </Col>
      </Row>
    </Container>

      {/* Forgot Password Modal */}
      <Modal show={showForgotPasswordModal} onHide={() => setShowForgotPasswordModal(false)}>
        <Modal.Header closeButton style={{ backgroundColor: "#0A1172", color: "white" }}>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="forgotEmail">
              <Form.Label>Email/Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your email or username"
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
            {forgotPasswordError && <div className="text-danger mt-2">{forgotPasswordError}</div>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowForgotPasswordModal(false)}>
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

export default Studentlogin;
