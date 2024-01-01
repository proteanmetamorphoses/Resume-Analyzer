import React from "react";
import { AuthProvider } from "./components/AuthContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import About from "./components/About";
import Billing from "./components/Billing";
import Careers from "./components/Careers";
import Contactus from "./components/Contactus";
import ConversationPractice from "./components/Conversationpractice";

import ProtectedRoute from "./utils/ProtectedRoute";
import PasswordReset from "./components/PasswordReset";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./components/NotFound";
import InterviewPractice from "./components/InterviewPractice";
import Admin from "./components/Admin";
import { VoiceBotStateProvider } from "./components/VoiceBotStateContext";
import { ColorModeProvider } from "./ColorModeContext";
import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

function App() {
  return (
    <AuthProvider>
      <ColorModeProvider>
        <VoiceBotStateProvider>
          <Router>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/about" element={<About />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/contactus" element={<Contactus />} />
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
              <Route
                path="/conversationpractice"
                element={
                  <ProtectedRoute>
                    <ConversationPractice />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route path="/password-reset" element={<PasswordReset />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </VoiceBotStateProvider>
      </ColorModeProvider>
    </AuthProvider>
  );
}

export default App;
