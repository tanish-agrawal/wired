import React from "react";
import { MessageSquare, Sparkles, ShieldCheck, Users } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-950/60 text-center">
      <div className="max-w-md flex flex-col items-center space-y-6">
        {/* Animated Logo Icon */}
        {/* <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30 animate-pulse">
            <MessageSquare className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 rounded-full p-1 shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
        </div> */}

        {/* Branding & Subtitle */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-100">Welcome to Wired</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Select a contact or group from the sidebar to start messaging.
          </p>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-2 gap-3 w-full pt-4">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Users className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <span>Group & Direct Messaging</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>JWT Secured Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;
