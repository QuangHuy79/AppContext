// FILE FULL ĐÃ FIX — src/context/modules/NetworkContext.jsx
// src/context/modules/NetworkContext.jsx
import React, { createContext, useEffect, useContext, useRef } from "react";

/* --------------------------------------------------
   1️⃣ Context (STORE REF ONLY)
-------------------------------------------------- */
export const NetworkContext = createContext(null);

/* --------------------------------------------------
   2️⃣ Provider
-------------------------------------------------- */
export const NetworkProvider = ({ children }) => {
  const storeRef = useRef({
    isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
  });

  useEffect(() => {
    const handleOnline = () => {
      storeRef.current.isOnline = true;
    };

    const handleOffline = () => {
      storeRef.current.isOnline = false;
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  /**
   * ⚠️ Context value KHÔNG ĐỔI
   */
  const value = { storeRef };

  return (
    <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
  );
};

/* --------------------------------------------------
   3️⃣ Base Hook (INTERNAL)
-------------------------------------------------- */
function useNetworkStore() {
  const ctx = useContext(NetworkContext);
  if (!ctx) {
    throw new Error("useNetwork must be used within NetworkProvider");
  }
  return ctx;
}

/* --------------------------------------------------
   4️⃣ Selector Hook (PUBLIC)
-------------------------------------------------- */
export const useNetworkSelector = (selector) => {
  const { storeRef } = useNetworkStore();
  return selector(storeRef.current);
};

/* --------------------------------------------------
   5️⃣ Facade Hook (COMPAT)
   - dùng cho RuntimeOrchestrator + hook cũ
-------------------------------------------------- */
export const useNetwork = () => {
  const isOnline = useNetworkSelector((s) => s.isOnline);
  return { isOnline };
};
