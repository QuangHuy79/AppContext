// // SRC/context/modules/StorageContext.jsx
// import React, { createContext, useCallback, useContext } from "react";
// import toastService from "../../services/toastService";

// export const StorageContext = createContext({
//   setItem: () => {},
//   getItem: () => {},
//   removeItem: () => {},
//   clear: () => {},
// });

// export const StorageProvider = ({ children }) => {
//   // ✅ Set item (auto stringify object)
//   const setItem = useCallback((key, value, useSession = false) => {
//     try {
//       const store = useSession ? sessionStorage : localStorage;
//       const data = typeof value === "string" ? value : JSON.stringify(value);
//       store.setItem(key, data);
//       toastService.show(
//         "success",
//         `Đã lưu ${key} vào ${useSession ? "session" : "local"} storage`,
//         "Storage"
//       );
//     } catch (err) {
//       console.error("Storage setItem error:", err);
//       toastService.show("error", `Lỗi khi lưu ${key}`, "Storage Error");
//     }
//   }, []);

//   // ✅ Get item (auto parse JSON)
//   const getItem = useCallback((key, useSession = false) => {
//     try {
//       const store = useSession ? sessionStorage : localStorage;
//       const data = store.getItem(key);
//       if (!data) return null;
//       return JSON.parse(data);
//     } catch {
//       return null; // fallback nếu không phải JSON
//     }
//   }, []);

//   // ✅ Remove item
//   const removeItem = useCallback((key, useSession = false) => {
//     try {
//       const store = useSession ? sessionStorage : localStorage;
//       store.removeItem(key);
//       toastService.show(
//         "info",
//         `Đã xóa ${key} khỏi ${useSession ? "session" : "local"} storage`,
//         "Storage"
//       );
//     } catch (err) {
//       toastService.show("error", `Không thể xóa ${key}`, "Storage Error");
//     }
//   }, []);

//   // ✅ Clear toàn bộ storage
//   const clear = useCallback((useSession = false) => {
//     try {
//       const store = useSession ? sessionStorage : localStorage;
//       store.clear();
//       toastService.show(
//         "warning",
//         `Đã xóa toàn bộ ${useSession ? "session" : "local"} storage`,
//         "Storage"
//       );
//     } catch (err) {
//       toastService.show("error", "Không thể clear storage", "Storage Error");
//     }
//   }, []);

//   // 🔹 Map thêm tên function cho IntegrationRunner
//   const saveData = setItem;
//   const getData = getItem;
//   const clearData = clear;

//   return (
//     <StorageContext.Provider
//       value={{
//         setItem,
//         getItem,
//         removeItem,
//         clear,
//         saveData,
//         getData,
//         clearData,
//       }}
//     >
//       {children}
//     </StorageContext.Provider>
//   );
// };

// export const useStorage = () => useContext(StorageContext);

// ==================================
// BẢN SỬA CHUẨN STEP 8
// SRC/context/modules/StorageContext.jsx
import React, { createContext, useCallback, useContext, useMemo } from "react";
import toastService from "../../services/toastService";

export const StorageContext = createContext({
  setItem: () => {},
  getItem: () => {},
  removeItem: () => {},
  clear: () => {},
});

export const StorageProvider = ({ children }) => {
  const setItem = useCallback((key, value, useSession = false) => {
    try {
      const store = useSession ? sessionStorage : localStorage;
      const data = typeof value === "string" ? value : JSON.stringify(value);
      store.setItem(key, data);
      toastService.show(
        "success",
        `Đã lưu ${key} vào ${useSession ? "session" : "local"} storage`,
        "Storage"
      );
    } catch (err) {
      console.error("Storage setItem error:", err);
      toastService.show("error", `Lỗi khi lưu ${key}`, "Storage Error");
    }
  }, []);

  const getItem = useCallback((key, useSession = false) => {
    try {
      const store = useSession ? sessionStorage : localStorage;
      const data = store.getItem(key);
      if (!data) return null;
      return JSON.parse(data);
    } catch {
      return null;
    }
  }, []);

  const removeItem = useCallback((key, useSession = false) => {
    try {
      const store = useSession ? sessionStorage : localStorage;
      store.removeItem(key);
      toastService.show(
        "info",
        `Đã xóa ${key} khỏi ${useSession ? "session" : "local"} storage`,
        "Storage"
      );
    } catch {
      toastService.show("error", `Không thể xóa ${key}`, "Storage Error");
    }
  }, []);

  const clear = useCallback((useSession = false) => {
    try {
      const store = useSession ? sessionStorage : localStorage;
      store.clear();
      toastService.show(
        "warning",
        `Đã xóa toàn bộ ${useSession ? "session" : "local"} storage`,
        "Storage"
      );
    } catch {
      toastService.show("error", "Không thể clear storage", "Storage Error");
    }
  }, []);

  // aliases giữ nguyên
  const saveData = setItem;
  const getData = getItem;
  const clearData = clear;

  // ✅ memoized value (STEP 8)
  const value = useMemo(
    () => ({
      setItem,
      getItem,
      removeItem,
      clear,
      saveData,
      getData,
      clearData,
    }),
    [setItem, getItem, removeItem, clear]
  );

  return (
    <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
  );
};

export const useStorage = () => useContext(StorageContext);
