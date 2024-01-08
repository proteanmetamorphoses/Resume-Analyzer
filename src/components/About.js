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
      <h1 className="about-header-title">iSpeakWell</h1>
      <h5 className="tagline">
        Shape Your Resume, Cover Letter, and Interview Language with
        Professionalism, Confidence, and Distinction.
      </h5>
      <h2 className="under-construction-text">
        About iSpeakWell by Fluent English
      </h2>

      <p className="divMsg">
        iSpeakWell is the principle behind the linguistic developmental tools
        you find on this website. The ability to communicate is highly regarded
        and difficult to develop effectively. Resumes, interviews, and work
        conversations are communication points of contact which could spell out
        success or not. Resumes get you the interview. Interviews get you the
        job. Being able to hold a conversation helps you keep the job.
      </p>
      <h2 className="under-construction-text">Mission</h2>
      <p className="divMsg">
        Fluent English is dedicated to helping people produce language with
        higher communicative value whether English is your first or second
        language.
      </p>
      <h2 className="under-construction-text">Vision</h2>
      <p className="divMsg">
        Our vision is a world where people simply deploy language with
        character, ease, and confidence.
      </p>
      <div className="links-section">
        <button className="link-button" onClick={() => navigateTo("/about")}>
          About
        </button>
        <button className="link-button" onClick={() => navigateTo("/careers")}>
          Careers
        </button>
        <button className="link-button" onClick={() => navigateTo("/tokens")}>
          Tokens
        </button>
        <button
          className="link-button"
          onClick={() => navigateTo("/contactus")}
        >
          Contact Us
        </button>
        <button className="link-button" onClick={() => navigateTo("/login")}>
          Login
        </button>
      </div>
    </div>
  );
}
export default About;
