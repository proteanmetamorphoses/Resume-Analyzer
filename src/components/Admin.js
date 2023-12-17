import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import "./Admin.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Line } from "react-chartjs-2";
import "chart.js/auto"; // Import Chart.js
import { db } from "../utils/firebase";
import {
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDoc,
  setDoc,
  getDocs,
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
import LogoutLink from "./LogoutLink";
import { useAuth } from "./AuthContext";

function Admin() {
  const [questions, setQuestions] = useState([]);
  const [user, setUser] = useState(null);
  const { colorMode, changeColorMode } = useColorMode();
  const navigate = useNavigate();
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const { userRole } = useAuth();
  const [userIds, setUserIds] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
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
    });
    /*if (userRole !== "admin") {
      navigate("/Dashboard");
    }*/
    return unsubscribe; // Cleanup subscription on unmount
  }, [navigate, userRole]);

  useEffect(() => {
    async function fetchUserIds() {
      if (userRole === 'admin') {
        const usersCollection = collection(db, "users");
        const userDocs = await getDocs(usersCollection);
        const userIds = userDocs.docs.map((doc) => doc.id);
        setUserIds(userIds);
      }
    }
  
    fetchUserIds();
  }, [userRole]); // Add userRole as a dependency
  

  useEffect(() => {
    async function fetchData() {
      let userIdToFetch = user && user.uid;

      if (userRole === 'admin' && selectedUserId) {
        userIdToFetch = selectedUserId;
      }
      console.log("userIdToFetch: ", userIdToFetch);

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
          labels: labels, // Assuming 'labels' is calculated in this effect
          datasets: [
            {
              ...prevChartData.datasets[0],
              data: data, // Assuming 'data' is calculated in this effect
            },
          ],
        }));
      }
    }
    if (user){
      fetchData();
    }
    console.log("selectedQuestion: ", selectedQuestion, " selectedUserId: ", selectedUserId, " userRole: ", userRole, " user: ", user);
  }, [selectedQuestion, selectedUserId, userRole, user]);



  useEffect(() => {
    if (user) {
      async function fetchQuestions() {
        const response = await fetch("/data/questions.csv");
        const reader = response.body.getReader();
        const result = await reader.read(); // raw array
        const decoder = new TextDecoder("utf-8");
        const csv = decoder.decode(result.value); // the CSV text
        Papa.parse(csv, {
          complete: (result) => {
            setQuestions(result.data.flat());
          },
          header: false,
        });
      }

      fetchQuestions();
    }
  }, [user]);

  if (!user) {
    return <div>Loading or not authorized...</div>;
  }

  const handleQuestionChange = (event) => {
    setSelectedQuestion(event.target.value);
  };

  const Dashboard = () => {
    navigate("/Dashboard");
  };

  const InterViewPractice = () => {
    // Navigate to the InterviewPractice page
    navigate("/interview-practice");
  };

  const changeColor = async () => {
    if (!user || !user.uid) {
      console.error("user or user.uid is undefined");
      return;
    }

    const newColorMode = colorMode >= 8 ? 0 : colorMode + 1;
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
      <div>
        <h1 className="Main-Header">Advanced Career</h1>
        <h3 className="Main-Header">Admin</h3>
        <div className="AdminTools">
          <div className="AdminTools-Question-Chart">
            {userRole === "admin" && (
              <div className="AdminTools-SelectUserID">
                <h3 className="SelectUserID">UserID:</h3>
                <select
                  className="Select-Device-UserID"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                >
                  {userIds.map((id) => (
                    <option key={id} value={id} className="selectUserID">
                      {id}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <h3 className="SelectQuestion">Interview Question</h3>
            <select
              className="SelectQuestionDevice"
              onChange={handleQuestionChange}
            >
              {questions.map((question, index) => (
                <option key={index} value={question} className="question">
                  {question}
                </option>
              ))}
            </select>
            <div
              className="QuestionData"
              style={{ height: "300px", width: "99%" }}
            >
              <Line data={chartData} options={options} />
            </div>
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
        <div className="background-container">
          <HexagonBackground />
        </div>
      </div>
      <nav className="logout-nav">
        <button onClick={Dashboard}>Dashboard</button>
        <button className="interView" onClick={InterViewPractice}>
          Interview Practice
        </button>
        <LogoutLink />
      </nav>
    </div>
  );
}

export default Admin;
