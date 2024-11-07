const express = require("express");
const Club = require("../models/Club.model"); 
const router = express.Router();

router.post('/addclub',async(req,res)=>{
    const {username,name, uniName} = req.body;

    try {
        let club = await Club.findOne({username});
        if(!club){
            club = new Club({
                username,
                name,
                uniName
            })
            await club.save();
            res.status(200).json({ msg: "Club Added successfully", user });
      return;
        }
    } catch (e) {
        console.log(e)
    }
})

module.exports = router;

