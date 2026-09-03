import React, { useState } from "react";
import { X, Users, Check, Loader2 } from "lucide-react";
import { useChat } from "../context/ChatContext";
import toast from "react-hot-toast";

const GroupModal = ({ isOpen, onClose }) => {
  const { users, createGroup, isCreatingGroup } = useChat();
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);

  if (!isOpen) return null;

  const toggleMember = (userId) => {
    if (selectedMemberIds.includes(userId)) {
      setSelectedMemberIds(selectedMemberIds.filter((id) => id !== userId));
    } else {
      setSelectedMemberIds([...selectedMemberIds, userId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!groupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }

    if (selectedMemberIds.length === 0) {
      toast.error("Please select at least 1 group member");
      return;
    }

    const success = await createGroup({
      name: groupName.trim(),
      description: description.trim(),
      memberIds: selectedMemberIds,
    });

    if (success) {
      setGroupName("");
      setDescription("");
      setSelectedMemberIds([]);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Create Group Chat</h2>
            <p className="text-xs text-slate-400">Bring your contacts together in a group conversation</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Group Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Group Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Design Team, Friends Circle"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Group Topic / Description</label>
            <input
              type="text"
              placeholder="What's this group about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            />
          </div>

          {/* Select Members */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">Select Members *</label>
              <span className="text-xs text-indigo-400 font-medium">
                {selectedMemberIds.length} selected
              </span>
            </div>

            <div className="max-h-48 overflow-y-auto custom-scrollbar p-2 bg-slate-800/50 border border-slate-800 rounded-xl space-y-1">
              {users.length === 0 ? (
                <p className="text-xs text-slate-500 p-2 text-center">No contacts available to add</p>
              ) : (
                users.map((user) => {
                  const isSelected = selectedMemberIds.includes(user._id);

                  return (
                    <div
                      key={user._id}
                      onClick={() => toggleMember(user._id)}
                      className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition ${
                        isSelected
                          ? "bg-indigo-600/20 border border-indigo-500/40 text-white"
                          : "hover:bg-slate-800 text-slate-300 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={user.profilePic || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.fullName)}`}
                          alt={user.fullName}
                          className="w-8 h-8 rounded-full border border-slate-700"
                        />
                        <div>
                          <p className="text-xs font-semibold text-slate-100">{user.fullName}</p>
                          <p className="text-[10px] text-slate-400">{user.email}</p>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center border transition ${
                          isSelected
                            ? "bg-indigo-600 border-indigo-500 text-white"
                            : "border-slate-700 bg-slate-900"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm rounded-xl border border-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreatingGroup}
              className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
            >
              {isCreatingGroup ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Create Group</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupModal;
