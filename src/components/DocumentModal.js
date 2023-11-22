import React from "react";
import "./DocumentModal.css"; // Import the CSS file
import { downloadDocument } from "./FinalResultsSection";

function DocumentModal({ coverLetter, resume, onClose, onRework, onDelete }) {
  const isDeleteDisabled = !resume && !coverLetter;
  const handleDownload = () => {
    downloadDocument(coverLetter, resume, "CoverLetterAndResume.docx");
    onClose();
  };

  return (
    <div className="document-modal">
      <div className="document-content">
        <div className="documents-container">
          <div className="document-section">
            <h3>Cover Letter</h3>
            <p>{coverLetter}</p>
          </div>
          <div className="document-section">
            <h3>Resume</h3>
            <p>{resume}</p>
          </div>
        </div>
        <div className="buttons-container">
          <button onClick={onRework}>Use Resume</button>
          <button onClick={handleDownload}>Download</button>
          <button onClick={onDelete} disabled={isDeleteDisabled}>
            Delete
          </button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default DocumentModal;
