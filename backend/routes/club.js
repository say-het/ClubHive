const express = require("express");
const Club = require("../models/Club.model");
const router = express.Router();
const User = require("../models/User.model"); 

router.post('/addclub', async (req, res) => {
    try {
        const { newGroupUserName, newGroupName, newGroupType, newGroupDescription, universityName, email } = req.body;

        // Check if required fields are provided
        if (!newGroupUserName || !newGroupName || !universityName) {
            return res.status(400).json({ msg: "All fields are required" });
        }
        const isPublic = newGroupType === "Public"; // Converts to true if "Public", else false
        // Check if a club with the same newGroupUserName already exists
        let club = await Club.findOne({ newGroupUserName });
        if (club) {
            return res.status(409).json({ msg: "Club with this unique name already exists" });
        }

        // Create and save a new club
        const filter = { email };  
        let user2 = await User.findOne(filter);  
        
        const newClub = new Club({
            clubUniqueName:newGroupUserName,
            name:newGroupName,
            ClubType: isPublic,
            clubDescription:newGroupDescription,
            universityName,
            members:[{name:user2.name, email:email}]
        });
        await newClub.save();
        // console.log(email)
        const update = { $push: { clubs: newGroupUserName } };          
        let user = await User.findOneAndUpdate(filter, update, { new: true });  
        // console.log(user);  
        
        
        console.log("Club added successfully");
        res.status(201).json({ msg: "Club added successfully", club: newClub });

    } catch (error) {
        console.error("Error adding club:", error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});

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
      const club = await Club.findOne({clubUniqueName:req.params.id});
      if (!club) {
        return res.status(404).json({ message: 'Club not found' });
    }
    // console.log(club)
    const members = club.members;
    const clubDescription = club.clubDescription;
    res.json({ members,clubDescription});
    } 
     catch (error) {
      console.error("Error fetching clubs:", error);
      res.status(500).json({ message: "Server error fetching clubs" }); // Handle errors with a response
    }
  });
  
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
  
module.exports = router;