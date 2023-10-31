import { auth } from '../utils/firebase'; // Adjust the path if needed


function Signup() {
    const handleSignup = async (email, password) => {
      try {
        await auth.createUserWithEmailAndPassword(email, password);
        // Redirect or perform some action after successful signup
      } catch (error) {
        console.error("Error signing up:", error);
      }
    };
  
    return <div>Sign In Page</div>;

  }
  export default Signup;
