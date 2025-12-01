// 📁 src/components/ToastProvider/ToastContext.jsx
import React, { createContext, useReducer, useContext } from "react";

// 1️⃣ Tạo Context
const ToastContext = createContext();

// 2️⃣ Định nghĩa reducer cho toast
function toastReducer(state, action) {
  switch (action.type) {
    case "ADD_TOAST":
      return [...state, action.payload];

    case "REMOVE_TOAST":
      return state.filter((toast) => toast.id !== action.id);

    case "CLEAR_ALL":
      return [];

    default:
      return state;
  }
}

// 3️⃣ Provider component — đầu não điều khiển toast
export function ToastProvider({ children }) {
  const [toasts, dispatch] = useReducer(toastReducer, []);

  // Hàm tiện ích: thêm toast
  const addToast = (type, message, duration = 3000) => {
    const id = Date.now();
    const newToast = { id, type, message };
    dispatch({ type: "ADD_TOAST", payload: newToast });

    // Tự động xoá sau duration
    setTimeout(() => dispatch({ type: "REMOVE_TOAST", id }), duration);
  };

  // Gói API lại để các hook khác gọi dễ
  const value = {
    toasts,
    addToast,
    removeToast: (id) => dispatch({ type: "REMOVE_TOAST", id }),
    clearAll: () => dispatch({ type: "CLEAR_ALL" }),
  };

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}

// 4️⃣ Hook để dùng trong component hoặc AppContext
export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context)
    throw new Error("useToastContext must be used within a ToastProvider");
  return context;
}
