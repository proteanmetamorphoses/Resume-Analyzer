import React, { useState, useEffect } from 'react';
import { auth } from '../utils/firebase';
import PreviousWorkSection from './PreviousWorkSection';
import AnalysisSection from './AnalysisSection';
import ResultsSection from './ResultsSection'; 
import RevisionSection from './RevisionSection';
import FinalResultsSection from './FinalResultsSection';
import LogoutLink from './LogoutLink';
import './Dashboard.css';
import Todo from '../utils/Todo.jsx';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [resume, setResume] = useState(''); // Store the user's resume
  const [jobDescription, setJobDescription] = useState(''); // Store the job description

  const handleAnalysis = () => {
    // Logic to analyze the resume and job description
  };
  const handleRevisionsSubmission = (revisions) => {
    console.log('Revisions submitted:', revisions);
  };
  // Fetch user data when the component mounts
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      // Fetch additional user data from Firestore if needed
      setUser(currentUser);
    }
  }, []);

  return (
    <div className="dashboard">
      <h1>Advanced</h1>
      <h3>Add your starter resume and a recent job description.</h3>
      <div className="previous-work-section">
          <PreviousWorkSection />
      </div>
      <div className="analysis-section">
          <AnalysisSection />
      </div>
      <ResultsSection />
      <RevisionSection missingKeywords={[]} onSubmitRevisions={handleRevisionsSubmission} />
      <FinalResultsSection />
      <nav className="logout-nav">
        <LogoutLink />
      </nav>
    </div>
  );
}

export default Dashboard;
