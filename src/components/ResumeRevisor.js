import React, { useState, useEffect } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PreviousWorkSection from "./PreviousWorkSection";
import AnalysisSection from "./AnalysisSection";
import ResultsSection from "./ResultsSection";
import RevisionSection from "./RevisionSection";
import FinalResultsSection from "./FinalResultsSection";
import { logout } from "../utils/firebase";
import "./ResumeRevisor.css";
import axios from "axios";
import { db } from "../utils/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import DocumentModal from "./DocumentModal";
import VoiceBotIframe from "./VoiceBotiFrame";
import HexagonBackground from "./HexagonBackground";
import JobSearch from "./JobSearch";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import Spinner from "./Spinner";

function Dashboard() {
  const navigate = useNavigate();
  const [showRevisionSection, setShowRevisionSection] = useState(false);
  const [resumeKeywords, setResumeKeywords] = useState([]);
  const [jobDescriptionKeywords, setJobDescriptionKeywords] = useState([]);
  const [atsScore, setAtsScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [missingKeywords, setMissingKeywords] = useState([]);
  const [assessment, setAssessment] = useState("");
  const [employabilityScore, setEmployabilityScore] = useState(0);
  const [bestPossibleJob, setBestPossibleJob] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [jobDescriptionText, setJobDescriptionText] = useState("");
  const [isRevising, setIsRevising] = useState(false);
  const [revisionCompleted, setRevisionCompleted] = useState(false);
  const [finalResume, setFinalResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [newEmployabilityScore, setNewEmployabilityScore] = useState(0);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [deletionCount, setDeletionCount] = useState(0);
  const [documents, setDocuments] = useState([]);
  const [overwriteCount, setoverwriteCount] = useState(0);
  const [saveCount, setSaveCount] = useState(0);
  const [showVoiceBot, setShowVoiceBot] = useState(false);
  const [ReplacementJobDescription, setReplacementJobDescription] =
    useState("");
  const [isTest, setIsTest] = useState(false);
  const [showPreviousWork, setShowPreviousWork] = useState(false);
  let voiceBotText = "You're at the right place for resume help.";
  let AudioFile = 0;
  let sentences = [];

  useEffect(() => {
    if (deletionCount > 0 || overwriteCount > 0 || saveCount > 0) {
      fetchUserData();
    }
  }, [deletionCount, overwriteCount, saveCount]);

  const parseCSV = () => {
    return new Promise((resolve, reject) => {
      Papa.parse("/data/AudioFiles.csv", {
        download: true,
        header: false,
        complete: (results) => {
          const arrayOfSentences = results.data
            .map((row) => row[0])
            .filter((sentence) => sentence.trim() !== "");
          resolve(arrayOfSentences);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  };

  async function init() {
    try {
      sentences = await parseCSV();
      // At this point, sentences is populated
    } catch (error) {
      console.error("Error parsing CSV: ", error);
    }
  }

  init();
  const updateReplacementJobDescription = (
    companyName,
    location,
    via,
    description
  ) => {
    const newJobDetails = `Company Name: ${companyName}\nLocation: ${location}\nVia: ${via}\nDescription: ${description}`;
    setReplacementJobDescription(newJobDetails);
  };
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsOpen(open);
  };

  const list = () => (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItemButton onClick={InterViewPractice}>
          <ListItemText primary="Interview Practice" />
        </ListItemButton>
        <ListItemButton onClick={testResponses}>
          <ListItemText primary="Test" />
        </ListItemButton>
        <ListItemButton onClick={resetDashboard}>
          <ListItemText primary="Reset" />
        </ListItemButton>
        <ListItemButton onClick={admin}>
          <ListItemText primary="Admin" />
        </ListItemButton>
        <ListItemButton onClick={Logout}>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </div>
  );

  const fetchUserData = async () => {
    const auth = getAuth();
    if (auth.currentUser) {
      try {
        const q = query(
          collection(db, "users", auth.currentUser.uid, "documents")
        );
        const querySnapshot = await getDocs(q);
        const updatedDocuments = [];
        querySnapshot.forEach((doc) => {
          updatedDocuments.push({ id: doc.id, ...doc.data() });
        });
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

  const handleRevisionsSubmission = async (
    resume,
    jobDescription,
    revisions
  ) => {
    setIsRevising(true);
    try {
      const response = await axios.post("/api/submit-revision", {
        resume,
        jobDescription,
        revisions,
      });
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
      const response = await axios.post("/api/analyze-resume", resumeData);
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

  const [selectedResumeContent, setSelectedResumeContent] = useState("");
  const [selectedCoverLetterContent, setSelectedCoverLetterContent] =
    useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    text = text.replace(/`/g, "");
    const lines = text.split("\n");

    // Find the indices for each section
    const resumeKeywordsIndex = lines.findIndex((line) =>
      line.includes("Resume Keywords:")
    );
    const jobDescriptionKeywordsIndex = lines.findIndex((line) =>
      line.includes("Job Description Keywords:")
    );
    const missingKeywordsIndex = lines.findIndex((line) =>
      line.includes("Missing Keywords:")
    );
    const assessmentIndex = lines.findIndex((line) =>
      line.includes("Assessment:")
    );
    const employabilityScoreIndex = lines.findIndex((line) =>
      line.includes("Employability Score:")
    );
    const bestPossibleJobIndex = lines.findIndex((line) =>
      line.includes("Best Possible Job:")
    );

    // Filter lines for resume keywords
    const resumeKeywords = lines
      .slice(resumeKeywordsIndex + 1, jobDescriptionKeywordsIndex)
      .filter((line) => line.startsWith("- "))
      .map((keyword) => keyword.substring(2).trim());

    // Filter lines for job description keywords
    const jobDescriptionKeywords = lines
      .slice(jobDescriptionKeywordsIndex + 1, missingKeywordsIndex)
      .filter((line) => line.startsWith("- "))
      .map((keyword) => keyword.substring(2).trim());

    // Extract the assessment text
    const assessment = lines
      .slice(assessmentIndex + 1, employabilityScoreIndex)
      .join(" ")
      .trim();

    // Extract missing keywords
    const missingKeywords = lines
      .slice(missingKeywordsIndex + 1, assessmentIndex)
      .filter((line) => line.startsWith("- "))
      .map((keyword) => keyword.substring(2).trim());

    // Extract the ATS score
    const employabilityScoreLine = lines[employabilityScoreIndex];
    const atsScore = employabilityScoreLine
      ? parseInt(employabilityScoreLine.split(":")[1].trim(), 10)
      : 0;

    // Extract the best possible job text
    const bestPossibleJob = lines
      .slice(bestPossibleJobIndex + 1)
      .join(" ")
      .trim();

    // Return the parsed data
    return {
      resumeKeywords,
      jobDescriptionKeywords,
      missingKeywords,
      assessment,
      atsScore,
      bestPossibleJob,
    };
  }

  function parseOpenAIResponse(responseText) {
    responseText = responseText.replace(/`/g, "");
    // Split the entire message by new lines
    const lines = responseText.split("\n");

    // Find the indices for each section
    const finalResumeIndex = lines.findIndex((line) =>
      line.includes("Final Resume:")
    );
    const eScoreIndex = lines.findIndex((line) => line.includes("EScore:"));
    const coverLetterIndex = lines.findIndex((line) =>
      line.includes("Cover Letter:")
    );

    let finalResume = "";
    let newEmployabilityScore = 0;
    let coverLetter = "";

    if (finalResumeIndex !== -1 && eScoreIndex !== -1) {
      finalResume = lines
        .slice(finalResumeIndex + 1, eScoreIndex)
        .join("\n")
        .trim();
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
      coverLetter = lines
        .slice(coverLetterIndex + 1)
        .join("\n")
        .trim();
    }

    // Log for debugging
    console.log({ finalResume, newEmployabilityScore, coverLetter });

    return {
      finalResume,
      newEmployabilityScore,
      coverLetter,
    };
  }

  const handleSaveToFirestore = async (
    title,
    finalResume,
    coverLetter,
    newEmployabilityScore
  ) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      try {
        const q = query(
          collection(db, "users", user.uid, "documents"),
          where("title", "==", title)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          // A document with the same title exists
          const existingDoc = querySnapshot.docs[0];
          await updateDoc(existingDoc.ref, {
            title,
            finalResume,
            coverLetter,
            newEmployabilityScore,
            createdAt: serverTimestamp(),
          });

          console.log("Document overwritten with ID: ", existingDoc.id);
          setoverwriteCount(overwriteCount + 1);
          window.scrollTo(0, 0);
        } else {
          // Save the new document (no existing document found)
          console.log(
            "newEmployabilityScore before addDoc:",
            newEmployabilityScore
          );
          if (newEmployabilityScore === undefined) {
            console.error("newEmployabilityScore is undefined, aborting save");
            return;
          }

          const docRef = await addDoc(
            collection(db, "users", user.uid, "documents"),
            {
              title,
              finalResume,
              coverLetter,
              newEmployabilityScore,
              createdAt: serverTimestamp(),
            }
          );
          console.log("New document written with ID: ", docRef.id);
          setSaveCount(saveCount + 1);
          window.scrollTo(0, 0);
        }
      } catch (error) {
        console.error("Error saving document: ", error);
      }
    } else {
      console.log("No user logged in");
    }
  };

  const handleDeleteDocument = async (documentId) => {
    console.log("Deleting document with ID:", documentId);
    const auth = getAuth();
    try {
      await deleteDoc(
        doc(db, "users", auth.currentUser.uid, "documents", documentId)
      );
      setIsModalOpen(false);
      setDeletionCount(deletionCount + 1);
    } catch (error) {
      console.error("Error deleting document: ", error);
      alert(`Error deleting document: ${error.message}`);
    }
  };

  const handleButtonClick = () => {
    setShowVoiceBot(true);
  };

  function handleVBLastButtonClick(filename) {
    AudioFile--;
    if (AudioFile < 0) {
      AudioFile = 0;
    }
    updateVoiceBotText(sentences[AudioFile]);
    var iframeWindow = document.getElementById("theBot").contentWindow;
    iframeWindow.postMessage(AudioFile, "https://voicebot.ispeakwell.ca/");
  }

  function handleVBNextButtonClick() {
    AudioFile++;
    if (AudioFile > 26) {
      AudioFile = 26;
    }
    updateVoiceBotText(sentences[AudioFile]);
    var iframeWindow = document.getElementById("theBot").contentWindow;
    iframeWindow.postMessage(AudioFile, "https://voicebot.ispeakwell.ca/");
  }

  function updateVoiceBotText(text) {
    const textElement = document.getElementById("voiceBotTextElement");
    if (textElement) {
      textElement.textContent = text;
    }
  }

  const resetDashboard = () => {
    setShowRevisionSection(false);
    setResumeKeywords([]);
    setJobDescriptionKeywords([]);
    setAtsScore(0);
    setIsAnalyzing(false);
    setAnalysisCompleted(false);
    setShowResults(false);
    setShowFinalResults(false);
    setMissingKeywords([]);
    setAssessment("");
    setEmployabilityScore(0);
    setBestPossibleJob("");
    setResumeText(
      "Steven Kurowski 10205 100 Avenue NW Edmonton, Alberta, T5J 4B5 587-785-8413 Work Experience: Job Coach Technology North, Edmonton, AB Nov 2018 – Jul 2023 Additional duties as required: Trainer, Process Development, Software Prototype Development, Project Coordinator, Software Tester, Marketing Materials Development, Performer in “Cliff20”, Operations, OHS Program Implementation, HR Duties, Commercialization Associate Developed a highly efficient team of skilled autistic business document digitizers completing caches of documents totaling 1,500+ archive boxes worth nearly $1M+ with no page loss. Ensured the first and last moments of contact with all autistic employees were positive, improving the likelihood of returning to work and persisting during tough work periods, maintaining 100% employee retention. Trained three job coaches to manage autistic document digitizers and handle work quality issues while minimizing team member breakdowns during challenging moments. Developed document digitization tasks and procedures to maximize productivity, quality, and ease of archive box movement between clients and the digitization centre. Managed client accounts and account change process management, providing client training to sustain the efficient movement of their documents through the evolving TN-client processes. Produced marketing materials and copy to attract clients to document digitization and autism employment, realizing $1M in document digitization revenue. Produced and performed in numerous corporate video materials marketing autism employment and digitization service (https://www.technologynorth.net/press) and a documentary, “Cliff 20: A Future on the Spectrum” (YouTube: Zi3Bd4bC_k4). Wrote and co-wrote numerous winning requests for proposal (RFP; >=$1M total) including a winning proposal for the Youth Employment Skills Strategy (YESS) grant, earning the principal applicant $8M to produce the Autism Can Tech! (ACT!) program at NorQuest College. Utilized Microsoft Excel VBA to create the working prototype of the TN RoboCoach platform called the Technology North Digital Services (TNDS) module, enabling autistic employees to perform and manage high quality document digitization productively and with superb quality. Initiated the implementation of the TN Occupational Health and Safety program, leading to the entire TN team developing awareness of their rights and duties to maintain a safe workspace, their own health and safety, and that of others at work. Daily scrum project coordinator managing the in-situ development of RoboCoach, TNDS module, and QA Testing module software through requirement generation and testing, assisting the transition of software prototypes from Microsoft Excel versions to functional web versions with the software development team. Trained an overseas company in the use of RoboCoach software, particularly the TNDS module, to perform document digitization, via Zoom. Set up physical server spaces and assisted the resolution of client server issues. Onboarded and trained a new client team in the use of TN’s ActiveCare software platform. Scheduled and managed numerous in-office corporate meetings, events, and interviews, leading to the effective development of TNDS and QA Testing modules, positive interviewing, efficient training, and impressed clients and visitors. Revised TN ActiveCare software documentation per each update period. General office management. Parking Patroller Impark, Edmonton, AB Feb 2017 – Nov 2018 Encouraged parkers to purchase monthly parking passes or daily parking tickets. Discouraged 24,000 scofflaw parkers from parking without paying through targeted ticketing, reducing scofflaw parking by more than 80% on downtown Edmonton lots in all weather at all temperatures without fail. Assisted parkers to understand how parking machines functioned and what the parking rules were to prevent unwanted scofflaw activity. Handled angry scofflaw issues with 95% success. Instructor (Online) Verbling (Online) Edmonton, AB Sep 2016 – Nov 2018 Met learners one-on-one in online language training sessions leveraging the power of multiple web technologies on and adjacent to the Verbling platform. Developed curricula and training materials that led 65 consistently returning web-based learners to attain significant IELTS, TOEFL, and TOEIC exam outcome improvements for college, employment, or immigration. Instructor, A’Sharqiyah University, Oman Sep 2012 – Sep 2016 Additional positions or duties as required: Department Coordinator (Advanced Learner Level, Exams and Testing, Scheduling), Quality Assurance Chair Developed engaging course materials to immerse Arabic-speaking learners of English to college-level preparedness for program entry: grammar, speaking, reading, writing, listening, and technical writing. Wrote, proctored, edited, and assessed 400 learners’ examinations across seven ESL courses as Examination Coordinator each semester. Advanced-level Coordinator for English department, managing the challenges teachers and learners face interacting with one another, the texts, the curriculum, and the intercultural exchanges, ensuring fair play, accountability, and credibility amongst colleagues and learners. Exam and Testing Coordinator: oversaw the creation of semester quiz and examination materials development, developing or participating in the development of 1,344 quizzes and examinations across 4 levels from task inception to final grade submission. Generated teaching schedules for 1,200 learners and 35 teachers for four semesters, developing a quiz and examination bank from which future exam developers can effectively and efficiently build new testing materials. Created a prototype Excel dashboard to capture learner grades from each teacher through their respective coordinator to maintain final grade sheet consistency and correctness saving the department and instructors days of vacation delay at the end of each semester. Developed a Quality Assurance module within the Grades dashboard to capture departmental KPIs for each course across numerous levels from beginner to advanced (pre-college) and college level courses, saving the department weeks per semester in preparation time. Quality Assurance Chair for the pre-college English department, establishing the department’s participation in and assisting the University’s handling and management of Quality Assurance for accreditation in Oman. Completed 3 internal mixed-methods (quantitative & qualitative etc.) research projects, increasing team knowledge retention by 500%, improving department health by identifying pain points and reducing burnout by 50% utilizing questionnaires and interviews as principal materials, and deploying semester project management in the General Foundation English program to increase learner results by 35% per semester, approximately one-half point on the IELTS exam. Increased the English fluency and general linguistic proficiency by 85% through direct language instruction and assessment of over 2,000 students at all levels from beginning through college. Developed multiple draft department budgets and reports, academic papers, memos, agendas, and other important documentation highlighting the remarkable challenges overcome and the improvements realized over four years. Provided IELTS and other English training services to community members. Instructor Various contracts: TELUS, Taleo, SPVQ, Quebec, QC Oct 2011 – Sep 2012 Developed and delivered engaging course materials to immerse adult French-speaking learners of English into work readiness to manage discourses and larger events in English. Coached 24 corporate executives to develop greater confidence in their capabilities to listen to, comprehend, and to speak English and to understand intuitively when their interlocutor has lost their meaning. 6 participants attained favorable job performance reviews based on English training reviews and later practice leading to promotion. Customer Service Lee Valley Tools, Vancouver, BC Nov 2010 – Apr 2011 Customer account and product assistant, establishing a warm atmosphere for successful product purchase. Signed up new customers for client accounts and assisted clients to understand how Lee Valley Tools ordering works, maintaining a 99% sales rate with new and returning clients. Received new stock and placed new stock into the proper bin location with zero error. Ensured the cleanliness and safety of the stock room. Maintained the general cleanliness and organization of the tool showroom. Instructor Korea Polytechnic University, Seoul, Korea Aug 2009 – Aug 2010 Developed and delivered engaging course materials to immerse adult Korean university students of English to work-level preparedness. Presented a popular standing-room-only cultural awareness seminar twice per year. Developed curricula for and taught a drama-based English summer course to focus on fluency techniques in real time outside of typical English course training. Provided learners with speaking workshops and “cafes” to enhance their English-speaking fluency. Instructor YBM, Seoul, Korea May 2009 – July 2009 Developed and delivered engaging course materials to immerse adult Korean-speaking learners of English to prepare for work-level English speaking opportunities. Materials Developer Topia Education, Seoul, Korea Apr 2008– Apr 2009 Wrote and published a master-level English writing textbook aimed at enhancing learners’ understanding of the structural and functional elements of writing at a high level. Edited vocabulary, grammar, and reading textbooks. Assisted in the development of institute curriculum. Created multiple choice question-answer sets to match Discovery Channel English video series. Instructor Chungdahm English Academy, Seoul, Korea Aug 2007 – Mar 2008 Developed and delivered engaging course materials to immerse young Korean-speaking learners of English to be prepared for high school entrance exams. Television Instructor Education Broadcasting System Sep 2007 – Apr 2008 Performed as the “Director” of the “English Factory”, a fictitious business where English fluency is the product, and the viewers are the receivers of the “Factory” products. Edited scripts and proposed changes to handle linguistic and intercultural discrepancies with clarity and dignity. Instructor Pagoda Foreign Language Academy, Seoul, Korea Jul 2005 – Jul 2007 Developed and delivered engaging course materials to immerse adult Korean-speaking learners of English to prepare for work-level English speaking, reading, and writing opportunities. Created a popular weekend class focusing on using drama techniques to increase learners’ confidence to speak English by 200%. Improved the Advanced-level Pagoda courses by creating an Advanced textbook filled with learner-centric activities at L1-English level to provide greater challenge to learners, expanding Advanced learner retainment by 800% with the addition of 8 more Advanced-level classes. Maintained a 95% satisfaction rate with learners. Barista Starbucks, Abbotsford, BC Oct 2004 – Jul 2005 Delivered exceptional products to clients in a high-paced location with unparalleled rapidity and with 99% accuracy. Learned the full Starbucks Coffee menu in terms of both the drink recipe menu and the coffee type, grind, and origin offerings. Provided exceptional service to customers with 100% satisfaction. Ensured a clean lobby and restrooms for optimal customer comfort. Tutor University of the Fraser Valley, Abbotsford, BC Sep 2004 – Apr 2005 Assisted novice learners to adapt to challenging remedial and college course requirements. Provided learners with understanding of how to operate PCs and navigate the world wide web. Edited learner writing assignments and helped 55 students improve their grades on written work by more than 20% through simple writing techniques. Landscaper Para Space Landscaping, Vancouver, BC Jun 2001 – Sep 2004 Managed the lawn care of multiple large multi-unit strata locations around the Greater Vancouver Regional District. Trained new landscapers to handle the workload efficiently to keep pace with weekly maintenance schedules. Scheduled and handled the removal of refuse plant materials from client sites to GVRD dumping locations. Ensured motorized tools were consistently in excellent condition and ready to run immediately upon arrival. Consistently completed landscaping tasks with time to spare for additional tasks. Maintained lawn mowing efficiency 40% higher than average crew members. Education: ComIT React Front End Web Development, Remote, 2023, Apply principles of HTML, CSS, and JavaScript to create React components and websites focusing on authentication, backend data management.  University of Exeter, UK Master of Education 2016 University of Birmingham, UK Master of Applied Linguistics 2011 University of the Fraser Valley, BC Bachelor of English Literature 2005 University of the Fraser Valley, BC Associate of Arts, Theatre 2000 Sardis Senior Secondary School, BC Certificate of Graduation 1993 Skills: Scheduling, Instruction and testing, Requests for Proposal writing, Microsoft Excel, Word, PowerPoint A/V capture and editing, Research and development, Training curricula development, Document handling and digitization, Programming Languages: VBA, JavaScript, HTML5, CSS3, Python, Java, C++, React framework Volunteer Experience: Project Adult Literacy Society Instructor for English Language Learners Oct 2022 – Apr 2023 Wheels Across Canada Cycle Tour Fundraiser for Cancer Research Apr 2011 – Oct 2011"
    );
    setJobDescriptionText("");
    setIsRevising(false);
    setRevisionCompleted(false);
    setFinalResume("");
    setCoverLetter("");
    setNewEmployabilityScore(0);
    setSelectedDocumentId(null);
    setDeletionCount(0);
    setDocuments([]);
    setoverwriteCount(0);
    setSaveCount(0);
    setShowVoiceBot(false);
    setReplacementJobDescription("");
    setSaveCount(saveCount + 1);
    setShowPreviousWork(false);
    setIsTest(false);
    AudioFile = 0;
    voiceBotText = "";
    window.scrollTo(0, 0);
  };

  const InterViewPractice = () => {
    // Navigate to the InterviewPractice page
    navigate("/interview-practice");
  };

  const showResumes = () => {
    setShowPreviousWork(true);
  };

  const hideResumes = () => {
    setShowPreviousWork(false);
  };

  const admin = () => {
    navigate("/admin");
  };

  const Logout = async () => {
    await logout();
    navigate("/login");
  };

  const testResponses = () => {
    setIsTest(true);
    setShowRevisionSection(true);
    setResumeKeywords([
      "Job Coach",
      "Trainer",
      "Process Development",
      "Software Prototype Development",
      "Project Coordinator",
      "Software Tester",
      "Marketing Materials Development",
      "Operations",
      "OHS Program Implementation",
      "HR Duties",
      "Commercialization Associate",
      "Document Digitization",
      "Client Account Management",
      "RFP Writing",
      "Microsoft Excel VBA",
      "Scrum Project Coordinator",
      "Software Development",
      "Zoom Training",
      "Server Setup",
      "ActiveCare Software",
      "Office Management",
      "Parking Patroller",
      "Online Instructor",
      "Curriculum Development",
      "ESL Teaching",
      "Department Coordinator",
      "Quality Assurance",
      "Research Projects",
      "Corporate Training",
      "Customer Service",
      "Landscaping",
      "Education in React, HTML, CSS, JavaScript",
      "Programming Languages (VBA, JavaScript, HTML5, CSS3, Python, Java, C++, React framework)",
      "Volunteer Experience",
    ]);
    setJobDescriptionKeywords([
      "Front-End Development",
      "React",
      "JavaScript",
      "HTML",
      "CSS",
      "Storybook",
      "Cypress",
      "Git",
      "Upper-Intermediate English",
      "Fast Learning",
      "Attention to Detail",
      "Enthusiastic Attitude",
      "Next.js",
      "Bachelor's or Master's degree (Computer Science, IT, Software Engineering)",
      "Cross-functional collaboration",
      "Styled Components",
      "TypeScript",
      "Code Reviews",
      "Node.js",
      "Strapi",
      "Cloudflare Workers",
      "Cloudflare Durable Objects",
      "Vercel",
      "Cloudflare Pages",
      "Serverless functions",
      "CI/CD",
      "RestAPI",
      "GraphQL",
      "Remote Work",
      "Competitive Compensation",
      "Training and Development",
    ]);
    setAtsScore(70);
    setIsAnalyzing(false);
    setAnalysisCompleted(true);
    setShowResults(true);
    setShowFinalResults(true);
    setMissingKeywords([
      "Styled Components",
      "TypeScript",
      "Node.js",
      "Strapi",
      "Cloudflare Workers",
      "Cloudflare Durable Objects",
      "Serverless functions",
      "CI/CD",
      "RestAPI",
      "GraphQL",
    ]);
    setAssessment(
      "Steven Kurowski's resume demonstrates a strong background in various aspects of technology and education, with a focus on software development, project coordination, and training. His experience with React, JavaScript, HTML, and CSS aligns well with the job description's requirements for a Front-End Developer. Additionally, his experience with software testing, client management, and RFP writing could be beneficial for understanding project requirements and contributing to the development process.  However, there are several missing keywords related to specific technologies and methodologies mentioned in the job description that are not present in the resume, such as Next.js, TypeScript, Node.js, Strapi, Cloudflare Workers, Cloudflare Durable Objects, serverless functions, CI/CD, Github Actions, RestAPI, and GraphQL. This indicates a potential gap in Steven's experience with these particular skills and tools."
    );
    setEmployabilityScore(65);
    setBestPossibleJob(
      "Based on Steven's extensive experience with software development, project coordination, and training, a role such as a Front-End Developer or Software Trainer at a company that values educational background and diverse experience in technology would be suitable. Additionally, a position that allows him to leverage his skills in React and JavaScript while providing opportunities to learn and work with Next.js, TypeScript, and other modern web technologies would be ideal. A role in a company that offers training and development opportunities would also be beneficial for bridging any gaps in his skill set."
    );
    setResumeText(
      "Steven Kurowski 10205 100 Avenue NW Edmonton, Alberta, T5J 4B5 587-785-8413\nWork Experience\nJob Coach Technology North, Edmonton, AB Nov 2018 – Jul 2023 Additional duties as required: Trainer, Process Development, Software Prototype Development, Project Coordinator, Software Tester, Marketing Materials Development, Performer in “Cliff20”, Operations, OHS Program Implementation, HR Duties, Commercialization Associate Developed a highly efficient team of skilled autistic business document digitizers completing caches of documents totaling 1,500+ archive boxes worth nearly $1M+ with no page loss. Ensured the first and last moments of contact with all autistic employees were positive, improving the likelihood of returning to work and persisting during tough work periods, maintaining 100% employee retention. Trained three job coaches to manage autistic document digitizers and handle work quality issues while minimizing team member breakdowns during challenging moments. Developed document digitization tasks and procedures to maximize productivity, quality, and ease of archive box movement between clients and the digitization centre. Managed client accounts and account change process management, providing client training to sustain the efficient movement of their documents through the evolving TN-client processes. Produced marketing materials and copy to attract clients to document digitization and autism employment, realizing $1M in document digitization revenue. Produced and performed in numerous corporate video materials marketing autism employment and digitization service (https://www.technologynorth.net/press) and a documentary, “Cliff 20: A Future on the Spectrum” (YouTube: Zi3Bd4bC_k4). Wrote and co-wrote numerous winning requests for proposal (RFP; >=$1M total) including a winning proposal for the Youth Employment Skills Strategy (YESS) grant, earning the principal applicant $8M to produce the Autism Can Tech! (ACT!) program at NorQuest College. Utilized Microsoft Excel VBA to create the working prototype of the TN RoboCoach platform called the Technology North Digital Services (TNDS) module, enabling autistic employees to perform and manage high quality document digitization productively and with superb quality. Initiated the implementation of the TN Occupational Health and Safety program, leading to the entire TN team developing awareness of their rights and duties to maintain a safe workspace, their own health and safety, and that of others at work. Daily scrum project coordinator managing the in-situ development of RoboCoach, TNDS module, and QA Testing module software through requirement generation and testing, assisting the transition of software prototypes from Microsoft Excel versions to functional web versions with the software development team. Trained an overseas company in the use of RoboCoach software, particularly the TNDS module, to perform document digitization, via Zoom. Set up physical server spaces and assisted the resolution of client server issues. Onboarded and trained a new client team in the use of TN’s ActiveCare software platform. Scheduled and managed numerous in-office corporate meetings, events, and interviews, leading to the effective development of TNDS and QA Testing modules, positive interviewing, efficient training, and impressed clients and visitors. Revised TN ActiveCare software documentation per each update period. General office management. \nParking Patroller Impark, Edmonton, AB Feb 2017 – Nov 2018 Encouraged parkers to purchase monthly parking passes or daily parking tickets. Discouraged 24,000 scofflaw parkers from parking without paying through targeted ticketing, reducing scofflaw parking by more than 80% on downtown Edmonton lots in all weather at all temperatures without fail. Assisted parkers to understand how parking machines functioned and what the parking rules were to prevent unwanted scofflaw activity. Handled angry scofflaw issues with 95% success. \nInstructor (Online) Verbling (Online) Edmonton, AB Sep 2016 – Nov 2018 Met learners one-on-one in online language training sessions leveraging the power of multiple web technologies on and adjacent to the Verbling platform. Developed curricula and training materials that led 65 consistently returning web-based learners to attain significant IELTS, TOEFL, and TOEIC exam outcome improvements for college, employment, or immigration. \nInstructor, A’Sharqiyah University, Oman Sep 2012 – Sep 2016 Additional positions or duties as required: Department Coordinator (Advanced Learner Level, Exams and Testing, Scheduling), Quality Assurance Chair Developed engaging course materials to immerse Arabic-speaking learners of English to college-level preparedness for program entry: grammar, speaking, reading, writing, listening, and technical writing. Wrote, proctored, edited, and assessed 400 learners’ examinations across seven ESL courses as Examination Coordinator each semester. Advanced-level Coordinator for English department, managing the challenges teachers and learners face interacting with one another, the texts, the curriculum, and the intercultural exchanges, ensuring fair play, accountability, and credibility amongst colleagues and learners. Exam and Testing Coordinator: oversaw the creation of semester quiz and examination materials development, developing or participating in the development of 1,344 quizzes and examinations across 4 levels from task inception to final grade submission. Generated teaching schedules for 1,200 learners and 35 teachers for four semesters, developing a quiz and examination bank from which future exam developers can effectively and efficiently build new testing materials. Created a prototype Excel dashboard to capture learner grades from each teacher through their respective coordinator to maintain final grade sheet consistency and correctness saving the department and instructors days of vacation delay at the end of each semester. Developed a Quality Assurance module within the Grades dashboard to capture departmental KPIs for each course across numerous levels from beginner to advanced (pre-college) and college level courses, saving the department weeks per semester in preparation time. Quality Assurance Chair for the pre-college English department, establishing the department’s participation in and assisting the University’s handling and management of Quality Assurance for accreditation in Oman. Completed 3 internal mixed-methods (quantitative & qualitative etc.) research projects, increasing team knowledge retention by 500%, improving department health by identifying pain points and reducing burnout by 50% utilizing questionnaires and interviews as principal materials, and deploying semester project management in the General Foundation English program to increase learner results by 35% per semester, approximately one-half point on the IELTS exam. Increased the English fluency and general linguistic proficiency by 85% through direct language instruction and assessment of over 2,000 students at all levels from beginning through college. Developed multiple draft department budgets and reports, academic papers, memos, agendas, and other important documentation highlighting the remarkable challenges overcome and the improvements realized over four years. Provided IELTS and other English training services to community members. \nInstructor Various contracts: TELUS, Taleo, SPVQ, Quebec, QC Oct 2011 – Sep 2012 Developed and delivered engaging course materials to immerse adult French-speaking learners of English into work readiness to manage discourses and larger events in English. Coached 24 corporate executives to develop greater confidence in their capabilities to listen to, comprehend, and to speak English and to understand intuitively when their interlocutor has lost their meaning. 6 participants attained favorable job performance reviews based on English training reviews and later practice leading to promotion. \nCustomer Service Lee Valley Tools, Vancouver, BC Nov 2010 – Apr 2011 Customer account and product assistant, establishing a warm atmosphere for successful product purchase. Signed up new customers for client accounts and assisted clients to understand how Lee Valley Tools ordering works, maintaining a 99% sales rate with new and returning clients. Received new stock and placed new stock into the proper bin location with zero error. Ensured the cleanliness and safety of the stock room. Maintained the general cleanliness and organization of the tool showroom. \nInstructor Korea Polytechnic University, Seoul, Korea Aug 2009 – Aug 2010 Developed and delivered engaging course materials to immerse adult Korean university students of English to work-level preparedness. Presented a popular standing-room-only cultural awareness seminar twice per year. Developed curricula for and taught a drama-based English summer course to focus on fluency techniques in real time outside of typical English course training. Provided learners with speaking workshops and “cafes” to enhance their English-speaking fluency. \nInstructor YBM, Seoul, Korea May 2009 – July 2009 Developed and delivered engaging course materials to immerse adult Korean-speaking learners of English to prepare for work-level English speaking opportunities. \nMaterials Developer Topia Education, Seoul, Korea Apr 2008– Apr 2009 Wrote and published a master-level English writing textbook aimed at enhancing learners’ understanding of the structural and functional elements of writing at a high level. Edited vocabulary, grammar, and reading textbooks. Assisted in the development of institute curriculum. Created multiple choice question-answer sets to match Discovery Channel English video series. \nInstructor Chungdahm English Academy, Seoul, Korea Aug 2007 – Mar 2008 Developed and delivered engaging course materials to immerse young Korean-speaking learners of English to be prepared for high school entrance exams. \nTelevision Instructor Education Broadcasting System Sep 2007 – Apr 2008 Performed as the “Director” of the “English Factory”, a fictitious business where English fluency is the product, and the viewers are the receivers of the “Factory” products. Edited scripts and proposed changes to handle linguistic and intercultural discrepancies with clarity and dignity. \nInstructor Pagoda Foreign Language Academy, Seoul, Korea Jul 2005 – Jul 2007 Developed and delivered engaging course materials to immerse adult Korean-speaking learners of English to prepare for work-level English speaking, reading, and writing opportunities. Created a popular weekend class focusing on using drama techniques to increase learners’ confidence to speak English by 200%. Improved the Advanced-level Pagoda courses by creating an Advanced textbook filled with learner-centric activities at L1-English level to provide greater challenge to learners, expanding Advanced learner retainment by 800% with the addition of 8 more Advanced-level classes. Maintained a 95% satisfaction rate with learners. \nBarista Starbucks, Abbotsford, BC Oct 2004 – Jul 2005 Delivered exceptional products to clients in a high-paced location with unparalleled rapidity and with 99% accuracy. Learned the full Starbucks Coffee menu in terms of both the drink recipe menu and the coffee type, grind, and origin offerings. Provided exceptional service to customers with 100% satisfaction. Ensured a clean lobby and restrooms for optimal customer comfort. \nTutor University of the Fraser Valley, Abbotsford, BC Sep 2004 – Apr 2005 Assisted novice learners to adapt to challenging remedial and college course requirements. Provided learners with understanding of how to operate PCs and navigate the world wide web. Edited learner writing assignments and helped 55 students improve their grades on written work by more than 20% through simple writing techniques. \nLandscaper Para Space Landscaping, Vancouver, BC Jun 2001 – Sep 2004 Managed the lawn care of multiple large multi-unit strata locations around the Greater Vancouver Regional District. Trained new landscapers to handle the workload efficiently to keep pace with weekly maintenance schedules. Scheduled and handled the removal of refuse plant materials from client sites to GVRD dumping locations. Ensured motorized tools were consistently in excellent condition and ready to run immediately upon arrival. Consistently completed landscaping tasks with time to spare for additional tasks. Maintained lawn mowing efficiency 40% higher than average crew members. \nEducation: \nComIT React Winnipeg, Remote, 2023, Apply principles of HTML, CSS, and JavaScript to create React components and websites focusing on authentication, backend data management.  \nUniversity of Exeter, UK Master of Education 2016 \nUniversity of Birmingham, UK Master of Applied Linguistics 2011 \nUniversity of the Fraser Valley, BC Bachelor of English Literature 2005 \nUniversity of the Fraser Valley, BC Associate of Arts, Theatre 2000 \nSardis Senior Secondary School, BC Certificate of Graduation 1993 \nSkills: \nScheduling, Instruction and testing, Requests for Proposal writing, Microsoft Excel, Word, PowerPoint A/V capture and editing, Research and development, Training curricula development, Document handling and digitization, Programming Languages: VBA, JavaScript, HTML5, CSS3, Python, Java, C++, React framework\nVolunteer Experience: Project Adult Literacy Society Instructor for English Language Learners Oct 2022 – Apr 2023 \nWheels Across Canada Cycle Tour Fundraiser for Cancer Research Apr 2011 – Oct 2011\n"
    );
    setJobDescriptionText(
      "Kick-start your front-end career by steering the future of a project resonating strongly within the industry, spearheading advancements in Vercel/Cloudflare edge-hosted frontends. Kapsys is where innovation happens\n\nJoin our fully remote powerhouse that delivers top-notch software solutions and is at the helm of a global project shifting paradigms in technology landscapes\n\nOur continuous devotion to developing internal knowledge and fostering collaborative processes empowers us to solve problems others can't.\n\nExcited to be part of the Kapsys journey? Keep reading!\n\nWhat you'll bring\n• Min 6 months of commercial experience in Front-End Development\n• Proven experience with React, JavaScript, HTML, and CSS\n• Experience creating testable components in Storybook\n• Familiarity with writing tests in Cypress\n• Understanding of version control systems, such as Git\n• Upper-Intermediate English proficiency\n• Fast learning skills and proactivity\n• Strong attention to detail\n• An enthusiastic person with a “can do, will do” attitude\n\nWill be a plus:\n• Familiarity with Next.js\n• Bachelor's or Master's degree in Computer Science, Information Technology, Software Engineering, or a related field\n\nWhat will you do:\n• Collaborate with cross-functional teams to understand project requirements.\n• Contribute to the development of front-end solutions using React, Next.js, and styled components.\n• Create testable components in Storybook and write tests using Cypress to ensure the robustness of our solutions.\n• Write efficient TypeScript code that adheres to best practices and utilizes the complete set of language features.\n• Troubleshoot issues and solve problems when necessary.\n• Participate in code reviews and receive constructive feedback from experienced developers.\n\nYour project technologies will include:\n• Front-end: React, Next.js, Dynamic & SSG\n• Backend: Node.js, Strapi, Cloudflare Workers, Cloudflare Durable Objects\n• Cloud provider: Vercel, Cloudflare Pages, Serverless functions\n• CI/CD: Vercel, Cloudflare Pages, Github Actions\n• Version Control: Git\n• Architecture: RestAPI, GraphQL\n\nWe offer more than just a job:\n• Full remote work with the flexibility to work from anywhere\n• Competitive compensation based on your experience and skills\n• Opportunity to work in an innovative field with modern tools\n• Sharing knowledge from more experienced specialists\n• Flexible work schedule for a healthy work-life balance\n• 19 Paid Time Off days\n• An open management style with minimal bureaucracy and a flat hierarchy\n• Training and development opportunities, including support for certifications\n\nInterview stages - step by step:\n• 1st stage - HR Interview\n• 2nd stage - Technical Task\n• 3rd stage - Technical Interview\n\nWant to kick-start your front-end career with us? Then join our ride and apply now\n"
    );
    setIsRevising(false);
    setRevisionCompleted(true);
    setFinalResume(
      "Steven Kurowski\n10205 100 Avenue NW, Edmonton, Alberta, T5J 4B5\n587-785-8413\n\nObjective:\nDynamic Front-End Developer with a passion for creating innovative web solutions using React, JavaScript, HTML, and CSS. Eager to contribute to Kapsys' global projects with a strong foundation in front-end development, testable components, and a proactive approach to learning new technologies.\n\nWork Experience:\n\nJob Coach Technology North, Edmonton, AB\nNov 2018 – Jul 2023\n- Spearheaded the development of a team of skilled autistic business document digitizers, achieving a project worth nearly $1M+ with no page loss.\n- Implemented positive employee engagement strategies, resulting in 100% retention.\n- Authored winning RFPs, securing $8M for the Autism Can Tech! program.\n- Developed the TN RoboCoach platform using Microsoft Excel VBA, enhancing productivity and quality in document digitization.\n- Coordinated daily scrum meetings, facilitating the transition of software prototypes to functional web versions.\n\nParking Patroller, Impark, Edmonton, AB\nFeb 2017 – Nov 2018\n- Reduced scofflaw parking by over 80% through effective enforcement and customer education.\n\nInstructor (Online), Verbling (Online), Edmonton, AB\nSep 2016 – Nov 2018\n- Led 65 web-based learners to achieve significant improvements in English proficiency exams.\n\nInstructor, A’Sharqiyah University, Oman\nSep 2012 – Sep 2016\n- Developed a prototype Excel dashboard for grade management, significantly reducing administrative time.\n- Established Quality Assurance processes, contributing to the University's accreditation efforts.\n\nEducation:\n\nComIT React, Remote, 2023\n- Applied principles of HTML, CSS, JavaScript, and React to create components and websites.\n\nUniversity of Exeter, UK\nMaster of Education, 2016\n\nUniversity of Birmingham, UK\nMaster of Applied Linguistics, 2011\n\nUniversity of the Fraser Valley, BC\nBachelor of English Literature, 2005\n\nSkills:\n\n- Front-End Development: React, JavaScript, HTML, CSS\n- Testable Components: Storybook, Cypress\n- Version Control: Git\n- Programming Languages: VBA, JavaScript, HTML5, CSS3, Python, Java, C++, React framework\n- Serverless Functions: Developed a serverless function for project 'Advanced Resume'\n- CI/CD: Understanding of CI/CD principles from React training and practical experience at Technology North\n\nVolunteer Experience:\n\nProject Adult Literacy Society Instructor for English Language Learners\nOct 2022 – Apr 2023\n\nWheels Across Canada Cycle Tour Fundraiser for Cancer Research\nApr 2011 – Oct 2011\n"
    );
    setCoverLetter(
      "Dear Hiring Manager at Kapsys,\n\nI am writing to express my enthusiasm for the Front-End Developer position at Kapsys, a company renowned for its innovative approach to software solutions and its pivotal role in shaping the technology landscape. With over six months of commercial experience in front-end development and a proven track record with React, JavaScript, HTML, and CSS, I am excited about the opportunity to contribute to your dynamic team.\n\nMy recent completion of the ComIT React program has equipped me with the skills to create React components and websites, focusing on authentication and backend data management. During my tenure at Technology North, I developed a keen understanding of testable components, utilizing Storybook, and I am familiar with writing tests in Cypress, ensuring the robustness of our solutions. My proactive nature and fast learning skills are complemented by a strong attention to detail, which I believe align perfectly with Kapsys' commitment to excellence.\n\nI am particularly drawn to the collaborative environment at Kapsys, where sharing knowledge and fostering a team-oriented approach are integral to solving complex problems. My experience as a Job Coach at Technology North involved coordinating with cross-functional teams, managing client accounts, and contributing to software development, which has honed my ability to collaborate effectively and adapt to fast-paced work environments.\n\nWhile I have a solid foundation in front-end technologies, I am eager to expand my expertise with Next.js and TypeScript. My familiarity with Node.js and serverless functions, as demonstrated in my project 'Advanced Resume', along with my eagerness to learn about Strapi and Cloudflare Workers, positions me as a candidate who is not only equipped with the necessary skills but also possesses the drive to continuously evolve and embrace new challenges.\n\nI am excited about the prospect of joining Kapsys and am confident that my unique blend of skills, experience, and passion for front-end development will make a significant impact on your projects. I look forward to the opportunity to discuss how I can contribute to the success of your team.\n\nThank you for considering my application. I am ready to bring my 'can do, will do' attitude to Kapsys and am enthusiastic about the potential to grow and innovate together.\n\nWarm regards,\n\nSteven Kurowski\n"
    );
    setNewEmployabilityScore(85);
    setSelectedDocumentId(null);
    setDeletionCount(0);
    setDocuments([]);
    setoverwriteCount(0);
    setSaveCount(0);
    setShowVoiceBot(true);
    setReplacementJobDescription("");
  };

  return (
    <div className="dashboard">
      <div className="background-container">
        <HexagonBackground />
      </div>
      <header>
        <h1 className="Main-Header">iSpeakWell Resume Revisor</h1>
        <h2 className="Main-Header">
          Improve your Resume and Get a Cover Letter with AI
        </h2>
      </header>
      <h3 className="Main-Header">Saved Resumes</h3>
      {showPreviousWork ? (
        <div className="previous-work-section">
          <PreviousWorkSection
            documents={documents}
            setDocuments={setDocuments}
            onDocumentClick={handleDivClick}
            onDeleteDocument={handleDeleteDocument}
          />
          <div className="HideButton">
            {documents.length === 0 ? (
              <button onClick={hideResumes}>Hide</button>
            ) : (
              <div className="HideButton">
                <h4 className="instruct1">Click a document to view</h4>
                <button onClick={hideResumes}>Hide</button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <button onClick={showResumes}>Show</button>
      )}

      <div className="jobOps">
        <h3 className="Main-Header">Search Job Opportunities</h3>
        <JobSearch
          onUpdateReplacementJobDescription={updateReplacementJobDescription}
        />
      </div>
      <div className="analysis-section">
        {!isAnalyzing &&
          !showResults &&
          (showVoiceBot ? (
            <div className="VoiceBot-container">
              <VoiceBotIframe />
              <div className="VBButtons">
                <button onClick={handleVBLastButtonClick}>Last</button>
                <button onClick={handleVBNextButtonClick}>Next</button>
              </div>
            </div>
          ) : (
            <button onClick={handleButtonClick}>Activate Resume Coach</button>
          ))}
        <div className="VoiceBotSays">
          {!isAnalyzing && !showResults && showVoiceBot && (
            <h5 id="voiceBotTextElement" className="VoiceBotTextDB">
              {voiceBotText}
            </h5>
          )}
        </div>
      </div>
      <div className="analysis-section">
        <AnalysisSection
          onSubmit={handleAnalysis}
          isAnalyzing={isAnalyzing}
          analysisCompleted={analysisCompleted}
          resumeText={resumeText}
          setResumeText={setResumeText}
          jobDescriptionText={jobDescriptionText + ReplacementJobDescription}
          setJobDescriptionText={setJobDescriptionText}
        />
      </div>

      {isAnalyzing && (
        <div style={{ textAlign: "center" }}>
          <Spinner />
        </div>
      )}

      {!isAnalyzing && showResults && (
        <ResultsSection
          resumeKeywords={resumeKeywords}
          jobDescriptionKeywords={jobDescriptionKeywords}
          atsScore={atsScore}
        />
      )}

      {!isAnalyzing &&
        (showResults || showRevisionSection) &&
        !showFinalResults &&
        (showVoiceBot ? (
          <div className="VoiceBot-container">
            <VoiceBotIframe />
            <div className="VBButtons">
              <button onClick={handleVBLastButtonClick}>Last</button>
              <button onClick={handleVBNextButtonClick}>Next</button>
            </div>
          </div>
        ) : (
          <button onClick={handleButtonClick}>Activate Resume Coach</button>
        ))}
      <div className="VoiceBotSays">
        {!isAnalyzing &&
          (showResults || showRevisionSection) &&
          !showFinalResults &&
          showVoiceBot && (
            <h5 id="voiceBotTextElement" className="VoiceBotTextDB">
              {voiceBotText}
            </h5>
          )}
      </div>
      {!isAnalyzing && (showResults || showRevisionSection) && (
        <div className="analysis-section">
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
            testing={isTest}
          />
        </div>
      )}
      <div className="VoiceBotSays">
        {!isAnalyzing &&
          showFinalResults &&
          (showVoiceBot ? (
            <div className="VoiceBot-container">
              <VoiceBotIframe />
              <div className="VBButtons">
                <button onClick={handleVBLastButtonClick}>Last</button>
                <button onClick={handleVBNextButtonClick}>Next</button>
              </div>
            </div>
          ) : (
            <button onClick={handleButtonClick}>Activate Resume Coach</button>
          ))}
        <div className="VoiceBotSays">
          {!isAnalyzing && showFinalResults && showVoiceBot && (
            <h5 id="voiceBotTextElement" className="VoiceBotTextDB">
              {voiceBotText}
            </h5>
          )}
        </div>
      </div>
      {!isAnalyzing && showFinalResults && (
        <div className="finalResults-section">
          <FinalResultsSection
            finalResume={finalResume}
            coverLetter={coverLetter}
            newEmployabilityScore={newEmployabilityScore}
            onSave={handleSaveToFirestore}
          />
        </div>
      )}

      <nav className="logout-nav">
        {/* Hamburger Menu Icon */}
        <IconButton className="menu-icon" onClick={toggleDrawer(true)}>
          <MenuIcon
            style={{
              boxShadow: "0 0 50px #000000, 0 0 20px #ffffff",
              // Add additional styles if needed
            }}
          />
        </IconButton>

        {/* Drawer for Mobile View */}
        <Drawer
          anchor="left"
          open={isOpen}
          onClose={toggleDrawer(false)}
          className="custom-drawer"
        >
          {list()}
        </Drawer>
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
