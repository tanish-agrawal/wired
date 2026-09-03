import React, { useState } from "react";
import { X, User, Mail, LogOut, RefreshCw, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ProfileModal = ({ isOpen, onClose }) => {
  const { authUser, logout, updateProfile } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen || !authUser) return null;

  const handleRandomizeAvatar = async () => {
    setIsUpdating(true);
    const randomSeed = Math.random().toString(36).substring(7);
    const newAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${randomSeed}`;
    await updateProfile({ profilePic: newAvatar });
    setIsUpdating(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/60 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pt-2">
          <h2 className="text-xl font-bold text-slate-100">User Profile</h2>
          <p className="text-xs text-slate-400">Manage your account settings & profile</p>
        </div>

        {/* Avatar Display */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <img
              src={authUser.profilePic || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(authUser.fullName)}`}
              alt={authUser.fullName}
              className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500/40 shadow-xl bg-slate-800"
            />
            <button
              onClick={handleRandomizeAvatar}
              disabled={isUpdating}
              className="absolute bottom-0 right-0 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg border-2 border-slate-900 transition disabled:opacity-50"
              title="Change Avatar"
            >
              <RefreshCw className={`w-4 h-4 ${isUpdating ? "animate-spin" : ""}`} />
            </button>
          </div>
          <span className="text-xs text-indigo-400 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Click icon to generate new avatar
          </span>
        </div>

        {/* User Details */}
        <div className="space-y-3 bg-slate-800/50 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-indigo-400" />
            <div>
              <p className="text-xs text-slate-400">Full Name</p>
              <p className="text-sm font-semibold text-slate-200">{authUser.fullName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-slate-700/50">
            <Mail className="w-5 h-5 text-indigo-400" />
            <div>
              <p className="text-xs text-slate-400">Email Address</p>
              <p className="text-sm font-semibold text-slate-200">{authUser.email}</p>
            </div>
          </div>
        </div>

        {/* Logout Action (Moved here) */}
        <div className="pt-2">
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/30 hover:border-rose-500 font-semibold text-sm rounded-xl transition duration-200 shadow-md"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
