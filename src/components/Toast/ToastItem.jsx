import React, { useEffect } from "react";

const icons = {
  success: "✅",
  error: "❌",
  info: "ℹ️",
  warning: "⚠️",
};

export default function ToastItem({
  id,
  type,
  title,
  message,
  onClose,
  duration = 3000,
}) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <div className={`toast ${type}`}>
      <div className="icon">{icons[type] || "🔔"}</div>
      <div className="content">
        {title && <div className="title">{title}</div>}
        <div className="message">{message}</div>
      </div>
      <button className="close-btn" onClick={() => onClose(id)}>
        ✖
      </button>
    </div>
  );
}
