import React, { useState, useEffect, useContext } from "react";
import { Navbar, Nav, NavDropdown, Container, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";
import "./Styles/Header.css"; // Import the CSS file
import logo from "./Assets/logo-2.jpeg";
import defaultProfilePic from "./Assets/user-default.jpg"; // Import the default profile picture
import { Link, useNavigate } from "react-router-dom";
import config from "../config";
import Sidebar from "./Sidebar";
import AuthContext from "./Access/AuthContext";
import { encodeId } from "./Access/EncodeDecode";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loginType, setLoginType] = useState("");
  const { user, logout } = useContext(AuthContext);
  const [classes, setClasses] = useState([]);
  const [series, setSeries] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/fullmarks-user/navbar/fetchclasslist.php`)
      .then((response) => response.json())
      .then((data) => setClasses(data))
      .catch((error) => console.error("Error fetching class names:", error));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/fullmarks-user/navbar/fetchserieslist.php`)
      .then((response) => response.json())
      .then((data) => setSeries(data))
      .catch((error) => console.error("Error fetching series names:", error));
  }, []);

  const handleClassSelect = (classId) => {
    navigate(`/classes/${encodeId(classId)}`);
  };

  const handleSeriesSelect = (subjectId) => {
    navigate(`/subjects/${encodeId(subjectId)}`);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLoginClick = (type) => {
    setLoginType(type);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setLoginType("");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <div className="mx-5">
        <Navbar
          className={`bg-white fw-bold custom-navbar ${
            scrolled ? "scrolled" : ""
          }`}
          expand="lg"
          fixed="top"
          style={{ boxShadow: "0px 0px 3px lightgrey" }}
        >
          <Navbar.Brand>
            <Link to="/">
              <img className=" mx-3 mno" src={logo} alt="Logo" />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="abc" id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" className="mx-3">
                HOME
              </Nav.Link>
              <Nav.Link as={Link} to="/about" className="mx-3">
                ABOUT
              </Nav.Link>
              <NavDropdown
                className="mx-3"
                title="SUBJECTS"
                id="series-nav-dropdown"
              >
                {series.map((seriesItem, index) => (
                  <NavDropdown.Item
                    key={index}
                    onClick={() => handleSeriesSelect(seriesItem.subject_id)}
                  >
                    {seriesItem.subject_name}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
              <NavDropdown
                className="mx-3"
                title="CLASS"
                id="class-nav-dropdown"
              >
                {classes.map((classItem, index) => (
                  <NavDropdown.Item
                    key={index}
                    onClick={() => handleClassSelect(classItem.class_id)}
                  >
                    {classItem.class_name}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
              <Nav.Link as={Link} to="/contact-page" className="mx-3">
                CONTACT
              </Nav.Link>
            </Nav>
            <Nav className="mx-5">
              {user ? (
                <>
                  {user.role === "teacher" ? (
                    <Nav.Link
                      as={Link}
                      to={`/teacher-dashboard/${user.id}`}
                      className="mx-3"
                    >
                      <img
                        src={
                          user.pic
                            ? `${config.apiBaseUrl}/admin/fullmarks-server/uploads/teachers/${user.pic}`
                            : defaultProfilePic
                        }
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          marginRight: "10px",
                        }}
                        alt="Profile"
                      />
                      {user.name}
                    </Nav.Link>
                  ) : user.role === "student" ? (
                    <Nav.Link
                      as={Link}
                      to={`/student-dashboard/${user.id}`}
                      className="mx-3"
                    >
                      <img
                        src={
                          user.pic
                            ? `${config.apiBaseUrl}/admin/fullmarks-server/uploads/students/${user.pic}`
                            : defaultProfilePic
                        }
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "50%",
                          marginRight: "10px",
                        }}
                        alt="Profile"
                      />
                      {user.name}
                    </Nav.Link>
                  ) : (
                    <Nav.Link
                      as={Link}
                      to={`/user-dashboard/${user.id}`}
                      className="mx-3"
                    >
                      {user.name}
                    </Nav.Link>
                  )}
                </>
              ) : (
                <NavDropdown
                  className="   btn btn-warning p-0 text-white btn-sm "
                  title="Login/Registration"
                  id="login-dropdown"
                >
                  <NavDropdown.Item as={Link} className="" to="/login-teacher">
                    Login/Registration (Teacher)
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} className="" to="/login-student">
                    Login/Registration (Student)
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} className="" to="/login-school">
                    Login/Registration (School)
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
            <Button variant="light" onClick={toggleSidebar} className="mx-2">
              <FontAwesomeIcon icon={faBars} />
            </Button>
          </Navbar.Collapse>
        </Navbar>
      </div>

      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
};

export default Header;
