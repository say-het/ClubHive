import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Modal from 'react-modal';
import io from "socket.io-client";
import axios from 'axios';

const socket = io("http://localhost:3000"); // Initialize the socket connection only once

function Club() {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const name = JSON.parse(localStorage.getItem('user')).name;

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/clubs/getclubmembers/${id}`, { method: 'POST' });
        const data = await response.json();
        setMembers(data.members);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching club details:", error);
        setLoading(false);
      }
    };
    fetchClub();
  }, [id]);

  useEffect(() => {
    // Join room when component mounts
    socket.emit("join_room", id);

    // Listen for incoming messages
    socket.on("receive_message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Cleanup socket connection and listeners on component unmount
    return () => {
      socket.off("receive_message"); // Remove specific listener
      socket.emit("leave_room", id); // Optional: leave room on unmount
    };
  }, [id]);

const sendMessage = () => {
  const name = JSON.parse(localStorage.getItem('user')).name;
  if (newMessage) {
    const messageData = {
      room: id,
      message: newMessage,
      username: name,
    };
    socket.emit("send_message", messageData);
    
    // Update local message state using the functional form of setMessages
    setMessages((prevMessages) => [...prevMessages, messageData]);
    setNewMessage('');
  }
};

  const leaveGroup = async () => {
    try {
      const email = JSON.parse(localStorage.getItem('user')).email;
      const name = JSON.parse(localStorage.getItem('user')).name;

      await axios.post(`http://localhost:3000/api/clubs/leave`, {
        name,
        email,
        clubname: id,
      });

      alert("You have left the group.");
      setIsModalOpen(false);
      navigate('/home');
      setMembers((members) => members.filter((member) => member.name !== name));
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
              members.map((member) => (
                <li key={member.email} className={`p-2 ${darkMode ? 'bg-gray-700' : 'bg-blue-100'} rounded-lg`}>
                  {member.name}
                </li>
              ))
            ) : (
              <li>No members found.</li>
            )}
          </ul>
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
              {messages.map((message, index) => (
                <div key={index} className="mb-2">
                  <strong>{message.username==name?"You":message.username}: </strong>
                  <span>{message.message}</span>
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
              Leave Group
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
