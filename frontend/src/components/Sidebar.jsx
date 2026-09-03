import React, { useEffect, useState } from "react";
import { Users, Search, Plus, MessageSquare, Filter, User } from "lucide-react";
import { useChat } from "../context/ChatContext";
import { useSocket } from "../context/SocketContext";
import GroupModal from "./GroupModal";

const Sidebar = () => {
  const {
    users,
    getUsers,
    groups,
    getGroups,
    selectedChat,
    setSelectedChat,
    unreadCounts,
    isUsersLoading,
    isGroupsLoading,
  } = useChat();

  const { onlineUsers } = useSocket();
  const [activeTab, setActiveTab] = useState("direct"); // "direct" | "groups"
  const [searchQuery, setSearchQuery] = useState("");
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  useEffect(() => {
    getUsers();
    getGroups();
  }, [getUsers, getGroups]);

  // Filter 1-on-1 Contacts
  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter Groups
  const filteredGroups = groups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (group.description && group.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <aside className="w-full md:w-80 lg:w-96 bg-slate-900/90 border-r border-slate-800 flex flex-col h-full transition-all duration-300">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-200">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              <span className="font-bold text-base">Conversations</span>
            </div>

            {/* Create Group Button */}
            <button
              onClick={() => setIsGroupModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 hover:border-indigo-500 text-xs font-semibold rounded-xl transition duration-200 shadow-sm"
              title="Create new group"
            >
              <Plus className="w-4 h-4" />
              <span>New Group</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={activeTab === "direct" ? "Search contacts..." : "Search groups..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-800/70 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Navigation Tabs (Direct Messages vs Groups) */}
          <div className="flex bg-slate-800/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab("direct")}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
                activeTab === "direct"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Direct Messages</span>
            </button>
            <button
              onClick={() => setActiveTab("groups")}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
                activeTab === "groups"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Groups ({groups.length})</span>
            </button>
          </div>
        </div>

        {/* Conversation List Stream */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {activeTab === "direct" ? (
            isUsersLoading ? (
              <div className="space-y-3 p-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-12 h-12 rounded-full bg-slate-800"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-800 rounded w-2/3"></div>
                      <div className="h-3 bg-slate-800/60 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-10 px-4 text-slate-500">
                <Filter className="w-8 h-8 mx-auto mb-2 opacity-50 text-indigo-400" />
                <p className="text-sm font-medium">No contacts found</p>
              </div>
            ) : (
              filteredUsers.map((user) => {
                const isOnline = onlineUsers.includes(user._id);
                const isSelected =
                  selectedChat?.type === "direct" && selectedChat.data._id === user._id;
                const unreadCount = unreadCounts[user._id] || 0;

                return (
                  <button
                    key={user._id}
                    onClick={() => setSelectedChat({ type: "direct", data: user })}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-150 text-left ${
                      isSelected
                        ? "bg-indigo-600/20 border border-indigo-500/40 text-white shadow-sm"
                        : "hover:bg-slate-800/60 text-slate-300 border border-transparent"
                    }`}
                  >
                    {/* Avatar with Status Badge */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={
                          user.profilePic ||
                          `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
                            user.fullName
                          )}`
                        }
                        alt={user.fullName}
                        className="w-12 h-12 rounded-full object-cover border border-slate-700"
                      />
                      {isOnline ? (
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full shadow-sm" />
                      ) : (
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-slate-600 border-2 border-slate-900 rounded-full" />
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm truncate text-slate-100">
                          {user.fullName}
                        </p>
                        <div className="flex items-center gap-1.5">
                          {unreadCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-md shadow-indigo-600/30 animate-pulse">
                              {unreadCount}
                            </span>
                          )}
                          <span
                            className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                              isOnline
                                ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                                : "text-slate-500"
                            }`}
                          >
                            {isOnline ? "Online" : "Offline"}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {user.lastMessageText || user.email}
                      </p>
                    </div>
                  </button>
                );
              })
            )
          ) : isGroupsLoading ? (
            <div className="space-y-3 p-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-800 rounded w-2/3"></div>
                    <div className="h-3 bg-slate-800/60 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredGroups.length === 0 ? (
            <div className="text-center py-10 px-4 text-slate-500 space-y-3">
              <Users className="w-8 h-8 mx-auto opacity-50 text-indigo-400" />
              <div>
                <p className="text-sm font-medium">No groups created yet</p>
                <p className="text-xs text-slate-600 mt-1">
                  Click "+ New Group" above to start a group chat
                </p>
              </div>
            </div>
          ) : (
            filteredGroups.map((group) => {
              const isSelected =
                selectedChat?.type === "group" && selectedChat.data._id === group._id;
              const unreadCount = unreadCounts[group._id] || 0;

              return (
                <button
                  key={group._id}
                  onClick={() => setSelectedChat({ type: "group", data: group })}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-150 text-left ${
                    isSelected
                      ? "bg-indigo-600/20 border border-indigo-500/40 text-white shadow-sm"
                      : "hover:bg-slate-800/60 text-slate-300 border border-transparent"
                  }`}
                >
                  {/* Group Pic */}
                  <img
                    src={
                      group.groupPic ||
                      `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(
                        group.name
                      )}`
                    }
                    alt={group.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-indigo-500/30 flex-shrink-0 bg-slate-800"
                  />

                  {/* Group Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm truncate text-slate-100">
                        {group.name}
                      </p>
                      <div className="flex items-center gap-1.5">
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-md shadow-indigo-600/30 animate-pulse">
                            {unreadCount}
                          </span>
                        )}
                        <span className="text-[10px] text-indigo-400 font-medium px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                          {group.members?.length || 0} members
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {group.description || "Group Conversation"}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* Group Creation Modal */}
      <GroupModal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} />
    </>
  );
};

export default Sidebar;
