import React, { useState } from 'react';
import Navbar from './Navbar';

function Home() {
  // State to manage the clubs
  const [clubs, setClubs] = useState([
    { id: 1, name: 'Club 1' },
    { id: 2, name: 'Club 2' },
    { id: 3, name: 'Club 3' },
    { id: 4, name: 'Inter college club 1' }
  ]);
  const [newClubName, setNewClubName] = useState('');  // To store new club name

  // Function to handle adding a new club
  const addClub = () => {
    if (newClubName) {
      const newClub = {
        id: clubs.length + 1,
        name: newClubName
      };
      setClubs([...clubs, newClub]);
      setNewClubName(''); // Clear input field after adding
    }
  };

  // Function to handle removing a club
  const removeClub = (id) => {
    setClubs(clubs.filter(club => club.id !== id));
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen bg-blue-50">
        <div className="flex flex-1">
          {/* Main Content */}
          <div className="flex-1 p-6 bg-white rounded-lg shadow-lg">
            {/* Inner Frame for Main Content */}
            <div className="relative h-full p-6 border-4 border-blue-500 rounded-lg flex flex-wrap justify-between items-start">
              {/* Dynamically display the clubs */}
              {clubs.map((club) => (
                <div
                  key={club.id}
                  className="w-1/3 h-1/4 bg-blue-100 rounded-lg shadow-md flex items-center justify-between p-4 my-4"
                >
                  <span>{club.name}</span>
                  {/* Button to remove the club */}
                  <button
                    onClick={() => removeClub(club.id)}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* Right Sidebar Panel */}
          <div className="w-1/5 bg-blue-200 p-6 border-l-4 border-blue-500 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold text-blue-700 mb-4">Sidebar</h2>
            <p className="text-blue-600 mb-4">- Register Club</p>
            
            {/* Input field for creating new club */}
            <input
              type="text"
              placeholder="New Club Name"
              value={newClubName}
              onChange={(e) => setNewClubName(e.target.value)}
              className="p-2 mb-4 border-2 border-blue-300 rounded-lg w-full"
            />
            
            {/* Button to create club */}
            <button
              onClick={addClub}
              className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
            >
              Create Club
            </button>
            
            <p className="text-blue-600 mt-4">- Check Existing Clubs</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
