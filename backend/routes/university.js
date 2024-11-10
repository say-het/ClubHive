const express = require('express');
const unimodel = require('../models/university.model');
const router = express.Router();
router.post("/adduniname", async (req,res)=>{
    try {
        const uniname = req.body.universityName;
        const universitynew = new unimodel({univesity:uniname});
        await universitynew.save();
        res.status(200),json({msg:"university name added",universitynew});  
    } catch (error) {
        console.log("university name error",error);
    }
})
module.exports = router;