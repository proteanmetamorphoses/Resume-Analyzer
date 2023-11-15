import React, { useState, useRef } from 'react';

import './AnalysisSection.css';
function AnalysisSection({ onSubmit, isAnalyzing, analysisCompleted, resumeText, setResumeText, jobDescriptionText, setJobDescriptionText }) {
  const [resumeTextCount, setResumeTextCount] = useState(0);
  const [jobDescriptionTextCount, setJobDescriptionTextCount] = useState(0);
  const resumeTextAreaRef = useRef(null);
  const jobDescriptionTextAreaRef = useRef(null);

  const handleAnalyzeClick = () => {
    onSubmit(resumeText, jobDescriptionText);
  };

  const getCharacterMessage = (count) => {
    if (count >= 1) return "Keep going...(500 characters minimum; 15,000 characters maximum).";
    if (count >= 15000) return "Maximum characters reached (15,000 maximum).";
    return `${500 - count} characters required before analysis can begin (15,000 characters maximum).`;
  };
  

  const handleTextChange = (e, setText, setTextCount, textAreaRef) => {
    let newValue = e.target.value;
    if (newValue.length > 15000) {
      newValue = newValue.substring(0, 15000); // Truncate to 15000 characters
    }
  
    setText(newValue);
    setTextCount(newValue.length);
  
    // Dynamically adjust the height of the textarea
    textAreaRef.current.style.height = 'auto';
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
  };

  const handleResumeTextChange = (e) => {
    handleTextChange(e, setResumeText, setResumeTextCount, resumeTextAreaRef);
  };

  const handleJobDescriptionTextChange = (e) => {
    handleTextChange(e, setJobDescriptionText, setJobDescriptionTextCount, jobDescriptionTextAreaRef);
  };

  return (
    <div className="analysis-section">
      <div className="textarea-container">
        <textarea ref={resumeTextAreaRef}
          className="styled-textarea"
          value={resumeText}
          onChange={handleResumeTextChange}
          placeholder="Type or paste your current resume text here."
        />
        <p className="char-count">{getCharacterMessage(resumeTextCount)}</p>
        <p className="char-count-left">{resumeTextCount} characters</p>
      </div>
      <div className="textarea-container">
        <textarea ref={jobDescriptionTextAreaRef}
          className="styled-textarea"
          value={jobDescriptionText}
          onChange={handleJobDescriptionTextChange}
          placeholder="Paste your recent job description text here."
        />
        <p className="char-count">{getCharacterMessage(jobDescriptionTextCount)}</p>
        <p className="char-count-left">{jobDescriptionTextCount} characters</p>
      </div>
      {(!isAnalyzing && !analysisCompleted && resumeTextCount > 500 && jobDescriptionTextCount > 500) && (
        <button className="analysis-button" onClick={handleAnalyzeClick}>Analyze</button>
      )}
    </div>
  );
}


export default AnalysisSection;
