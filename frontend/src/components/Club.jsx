import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Club = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const name = user?.name;
  const email = user?.email;
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const messageContainerRef = useRef(null);

  // Scroll to the latest message in chat
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, []);

  // Fetch club members
  useEffect(() => {
    const fetchClub = async () => {
      try {
        console.log(id);
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

  // Sample data for announcements and chat
  const [announcements] = useState([
    { id: 1, message: "Welcome to the new semester!" },
    { id: 2, message: "Club meeting this Friday at 6 PM." },
    { id: 3, message: "Don't forget to join the annual hackathon!" },
  ]);

  const handleChatEnter = () => {
    // Navigate to chat page
    navigate(`/chat/${id}`);
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <header className="bg-green-600 text-white text-center p-4 rounded-md">
        <h1 className="text-3xl font-bold">Club Dashboard</h1>
        <p className="text-lg">Welcome to your club's space, {name}!</p>
      </header>

      {/* Main Content */}
      <div className="flex justify-around mt-8 space-x-4">
        {/* Announcements Section */}
        <div className="w-1/3 bg-white border border-gray-300 p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">📢 Announcements</h2>
          <ul className="list-disc list-inside space-y-2">
            {announcements.map((announcement) => (
              <li key={announcement.id}>{announcement.message}</li>
            ))}
          </ul>
        </div>

        {/* Chat Panel */}
        <div className="w-1/3 bg-white border border-gray-300 p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">💬 Chat</h2>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            onClick={handleChatEnter}
          >
            Enter Chat Room
          </button>
        </div>

        {/* Members Section */}
        <div className="w-1/3 bg-white border border-gray-300 p-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">👥 Members</h2>
          {members.length > 0 ? (
            <ul className="list-disc list-inside space-y-2">
              {members.map((member, index) => (
                <li key={index}>
                  {member.name} - {member.email}
                </li>
              ))}
            </ul>
          ) : (
            <p>No members found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Club;
