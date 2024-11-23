import React from 'react';
import { Link } from 'react-router-dom';
import './Styles/Sidebar.css'; // Create this CSS file for sidebar styles
import logo from "./Assets/logo-2.jpeg";


const Sidebar = ({ isOpen, toggleSidebar }) => {
    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className=" mt-4 sidebar-content">
                <div className="logo">
                    <img src={logo} alt="Logo" />
                </div>
                <div className="sidebar-social d-flex justify-content-center">
                    <Link target= '_blank' to="https://www.facebook.com/officialbinaryeducation"><i className="fab fa-facebook"></i></Link>
                    <Link target= '_blank' to="https://www.instagram.com/officialbinaryeducation/"><i className="fab fa-instagram"></i></Link>
                    <Link target= '_blank' to="https://www.youtube.com/@binary-education-pvt-ltd"><i className="fab fa-youtube"></i></Link>
                    <Link target= '_blank' to="https://www.linkedin.com/company/officialbinaryeducation/"><i className="fab fa-linkedin"></i></Link>
                </div>
                <hr></hr>
                <p className= 'text-grey h6 italic'>Welcome to Binary Education Pvt Ltd, your gateway to a world of educational wonders and inspiration for young minds. At Binary Education, our passion is ignited by the enchanting world of books, and our mission is to instill the love of learning in children from grades 1 to 8.</p>
                
                <div className="sidebar-location">
                <iframe className= 'sidebar-map' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56005.57270477!2d77.16243392634252!3d28.679226126646956!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d03a39a375101%3A0x982839ec61100940!2sB-38!5e0!3m2!1sen!2sin!4v1725010814990!5m2!1sen!2sin"></iframe>
                </div>
                
            </div>
        </div>
    );
};

export default Sidebar;
