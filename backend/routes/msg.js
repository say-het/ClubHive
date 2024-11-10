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
        console.log("lalalalalalalal ",clubUniqueId)
        // Update Club with new message reference
        const club =await Club.findOneAndUpdate({ clubUniqueName:clubUniqueId }, { $push: { messages: msg._id } });
        // console.log(club)
        res.status(200).json({ msg: "Message saved" });
    } catch (error) {
        console.error("Error saving message:", error);
        res.status(500).json({ msg: "Error saving message", error });
    }
});
router.get('/test',(req,res)=>{
    res.send("OK")
})
router.post('/allmsg', async (req, res) => {
    console.log("OK - Endpoint hit");
    const { clubUniqueId } = req.body;

    try {
        // Find the club and populate only 'text' and 'name' from messages
        const club = await Club.findOne({ clubUniqueName: clubUniqueId })
            .populate({
                path: 'messages',
                select: 'text name'
            });

        if (!club) {
            return res.status(404).json({ msg: "Club not found" });
        }
        const msgs = club.messages;
        console.log(msgs)
        res.status(200).json({ line: "Worked yay" ,msgs:msgs});
    } catch (error) {
        console.error("Error getting messages:", error);
        res.status(500).json({ msg: "Error getting messages", error });
    }
});

module.exports = router;
