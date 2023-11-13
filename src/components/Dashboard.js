import React, { useState } from 'react';
import PreviousWorkSection from './PreviousWorkSection';
import AnalysisSection from './AnalysisSection';
import ResultsSection from './ResultsSection';
import RevisionSection from './RevisionSection';
import FinalResultsSection from './FinalResultsSection';
import LogoutLink from './LogoutLink';
import './Dashboard.css';
import axios from 'axios';
import Spinner from './Spinner';

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


  const handleAnalysis = async (resumeText, jobDescriptionText) => {
    setIsAnalyzing(true);
    const resumeData = { resumeText, jobDescriptionText };
    await handleSubmit(resumeData);
  };

  const handleRevisionsSubmission = async (resume, jobDescription, revisions) => {
    try {
      const response = await axios.post('/api/submit-revision', { resume, jobDescription, revisions });
      console.log(response);
    } catch (error) {
      console.error(error);
      // Handle error
    }
    setShowResults(true);
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

  
  function parsePlainTextResponse(text) {
    // Split the entire message by new lines
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

  return (
    <div className="dashboard">
      <h1>Advanced Resume</h1>
      <h3>Add your starter resume and a recent job description, below.</h3>
      <div className="previous-work-section">
        <PreviousWorkSection />
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
        />
      )}
  
      {!isAnalyzing && showFinalResults && <FinalResultsSection />}
  
      <nav className="logout-nav">
        <LogoutLink />
      </nav>
    </div>
  );
}

export default Dashboard;