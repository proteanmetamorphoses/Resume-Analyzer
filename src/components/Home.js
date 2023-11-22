import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="landing-container">
      <h1 className="header-title">Advanced Resume</h1>
      <p className="tagline">Targeted, relevant content shows your quality.</p>
      <p className="tagline">
        Make your resume stand out with powerful AI content enhancements.
      </p>
      <button onClick={goToLogin} className="cta-button">
        Get Started
      </button>
    </div>
  );
};

export default LandingPage;