const express = require("express");
const Club = require("../models/Club.model"); 
const router = express.Router();



router.post('/addclub',async(req,res)=>{
    const {clubUniqueName,name, universityName} = req.body;

    try {
        let club = await Club.findOne({clubUniqueName});
        if(!club){
            club = new Club({
                clubUniqueName,
                name,
                universityName
            })
            await club.save();
            res.status(200).json({ msg: "Club Added successfully", club });
      return;
        }
    } catch (e) {
        console.log(e)
    }
})

module.exports = router;

