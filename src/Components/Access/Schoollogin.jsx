import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Modal } from 'react-bootstrap';
import config from '../../config';
import AuthContext from './AuthContext';
import banner from '../Assets/banner-4.jpg';


const Schoollogin = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('email', loginEmail);
    formData.append('password', loginPassword);

    try {
      const response = await fetch(`${config.apiBaseUrl}/fullmarks-user/user/loginschool.php`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        login({ id: data.id, name: data.name, email: loginEmail });
        setLoginError('');
        navigate("/dashboard");
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
      const response = await fetch(`${config.apiBaseUrl}/fullmarks-user/user/forgotpassword.php`, {
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

  return (
    <div>
    <div className="banner-container2">
        <img className='bannerwindow' src={banner} alt="Banner" />
        <div className="centered-text">Login/Registration (School)</div>
      </div>

    <div className='d-flex justify-content-center align-items-center mt-5'>
      <div className="col-md-5 mt-5">
        <div className=" p-4 bg-light border mb-5 bg-white rounded">
        <h4 className="text-center" style={{ color: "#0A1172" }}>School Login</h4>
        <Form onSubmit={handleLogin}>
            <div className='text-center text-danger mb-4 fw-bold'>
              *For School Registration, Please contact Admin
            </div>

            <Form.Group controlId="loginEmail" className='input-group mb-3'>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="loginPassword" className='input-group mb-3'>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </Form.Group>

            {loginError && <div className='text-danger mb-3 text-center'>{loginError}</div>}

            <div className='d-flex justify-content-between'>
              <span onClick={() => setShowForgotPasswordModal(true)} style={{ cursor: 'pointer', color: 'blue' }}>Forgot Password?</span>
              <Button type="submit" style={{ backgroundColor: "#0A1172", outline: "none", color: "white", border: "none" }}>Login</Button>
            </div>
          </Form>
        </div>
      </div>

      {/* Modal for Forgot Password */}
      <Modal show={showForgotPasswordModal} onHide={() => setShowForgotPasswordModal(false)}>
        <Modal.Header style={{ backgroundColor: "#0A1172", color: "white" }} closeButton>
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
            <Form.Group controlId="newPassword" className='mt-3'>
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="confirmPassword" className='mt-3'>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
            {forgotPasswordError && <div className='text-danger mt-2'>{forgotPasswordError}</div>}
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
    </div>
  );
};

export default Schoollogin;
