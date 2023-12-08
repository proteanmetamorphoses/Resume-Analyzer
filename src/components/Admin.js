import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import "./Admin.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Line } from "react-chartjs-2";
import "chart.js/auto"; // Import Chart.js
import { db } from "../utils/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
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

function Admin() {
  const [questions, setQuestions] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [selectedQuestion, setSelectedQuestion] = useState("");
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
          color: 'rgba(0, 255, 0, 0.3)',
          borderColor: 'green',
          borderDash: [5, 5],
          lineWidth: 2,
          drawBorder: true,
          drawOnChartArea: true,
          drawTicks: true,
          tickColor: 'green',
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
          color: 'rgba(255, 0, 0, 0.3)',
          borderColor: 'red',
          borderDash: [3, 3],
          lineWidth: 1,
          drawBorder: true,
          drawOnChartArea: true,
          drawTicks: true,
          tickColor: 'red',
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

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (selectedQuestion && user) {
        const scoresByDate = {};

        const q = query(
          collection(db, "users", user.uid, "userResponses"),
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

    fetchData();
  }, [selectedQuestion, user]);

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
    navigate('/interview-practice');
  };

  return (
    <div className="admin-section">
      <div className="background-container">
        <HexagonBackground />
      </div>
      <h1 className="Main-Header">Advanced Resume</h1>
      <h3 className="Main-Header">
        Select an interview question for practice statistics.
      </h3>
      <h3 className="SelectQuestion">Interview Question:</h3>
      <select className="SelectQuestionDevice" onChange={handleQuestionChange}>
        {questions.map((question, index) => (
          <option key={index} value={question} className="question">
            {question}
          </option>
        ))}
      </select>
      <div className="QuestionData" style={{ height: "300px", width: "80%" }}>
        <Line data={chartData} options={options} />
      </div>
      <nav className="logout-nav">
        <button onClick={Dashboard}>Dashboard</button>
        <button className="interView" onClick={InterViewPractice}>Interview Practice</button>
        <LogoutLink />
      </nav>
    </div>
  );
}

export default Admin;
