import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import ToastItem from "./ToastItem";
import "./ToastProvider.scss";
import toastService from "../../services/toastService"; // <- import service

const ToastContext = createContext();

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

export default function ToastProvider({ children, position = "top-right" }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((type, message, title, duration = 3000) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const newToast = { id, type, title, message, duration };
    setToasts((prev) => [...prev, newToast]);

    // Auto-remove after duration (local safety too)
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Register service on mount, unregister on unmount
  useEffect(() => {
    toastService.__register(showToast, removeToast);
    return () => {
      toastService.__unregister();
    };
  }, [showToast, removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast, toasts }}>
      {children}
      <div className={`toast-container ${position}`}>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} {...toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
