import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Button, CircularProgress, Grid } from '@mui/material';
import { Carousel } from 'react-responsive-carousel'; // For Carousel (you'll need to install this package)
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Carousel CSS

const Club = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const name = user?.name;
  const email = user?.email;
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [eventImages, setEventImages] = useState([]);
  const [clubDescription,setClubDescription] = useState('');

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/clubs/getclubmembers/${id}`, { method: 'POST' });
        const data = await response.json();
        setMembers(data.members);
        setLoading(false);
        setClubDescription(data.clubDescription);
      } catch (error) {
        console.error("Error fetching club details:", error);
        setLoading(false);
      }
    };
    fetchClub();
  }, [id]);

  const handleChatEnter = () => {
    navigate(`/chat/${id}`);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageURLs = files.map(file => URL.createObjectURL(file));
    setEventImages(prevImages => [...prevImages, ...imageURLs]);
  };

  // Loading state
  if (loading) {
    return <div className="text-center mt-8"><CircularProgress /></div>;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <Card className="bg-green-600 text-white text-center p-4 rounded-md">
        <CardContent>
          <Typography variant="h3" fontWeight="bold">Club Dashboard</Typography>
          <Typography variant="h5">Welcome to your club's space, {name}!</Typography>
        </CardContent>
      </Card>

      {/* Main Content Layout */}
      <Grid container spacing={4} className="mt-8">
        {/* Left Section: About the Club and Club Committee Contacts */}
        <Grid item xs={12} lg={4}>
          <Card className="bg-white border border-gray-300 p-4 rounded-lg shadow-md">
            <CardContent>
              <Typography variant="h6" gutterBottom>About the Club</Typography>
              <Typography>{clubDescription}</Typography>
            </CardContent>
          </Card>

          {/* Club Committee Contacts Section */}
          <Card className="bg-white border border-gray-300 p-4 rounded-lg shadow-md mt-4">
            <CardContent>
              <Typography variant="h6" gutterBottom>Club Committee Contacts</Typography>
              <Typography>Details about the club committee contacts will go here. Include name, email, and roles.</Typography>
            </CardContent>
          </Card>

          {/* Member List Section */}
          <Card className="bg-white border border-gray-300 p-4 rounded-lg shadow-md mt-4">
            <CardContent>
              <Typography variant="h6" gutterBottom>Member List</Typography>
              {members.length > 0 ? (
                <ul className="list-disc list-inside space-y-2">
                  {members.map((member, index) => (
                    <li key={index}>
                      {member.name} - {member.email}
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography>No members found.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Middle Section: Banner of Events */}
        <Grid item xs={12} lg={8}>
          <Card className="w-full h-auto overflow-hidden rounded-lg bg-gray-200">
            <Carousel>
              {eventImages.map((image, index) => (
                <div key={index}>
                  <img src={image} alt={`event-banner-${index}`} />
                </div>
              ))}
            </Carousel>
          </Card>

          {/* Other Options Section */}
          <Card className="bg-white border border-gray-300 p-4 rounded-lg shadow-md mt-4">
            <CardContent>
              <Typography variant="h6" gutterBottom>Other Options</Typography>
              <Button variant="contained" color="primary" onClick={handleChatEnter}>
                Enter Chat Room
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Image Upload Section */}
      <Card className="bg-white border border-gray-300 p-4 rounded-lg shadow-md mt-8">
        <CardContent>
          <Typography variant="h6" gutterBottom>📸 Upload Event Banners</Typography>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="mb-4"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Club;
