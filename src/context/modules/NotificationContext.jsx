// src/context/modules/NotificationContext.jsx
import React, { createContext, useContext, useState, useCallback } from "react";
import toastService from "../../services/toastService";

export const NotificationContext = createContext({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
  markAsRead: () => {},
  clearAll: () => {},
});

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((type, message, title) => {
    const newNotification = {
      id: Date.now(),
      type,
      message,
      title,
      read: false,
      time: new Date().toLocaleTimeString(),
    };
    setNotifications((prev) => [newNotification, ...prev]);

    // Hiển thị toast luôn (tức thời)
    toastService.show(type, message, title);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        markAsRead,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

// 🔥 Tóm tắt luồng chạy NotificationContext
// AppRuntime → bọc <NotificationProvider>

// Khi module khác gọi:

// addNotification(type, message, title)
// → tạo object → prepend vào array → show toast

// UI có thể đọc:

// const { notifications } = useNotification();
// Các hành động khác:

// remove → filter

// markAsRead → map update

// clearAll → reset state

// ➡ Không re-render thừa, không memory leak, không infinite loop.
