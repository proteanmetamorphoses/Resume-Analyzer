import React, { useState } from 'react';
import './AnalysisSection.css';

function AnalysisSection({ onSubmit }) {
  const [resumeText, setResumeText] = useState('');
  const [jobDescriptionText, setJobDescriptionText] = useState('');

  const handleAnalyzeClick = () => {
    onSubmit(resumeText, jobDescriptionText);
  };
  
  return (
    <div className="analysis-section">
      <div className="resume-input">
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Type or paste your starter resume text here."
        />
      </div>
      <div className="job-description-input">
        <textarea
          value={jobDescriptionText}
          onChange={(e) => setJobDescriptionText(e.target.value)}
          placeholder="Paste your recent job description text here."
        />
      </div>
      <button className="analysis-button" onClick={handleAnalyzeClick}>Analyze</button>

    </div>
  );
  
}

export default AnalysisSection;
