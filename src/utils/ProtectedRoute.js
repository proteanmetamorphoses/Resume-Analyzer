import { Navigate } from 'react-router-dom';
import { auth } from '../utils/firebase';

function ProtectedRoute({ component: Component, ...rest }) {
  return auth.currentUser ? <Component {...rest} /> : <Navigate to="/login" />;
}

export default ProtectedRoute;
