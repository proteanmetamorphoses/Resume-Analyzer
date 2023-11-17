import React from 'react';
import './DocumentModal.css'; // Import the CSS file

function DocumentModal({ coverLetter, resume, onClose, onRework }) {
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
          <button onClick={onRework}>Reuse Resume</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default DocumentModal;