import React from 'react';
import { Link } from 'react-router-dom'; 

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl">My Website</h1>
      
      <div className="space-x-4">
        {/* Navigation Links */}
        <Link to="/club">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 focus:outline-none">
            club Page
          </button>
        </Link>
        <Link to="/welcome">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 focus:outline-none">
            Welcome Page
          </button>
        </Link>
        <Link to="/login">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 focus:outline-none">
            Login
          </button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
