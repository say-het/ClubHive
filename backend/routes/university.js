const express = require('express');
const University = require('../models/university.model');
const User = require('../models/User.model');
const router = express.Router();

router.post("/adduniname", async (req, res) => {
    try {
        const uniname = req.body.universityName;
        const universitynew = new University({ university: uniname });
        await universitynew.save();
        res.status(200).json({ msg: "University name added", universitynew });
    } catch (error) {
        console.error("University name error", error);
        res.status(500).json({ msg: "Error adding university name", error });
    }
});

router.post("/addusertouni", async (req, res) => {
    try {
        const { name, email, universityName } = req.body;
        // Find the university and update with the user's emailconst 
const uniUpdate = await University.findOneAndUpdate({univesity:universityName},{ $push: { users: email } });
        // const uniUpdate = await University.findOneAndUpdate(
        //     { university: universityName },
        //     { $push: { users: email } }, // Assuming clubs is an array where you store user emails
        //     { new: true }
        // );

        console.log(uniUpdate);
            if (!uniUpdate) {
            
            return res.status(404).json({ msg: "University not found" });
        }
        console.log(name,email,universityName);

        // Update the user's university field
const userUpdate = await User.findOneAndUpdate({email:email},{ $set: { uniname: universityName } });

        if (!userUpdate) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.status(200).json({ msg: "User added to university", userUpdate, uniUpdate });
    } catch (error) {
        console.error("User addition unsuccessful", error);
        res.status(500).json({ msg: "Error adding user to university", error });
    }
});

module.exports = router;
