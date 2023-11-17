import React, { useState, useEffect } from 'react';
import PreviousWorkSection from './PreviousWorkSection';
import AnalysisSection from './AnalysisSection';
import ResultsSection from './ResultsSection';
import RevisionSection from './RevisionSection';
import FinalResultsSection from './FinalResultsSection';
import LogoutLink from './LogoutLink';
import './Dashboard.css';
import axios from 'axios';
import Spinner from './Spinner';
import { db } from '../utils/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import DocumentModal from './DocumentModal'; 


function Dashboard() {
  const [showRevisionSection, setShowRevisionSection] = useState(false);
  const [resumeKeywords, setResumeKeywords] = useState([]);
  const [jobDescriptionKeywords, setJobDescriptionKeywords] = useState([]);
  const [atsScore, setAtsScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [missingKeywords, setMissingKeywords] = useState([]);
  const [assessment, setAssessment] = useState('');
  const [employabilityScore, setEmployabilityScore] = useState(0);
  const [bestPossibleJob, setBestPossibleJob] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [jobDescriptionText, setJobDescriptionText] = useState('');
  const [isRevising, setIsRevising] = useState(false);
  const [revisionCompleted, setRevisionCompleted] = useState(false);
  const [finalResume, setFinalResume] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [newEmployabilityScore, setNewEmployabilityScore] = useState(0);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [deletionCount, setDeletionCount] = useState(0);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    if (deletionCount > 0) {
      fetchUserData();
    }
  }, [deletionCount]);
  
  const fetchUserData = async () => {
    const auth = getAuth();
    if (auth.currentUser) {
      try {
        const q = query(collection(db, "users", auth.currentUser.uid, "documents"));
        const querySnapshot = await getDocs(q);
        const updatedDocuments = [];
        querySnapshot.forEach((doc) => {
          updatedDocuments.push({ id: doc.id, ...doc.data() });
        });
        // Assuming you have a state variable to hold the documents
        setDocuments(updatedDocuments);
      } catch (error) {
        console.error("Error fetching documents: ", error);
      }
    }
  };
  

  const handleAnalysis = async (resumeText, jobDescriptionText) => {
    setIsAnalyzing(true);
    const resumeData = { resumeText, jobDescriptionText };
    await handleSubmit(resumeData);
  };

  const handleRevisionsSubmission = async (resume, jobDescription, revisions) => {
    setIsRevising(true);
    try {
      const response = await axios.post('/api/submit-revision', { resume, jobDescription, revisions });
      if (response.data && response.data.message) {
        const parsedRevisionData = parseOpenAIResponse(response.data.message);
        console.log("Parsed Revision Data: ", parsedRevisionData);
        setFinalResume(parsedRevisionData.finalResume);
        setCoverLetter(parsedRevisionData.coverLetter);
        setNewEmployabilityScore(parsedRevisionData.newEmployabilityScore);
      }
      setRevisionCompleted(true);
    } catch (error) {
      console.error(error);
      // Handle error (consider updating state to show error in UI)
    } finally {
      setIsRevising(false);
    }
    setShowResults(true); // Hide initial results if showing final results
    setShowRevisionSection(true);
    setShowFinalResults(true);
  };


  const handleSubmit = async (resumeData) => {
    try {
      const response = await axios.post('/api/analyze-resume', resumeData);
      if (response.status === 200) {
        const message = response.data.message;
        const parsedData = parsePlainTextResponse(message);
        setResumeKeywords(parsedData.resumeKeywords);
        setJobDescriptionKeywords(parsedData.jobDescriptionKeywords);
        setAtsScore(parsedData.atsScore);
        setMissingKeywords(parsedData.missingKeywords);
        setAssessment(parsedData.assessment);
        setEmployabilityScore(parsedData.atsScore);
        setBestPossibleJob(parsedData.bestPossibleJob);
        setShowResults(true);
      } else {
        // Handle non-200 status
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
      setAnalysisCompleted(true);
    }
    setShowRevisionSection(false);
  };

  const [selectedResumeContent, setSelectedResumeContent] = useState('');
  const [selectedCoverLetterContent, setSelectedCoverLetterContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    console.log("Modal open state changed:", isModalOpen);
  }, [isModalOpen]);
  
  const handleDivClick = (resumeContent, coverLetterContent, documentId) => {
    setSelectedResumeContent(resumeContent);
    setSelectedCoverLetterContent(coverLetterContent);
    setSelectedDocumentId(documentId); // Update the selected document ID
    setIsModalOpen(true);
  };

  const handleRework = () => {
    setResumeText(selectedResumeContent); // Update the resume text for the analysis section
    setIsModalOpen(false); // Close the modal
  };

  function parsePlainTextResponse(text) {
    // Split the entire message by new lines
    text = text.replace(/`/g, '');
    const lines = text.split('\n');
  
    // Find the indices for each section
    const resumeKeywordsIndex = lines.findIndex(line => line.includes('Resume Keywords:'));
    const jobDescriptionKeywordsIndex = lines.findIndex(line => line.includes('Job Description Keywords:'));
    const missingKeywordsIndex = lines.findIndex(line => line.includes('Missing Keywords:'));
    const assessmentIndex = lines.findIndex(line => line.includes('Assessment:'));
    const employabilityScoreIndex = lines.findIndex(line => line.includes('Employability Score:'));
    const bestPossibleJobIndex = lines.findIndex(line => line.includes('Best Possible Job:'));
  
    // Filter lines for resume keywords
    const resumeKeywords = lines
      .slice(resumeKeywordsIndex + 1, jobDescriptionKeywordsIndex)
      .filter(line => line.startsWith('- '))
      .map(keyword => keyword.substring(2).trim());
  
    // Filter lines for job description keywords
    const jobDescriptionKeywords = lines
      .slice(jobDescriptionKeywordsIndex + 1, missingKeywordsIndex)
      .filter(line => line.startsWith('- '))
      .map(keyword => keyword.substring(2).trim());
  
    // Extract the assessment text
    const assessment = lines
      .slice(assessmentIndex + 1, employabilityScoreIndex)
      .join(' ')
      .trim();
    
    // Extract missing keywords
    const missingKeywords = lines
    .slice(missingKeywordsIndex + 1, assessmentIndex)
    .filter(line => line.startsWith('- '))
    .map(keyword => keyword.substring(2).trim());
  
    // Extract the ATS score
    const employabilityScoreLine = lines[employabilityScoreIndex];
    const atsScore = employabilityScoreLine ? parseInt(employabilityScoreLine.split(':')[1].trim(), 10) : 0;
  
    // Extract the best possible job text
    const bestPossibleJob = lines
      .slice(bestPossibleJobIndex + 1)
      .join(' ')
      .trim();
  
    // Return the parsed data
    return {
      resumeKeywords,
      jobDescriptionKeywords,
      missingKeywords,
      assessment,
      atsScore,
      bestPossibleJob
    };
  }

  function parseOpenAIResponse(responseText) {
    responseText = responseText.replace(/`/g, '');
    // Split the entire message by new lines
    const lines = responseText.split('\n');

    // Find the indices for each section
    const finalResumeIndex = lines.findIndex(line => line.includes('Final Resume:'));
    const eScoreIndex = lines.findIndex(line => line.includes('EScore:'));
    const coverLetterIndex = lines.findIndex(line => line.includes('Cover Letter:'));

    let finalResume = '';
    let newEmployabilityScore = 0;
    let coverLetter = '';

    if (finalResumeIndex !== -1 && eScoreIndex !== -1) {
        finalResume = lines.slice(finalResumeIndex + 1, eScoreIndex).join('\n').trim();
    }

    if (eScoreIndex !== -1) {
        const scoreLine = lines[eScoreIndex];
        const scoreRegex = /EScore:\s*(\d+)/; // Updated regex to match 'EScore: [number]'
        const scoreMatch = scoreLine.match(scoreRegex);

        if (scoreMatch && scoreMatch[1]) {
            newEmployabilityScore = parseInt(scoreMatch[1], 10);
        } else {
            console.error("EScore parsing failed or not found");
            newEmployabilityScore = "N/A"; // Default value in case of parsing failure
        }
    } else {
        newEmployabilityScore = "N/A"; // Default value if EScore line is not found
    }

    // Add a check to prevent rendering NaN
    if (isNaN(newEmployabilityScore)) {
        newEmployabilityScore = "N/A"; // or some default value
    }

    if (coverLetterIndex !== -1) {
        coverLetter = lines.slice(coverLetterIndex + 1).join('\n').trim();
    }

    // Log for debugging
    console.log({ finalResume, newEmployabilityScore, coverLetter });

    return {
        finalResume,
        newEmployabilityScore,
        coverLetter
    };
}

