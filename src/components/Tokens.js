import HexagonBackground from "./HexagonBackground";
import "./Tokens.css";
import React from "react";
import { useNavigate } from "react-router-dom";

function Tokens() {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="Tokens-container">
      <HexagonBackground />
      <h1 className="header-title">iSpeakWell</h1>
      <h5 className="tagline">
        Shape Your Resume, Cover Letter, and Interview Language
      </h5>
      <h5 className="tagline">
        {" "}
        with Professionalism, Confidence, and Distinction.
      </h5>
      <h2 className="under-construction-text">Under Construction</h2>
      <p>This page is under construction.</p>
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
      </div>
    </div>
  );
}
export default Tokens;