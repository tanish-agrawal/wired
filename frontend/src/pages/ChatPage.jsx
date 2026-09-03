import React from "react";
import { useChat } from "../context/ChatContext";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import NoChatSelected from "../components/NoChatSelected";

const ChatPage = () => {
  const { selectedChat } = useChat();

  return (
    <div className="h-screen bg-slate-950 pt-16 flex flex-col justify-center items-center px-0 sm:px-4 lg:px-6">
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 w-full max-w-7xl h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] sm:rounded-3xl shadow-2xl overflow-hidden flex">
        {/* Sidebar: Visible on desktop, or on mobile when NO chat selected */}
        <div className={`${selectedChat ? "hidden md:flex" : "flex"} w-full md:w-auto h-full`}>
          <Sidebar />
        </div>

        {/* Chat area: Visible on desktop, or on mobile when a chat IS selected */}
        <div className={`${!selectedChat ? "hidden md:flex" : "flex"} flex-1 h-full`}>
          {selectedChat ? <ChatContainer /> : <NoChatSelected />}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
