import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, createUserWithEmailAndPassword, updateProfile, revokeAccessToken } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [universityName, setUniversityName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseToken = await userCredential.user.getIdToken();
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      const userData = {
        firebaseToken,
        name,
        email,
      };

      const response = await fetch("http://localhost:3000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        console.log("User saved to MongoDB!");
        localStorage.setItem("user", JSON.stringify(userData));
        setIsModalOpen(true); // Open the modal
      } else {
        console.error("Error saving user:", response.statusText);
      }
    } catch (error) {
      console.error("Error signing up:", error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const userCredentials = await signInWithPopup(auth, googleProvider);
      const firebaseToken = await userCredentials.user.getIdToken();
      const user = userCredentials.user;
      const name = user.displayName || 'Default Name';
      const email = user.email;

      const userData = {
        firebaseToken,
        name,
        email,
      };

      const response = await fetch("http://localhost:3000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        console.log("User saved to MongoDB!");
        localStorage.setItem("user", JSON.stringify(userData));
        setIsModalOpen(true); // Open the modal
      } else {
        console.error("Error saving user:", response.statusText);
      }
    } catch (error) {
      console.error('Google sign-in error:', error.message);
    }
  };

  const handleSave = async () => {
    if (universityName) {
      const response = await fetch("http://localhost:3000/api/university/adduniname",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({universityName}),
      });
      const data = await response.json();
      console.log(data.msg);  
      console.log(`University Name: ${universityName}`);
      setIsModalOpen(false);
      navigate('/home'); 
    } else {
      alert("Please enter your university name.");
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
          <Link to="/login" className="text-blue-500 hover:underline ml-1">Login</Link>
        </p>

        <div className="mt-6 text-center">
          <button
            onClick={handleGoogleSignIn}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 w-full mb-2"
          >
            Sign up with Google
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-blue-100 p-6 rounded-lg w-80 shadow-lg">
            <h2 className="text-xl font-semibold text-blue-700 mb-4 text-center">Enter University Name</h2>
            <input
              type="text"
              value={universityName}
              onChange={(e) => setUniversityName(e.target.value)}
              placeholder="University Name"
              className="w-full p-2 border border-blue-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white    px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Save
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
}

export default Signup;
