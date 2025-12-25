// // src/context/modules/NotificationContext.jsx
// import React, { createContext, useContext, useState, useCallback } from "react";
// import toastService from "../../services/toastService";

// export const NotificationContext = createContext({
//   notifications: [],
//   addNotification: () => {},
//   removeNotification: () => {},
//   markAsRead: () => {},
//   clearAll: () => {},
// });

// export const NotificationProvider = ({ children }) => {
//   const [notifications, setNotifications] = useState([]);

//   const addNotification = useCallback((type, message, title) => {
//     const newNotification = {
//       id: Date.now(),
//       type,
//       message,
//       title,
//       read: false,
//       time: new Date().toLocaleTimeString(),
//     };
//     setNotifications((prev) => [newNotification, ...prev]);

//     // Hiển thị toast luôn (tức thời)
//     toastService.show(type, message, title);
//   }, []);

//   const removeNotification = useCallback((id) => {
//     setNotifications((prev) => prev.filter((n) => n.id !== id));
//   }, []);

//   const markAsRead = useCallback((id) => {
//     setNotifications((prev) =>
//       prev.map((n) => (n.id === id ? { ...n, read: true } : n))
//     );
//   }, []);

//   const clearAll = useCallback(() => {
//     setNotifications([]);
//   }, []);

//   return (
//     <NotificationContext.Provider
//       value={{
//         notifications,
//         addNotification,
//         removeNotification,
//         markAsRead,
//         clearAll,
//       }}
//     >
//       {children}
//     </NotificationContext.Provider>
//   );
// };

// export const useNotification = () => {
//   const context = useContext(NotificationContext);
//   if (!context) {
//     throw new Error(
//       "useNotification must be used within a NotificationProvider"
//     );
//   }
//   return context;
// };

// =====================================
// BẢN FIX CHUẨN — NotificationContext.jsx
// src/context/modules/NotificationContext.jsx
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from "react";

/* --------------------------------------------------
   1️⃣ Context
-------------------------------------------------- */
export const NotificationContext = createContext(null);

/* --------------------------------------------------
   2️⃣ Initial State
-------------------------------------------------- */
const initialState = {
  notifications: [],
};

/* --------------------------------------------------
   3️⃣ Reducer
-------------------------------------------------- */
function notificationReducer(state, action) {
  switch (action.type) {
    case "NOTIFICATION/ADD":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };

    case "NOTIFICATION/REMOVE":
      return {
        ...state,
        notifications: state.notifications.filter(
          (n) => n.id !== action.payload
        ),
      };

    case "NOTIFICATION/MARK_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };

    case "NOTIFICATION/CLEAR_ALL":
      return initialState;

    default:
      return state;
  }
}

/* --------------------------------------------------
   4️⃣ Provider
-------------------------------------------------- */
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  /* -----------------------------
     Add notification (NO UI)
  ------------------------------ */
  const addNotification = useCallback(({ type, message, title }) => {
    const notification = {
      id: Date.now(),
      type,
      message,
      title,
      read: false,
      timestamp: Date.now(),
    };
    dispatch({ type: "NOTIFICATION/ADD", payload: notification });
    return notification;
  }, []);

  const removeNotification = useCallback((id) => {
    dispatch({ type: "NOTIFICATION/REMOVE", payload: id });
  }, []);

  const markAsRead = useCallback((id) => {
    dispatch({ type: "NOTIFICATION/MARK_READ", payload: id });
  }, []);

  const clearAll = useCallback(() => {
    dispatch({ type: "NOTIFICATION/CLEAR_ALL" });
  }, []);

  /* --------------------------------------------------
     Memoized value
  -------------------------------------------------- */
  const value = useMemo(
    () => ({
      notifications: state.notifications,
      addNotification,
      removeNotification,
      markAsRead,
      clearAll,
    }),
    [
      state.notifications,
      addNotification,
      removeNotification,
      markAsRead,
      clearAll,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

/* --------------------------------------------------
   5️⃣ Hook (SAFE)
-------------------------------------------------- */
export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return ctx;
};
