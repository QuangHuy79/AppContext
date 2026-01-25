// // // src/context/modules/StorageContext.jsx
// // import React, { createContext, useCallback, useContext, useMemo } from "react";
// // import toastService from "../../services/toastService";

// // /* --------------------------------------------------
// //    Context
// // -------------------------------------------------- */
// // export const StorageContext = createContext({
// //   setItem: () => {},
// //   getItem: () => {},
// //   removeItem: () => {},
// //   clear: () => {},
// // });

// // /* --------------------------------------------------
// //    Provider
// // -------------------------------------------------- */
// // export const StorageProvider = ({ children }) => {
// //   /* -----------------------------
// //      Set item (NO UI side-effect)
// //   ------------------------------ */
// //   const setItem = useCallback((key, value, useSession = false) => {
// //     try {
// //       const store = useSession ? sessionStorage : localStorage;
// //       const data = typeof value === "string" ? value : JSON.stringify(value);
// //       store.setItem(key, data);
// //     } catch {
// //       toastService.show(
// //         "error",
// //         `Không thể lưu dữ liệu (${key})`,
// //         "Storage Error"
// //       );
// //     }
// //   }, []);

// //   /* -----------------------------
// //      Get item (SAFE)
// //   ------------------------------ */
// //   const getItem = useCallback((key, useSession = false) => {
// //     try {
// //       const store = useSession ? sessionStorage : localStorage;
// //       const data = store.getItem(key);
// //       if (!data) return null;

// //       try {
// //         return JSON.parse(data);
// //       } catch {
// //         return data;
// //       }
// //     } catch {
// //       return null;
// //     }
// //   }, []);

// //   /* -----------------------------
// //      Remove item (NO UI side-effect)
// //   ------------------------------ */
// //   const removeItem = useCallback((key, useSession = false) => {
// //     try {
// //       const store = useSession ? sessionStorage : localStorage;
// //       store.removeItem(key);
// //     } catch {
// //       toastService.show(
// //         "error",
// //         `Không thể xóa dữ liệu (${key})`,
// //         "Storage Error"
// //       );
// //     }
// //   }, []);

// //   /* -----------------------------
// //      Clear storage
// //   ------------------------------ */
// //   const clear = useCallback((useSession = false) => {
// //     try {
// //       const store = useSession ? sessionStorage : localStorage;
// //       store.clear();
// //     } catch {
// //       toastService.show("error", "Không thể clear storage", "Storage Error");
// //     }
// //   }, []);

// //   // aliases (BACKWARD COMPAT)
// //   const saveData = setItem;
// //   const getData = getItem;
// //   const clearData = clear;

// //   /* --------------------------------------------------
// //      Memoized value (LOCKED)
// //   -------------------------------------------------- */
// //   const value = useMemo(
// //     () => ({
// //       setItem,
// //       getItem,
// //       removeItem,
// //       clear,
// //       saveData,
// //       getData,
// //       clearData,
// //     }),
// //     [setItem, getItem, removeItem, clear]
// //   );

// //   return (
// //     <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
// //   );
// // };

// // /* --------------------------------------------------
// //    Hook
// // -------------------------------------------------- */
// // export const useStorage = () => useContext(StorageContext);

// // ===================================
// // BẢN SỬA ĐỀ XUẤT (FULL FILE – SAFE)
// // src/context/modules/StorageContext.jsx
// import React, { createContext, useCallback, useContext, useMemo } from "react";
// import toastService from "../../services/toastService";

// /* --------------------------------------------------
//    Context
// -------------------------------------------------- */
// export const StorageContext = createContext({
//   setItem: () => {},
//   getItem: () => {},
//   removeItem: () => {},
//   clear: () => {},
//   setPersistedState: () => {}, // 🔐 NEW (PHASE 4)
// });

// /* --------------------------------------------------
//    Provider
// -------------------------------------------------- */
// export const StorageProvider = ({ children }) => {
//   /* -----------------------------
//      Generic storage API (UNCHANGED)
//   ------------------------------ */
//   const setItem = useCallback((key, value, useSession = false) => {
//     try {
//       const store = useSession ? sessionStorage : localStorage;
//       const data = typeof value === "string" ? value : JSON.stringify(value);
//       store.setItem(key, data);
//     } catch {
//       toastService.show(
//         "error",
//         `Không thể lưu dữ liệu (${key})`,
//         "Storage Error"
//       );
//     }
//   }, []);

//   const getItem = useCallback((key, useSession = false) => {
//     try {
//       const store = useSession ? sessionStorage : localStorage;
//       const data = store.getItem(key);
//       if (!data) return null;

