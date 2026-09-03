import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.some(allowed => origin.endsWith('.vercel.app'))) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  },
});

// Map of userId -> socketId
const userSocketMap = {}; 

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  
  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    console.log(`User connected: ${userId} with Socket ID: ${socket.id}`);
  }

  // Broadcast online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Join group room
  socket.on("joinGroupRoom", (groupId) => {
    if (groupId) {
      socket.join(`group_${groupId}`);
      console.log(`Socket ${socket.id} joined group room: group_${groupId}`);
    }
  });

  // 1-on-1 Typing events
  socket.on("typing", ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userTyping", { senderId: userId });
    }
  });

  socket.on("stopTyping", ({ receiverId }) => {
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("userStopTyping", { senderId: userId });
    }
  });

  // Group Typing events
  socket.on("groupTyping", ({ groupId, userName }) => {
    socket.to(`group_${groupId}`).emit("groupUserTyping", { groupId, userId, userName });
  });

  socket.on("groupStopTyping", ({ groupId }) => {
    socket.to(`group_${groupId}`).emit("groupUserStopTyping", { groupId, userId });
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${userId}`);
    if (userId) {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
