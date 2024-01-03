import React, { useState } from "react";
import HexagonBackground from "./HexagonBackground";
import "./Contactus.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ContactUs() {
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false); // New state variable

  const navigateTo = (path) => {
    navigate(path);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      await axios.post("/api/send-email", data);
      setEmailSent(true); // Set emailSent to true on successful email sending
    } catch (error) {
      console.error("Error sending email:", error);
      // Handle errors here, such as displaying a message to the user
    }
  };

  return (
    <div className="about-container">
      <HexagonBackground />
      <h1 className="header-title">iSpeakWell</h1>
      <h5 className="tagline">
        Shape Your Resume, Cover Letter, and Interview Language with
        Professionalism, Confidence, and Distinction.
      </h5>
      <p>Please let us know your thoughts.</p>
      {emailSent ? (
        <div>
          <hr />
          <h3>Your email has been submitted!</h3>
          <hr />
        </div>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" name="name" required />

          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />

          <label htmlFor="message">Message:</label>
          <textarea id="message" name="message" required></textarea>

          <button type="submit">Send</button>
        </form>
      )}
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
export default ContactUs;
