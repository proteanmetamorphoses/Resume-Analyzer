import React, { useState, useRef, useEffect } from "react";
import "./AnalysisSection.css";

function AnalysisSection({
  onSubmit,
  isAnalyzing,
  analysisCompleted,
  resumeText,
  setResumeText,
  jobDescriptionText,
  setJobDescriptionText,
}) {
  const [resumeTextCount, setResumeTextCount] = useState(0);
  const [jobDescriptionTextCount, setJobDescriptionTextCount] = useState(0);
  const resumeTextAreaRef = useRef(null);
  const jobDescriptionTextAreaRef = useRef(null);

  useEffect(() => {
    if (resumeTextAreaRef.current) {
      resumeTextAreaRef.current.style.height = "auto"; // Reset height
      resumeTextAreaRef.current.style.height = `${resumeTextAreaRef.current.scrollHeight}px`; // Adjust height
    }

    setResumeTextCount(resumeText.length); // Update character count
  }, [resumeText]); // Dependency array includes resumeText

  const handleAnalyzeClick = () => {
    console.log("resume: ",resumeText, " job description: ", jobDescriptionText);
    onSubmit(resumeText, jobDescriptionText);
  };

  const getCharacterMessage = (count, maxCount) => {
    const formattedMaxCount = maxCount.toLocaleString();
    if (count >= 1)
      return `Keep going...(500 characters minimum; ${formattedMaxCount} characters maximum).`;
    if (count >= maxCount)
      return `Maximum characters reached (${formattedMaxCount} maximum).`;
    return `Analysis begins in ${
      500 - count
    } characters (${formattedMaxCount} characters maximum).`;
  };

  const handleTextChange = (
    e,
    setText,
    setTextCount,
    textAreaRef,
    maxCount
  ) => {
    let newValue = e.target.value;
    if (newValue.length > maxCount) {
      newValue = newValue.substring(0, maxCount); // Truncate to maxCount characters
    }

    setText(newValue);
    setTextCount(newValue.length);

    // Dynamically adjust the height of the textarea
    textAreaRef.current.style.height = "auto";
    textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
  };

  const handleResumeTextChange = (e) => {
    handleTextChange(
      e,
      setResumeText,
      setResumeTextCount,
      resumeTextAreaRef,
      15000
    ); // Updated maxCount to 15000
  };

  const handleJobDescriptionTextChange = (e) => {
    handleTextChange(
      e,
      setJobDescriptionText,
      setJobDescriptionTextCount,
      jobDescriptionTextAreaRef,
      5000
    ); // Updated maxCount to 5000
  };

  const cappedResumeTextCount = resumeTextCount > 500 ? 500 : resumeTextCount;
  const cappedJobDescriptionTextCount =
    jobDescriptionTextCount > 500 ? 500 : jobDescriptionTextCount;
  const cappedRemainingCharacters =
    1000 - cappedResumeTextCount - cappedJobDescriptionTextCount;
  const formattedcappedRemainingCharacters =
    cappedRemainingCharacters.toLocaleString();

  useEffect(() => {
    if (resumeTextAreaRef.current) {
      resumeTextAreaRef.current.style.height = "auto"; // Reset height to shrink if needed
      resumeTextAreaRef.current.style.height = `${resumeTextAreaRef.current.scrollHeight}px`; // Set to scroll height
    }

    if (jobDescriptionTextAreaRef.current) {
      jobDescriptionTextAreaRef.current.style.height = "auto";
      jobDescriptionTextAreaRef.current.style.height = `${jobDescriptionTextAreaRef.current.scrollHeight}px`;
    }

    setResumeTextCount(resumeText.length);
    setJobDescriptionTextCount(jobDescriptionText.length);
  }, [resumeText, jobDescriptionText]);

  return (
    <div className="analysis-section">
      <div className="textarea-container">
        <h3>1. Resume</h3>
        <h5>(minimum 500 characters)</h5>
        <textarea
          ref={resumeTextAreaRef}
          className="styled-textarea"
          value={resumeText}
          onChange={handleResumeTextChange}
          placeholder="Type or paste your current resume text here.
          Include:
          Header
          • [Full Name]
          • [Address]
          • [Phone Number]
          • [Email]
          ---------------------------
          Body
          (Information strongly connecting you to the Job Description.)
          • Education--How does your education meet the Job Description requirements?
          • Experience--What experience do you have satisfying the Job Description?
          • Skills--What skills do you possess to meet or exceed the Job description?
          • Certifications--Do you possess the necessary certifications and licensing?"
            style={{ whiteSpace: "pre-line" }}
        />
        <p className="char-count">
          {getCharacterMessage(resumeTextCount, 15000)}
        </p>{" "}
        {/* Updated maxCount to 15000 */}
        <p className="char-count-left">
          {resumeTextCount} {resumeTextCount === 1 ? "character" : "characters"}
        </p>
      </div>
      <div className="textarea-container">
        <h3>2. Job Description</h3>
        <h5>(minimum 500 characters)</h5>
        <textarea
          ref={jobDescriptionTextAreaRef}
          className="styled-textarea"
          value={jobDescriptionText}
          onChange={handleJobDescriptionTextChange}
          placeholder="Paste a recent job description text here."
        />
        <p className="char-count">
          {getCharacterMessage(jobDescriptionTextCount, 5000)}
        </p>{" "}
        {/* Updated maxCount to 5000 */}
        <p className="char-count-left">
          {jobDescriptionTextCount}{" "}
          {jobDescriptionTextCount === 1 ? "character" : "characters"}
        </p>
      </div>
      {cappedRemainingCharacters > 0 && (
        <h4 className="char-count-total">
          Analysis commencing in {formattedcappedRemainingCharacters}{" "}
          characters.
        </h4>
      )}
      {!isAnalyzing &&
        !analysisCompleted &&
        resumeTextCount > 500 &&
        jobDescriptionTextCount > 500 && (
          <button className="analysis-button" onClick={handleAnalyzeClick}>
            Analyze
          </button>
        )}
    </div>
  );
}

export default AnalysisSection;