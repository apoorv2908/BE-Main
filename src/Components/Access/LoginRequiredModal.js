// LoginRequiredModal.js
import React from "react";
import { Modal, Button } from "react-bootstrap";

const LoginRequiredModal = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Login Required</Modal.Title>
      </Modal.Header>
      <Modal.Body className="fw-bold h5">
        You need to log in to access the chapters.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginRequiredModal;
