import React from "react";
import { useNavigate } from "react-router-dom";
import HexagonBackground from "./HexagonBackground";
import "./Careers.css";

function Careers() {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="careers-container">
      <HexagonBackground />
      <div className="career-opportunities">
        <div className="career">
          <h1 className="Careers-header-title">iSpeakWell</h1>
          <h5 className="tagline">
            Shape Your Resume, Cover Letter, and Interview Language with
            Professionalism, Confidence, and Distinction.
          </h5>
          <h2 className="CareersHiring">Careers We're Hiring For:</h2>
        </div>
        <hr />
        <div className="career">
          <h3>Social Media Marketing</h3>
          <p>
            Skilled in creating social media communications that translate into
            increased brand recognition and sales.
          </p>
        </div>
        <div className="career">
          <h3>Web Admin</h3>
          <p>
            With skills in IT support, software testing, keep this service
            abreast of issues relating to client accounts and platform
            usability.
          </p>
        </div>
        <div className="career">
          <h3>Applied Linguist</h3>
          <p>
            Specializing in discourse analysis and knowledge of adult education
            principles, OpenAI, and Natural Language Processing (NLP).
          </p>
        </div>
        <div className="career">
          <h3>Full Stack Web Developer</h3>
          <p>
            With skills in React, machine learning, AI, OpenAI, server
            development, database management, OpenAI capabilities, and NLTK.
          </p>
        </div>
        <div className="career">
          <h3>Senior Software Engineer</h3>
          <p>
            With deep knowledge of machine learning, AI, OpenAI, Python, and
            Natural Language Tool Kit.
          </p>
        </div>
      </div>
      <p className="inquiries">
        Please email all career inquiries to{" "}
        <a href="mailto:info@fluentenglish.ca">info@fluentenglish.ca</a>
      </p>
      <button onClick={goToLogin} className="cta-button">
        Back to Login
      </button>
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

export default Careers;
