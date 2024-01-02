import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import HexagonBackground from "./HexagonBackground";
import UnsplashImage from "./UnsplashImage.jpg"; // Ensure the path and file extension are correct

const Home = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login");
  };

  const navigateTo = (path) => {
    navigate(path);
  };

  return (
    <div className="landing-container">
      <div className="background-container">
        <HexagonBackground />
      </div>
      <h1 className="header-title">iSpeakWell</h1>
      <h5 className="tagline">
        Shape Your Resume, Cover Letter, and Interview Language
      </h5>
      <h5 className="tagline">
        {" "}
        with Professionalism, Confidence, and Distinction.
      </h5>
      <h3>Revise with OpenAI.</h3>
      <button onClick={goToLogin} className="cta-button">
        Get Started
      </button>
      <div className="new-section">
        <div className="row row-1">
          <h3>Sign Up, Login, then Purchase Tokens to Get Started</h3>
        </div>
        <div className="row row-1">
          <h4>1 Token Provides You With</h4>
        </div>
        <div className="row row-2">
          <div className="itema">
            <h3>1 conversation</h3>
            <h3>(10 minutes)</h3>
          </div>
          <div className="item middle-item">OR</div>
          <div className="itema">
            <h3>1 Resume</h3>
            <h3>&</h3>
            <h3>1 Cover Letter</h3>
          </div>
          <div className="item middle-item">OR</div>
          <div className="itema">
            <h3>1 Interview</h3>
            <h3>(5 Questions)</h3>
          </div>
        </div>
        <div className="row row-1">
          <h4>Buy Single or Multiple Tokens</h4>
        </div>
        <div className="row row-3">
          <span className="arrow">&#8595;</span>
        </div>
        <div className="row row-4"></div>
        <div className="row row-5">
          <div className="image-container">
            <img
              src={UnsplashImage}
              alt="A stylish chair and a laptop computer."
              className="unsplash-image"
            />
          </div>
          <div className="row row-1">
            <h4>(AI Inside)</h4>
          </div>
        </div>
        <button onClick={goToLogin} className="cta-button">
          Let's Get Started
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
        </div>
      </div>
    </div>
  );
};

export default Home;
