const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require('./routes/user');
const clubRoutes = require('./routes/club');
const uniRoutes = require('./routes/university');
const cors = require("cors");
// require('dotenv').config();
// dotenv.config();

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

// Routes
app.use('/api/users', userRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/university', uniRoutes);

// MongoDB connection
const uri = process.env.URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB Atlas with Mongoose");

    // Start the server only after MongoDB is connected
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
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
    const { room, message, username } = data;
    console.log(`Message from ${username} in room ${room}: ${message}`);
    socket.to(room).emit("receive_message", { username, message });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});