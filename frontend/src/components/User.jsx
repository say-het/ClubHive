import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'; // Import useParams from react-router-dom

const UserProfile = () => {
  const { id } = useParams();  // Get the email or ID from the URL
  const [profilePicture, setProfilePicture] = useState(null);
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileClubs, setProfileClubs] = useState([]);
  const [profileInterests, setProfileInterests] = useState([]);
  const [profileUniName, setProfileUniName] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Always use the id (email) from the URL
        const userEmail = id; // This is now coming from the URL, not localStorage

        const response = await axios.post('http://localhost:3000/api/users/show-profile', { email: userEmail });

        const { profilePicture, name, clubs, interests, universityName } = response.data.data;

        setProfilePicture(profilePicture || 'https://via.placeholder.com/100'); // Fallback URL
        setProfileName(name || 'Unknown User');
        setProfileEmail(userEmail);
        setProfileClubs(clubs || []);
        setProfileInterests(interests || []);
        setProfileUniName(universityName || 'Unknown University');
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchProfileData();
  }, [id]); // Dependency on id to refetch when id changes

  if (!profilePicture) {
    return <div className="text-white text-center mt-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <img
            src={profilePicture}
            alt="User Avatar"
            className="w-24 h-24 rounded-full border-4 border-indigo-500 shadow-md"
          />
        </div>

        {/* User Info */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-indigo-300">{profileName}</h2>
          <p className="text-gray-300">{profileEmail}</p>
          <p className="text-gray-400 italic">{profileUniName}</p>
        </div>

        {/* Clubs Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-indigo-400">Clubs</h3>
          {profileClubs.length > 0 ? (
            <ul className="list-disc list-inside text-gray-300 mt-2">
              {profileClubs.map((club, index) => (
                <li key={index} className="hover:text-indigo-300 transition">{club}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No clubs listed</p>
          )}
        </div>

        {/* Interests Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-indigo-400">Interests</h3>
          {profileInterests.length > 0 ? (
            <ul className="list-disc list-inside text-gray-300 mt-2">
              {profileInterests.map((interest, index) => (
                <li key={index} className="hover:text-indigo-300 transition">{interest}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No interests listed</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
