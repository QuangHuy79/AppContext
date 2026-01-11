// // BẢN SỬA CHUẨN STEP 8
// // SRC/context/modules/SettingsContext.jsx
// import React, {
//   createContext,
//   useReducer,
//   useEffect,
//   useContext,
//   useMemo,
//   useCallback,
// } from "react";

// /* ================================
//    1️⃣ CONTEXT – BẮT BUỘC PHẢI CÓ
// ================================ */
// export const SettingsContext = createContext(null);

// /* ================================
//    2️⃣ STORAGE KEY
// ================================ */
// const STORAGE_KEY = "app_settings";

// /* ================================
//    3️⃣ REDUCER
// ================================ */
// function settingsReducer(state, action) {
//   switch (action.type) {
//     case "SET_THEME":
//       return { ...state, theme: action.theme };
//     case "SET_LANGUAGE":
//       return { ...state, language: action.language };
//     default:
//       return state;
//   }
// }

// /* ================================
//    4️⃣ PROVIDER (CODE CỦA BẠN – GIỮ NGUYÊN)
// ================================ */
// export const SettingsProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(settingsReducer, {
//     theme: "light",
//     language: "en",
//   });

//   /* effects giữ nguyên */

//   const setTheme = useCallback(
//     (t) => dispatch({ type: "SET_THEME", theme: t }),
//     []
//   );

//   const setLanguage = useCallback(
//     (l) => dispatch({ type: "SET_LANGUAGE", language: l }),
//     []
//   );

//   const toggleTheme = useCallback(() => {
//     dispatch({
//       type: "SET_THEME",
//       theme: state.theme === "light" ? "dark" : "light",
//     });
//   }, [state.theme]);

//   const actions = useMemo(
//     () => ({ setTheme, setLanguage, toggleTheme }),
//     [setTheme, setLanguage, toggleTheme]
//   );

//   const value = useMemo(
//     () => ({ state, dispatch, ...actions }),
//     [state, actions]
//   );

//   return (
//     <SettingsContext.Provider value={value}>
//       {children}
//     </SettingsContext.Provider>
//   );
// };

// /* ================================
//    5️⃣ HOOK
// ================================ */
// export const useSettings = () => useContext(SettingsContext);

// ===========================================
// FILE FULL ĐÃ FIX — src/context/modules/SettingsContext.jsx
// src/context/modules/SettingsContext.jsx
import React, {
  createContext,
  useReducer,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";

/* --------------------------------------------------
   1️⃣ Context (STORE REF ONLY)
-------------------------------------------------- */
export const SettingsContext = createContext(null);

/* --------------------------------------------------
   2️⃣ Storage key
-------------------------------------------------- */
const STORAGE_KEY = "app_settings";

/* --------------------------------------------------
   3️⃣ Reducer (PURE)
-------------------------------------------------- */
function settingsReducer(state, action) {
  switch (action.type) {
    case "SET_THEME":
      return { ...state, theme: action.theme };

    case "SET_LANGUAGE":
      return { ...state, language: action.language };

    default:
      return state;
  }
}

/* --------------------------------------------------
   4️⃣ Provider
-------------------------------------------------- */
export const SettingsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, {
    theme: "light",
    language: "en",
  });

  /**
   * storeRef giữ snapshot mới nhất
   * → Context value không đổi khi state đổi
   */
  const storeRef = useRef(state);
  storeRef.current = state;

  /* -----------------------------
     Persistence (SAFE)
  ------------------------------ */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* silent */
    }
  }, [state]);

  /* -----------------------------
     Actions (STABLE)
  ------------------------------ */
  const setTheme = useCallback((theme) => {
    dispatch({ type: "SET_THEME", theme });
  }, []);

  const setLanguage = useCallback((language) => {
    dispatch({ type: "SET_LANGUAGE", language });
  }, []);

  const toggleTheme = useCallback(() => {
    const current = storeRef.current.theme;
    dispatch({
      type: "SET_THEME",
      theme: current === "light" ? "dark" : "light",
    });
  }, []);

  /**
   * Context value STABLE
   */
  const value = {
    storeRef,
    setTheme,
    setLanguage,
    toggleTheme,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

/* --------------------------------------------------
   5️⃣ Base Hook (INTERNAL)
-------------------------------------------------- */
function useSettingsStore() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return ctx;
}

/* --------------------------------------------------
   6️⃣ Selector Hook (PUBLIC)
-------------------------------------------------- */
export const useSettingsSelector = (selector) => {
  const { storeRef } = useSettingsStore();
  return selector(storeRef.current);
};

/* --------------------------------------------------
   7️⃣ Action Hook (PUBLIC)
-------------------------------------------------- */
export const useSettingsActions = () => {
  const { setTheme, setLanguage, toggleTheme } = useSettingsStore();
  return { setTheme, setLanguage, toggleTheme };
};

/* --------------------------------------------------
   8️⃣ Facade Hook (COMPAT)
   - dùng cho RuntimeOrchestrator
-------------------------------------------------- */
export const useSettings = () => {
  const theme = useSettingsSelector((s) => s.theme);
  const language = useSettingsSelector((s) => s.language);
  return { theme, language };
};
