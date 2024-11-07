import React, { useState } from 'react';
import Navbar from './Navbar';

function Home() {
  const [availableGroups, setAvailableGroups] = useState([
    { id: 1, name: 'Club 1' },
    { id: 2, name: 'Club 2' },
    { id: 3, name: 'Club 3' },
    { id: 4, name: 'Inter college club 1' }
  ]);
  const [userGroups, setUserGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupUserName, setNewGroupUserName] = useState('');
  const [isAvailableGroupsModalOpen, setIsAvailableGroupsModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [UniversityName,setUniversityName] = useState('');
  const addGroup = async () => {
    console.log("first")
    if (newGroupName) {
      const newGroup = {
        id: availableGroups.length + 1,
        name: newGroupName
      };
      setAvailableGroups([...availableGroups, newGroup]);
      setNewGroupName('');
      setIsCreateGroupModalOpen(false); // Close the modal after adding
    }
    const clubData = {
      newGroupUserName,
      newGroupName,
      UniversityName
    }
    console.log(clubData)
    const response = await fetch("http://localhost:3000/api/clubs/addclub",{
      method:"POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clubData),
    })
    console.log(response)
  };

  const joinGroup = (group) => {
    setUserGroups([...userGroups, group]);
  };

  const filteredGroups = availableGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen bg-blue-50">
        <div className="flex flex-1">
          {/* Main Content */}
          <div className="flex-1 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">My Groups</h2>
            <div className="relative h-full p-7 border-4 border-blue-500 rounded-lg flex flex-wrap justify-between items-start">
              {userGroups.length === 0 ? (
                <p className="text-gray-500">You haven't joined any groups yet.</p>
              ) : (
                userGroups.map((group) => (
                  <div key={group.id} className="w-1/3 h-1/4 bg-blue-100 rounded-lg shadow-md flex items-center justify-between p-4 my-4">
                    <span>{group.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Sidebar Panel */}
          <div className="w-1/5 bg-blue-200 p-6 border-l-4 border-blue-500 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold text-blue-700 mb-4">Sidebar</h2>
            
            <button onClick={() => setIsAvailableGroupsModalOpen(true)} className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 mb-4">
              See Available Clubs
            </button>
            
            <button onClick={() => setIsCreateGroupModalOpen(true)} className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
              Create Group
            </button>
          </div>
        </div>

        {/* Modal for Available Groups */}
        {isAvailableGroupsModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/5 max-w-lg">
              <h3 className="text-xl font-bold mb-4">Available Clubs</h3>
              <input
                type="text"
                placeholder="Search for a group"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg w-full mb-4"
              />
              <div className="max-h-60 overflow-y-auto">
                {filteredGroups.map((group) => (
                  <div key={group.id} className="flex justify-between items-center mb-2 p-2 border border-gray-200 rounded-lg">
                    <span>{group.name}</span>
                    <button
                      onClick={() => joinGroup(group)}
                      className="bg-blue-500 text-white p-1 rounded-lg hover:bg-blue-600"
                    >
                      Join
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={() => setIsAvailableGroupsModalOpen(false)} className="mt-4 w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-600">
                Close
              </button>
            </div>
          </div>
        )}

        {/* Modal for Creating a New Group */}
        {isCreateGroupModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/5 max-w-lg">
              <h3 className="text-xl font-bold mb-4">Create a New Club</h3>
              <input
                type="text"
                placeholder="New Unique Group Name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg w-full mb-4"
              />
              <input
                type="text"
                placeholder="New Group Name"
                value={newGroupName}
                onChange={(e) => setNewGroupUserName(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg w-full mb-4"
              />
              <input
                type="text"
                placeholder="University Name"
                value ={UniversityName}
                onChange={(e) => setUniversityName(e.target.value)}
                
                className="p-2 border border-gray-300 rounded-lg w-full mb-4"
              />
              <p>Inter college group?  
              : <input
                type= "checkbox"
              />
              </p>

              <button onClick={addGroup} className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
                Add Group   
              </button>
              <button onClick={() => setIsCreateGroupModalOpen(false)} className="mt-4 w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-600">
                Close 
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
