import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { auth } from '../utils/firebase';
import Login from '../components/Login';
import Signup from '../components/Signup';
import Dashboard from '../components/Dashboard';

function ProtectedRoute() {
    return auth.currentUser ? <Outlet /> : <Navigate to="/login" replace />;
  }
 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default ProtectedRoute;
