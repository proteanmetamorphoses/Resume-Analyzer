import { useState } from 'react';
import { auth, sendPasswordResetEmail } from '../utils/firebase';
import './PasswordReset.css'; // Your CSS file for styling

function PasswordReset() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Check your email (including spam or junk box) for your password reset link.');
    } catch (error) {
      console.error('Error sending password reset email:', error);
      setError('Failed to send password reset email. Please try again.');
    }
  };

  return (
    <div className="password-reset-container">
      <div className="header-container">
        <h1 className="header-title">Advanced Resume</h1>
        <p className="header-subtitle">Password Reset</p>
      </div>

      <form className="prform" onSubmit={handlePasswordReset}>
        <input
          className="prinput"
          type="email"
          placeholder="Enter account email to retrieve password"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="prbutton" type="submit">Submit</button>
      </form>
      {message && <p className="message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default PasswordReset;