import React, { useState, useEffect } from 'react';
import { useNavigate, useParams ,Link} from 'react-router-dom';
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
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [profileMember, setProfileMember] = useState(null); // Changed state name here
  // const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [image, setImage] = useState("");
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]); // To store multiple uploaded URLs
  const [banners, setBanners] = useState([]);

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
        const response2 = await fetch(`http://localhost:3000/api/clubs/fetchBanners/${id}`, { method: 'POST' });
        const data2 = await response2.json();  // Parse the response JSON
    
        if (response2.ok) {
          console.log(data2);
          setBanners(Array.isArray(data2.banners) ? data2.banners : [data2.banners]);
          console.log(banners);
        } else {
          console.log("Failed to fetch the banners");
        }
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
  const handleOpenRemoveAdminDialog = (email) => {
    setAdminToRemove(email);
    setOpenRemoveAdminDialog(true);
  };
  const handleOpenProfile = (member) => {
    setProfileMember(member); // Changed variable name here
    setOpenProfileDialog(true);
  };

  const handleCloseProfile = () => {
    setOpenProfileDialog(false);
    setProfileMember(null); // Changed variable name here
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
const addBanner = async (clubUniqueName, bannerUrl) => {
  try {
    const response = await fetch('http://localhost:3000/api/clubs/addBanner', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clubUniqueName, // Sending the club's unique name
        bannerUrl,      // Sending the banner URL
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('Banner added successfully!', data.clubBanners); // Updated list of banners
    } else {
      console.error('Error adding banner:', data.message);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
};
const submitImage = async () => {
  if (!image) {
    console.log("No image selected");
    return;
  }

  // Fetch signature and timestamp from the backend
  const response = await fetch("http://localhost:3000/upload-signature");
  const { timestamp, signature, apikey } = await response.json();

  // Prepare the FormData for the image upload request
  const data = new FormData();
  data.append("file", image); // The selected image file
  data.append("upload_preset", "Clubhive"); // Your signed preset name (e.g., "Clubhive")
  data.append("cloud_name", "dhizeooup"); // Your Cloudinary cloud name
  data.append("timestamp", timestamp); // Timestamp from backend
  data.append("signature", signature); // Signature from backend
  data.append("api_key", apikey); // Your Cloudinary API key

  // Upload the image to Cloudinary
  fetch("https://api.cloudinary.com/v1_1/dhizeooup/image/upload", {
    method: "POST",
    body: data,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.secure_url) {
        console.log("Upload successful:", data.secure_url);
        addBanner(id,data.secure_url)
        setUploadedImageUrls([...uploadedImageUrls, data.secure_url]); // Add the new image URL to state
      } else {
        console.log("Error in upload response:", data);
      }
    })
    .catch((err) => {
      console.log("Upload Error:", err);
    });
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
      <Card sx={{ bgcolor: 'white', color: 'black', textAlign: 'center', mb: 4 }}>
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
                {member.name} - {member.email} {member.position && `(${member.position})`}
                <Button
                  // variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => handleOpenProfile(member)}
                  style={{ marginLeft: '10px' }}
                >
                  View Profile
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <Typography>No members found.</Typography>
        )}
      </CardContent>

      {/* Profile Dialog */}
      {profileMember && ( // Changed variable name here
        <Dialog open={openProfileDialog} onClose={handleCloseProfile}>
          <DialogTitle>Profile of {profileMember.name}</DialogTitle> {/* Changed variable name here */}
          <DialogContent>
            <Typography variant="body1"><strong>Email:</strong> {profileMember.email}</Typography> {/* Changed variable name here */}
            <Typography variant="body1"><strong>Position:</strong> {profileMember.position || 'N/A'}</Typography> {/* Changed variable name here */}
            <Typography variant="body1"><strong>Additional Info:</strong> {profileMember.additionalInfo || 'N/A'}</Typography> {/* Changed variable name here */}
            <Link to={`/profile/${profileMember.email}`} className="ml-4">
              View more
            </Link>


            {/* Add more profile details as needed */}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseProfile} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
        </Card>

        </Grid>

        {/* Middle Section: Banner of Events */}
        <Grid item xs={12} lg={8}>
          {/* Event Banner Carousel */}
          <Card sx={{ mb: 4 }}>
          <Carousel>            
            {banners.length > 0 ? (
              banners.map((bannerUrl, index) => (
                <div key={index}>
                  <img src={bannerUrl} alt={`event-banner-${index}`} />
                </div>
              ))
            ) : (
              <Typography>No banners found.</Typography>
            )}
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
      {(isSupremeAdmin || admins.includes(email)) && (
      <Card sx={{ mt: 4 }}>
        <CardContent>
        <div>
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button onClick={submitImage}>Upload Photo</button>
      </div>
        </CardContent>
      </Card>
      )}
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
              width: 400,
              bgcolor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              boxShadow: 6,
              p: 3,
            }}
          >
            <Typography variant="h6" gutterBottom align="center">
              Manage Club
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Supreme Admin: <strong>{supremeAdmin}</strong>
            </Typography>
            <Typography variant="body1" color="textSecondary" mb={2}>
              Admins: {admins.join(', ')}
            </Typography>
            <FormControl fullWidth>
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
            <Box mt={3} display="flex" justifyContent="space-between">
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenDialog('admin')}
              >
                Promote to Admin
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleOpenDialog('supremeAdmin')}
              >
                Promote to Supreme Admin
              </Button>
            </Box>
            <Box mt={2} display="flex" justifyContent="space-between">
              <Button
                variant="contained"
                onClick={handleModalClose}
                fullWidth
                sx={{ mr: 1 }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleOpenRemoveAdminDialog(selectedMember)}
                fullWidth
                sx={{ ml: 1 }}
              >
                Remove Admin
              </Button>
            </Box>

            <Dialog
              open={openRemoveAdminDialog}
              onClose={() => setOpenRemoveAdminDialog(false)}
            >
              <DialogTitle>Confirm Removal</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to remove {selectedMember} as an admin?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setOpenRemoveAdminDialog(false)}
                  color="primary"
                >
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
