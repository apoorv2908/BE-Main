import React, { useEffect, useContext, useState } from 'react';
import { Container, Button, Card, Row, Col, Modal, Form } from 'react-bootstrap';
import config from '../config';
import { useParams, Link } from 'react-router-dom';
import './Styles/Dash.css'; // Import custom CSS file for Dashboard
import AuthContext from '../Components/Access/AuthContext';
import Updatestudents from '../Components/Access/Updatestudents';
import Updatepasswordstudent from '../Components/Access/Updatestudentpassword';
import defaultProfilePic from "./Assets/user-default.jpg"; // Import your default profile picture
import banner from "./Assets/banner-4.jpg";



const StudentDashboard = () => {
    const { student_id } = useParams(); // Get teacher student_id from URL params
    const [userDetails, setUserDetails] = useState(null);
    const [activeButton, setActiveButton] = useState(null); // Track active button
    const [assignedBooks, setAssignedBooks] = useState([]); // Store assigned books
    const [showEditProfileModal, setShowEditProfileModal] = useState(false); // Manage edit modal state
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false); // Manage password modal state
    const { logout } = useContext(AuthContext);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        fetchUserDetails(student_id);
    }, [student_id]);

    const fetchUserDetails = (student_id) => {
        fetch(`${config.apiBaseUrl}/fullmarks-user/user/fetchstudentdetail.php?student_id=${student_id}`)
            .then(response => response.json())
            .then(data => setUserDetails(data))
            .catch(error => console.error('Error fetching user details:', error));
    };

    const fetchAssignedBooks = (student_id) => {
        fetch(`${config.apiBaseUrl}/fullmarks-user/user/fetchAssignedBooks2.php?student_id=${student_id}`)
            .then(response => response.json())
            .then(data => setAssignedBooks(data))
            .catch(error => console.error('Error fetching assigned books:', error));
    };

    const handleButtonClick = (buttonName) => {
        setActiveButton(buttonName);
        if (buttonName === 'MyBooks') {
            fetchAssignedBooks(student_id);
        }
    };

    const handleOpenEditModal = () => {
        setShowEditProfileModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditProfileModal(false);
    };

    const handleOpenPasswordModal = () => {
        setShowChangePasswordModal(true);
    };

    const handleClosePasswordModal = () => {
        setShowChangePasswordModal(false);
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        // Implement the password change functionality
        console.log('Current Password:', currentPassword);
        console.log('New Password:', newPassword);
        // You can make an API call to update the password here

        setShowChangePasswordModal(false); // Close the modal after password change
    };

    return (
        <Container className='ap'>
            <div className="p-3 profile-cont ">
                <Row className=' mt-5 mb-5'>
                <div className= 'border diskdil mb-3'>
                    <p className= 'text-center h3 mt-4 text-white fw-bold text-uppercase '>My Dashboard</p>
                </div> 
                <Col lg={2} className="vertical-buttons border bg-light p-3 rounded">
                        <div className="text-center">
                            <div className='profile-pic mb-2'>
                                <img
                                    src={userDetails?.profile_pic
                                        ? `${config.apiBaseUrl}/admin/fullmarks-server/uploads/teachers/${userDetails.profile_pic}`
                                        : defaultProfilePic}
                                    alt="User Profile"
                                    className="profile-pic-img rounded-circle"
                                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                                />
                            </div>
                            <h5 className="text-dark">{userDetails?.name}</h5>
                            <p className="text-dark">{userDetails?.email}</p>
                        </div>
                        <hr className= 'text-dark'></hr>
                        <Button
                            variant={activeButton === 'MyBooks' ? 'dark' : 'outline-dark'}
                            className="zu w-100 mb-2"
                            onClick={() => handleButtonClick('MyBooks')}
                        >
                            My Books
                        </Button>
                        <Button
                            variant="outline-dark"
                            className="zu w-100 mb-2"
                            onClick={handleOpenEditModal}
                        >
                            Edit Profile
                        </Button>
                       
                        <Button
                            variant="outline-dark"
                            className="zu w-100 mb-2"
                            onClick={handleOpenPasswordModal}
                        >
                            Change Password
                        </Button>
                        <Button variant="outline-dark" className="zu w-100" onClick={logout}>
                            Logout
                        </Button>
                    </Col>

                    <Col lg={9}>
                        <div className=" p-4">
                            {activeButton === 'MyBooks' && (
                                <div>
                                    <h3 className="mb-4">My Books</h3>
                                    <hr></hr>
                                    {assignedBooks.length > 0 ? (
                                        <Row>
                                            {assignedBooks.map((book) => (
                                                <Col md={4} key={book.book_student_id} className="mb-4">
                                                    <Link to={`/my-book-details/${book.book_id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                        <Card className="h-100 shadow-sm">
                                                            {book.book_cover && (
                                                                <Card.Img
                                                                    variant="top"
                                                                    src={`${config.apiBaseUrl}/admin/fullmarks-server/uploads/book_cover/${book.book_cover}`}
                                                                    alt={book.book_name}
                                                                    style={{ objectFit: 'cover' }}
                                                                />
                                                            )}
                                                            <Card.Body>
                                                                <Card.Title>{book.book_name}</Card.Title>
                                                            </Card.Body>
                                                        </Card>
                                                    </Link>
                                                </Col>
                                            ))}
                                        </Row>
                                    ) : (
                                        <p>No books assigned.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Edit Profile Modal */}
            <Modal show={showEditProfileModal} onHide={handleCloseEditModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Updatestudents/> {/* Pass the student_id as a prop */}
                </Modal.Body>
              
            </Modal>

            {/* Change Password Modal */}


            <Modal show={showChangePasswordModal} onHide={handleClosePasswordModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Change Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Updatepasswordstudent/> {/* Pass the student_id as a prop */}
                </Modal.Body>
               
            </Modal>
            
        </Container>
    );
};

export default StudentDashboard;
