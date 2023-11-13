import './AnalysisSection.css';

import React, { useState } from 'react';

function AnalysisSection({ onSubmit, isAnalyzing, analysisCompleted, resumeText, setResumeText, jobDescriptionText, setJobDescriptionText }) {

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
      {!isAnalyzing && !analysisCompleted && (
        <button className="analysis-button" onClick={handleAnalyzeClick}>Analyze</button>
      )}
    </div>
  );
}

export default AnalysisSection;
