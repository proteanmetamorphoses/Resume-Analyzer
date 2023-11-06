// FinalResultsSection.js
import React from 'react';
import './FinalResultsSection.css';


function FinalResultsSection({ revisedResume, revisedATSScore, coverLetter }) {
  const handleSave = () => {
    // Logic to save the results to the user's account
  };

  const handleDownload = () => {
    // Logic to download the results as a file
  };

  return (
    <div className="final-results-section">
      <div className="revised-resume">
        <h3>Revised Resume</h3>
        <p>{revisedResume}</p>
      </div>
      <div className="revised-ats-score">
        <h3>Revised ATS Score: {revisedATSScore}</h3>
      </div>
      <div className="cover-letter">
        <h3>Cover Letter</h3>
        <p>{coverLetter}</p>
      </div>
      <div className="actions">
        <button onClick={handleSave}>Save</button>
        <button onClick={handleDownload}>Download</button>
      </div>
    </div>
  );
}

export default FinalResultsSection;
