// NotFound.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./NotFound.css"; // Import a CSS file for styling
import HexagonBackground from "./HexagonBackground";



const NotFound = () => {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="not-found-container">
      <HexagonBackground />
      <h2 className="not-found-text">404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <div className="links-section">
        <a onClick={() => navigateTo("/about")} href="/about">
          About
        </a>
        <a onClick={() => navigateTo("/careers")} href="/careers">
          Careers
        </a>
        <a onClick={() => navigateTo("/tokens")} href="/tokens">
          Tokens
        </a>
        <a onClick={() => navigateTo("/contactus")} href="contactus">
          Contact Us
        </a>
        <a onClick={() => navigateTo("/login")} href="login">
          Login
        </a>
      </div>
    </div>
  );
};

export default NotFound;
