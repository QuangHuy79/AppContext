// // src/wrappers/AuthWrapper.jsx
// import React from "react";
// import { AuthProvider } from "../contexts/AuthContext/AuthContext.jsx";

// const AuthWrapper = ({ children }) => {
//   return <AuthProvider>{children}</AuthProvider>;
// };

// export default AuthWrapper;

// ========================================
// File FIXED — AuthWrapper.jsx (BẢN ĐÚNG)
// src/wrappers/AuthWrapper.jsx
import React from "react";
import { AuthProvider } from "../context/AuthContext/AuthContext.jsx";

/**
 * AuthWrapper
 * ------------------
 * Chỉ wrap các feature thực sự cần authentication.
 * Không được dùng để wrap toàn App.
 */
const AuthWrapper = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AuthWrapper;
