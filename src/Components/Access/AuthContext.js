import React, { createContext, useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

const AuthContext = createContext();

const generateToken = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 40; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

const isTokenExpired = (expirationTime) => {
  return new Date().getTime() > expirationTime;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");
    const tokenExpiration = localStorage.getItem("tokenExpiration");

    if (
      storedUser &&
      storedToken &&
      tokenExpiration &&
      !isTokenExpired(tokenExpiration)
    ) {
      setUser(storedUser);
    } else {
      logout();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const tokenExpiration = localStorage.getItem("tokenExpiration");
      if (tokenExpiration && isTokenExpired(tokenExpiration)) {
        setShowSessionExpiredModal(true);
        logout();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const login = (userData) => {
    const token = generateToken();
    const tokenExpiration = new Date().getTime() + 30 * 60 * 1000; // 15 minutes

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    console.log(JSON.stringify(userData));
    localStorage.setItem("token", token);
    localStorage.setItem("tokenExpiration", tokenExpiration);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiration");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
      <Modal
        show={showSessionExpiredModal}
        onHide={() => setShowSessionExpiredModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Session Expired</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your session has expired. Please log in again.</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => setShowSessionExpiredModal(false)}
          >
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </AuthContext.Provider>
  );
};

export default AuthContext;
