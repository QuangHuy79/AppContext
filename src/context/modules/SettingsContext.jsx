// // SRC/context/modules/SettingsContext.jsx
// import React, {
//   createContext,
//   useReducer,
//   useEffect,
//   useContext,
//   useMemo,
// } from "react";

// // ----------------------------------
// // 1️⃣ Default context
// // ----------------------------------
// export const SettingsContext = createContext({
//   state: {
//     theme: "light",
//     language: "en",
//   },
//   dispatch: () => {},
// });

// // ----------------------------------
// // 2️⃣ Storage key
// // ----------------------------------
// const STORAGE_KEY = "app_settings";

// // ----------------------------------
// // 3️⃣ Reducer
// // ----------------------------------
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

// // ----------------------------------
// // 4️⃣ Provider chính
// // ----------------------------------
// export const SettingsProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(settingsReducer, {
//     theme: "light",
//     language: "en",
//   });

//   // ----------------------------------
//   // 5️⃣ Load từ localStorage khi khởi động
//   // ----------------------------------
//   useEffect(() => {
//     try {
//       const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
//       if (saved) {
//         if (saved.theme) dispatch({ type: "SET_THEME", theme: saved.theme });

//         if (saved.language)
//           dispatch({ type: "SET_LANGUAGE", language: saved.language });
//       }
//     } catch (err) {
//       console.warn("Failed to load settings", err);
//     }
//   }, []);

//   // ----------------------------------
//   // 6️⃣ Lưu vào localStorage khi thay đổi
//   // ----------------------------------
//   useEffect(() => {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
//   }, [state.theme, state.language]);

//   // ----------------------------------
//   // 7️⃣ Áp theme vào document
//   // ----------------------------------
//   useEffect(() => {
//     document.documentElement.setAttribute("data-theme", state.theme);
//   }, [state.theme]);

//   // ----------------------------------
//   // 8️⃣ API tiện dụng: chỉ memo hóa functions
//   // ----------------------------------
//   const actions = useMemo(
//     () => ({
//       setTheme: (t) => dispatch({ type: "SET_THEME", theme: t }),
//       setLanguage: (l) => dispatch({ type: "SET_LANGUAGE", language: l }),
//       toggleTheme: () =>
//         dispatch({
//           type: "SET_THEME",
//           theme: state.theme === "light" ? "dark" : "light",
//         }),
//     }),
//     [state.theme]
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

// // ----------------------------------
// // 9️⃣ Hook tiện dụng
// // ----------------------------------
// export const useSettings = () => useContext(SettingsContext);

// ===========================
// BẢN SỬA CHUẨN STEP 8
// SRC/context/modules/SettingsContext.jsx
import React, {
  createContext,
  useReducer,
  useEffect,
  useContext,
  useMemo,
  useCallback,
} from "react";

/* ================================
   1️⃣ CONTEXT – BẮT BUỘC PHẢI CÓ
================================ */
export const SettingsContext = createContext(null);

/* ================================
   2️⃣ STORAGE KEY
================================ */
const STORAGE_KEY = "app_settings";

/* ================================
   3️⃣ REDUCER
================================ */
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

/* ================================
   4️⃣ PROVIDER (CODE CỦA BẠN – GIỮ NGUYÊN)
================================ */
export const SettingsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, {
    theme: "light",
    language: "en",
  });

  /* effects giữ nguyên */

  const setTheme = useCallback(
    (t) => dispatch({ type: "SET_THEME", theme: t }),
    []
  );

  const setLanguage = useCallback(
    (l) => dispatch({ type: "SET_LANGUAGE", language: l }),
    []
  );

  const toggleTheme = useCallback(() => {
    dispatch({
      type: "SET_THEME",
      theme: state.theme === "light" ? "dark" : "light",
    });
  }, [state.theme]);

  const actions = useMemo(
    () => ({ setTheme, setLanguage, toggleTheme }),
    [setTheme, setLanguage, toggleTheme]
  );

  const value = useMemo(
    () => ({ state, dispatch, ...actions }),
    [state, actions]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

/* ================================
   5️⃣ HOOK
================================ */
export const useSettings = () => useContext(SettingsContext);
