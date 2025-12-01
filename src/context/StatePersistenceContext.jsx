// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useCallback,
//   useRef,
// } from "react";
// import { useApp } from "./AppContext";

// const StatePersistenceContext = createContext();

// const STORAGE_KEY = "APP_STATE_V1";
// const DEBOUNCE_DELAY = 400; // ms

// export const StatePersistenceProvider = ({ children }) => {
//   console.log("[DEBUG] StatePersistenceProvider mounted 🧩");
//   const { appState, dispatch } = useApp();
//   const saveTimeout = useRef(null);

//   // --- Load persisted state on mount ---
//   useEffect(() => {
//     try {
//       const saved = localStorage.getItem(STORAGE_KEY);
//       if (saved) {
//         const parsed = JSON.parse(saved);
//         dispatch({ type: "HYDRATE_APP_STATE", payload: parsed });
//         console.info(
//           "[StatePersistence] AppState restored from localStorage ✅"
//         );
//       }
//     } catch (err) {
//       console.error("[StatePersistence] Error loading state:", err);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // --- Debounced save to localStorage ---
//   useEffect(() => {
//     if (!appState) return;

//     if (saveTimeout.current) clearTimeout(saveTimeout.current);

//     saveTimeout.current = setTimeout(() => {
//       try {
//         localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
//         console.info("[StatePersistence] AppState saved to localStorage 💾");
//       } catch (err) {
//         console.error("[StatePersistence] Error saving state:", err);
//       }
//     }, DEBOUNCE_DELAY);

//     return () => clearTimeout(saveTimeout.current);
//   }, [appState]);

//   // --- Clear persisted state manually ---
//   const clearPersistedState = useCallback(() => {
//     localStorage.removeItem(STORAGE_KEY);
//     console.info("[StatePersistence] Cleared persisted AppState 🗑️");
//   }, []);

//   const value = {
//     clearPersistedState,
//   };

//   return (
//     <StatePersistenceContext.Provider value={value}>
//       {children}
//     </StatePersistenceContext.Provider>
//   );
// };

// export const useStatePersistence = () => useContext(StatePersistenceContext);

// ==========================
import React, { createContext, useContext, useEffect, useRef } from "react";
import { useApp } from "./AppContext";

// Context rỗng (chủ yếu để có Provider cho tương lai nếu mở rộng)
const StatePersistenceContext = createContext();

export const StatePersistenceProvider = ({ children }) => {
  const { state, dispatch } = useApp();
  const isRestored = useRef(false);
  const saveTimeout = useRef(null);

  // // --- 1️⃣ Khôi phục state từ localStorage khi mount ---
  // useEffect(() => {
  //   console.log("[DEBUG] StatePersistenceProvider mounted 🧩");

  //   try {
  //     const saved = localStorage.getItem("app_state");
  //     if (saved) {
  //       const parsed = JSON.parse(saved);
  //       console.log("[DEBUG] Restoring app_state from localStorage:", parsed);

  //       dispatch({
  //         type: "HYDRATE_APP_STATE",
  //         payload: parsed,
  //       });
  //       isRestored.current = true;
  //     } else {
  //       console.log("[DEBUG] No saved app_state found in localStorage.");
  //     }
  //   } catch (err) {
  //     console.error("[ERROR] Failed to restore app_state:", err);
  //   }
  // }, [dispatch]);
  useEffect(() => {
    console.log("[DEBUG] StatePersistenceProvider mounted 🧩");

    try {
      const saved = localStorage.getItem("app_state");
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log("[DEBUG] Restoring app_state from localStorage:", parsed);
        dispatch({
          type: "HYDRATE_APP_STATE",
          payload: parsed,
        });
        isRestored.current = true;
      } else {
        console.log("[DEBUG] No saved app_state found in localStorage.");
        // ✅ Cho phép lưu state mới ngay từ đầu
        isRestored.current = true;
      }
    } catch (err) {
      console.error("[ERROR] Failed to restore app_state:", err);
    }
  }, [dispatch]);

  // --- 2️⃣ Lưu state vào localStorage mỗi khi thay đổi ---
  useEffect(() => {
    // tránh ghi khi state chưa khôi phục xong
    if (!isRestored.current) return;

    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      try {
        localStorage.setItem("app_state", JSON.stringify(state));
        console.log("[DEBUG] Saved app_state to localStorage:", state);
      } catch (err) {
        console.error("[ERROR] Failed to save app_state:", err);
      }
    }, 500); // debounce 500ms
  }, [state]);

  // cleanup khi unmount
  useEffect(() => {
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, []);

  return (
    <StatePersistenceContext.Provider value={{}}>
      {children}
    </StatePersistenceContext.Provider>
  );
};

// Hook (chuẩn bị cho mở rộng)
export const useStatePersistence = () => useContext(StatePersistenceContext);
