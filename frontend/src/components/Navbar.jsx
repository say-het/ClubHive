import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import axios from 'axios';

function Navbar() {
  
  const [heading, setHeading] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const avatarUrl = user.profilePicture || "https://via.placeholder.com/40";
  const [avatarUrl,setUrl] = useState('');

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      // console.log("OK")
      setHeading(parsedUser.name);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("user");
      setHeading('');
      setIsLoggedIn(false);
      location.reload();

    } catch (e) {
      console.error("Error logging out:", e);
    }
  };
  const profilepicture = async () => {
    try {
      const email = JSON.parse(localStorage.getItem('user')).email;
      const prfl = await axios.post('http://localhost:3000/api/users/fetch-profile-avatar', { email });
      
      // Access the profile picture URL directly from `prfl.data`
      // console.log(prfl.data.profilePicture);
      
      const profileUrl = prfl.data.pfrl || "https://via.placeholder.com/40"; // Fallback to placeholder
      setUrl(profileUrl);
  
      console.log(profileUrl);  // Check the URL in the console
    } catch (error) {
      console.log("Trouble fetching the profile picture", error); // Log the full error object for debugging
    }
  };
  
  // Call this function inside a `useEffect` to run it when the component mounts
  useEffect(() => {
    profilepicture();
  }, []);

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl">{heading || 'My Website'}</h1>
  
      <div className="flex space-x-4 items-center">
        {/* Navigation buttons */}
        <Link to="/club">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 focus:outline-none">
            Club Page
          </button>
        </Link>
        <Link to="/home">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 focus:outline-none">
            Dashboard
          </button>
        </Link>
        <Link to="/welcome">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 focus:outline-none">
            Welcome Page
          </button>
        </Link>
  
        {/* Login and Signup buttons */}
        {!isLoggedIn && (
          <>
            <Link to="/login">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 focus:outline-none">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 focus:outline-none">
                Signup
              </button>
            </Link>
          </>
        )}
  
        {/* Logout button */}
        {isLoggedIn && (
          <Link to="/">
            <button
              onClick={handleLogout}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 focus:outline-none"
            >
              Logout
            </button>
          </Link>
        )}
  
        {/* Avatar */}
        {isLoggedIn && (
          <Link to={`/profile/${JSON.parse(localStorage.getItem('user')).email}`} className="ml-4">
            <img
              src={avatarUrl}
              alt="User Avatar"
              className="w-10 h-10 rounded-full cursor-pointer"
            />
          </Link>
          // <div className="ml-4">
          //   <img                  
          //     src={avatarUrl}
          //     alt="User Avatar"
          //     className="w-10 h-10 rounded-full"
          //   />
          // </div>
        )}
      </div>
    </nav>
  );  
}

export default Navbar;


