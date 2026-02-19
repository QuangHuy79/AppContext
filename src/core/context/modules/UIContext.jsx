// src/context/modules/UIContext.jsx — FINAL (3.7.1 LOCKED)
import React, {
  createContext,
  useReducer,
  useContext,
  useCallback,
  useRef,
  useMemo,
} from "react";

/* --------------------------------------------------
   1️⃣ Initial UI state
-------------------------------------------------- */
const initialUIState = {
  sidebarOpen: false,
  toast: null,
  loading: false,
};

/* --------------------------------------------------
   2️⃣ Reducer (PURE)
-------------------------------------------------- */
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

/* ==================================================
   CONTEXT CONTRACT — DO NOT BREAK (PHASE 3.7.1)
   --------------------------------------------------
   - Context chỉ expose:
     • storeRef (read-only snapshot)
     • stable actions (useCallback)
   - TUYỆT ĐỐI KHÔNG:
     • expose state
     • expose dispatch
     • spread state vào value
   --------------------------------------------------
   Mọi vi phạm làm BREAK Phase 3.7 invariant
================================================== */
const UIContext = createContext(null);

/* --------------------------------------------------
   3️⃣ Provider
-------------------------------------------------- */
export function UIProvider({ children }) {
  const [state, dispatch] = useReducer(uiReducer, initialUIState);

  /**
   * storeRef giữ UI snapshot mới nhất
   * → Context value KHÔNG đổi khi state đổi
   */
  const storeRef = useRef(state);
  storeRef.current = state;

  /* -----------------------------
     Actions (STABLE)
  ------------------------------ */
  const toggleSidebar = useCallback(() => {
    dispatch({ type: "UI/TOGGLE_SIDEBAR" });
  }, []);

  const setSidebar = useCallback((open) => {
    dispatch({ type: "UI/SET_SIDEBAR", payload: open });
  }, []);

  const showToast = useCallback((toast) => {
    dispatch({ type: "UI/SHOW_TOAST", payload: toast });
  }, []);

  const clearToast = useCallback(() => {
    dispatch({ type: "UI/CLEAR_TOAST" });
  }, []);

  const setLoading = useCallback((loading) => {
    dispatch({ type: "UI/SET_LOADING", payload: loading });
  }, []);

  /**
   * 🔒 Context value LOCKED (STABLE FOREVER)
   */
  const value = useMemo(
    () => ({
      storeRef,
      toggleSidebar,
      setSidebar,
      showToast,
      clearToast,
      setLoading,
    }),
    []
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

/* --------------------------------------------------
   4️⃣ Base Hook (INTERNAL)
-------------------------------------------------- */
function useUIStore() {
  const ctx = useContext(UIContext);
  if (!ctx) {
    throw new Error("useUI must be used within UIProvider");
  }
  return ctx;
}

/* --------------------------------------------------
   5️⃣ Selector Hook (PUBLIC)
-------------------------------------------------- */
export const useUISelector = (selector) => {
  const { storeRef } = useUIStore();
  return selector(storeRef.current);
};

/* --------------------------------------------------
   6️⃣ Action Hook (PUBLIC)
-------------------------------------------------- */
export const useUIActions = () => {
  const { toggleSidebar, setSidebar, showToast, clearToast, setLoading } =
    useUIStore();

  return {
    toggleSidebar,
    setSidebar,
    showToast,
    clearToast,
    setLoading,
  };
};

/* --------------------------------------------------
   7️⃣ Facade Hook (LEGACY / RUNTIME)
-------------------------------------------------- */
export const useUI = () => {
  const loading = useUISelector((s) => s.loading);
  return { loading };
};

/* --------------------------------------------------
   8️⃣ Test exports
-------------------------------------------------- */
export { initialUIState, uiReducer };
