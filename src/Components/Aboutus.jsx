import React, { useEffect, useState } from "react";
import logo from "./Assets/logo-2.jpeg";
import "./Styles/Aboutus.css";
import banner from "./Assets/banner-4.jpg";
import config from "../config"; // Your config file with API base URL

const Aboutus = () => {
  const [aboutUsContent, setAboutUsContent] = useState("");

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/fullmarks-user/navbar/fetchaboutus.php`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setAboutUsContent(data.content);
        } else {
          console.error("Failed to fetch content:", data.message);
        }
      })
      .catch((error) =>
        console.error("Error fetching About Us content:", error)
      );
  }, []);

  return (
    <div className="shadow py-2">
      <div
        className="p-3 h3 mx-3 fw-bold"
        style={{
          background: "linear-gradient(to right, #192152, white)",
          color: "white",
          marginTop: "80px",
        }}
      >
        ABOUT BINARY EDUCATION
      </div>
      <p className="text-center mb-3 h6 rn1" style={{ color: "#0A1172" }}></p>
      <div className="about-title text-warning h5 mt-5 fw-bold px-5">
        ABOUT BINARY EDUCATION
      </div>

      <div className="px-5 mb-4">
        <div dangerouslySetInnerHTML={{ __html: aboutUsContent }} />
      </div>
    </div>
  );
};

export default Aboutus;
