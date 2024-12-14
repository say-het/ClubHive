const express = require("express");
const admin = require("../firebase/firebaseConfig");
const User = require("../models/User.model"); 

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { firebaseToken, name, email } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const firebaseUid = decodedToken.uid;

    let user = await User.findOne({ firebaseUid });
    if (!user) {
      user = new User({
        firebaseUid,
        name,
        email,
        // university,
      });
      await user.save();
      res.status(200).json({ msg: "User signedin successfully", user });
      return;
    }
    res.status(200).json({ msg: "User loggedin successfully", user });
  } catch (error) {
    console.error("Error in signup route:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/update-avatar", async (req, res) => {
  const { email, profilePicture } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { email:email },    
      { $set:{profilePicture:profilePicture} }, 
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({ msg: "Avatar updated successfully", user });
  } catch (error) {
    console.error("Error updating avatar:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

// router.post("/show-profile", async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email: email });

//     if (!user) {
//       return res.status(404).json({ msg: "User not found" });
//     }

//     // Return user details
//     const userDetails = {
//       name: user.name,
//       email: user.email,
//       uniname: user.uniname,
//       profilePicture: user.profilePicture,
//       bio: user.bio,
//       interests: user.interests,
//       clubs: user.clubs,
//       friends: user.friends
//     };

//     console.log(userDetails);

//     res.status(200).json({ msg: "User profile fetched successfully", userDetails });
//   } catch (error) {
//     console.error("Error fetching user profile:", error);
//     res.status(500).json({ msg: "Server error", error: error.message });
//   }
// });
router.post("/fetch-profile-avatar", async(req,res) => {

  try{
    const {email} = req.body;
    const user = await User.findOne({email:email});
    
    const pfrl = user.profilePicture;
    console.log(pfrl);
    
    res.status(200).json({ msg: "Avator uploaded successfully : ", pfrl });
    } catch({error}){
    console.log("error in fetching the url");
  }
})
router.post("/show-profile", async(req,res) => {

  try{
    const {email} = req.body;
    const user = await User.findOne({email:email});
    
    const pfrl = user.profilePicture;
    const name = user.name;
    const clubs = user.clubs;
    const interests = user.interests;
    const uniname = user.uniname;
    console.log(pfrl);
    
    res.status(200).json({
      msg: "Profile data fetched successfully",
      data: {
        profilePicture: pfrl,
        name,
        clubs,
        interests,
        universityName: uniname,
      },
    });
    } catch({error}){
    console.log("error in fetching the url");
  }
})

router.post('/user/:id', async(req,res)=>{
  try {
    const {email} = req.body;
    const user = User.findOne({email:email});
  } catch (e) {
    console.log(e)
  }
})

module.exports = router;
