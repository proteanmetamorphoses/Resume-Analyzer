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
      <p className="tagline">
        Shape Your Resume, Cover Letter, and Interview Language with Professionalism, Confidence, and Distinction.
      </p>
      <h1>Purchase Tokens</h1>
      <button className = "cta-button">Buy Tokens</button>
      <h2 className="under-construction-text">What Are Tokens For?</h2>
      <p>Tokens are your ticket to performing the resume or speech work you want to do.</p>
      <h4>Tokens Required for Conversation Practice</h4>
      <p>One (1) token is required for Conversation Practice (10 minutes)</p>
      <h4>Tokens Required for Resume Revision and Cover Letter</h4>
      <p>One (1) token is required for Resume Revision and Cover Letter</p>
      <h4>Tokens Required for Interview Practice</h4>
      <p>One (1) token is required for Interview Practice (5 questions)</p>
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
}
export default Tokens;