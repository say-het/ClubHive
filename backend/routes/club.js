const express = require("express");
const Club = require("../models/Club.model");
const router = express.Router();
const User = require("../models/User.model"); 
router.post('/addclub', async (req, res) => {
  try {
      const { newGroupUserName, newGroupName, newGroupType, newGroupDescription, universityName, email } = req.body;

      // Check if required fields are provided
      if (!newGroupUserName || !newGroupName || !universityName || !email) {
          return res.status(400).json({ msg: "All fields are required" });
      }

      // Determine if the club is public or private
      const isPublic = newGroupType === "Public";

      // Check if a club with the same unique name already exists
      let club = await Club.findOne({ clubUniqueName: newGroupUserName });
      if (club) {
          return res.status(409).json({ msg: "Club with this unique name already exists" });
      }

      // Find the user who is creating the club
      const user2 = await User.findOne({ email });
      if (!user2) {
          return res.status(404).json({ msg: "User not found" });
      }

      // Create and save a new club, making the creator the supreme admin
      const newClub = new Club({
          clubUniqueName: newGroupUserName,
          name: newGroupName,
          clubType: isPublic,
          clubDescription: newGroupDescription,
          universityName,
          supremeAdmin: email, // Set the creator as the supreme admin
          members: [{ name: user2.name, email: email }], // Add creator as the first member
      });

      await newClub.save();

      // Update the user's document to include the new club
      const update = { $push: { clubs: newGroupUserName } };
      await User.findOneAndUpdate({ email }, update, { new: true });

      console.log("Club added successfully");
      res.status(201).json({ msg: "Club added successfully", club: newClub });

  } catch (error) {
      console.error("Error adding club:", error);
      res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// router.post('/addclub', async (req, res) => {
//     try {
//         const { newGroupUserName, newGroupName, newGroupType, newGroupDescription, universityName, email } = req.body;

//         // Check if required fields are provided
//         if (!newGroupUserName || !newGroupName || !universityName) {
//             return res.status(400).json({ msg: "All fields are required" });
//         }
//         const isPublic = newGroupType === "Public"; // Converts to true if "Public", else false
//         // Check if a club with the same newGroupUserName already exists
//         let club = await Club.findOne({ newGroupUserName });
//         if (club) {
//             return res.status(409).json({ msg: "Club with this unique name already exists" });
//         }

//         // Create and save a new club
//         const filter = { email };  
//         let user2 = await User.findOne(filter);  
        
//         const newClub = new Club({
//             clubUniqueName:newGroupUserName,
//             name:newGroupName,
//             ClubType: isPublic,
//             clubDescription:newGroupDescription,
//             universityName,
//             members:[{name:user2.name, email:email}]
//         });
//         await newClub.save();
//         // console.log(email)
//         const update = { $push: { clubs: newGroupUserName } };          
//         let user = await User.findOneAndUpdate(filter, update, { new: true });  
//         // console.log(user);  
        
        
//         console.log("Club added successfully");
//         res.status(201).json({ msg: "Club added successfully", club: newClub });

//     } catch (error) {
//         console.error("Error adding club:", error);
//         res.status(500).json({ msg: "Server error", error: error.message });
//     }
// });

router.post('/userclubs', async (req, res) => {
    try {
      const { email } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
  
      const clubs = user.clubs;
  
      // Use clubUniqueName to find the clubs
      const allClubs = await Promise.all(
        clubs.map(async (clubUniqueName) => {
          const club = await Club.findOne({ clubUniqueName });
          
          return club;
        })
      );
  
      // const validClubs = allClubs.filter(club => club !== null);
      // console.log(validClubs);
      return res.status(200).json({ msg: "Clubs Fetched", clubs: allClubs });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Server error" });
    }
  });  
  router.get('/allclubs', async (req, res) => {
    try {
      const clubs = await Club.find({});

      res.json(clubs); 
    } catch (error) {
      console.error("Error fetching clubs:", error);
      res.status(500).json({ message: "Server error fetching clubs" }); // Handle errors with a response
    }
  });
  router.post('/getclubmembers/:id', async (req, res) => {
    try {
      // Find the club by its unique name (ID)
      const club = await Club.findOne({ clubUniqueName: req.params.id });
  
      // If the club is not found, return a 404 error
      if (!club) {
        return res.status(404).json({ message: 'Club not found' });
      }
  
      // Extract necessary data
      const members = club.members;
      const clubDescription = club.clubDescription;
      const supremeAdmin = club.supremeAdmin;  // The supreme admin's email
      const admins = club.admins;  // Array of admin emails
  
      // Return the members, description, supreme admin, and admins
      res.json({
        members,
        clubDescription,
        supremeAdmin,
        admins
      });
    } catch (error) {
      console.error("Error fetching club details:", error);
      res.status(500).json({ message: "Server error fetching clubs" });
    }
  });
  
  // router.post('/getclubmembers/:id', async (req, res) => {
  //   try {
  //     const club = await Club.findOne({clubUniqueName:req.params.id});
  //     if (!club) {
  //       return res.status(404).json({ message: 'Club not found' });
  //   }
  //   // console.log(club)
  //   const members = club.members;
  //   const clubDescription = club.clubDescription;
  //   res.json({members,clubDescription});
  //   } 
  //    catch (error) {
  //     console.error("Error fetching clubs:", error);
  //     res.status(500).json({ message: "Server error fetching clubs" }); // Handle errors with a response
  //   }
  // });
  
  router.post('/joinsomething', async (req, res) => {
    try {
      const { clubUniqueName, email, name } = req.body;
      const userUpdate = { $push: { clubs: clubUniqueName } };
      const user = await User.findOneAndUpdate({ email }, userUpdate, { new: true });
      
      const clubUpdate = { $push: { members: { name: name, email: email } } };
      const club = await Club.findOneAndUpdate({ clubUniqueName }, clubUpdate, { new: true });
      
      console.log(clubUniqueName)
      if (!user || !club) {
        return res.status(404).json({ message: "User or club not found." });
      }
      
        res.status(200).json({ message: "Successfully joined the club!", user, clubUniqueName:[club.clubUniqueName] });
        
      } catch (error) {
        console.error("Error joining club:", error);
        res.status(500).json({ message: "Server error joining club" });
      }
    });
    router.post('/leave', async (req, res) => {
      try {
          // const { name, email, clubUniqueName } = req.body;
          console.log("pio")
          const name = req.body.name;
          const email = req.body.email;
          const clubUniqueName = req.body.clubname;
          
          console.log(name, email, clubUniqueName)
          const club = await Club.findOneAndUpdate(
              { clubUniqueName },
              { $pull: { members: { name, email } } },
              { new: true } 
          );
  
          const user = await User.findOneAndUpdate(
              { email },
              { $pull: { clubs: clubUniqueName } },
              { new: true }
          );
  
          if (!club || !user) {
              return res.status(404).json({ message: "Club or User not found" });
          }
  
          res.status(200).json({ message: "Successfully left the club!" });
  
      } catch (error) {
          console.error("Error leaving club:", error);
          res.status(500).json({ message: "Server error while leaving the club" });
      }
  });
  router.post('/transferSupremeAdmin', async (req, res) => {
    try {
        const { clubUniqueName, currentSupremeAdmin, newSupremeAdmin } = req.body;

        if (!clubUniqueName || !currentSupremeAdmin || !newSupremeAdmin) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        const club = await Club.findOne({ clubUniqueName });
        if (!club) {
            return res.status(404).json({ msg: "Club not found" });
        }

        if (club.supremeAdmin !== currentSupremeAdmin) {
            return res.status(403).json({ msg: "Only the supreme admin can transfer their role" });
        }

        const newAdminExists = club.members.find(member => member.email === newSupremeAdmin);
        if (!newAdminExists) {
            return res.status(404).json({ msg: "New supreme admin must be a member of the club" });
        }

        // Transfer supreme admin role
        club.supremeAdmin = newSupremeAdmin;

        // Update positions in the members array
        club.members = club.members.map(member => {
            if (member.email === currentSupremeAdmin) {
                member.position = 'admin';
            }
            if (member.email === newSupremeAdmin) {
                member.position = 'admin';
            }
            return member;
        });

        if (!club.admins.includes(currentSupremeAdmin)) {
            club.admins.push(currentSupremeAdmin);
        }

        await club.save();
        res.status(200).json({ msg: "Supreme admin role transferred successfully", club });

    } catch (error) {
        console.error("Error transferring supreme admin:", error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});
//   router.post('/transferSupremeAdmin', async (req, res) => {
//     try {
//         const { clubUniqueName, currentSupremeAdmin, newSupremeAdmin } = req.body;

//         // Validate inputs
//         if (!clubUniqueName || !currentSupremeAdmin || !newSupremeAdmin) {
//             return res.status(400).json({ msg: "All fields are required" });
//         }

//         // Find the club
//         const club = await Club.findOne({ clubUniqueName });
//         if (!club) {
//             return res.status(404).json({ msg: "Club not found" });
//         }

//         // Check if the current user is the supreme admin
//         if (club.supremeAdmin !== currentSupremeAdmin) {
//             return res.status(403).json({ msg: "Only the supreme admin can transfer their role" });
//         }

//         // Check if the new supreme admin is already a member of the club
//         const newAdminExists = club.members.find(member => member.email === newSupremeAdmin);
//         if (!newAdminExists) {
//             return res.status(404).json({ msg: "New supreme admin must be a member of the club" });
//         }

//         // Transfer the supreme admin role
//         club.supremeAdmin = newSupremeAdmin;

//         // Add the current supreme admin to the admins list
//         if (!club.admins.includes(currentSupremeAdmin)) {
//             club.admins.push(currentSupremeAdmin);
//         }

//         // Save the changes
//         await club.save();

//         console.log(`Supreme admin role transferred to ${newSupremeAdmin}`);
//         res.status(200).json({ msg: "Supreme admin role transferred successfully", club });

//     } catch (error) {
//         console.error("Error transferring supreme admin:", error);
//         res.status(500).json({ msg: "Server error", error: error.message });
//     }
// });
router.post('/addAdmin', async (req, res) => {
  try {
      const { clubUniqueName, supremeAdminEmail, newAdminEmail } = req.body;

      if (!clubUniqueName || !supremeAdminEmail || !newAdminEmail) {
          return res.status(400).json({ msg: "All fields are required" });
      }

      const club = await Club.findOne({ clubUniqueName });
      if (!club) {
          return res.status(404).json({ msg: "Club not found" });
      }

      if (club.supremeAdmin !== supremeAdminEmail) {
          return res.status(403).json({ msg: "Only the supreme admin can add new admins" });
      }

      const memberExists = club.members.find(member => member.email === newAdminEmail);
      if (!memberExists) {
          return res.status(404).json({ msg: "Admin must be a member of the club" });
      }

      if (club.admins.includes(newAdminEmail)) {
          return res.status(409).json({ msg: "This user is already an admin" });
      }

      club.admins.push(newAdminEmail);

      // Update position in members array
      club.members = club.members.map(member => {
          if (member.email === newAdminEmail) {
              member.position = 'admin';
          }
          return member;
      });

      await club.save();
      res.status(200).json({ msg: "New admin added successfully", club });

  } catch (error) {
      console.error("Error adding new admin:", error);
      res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// router.post('/addAdmin', async (req, res) => {
//   try {
//       const { clubUniqueName, supremeAdminEmail, newAdminEmail } = req.body;

//       // Validate inputs
//       if (!clubUniqueName || !supremeAdminEmail || !newAdminEmail) {
//           return res.status(400).json({ msg: "All fields are required" });
//       }

//       // Find the club
//       const club = await Club.findOne({ clubUniqueName });
//       if (!club) {
//           return res.status(404).json({ msg: "Club not found" });
//       }

//       // Check if the user making the request is the supreme admin
//       if (club.supremeAdmin !== supremeAdminEmail) {
//           return res.status(403).json({ msg: "Only the supreme admin can add new admins" });
//       }

//       // Check if the new admin is already a member of the club
//       const memberExists = club.members.find(member => member.email === newAdminEmail);
//       if (!memberExists) {
//           return res.status(404).json({ msg: "Admin must be a member of the club" });
//       }

//       // Check if the user is already an admin
//       if (club.admins.includes(newAdminEmail)) {
//           return res.status(409).json({ msg: "This user is already an admin" });
//       }

//       // Add the user to the admins list
//       club.admins.push(newAdminEmail);

//       // Save the changes
//       await club.save();

//       console.log(`New admin added: ${newAdminEmail}`);
//       res.status(200).json({ msg: "New admin added successfully", club });

//   } catch (error) {
//       console.error("Error adding new admin:", error);
//       res.status(500).json({ msg: "Server error", error: error.message });
//   }
// });
router.post('/removeAdmin', async (req, res) => {
  try {
      const { clubUniqueName, supremeAdminEmail, adminToRemoveEmail } = req.body;

      if (!clubUniqueName || !supremeAdminEmail || !adminToRemoveEmail) {
          return res.status(400).json({ msg: "All fields are required" });
      }

      const club = await Club.findOne({ clubUniqueName });
      if (!club) {
          return res.status(404).json({ msg: "Club not found" });
      }

      if (club.supremeAdmin !== supremeAdminEmail) {
          return res.status(403).json({ msg: "Only the supreme admin can remove an admin" });
      }

      if (!club.admins.includes(adminToRemoveEmail)) {
          return res.status(404).json({ msg: "The specified user is not an admin" });
      }

      club.admins = club.admins.filter(email => email !== adminToRemoveEmail);

      // Update position in members array
      club.members = club.members.map(member => {
          if (member.email === adminToRemoveEmail) {
              member.position = 'member';
          }
          return member;
      });

      await club.save();
      res.status(200).json({ msg: "Admin removed successfully", club });

  } catch (error) {
      console.error("Error removing admin:", error);
      res.status(500).json({ msg: "Server error", error: error.message });
  }
});
// router.post('/removeAdmin', async (req, res) => {
//   try {
//       const { clubUniqueName, supremeAdminEmail, adminToRemoveEmail } = req.body;

//       // Validate inputs
//       if (!clubUniqueName || !supremeAdminEmail || !adminToRemoveEmail) {
//           return res.status(400).json({ msg: "All fields are required" });
//       }

//       // Find the club
//       const club = await Club.findOne({ clubUniqueName });
//       if (!club) {
//           return res.status(404).json({ msg: "Club not found" });
//       }

//       // Check if the user making the request is the supreme admin
//       if (club.supremeAdmin !== supremeAdminEmail) {
//           return res.status(403).json({ msg: "Only the supreme admin can remove an admin" });
//       }

//       // Check if the admin to remove is actually an admin
//       const isAdmin = club.admins.includes(adminToRemoveEmail);
//       if (!isAdmin) {
//           return res.status(404).json({ msg: "The specified user is not an admin" });
//       }

//       // Remove the admin from the admins list
//       club.admins = club.admins.filter(email => email !== adminToRemoveEmail);

//       // Save the changes
//       await club.save();

//       console.log(`Admin removed: ${adminToRemoveEmail}`);
//       res.status(200).json({ msg: "Admin removed successfully", club });

//   } catch (error) {
//       console.error("Error removing admin:", error);
//       res.status(500).json({ msg: "Server error", error: error.message });
//   }
// });
router.post('/fetchBanners/:id', async (req, res) => {
  const { id } = req.params;  // Retrieve the club unique name from the URL params

  try {
    const club = await Club.findOne({ clubUniqueName: id });  // Use 'id' to find the club
    if (club) {
      const banners = club.clubBanners;  
      const reversedBanners = [...banners].reverse();  
      res.json({ banners : reversedBanners });  
    } else {
      res.status(404).json({ message: 'Club not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/addBanner', async (req, res) => {
  try {
    const { clubUniqueName, bannerUrl } = req.body;  // Extract the clubUniqueName and bannerUrl from the request body

    // Check if both clubUniqueName and bannerUrl are provided
    if (!clubUniqueName || !bannerUrl) {
      return res.status(400).json({ message: "Club unique name and banner URL are required" });
    }

    // Find the club by its unique name
    const club = await Club.findOne({ clubUniqueName });
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }

    // Add the new banner URL to the clubBanners array
    club.clubBanners.push(bannerUrl);  // This will add the banner URL to the array

    // Save the updated club document
    await club.save();

    // Return the updated list of banners
    res.json({
      message: "Banner added successfully",
      clubBanners: club.clubBanners  // Send the updated banners array
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while adding the banner" });
  }
});

module.exports = router;