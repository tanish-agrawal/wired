import React from "react";
import { X, Users, User } from "lucide-react";
import { useChat } from "../context/ChatContext";
import { useSocket } from "../context/SocketContext";

const ChatHeader = () => {
  const { selectedChat, setSelectedChat } = useChat();
  const { onlineUsers, typingUsers } = useSocket();

  if (!selectedChat) return null;

  const isDirect = selectedChat.type === "direct";
  const chatData = selectedChat.data;

  const isOnline = isDirect ? onlineUsers.includes(chatData._id) : false;
  const isTyping = isDirect ? typingUsers[chatData._id] : false;

  return (
    <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
      {/* Header Info */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={
              isDirect
                ? chatData.profilePic || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(chatData.fullName)}`
                : chatData.groupPic || `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(chatData.name)}`
            }
            alt={isDirect ? chatData.fullName : chatData.name}
            className={`w-10 h-10 object-cover border border-slate-700 ${isDirect ? "rounded-full" : "rounded-2xl bg-slate-800"}`}
          />
          {isDirect && (
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-slate-900 rounded-full ${
                isOnline ? "bg-emerald-500" : "bg-slate-600"
              }`}
            />
          )}
        </div>

        <div>
          <h3 className="font-semibold text-slate-100 text-sm flex items-center gap-2">
            <span>{isDirect ? chatData.fullName : chatData.name}</span>
            {!isDirect && (
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                <Users className="w-3 h-3" /> Group
              </span>
            )}
          </h3>

          <p className="text-xs text-slate-400">
            {isDirect ? (
              isTyping ? (
                <span className="text-indigo-400 font-medium animate-pulse">typing...</span>
              ) : isOnline ? (
                <span className="text-emerald-400 font-medium">Online</span>
              ) : (
                <span>Offline</span>
              )
            ) : (
              <span>{chatData.members?.length || 0} members • {chatData.description || "Group conversation"}</span>
            )}
          </p>
        </div>
      </div>

      {/* Close Action */}
      <button
        onClick={() => setSelectedChat(null)}
        className="p-1.5 hover:bg-slate-800 hover:text-white rounded-lg text-slate-400 transition-all border border-slate-800 hover:border-slate-700"
        title="Close conversation"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ChatHeader;
