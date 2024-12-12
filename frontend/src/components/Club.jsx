import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, Typography, Button, CircularProgress, Grid, Box } from '@mui/material';
import { Carousel } from 'react-responsive-carousel'; // For Carousel
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
  const [clubDescription, setClubDescription] = useState('');

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/clubs/getclubmembers/${id}`, { method: 'POST' });
        const data = await response.json();
        setMembers(data.members);
        setClubDescription(data.clubDescription);
        setLoading(false);
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Card sx={{ bgcolor: 'success.main', color: 'white', textAlign: 'center', mb: 4 }}>
        <CardContent>
          <Typography variant="h3" fontWeight="bold">
            Club Dashboard
          </Typography>
          <Typography variant="h5">
            Welcome to your club's space, {name}!
          </Typography>
        </CardContent>
      </Card>

      {/* Main Content Layout */}
      <Grid container spacing={4}>
        {/* Left Section: About the Club and Club Committee Contacts */}
        <Grid item xs={12} lg={4}>
          {/* About the Club */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                About the Club
              </Typography>
              <Typography>
                {clubDescription}
              </Typography>
            </CardContent>
          </Card>

          {/* Club Committee Contacts Section */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Club Committee Contacts
              </Typography>
              <Typography>
                Details about the club committee contacts will go here. Include name, email, and roles.
              </Typography>
            </CardContent>
          </Card>

          {/* Member List Section */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Member List
              </Typography>
              {members.length > 0 ? (
                <ul>
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
          {/* Event Banner Carousel */}
          <Card sx={{ mb: 4 }}>
            <Carousel>
              {eventImages.map((image, index) => (
                <div key={index}>
                  <img src={image} alt={`event-banner-${index}`} />
                </div>
              ))}
            </Carousel>
          </Card>

          {/* Other Options Section */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Other Options
              </Typography>
              <Button variant="contained" color="primary" onClick={handleChatEnter}>
                Enter Chat Room
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Image Upload Section */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📸 Upload Event Banners
          </Typography>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default Club;
