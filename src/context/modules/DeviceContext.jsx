// // SRC/context/modules/DeviceContext.jsx
// import React, {
//   createContext,
//   useState,
//   useEffect,
//   useMemo,
//   useContext,
// } from "react";

// export const DeviceContext = createContext(null); // ✅ PHẢI export

// export const DeviceProvider = ({ children }) => {
//   const getDeviceInfo = () => {
//     const width = window.innerWidth;
//     return {
//       width,
//       height: window.innerHeight,
//       isMobile: width < 640,
//       isTablet: width >= 640 && width < 1024,
//       isDesktop: width >= 1024,
//     };
//   };

//   const [device, setDevice] = useState(getDeviceInfo());

//   useEffect(() => {
//     const handleResize = () => setDevice(getDeviceInfo());
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // const value = useMemo(() => device, [device]);
//   const value = useMemo(() => ({ deviceInfo: device }), [device]);

//   return (
//     <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>
//   );
// };

// export const useDevice = () => {
//   const context = useContext(DeviceContext);
//   if (!context) {
//     throw new Error("useDevice must be used within DeviceProvider");
//   }
//   return context;
// };

// // Luồng chạy thực tế (tóm tắt)
// // Khi App khởi chạy → getDeviceInfo() chạy để lấy kích thước hiện tại.
// // device state khởi tạo từ đó.
// // Khi user resize hoặc xoay màn hình, handleResize() được gọi → cập nhật state → re-render Provider.
// // Các component dùng useDevice() sẽ tự nhận giá trị mới (width, isMobile, v.v.).

// =========================================
// DeviceContext — FIXED (STORE REF, NO RE-RENDER)
// src/context/modules/DeviceContext.jsx — FIXED
import React, { createContext, useEffect, useContext, useRef } from "react";

/* --------------------------------------------------
   1️⃣ Context (STORE REF ONLY)
-------------------------------------------------- */
export const DeviceContext = createContext(null);

/* --------------------------------------------------
   2️⃣ Provider
-------------------------------------------------- */
export const DeviceProvider = ({ children }) => {
  const getDeviceInfo = () => {
    const width = window.innerWidth;
    return {
      width,
      height: window.innerHeight,
      isMobile: width < 640,
      isTablet: width >= 640 && width < 1024,
      isDesktop: width >= 1024,
    };
  };

  const storeRef = useRef(getDeviceInfo());

  useEffect(() => {
    const handleResize = () => {
      storeRef.current = getDeviceInfo();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /**
   * 🔒 Context value STABLE
   */
  const value = { storeRef };

  return (
    <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>
  );
};

/* --------------------------------------------------
   3️⃣ Base Hook (INTERNAL)
-------------------------------------------------- */
function useDeviceStore() {
  const ctx = useContext(DeviceContext);
  if (!ctx) {
    throw new Error("useDevice must be used within DeviceProvider");
  }
  return ctx;
}

/* --------------------------------------------------
   4️⃣ Selector Hook (PUBLIC)
-------------------------------------------------- */
export const useDeviceSelector = (selector) => {
  const { storeRef } = useDeviceStore();
  return selector(storeRef.current);
};

/* --------------------------------------------------
   5️⃣ Facade Hook (RUNTIME)
-------------------------------------------------- */
export const useDevice = () => {
  const deviceInfo = useDeviceSelector((s) => s);
  return { deviceInfo };
};
