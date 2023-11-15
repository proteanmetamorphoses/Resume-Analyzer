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

  const getCharacterMessage = (count, maxCount) => {
    if (count >= 1) return `Keep going...(500 characters minimum; ${maxCount} characters maximum).`;
    if (count >= maxCount) return `Maximum characters reached (${maxCount} maximum).`;
    return `Analysis begins in ${500 - count} characters (${maxCount} characters maximum).`;
  };

  const handleTextChange = (e, setText, setTextCount, textAreaRef, maxCount) => {
    let newValue = e.target.value;
    if (newValue.length > maxCount) {
      newValue = newValue.substring(0, maxCount); // Truncate to maxCount characters
    }

    setText(newValue);
    setTextCount(newValue.length);

    // Dynamically adjust the height of the textarea
    textAreaRef.current.style.height = 'auto';
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
  };

  const handleResumeTextChange = (e) => {
    handleTextChange(e, setResumeText, setResumeTextCount, resumeTextAreaRef, 15000); // Updated maxCount to 15000
  };

  const handleJobDescriptionTextChange = (e) => {
    handleTextChange(e, setJobDescriptionText, setJobDescriptionTextCount, jobDescriptionTextAreaRef, 5000); // Updated maxCount to 5000
  };

  // Cap the subtraction at 500 for each text box if they exceed 500
  const cappedResumeTextCount = resumeTextCount > 500 ? 500 : resumeTextCount;
  const cappedJobDescriptionTextCount = jobDescriptionTextCount > 500 ? 500 : jobDescriptionTextCount;

  // Recalculate the remaining characters after capping
  const cappedRemainingCharacters = 1000 - cappedResumeTextCount - cappedJobDescriptionTextCount;

  return (
    <div className="analysis-section">
      <div className="textarea-container">
        <h3>Resume</h3>
        <h5>(minimum 500 characters)</h5>
        <textarea ref={resumeTextAreaRef}
          className="styled-textarea"
          value={resumeText}
          onChange={handleResumeTextChange}
          placeholder="Type or paste your current resume text here."
        />
        <p className="char-count">{getCharacterMessage(resumeTextCount, 15000)}</p> {/* Updated maxCount to 15000 */}
        <p className="char-count-left">{resumeTextCount} {resumeTextCount === 1 ? 'character' : 'characters'}</p>
      </div>
      <div className="textarea-container">
        <h3>Job Description</h3>
        <h5>(minimum 500 characters)</h5>
        <textarea ref={jobDescriptionTextAreaRef}
          className="styled-textarea"
          value={jobDescriptionText}
          onChange={handleJobDescriptionTextChange}
          placeholder="Paste your recent job description text here."
        />
        <p className="char-count">{getCharacterMessage(jobDescriptionTextCount, 5000)}</p> {/* Updated maxCount to 5000 */}
        <p className="char-count-left">{jobDescriptionTextCount} {jobDescriptionTextCount === 1 ? 'character' : 'characters'}</p>
      </div>
      {cappedRemainingCharacters > 0 && (
        <h4>Analysis can commence in {cappedRemainingCharacters} characters.</h4>
      )}
      {(!isAnalyzing && !analysisCompleted && resumeTextCount > 500 && jobDescriptionTextCount > 500) && (
        <button className="analysis-button" onClick={handleAnalyzeClick}>Analyze</button>
      )}
    </div>
  );
}

export default AnalysisSection;
