import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
import PasswordReset from "./components/PasswordReset";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./components/NotFound";
import InterviewPractice from "./components/InterviewPractice";
import { VoiceBotStateProvider } from './components/VoiceBotStateContext';
import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

function App() {
  return (
    <VoiceBotStateProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/interview-practice"
            element={
              <ProtectedRoute>
                <InterviewPractice />
              </ProtectedRoute>
            }
          />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </VoiceBotStateProvider>
  );
}

export default App;