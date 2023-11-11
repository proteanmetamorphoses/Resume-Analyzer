import React from 'react';
import './FinalResultsSection.css';


function FinalResultsSection({ revisedResume, revisedATSScore, coverLetter }) {
  const handleSave = () => {

  };

  const handleDownload = () => {

  };

  return (
    <div className="final-results-section">
      <div>
        <h3>Revised Resume</h3>
        <p className="revised-resume">{revisedResume}</p>
      </div>
      <h3>Revised ATS Score</h3> 
      <div className="revised-ats-score">
        {revisedATSScore}
      </div>
      <div>
        <h3>Cover Letter</h3>
        <p className="cover-letter">{coverLetter}</p>
      </div>
      <div className="actions">
        <button onClick={handleSave}>Save</button>
        <button onClick={handleDownload}>Download</button>
      </div>
    </div>
  );
}

export default FinalResultsSection;
