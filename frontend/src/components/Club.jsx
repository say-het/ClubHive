import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { auth } from '../firebase'; // Assuming you are using Firebase for user authentication
import axios from 'axios'; // To make API calls
import Modal from 'react-modal';

function Club() {
  const [members, setMembers] = useState([]); // Default to empty array
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    //temp data for vis, 
    const mockMembers = [
      { id: 1, name: 'Member 1' },
      { id: 2, name: 'Member 2' },
      { id: 3, name: 'Member 3' }
    ];

    const mockMessages = [
      { id: 1, text: 'Welcome to the group!', sender: 'Member 1' },
      { id: 2, text: 'Hi everyone!', sender: 'Member 2' },
      { id: 3, text: 'Hello!', sender: 'Member 3' }
    ];

    // Set mock data into state
    setMembers(mockMembers);
    setMessages(mockMessages);

    // Normally, you would fetch data here (like from a real API)
  }, []);

  const sendMessage = () => {
    if (newMessage) {
      setMessages([...messages, { id: messages.length + 1, text: newMessage, sender: 'You' }]);
      setNewMessage('');
    }
  };  

  // ACTUAL FETCHING ::::
  // useEffect(() => {
  //   // Fetch user info from localStorage or database
  //   const fetchUser = async () => {
  //     const currentUser = JSON.parse(localStorage.getItem("user"));
  //     setUser(currentUser);

  //     // Fetch members and messages from your MongoDB (replace with actual endpoints)
  //     try {
  //       const membersResponse = await axios.get('/api/group/members');
  //       const messagesResponse = await axios.get('/api/group/messages');

  //       // Log the response to ensure it’s an array
  //       console.log("Members Response:", membersResponse.data);
  //       console.log("Messages Response:", messagesResponse.data);

  //       // Ensure we have an array of members before setting the state
  //       if (Array.isArray(membersResponse.data)) {
  //         setMembers(membersResponse.data);
  //       } else {
  //         setMembers([]); // Set an empty array if not in expected format
  //       }

  //       setMessages(messagesResponse.data || []); // Set messages or empty array
  //     } catch (error) {
  //       console.error("Error fetching group data", error);
  //       setMembers([]); // In case of error, make sure it's an empty array
  //       setMessages([]); // Make sure messages is empty if fetching fails
  //     }
  //   };

  //   fetchUser();
  // }, []);

  // const sendMessage = async () => {
  //   if (newMessage) {
  //     try {
  //       const response = await axios.post(`/api/group/messages`, {
  //         text: newMessage,
  //         sender: user.name, // Use user data for sender
  //       });
  //       setMessages([...messages, response.data]);
  //       setNewMessage('');
  //     } catch (error) {
  //       console.error("Error sending message", error);
  //     }
  //   }
  // };

  const leaveGroup = async () => {
    try {
      await axios.post(`/api/group/leave`, { userId: user.id });
      // Update UI after the group is left (could redirect the user)
      alert("You have left the group.");
      setIsModalOpen(false); // Close the modal
    } catch (error) {
      console.error("Error leaving group", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gray-100">
        {/* Left side - Members list */}
        <div className="w-1/3 p-4 bg-white border-r border-gray-200">
          <h2 className="text-xl font-bold mb-4">Members</h2>
          <ul className="space-y-2">
            {Array.isArray(members) && members.length > 0 ? (
              members.map((member) => (
                <li key={member.id} className="p-2 bg-blue-100 rounded-lg">
                  {member.name}
                </li>
              ))
            ) : (
              <li>No members found.</li> // Display a message if no members
            )}
          </ul>
          {/* Settings button to open modal */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
          >
            Settings
          </button>
        </div>

        {/* Right side - Chat box */}
        <div className="w-2/3 p-4 bg-white">
          <h2 className="text-xl font-bold mb-4">Group Chat</h2>
          <div className="flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-2 border border-gray-200 rounded-lg mb-4">
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
                className="flex-1 p-2 border border-gray-300 rounded-lg"
              />
              <button
                onClick={sendMessage}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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
        className="mt-4 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
      >
        <Link to='/home'>
          Leave Group
        </Link>
      </button>
      <button
        onClick={() => setIsModalOpen(false)}
        className="mt-4 ml-2 p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none"
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
