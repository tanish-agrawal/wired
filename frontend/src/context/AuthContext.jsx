import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await API.get("/auth/check");
      setAuthUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (error) {
      console.log("Error checking auth:", error?.response?.data?.message || error.message);
      // Clear invalid state if request fails
      if (!token) {
        setAuthUser(null);
        localStorage.removeItem("user");
      }
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const signup = async (data) => {
    setIsSigningUp(true);
    try {
      const res = await API.post("/auth/signup", data);
      setAuthUser(res.data);
      setToken(res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      localStorage.setItem("token", res.data.token);
      toast.success("Account created successfully!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
      return false;
    } finally {
      setIsSigningUp(false);
    }
  };

  const login = async (data) => {
    setIsLoggingIn(true);
    try {
      const res = await API.post("/auth/login", data);
      setAuthUser(res.data);
      setToken(res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      localStorage.setItem("token", res.data.token);
      toast.success("Logged in successfully!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      return false;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      setAuthUser(null);
      setToken(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      toast.success("Logged out successfully");
    }
  };

  const updateProfile = async (data) => {
    try {
      const res = await API.put("/auth/update-profile", data);
      setAuthUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Profile updated successfully!");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authUser,
        token,
        isCheckingAuth,
        isLoggingIn,
        isSigningUp,
        signup,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
