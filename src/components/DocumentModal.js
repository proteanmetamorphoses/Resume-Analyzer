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
      <div className="document-modal-content">
        <div className="documents-modal-container">
          <div className="document-modal-section">
            <h3>Cover Letter</h3>
            <p className = "Cover-Letter">{coverLetter}</p>
          </div>
          <div className="document-modal-section">
            <h3>Resume</h3>
            <p className="Resume">{resume}</p>
          </div>
        </div>
        <div className="buttons-container">
          <button id = "Rework" className="DocModal" onClick={onRework}>Use Resume</button>
          <button id = "Download" className="DocModal" onClick={handleDownload}>Download</button>
          <button id = "Delete" className="DocModal" onClick={onDelete} disabled={isDeleteDisabled}>
            Delete
          </button>
          <button id = "Close" className="DocModal" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default DocumentModal;
