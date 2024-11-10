import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Modal from 'react-modal';
import io from "socket.io-client";
import axios from 'axios';

// Initialize socket connection inside a useEffect
let socket = io("http://localhost:3000");
// let socket;


function Club() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const name = user?.name;
  const email = user?.email;
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Fetch club members
  useEffect(() => {
    const fetchClub = async () => {
      try {
        console.log(id)
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
    const fetchMessages = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/msg/allmsg', {
                clubUniqueId: id
            });

            // Access data directly from response.data
            const data = response.data;
            console.log(data);

          setMessages((prevMessages) => [...prevMessages, data.msgs]);

            if (response.status === 200) {
                setMessages(data.msgs);  // Assuming 'msgs' holds the array of messages
            } else {
                console.error("Failed to fetch messages:", data.msg);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching messages:", error);
            setLoading(false);
        }
    };

    fetchMessages();
}, []); // Empty dependency array to load only on initial mount
 // Empty dependency array to load only on initial mount

  // Setup socket connection and event listeners
  const socketRef = useRef(null);

  useEffect(() => {
      if (!socketRef.current) {
          socketRef.current = io("http://localhost:3000");
      }
      socketRef.current.emit("join_room", id);
  
      const handleReceiveMessage = (data) => {
          setMessages((prevMessages) => [...prevMessages, data]);
      };
  
      socketRef.current.on("receive_message", handleReceiveMessage);
  
      return () => {
          socketRef.current.off("receive_message", handleReceiveMessage);
          socketRef.current.emit("leave_room", id);
      };
  }, [id]);

  // Send a message
  const sendMessage = async () => {
    if (newMessage) {
      const messageData = {
        room: id,
        text: newMessage,
        name: name,
      };
      try {
        await axios.post('http://localhost:3000/api/msg/sendmsg', {
          name: messageData.name,
          email,
          text: messageData.text,
          clubUniqueId: id,
        });
      } catch (error) {
        console.error("Failed to send message:", error);
      }
      socket.emit("send_message", messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
      setNewMessage('');
    }
  };

  // Leave group
  const leaveGroup = async () => {
    try {
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
              <div
              key={index}
              className={`mb-2 p-2 rounded-lg max-w-xs ${
                  message.name === name ? "bg-blue-100 ml-auto text-right" : "bg-gray-100 mr-auto text-left"
              }`}
          >
              <strong>{message.name === name ? "You" : message.name}: </strong>
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
