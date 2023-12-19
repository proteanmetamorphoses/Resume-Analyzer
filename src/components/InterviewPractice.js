import React, { useRef, useContext, useEffect, useState, useMemo } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { logout } from "../utils/firebase";
import VoiceBotIframe from "./VoiceBotiFrame";
import HexagonBackground from "./HexagonBackground";
import "./InterviewPractice.css";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";
import { VoiceBotStateContext } from "./VoiceBotStateContext";
import Spinner from "./Spinner";
import { getAuth } from "firebase/auth";
import { db } from "../utils/firebase";
import { collection, addDoc } from "firebase/firestore";
import InterviewTips from "./InterviewTips";

const InterviewPractice = () => {
  const { voiceBotState, setVoiceBotState } = useContext(VoiceBotStateContext);
  const userSpeechRef = useRef(null);
  const recognition = useMemo(() => {
    const speechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    return new speechRecognition();
  }, []);
  const navigate = useNavigate();
  const isListeningRef = useRef(false);
  const voiceBotTextRef = useRef("");
  const initialQAPairs = [
    {
      question: null,
      answers: [],
      timeTaken: null,
      submissionCount: 0,
      typedChars: null,
      spokenChars: null,
      charRatio: null,
    },
  ];
  const [qaPairs, setQAPairs] = useState(initialQAPairs);
  const [sequence, setSequence] = useState([]);
  const [questionsCount, setQuestionsCount] = useState(0); // State to track the number of questions
  const [showSubmitButton, setShowSubmitButton] = useState(false); // State to track the visibility of the Submit button
  const [openAIResponse, setOpenAIResponse] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [typedChars, setTypedChars] = useState(0);
  const [spokenChars, setSpokenChars] = useState(0);
  const [prevLength, setPrevLength] = useState(0);

  useEffect(() => {
    // Update the count of questions whenever qaPairs changes
    setQuestionsCount(qaPairs.length - 1);
  }, [qaPairs, questionsCount]);

  useEffect(() => {
    if (sequence.length === 0) {
      setSequence(createNumericalSequence());
    }

    async function init() {
      try {
        const sentences = await parseCSV();
        setVoiceBotState((prevState) => ({
          ...prevState,
          sentences,
        }));
      } catch (error) {
        console.error("Error parsing CSV: ", error);
      }
    }

    init();

    return () => {
      recognition.stop();
      recognition.onresult = null;
      recognition.onerror = null;
      // ... any other cleanup for speech recognition ...
    };
  }, [setVoiceBotState, sequence.length, recognition]);

  const startTimer = () => {
    if (startTime === null) {
      setStartTime(new Date());
    }
  };

  // When submitting an answer
  const stopTimer = () => {
    const currentEndTime = new Date();
    const timeTaken = currentEndTime - startTime; // Calculate time taken
    // If you need to update the state or use this value in your component, do it here
    console.log("Time taken:", formatTime(timeTaken > 0 ? timeTaken : 0));
    setStartTime(null);
    return timeTaken > 0 ? timeTaken : 0; // Ensure non-negative value
  };

  const shouldBlockAnswer = () => {
    const blockedValues = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 19, 20, 22, 23,
      25, 26, 28, 29,
    ];
    return blockedValues.includes(voiceBotState.audioFileIndex);
  };

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

  const parseAndSaveResponses = async (openAIAnalysis) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      console.log("No user logged in");
      return;
    }

    // Splitting the entire response into individual questions
    const questionSections = openAIAnalysis.split(/Question \d+:/).slice(1);

    for (const section of questionSections) {
      // Using regex to find different parts of each question section
      const questionTextMatch = section.match(
        /(?<=\n).*(?=\nUser Response to question:)/s
      );
      const userResponseMatch = section.match(
        /(?<=User Response to question:\n).*(?=\nSubmissions:)/s
      );
      const submissionsMatch = section.match(
        /(?<=Submissions:\n).*(?=\nResponse Time:)/s
      );
      const responseTimeMatch = section.match(
        /(?<=Response Time:\n).*(?=\ncharRatio:)/s
      );
      const charRatioMatch = section.match(
        /(?<=charRatio:\n).*(?=\nResponse Analysis:)/s
      );
      const responseAnalysisMatch = section.match(
        /(?<=Response Analysis:\n).*(?=\nScore:)/s
      );
      const scoreMatch = section.match(/(?<=Score:\n).+/s);

      const questionText = questionTextMatch ? questionTextMatch[0].trim() : "";
      const userResponse = userResponseMatch ? userResponseMatch[0].trim() : "";
      const submissions = submissionsMatch ? submissionsMatch[0].trim() : "";
      const responseTime = responseTimeMatch ? responseTimeMatch[0].trim() : "";
      const charRatio = charRatioMatch ? charRatioMatch[0].trim() : "";
      const responseAnalysis = responseAnalysisMatch
        ? responseAnalysisMatch[0].trim()
        : "";
      const score = scoreMatch ? scoreMatch[0].trim() : "";
      const date = new Date().toISOString();

      try {
        await addDoc(collection(db, "users", user.uid, "userResponses"), {
          questionText,
          userResponse,
          submissions,
          responseTime,
          charRatio,
          responseAnalysis,
          score,
          date,
        });

        console.log(
          "Document successfully written for question:",
          questionText
        );
      } catch (error) {
        console.error(
          "Error writing document for question:",
          questionText,
          error
        );
      }
    }
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
        <ListItemButton onClick={Dashboard}>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton onClick={testResponses}>
          <ListItemText primary="Test" />
        </ListItemButton>
        <ListItemButton onClick={resetInterview}>
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

  const Logout = async () => {
    await logout();
    navigate("/login");
  };

  function createNumericalSequence() {
    // This function shuffles an array
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    // Generate shuffled arrays for random number ranges
    const randomNumbers1 = shuffleArray(
      Array.from({ length: 10 }, (_, i) => i + 46)
    );
    const randomNumbers2 = shuffleArray(
      Array.from({ length: 10 }, (_, i) => i + 57)
    );
    const randomNumbers3 = shuffleArray(
      Array.from({ length: 9 }, (_, i) => i + 68)
    );
    const randomNumbers4 = shuffleArray(
      Array.from({ length: 10 }, (_, i) => i + 78)
    );
    const randomNumbers5 = shuffleArray(
      Array.from({ length: 11 }, (_, i) => i + 89)
    );

    // Initialize the sequence with fixed and random parts
    const sequence = [
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35,
      36,
      37,
      38,
      39,
      40,
      45,
      randomNumbers1[0],
      41,
      56,
      randomNumbers2[0],
      42,
      67,
      randomNumbers3[0],
      43,
      77,
      randomNumbers4[0],
      44,
      88,
      randomNumbers5[0],
      100,
      101,
    ];

    return sequence;
  }

  const formatTime = (milliseconds) => {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60;
    minutes = minutes % 60;

    // Formatting to ensure two digits
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    if (hours > 0) {
      return `${formattedHours}h ${formattedMinutes}m ${formattedSeconds}s`;
    } else if (minutes > 0) {
      return `${formattedMinutes}m ${formattedSeconds}s`;
    } else {
      return `${formattedSeconds}s`;
    }
  };

  function handleVBLastButtonClick() {
    const newAudioFileIndex =
      voiceBotState.audioFileIndex - 1 < 0
        ? 0
        : voiceBotState.audioFileIndex - 1;
    const newVoiceBotText =
      voiceBotState.sentences[sequence[newAudioFileIndex]];

    setVoiceBotState((prevState) => ({
      ...prevState,
      audioFileIndex: newAudioFileIndex,
      voiceBotText: newVoiceBotText,
    }));

    updateVoiceBotText(newVoiceBotText);
    var iframeWindow = document.getElementById("theBot").contentWindow;
    iframeWindow.postMessage(
      sequence[newAudioFileIndex],
      "https://voicebot.ispeakwell.ca/"
    );
    clearTextArea();
    setTypedChars(0);
    setSpokenChars(0);
  }

  const handleSubmitOpenAI = async () => {
    console.log("sent qaPairs to OpenAI: ", qaPairs);
    setIsAnalyzing(true);
    setShowSubmitButton(false);
    const filteredQAPairs = qaPairs.filter((pair) => pair.question !== null);
    const dataToSend = JSON.stringify({ qaPairs: filteredQAPairs });
    console.log("Data Sent to OpenAI from Browser:", dataToSend);
    let data; // Declare data at a higher scope
    try {
      const response = await fetch(
        "http://localhost:3001/api/interview-assessment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: dataToSend,
        }
      );

      data = await response.json(); // Assign data here
      setOpenAIResponse(data.message); // Assuming 'message' contains the response from OpenAI
      console.log("OpenAI interview analysis: ", data.message);
    } catch (error) {
      console.error("Error submitting to API:", error);
    } finally {
      setIsAnalyzing(false);
      setShowResults(true);
    }

    if (data) {
      await parseAndSaveResponses(data.message);
    }
  };

  const handleSubmit = () => {
    console.log("qaPairs on Add to Submit: ", qaPairs);
    if (shouldBlockAnswer()) {
      console.log("Submit blocked.");
      return;
    }

    const userSpeech = userSpeechRef.current?.value.trim() ?? "";

    if (userSpeech === "") {
      const button = document.querySelector(".submitAnswer");
      if (button) {
        button.style.backgroundColor = "rgb(219, 45, 45)"; // Change color to red
        button.textContent = "No Answer!";
        // Set a timeout to revert the color back after 250ms
        setTimeout(() => {
          button.style.backgroundColor = ""; // Revert to the initial color
          button.textContent = "Add Answer";
        }, 1500);
      }
      return;
    }

    stopListening();
    const answerTime = stopTimer();
    const currentQuestion = voiceBotState.voiceBotText;

    setQAPairs((prevQAPairs) => {
      const updatedQAPairs = [...prevQAPairs];
      const qaIndex = updatedQAPairs.findIndex(
        (pair) => pair.question === currentQuestion
      );

      if (qaIndex >= 0) {
        // Update existing QA pair
        if (!updatedQAPairs[qaIndex].answers.includes(userSpeech)) {
          updatedQAPairs[qaIndex].answers.push(userSpeech);
          updatedQAPairs[qaIndex].submissionCount += 1;
        }
        updatedQAPairs[qaIndex].timeTaken += answerTime;
        updatedQAPairs[qaIndex].typedChars += typedChars;
        updatedQAPairs[qaIndex].spokenChars += spokenChars;
        updatedQAPairs[qaIndex].charRatio =
          updatedQAPairs[qaIndex].typedChars /
          (updatedQAPairs[qaIndex].typedChars +
            updatedQAPairs[qaIndex].spokenChars);
      } else {
        // Add new QA pair
        updatedQAPairs.push({
          question: currentQuestion,
          answers: [userSpeech],
          timeTaken: answerTime,
          submissionCount: 1,
          typedChars: typedChars,
          spokenChars: spokenChars,
          charRatio: calculateCharRatio(typedChars, spokenChars),
        });
      }
      console.log("Answer received and submitted.", updatedQAPairs);
      return updatedQAPairs;
    });
    console.log(qaPairs);
    console.log("questionsCount: ", questionsCount);
    // Reset for next input
    setTypedChars(0);
    setSpokenChars(0);
    if (userSpeechRef.current) {
      userSpeechRef.current.value = "";
    }
    if (qaPairs.length >= 5 && qaPairs[4].submissionCount > 0) {
      setShowSubmitButton(true);
    } else {
      setShowSubmitButton(false);
    }
  };

  const calculateCharRatio = (typedChars, spokenChars) => {
    const totalChars = typedChars + spokenChars;
    return totalChars > 0 ? typedChars / totalChars : 0;
  };

  const handleVBNextButtonClick = () => {
    const newAudioFileIndex =
      voiceBotState.audioFileIndex + 1 > sequence.length - 1
        ? sequence.length - 1
        : voiceBotState.audioFileIndex + 1;
    const newVoiceBotText =
      voiceBotState.sentences[sequence[newAudioFileIndex]];

    setVoiceBotState((prevState) => ({
      ...prevState,
      audioFileIndex: newAudioFileIndex,
      voiceBotText: newVoiceBotText,
    }));

    updateVoiceBotText(newVoiceBotText);
    var iframeWindow = document.getElementById("theBot").contentWindow;
    iframeWindow.postMessage(
      sequence[newAudioFileIndex],
      "https://voicebot.ispeakwell.ca/"
    );
    clearTextArea();
    setTypedChars(0);
    setSpokenChars(0);
  };

  function updateVoiceBotText(text) {
    const textElement = document.getElementById("voiceBotTextElement");
    if (textElement) {
      textElement.textContent = text;
      voiceBotTextRef.current = text; // Update the ref
    }
  }

  const resetInterview = () => {
    setVoiceBotState((prevState) => ({
      ...prevState,
      audioFileIndex: -1,
      voiceBotText: "", // Reset voiceBotText to an empty string
      combinedText: "",
      prevCombinedText: "",
    }));
    var iframeWindow = document.getElementById("theBot").contentWindow;
    iframeWindow.postMessage(sequence[0], "https://voicebot.ispeakwell.ca/");

    setQAPairs(initialQAPairs); // Reset the question-answer pairs
    clearTextArea(); // Clear the text area if needed
    setShowSubmitButton(false);
    window.scrollTo(0, 0); // Scroll to the top of the window
    setIsAnalyzing(false);
    setShowResults(false);
  };

  const Dashboard = () => {
    navigate("/Dashboard");
  };

  const admin = () => {
    navigate("/admin");
  };

  const startListening = () => {
    if (shouldBlockAnswer()) {
      const button = document.querySelector(".StartListeningButton");
      if (button) {
        button.style.backgroundColor = "rgb(219, 45, 45)"; // Change color to red
        button.textContent = "Not Yet...";
        // Set a timeout to revert the color back after 250ms
        setTimeout(() => {
          button.style.backgroundColor = ""; // Revert to the initial color
          button.textContent = "Start Listening";
        }, 1500);
      }

      return;
    }
    if (isListeningRef.current) {
      return;
    }
    recognition.onstart = () => {
      isListeningRef.current = true;
      setVoiceBotState((prevState) => ({ ...prevState, isListening: true }));
      updateListeningButtonState(true);
      startTimer();
    };

    recognition.onend = () => {
      isListeningRef.current = false;
      setVoiceBotState((prevState) => ({ ...prevState, isListening: false }));
      updateListeningButtonState(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
    };

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      const transcriptLength = transcript.trim().length;

      setSpokenChars((prevChars) => prevChars + transcriptLength);

      if (userSpeechRef.current) {
        userSpeechRef.current.value +=
          (userSpeechRef.current.value ? " " : "") + transcript;
      }
    };

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.start();
  };

  // Handler for user typing in the textarea
  const handleUserTyping = (e) => {
    startTimer();
    const typedLength = e.target.value.length;
    const newTypedChars = typedLength - prevLength;
    if (newTypedChars > 0) {
      // Only update for typing, not deletion
      setTypedChars((prevTypedChars) => prevTypedChars + newTypedChars);
    }
    setPrevLength(typedLength); // Update prevLength for the next change
    console.log(
      "typedLength: ",
      typedLength,
      " newTypedChars: ",
      newTypedChars,
      " total typedChars: ",
      typedChars + newTypedChars
    );
  };

  const clearTextArea = () => {
    if (userSpeechRef.current) {
      userSpeechRef.current.value = "";
    }
  };

  const stopListening = () => {
    recognition.stop();
    isListeningRef.current = false;
    setVoiceBotState((prevState) => ({ ...prevState, isListening: false }));
    updateListeningButtonState(false);
  };

  const updateListeningButtonState = (isListening) => {
    const button = document.querySelector(".StartListeningButton");
    if (button) {
      if (isListening) {
        button.style.backgroundColor = "green";
        button.textContent = "Listening...";
      } else {
        button.style.backgroundColor = "";
        button.textContent = "Start Listening";
      }
    } else {
      console.error("Start Listening button not found");
    }
  };

  const testResponses = () => {
    const newQAPairs = [
      {
        question: "Where do you see yourself in 5 years?",
        answers: [
          "in 5 years I see myself as a valued member of your company in the same role or maybe even in a higher level but still providing the same level of leadership and training to your team members and helping to make things work better",
          "I also see myself taking on more and varied roles with clients around the world.",
        ],
        timeTaken: 113590,
        submissionCount: 2,
        typedChars: 389,
        spokenChars: 687,
        charRatio: 0.34934497816593885,
      },
      {
        question:
          "Describe a time you disagreed with a decision from your manager?",
        answers: [
          "My manager wanted to terminate the employment of two colleagues who were not performing as well as it was thoguht they should.   I asked him for some time to observe the situation and see if I can improve it and what I did was develop a Microsoft Excel dashboard that helped the team members to be able to see that their productivity was low",
          "when they were able to see that then they could see that if they make small changes to their work their productivity got better additionally they also learned that they actually had to command their muscles to work faster in order to meet the target deadlines",
          "it was also an opportunity for the company to reevaluate whether or not they were actually asking too much too little or just enough of their workers",
        ],
        timeTaken: 59196,
        submissionCount: 3,
        typedChars: 1157,
        spokenChars: 1448,
        charRatio: 1,
      },
      {
        question:
          "How do you educate yourself on our industry and its challenges?",
        answers: [
          "I do a lot of reading on the internet a lot of Googling and I've recently started using chat GPT to help me to be able to solve some technical challenges now what that does is it and it allows me to be able to connect with already made situations that I might have to Google through say 30 pages so it's a real Time Saver",
          "it's also really personable so I like to be able to work with that but aside from that I also go to conferences whether they're virtual or whether they are live  I'm currently taking a web programming class to be able to develop React web applications",
        ],
        timeTaken: 60382,
        submissionCount: 2,
        typedChars: 823,
        spokenChars: 1607,
        charRatio: 0.39035769828926903,
      },
      {
        question: "What do you think are the biggest challenges in this role?",
        answers: [
          "the biggest challenges are going to be the things that you have never faced before so for example you're going to be working with people who are from a different culture with a different religion and while you may be familiar with that there will be some stumbling blocks some things that you don't expect so for example you may run into the idea that family and what family means to an individual is far different or slightly different than you know in certain ways so for example if your mother calls you you might be able to say to your mom yes I'll get there in a couple hours whereas for another culture if Mom calls you've got to be there right away right in the particular example you're going to run into certain things dealing with the religion to some degree and some things that are you know adjacent to it so for example the idea of Insha'Allah which is it means some essentially at its very basic hopefully or yes or I think so right so rather than actually say yes I commit myself to this that or the other thing you'll frequently hear the term inshallah which means yes but it also means things could get in the way out of my control and I won't be able to do anything about that and that is in Stark difference to a culture like Canada where if it's within your contract you have to be able to provide you know the things that you're being paid to provide family and friends and other kinds of obligations are always put on the back burner because this is how you earn your money this is kind of part of the western ethos",
          "and if I say some more things then I should see 14 seconds",
          "And",
          "and here's something else I wanted to add about that which is that culture can be tricky",
        ],
        timeTaken: 87797,
        submissionCount: 4,
        typedChars: 1835,
        spokenChars: 11241,
        charRatio: 0.05247465712581992,
      },
      {
        question: "How would your colleagues describe you?",
        answers: [
          "my colleagues would say I'm a friendly person ready to help and pitch in at any time I pull my weight for example at the last Christmas party I did a lot of the organization the maneuvering of things the receiving of dishes the laying out of foods on the table at and a lot of the cleanup at the end as well",
        ],
        timeTaken: 24996,
        submissionCount: 1,
        typedChars: 307,
        spokenChars: 306,
        charRatio: 1.0032679738562091,
      },
    ];
    setQAPairs(newQAPairs);
    setQuestionsCount(5);
    clearTextArea();
    setShowSubmitButton(true);
  };

  return (
    <div className="InterviewPractice">
      <div className="background-container">
        <HexagonBackground />
      </div>
      <header>
        <h1 className="Main-Header">Advanced Interview</h1>
        <h2 className="Main-Header">Practice Interviewing with AI</h2>
      </header>
      <div className="interviewTipsCard">
        <InterviewTips />
      </div>
      <div className="VoiceBot-container">
        <VoiceBotIframe />
        <div className="VBButtons">
          <button onClick={handleVBLastButtonClick}>Last</button>
          <button onClick={handleVBNextButtonClick}>Next</button>
        </div>
      </div>
      <div>
        <h2 id="voiceBotTextElement" className="VoiceBotText">
          {voiceBotState.voiceBotText}
        </h2>
      </div>
      <div className="UserControls">
        <textarea
          ref={userSpeechRef}
          id="speech"
          className="userSpeech"
          onChange={handleUserTyping}
          placeholder="Position your microphone close to your mouth but away from your speech stream.

          Type here or click the `Start Listening` button, below, to use speech recognition when you receive a question to answer."
          disabled={shouldBlockAnswer()}
        ></textarea>
        <h4 className="instruct1">Wait for questions to input a reply.</h4>

        <div className="SpeechRecButtons">
          <button
            className="StartListeningButton"
            onClick={startListening}
            disabled={voiceBotState.isListening}
          >
            Speak
          </button>
          <button
            className="StpBttn"
            onClick={stopListening}
            disabled={!voiceBotState.isListening}
          >
            Stop
          </button>
          <button
            className="submitAnswer"
            onClick={handleSubmit}
            disabled={shouldBlockAnswer()}
          >
            Add
          </button>
          <button className="clearButton" onClick={clearTextArea}>
            Clear
          </button>
        </div>
      </div>

      {questionsCount > 0 && (
        <div className="Interview-Answer-Box">
          {qaPairs.map((pair, index) => (
            <div key={index} className="qaPair">
              <h3 className="Idialog">{pair.question}</h3>
              {pair.answers.map((answer, answerIndex) => (
                <div key={answerIndex}>
                  <h4 className="Udialog">{answer}</h4>
                </div>
              ))}
              {pair.submissionCount > 0 && (
                <p>Submissions: {pair.submissionCount}</p>
              )}
              {pair.timeTaken != null && (
                <p>Response Time: {formatTime(pair.timeTaken)}</p>
              )}
              {pair.charRatio != null && (
                <p>
                  Typed-to-Spoken-Character Ratio: {pair.charRatio.toFixed(2)}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {showSubmitButton && !showResults && (
        <button className="submitFinal" onClick={handleSubmitOpenAI}>
          Submit to OpenAI
        </button>
      )}
      {isAnalyzing && (
        <div style={{ textAlign: "center" }}>
          <Spinner />
        </div>
      )}
      {!isAnalyzing && showResults && (
        <div className="openAIResponseBox">
          {openAIResponse && (
            <div>
              <h3 className="openAIResponseBoxTitle">OpenAI Response:</h3>
              <p className="openAIResponseBoxText">{openAIResponse}</p>
            </div>
          )}
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
    </div>
  );
};

export default InterviewPractice;
