import React, { useState } from "react";
import { MessageSquare, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ProfileModal from "./ProfileModal";

const Navbar = () => {
  const { authUser } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 fixed w-full top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <span className="text-[1.5rem] font-bold bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent tracking-tight">
              Wired
            </span>
          </div>

          {/* User Profile Trigger */}
          {authUser && (
            <button
              onClick={() => setIsProfileOpen(true)}
              className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/50 transition-all duration-200 shadow-sm cursor-pointer group"
              title="Open Profile"
            >
              <img
                src={authUser.profilePic || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(authUser.fullName)}`}
                alt={authUser.fullName}
                className="w-8 h-8 rounded-full border border-indigo-500/40 object-cover"
              />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-slate-200 group-hover:text-white leading-tight">
                  {authUser.fullName}
                </p>
                <p className="text-xs text-slate-400 group-hover:text-indigo-300 leading-tight">View Profile</p>
              </div>
            </button>
          )}
        </div>
      </header>

      {/* Profile Modal Component */}
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
};

export default Navbar;
