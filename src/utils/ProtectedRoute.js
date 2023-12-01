import { Navigate } from 'react-router-dom';
import { auth } from '../utils/firebase';

const ProtectedRoute = ({ children }) => {
  return auth.currentUser ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
