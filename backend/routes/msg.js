const express = require("express");
const Msg = require("../models/Msg.model"); 
const Club = require("../models/Club.model"); 

const router = express.Router();

router.post('/sendmsg', async (req, res) => {
    const { name, email, text, clubUniqueId } = req.body;

    try {
        // Create and save the message
        const msg = new Msg({
            senderId: email,
            name: name,
            text: text,
        });
        
        await msg.save();

        // Update Club with new message reference
        await Club.findOneAndUpdate(
            { clubUniqueId }, 
            { $push: { messages: msg._id } } // Assuming messages field stores message IDs
        );
        
        res.status(200).json({ msg: "Message saved" });
    } catch (error) {
        console.error("Error saving message:", error);
        res.status(500).json({ msg: "Error saving message", error });
    }
});

module.exports = router;
