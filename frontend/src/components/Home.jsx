import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Grid, Paper, IconButton, Modal, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';

function Home() {
  const [availableGroups, setAvailableGroups] = useState([
    { id: 1, name: 'Club 1' },
    { id: 2, name: 'Club 2' },
    { id: 3, name: 'Club 3' },
    { id: 4, name: 'Inter college club 1' },
  ]);
  const [userGroups, setUserGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupUserName, setNewGroupUserName] = useState('');
  const [newGroupDescription, setNewGroupDescription] = useState('');
  const [universityName, setUniversityName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [allGroups, setAllGroups] = useState([]);
  const [isAvailableGroupsModalOpen, setIsAvailableGroupsModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [committeeMembers, setCommitteeMembers] = useState([{ name: '', role: '', contact: '' }]);
  const [newGroupType, setNewGroupType] = useState('Public');
  const addCommitteeMember = () => {
    setCommitteeMembers([...committeeMembers, { name: '', role: '', contact: '' }]);
  };

  const removeCommitteeMember = (index) => {
    const updatedMembers = [...committeeMembers];
    updatedMembers.splice(index, 1);
    setCommitteeMembers(updatedMembers);
  };

  const updateCommitteeMember = (index, field, value) => {
    const updatedMembers = [...committeeMembers];
    updatedMembers[index][field] = value;
    setCommitteeMembers(updatedMembers);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkTheme(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkTheme((prev) => {
      const newTheme = !prev;
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      return newTheme;
    });
  };

  const fetchAllGroups = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/clubs/allclubs');
      const data = await response.json();
      setAllGroups(data);
    } catch (error) {
      console.log(error);
    }
  };

  const findUserClubs = async () => {
    const email = JSON.parse(localStorage.getItem('user')).email;
    const response = await fetch('http://localhost:3000/api/clubs/userclubs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      const data = await response.json();
      setUserGroups([...data.clubs]);
    } else {
      console.error('Error:', response.statusText);
    }
  };

  useEffect(() => {
    findUserClubs();
  }, []);

  const addGroup = async () => {
    if (newGroupName) {
      const email = JSON.parse(localStorage.getItem('user')).email;
      const clubData = {
        newGroupUserName,
        newGroupName,
        newGroupType,
        newGroupDescription,
        universityName,
        email,
      };
  
      try {
        // First, create the club
        const response = await fetch('http://localhost:3000/api/clubs/addclub', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(clubData),
        });
  
        if (!response.ok) {
          throw new Error('Failed to add group');
        }
  
        // Call the addclubtouni route after the club is created successfully
        const clubResponse = await fetch('http://localhost:3000/api/university/addclubtouni', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            universityName,
            clubName: newGroupName, // Pass the club name to add to the university's club list
          }),
        });
  
        if (!clubResponse.ok) {
          throw new Error('Failed to add club to university');
        }
  
        location.reload(); // Reload the page after both operations
      } catch (error) {
        console.error(error.message);
      }
    }
  };
  

  const joinGroup = async (group) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) throw new Error('User not found in local storage');
      const { email, name } = user;
  
      // Check if the user is already part of the group
      const isAlreadyJoined = userGroups.some((userGroup) => userGroup.clubUniqueName === group.clubUniqueName);
      if (isAlreadyJoined) {
        alert('You are already a member of this group')
        console.log('You are already a member of this group');
        return; // Prevent joining if already a member
      }
  
      // If not already joined, send the request to join the group
      const response = await fetch('http://localhost:3000/api/clubs/joinsomething', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clubUniqueName: group.clubUniqueName, email, name }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to join club');
      }
  
      const result = await response.json();
      // Update the userGroups state with the new group
      setUserGroups([...userGroups, result]);  // Add the new group to the existing groups
      location.reload();  // Reload to reflect the changes
    } catch (error) {
      console.log('Error joining group:', error);
    }
  };
  

  const seeAllClubs = async () => {
    setIsAvailableGroupsModalOpen(true);
    await fetchAllGroups();
  };

  const darkTheme = createTheme({
    palette: {
      mode: isDarkTheme ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ flexGrow: 1, p: 3, minHeight: '100vh', bgcolor: isDarkTheme ? 'background.default' : 'primary.main' }}>
        <Grid container spacing={2}>
          {/* Left Sidebar */}
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
              <Typography variant="h4" gutterBottom>
                My Groups
              </Typography>
              <Grid container spacing={2}>
                {userGroups.length === 0 ? (
                  <Typography variant="body1" color="text.secondary">
                    You haven't joined any groups yet.
                  </Typography>
                ) : (
                  userGroups.map((group) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={group.clubUniqueName}>
                      <Link to={`/clubs/${group.clubUniqueName}`}>
                        <Button
                          variant="contained"
                          fullWidth
                          sx={{
                            height: '100%',
                            textTransform: 'none',
                            bgcolor: 'primary.main',
                            color: 'white',
                          }}
                        >
                          {group.name}
                        </Button>
                      </Link>
                    </Grid>
                  ))
                )}
              </Grid>
            </Paper>
          </Grid>

          {/* Right Sidebar */}
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
              <Button fullWidth variant="contained" onClick={seeAllClubs} sx={{ mb: 2 }}>
                See Available Clubs
              </Button>
              <Button fullWidth variant="contained" onClick={() => setIsCreateGroupModalOpen(true)} sx={{ mb: 2 }}>
                Create Group
              </Button>
              <Button fullWidth variant="contained" onClick={findUserClubs}>
                Fetch Clubs
              </Button>
            </Paper>

            <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
              <Button fullWidth variant="contained" onClick={toggleTheme}>
                Switch to {isDarkTheme ? 'Light' : 'Dark'} Mode
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {/* Available Groups Modal */}
        <Modal open={isAvailableGroupsModalOpen} onClose={() => setIsAvailableGroupsModalOpen(false)}>
        <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, maxWidth: 500, margin: 'auto' }}>
          <Typography variant="h6">Available Clubs</Typography>
          <TextField
            fullWidth
            placeholder="Search for a group"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mt: 2, mb: 4 }}
          />
    
          {/* Scrollable container for groups */}
          <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
            <Grid container spacing={2}>
              {allGroups.map((group) => (
                <Grid item xs={12} key={group.name}>
                  <Button variant="contained" fullWidth onClick={() => joinGroup(group)}>
                    {group.name}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
          
          <Button variant="contained" color="error" fullWidth sx={{ mt: 4 }} onClick={() => setIsAvailableGroupsModalOpen(false)}>
            Close
          </Button>
        </Box>
      </Modal>


        {/* Create Group Modal */}
        <Dialog open={isCreateGroupModalOpen} onClose={() => setIsCreateGroupModalOpen(false)}>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Group Name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              sx={{ mt: 2, mb: 2 }}
            />
            <TextField
              fullWidth
              label="Username"
              value={newGroupUserName}
              onChange={(e) => setNewGroupUserName(e.target.value)}
              sx={{ mt: 2, mb: 2 }}
            />
            <TextField
              select
              fullWidth
              label="Club Type"
              value={newGroupType}
              onChange={(e) => setNewGroupType(e.target.value)} // Fix: Changed to match state
              sx={{ mt: 2, mb: 2 }}
            >
              <MenuItem value="Public">Public</MenuItem>
              <MenuItem value="Private">Private</MenuItem>
            </TextField>

          
            <TextField
              fullWidth
              label="Description"
              value={newGroupDescription}
              onChange={(e) => setNewGroupDescription(e.target.value)}
              sx={{ mt: 2, mb: 2 }}
            />
            <TextField
              fullWidth
              label="University Name"
              value={universityName}
              onChange={(e) => setUniversityName(e.target.value)}
              sx={{ mt: 2, mb: 2 }}
            />
            <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
              Committee Members
            </Typography>
            {committeeMembers.map((member, index) => (
              <Grid container spacing={2} key={index}>
                <Grid item xs={4}>
                  <TextField
                    label="Name"
                    value={member.name}
                    onChange={(e) => updateCommitteeMember(index, 'name', e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Role"
                    value={member.role}
                    onChange={(e) => updateCommitteeMember(index, 'role', e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="Contact"
                    value={member.contact}
                    onChange={(e) => updateCommitteeMember(index, 'contact', e.target.value)}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={1}>
                  <IconButton color="error" onClick={() => removeCommitteeMember(index)}>
                    <RemoveIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button variant="outlined" startIcon={<AddIcon />} sx={{ mt: 2 }} onClick={addCommitteeMember}>
              Add Member
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsCreateGroupModalOpen(false)} color="error">
              Cancel
            </Button>
            <Button onClick={addGroup} variant="contained">
              Create Group
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}

export default Home;



// import React, { useState, useEffect } from 'react';
// import Navbar from './Navbar';
// import { Link } from 'react-router-dom';

// function Home() {
//   const [availableGroups, setAvailableGroups] = useState([
//     { id: 1, name: 'Club 1' },
//     { id: 2, name: 'Club 2' },
//     { id: 3, name: 'Club 3' },
//     { id: 4, name: 'Inter college club 1' }
//   ]);
//   const [userGroups, setUserGroups] = useState([]);
//   const [newGroupName, setNewGroupName] = useState('');
//   const [newGroupUserName, setNewGroupUserName] = useState('');
//   const [universityName, setUniversityName] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [allGroups, setAllGroups] = useState([]); 
//    const [isAvailableGroupsModalOpen, setIsAvailableGroupsModalOpen] = useState(false);
//   const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
//   const [isDarkTheme, setIsDarkTheme] = useState(false);

//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme');
//     if (savedTheme === 'dark') {
//       setIsDarkTheme(true);
//     }
//   }, []);

//   // Toggle theme and save preference
//   const toggleTheme = () => {
//     setIsDarkTheme((prev) => {
//       const newTheme = !prev;
//       localStorage.setItem('theme', newTheme ? 'dark' : 'light');
//       return newTheme;
//     });
//   };
//   const fetchAllGroups = async () => {
//     try {
//       const response = await fetch('http://localhost:3000/api/clubs/allclubs');
//       const data = await response.json(); 
//       setAllGroups(data); 
//     } catch (error) {
//       console.log(error);
//     }
//   };

// const findUserClubs = async()=>{
//   const email = JSON.parse(localStorage.getItem('user')).email;
// const response = await fetch('http://localhost:3000/api/clubs/userclubs', {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({ email })  
// });


// if (response.ok) {
//   const data = await response.json();
//   // const clubs = ;
//     setUserGroups([... data.clubs])
//   console.log('Response data:', data);
// } else {
//   console.error('Error:', response.statusText);
// }
// }
// useEffect(() => {
//   findUserClubs(); // Trigger function on component mount
// }, []);
//   const addGroup = async () => {
//     if (newGroupName) {
//       const newGroup = {
//         id: availableGroups.length + 1,
//         name: newGroupName
//       };
//       setAvailableGroups([...availableGroups, newGroup]);
//       setNewGroupName('');
//       setIsCreateGroupModalOpen(false);
//     }
//     const email = JSON.parse(localStorage.getItem('user')).email;
//     const clubData = {
//       newGroupUserName,
//       newGroupName,
//       universityName,
//       email
//     };
//     // console.log(name)

//     try {
//       const response = await fetch('http://localhost:3000/api/clubs/addclub', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(clubData)
//       });
//       location.reload()
//       if (!response.ok) {
//         throw new Error('Failed to add group');
//       }
//     } catch (error) {
//       console.error(error.message);
//     }
//   };
//   const joinGroup = async (group) => {
//     try {
//         const user = JSON.parse(localStorage.getItem('user'));
//         if (!user) throw new Error("User not found in local storage");
// console.log(group)
//         const { email, name } = user;
//         const response = await fetch('http://localhost:3000/api/clubs/joinsomething', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ clubUniqueName: group.clubUniqueName, email, name })
//         });

//         if (!response.ok) {
//             throw new Error("Failed to join club");
//         }

//         const result = await response.json();
//         console.log(result.message);  // Success message from backend
//         setUserGroups([...result.clubUniqueName]);
//         location.reload()  // Update state as needed

//     } catch (error) {
//         console.log("Error joining group:", error);
//     }
// };

// const seeAllClubs = async()=>{
//   setIsAvailableGroupsModalOpen(true);
//   console.log("first")
//   await fetchAllGroups();
//   console.log("firs2t")
// }

//   return (
//     <>
//       <div className={`flex flex-col min-h-screen ${isDarkTheme ? 'bg-gray-900 text-white' : ' text-black bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600'}`}>
//         <div className="flex flex-1">
//           {/* Main Content */}
//           <div className={`flex-1 p-6 ${isDarkTheme ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl`}>
//             <h2 className="text-3xl font-bold text-gray-800 mb-4">My Groups</h2>
//             <div className={`relative h-full p-7 border-4 ${isDarkTheme ? 'border-teal-600' : 'border-teal-400'} rounded-lg flex flex-wrap justify-between items-start ${isDarkTheme ? 'bg-gray-700' : 'bg-gradient-to-b from-teal-200 to-teal-100'}`}>
//               {userGroups.length === 0 ? (
//                 <p className="text-gray-500">You haven't joined any groups yet.</p>
//               ) : (
//                 userGroups.map((group) => (
//                   <Link
//                     to={`/clubs/${group.clubUniqueName}`}
//                     key={group.clubUniqueName}
//                     className={`w-full sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 ${isDarkTheme ? 'bg-teal-700' : 'bg-teal-500'} text-white rounded-lg shadow-md flex items-center justify-between p-4 my-4 transform transition duration-300 hover:scale-105`}
//                   >
//                     <button className="w-full text-left">
//                       {group.name}
//                       {/* <span>{group.name}</span> */}
//                     </button>
//                   </Link>
//                 ))
//               )}
//             </div>
//           </div>

//           {/* Right Sidebar Panel */}
//           <div className={`w-1/5 ${isDarkTheme ? 'bg-gray-800' : 'bg-gradient-to-b from-teal-300 to-teal-400'} p-6 border-l-4 ${isDarkTheme ? 'border-teal-600' : 'border-teal-400'} rounded-lg shadow-lg`}>
//             <h2 className="text-lg font-semibold text-white mb-4">Sidebar</h2>

//             <button
//               onClick={seeAllClubs}
//               className={`w-full ${isDarkTheme ? ' bg-teal-600' : 'text-black bg-teal-400'}  p-3 rounded-lg hover:bg-teal-500 mb-4 transition duration-300`}
//             >
//               See Available Clubs
//             </button> 

//             <button
//               onClick={() => setIsCreateGroupModalOpen(true)}
//               className={`w-full ${isDarkTheme ? ' bg-teal-600' : 'text-black      bg-teal-400'} text-white p-3 rounded-lg hover:bg-teal-500 transition duration-300`}
//             >
//               Create Group
//               </button>
//             <button
//               onClick={findUserClubs} 
//               className={`w-full ${isDarkTheme ? ' bg-teal-600' : 'text-black      bg-teal-400'} text-white p-3 rounded-lg hover:bg-teal-500 transition duration-300`}
//             >
//               fetch clubs
//             </button>


//             {/* Theme Switcher */}
//             <div className="mt-4">
//               <button
//                 onClick={toggleTheme}
//                 className={`w-full ${isDarkTheme ? 'bg-teal-600' : 'text-black bg-teal-400'} text-white p-3 rounded-lg hover:bg-teal-500 transition duration-300`}
//               >
//                 Switch to {isDarkTheme ? 'Light' : 'Dark'} Mode
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Modal for Available Groups */}
//         {isAvailableGroupsModalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//             <div className={`bg-teal-600 p-6 rounded-lg shadow-xl w-3/5 max-w-lg transform transition duration-500 hover:scale-105 ${isDarkTheme ? 'bg-teal-800' : ''}`}>
//               <h3 className="text-2xl font-semibold text-white mb-4">Available Clubs</h3>
//               <input
//                 type="text"
//                 placeholder="Search for a group"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="p-3 border border-teal-300 rounded-lg w-full mb-4 bg-teal-700 text-white focus:outline-none"
//               />
//               <div className="max-h-60 overflow-y-auto">
//                 {allGroups.map((group) => (
//                   <div
//                     key={group.name}
//                     className={`flex justify-between items-center mb-3 p-3 border border-teal-300 rounded-lg ${isDarkTheme ? 'bg-teal-700' : 'bg-teal-500'} hover:bg-teal-400 transition duration-300`}
//                   >
//                     <span className="text-white">{group.name}</span>
//                     <button
//                     onClick={()=>joinGroup(group)}
//                       className="bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700 transition duration-300"
//                     >
//                       Join
//                     </button>
//                   </div>
//                 ))}
//               </div>
//               <button
//                 onClick={() => setIsAvailableGroupsModalOpen(false)}
//                 className="mt-4 w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition duration-300"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Modal for Creating a New Group */}
//         {isCreateGroupModalOpen && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//             <div className={`bg-teal-600 p-6 rounded-lg shadow-xl w-3/5 max-w-lg transform transition duration-500 hover:scale-105 ${isDarkTheme ? 'bg-teal-800' : ''}`}>
//               <h3 className="text-2xl font-semibold text-white mb-4">Create a New Club</h3>
//               <input
//                 type="text"
//                 placeholder="Enter new club name"
//                 value={newGroupName}
//                 onChange={(e) => setNewGroupName(e.target.value)}
//                 className="p-3 border border-teal-300 rounded-lg w-full mb-4 bg-teal-700 text-white focus:outline-none"
//               />
//               <input
//                 type="text"
//                 placeholder="Enter your clubUID"
//                 value={newGroupUserName}
//                 onChange={(e) => setNewGroupUserName(e.target.value)}
//                 className="p-3 border border-teal-300 rounded-lg w-full mb-4 bg-teal-700 text-white focus:outline-none"
//               />
//               <input
//                 type="text"
//                 placeholder="Enter university name"
//                 value={universityName}
//                 onChange={(e) => setUniversityName(e.target.value)}
//                 className="p-3 border border-teal-300 rounded-lg w-full mb-4 bg-teal-700 text-white focus:outline-none"
//               />
//               <div className="flex justify-between mt-4">
//                 <button
//                   onClick={addGroup}
//                   className="bg-teal-600 text-white p-3 rounded-lg hover:bg-teal-700 transition duration-300"
//                 >
//                   Create Group
//                 </button>
//                 <button
//                   onClick={() => setIsCreateGroupModalOpen(false)}
//                   className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition duration-300"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// export default Home;
