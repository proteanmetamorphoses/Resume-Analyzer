// Import necessary components and styles
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; // Assuming you have a separate CSS file for the landing page
import LogoutLink from './LogoutLink';

const LandingPage = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login'); // This should match the route to your login page
  };

  return (
    <div className="landing-container">
      <h1 className="header-title">Advanced Resume</h1>
      <p className="tagline">make your resume stand out with +GPT enhancements</p>
      <button onClick={goToLogin} className="cta-button">Get Started</button>
    </div>
  );
};

export default LandingPage;

  