import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = ({ email }) => {
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const email = JSON.parse(localStorage.getItem('user')).email;
        const prfl = await axios.post('http://localhost:3000/api/users/show-profile', { email });
        
        // Access the profile picture URL directly from `prfl.data`
        // console.log(prfl.data.profilePicture);
        
        const profileUrl = prfl.data.pfrl || "https://via.placeholder.com/40"; // Fallback to placeholder
        setProfilePicture(profileUrl);
    
        console.log(profileUrl);  // Check the URL in the console
      } catch (error) {
        console.log("Trouble fetching the profile picture", error); // Log the full error object for debugging
      }
    };

    fetchProfilePicture();
  }, [email]);

  if (!profilePicture) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <img
            src={profilePicture || 'https://via.placeholder.com/100'}
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-2 border-blue-500"
          />
        </div>

        {/* User Info */}
        {/* Add more user details here */}
      </div>
    </div>
  );
};

export default UserProfile;
