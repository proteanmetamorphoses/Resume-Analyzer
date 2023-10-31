import firebase from '../utils/firebase';
import { auth } from '../utils/firebase';

function Login() {
  const handleLogin = async (email, password) => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
      // Redirect or perform some action after successful login
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return <div>Login Page</div>; // Your JSX here, with input fields and a button to trigger handleLogin

}

export default Login;
