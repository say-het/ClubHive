import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Grid, Card, CardContent, Typography, Button, CircularProgress, Modal, Fade, Backdrop, MenuItem, Select, FormControl, InputLabel, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
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
  const [openModal, setOpenModal] = useState(false); // Modal state
  const [supremeAdmin, setSupremeAdmin] = useState('');
  const [admins, setAdmins] = useState([]);
  const [selectedMember, setSelectedMember] = useState(''); // Selected member for action
  const [openDialog, setOpenDialog] = useState(false); // Confirmation dialog state
  const [promotionType, setPromotionType] = useState(''); // Track promotion type

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/clubs/getclubmembers/${id}`, { method: 'POST' });
        const data = await response.json();
        setMembers(data.members);
        setClubDescription(data.clubDescription);
        setSupremeAdmin(data.supremeAdmin);
        setAdmins(data.admins);
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

  const isSupremeAdmin = email === supremeAdmin;  // Check if the current user is the supreme admin

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageURLs = files.map(file => URL.createObjectURL(file));
    setEventImages(prevImages => [...prevImages, ...imageURLs]);
  };

  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleMemberSelect = (e) => {
    setSelectedMember(e.target.value);
  };

  const handleOpenDialog = (type) => {
    setPromotionType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmPromotion = () => {
    if (promotionType === 'admin') {
      console.log(`${selectedMember} promoted to Admin.`);
      // Add backend logic to promote member to Admin
    } else if (promotionType === 'supremeAdmin') {
      console.log(`${selectedMember} promoted to Supreme Admin.`);
      // Add backend logic to promote member to Supreme Admin
    }
    setOpenDialog(false);
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

      {isSupremeAdmin && (
        <Button variant="contained" color="secondary" onClick={handleModalOpen}>
          Manage Club
        </Button>
      )}

      <Modal
        open={openModal}
        onClose={handleModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}>
            <Typography variant="h6" gutterBottom>
              Manage Club
            </Typography>
            <Typography variant="body1">
              Supreme Admin: {supremeAdmin}
            </Typography>
            <Typography variant="body1">
              Admins: {admins.join(', ')}
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="select-member-label">Select Member</InputLabel>
              <Select
                labelId="select-member-label"
                value={selectedMember}
                onChange={handleMemberSelect}
              >
                {members.map((member, index) => (
                  <MenuItem key={index} value={member.email}>
                    {member.name} - {member.email}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => handleOpenDialog('admin')}
            >
              Promote to Admin
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{ mt: 2, ml: 2 }}
              onClick={() => handleOpenDialog('supremeAdmin')}
            >
              Promote to Supreme Admin
            </Button>
            <Button variant="contained" sx={{ mt: 2 }} onClick={handleModalClose}>
              Close
            </Button>
          </Box>
        </Fade>
      </Modal>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Confirm Promotion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to promote {selectedMember} to {promotionType === 'admin' ? 'Admin' : 'Supreme Admin'}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmPromotion} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Club;
