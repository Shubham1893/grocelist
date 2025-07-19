import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

// Create the context
const AuthContext = createContext(null);

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [familyInfo, setFamilyInfo] = useState(
    JSON.parse(localStorage.getItem("familyInfo"))
  );
  const navigate = useNavigate();

  // The login function handles setting state and localStorage
  const handleLogin = (authData) => {
    localStorage.setItem("token", authData.token);
    localStorage.setItem("familyInfo", JSON.stringify(authData.family));
    setToken(authData.token);
    setFamilyInfo(authData.family);
    navigate("/"); // Redirect to dashboard on successful login/registration
  };

  // The logout function handles clearing state and localStorage
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("familyInfo");
    setToken(null);
    setFamilyInfo(null);
    navigate("/login"); // Redirect to login on logout
  };

  // The value provided to consuming components
  const value = {
    token,
    familyInfo,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to easily use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};