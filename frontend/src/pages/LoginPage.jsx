import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MessageSquare, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { login, isLoggingIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData);
    if (success) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 flex items-center justify-center px-4 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/40">
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl shadow-indigo-950/50 space-y-8">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          {/* <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/25">
            <MessageSquare className="w-7 h-7 text-white" />
          </div> */}
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Welcome Back</h1>
          <p className="text-sm text-slate-400">Sign in to your account to continue chatting</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-11 pr-4 py-3 bg-slate-800/60 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-11 pr-11 py-3 bg-slate-800/60 border border-slate-700/80 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-600/30 disabled:opacity-50 transition duration-200 flex items-center justify-center gap-2 group mt-2"
          >
            {isLoggingIn ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Footer link */}
        <div className="text-center">
          <p className="text-sm text-slate-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold transition">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
