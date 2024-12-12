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
  const [openRemoveAdminDialog, setOpenRemoveAdminDialog] = useState(false); // State to control the remove admin dialog
  const [adminToRemove, setAdminToRemove] = useState(''); // To track the admin being removed
  const [selectedAction, setSelectedAction] = useState(null); // Track which action is selected

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
  const getAdmins = () =>{
    
  }
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
  const handleOpenRemoveAdminDialog = (email) => {
    setAdminToRemove(email);
    setOpenRemoveAdminDialog(true);
  };

  const handleConfirmPromotion = async () => {
    try {
      if (promotionType === 'supremeAdmin') {
        const response = await fetch('http://localhost:3000/api/clubs/transferSupremeAdmin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clubUniqueName: id, // Assuming `id` is the unique name of the club
            currentSupremeAdmin: supremeAdmin,
            newSupremeAdmin: selectedMember,
          }),
        });
  
        const data = await response.json();
        if (response.ok) {
          console.log(data.msg);
          setSupremeAdmin(selectedMember);
        } else {
          console.error(data.msg);
          alert(data.msg);
        }
      } else if (promotionType === 'admin') {
        const response = await fetch('http://localhost:3000/api/clubs/addAdmin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clubUniqueName: id, // The unique name of the club
            supremeAdminEmail: supremeAdmin, // Assuming `supremeAdmin` is the email of the current supreme admin
            newAdminEmail: selectedMember, // Email of the user to be promoted
          }),
        });
  
        const data = await response.json();
        if (response.ok) {
          console.log(data.msg);
          // You might want to update the UI or the state to reflect the new admin status
        } else {
          console.error(data.msg);
          alert(data.msg);
        }
      }
  
      setOpenDialog(false);
      setOpenModal(false);
  
    } catch (error) {
      console.error("Error promoting member:", error);
      alert("An error occurred while promoting the member.");
    }
  };
  const handleRemoveAdmin = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/clubs/removeAdmin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clubUniqueName: id, // Assuming `id` is the unique name of the club
        supremeAdminEmail: supremeAdmin, // The email of the current supreme admin
        adminToRemoveEmail: adminToRemove, // The email of the admin to be removed
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log(data.msg);
      // Optionally, update the UI or state to reflect the admin removal
      setAdmins((prevAdmins) => prevAdmins.filter(admin => admin !== adminToRemove));
    } else {
      console.error(data.msg);
      alert(data.msg);
    }

    setOpenRemoveAdminDialog(false);
  } catch (error) {
    console.error("Error removing admin:", error);
    alert("An error occurred while removing the admin.");
    setOpenRemoveAdminDialog(false);
  }
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
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 0 15px rgba(0,0,0,0.2)',
            },
          }}
        >
          <Typography variant="h6" align="center" gutterBottom>
            Manage Club
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Supreme Admin:</strong> {supremeAdmin}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Admins:</strong> {admins.join(', ')}
          </Typography>

          {/* Conditional rendering based on which button is clicked */}
          {selectedAction === 'admin' && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="select-member-label">Select Member</InputLabel>
              <Select
                labelId="select-member-label"
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                sx={{
                  '& .MuiSelect-root': {
                    backgroundColor: '#f5f5f5',
                    borderRadius: 1,
                  },
                }}
              >
                {members.map((member, index) => (
                  <MenuItem key={index} value={member.email}>
                    {member.name} - {member.email}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {selectedAction === 'adminActions' && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="select-admin-label">Select Admin</InputLabel>
              <Select
                labelId="select-admin-label"
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                sx={{
                  '& .MuiSelect-root': {
                    backgroundColor: '#f5f5f5',
                    borderRadius: 1,
                  },
                }}
              >
                {admins.map((admin, index) => (
                  <MenuItem key={index} value={admin}>
                    {admin}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setSelectedAction('admin');
              }}
              sx={{
                textTransform: 'none',
                padding: '10px 20px',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: '#1976d2',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                },
              }}
            >
              Promote to Admin
            </Button>

            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                setSelectedAction('adminActions');
              }}
              sx={{
                textTransform: 'none',
                padding: '10px 20px',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: '#d32f2f',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                },
              }}
            >
              Promote to Supreme Admin
            </Button>

            <Button
              variant="outlined"
              onClick={handleModalClose}
              sx={{
                textTransform: 'none',
                padding: '10px 20px',
                borderRadius: 2,
                borderColor: '#1976d2',
                color: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1976d2',
                  color: '#fff',
                  borderColor: '#1976d2',
                },
              }}
            >
              Close
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                setSelectedAction('adminActions');
              }}
              sx={{
                textTransform: 'none',
                padding: '10px 20px',
                borderRadius: 2,
                borderColor: '#d32f2f',
                color: '#d32f2f',
                '&:hover': {
                  backgroundColor: '#d32f2f',
                  color: '#fff',
                  borderColor: '#d32f2f',
                },
              }}
            >
              Remove Admin
            </Button>
          </Box>

          {/* Confirmation Dialog for Removing Admin */}
          <Dialog open={openRemoveAdminDialog} onClose={() => setOpenRemoveAdminDialog(false)}>
            <DialogTitle>Confirm Removal</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to remove {selectedMember} as an admin?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenRemoveAdminDialog(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={handleRemoveAdmin} color="secondary">
                Confirm
              </Button>
            </DialogActions>
          </Dialog>
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
