// src/wrappers/AuthWrapper.jsx
import React from "react";
import { AuthProvider } from "../contexts/AuthContext/AuthContext.jsx";

const AuthWrapper = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AuthWrapper;
