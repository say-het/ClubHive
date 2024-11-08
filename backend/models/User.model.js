const mongoose = require("mongoose");

// models/User.js

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique:true },
  profilePicture: String,
  bio: String,
  interests: [String],
  
  clubs: [String],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