const handleSaveToFirestore = async (title, finalResume, coverLetter, newEmployabilityScore) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    try {
      const q = query(collection(db, "users", user.uid, "documents"), where("title", "==", title));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        // A document with the same title exists
        console.warn("A document with this title already exists.");
        // Add logic to handle this scenario (e.g., prompt user for action)
      } else {
        // Save the new document as no duplicate was found
        console.log("newEmployabilityScore before addDoc:", newEmployabilityScore);
        if (newEmployabilityScore === undefined) {
          console.error("newEmployabilityScore is undefined, aborting save");
          return;
        }
        const docRef = await addDoc(collection(db, "users", user.uid, "documents"), {
          title,
          finalResume,
          coverLetter,
          newEmployabilityScore,
          createdAt: serverTimestamp()
        });
        console.log("Document written with ID: ", docRef.id);
      }
    } catch (error) {
      console.error("Error saving document: ", error);
    }
  } else {
    console.log("No user logged in");
  }
};

  const handleDeleteDocument = async (documentId) => {
    console.log('Deleting document with ID:', documentId);
    const auth = getAuth();
    try {
      await deleteDoc(doc(db, "users", auth.currentUser.uid, "documents", documentId));
      setIsModalOpen(false);
      setDeletionCount(deletionCount + 1);
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert(`Error deleting document: ${error.message}`);
    }
  };


  return (
    <div className="dashboard">
      <h1>Advanced Resume</h1>
      <h3>Add your current resume and a recent job description, below.</h3>
      <h2>Previous Resumes</h2>
      <h4>Click a resume to view</h4>
      <div className="previous-work-section">
      <PreviousWorkSection 
        documents={documents} 
        setDocuments={setDocuments}
        onDocumentClick={handleDivClick} 
        onDeleteDocument={handleDeleteDocument} 
      />

      </div>
      <div className="analysis-section">
        <AnalysisSection
          onSubmit={handleAnalysis}
          isAnalyzing={isAnalyzing}
          analysisCompleted={analysisCompleted}
          resumeText={resumeText}
          setResumeText={setResumeText}
          jobDescriptionText={jobDescriptionText}
          setJobDescriptionText={setJobDescriptionText}
        />
      </div>
  
      {isAnalyzing && <Spinner />}
  
      {!isAnalyzing && showResults && (
        <ResultsSection
          resumeKeywords={resumeKeywords}
          jobDescriptionKeywords={jobDescriptionKeywords}
          atsScore={atsScore}
        />
      )}
  
      {!isAnalyzing && (showResults || showRevisionSection) && (
        <RevisionSection 
          missingKeywords={missingKeywords}
          assessment={assessment}
          employabilityScore={employabilityScore}
          bestPossibleJob={bestPossibleJob}
          onSubmitRevisions={handleRevisionsSubmission}
          originalResume={resumeText}
          originalJobDescription={jobDescriptionText}
          isRevising={isRevising}
          revisionCompleted={revisionCompleted}
        />
      )}
  
      {!isAnalyzing && showFinalResults && (
        <FinalResultsSection
          finalResume={finalResume}
          coverLetter={coverLetter}
          newEmployabilityScore={newEmployabilityScore}
          onSave={handleSaveToFirestore}
        />
      )}
  
      <nav className="logout-nav">
        <LogoutLink />
      </nav>
      {isModalOpen && (
        <DocumentModal
          coverLetter={selectedCoverLetterContent}
          resume={selectedResumeContent}
          onClose={() => setIsModalOpen(false)}
          onRework={handleRework}
          onDelete={() => handleDeleteDocument(selectedDocumentId)}
        />
      )}
    </div>
  );
}

export default Dashboard;