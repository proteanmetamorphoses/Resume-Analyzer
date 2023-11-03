// AnalysisSection.js
import React, { useState } from 'react';

function AnalysisSection() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescriptionText, setJobDescriptionText] = useState('');

  const handleAnalyzeClick = () => {
    // Call the ChatGPT API to analyze the resume and job description
  };

  return (
    <div className="analysis-section">
      <div className="resume-input">
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your resume here"
        />
      </div>
      <div className="job-description-input">
        <textarea
          value={jobDescriptionText}
          onChange={(e) => setJobDescriptionText(e.target.value)}
          placeholder="Paste the job description here"
        />
      </div>
      <button onClick={handleAnalyzeClick}>Analyze</button>
    </div>
  );
}

export default AnalysisSection;
