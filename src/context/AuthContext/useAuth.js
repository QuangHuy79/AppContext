// // import { useAuthContext } from '@/context/modules/AuthContext';
// import { useAuthContext } from "../context/modules/AuthContext";

// export const useAuth = () => {
//   const context = useAuthContext();
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// =======================
import { useContext } from "react";
// import { AuthContext } from "../context/modules/AuthContext";
import { AuthContext } from "./AuthContext";

export const useAuth = () => {
  return useContext(AuthContext);
};
