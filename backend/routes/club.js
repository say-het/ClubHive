const express = require("express");
const Club = require("../models/Club.model");
const router = express.Router();
const User = require("../models/User.model"); 

router.post('/addclub', async (req, res) => {
    try {
        const { newGroupUserName, newGroupName, universityName, email } = req.body;

        // Check if required fields are provided
        if (!newGroupUserName || !newGroupName || !universityName) {
            return res.status(400).json({ msg: "All fields are required" });
        }
        
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
            universityName,
            members:[user2]
        });
        await newClub.save();
        // console.log(email)
        const update = { $push: { clubs: newGroupUserName } };          
        let user = await User.findOneAndUpdate(filter, update, { new: true });  
        console.log(user);  
        
        
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
          
          return club ? club.name : null;
        })
      );
  
      const validClubs = allClubs.filter(club => club !== null);
      console.log(validClubs);
      return res.status(200).json({ msg: "Clubs Fetched", clubs: validClubs });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Server error" });
    }
  });  
module.exports = router;
