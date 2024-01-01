import React, { useState, useEffect, useCallback } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Modal,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import "./Admin.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Line } from "react-chartjs-2";
import "chart.js/auto"; // Import Chart.js
import { db } from "../utils/firebase";
import {
  doc,
  deleteDoc,
  updateDoc,
  collection,
  query,
  where,
  getDoc,
  setDoc,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { useColorMode } from "../ColorModeContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import zoomPlugin from "chartjs-plugin-zoom";
import HexagonBackground from "./HexagonBackground";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/firebase";
import { useAuth } from "./AuthContext";

function Admin() {
  const [questions, setQuestions] = useState([]);
  const [user, setUser] = useState(null);
  const { colorMode, changeColorMode } = useColorMode();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const { userRole } = useAuth();
  const [userIds, setUserIds] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [questionResponses, setQuestionResponses] = useState([]);
  const [open, setOpen] = useState(false);
  const [documentIds, setDocumentIds] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const handleClose = () => setOpen(false);
  const [documentData, setDocumentData] = useState({
    date: "",
    response: "",
    responseAnalysis: "",
    responseTime: "",
    charRatio: "",
    score: "",
  });
  const [chartData, setChartData] = useState({
    labels: [], // for dates
    datasets: [
      {
        label: "Average Score",
        data: [], // for average scores
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  });
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    zoomPlugin
  );

  const options = {
    tooltips: {
      enabled: true,
      mode: "index",
      intersect: false,
      callbacks: {
        label: function (tooltipItem, data) {
          let label = data.datasets[tooltipItem.datasetIndex].label || "";
          if (label) {
            label += ": ";
          }
          label += Math.round(tooltipItem.yLabel * 100) / 100;
          return label;
        },
      },
    },
    scales: {
      y: {
        grid: {
          color: "rgba(0, 255, 0, 0.3)",
          borderColor: "green",
          borderDash: [5, 5],
          lineWidth: 2,
          drawBorder: true,
          drawOnChartArea: true,
          drawTicks: true,
          tickColor: "green",
          tickLength: 10,
        },
        ticks: {
          color: "white",
        },
        title: {
          display: true,
          text: "Score",
          color: "white",
        },
      },
      x: {
        grid: {
          color: "rgba(255, 0, 0, 0.3)",
          borderColor: "red",
          borderDash: [3, 3],
          lineWidth: 1,
          drawBorder: true,
          drawOnChartArea: true,
          drawTicks: true,
          tickColor: "red",
          tickLength: 8,
        },
        ticks: {
          color: "white",
        },
        title: {
          display: true,
          text: "Answer Date",
          color: "white",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "orange",
        },
      },
      title: {
        display: true,
        text: "Interview Question Score",
        color: "white",
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "xy",
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "xy",
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && userRole !== "admin") {
        setSelectedUserId(currentUser.uid);
      }
    });
    return () => {
      unsubscribe(); // This function is called when the component unmounts
      // Clear user data here as well, to handle component unmounting
      setQuestions([]);
      setUserIds([]);
      setQuestionResponses([]);
      setDocumentIds([]);
      setSelectedId("");
      setDocumentData({}); // Reset to the initial state of your document data
      // Add more state resets as needed
    };
  }, [navigate, userRole]);

  useEffect(() => {
    if (!user) return;
    // Fetching user IDs (for admin role)
    async function fetchUserIds() {
      if (userRole === "admin") {
        const usersCollection = collection(db, "users");
        const userDocs = await getDocs(usersCollection);
        const userIds = userDocs.docs.map((doc) => doc.id);
        setUserIds(userIds);

        // Optionally, set a default selectedUserId here, e.g., the first one
        if (userIds.length > 0 && !selectedUserId) {
          setSelectedUserId(userIds[0]);
        }
      }
    }

    if (userRole === "admin") {
      fetchUserIds();
    }
  }, [selectedUserId, userRole, user]);

  const fetchQuestions = useCallback(async () => {
    if (!user) return;
  
    let userIdToFetch = userRole === "admin" && selectedUserId ? selectedUserId : user?.uid;
  
    if (userIdToFetch) {
      try {
        const responsesQuery = query(collection(db, "users", userIdToFetch, "userResponses"));
        const querySnapshot = await getDocs(responsesQuery);
  
        const uniqueQuestions = new Set();
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          uniqueQuestions.add(data.questionText);
        });
  
        setQuestions(Array.from(uniqueQuestions));
      } catch (error) {
        console.error("Error fetching questions:", error);
        setQuestions([]);
      }
    }
  }, [user, userRole, selectedUserId]); // Dependencies of fetchQuestions
  
  useEffect(() => {
    if (!user) return;
    async function fetchData() {
      let userIdToFetch = user && user.uid;

      if (userRole === "admin" && selectedUserId) {
        userIdToFetch = selectedUserId;
      }

      if (selectedQuestion && userIdToFetch) {
        const scoresByDate = {};

        const q = query(
          collection(db, "users", userIdToFetch, "userResponses"),
          where("questionText", "==", selectedQuestion)
        );
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const { score, date } = data; // 'date' is a string in ISO format

          // Extracting just the date part from the ISO string
          const dateStr = date.split("T")[0];

          if (!scoresByDate[dateStr]) {
            scoresByDate[dateStr] = [];
          }
          scoresByDate[dateStr].push(score);
        });

        const labels = Object.keys(scoresByDate).sort(); // Sort the dates if needed
        const data = labels.map((date) => {
          const scores = scoresByDate[date];
          const averageScore =
            scores.reduce((acc, score) => acc + score, 0) / scores.length;
          return averageScore;
        });

        setChartData((prevChartData) => ({
          ...prevChartData,
          labels: labels,
          datasets: [
            {
              ...prevChartData.datasets[0],
              data: data,
            },
          ],
        }));
      }
    }
    if (user) {
      fetchData();
    }
  }, [selectedQuestion, selectedUserId, userRole, user]);

  useEffect(() => {
    if (!user) return;
    setQuestionResponses([]);

    async function fetchResponses() {
      let userIdToFetch = userRole === "admin" ? selectedUserId : user.uid;
      if (userIdToFetch && selectedQuestion) {
        const q = query(
          collection(db, "users", userIdToFetch, "userResponses"),
          where("questionText", "==", selectedQuestion),
          orderBy("date", "desc")
        );
        const querySnapshot = await getDocs(q);
        const responses = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          responses.push({
            id: doc.id,
            date: data.date,
            response: data.userResponse,
            responseAnalysis: data.responseAnalysis,
            responseTime: data.responseTime,
            charRatio: data.charRatio,
            score: data.score,
            // Make sure this line correctly references the field in Firestore
            // Add more fields here if needed
          });
        });
        setQuestionResponses(responses);
      }
    }

    fetchResponses();
  }, [selectedQuestion, user, selectedUserId, userRole]);

  const fetchDocumentIds = useCallback(async () => {
    if (!user) return;
    let userIdToFetch = userRole === "admin" && selectedUserId ? selectedUserId : user?.uid;
    
    if (userIdToFetch) {
      try {
        let q;
        if (selectedQuestion) {
          q = query(
            collection(db, "users", userIdToFetch, "userResponses"),
            where("questionText", "==", selectedQuestion)
          );
        } else {
          q = query(collection(db, "users", userIdToFetch, "userResponses"));
        }
  
        const querySnapshot = await getDocs(q);
        const ids = querySnapshot.docs.map((doc) => doc.id);
        setDocumentIds(ids);
      } catch (error) {
        console.error("Error fetching document IDs:", error);
        console.log("Error details:", error.code, error.message);
      }
    }
  },[user, selectedQuestion, selectedUserId, userRole]);

  useEffect(() => {
    fetchDocumentIds();
  }, [fetchDocumentIds]); // Fetch document IDs when these dependencies change

   useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions, selectedQuestion, user]); // Update the list of questions when these dependencies change

  if (!user) {
    return <div>Loading or not authorized...</div>;
  }

  const handleIdChange = async (event) => {
    if (!user) return;
    
    const id = event.target.value;
    setSelectedId(id);

    try {
      const userIdToFetch = userRole === "admin" ? selectedUserId : user.uid;
      const docRef = doc(db, "users", userIdToFetch, "userResponses", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setDocumentData(docSnap.data());
      } else {
        console.log("No such document!");
        setDocumentData({}); // Reset the document data if not found
      }
    } catch (error) {
      console.error("Error fetching document:", error);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    if (!selectedId) {
      console.error("No document selected");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );
    if (!confirmed) {
      return;
    }

    try {
      const docRef = doc(
        db,
        "users",
        selectedUserId,
        "userResponses",
        selectedId
      );
      await deleteDoc(docRef);
      const confirmed = window.confirm("Document successfully deleted.");
      if (!confirmed) {
        return;
      }

      // Refresh the list of document IDs
      await fetchDocumentIds();
      await fetchQuestions();

      // Reset the selected ID and document data
      setSelectedId("");
      setDocumentData({}); // Reset to the initial state of your document data
    } catch (error) {
      const confirmed = window.confirm("Can't delete document.");
      if (!confirmed) {
        return;
      }
    }
  };

  // Function to fetch document IDs (similar to what's used in useEffect)

  const handleSave = async () => {
    if (!user) return;
    if (!selectedId) {
      console.error("No document selected");
      // Handle the case where no document is selected
      return;
    }

    try {
      const docRef = doc(
        db,
        "users",
        selectedUserId,
        "userResponses",
        selectedId
      );
      await updateDoc(docRef, documentData);
      console.log("Document successfully updated");
      handleClose();
    } catch (error) {
      console.error("Error updating document:", error);
      // Handle any errors, such as displaying an error message
    }
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsOpen(open);
  };

  //dropdown menu (top left corner of scree)
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
        <ListItemButton onClick={InterViewPractice}>
          <ListItemText primary="Interview Practice" />
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

  const handleQuestionChange = async (event) => {
    if (!user) return;
    const question = event.target.value;
    setSelectedQuestion(question);

    let userIdToFetch = userRole === "admin" ? selectedUserId : user.uid;
    if (userIdToFetch && question) {
      try {
        // Query Firestore to fetch document IDs based on the selected question
        const q = query(
          collection(db, "users", userIdToFetch, "userResponses"),
          where("questionText", "==", question)
        );
        const querySnapshot = await getDocs(q);
        const ids = querySnapshot.docs.map((doc) => doc.id);
        // Set the state with the fetched document IDs
        setDocumentIds(ids);
      } catch (error) {
      }
    }
    setSelectedId("");
    setDocumentData({});
  };

  const Dashboard = () => {
    navigate("/Dashboard");
  };

  const InterViewPractice = () => {
    // Navigate to the InterviewPractice page
    navigate("/interview-practice");
  };

  function formatMillis(millis) {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  const reviseUserQuestionResponse = () => {
    setOpen(true);
  };

  function convertUtcToLocalTime(utcDateString) {
    const date = new Date(utcDateString);
    return date.toLocaleString(); // Converts to local time and formats it
  }

  function formatCharRatio(ratio) {
    return parseFloat(ratio).toFixed(2);
  }

  const changeColor = async () => {
    if (!user || !user.uid) {
      console.error("user or user.uid is undefined");
      return;
    }

    const newColorMode = colorMode >= 17 ? 0 : colorMode + 1;
    // Reference to the user's color mode document
    const colorModeRef = doc(
      db,
      "users",
      user.uid,
      "userColorMode",
      "colorDocument"
    );
    // Try to get the document
    const docSnap = await getDoc(colorModeRef);
    // Check if the document exists
    if (!docSnap.exists()) {
      // If it doesn't exist, create it with the initial color mode
      await setDoc(colorModeRef, { colorMode: newColorMode });
    } else {
      // If it exists, update the color mode
      await updateDoc(colorModeRef, { colorMode: newColorMode });
    }

    changeColorMode(newColorMode);
  };

  return (
    <div className="admin-section">
      <div className="Base">
        <header className="admin-Header">
          <h1>Advanced Career</h1>
          <h3>Admin</h3>
        </header>
        <div className="AdminTools">
          <div className="AdminTools-Question-Chart">
            {userRole === "admin" && (
              <div className="AdminTools-SelectUserID">
                <h3 className="SelectUserID">UserID</h3>
                <select
                  className="Select-Device-UserID"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                >
                  {userIds.map((id) => (
                    <option key={id} value={id} className="selectUserID">
                      {id === user.uid ? ` * ${id}` : `~${id}`}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <h3 className="SelectQuestion">Interview Question</h3>
            <select
              className="SelectQuestionDevice"
              onChange={handleQuestionChange}
              value={selectedQuestion}
            >
              {questions.length > 0 ? (
                questions.map((question, index) => (
                  <option key={index} value={question} className="question">
                    {question}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No questions answered
                </option>
              )}
            </select>
            <div
              className="QuestionData"
              style={{ height: "300px", width: "99%" }}
            >
              <Line data={chartData} options={options} />
            </div>
          </div>
          <div className="spacer"></div>
          <div className="QuestionResponsesByDate">
            <h3 className="ColorChanger-Title">User Response(s)</h3>
            <button
              className="UserResponseRevise"
              onClick={reviseUserQuestionResponse}
            >
              Revise
            </button>
            {questionResponses.map((response) => (
              <div key={response.id} className="response">
                <p>ID: {response.id}</p>
                <p>Date: {convertUtcToLocalTime(response.date)}</p>
                <p>Response Time: {formatMillis(response.responseTime)}</p>
                <p>Response: {response.response}</p>
                <p>Response Analysis: {response.responseAnalysis}</p>
                <p>
                  Typed-to-Spoken Character Ratio:{" "}
                  {formatCharRatio(response.charRatio)}
                </p>
                <p>Score: {response.score}</p>
              </div>
            ))}
          </div>
          <div className="Tools-Holder">
            <div className="ColorChanger">
              <h3 className="ColorChanger-Title">Color Theme</h3>
              <button className="ColorChanger-Button" onClick={changeColor}>
                Change Color Theme {colorMode + 1}
              </button>
            </div>
            <div className="Empty-Drawer"></div>
          </div>
        </div>
        <div>
          <Modal open={open} onClose={handleClose}>
            <div
              style={{
                backgroundColor: "lightgray", // Light gray background
                border: "2px solid darkgray", // Dark border
                borderRadius: "10px", // Rounded edges
                width: "90%", // 50% of the viewport width
                height: "80%", // 75% of the viewport height
                position: "fixed", // Fixed position
                top: "50%", // Center vertically
                left: "50%", // Center horizontally
                transform: "translate(-50%, -50%)", // Adjust position to center
                overflowY: "auto", // Add scroll for overflow content
                zIndex: 1000, // Ensure it's above other elements
                padding: "20px", // Internal padding
                boxSizing: "border-box", // Include padding and border in width and height
              }}
            >
              <div>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="document-id-selector-label">
                    Document ID
                  </InputLabel>
                  <Select
                    labelId="document-id-selector-label"
                    value={selectedId}
                    label="Document ID"
                    onChange={handleIdChange}
                  >
                    {documentIds.map((id) => (
                      <MenuItem key={id} value={id}>
                        {id}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel id="question-selector-label">
                    Selected Question
                  </InputLabel>
                  <Select
                    labelId="question-selector-label"
                    value={selectedQuestion}
                    label="Selected Question"
                    onChange={handleQuestionChange}
                  >
                    {questions.map((question, index) => (
                      <MenuItem key={index} value={question}>
                        {question}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <h4>Selected ID: {selectedId}</h4>
              <h4>Selected Question: {selectedQuestion}</h4>
              {Object.entries(documentData).map(([key, value]) => (
                <div key={key}>
                  <h4>{key}</h4>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={value}
                    onChange={(e) =>
                      setDocumentData({
                        ...documentData,
                        [key]: e.target.value,
                      })
                    }
                  />
                </div>
              ))}
              <div className="button-Box">
                <Button onClick={handleSave}>Save</Button>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleDelete}>Delete</Button>
                <Button onClick={handleClose}>Close</Button>
              </div>
            </div>
          </Modal>
        </div>
        <div className="background-container">
          <HexagonBackground />
        </div>
      </div>
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
}

export default Admin;
