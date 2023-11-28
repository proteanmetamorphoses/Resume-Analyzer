import React, { useEffect, useState } from "react";
import "./FinalResultsSection.css";
import { saveAs } from "file-saver";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  SectionType,
  TextRun,
} from "docx";
import Modal from "@mui/material/Modal";
import checkDocumentsExist from "./checkDocumentsExist";

export const downloadDocument = (coverLetter, resume, fileName) => {
  const fontSize = 22;
  const fontName = "Times New Roman";
  const coverLetterParagraphs = coverLetter.split("\n").map(
    (line) =>
      new Paragraph({
        children: [
          new TextRun({
            text: line,
            size: fontSize, // Size is in half-points, so 24 equals 12pt font
            font: {
              name: fontName,
            },
          }),
        ],
      })
  );

  const resumeParagraphs = resume.split("\n").map(
    (line) =>
      new Paragraph({
        children: [
          new TextRun({
            text: line,
            size: fontSize,
            font: {
              name: fontName,
            },
          }),
        ],
      })
  );

  // Create a Document with sections defined in the constructor
  const doc = new Document({
    creator: "Advanced Resume",
    title: "Cover Letter and Resume",
    description: "User-Created Document",
    sections: [
      {
        // Cover Letter Section
        children: [
          new Paragraph({
            text: "Cover Letter",
            heading: HeadingLevel.HEADING_2,
          }),
          ...coverLetterParagraphs,
          new Paragraph({ text: "", break: 1 }), // Adding a page break
        ],
      },
      {
        // Resume Section
        properties: { type: SectionType.NEXT_PAGE },
        children: [
          new Paragraph({
            text: "Resume",
            heading: HeadingLevel.HEADING_2,
          }),
          ...resumeParagraphs,
        ],
      },
    ],
  });

  // Generate and download the file
  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, fileName);
  });
};

function FinalResultsSection({
  finalResume,
  newEmployabilityScore,
  coverLetter,
  onSave,
}) {
  const [title, setTitle] = useState(""); // State to store the title
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [userUid, setUserUid] = useState(null); // State to store the user's UID

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is authenticated
        setUserUid(user.uid); // Set the user's UID in state
      } else {
        // User is not authenticated
        setUserUid(null); // Clear the user's UID in state
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

const handleOverWrite = async () =>{
  console.log("Attempting to overwrite.");
  console.log(userUid);
  onSave(title, finalResume, coverLetter, newEmployabilityScore);
  setShowErrorModal(false);
}

  const handleSave = async () => {
    if (title) {
      // Check if documents with the same title exist in Firestore
      const documentsExist = await checkDocumentsExist(userUid, title);

      if (documentsExist) {
        setShowErrorModal(true);
        console.log("A document with the same title already exists.  OverWrite?");
      } else {
        onSave(title, finalResume, coverLetter, newEmployabilityScore);
        
      }
    } else {
      console.log("Please enter a title for the document.");
    }
  };

  const handleDownload = () => {
    downloadDocument(coverLetter, finalResume, "CoverLetterAndResume.docx");
  };

  return (
    <div className="final-results-section">
      <div>
        <h3>Revised Resume</h3>
        <div className="revised-resume">
          {finalResume.split("\n").map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </div>
      </div>
      <h3 className="ats-score-header">Revised Fit</h3>
      <h3 className="revised-ats-score">{newEmployabilityScore}</h3>
      <div>
        <h3 className="cover-letter-header">Cover Letter</h3>
        <div className="cover-letter">
          {coverLetter.split("\n").map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </div>
      </div>
      <input
        type="text"
        placeholder="Enter title to save docx."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="actions">
        <button onClick={handleSave}>Save</button>
        <button onClick={handleDownload}>Download</button>
      </div>
      <Modal open={showErrorModal}>
        <div className="modal-content">
          <h3 className="modalH3">Just a moment...</h3>
          <p>A document with the same title already exists.  OverWrite?</p>
          <button onClick={handleOverWrite}>Overwrite</button>
          <button onClick={() => setShowErrorModal(false)}>Abort Save</button>
        </div>
      </Modal>
    </div>
  );
}

export default FinalResultsSection;
