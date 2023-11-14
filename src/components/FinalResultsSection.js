import React, { useState } from 'react';
import './FinalResultsSection.css';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, HeadingLevel, SectionType, TextRun } from 'docx';

const downloadDocument = (coverLetter, resume, fileName) => {
  const fontSize = 22;
  const fontName = "Times New Roman";
  const coverLetterParagraphs = coverLetter.split('\n').map(
    line => new Paragraph({
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

  const resumeParagraphs = resume.split('\n').map(
    line => new Paragraph({
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
    description: "User Created Document",
    sections: [
      {
        // Cover Letter Section
        children: [
          new Paragraph({
            text: "Cover Letter",
            heading: HeadingLevel.HEADING_2
          }),
          ...coverLetterParagraphs,
          new Paragraph({ text: '', break: 1 }), // Adding a page break
        ],
      },
      {
        // Resume Section
        properties: { type: SectionType.NEXT_PAGE },
        children: [
          new Paragraph({
            text: "Resume",
            heading: HeadingLevel.HEADING_2
          }),
          ...resumeParagraphs
        ],
      }
    ]
  });

  // Generate and download the file
  Packer.toBlob(doc).then(blob => {
    saveAs(blob, fileName);
  });
};


function FinalResultsSection({ finalResume, newEmployabilityScore, coverLetter, onSave }) {
  const [title, setTitle] = useState(""); // State to store the title
  const handleSave = () => {
    if (title) {
      console.log("newEmployabilityScore on Save:", newEmployabilityScore);
      onSave(title, finalResume, coverLetter, newEmployabilityScore);
    } else {
      console.log("Please enter a title for the document.");
    }
  };

  const handleDownload = () => {
    downloadDocument(coverLetter, finalResume, 'CoverLetterAndResume.docx');
  };

  return (
    <div className="final-results-section">
      <div>
        <h3>Revised Resume</h3>
        <div className="revised-resume">
          {finalResume.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </div>
      </div>
      <h3 className="ats-score-header">Revised ATS Score</h3> 
      <h3 className="revised-ats-score">
        {newEmployabilityScore}
      </h3>
      <div>
          <h3 className="cover-letter-header">Cover Letter</h3>
          <div className="cover-letter">
            {coverLetter.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </div>
      </div>
      <input
        type="text"
        placeholder="Enter document title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="actions">
        <button onClick={handleSave}>Save</button>
        <button onClick={handleDownload}>Download</button>
      </div>
    </div>
  );
}

export default FinalResultsSection;
