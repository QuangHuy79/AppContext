// // SRC/context/modules/NetworkContext.jsx
// import React, {
//   createContext,
//   useState,
//   useEffect,
//   useMemo,
//   useContext,
// } from "react";

// // ✅ 1️⃣ Khởi tạo NetworkContext với giá trị mặc định (isOnline: true)
// export const NetworkContext = createContext({
//   isOnline: true,
// });

// export const NetworkProvider = ({ children }) => {
//   // ✅ 2️⃣ Tạo state isOnline và khởi tạo theo trạng thái thật của trình duyệt
//   // navigator.onLine = true nếu có mạng, false nếu mất mạng
//   const [isOnline, setIsOnline] = useState(navigator.onLine);

//   useEffect(() => {
//     // ✅ 3️⃣ Định nghĩa 2 handler cập nhật state khi trạng thái mạng thay đổi
//     const handleOnline = () => setIsOnline(true);
//     const handleOffline = () => setIsOnline(false);

//     // ✅ 4️⃣ Lắng nghe 2 sự kiện global: "online" & "offline"
//     // Khi người dùng bật/tắt mạng, 2 event này được bắn ra
//     window.addEventListener("online", handleOnline);
//     window.addEventListener("offline", handleOffline);

//     // ✅ 5️⃣ Cleanup: gỡ bỏ listener khi component unmount
//     return () => {
//       window.removeEventListener("online", handleOnline);
//       window.removeEventListener("offline", handleOffline);
//     };
//   }, []); // chạy 1 lần khi mount

//   // ✅ 6️⃣ Dùng useMemo để tránh re-render không cần thiết
//   // Mỗi khi isOnline thay đổi → value mới được memo lại
//   const value = useMemo(() => ({ isOnline }), [isOnline]);

//   // ✅ 7️⃣ Cung cấp giá trị context xuống toàn app
//   return (
//     <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
//   );
// };

// // ✅ 8️⃣ Custom hook để dễ truy cập NetworkContext
// // Component khác chỉ cần gọi useNetwork() là có isOnline
// export const useNetwork = () => useContext(NetworkContext);

// =============================================
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
