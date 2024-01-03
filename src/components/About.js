import HexagonBackground from "./HexagonBackground";
import "./About.css";
import React from "react";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="about-container">
      <HexagonBackground />
      <h1 className="header-title">iSpeakWell</h1>
      <h5 className="tagline">
        Shape Your Resume, Cover Letter, and Interview Language with Professionalism, Confidence, and Distinction.
      </h5>
      <h2 className="under-construction-text">About iSpeakWell by Fluent English</h2>
      <p className="divMsg">Fluent English is a Canadian applied linguistics company located in Edmonton, Alberta, Canada.</p>
      <h2 className="under-construction-text">Mission</h2>
      <p className="divMsg">Fluent English is dedicated to helping people produce language with higher communicative value whether English is your first or second language.</p>
      <h2 className="under-construction-text">Vision</h2>
      <p className="divMsg">Our vision is a world where people simply deploy language with character, ease, and confidence.</p>
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
export default About;
