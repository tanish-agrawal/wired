import React, { useEffect, useRef } from "react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { Loader2 } from "lucide-react";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedChat } = useChat();
  const { authUser } = useAuth();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (selectedChat) {
      getMessages(selectedChat);
    }
  }, [selectedChat, getMessages]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isGroup = selectedChat?.type === "group";

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950/60 overflow-hidden">
      <ChatHeader />

      {/* Messages Stream View */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {isMessagesLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-sm font-medium">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
              💬
            </div>
            <p className="text-sm font-medium text-slate-300">No messages yet</p>
            <p className="text-xs text-slate-500">
              Send a message to start the conversation in{" "}
              {isGroup ? selectedChat?.data.name : selectedChat?.data.fullName}
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const senderObj =
              typeof message.senderId === "object" ? message.senderId : null;
            const senderIdVal = senderObj ? senderObj._id : message.senderId;
            const isMe = senderIdVal === authUser._id;

            const senderName = isMe
              ? authUser.fullName
              : senderObj?.fullName || selectedChat?.data?.fullName || "User";

            const senderAvatar = isMe
              ? authUser.profilePic || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(authUser.fullName)}`
              : senderObj?.profilePic ||
                selectedChat?.data?.profilePic ||
                `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(senderName)}`;

            return (
              <div
                key={message._id || message.createdAt}
                className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <img
                  src={senderAvatar}
                  alt={senderName}
                  className="w-7 h-7 rounded-full object-cover border border-slate-700 mb-1 flex-shrink-0"
                />

                {/* Bubble Container */}
                <div className={`max-w-[75%] sm:max-w-[65%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                  {/* Show Sender Name in Group Chat */}
                  {isGroup && !isMe && (
                    <span className="text-[11px] font-semibold text-indigo-400 mb-1 px-1">
                      {senderName}
                    </span>
                  )}

                  <div
                    className={`rounded-2xl px-4 py-2.5 shadow-sm text-sm break-words ${
                      isMe
                        ? "bg-indigo-600 text-white rounded-br-none border border-indigo-500/50"
                        : "bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/80"
                    }`}
                  >
                    {message.image && (
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="sm:max-w-xs rounded-xl mb-2 border border-slate-700/50 object-cover max-h-60"
                      />
                    )}
                    {message.text && <p className="leading-relaxed">{message.text}</p>}
                  </div>

                  <span className="text-[10px] text-slate-500 mt-1 px-1 font-medium">
                    {formatTime(message.createdAt)}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
