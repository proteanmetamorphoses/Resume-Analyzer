import React, { useState, useEffect } from 'react';
import { auth } from '../utils/firebase'; // Adjust the path if needed

function Dashboard() {
  const [user, setUser] = useState(null);
  const [resume, setResume] = useState(''); // Store the user's resume
  const [jobDescription, setJobDescription] = useState(''); // Store the job description

  const handleAnalysis = () => {
    // Logic to analyze the resume and job description
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
      <h1>Welcome to your Dashboard</h1>

      <div className="resume-input">
        <h2>Input your resume:</h2>
        <textarea value={resume} onChange={(e) => setResume(e.target.value)}></textarea>
      </div>

      <div className="job-description-input">
        <h2>Input the job description:</h2>
        <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)}></textarea>
      </div>

        <button onClick={handleAnalysis}>Analyze</button>

        {/* Sections for comparison results, revisions, and download options */}
    </div>
  );
}

export default Dashboard;
