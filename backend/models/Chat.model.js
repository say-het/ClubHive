const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },  // References the User model
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],  // Array of users in the chat
    messages: [messageSchema],  // Array of message documents
}, { timestamps: true });

module.exports = mongoose.model("Chat", chatSchema);
