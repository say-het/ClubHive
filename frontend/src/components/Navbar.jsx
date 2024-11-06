import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl">My Website</h1>
      
      {/* Login button that navigates to the login page */}
      <Link to="/login">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 focus:outline-none">
          Login
        </button>
      </Link>
    </nav>
  );
}

export default Navbar;
