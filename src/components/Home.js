import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import HexagonBackground from "./HexagonBackground";

const LandingPage = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="landing-container">
      <div className="background-container">
        <HexagonBackground />
      </div>
      <h1 className="header-title">Advanced Career</h1>
      <p className="tagline">Targeted, relevant content shows your quality.</p>
      <p className="tagline">
        Shape your resume with powerful AI content enhancements.
      </p>
      <p className="tagline">
        Professionalize your interview with engaging AI language suggestions.
      </p>
      <button onClick={goToLogin} className="cta-button">
        Get Started
      </button>
    </div>
  );
};

export default LandingPage;