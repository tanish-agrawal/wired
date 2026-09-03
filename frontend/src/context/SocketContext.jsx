import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

const SOCKET_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace(/\/$/, "")
  : (import.meta.env.MODE === "development" ? "http://localhost:5000" : "/");

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const { authUser } = useAuth();

  useEffect(() => {
    if (authUser?._id) {
      const socketInstance = io(SOCKET_URL, {
        query: {
          userId: authUser._id,
        },
        transports: ["websocket", "polling"],
      });

      setSocket(socketInstance);

      socketInstance.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      socketInstance.on("userTyping", ({ senderId }) => {
        setTypingUsers((prev) => ({ ...prev, [senderId]: true }));
      });

      socketInstance.on("userStopTyping", ({ senderId }) => {
        setTypingUsers((prev) => ({ ...prev, [senderId]: false }));
      });

      return () => {
        socketInstance.close();
        setSocket(null);
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser?._id]);

  const emitTyping = (receiverId) => {
    if (socket && receiverId) {
      socket.emit("typing", { receiverId });
    }
  };

  const emitStopTyping = (receiverId) => {
    if (socket && receiverId) {
      socket.emit("stopTyping", { receiverId });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        typingUsers,
        emitTyping,
        emitStopTyping,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
