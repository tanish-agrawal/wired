import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Toaster } from "react-hot-toast";

import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

const App = () => {
  const { authUser, isCheckingAuth } = useAuth();

  if (isCheckingAuth) {
    return (
      <div className="h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="text-sm font-medium text-slate-300">Initializing Wired...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <Routes>
        <Route path="/" element={authUser ? <ChatPage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e293b",
            color: "#f8fafc",
            border: "1px solid #334155",
            borderRadius: "12px",
          },
        }}
      />
    </div>
  );
};

export default App;
