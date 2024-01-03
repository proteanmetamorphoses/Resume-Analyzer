import React from "react";
import { AuthProvider } from "./components/AuthContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/ResumeRevisor";
import About from "./components/About";
import Tokens from "./components/Tokens";
import Careers from "./components/Careers";
import Menu from "./components/Menu";
import Contactus from "./components/Contactus";
import ConversationPractice from "./components/Conversationpractice";
import ProtectedRoute from "./utils/ProtectedRoute";
import PasswordReset from "./components/PasswordReset";
import Purchase from "./components/Purchase";
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./components/NotFound";
import InterviewPractice from "./components/InterviewPractice";
import Admin from "./components/Admin";
import { VoiceBotStateProvider } from "./components/VoiceBotStateContext";
import { ColorModeProvider } from "./ColorModeContext";
import axios from "axios";
import { TokenProvider } from "./components/tokenContext";

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

function App() {
  return (
    <AuthProvider>
      <ColorModeProvider>
        <VoiceBotStateProvider>
          
            <Router>
            <TokenProvider>
              <ScrollToTop />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/about" element={<About />} />
                <Route path="/tokens" element={<Tokens />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/contactus" element={<Contactus />} />
                <Route
                  path="/menu"
                  element={
                    <ProtectedRoute>
                      <Menu />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/purchase"
                  element={
                    <ProtectedRoute>
                      <Purchase />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/resumerevisor"
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
              </TokenProvider>
            </Router>
          
        </VoiceBotStateProvider>
      </ColorModeProvider>
    </AuthProvider>
  );
}

export default App;
