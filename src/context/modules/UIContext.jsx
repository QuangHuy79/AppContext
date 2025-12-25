// // src/context/modules/UIContext.jsx
// import React, { createContext, useReducer, useContext } from "react";

// // ---------------------
// // Initial UI state
// // ---------------------
// const initialUIState = {
//   sidebarOpen: false,
//   toast: null,
//   loading: false,
// };

// // ---------------------
// // Reducer
// // ---------------------
// function uiReducer(state, action) {
//   switch (action.type) {
//     case "UI/TOGGLE_SIDEBAR":
//       return { ...state, sidebarOpen: !state.sidebarOpen };
//     case "UI/SET_SIDEBAR":
//       return { ...state, sidebarOpen: action.payload };
//     case "UI/SHOW_TOAST":
//       return { ...state, toast: action.payload };
//     case "UI/CLEAR_TOAST":
//       return { ...state, toast: null };
//     case "UI/SET_LOADING":
//       return { ...state, loading: action.payload };
//     default:
//       return state;
//   }
// }

// // ---------------------
// // Context
// // ---------------------
// const UIContext = createContext(null);

// // ---------------------
// // Provider
// // ---------------------
// export function UIProvider({ children }) {
//   const [state, dispatch] = useReducer(uiReducer, initialUIState);
//   const [logs, setLogs] = React.useState([]);

//   // ⭐ log function
//   const log = (message) => {
//     setLogs((prev) => [...prev, message]);
//     console.debug("[UI]", message); // log ra console
//   };
//   const value = {
//     state,
//     dispatch,
//     toast: state.toast, // ✅ trực tiếp cung cấp toast
//     loading: state.loading, // ✅ trực tiếp cung cấp loading
//     sidebarOpen: state.sidebarOpen,
//     log, // ⬅ thêm log function
//     logs, // optional: giữ lại log history
//   };

//   return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
// }

// // ---------------------
// // Hook
// // ---------------------
// export function useUIContext() {
//   const context = useContext(UIContext);
//   if (!context) throw new Error("useUIContext must be used within UIProvider");
//   return context;
// }

// // Hook tiện lợi để AppProvider dùng trực tiếp
// export const useUI = () => useUIContext();

// // ---------------------
// // Exports thêm (nếu cần test)
// export { initialUIState, uiReducer };

// =============================================
// BẢN SỬA CHUẨN STEP 8
// src/context/modules/UIContext.jsx
import React, {
  createContext,
  useReducer,
  useContext,
  useMemo,
  useCallback,
  useState,
} from "react";

// ---------------------
// Initial UI state
// ---------------------
const initialUIState = {
  sidebarOpen: false,
  toast: null,
  loading: false,
};

// ---------------------
// Reducer
// ---------------------
function uiReducer(state, action) {
  switch (action.type) {
    case "UI/TOGGLE_SIDEBAR":
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case "UI/SET_SIDEBAR":
      return { ...state, sidebarOpen: action.payload };
    case "UI/SHOW_TOAST":
      return { ...state, toast: action.payload };
    case "UI/CLEAR_TOAST":
      return { ...state, toast: null };
    case "UI/SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

// ---------------------
// Context
// ---------------------
const UIContext = createContext(null);

// ---------------------
// Provider
// ---------------------
export function UIProvider({ children }) {
  const [state, dispatch] = useReducer(uiReducer, initialUIState);
  const [logs, setLogs] = useState([]);

  // ✅ stable log function
  const log = useCallback((message) => {
    setLogs((prev) => [...prev, message]);
    console.debug("[UI]", message);
  }, []);

  // ✅ memoized value (STEP 8 requirement)
  const value = useMemo(
    () => ({
      state,
      dispatch,
      toast: state.toast,
      loading: state.loading,
      sidebarOpen: state.sidebarOpen,
      log,
      logs,
    }),
    [state, log, logs]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

// ---------------------
// Hooks
// ---------------------
export function useUIContext() {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUIContext must be used within UIProvider");
  return context;
}

export const useUI = () => useUIContext();

// ---------------------
// Exports thêm (giữ nguyên cho test)
export { initialUIState, uiReducer };
