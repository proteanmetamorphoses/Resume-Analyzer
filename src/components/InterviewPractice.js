import LogoutLink from "./LogoutLink";
import VoiceBotIframe from "./VoiceBotiFrame";
import HexagonBackground from "./HexagonBackground";
import "./InterviewPractice.css";
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';

  
const InterviewPractice = () => {
  const navigate = useNavigate();
  let AudioFile = -1;
  let voiceBotText = "";
  let sentences = [];
  const parseCSV = () => {
    return new Promise((resolve, reject) => {
      Papa.parse("/data/AudioFiles.csv", {
        download: true,
        header: false,
        complete: (results) => {
          const arrayOfSentences = results.data.map(row => row[0]).filter(sentence => sentence.trim() !== '');
          resolve(arrayOfSentences);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  };
  
  async function init() {
    try {
      sentences = await parseCSV();
      // At this point, sentences is populated
      console.log(sentences);
    } catch (error) {
      console.error("Error parsing CSV: ", error);
    }
  }

  init();
  console.log(sentences);
  
  function createNumericalSequence() {
    // This function generates a random number between min and max (inclusive)
    const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  
    // Initialize the array with the fixed part of the sequence
    const sequence = [
      27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 45,
      // Random number between 46 and 55
      getRandomNumber(46, 55),
      41, 56,
      // Random number between 57 and 66
      getRandomNumber(57, 66),
      42, 67,
      // Random number between 68 and 76
      getRandomNumber(68, 76),
      43, 77,
      // Random number between 78 and 87
      getRandomNumber(78, 87),
      44, 88,
      // Random number between 89 and 99
      getRandomNumber(89, 99),
      100, 101
    ];
  
    return sequence;
  }
  
  // Usage
  const mySequence = createNumericalSequence();


  function handleVBLastButtonClick(filename) {
    console.log(AudioFile + 1);
    AudioFile--;
    if(AudioFile < 0){
      AudioFile = 0;
    }
    updateVoiceBotText(sentences[mySequence[AudioFile]]);
    var iframeWindow = document.getElementById('theBot').contentWindow;
    iframeWindow.postMessage(mySequence[AudioFile], 'https://www.ispeakwell.ca/');
  }
  
  function handleVBNextButtonClick() {
    console.log(AudioFile + 1);
    AudioFile++;
    if(AudioFile > 30){
      AudioFile = 30;
    }
    updateVoiceBotText(sentences[mySequence[AudioFile]]);
    var iframeWindow = document.getElementById('theBot').contentWindow;
    iframeWindow.postMessage(mySequence[AudioFile], 'https://www.ispeakwell.ca/');
  }

  function updateVoiceBotText(text) {
    const textElement = document.getElementById('voiceBotTextElement');
    if (textElement) {
      textElement.textContent = text;
      console.log("VoiceBot says: ", text);
    }
  }



  const resetInterview = () => {
    AudioFile = 0;
  };
  const Dashboard = () => {
    // Navigate to the InterviewPractice page
    navigate('/Dashboard');
  };

    return <div className = "InterviewPractice">
      <div className="background-container">
        <HexagonBackground />
      </div>
      <h1 className="Main-Header">Advanced Resume</h1>
      <h2 className="Main-Header">
        Interview Practice
      </h2>
      <h3 className="instruct1">Click the Interviewer to start.</h3>
      <h4 className="instruct1">Double-click to hear each statement.</h4>
      <h3 className="instruct1">Click the buttons to navigate the interview dialogue.</h3>
      <h4 className="instruct1">Connect your microphone for speech practice.</h4>
      <div className="VoiceBot-container">
        <VoiceBotIframe />
        <div className="VBButtons">
          <button onClick={handleVBLastButtonClick}>Last</button>
          <button onClick={handleVBNextButtonClick}>Next</button>
        </div>
      </div>
      <div>
        <h2 id="voiceBotTextElement" className="VoiceBotText">{voiceBotText}</h2>
      </div>
      <nav className="logout-nav">
        <button onClick={Dashboard}>Dashboard</button>
        <button className="resetter" onClick={resetInterview}>Reset</button>
        <LogoutLink />
      </nav>

      </div>;
      };
  
  export default InterviewPractice;
  