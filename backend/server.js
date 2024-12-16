const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require('./routes/user');
const clubRoutes = require('./routes/club');
const uniRoutes = require('./routes/university');
const msgRoutes = require('./routes/msg');
const cors = require("cors");
const cloudinary = require('cloudinary').v2; // This is how you import the Cloudinary SDK

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(bodyParser.json());
//cloudinary configuration
cloudinary.config({
  cloud_name: process.env.YOUR_CLOUD_NAME,
  api_key: process.env.YOUR_API_KEY,
  api_secret: process.env.YOUR_API_SECRET,
})
// Routes
app.use('/api/users', userRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/university', uniRoutes);
app.use('/api/msg', msgRoutes);
app.get('/upload-signature', (req, res) => {
  const timestamp = Math.round((new Date()).getTime() / 1000);
  const uploadPreset = process.env.UPLOAD_PRESET; // The upload preset you've set in Cloudinary
  const params = {
    timestamp,
    upload_preset: uploadPreset,
  };
  const signature = cloudinary.utils.api_sign_request(params, process.env.YOUR_API_SECRET);

  const apikey =  process.env.YOUR_API_KEY
  console.log("timestamp:",timestamp)
  console.log("signature:",signature)
  console.log("api:", process.env.YOUR_API_KEY)
  res.json({ timestamp, signature, apikey });
});
// MongoDB connection
const uri = process.env.URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB Atlas with Mongoose");
  })
  .catch(error => {
    console.error("Error connecting to MongoDB:", error);
  });

// Create HTTP server and initialize Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

// Socket.IO setup
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
    socket.to(room).emit("user_joined", `${socket.id} has joined the chat`);
  });
  socket.on("send_message", (data) => {
    const { room, text, name } = data;
    console.log(`Message from ${name} in room ${room}: ${text}`);
    io.to(room).emit("receive_message", { name, text });
  });
  


  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start the server after setting up socket connections
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
