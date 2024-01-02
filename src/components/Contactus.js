import HexagonBackground from "./HexagonBackground";
import "./Contactus.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ContactUs() {
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
    };
  
    try {
      const response = await axios.post('/api/send-email', data);
      console.log('Email sent:', response.data);
      // You can add additional logic here for a successful submission
    } catch (error) {
      console.error('Error sending email:', error);
      // Handle errors here, such as displaying a message to the user
    }
  };

  return (
    <div className="about-container">
      <HexagonBackground />
      <h1 className="header-title">iSpeakWell</h1>
      <h5 className="tagline">
        Shape Your Resume, Cover Letter, and Interview Language
      </h5>
      <h5 className="tagline">
        {" "}
        with Professionalism, Confidence, and Distinction.
      </h5>
      <form className="contact-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" required />

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />

        <label htmlFor="message">Message:</label>
        <textarea id="message" name="message" required></textarea>

        <button type="submit">Send</button>
      </form>
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
export default ContactUs;
