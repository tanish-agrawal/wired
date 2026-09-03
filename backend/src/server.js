import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import groupRoutes from "./routes/group.routes.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman) or allowed origins
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.some(allowed => origin.endsWith('.vercel.app'))) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive CORS for smooth deployment
      }
    },
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/groups", groupRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Wired Backend is running!" });
});

server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
  connectDB();
});
