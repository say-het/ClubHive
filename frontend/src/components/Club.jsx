import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Club() {
  // Sample data for members and messages
  const [members, setMembers] = useState([
    { id: 1, name: 'Member 1' },
    { id: 2, name: 'Member 2' },
    { id: 3, name: 'Member 3' }
  ]);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Welcome to the group!', sender: 'Member 1' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Function to handle sending a new message
  const sendMessage = () => {
    if (newMessage) {
      setMessages([...messages, { id: messages.length + 1, text: newMessage, sender: 'You' }]);
      setNewMessage('');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left side - Members list */}
      <div className="w-1/3 p-4 bg-white border-r border-gray-200">
        <h2 className="text-xl font-bold mb-4">Members</h2>
        <ul className="space-y-2">
          {members.map((member) => (
            <li key={member.id} className="p-2 bg-blue-100 rounded-lg">
              {member.name}
            </li>
          ))}
        </ul>
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
  );
}

export default Club;
