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
      <h1 className="header-title">iSpeakWell</h1>
      <h5 className="tagline">Shape Your Resume, Cover Letter, and Interview Language</h5>
      <h5 className="tagline"> with Professionalism, Confidence, and Distinction.</h5>
      <h3>Revise with OpenAI.</h3>
      <button onClick={goToLogin} className="cta-button">
        Get Started
      </button>
    </div>
  );
};

export default LandingPage;