//       try {
//         return JSON.parse(data);
//       } catch {
//         return data;
//       }
//     } catch {
//       return null;
//     }
//   }, []);

//   const removeItem = useCallback((key, useSession = false) => {
//     try {
//       const store = useSession ? sessionStorage : localStorage;
//       store.removeItem(key);
//     } catch {
//       toastService.show(
//         "error",
//         `Không thể xóa dữ liệu (${key})`,
//         "Storage Error"
//       );
//     }
//   }, []);

//   const clear = useCallback((useSession = false) => {
//     try {
//       const store = useSession ? sessionStorage : localStorage;
//       store.clear();
//     } catch {
//       toastService.show("error", "Không thể clear storage", "Storage Error");
//     }
//   }, []);

//   /* --------------------------------------------------
//      🔐 PHASE 4 — Persist Gate (SETTINGS ONLY)
//   -------------------------------------------------- */
//   const setPersistedState = useCallback(({ persistKey, version, settings }) => {
//     if (!persistKey || !version || !settings) return;

//     try {
//       localStorage.setItem(
//         persistKey,
//         JSON.stringify({
//           version,
//           settings,
//         })
//       );
//     } catch {
//       toastService.show(
//         "error",
//         "Không thể lưu persisted state",
//         "Storage Error"
//       );
//     }
//   }, []);

//   /* --------------------------------------------------
//      Memoized value
//   -------------------------------------------------- */
//   const value = useMemo(
//     () => ({
//       setItem,
//       getItem,
//       removeItem,
//       clear,
//       setPersistedState, // 👈 expose SAFE API
//       // backward compat
//       saveData: setItem,
//       getData: getItem,
//       clearData: clear,
//     }),
//     [setItem, getItem, removeItem, clear, setPersistedState]
//   );

//   return (
//     <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
//   );
// };

// /* --------------------------------------------------
//    Hook
// -------------------------------------------------- */
// export const useStorage = () => useContext(StorageContext);

// =================================
// src/context/modules/StorageContext.jsx
import React, { createContext, useCallback, useContext, useMemo } from "react";
import toastService from "../../services/toastService";

/* --------------------------------------------------
   Context
-------------------------------------------------- */
export const StorageContext = createContext({
  setItem: () => {},
  getItem: () => {},
  removeItem: () => {},
  clear: () => {},
});

/* --------------------------------------------------
   SSR / Runtime-safe store resolver
-------------------------------------------------- */
const getStore = (useSession) => {
  if (typeof window === "undefined") return null;
  return useSession ? sessionStorage : localStorage;
};

/* --------------------------------------------------
   Provider
-------------------------------------------------- */
export const StorageProvider = ({ children }) => {
  /* -----------------------------
     Generic storage API (PRIMITIVE ONLY)
     - NO domain knowledge
     - NO persistence policy
  ------------------------------ */
  const setItem = useCallback((key, value, useSession = false) => {
    try {
      const store = getStore(useSession);
      if (!store) return;

      const data = typeof value === "string" ? value : JSON.stringify(value);
      store.setItem(key, data);
    } catch {
      toastService.show(
        "error",
        `Không thể lưu dữ liệu (${key})`,
        "Storage Error",
      );
    }
  }, []);

  const getItem = useCallback((key, useSession = false) => {
    try {
      const store = getStore(useSession);
      if (!store) return null;

      const data = store.getItem(key);
      if (!data) return null;

      try {
        return JSON.parse(data);
      } catch {
        return data;
      }
    } catch {
      return null;
    }
  }, []);

  const removeItem = useCallback((key, useSession = false) => {
    try {
      const store = getStore(useSession);
      if (!store) return;

      store.removeItem(key);
    } catch {
      toastService.show(
        "error",
        `Không thể xóa dữ liệu (${key})`,
        "Storage Error",
      );
    }
  }, []);

  const clear = useCallback((useSession = false) => {
    try {
      const store = getStore(useSession);
      if (!store) return;

      store.clear();
    } catch {
      toastService.show("error", "Không thể clear storage", "Storage Error");
    }
  }, []);

  /* --------------------------------------------------
     Memoized value (STABLE)
  -------------------------------------------------- */
  const value = useMemo(
    () => ({
      setItem,
      getItem,
      removeItem,
      clear,

      // backward compatibility
      saveData: setItem,
      getData: getItem,
      clearData: clear,
    }),
    [setItem, getItem, removeItem, clear],
  );

  return (
    <StorageContext.Provider value={value}>{children}</StorageContext.Provider>
  );
};

/* --------------------------------------------------
   Hook
-------------------------------------------------- */
export const useStorage = () => useContext(StorageContext);
