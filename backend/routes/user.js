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

module.exports = router;
