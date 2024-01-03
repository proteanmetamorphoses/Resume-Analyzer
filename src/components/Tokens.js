// Tokens.js
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TokenContext } from "./tokenContext";
import HexagonBackground from "./HexagonBackground";
import "./Tokens.css";

function Tokens() {
  const navigate = useNavigate();
  const { setTokens } = useContext(TokenContext); // Use TokenContext
  const [selectedTokens, setSelectedTokens] = useState(0); // State for selected token amount

  const handleTokenPurchase = () => {
    setTokens(selectedTokens);
    console.log("SelectedTokens: ", selectedTokens);
    navigate("/login"); // Navigate to login page
  };

  const navigateTo = (path) => {
    setTokens(0);
    navigate(path);
  };

  return (
    <div className="Tokens-container">
      <HexagonBackground />
      <h1 className="header-title">iSpeakWell</h1>
      <h5 className="tagline">
        Shape Your Resume, Cover Letter, and Interview Language with
        Professionalism, Confidence, and Distinction.
      </h5>
      <h1>Purchase Tokens</h1>
      <input className="TokenNum"
        type="number"
        value={selectedTokens}
        onChange={(e) => setSelectedTokens(e.target.value)}
        min="0"
      />
      <button className="cta-button" onClick={handleTokenPurchase}>
        Buy Tokens
      </button>
      <h2 className="under-construction-text">What Are Tokens For?</h2>
      <p className="divMsg">
        Tokens are your ticket to performing the resume or speech work you want
        to do. With tokens, you can revise your resume and get a matching cover
        letter. You can do a practice interview. You can also have a practice
        conversation to feel more fluent.
      </p>
      <h4>Tokens for Conversation Practice</h4>
      <p className="divMsg">
        One (1) token is required for Conversation Practice (10 minutes)
      </p>
      <h4>Tokens for Resume Revision and Cover Letter</h4>
      <p className="divMsg">
        One (1) token is required for Resume Revision and Cover Letter
      </p>
      <h4>Tokens for Interview Practice</h4>
      <p className="divMsg">
        One (1) token is required for Interview Practice (5 questions)
      </p>
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
