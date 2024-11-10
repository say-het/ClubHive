import { Server } from "socket.io";
import http from "http";
import express from "express";
import bodyParser from "body-parser";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});
app.use(bodyParser.json());

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("join_room", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
    socket.to(room).emit("user_joined", `${socket.id} has joined the chat`);
  });
  socket.on("send_message", (data) => {
    const { room, message, username } = data; // assuming data contains room, message, and username
    console.log(`Message from ${username} in room ${room}: ${message}`);

    // Broadcast message to everyone in the room except the sender
    socket.to(room).emit("receive_message", { username, message });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });