import React, {
  createContext,
  useReducer,
  useEffect,
  useContext,
  useMemo,
} from "react";

// ----------------------------------
// 1️⃣ Default context
// ----------------------------------
export const SettingsContext = createContext({
  state: {
    theme: "light",
    language: "en",
  },
  dispatch: () => {},
});

// ----------------------------------
// 2️⃣ Storage key
// ----------------------------------
const STORAGE_KEY = "app_settings";

// ----------------------------------
// 3️⃣ Reducer
// ----------------------------------
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

// ----------------------------------
// 4️⃣ Provider chính
// ----------------------------------
export const SettingsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, {
    theme: "light",
    language: "en",
  });

  // ----------------------------------
  // 5️⃣ Load từ localStorage khi khởi động
  // ----------------------------------
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (saved) {
        if (saved.theme) dispatch({ type: "SET_THEME", theme: saved.theme });

        if (saved.language)
          dispatch({ type: "SET_LANGUAGE", language: saved.language });
      }
    } catch (err) {
      console.warn("Failed to load settings", err);
    }
  }, []);

  // ----------------------------------
  // 6️⃣ Lưu vào localStorage khi thay đổi
  // ----------------------------------
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state.theme, state.language]);

  // ----------------------------------
  // 7️⃣ Áp theme vào document
  // ----------------------------------
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", state.theme);
  }, [state.theme]);

  // ----------------------------------
  // 8️⃣ API tiện dụng: chỉ memo hóa functions
  // ----------------------------------
  const actions = useMemo(
    () => ({
      setTheme: (t) => dispatch({ type: "SET_THEME", theme: t }),
      setLanguage: (l) => dispatch({ type: "SET_LANGUAGE", language: l }),
      toggleTheme: () =>
        dispatch({
          type: "SET_THEME",
          theme: state.theme === "light" ? "dark" : "light",
        }),
    }),
    [state.theme]
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

// ----------------------------------
// 9️⃣ Hook tiện dụng
// ----------------------------------
export const useSettings = () => useContext(SettingsContext);

// ⚙️ Luồng chạy thực tế (rất dễ hiểu)
// App mount → SettingsProvider chạy.
// useEffect đầu tiên đọc localStorage["app_settings"] → nếu có dữ liệu, set lại theme và language.
// Khi user đổi theme hoặc language → useEffect thứ hai tự lưu lại vào localStorage.
// useEffect thứ ba áp dụng theme vào DOM (<html data-theme="dark">) để CSS có thể áp dụng theme.
// value được memo hóa để tránh render lại toàn bộ cây khi state không đổi.
// Bất kỳ component nào gọi useSettings() đều truy cập được theme, language, hoặc gọi toggleTheme().
