// src/hooks/useApp.js
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

/**
 * useApp - base hook to access app state & dispatch
 * Prefer creating domain-specific hooks (useUI, useAuth) that wrap this.
 */
export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return ctx; // { state, dispatch }
};
