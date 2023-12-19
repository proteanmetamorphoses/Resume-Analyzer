import React, { useState, useRef, useEffect } from "react";
import "./AnalysisSection.css";
import { db } from "../utils/firebase"; // Assuming you have a firebase.js file for configuration
import { doc, getDoc, setDoc } from "firebase/firestore"; // Import Firestore functions
import { getAuth } from "firebase/auth"; // Import Firebase Auth

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
  const auth = getAuth(); // Initialize Firebase Auth;

  useEffect(() => {
    if (resumeTextAreaRef.current) {
      resumeTextAreaRef.current.style.height = "auto"; // Reset height
      resumeTextAreaRef.current.style.height = `${resumeTextAreaRef.current.scrollHeight}px`; // Adjust height
    }

    setResumeTextCount(resumeText.length); // Update character count
  }, [resumeText]); // Dependency array includes resumeText

  // Function to retrieve master resume from Firestore
  const pullMasterResume = async () => {
    console.log("Pulling Master Resume if available, blank otherwise.");
    const user = auth.currentUser;
    if (!user) {
      console.log("No user logged in");
      return;
    }
    try {
      const docRef = doc(db, "users", user.uid, "masterResumes", "resume");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setResumeText(docSnap.data().resume);
      } else {
        console.log("No master resume found");
      }
    } catch (error) {
      console.error("Error fetching master resume:", error);
    }
  };

  // Function to save master resume to Firestore
  const setMasterResume = async () => {
    console.log("Setting Master Resume.");
    const user = auth.currentUser;
    if (!user) {
      console.log("No user logged in");
      return;
    }

    if (!resumeText.trim()) {
      console.log("Resume text is empty. Not saving.");
      return;
    }

    try {
      // Path: 'users/{userId}/masterResumes/resume'
      // This creates/updates a document with ID 'resume' under the 'masterResumes' subcollection for each user.
      const docRef = doc(db, "users", user.uid, "masterResumes", "resume");
      await setDoc(docRef, { resume: resumeText });
      console.log("Master resume saved/updated");
    } catch (error) {
      console.error("Error saving master resume:", error);
    }
  };

  const handleAnalyzeClick = () => {
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
        <p className="char-count-left">
          {resumeTextCount} {resumeTextCount === 1 ? "character" : "characters"}
        </p>
      </div>
      <div className="MasterResume">
        <div className="pullFromMaster">
          <button className="pullMaster" onClick={pullMasterResume}>
            Get Master Resume
          </button>
        </div>
        <div className="AddtoMaster">
          <button className="setMaster" onClick={setMasterResume}>
            Set Master Resume
          </button>
        </div>
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
        <p className="char-count-left">
          {jobDescriptionTextCount}{" "}
          {jobDescriptionTextCount === 1 ? "character" : "characters"}
        </p>
      </div>
      {cappedRemainingCharacters > 0 && (
        <h4 className="char-count-total">
          Analyze button in {formattedcappedRemainingCharacters}{" "}
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
