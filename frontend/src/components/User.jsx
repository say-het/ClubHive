import React from 'react';
import { Link } from 'react-router-dom';
const UserProfile = ({ user }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <img
            // src={user.avatar || 'https://via.placeholder.com/100'}
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-2 border-blue-500"
          />
        </div>

        {/* User Info */}
        {/* <h2 className="text-2xl font-semibold text-center mb-4">{user.name}</h2> */}
        <h2 className="text-2xl font-semibold text-center mb-4">Users name</h2>

        <div className="text-gray-700 text-center">
         <p className="mb-2"><strong>University:</strong>Users University</p>
         <p className="mb-2"><strong>Email:</strong>Users Email</p> 

          {/* <p className="mb-2"><strong>University:</strong> {user.university || 'Not provided'}</p>
          <p className="mb-2"><strong>Email:</strong> {user.email || 'Not provided'}</p> */}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-around">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 focus:outline-none">
            Edit Profile
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 focus:outline-none">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
