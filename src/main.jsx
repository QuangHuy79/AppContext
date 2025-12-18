// Code mẫu tích hợp (dùng AppRuntimeClient)
// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx"; // hoặc AppRuntimeClient nếu bạn mount trực tiếp runtime

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
