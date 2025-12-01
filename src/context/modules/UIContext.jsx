// src/context/modules/UIContext.jsx
import React, { createContext, useReducer, useContext } from "react";

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

  const value = {
    state,
    dispatch,
    toast: state.toast, // ✅ trực tiếp cung cấp toast
    loading: state.loading, // ✅ trực tiếp cung cấp loading
    sidebarOpen: state.sidebarOpen,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

// ---------------------
// Hook
// ---------------------
export function useUIContext() {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUIContext must be used within UIProvider");
  return context;
}

// Hook tiện lợi để AppProvider dùng trực tiếp
export const useUI = () => useUIContext();

// ---------------------
// Exports thêm (nếu cần test)
export { initialUIState, uiReducer };

// Tóm tắt luồng chạy của UIContext.jsx chi tiết theo cách thực tế khi app sử dụng:

// 1️⃣ Khởi tạo App

// Khi UIProvider được mount lần đầu:

// useReducer(uiReducer, initialUIState) tạo ra state ban đầu:

// {
//   sidebarOpen: false,
//   toast: null,
//   loading: false
// }

// value object được tạo từ state:

// {
//   state,
//   dispatch,
//   toast: state.toast,
//   loading: state.loading,
//   sidebarOpen: state.sidebarOpen
// }

// UIContext.Provider wrap các children → tất cả component con có thể truy cập context.

// 2️⃣ Component con gọi hook

// useUI() hoặc useUIContext() được gọi:

// Lấy value từ UIContext.

// Nếu hook gọi ngoài provider → throw error.

// Trả về state, dispatch, và các shortcut (toast, loading, sidebarOpen).

// 3️⃣ Thay đổi state

// Khi component dispatch action:

// dispatch({ type: "UI/TOGGLE_SIDEBAR" })

// uiReducer nhận action, tính toán state mới:

// sidebarOpen toggle từ false → true.

// state mới cập nhật → component con dùng useUI() re-render.

// value mới được tạo (hiện tại không memo) → tất cả consumer re-render.

// 4️⃣ Render UI dựa trên context

// Components truy cập:

// const { sidebarOpen, toast, loading } = useUI();

// Sidebar component mở/đóng dựa trên sidebarOpen.

// Toast component hiển thị toast.

// Loading spinner hiển thị nếu loading === true.

// 5️⃣ Tối ưu có thể

// value object có thể memo để tránh re-render không cần thiết downstream:

// const value = useMemo(() => ({
//   state,
//   dispatch,
//   toast: state.toast,
//   loading: state.loading,
//   sidebarOpen: state.sidebarOpen,
// }), [state]);
