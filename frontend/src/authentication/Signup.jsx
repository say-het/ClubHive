import React, { useState } from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import { auth } from '../firebase'; // Assuming firebase.js is properly set up
import { signInWithPopup } from 'firebase/auth';
// import { auth, googleProvider, appleProvider } from '../firebase'; // Assuming firebase.js is properly set up

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add signup logic here, such as form validation or API call
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Name:", name, "Email:", email, "Password:", password);
    // Implement Firebase signup logic here
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // Handle successful sign-in, such as redirecting the user
      console.log('Google sign-in successful');
    } catch (error) {
      console.error('Google sign-in error:', error);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await signInWithPopup(auth, appleProvider);
      // Handle successful sign-in, such as redirecting the user
      console.log('Apple sign-in successful');
    } catch (error) {
      console.error('Apple sign-in error:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700" htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your name"
            />
          </div>
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
          <div>
            <label className="block text-gray-700" htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Confirm your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Already have an account?          
          <Link to="/login"> {/* Corrected Link component */}
            <p className="text-blue-500 hover:underline">Login</p>
          </Link>
        </p>

        <div className="mt-6 text-center">
          <button
            onClick={handleGoogleSignIn}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 w-full mb-2"
          >
            Sign up with Google
          </button>
          <button
            onClick={handleAppleSignIn}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 w-full"
          >
            Sign up with Apple
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;
