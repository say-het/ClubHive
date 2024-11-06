import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';

function Navbar() {
  const [heading, setHeading] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
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
      } catch (e) {
        console.error("Error logging out:", e);

      }
    };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl">{heading || 'My Website'}</h1>
      
      <Link to={isLoggedIn ? "/" : "/login"}>
        <button 
          onClick={isLoggedIn ? handleLogout : null}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 focus:outline-none"
        >
          {isLoggedIn ? "Logout" : "Login"}
        </button>
      </Link>
    </nav>
  );
}

export default Navbar;
