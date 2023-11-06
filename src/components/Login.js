import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from '../utils/firebase';
import { Link } from 'react-router-dom';
import './Login.css';
import googleLogo from './GoogleG.png';
import { useEffect } from 'react';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); // Redirect to dashboard after successful login
    } catch (error) {
      console.error("Error logging in:", error);
      // Check for the 'auth/invalid-email' error code and set a custom message
      if (error.code === 'auth/invalid-email') {
        setError('Invalid Email.');
      } else {
        // For other errors, you can either display a generic message
        // or handle them specifically based on their error.code
        setError('An error occurred while trying to log in. Please try again.');
      }
    }
  };
  

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // This gives you a Google Access Token. You can use it to access Google APIs.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      navigate('/dashboard'); // Redirect to dashboard after successful login
    } catch (error) {
      console.error("Error logging in with Google:", error);
      setError("There was an issue with Google sign-in. Please try again.");
    }
  };
  
  return (
    <div className="login-container">
      <h1 className="header-title">Advanced Resume</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="button-container">
          <button className = "login-button" type="submit">Login</button>
        </div>
      </form>
      {error && <p className="error-message">{error}</p>}
      <button onClick={handleGoogleSignIn} className="google-sign-in-button">
        <img src={googleLogo} alt="Google sign-in" />
        Sign in with Google
      </button>
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
      <p>
        Forgot your password? <Link to="/password-reset">Reset it here</Link>
      </p>
    </div>
  );
}

export default Login;
