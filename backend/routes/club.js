const express = require("express");
const Club = require("../models/Club.model");
const router = express.Router();

router.post('/addclub', async (req, res) => {
    try {
        const { newGroupUserName, newGroupName, universityName } = req.body;

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
        const newClub = new Club({
            newGroupUserName,
            newGroupName,
            universityName
        });
        await newClub.save();

        console.log("Club added successfully");
        res.status(201).json({ msg: "Club added successfully", club: newClub });

    } catch (error) {
        console.error("Error adding club:", error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});



module.exports = router;
