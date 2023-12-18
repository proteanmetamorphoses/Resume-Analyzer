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
      <h3 className="tagline">Targeted, relevant content shows your quality.</h3>
      <h3 className="tagline">
        Shape your resume with powerful AI content enhancements.
      </h3>
      <h3 className="tagline">
        Professionalize your interview with engaging AI language suggestions.
      </h3>
      <button onClick={goToLogin} className="cta-button">
        Get Started
      </button>
    </div>
  );
};

export default LandingPage;