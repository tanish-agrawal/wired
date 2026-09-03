import Group from "../models/group.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { io } from "../socket/socket.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

export const createGroup = async (req, res) => {
  try {
    const { name, description, memberIds } = req.body;
    const adminId = req.user._id;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Group name is required" });
    }

    if (!memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
      return res.status(400).json({ message: "At least one member must be selected" });
    }

    const uniqueMembers = Array.from(new Set([...memberIds, adminId.toString()]));

    const defaultGroupPic = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(name)}`;

    const newGroup = new Group({
      name: name.trim(),
      description: description ? description.trim() : "",
      admin: adminId,
      members: uniqueMembers,
      groupPic: defaultGroupPic,
    });

    await newGroup.save();

    const populatedGroup = await Group.findById(newGroup._id)
      .populate("members", "-password")
      .populate("admin", "-password");

    uniqueMembers.forEach((memberId) => {
      io.emit(`groupCreated_${memberId}`, populatedGroup);
    });

    res.status(201).json(populatedGroup);
  } catch (error) {
    console.error("Error in createGroup controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserGroups = async (req, res) => {
  try {
    const userId = req.user._id;

    const groups = await Group.find({ members: userId })
      .populate("members", "-password")
      .populate("admin", "-password")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    res.status(200).json(groups);
  } catch (error) {
    console.error("Error in getUserGroups controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    const messages = await Message.find({ groupId })
      .populate("senderId", "fullName email profilePic")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getGroupMessages controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { text, image } = req.body;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: "Message content cannot be empty" });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    let imageUrl = "";
    if (image) {
      imageUrl = await uploadToCloudinary(image, "wired_group_messages");
    }

    const newMessage = new Message({
      senderId,
      groupId,
      text: text || "",
      image: imageUrl,
    });

    await newMessage.save();

    group.lastMessage = newMessage._id;
    await group.save();

    const populatedMessage = await Message.findById(newMessage._id).populate(
      "senderId",
      "fullName email profilePic"
    );

    io.to(`group_${groupId}`).emit("newGroupMessage", populatedMessage);

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error in sendGroupMessage controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
