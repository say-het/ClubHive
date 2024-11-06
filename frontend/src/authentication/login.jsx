import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';  // Import the Firebase auth instance
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail, OAuthProvider } from 'firebase/auth';  // Firebase authentication methods

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailForReset, setEmailForReset] = useState('');

  // Handle form submission for standard email/password login
  const handleSubmit = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in successfully
        console.log("Logged in:", userCredential);
      })
      .catch((error) => {
        console.error("Error logging in:", error.message);
      });
  };

  // Handle Google sign-in
  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("Google sign-in successful:", result.user);
      })
      .catch((error) => {
        console.error("Google sign-in error:", error.message);
      });
  };

  // Handle Apple sign-in (OAuth Provider)
  const handleAppleSignIn = () => {
    const provider = new OAuthProvider('apple.com');
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("Apple sign-in successful:", result.user);
      })
      .catch((error) => {
        console.error("Apple sign-in error:", error.message);
      });
  };

  // Handle password reset
  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, emailForReset)
      .then(() => {
        alert('Password reset email sent!');
      })
      .catch((error) => {
        console.error("Error sending password reset email:", error.message);
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-gray-700" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Don't have an account? 
          <Link to="/signup">
            <p className="text-blue-500 hover:underline">Sign up</p>
          </Link>
        </p>

        <div className="flex justify-center space-x-4 mt-6">
          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleSignIn}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
          >
            Sign in with Google
          </button>

          {/* Apple Sign-In Button */}
          <button
            onClick={handleAppleSignIn}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-200"
          >
            Sign in with Apple
          </button>
        </div>

        <div className="mt-4">
          <h3 className="text-center text-gray-700">Forgot Password?</h3>
          <input
            type="email"
            placeholder="Enter your email to reset password"
            value={emailForReset}
            onChange={(e) => setEmailForReset(e.target.value)}
            className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button
            onClick={handlePasswordReset}
            className="w-full bg-blue-500 text-white py-2 mt-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
