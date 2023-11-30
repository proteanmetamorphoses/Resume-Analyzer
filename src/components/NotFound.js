// NotFound.js
import React from "react";
import "./NotFound.css"; // Import a CSS file for styling
import HexagonBackground from "./HexagonBackground";

const NotFound = () => {
  return (
    <div className="not-found-container">
      <HexagonBackground />
      <h2 className="not-found-text">404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
};

export default NotFound;
