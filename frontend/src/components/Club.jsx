import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import { auth } from '../firebase'; // Assuming you are using Firebase for user authentication
import axios from 'axios'; // To make API calls
import Modal from 'react-modal';

function Club() {
  const { id } = useParams(); // useParams should be called directly at the top level
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]); // Default to empty array
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Added dark mode state

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/clubs/getclubmembers/${id}`,{ method: 'POST' });
        const data = await response.json();
        // setClub(data); // Assuming you want to set the entire club object
        // console.log(typeof data.members)
        setMembers(data.members);
        // console.log()
        console.log(data.members)
        setLoading(false);
      } catch (error) {
        console.error("Error fetching club details:", error);
        setLoading(false);
      }
    };
    fetchClub();
  }, [id]);

  const sendMessage = () => {
    if (newMessage) {
      setMessages([...messages, { id: messages.length + 1, text: newMessage, sender: 'You' }]);
      setNewMessage('');
    }
  };  

  const leaveGroup = async () => {
    try {
      await axios.post(`/api/group/leave`, { userId: user.id });
      alert("You have left the group.");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error leaving group", error);
    }
  };

  return (
    <>
      <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
        {/* Left side - Members list */}
        <div className={`w-1/3 p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-r border-gray-200`}>
          <h2 className="text-xl font-bold mb-4">Members</h2>
          <ul className="space-y-2">
            {members.length > 0 ? (
              members.map((member) => 
              {
                // console.log(member.name)
                // member = JSON.parse(member)
                return (
                  <li  className={`p-2 ${darkMode ? 'bg-gray-700' : 'bg-blue-100'} rounded-lg`}>
                  {member.name}
                </li>
                )
              }
              )
            ) : (
              <li>No members found.</li>
            )}
          </ul>
          {/* Settings button to open modal */}
          <button
            onClick={() => setIsModalOpen(true)}
            className={`mt-4 p-2 ${darkMode ? 'bg-red-600' : 'bg-red-500'} text-white rounded-lg hover:bg-red-600 focus:outline-none`}
          >
            Settings
          </button>
        </div>

        {/* Right side - Chat box */}
        <div className={`w-2/3 p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-xl font-bold mb-4">Group Chat</h2>
          <div className="flex flex-col h-full">
            {/* Messages */}
            <div className={`flex-1 overflow-y-auto p-2 border ${darkMode ? 'border-gray-600' : 'border-gray-200'} rounded-lg mb-4`}>
              {messages.map((message) => (
                <div key={message.id} className="mb-2">
                  <strong>{message.sender}: </strong>
                  <span>{message.text}</span>
                </div>
              ))}
            </div>

            {/* Input for new message */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className={`flex-1 p-2 border ${darkMode ? 'text-black border-gray-600' : 'border-gray-300'} rounded-lg`}
              />
              <button
                onClick={sendMessage}
                className={`p-2 ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white rounded-lg hover:bg-blue-600`}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for settings */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Settings Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full shadow-xl">
            <h2 className="text-xl font-bold">Settings</h2>
            <button
              onClick={leaveGroup}
              className={`mt-4 p-2 ${darkMode ? 'bg-red-600' : 'bg-red-500'} text-white rounded-lg hover:bg-red-600 focus:outline-none`}
            >
              <Link to='/home'>
                Leave Group
              </Link>
            </button>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`mt-4 ml p-2 ${darkMode ? 'bg-yellow-500' : 'bg-gray-700'} text-white rounded-lg`}
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className={`mt-4 ml-2 p-2 ${darkMode ? 'bg-gray-600' : ' bg-gray-500'} text-white rounded-lg hover:bg-gray-600 focus:outline-none`}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default Club;
