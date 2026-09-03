import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // Fetch all users except logged-in user
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    // Fetch latest message for each user to allow sliding recent active chats to the top
    const usersWithLastMessage = await Promise.all(
      users.map(async (user) => {
        const lastMsg = await Message.findOne({
          $or: [
            { senderId: loggedInUserId, receiverId: user._id },
            { senderId: user._id, receiverId: loggedInUserId },
          ],
        })
          .sort({ createdAt: -1 })
          .select("createdAt text image");

        return {
          ...user.toObject(),
          lastMessageTime: lastMsg ? lastMsg.createdAt : user.createdAt,
          lastMessageText: lastMsg ? (lastMsg.text || "Image attachment") : "",
        };
      })
    );

    // Sort contacts by latest message timestamp (descending)
    usersWithLastMessage.sort(
      (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
    );

    res.status(200).json(usersWithLastMessage);
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "Message content cannot be empty" });
    }

    let imageUrl = "";
    if (image) {
      imageUrl = await uploadToCloudinary(image, "wired_messages");
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text: text || "",
      image: imageUrl,
    });

    await newMessage.save();

    // Socket.IO Real-time broadcast to 1-on-1 receiver
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
