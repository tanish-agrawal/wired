import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import API from "../services/api";
import { useSocket } from "./SocketContext";
import { useAuth } from "./AuthContext";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedChat, setSelectedChatState] = useState(null); // { type: 'direct' | 'group', data: user | group }
  const [unreadCounts, setUnreadCounts] = useState({}); // { [id]: number }

  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [isGroupsLoading, setIsGroupsLoading] = useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  const { socket, onlineUsers } = useSocket();
  const { authUser } = useAuth();

  // Custom setter to clear unread count when chat is selected
  const setSelectedChat = (chat) => {
    setSelectedChatState(chat);
    if (chat?.data?._id) {
      setUnreadCounts((prev) => ({
        ...prev,
        [chat.data._id]: 0,
      }));
    }
  };

  // Fetch 1-on-1 Contacts
  const getUsers = useCallback(async () => {
    setIsUsersLoading(true);
    try {
      const res = await API.get("/messages/users");
      setUsers(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load contacts");
    } finally {
      setIsUsersLoading(false);
    }
  }, []);

  // Fetch Groups
  const getGroups = useCallback(async () => {
    setIsGroupsLoading(true);
    try {
      const res = await API.get("/groups");
      setGroups(res.data);

      if (socket) {
        res.data.forEach((group) => {
          socket.emit("joinGroupRoom", group._id);
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load groups");
    } finally {
      setIsGroupsLoading(false);
    }
  }, [socket]);

  // Create Group
  const createGroup = async (groupData) => {
    setIsCreatingGroup(true);
    try {
      const res = await API.post("/groups/create", groupData);
      setGroups((prev) => [res.data, ...prev]);
      if (socket) {
        socket.emit("joinGroupRoom", res.data._id);
      }
      toast.success("Group created successfully!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create group");
      return false;
    } finally {
      setIsCreatingGroup(false);
    }
  };

  // Fetch Chat History (Direct or Group)
  const getMessages = useCallback(async (chat) => {
    if (!chat) return;
    setIsMessagesLoading(true);
    try {
      if (chat.type === "direct") {
        const res = await API.get(`/messages/${chat.data._id}`);
        setMessages(res.data);
      } else if (chat.type === "group") {
        const res = await API.get(`/groups/${chat.data._id}/messages`);
        setMessages(res.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      setIsMessagesLoading(false);
    }
  }, []);

  // Send Message (Direct or Group)
  const sendMessage = async (messageData) => {
    if (!selectedChat) return;
    setIsSending(true);
    try {
      let res;
      if (selectedChat.type === "direct") {
        res = await API.post(`/messages/send/${selectedChat.data._id}`, messageData);
        setMessages((prev) => [...prev, res.data]);

        setUsers((prevUsers) => {
          const updatedUsers = prevUsers.map((u) =>
            u._id === selectedChat.data._id
              ? { ...u, lastMessageTime: res.data.createdAt, lastMessageText: res.data.text || "Image" }
              : u
          );
          return updatedUsers.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
        });
      } else if (selectedChat.type === "group") {
        res = await API.post(`/groups/${selectedChat.data._id}/send`, messageData);
        setMessages((prev) => [...prev, res.data]);

        setGroups((prevGroups) => {
          const updatedGroups = prevGroups.map((g) =>
            g._id === selectedChat.data._id
              ? { ...g, updatedAt: res.data.createdAt }
              : g
          );
          return updatedGroups.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        });
      }

      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  // Automatically check if any online user is missing from users list
  useEffect(() => {
    if (!authUser?._id || onlineUsers.length === 0) return;
    const knownUserIds = new Set(users.map((u) => u._id));
    const hasUnknownOnlineUser = onlineUsers.some(
      (id) => id !== authUser._id && !knownUserIds.has(id)
    );

    if (hasUnknownOnlineUser) {
      getUsers();
    }
  }, [onlineUsers, users, authUser?._id, getUsers]);

  // Socket event listeners for 1-on-1, Group messaging, and Real-time User Registration
  useEffect(() => {
    if (!socket) return;

    // Real-time listener for newly registered users
    const handleNewUserRegistered = (newUser) => {
      if (newUser._id === authUser?._id) return;
      setUsers((prevUsers) => {
        const exists = prevUsers.some((u) => u._id === newUser._id);
        if (exists) return prevUsers;
        return [newUser, ...prevUsers];
      });
    };

    const handleNewMessage = (newMessage) => {
      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.map((u) =>
          u._id === newMessage.senderId
            ? { ...u, lastMessageTime: newMessage.createdAt, lastMessageText: newMessage.text || "Image" }
            : u
        );
        return updatedUsers.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
      });

      if (
        selectedChat?.type === "direct" &&
        (newMessage.senderId === selectedChat.data._id || newMessage.receiverId === selectedChat.data._id)
      ) {
        setMessages((prev) => [...prev, newMessage]);
      } else {
        setUnreadCounts((prev) => ({
          ...prev,
          [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
        }));
      }
    };

    const handleNewGroupMessage = (newGroupMsg) => {
      setGroups((prevGroups) => {
        const updatedGroups = prevGroups.map((g) =>
          g._id === newGroupMsg.groupId
            ? { ...g, updatedAt: newGroupMsg.createdAt }
            : g
        );
        return updatedGroups.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      });

      if (selectedChat?.type === "group" && selectedChat.data._id === newGroupMsg.groupId) {
        setMessages((prev) => [...prev, newGroupMsg]);
      } else if (newGroupMsg.senderId._id !== authUser?._id) {
        setUnreadCounts((prev) => ({
          ...prev,
          [newGroupMsg.groupId]: (prev[newGroupMsg.groupId] || 0) + 1,
        }));
      }
    };

    socket.on("newUserRegistered", handleNewUserRegistered);
    socket.on("newMessage", handleNewMessage);
    socket.on("newGroupMessage", handleNewGroupMessage);

    return () => {
      socket.off("newUserRegistered", handleNewUserRegistered);
      socket.off("newMessage", handleNewMessage);
      socket.off("newGroupMessage", handleNewGroupMessage);
    };
  }, [socket, selectedChat, authUser?._id]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        users,
        groups,
        selectedChat,
        unreadCounts,
        isUsersLoading,
        isGroupsLoading,
        isMessagesLoading,
        isSending,
        isCreatingGroup,
        getUsers,
        getGroups,
        createGroup,
        getMessages,
        sendMessage,
        setSelectedChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
