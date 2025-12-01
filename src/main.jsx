// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

// import React from "react";
// import { createRoot } from "react-dom/client";
// import App from "./App";
// import { AppProvider } from "./context/AppContext";

// createRoot(document.getElementById("root")).render(
//   <AppProvider>
//     <App />
//   </AppProvider>
// );

// file test hoàn chỉnh cho bước 5
// src/main.jsx
// import React from "react";
// import { createRoot } from "react-dom/client";
// import "./index.css"; // hoặc file CSS gốc của bạn (nếu có)
// import TestUI from "./test/TestUI";

// // Mount vào root element của Vite (public/index.html)
// createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <TestUI />
//   </React.StrictMode>
// );
// import React from "react";
// import { createRoot } from "react-dom/client";
// import TestUI from "./test/UIContextTest";

// createRoot(document.getElementById("root")).render(<TestUI />);

// TestData.jsx để kiểm tra load/update hoạt động
// import React from "react";
// import ReactDOM from "react-dom/client";
// import { AppProvider } from "./context/AppContext"; // ✅ bắt buộc
// import TestDataSync from "./test/TestDataSync";
// import "./index.css";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <AppProvider>
//       <TestDataSync />
//     </AppProvider>
//   </React.StrictMode>
// );

// Test bước 10 – NotificationContext
// import React from "react";
// import ReactDOM from "react-dom/client";
// import { AppProvider } from "./context/AppContext";
// import { NotificationProvider } from "./context/modules/NotificationContext";
// // import TestNotification from "./test/TestNotification";
// import TestStorage from "./test/TestStorage";
// import { StorageProvider } from "./context/modules/StorageContext";
// import "./index.css";
// import TestAPI from "./test/TestAPI";
// import ToastProvider from "./components/Toast/ToastProvider";
// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <ToastProvider>
//       <AppProvider>
//         <StorageProvider>
//           <TestAPI></TestAPI>
//         </StorageProvider>
//       </AppProvider>
//     </ToastProvider>
//   </React.StrictMode>
// );

// Cấu hình main.jsx để test B15
// import React from "react";
// import { StorageProvider } from "./context/modules/StorageContext";
// import ToastProvider from "./components/Toast/ToastProvider";
// import { AppProvider } from "./context/AppContext";
// import TestCache from "./test/TestCache";
// import { CacheProvider } from "./context/modules/CacheContext";
// import ReactDOM from "react-dom/client";
// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <ToastProvider>
//       <AppProvider>
//         <StorageProvider>
//           <CacheProvider>
//             <TestCache />
//           </CacheProvider>
//         </StorageProvider>
//       </AppProvider>
//     </ToastProvider>
//   </React.StrictMode>
// );

// // Cấu hình main.jsx để test B16
// // src/main.jsx
// import React from "react";
// import ReactDOM from "react-dom/client";
// // import App from "./App.jsx";
// import "./index.css";
// import TestIntegration from "./test/TestIntegration.jsx"; // test integration
// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <TestIntegration />
//   </React.StrictMode>
// );

// B18 - Thay thế wrapper root tạm thời
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import AppRuntime from "./AppRuntime/AppRuntime";

createRoot(document.getElementById("root")).render(
  <AppRuntime options={{ lazyLoad: true, preload: false }}>
    <App />
  </AppRuntime>
);
