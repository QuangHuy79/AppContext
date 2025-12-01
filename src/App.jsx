// Bản chuẩn src/App.jsx
// import React from "react";
// import { AppProvider } from "./context/AppContext";
// import { AuthProvider } from "./context/modules/AuthContext";
// import { DataProvider } from "./context/modules/DataContext";
// import { DataSyncProvider } from "./context/modules/DataSyncContext";

// // import DevPanel from "./components/DevPanel";

// // 👉 Bạn có thể đổi component test ở đây (ví dụ: TestAuth, TestDataSync,...)
// import TestDataSync from "./test/TestDataSync";
// // import TestAuth from "./test/TestAuth";
// // import TestUI from "./test/TestUI";
// // import TestData from "./test/TestData";

// export default function App() {
//   return (
//     <AppProvider>
//       <AuthProvider>
//         <DataProvider>
//           <DataSyncProvider>
//             <div style={{ padding: 20 }}>
//               <h3>Demo AppContext Modules</h3>
//               <TestDataSync />
//               <div style={{ marginTop: 20 }}>
//                 <DevPanel />
//               </div>
//             </div>
//           </DataSyncProvider>
//         </DataProvider>
//       </AuthProvider>
//     </AppProvider>
//   );
// }

// =======================================
// import React from "react";
// import { AppProvider } from "./context/AppContext";
// import SidebarToggleButton from "./components/SidebarToggleButton";
// import DevPanel from "./components/DevPanel";
// import { useToast } from "./components/Toast/ToastProvider";

// function AppContent() {
//   const { showToast } = useToast();

//   return (
//     <div style={{ padding: 20 }}>
//       <h3>Demo AppContext - Toast Test</h3>

//       <SidebarToggleButton />

//       <button
//         onClick={() => showToast("info", "This is a demo toast", "Hello!")}
//         style={{ marginTop: 10 }}
//       >
//         Show example toast
//       </button>

//       <div style={{ marginTop: 20 }}>
//         <DevPanel />
//       </div>
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <AppProvider>
//       <AppContent />
//     </AppProvider>
//   );
// }

// =================================
// import React from "react";
// import { NetworkProvider } from "./context/modules/NetworkContext";
// import { useNetwork } from "./hooks/useNetwork";

// const Status = () => {
//   const { isOnline } = useNetwork();
//   return <p>Network status: {isOnline ? "🟢 Online" : "🔴 Offline"}</p>;
// };

// export default function App() {
//   return (
//     <NetworkProvider>
//       <div style={{ padding: 20 }}>
//         <h3>Demo NetworkContext</h3>
//         <Status />
//       </div>
//     </NetworkProvider>
//   );
// }

// Test nhanh DeviceContext
// import React from "react";
// import { DeviceProvider } from "./context/modules/DeviceContext";
// import { useDevice } from "./hooks/useDevice";

// const Info = () => {
//   const { width, isMobile, isTablet, isDesktop } = useDevice();

//   return (
//     <div>
//       <p>Width: {width}px</p>
//       <p>
//         Mode: {isMobile ? "📱 Mobile" : isTablet ? "💻 Tablet" : "🖥️ Desktop"}
//       </p>
//     </div>
//   );
// };

// export default function App() {
//   return (
//     <DeviceProvider>
//       <div style={{ padding: 20 }}>
//         <h3>Demo DeviceContext</h3>
//         <Info />
//       </div>
//     </DeviceProvider>
//   );
// }

// // Test nhanh SettingsContext
// import React from "react";
// import { SettingsProvider } from "./context/modules/SettingsContext";
// import { useSettings } from "./hooks/useSettings";

// const Panel = () => {
//   const { theme, language, toggleTheme, setLanguage } = useSettings();

//   return (
//     <div>
//       <p>Theme: {theme}</p>
//       <p>Language: {language}</p>
//       <button onClick={toggleTheme}>Toggle Theme</button>
//       <button onClick={() => setLanguage(language === "en" ? "vi" : "en")}>
//         Toggle Language
//       </button>
//     </div>
//   );
// };

// export default function App() {
//   return (
//     <SettingsProvider>
//       <div style={{ padding: 20 }}>
//         <h3>Demo SettingsContext</h3>
//         <Panel />
//       </div>
//     </SettingsProvider>
//   );
// }

// // src/App.jsx (để test bước 4)
// import React from "react";
// import { AppProvider } from "./context/AppContext";
// import { AuthProvider } from "./context/modules/AuthContext";
// import TestAuth from "./test/TestAuth";

// export default function App() {
//   return (
//     <AppProvider>
//       <AuthProvider>
//         <TestAuth />
//       </AuthProvider>
//     </AppProvider>
//   );
// }

// import React from "react";
// import { AppProvider } from "./context/AppContext";
// import { NetworkProvider } from "./context/NetworkContext";
// import { DeviceProvider } from "./context/DeviceContext";
// import { SettingsProvider } from "./context/SettingsContext";
// import { UIProvider } from "./context/UIContext";
// import { APIProvider } from "./context/APIContext";
// import { ToastProvider } from "./services/toastService";

// // 🧪 Chỗ này bạn đổi import test tùy bước (ví dụ TestAPI, TestUI, TestAuth...)
// import TestAPI from "./test/TestAPI";

// function App() {
//   return (
//     <AppProvider>
//       <ToastProvider>
//         <NetworkProvider>
//           <DeviceProvider>
//             <SettingsProvider>
//               <UIProvider>
//                 <APIProvider>
//                   <div className="app-container">
//                     <h1 className="text-2xl font-bold mb-4">
//                       AppContext System
//                     </h1>
//                     <TestAPI />
//                   </div>
//                 </APIProvider>
//               </UIProvider>
//             </SettingsProvider>
//           </DeviceProvider>
//         </NetworkProvider>
//       </ToastProvider>
//     </AppProvider>
//   );
// }

// export default App;

// src/App.jsx
// import React from "react";
// import { AppProvider } from "./context/AppContext";
// import { NetworkProvider } from "./context/NetworkContext";
// import { DeviceProvider } from "./context/DeviceContext";
// import { SettingsProvider } from "./context/SettingsContext";
// import { UIProvider } from "./context/UIContext";
// import { APIProvider } from "./context/modules/APIContext";
// import { ToastProvider } from "./services/toastService";

// import TestAPI from "./test/TestAPI";

// function App() {
//   return (
//     <AppProvider>
//       <ToastProvider>
//         <NetworkProvider>
//           <DeviceProvider>
//             <SettingsProvider>
//               <UIProvider>
//                 {/* ⬇️ Đảm bảo APIProvider bọc TestAPI ở trong đây */}
//                 <APIProvider>
//                   <div className="app-container">
//                     <h1 className="text-2xl font-bold mb-4">
//                       AppContext System
//                     </h1>
//                     <TestAPI />
//                   </div>
//                 </APIProvider>
//               </UIProvider>
//             </SettingsProvider>
//           </DeviceProvider>
//         </NetworkProvider>
//       </ToastProvider>
//     </AppProvider>
//   );
// }

// export default App;

// import React from "react";
// import { AppProvider } from "./context/AppContext";
// import { NetworkProvider } from "./context/NetworkContext";
// import { DeviceProvider } from "./context/DeviceContext";
// import { SettingsProvider } from "./context/SettingsContext";
// import { UIProvider } from "./context/UIContext";
// import { APIProvider } from "./context/APIContext";
// import ToastProvider from "./components/Toast/ToastProvider"; // ✅ dùng đúng ToastProvider

// import TestAPI from "./test/TestAPI";

// function App() {
//   return (
//     <ToastProvider>
//       {" "}
//       {/* ✅ ToastProvider nằm ngoài AppProvider */}
//       <AppProvider>
//         <NetworkProvider>
//           <DeviceProvider>
//             <SettingsProvider>
//               <UIProvider>
//                 <APIProvider>
//                   <div className="app-container">
//                     <h1 className="text-2xl font-bold mb-4">
//                       AppContext System
//                     </h1>
//                     <TestAPI />
//                   </div>
//                 </APIProvider>
//               </UIProvider>
//             </SettingsProvider>
//           </DeviceProvider>
//         </NetworkProvider>
//       </AppProvider>
//     </ToastProvider>
//   );
// }

// export default App;

// =========================
// src/App.jsx
// import React from "react";
// import { AppProvider } from "./context/AppContext";
// import ToastProvider from "./components/Toast/ToastProvider";
// import TestAPI from "./test/TestAPI";

// function App() {
//   return (
//     <ToastProvider>
//       <AppProvider>
//         <div className="app-container">
//           <h1 className="text-2xl font-bold mb-4">AppContext System</h1>
//           {/* <TestAPI /> */}
//           <TestAPI />
//         </div>
//       </AppProvider>
//     </ToastProvider>
//   );
// }

// export default App;

// Test tạm trong App.jsx B16
// import React from "react";
// import { AppProvider } from "./context/AppContext";
// import { StatePersistenceProvider } from "./context/StatePersistenceContext";
// import TestStatePersistence from "./test/TestStatePersistence";

// function App() {
//   // return (
//   //   <StatePersistenceProvider>
//   //     <AppProvider>
//   //       <div style={{ padding: 24 }}>
//   //         <h2>🔍 Test StatePersistenceContext</h2>
//   //         <p>
//   //           Nếu bạn thấy dòng này hiển thị mà không báo lỗi console, context
//   //           hoạt động (placeholder version).
//   //         </p>
//   //         <p>
//   //           Bước kế tiếp: thêm logic lưu & khôi phục state trong localStorage.
//   //         </p>
//   //       </div>
//   //     </AppProvider>
//   //   </StatePersistenceProvider>
//   // );
//   return (
//     <AppProvider>
//       <StatePersistenceProvider>
//         <TestStatePersistence />
//       </StatePersistenceProvider>
//     </AppProvider>
//   );
// }

// export default App;

// Cấu trúc chuẩn App.jsx (phiên bản mới nhất, tương thích với json-server:3001) Test B17
// src/App.jsx
// import React from "react";
// import { AppProvider } from "./context/AppContext";
// import { StatePersistenceProvider } from "./context/StatePersistenceContext";

// // 🧪 Component test cho APIContext
// import { useAPI } from "./context/APIContext/APIContext";

// const APITest = () => {
//   const { get, post, loading } = useAPI();
//   const [posts, setPosts] = React.useState([]);

//   const fetchPosts = async () => {
//     try {
//       const data = await get("/posts");
//       setPosts(data);
//     } catch (err) {
//       console.error("API Error:", err);
//     }
//   };

//   const createPost = async () => {
//     try {
//       const newPost = { title: "Bài mới", body: "Được tạo từ UI test" };
//       await post("/posts", newPost);
//       await fetchPosts(); // refresh list
//     } catch (err) {
//       console.error("Post Error:", err);
//     }
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>🌐 Test APIContext với json-server:3001</h2>
//       <button onClick={fetchPosts} disabled={loading}>
//         {loading ? "Đang tải..." : "🔍 Fetch Posts"}
//       </button>
//       <button onClick={createPost} style={{ marginLeft: 10 }}>
//         ➕ Thêm Post
//       </button>

//       <ul style={{ marginTop: 20 }}>
//         {posts.map((p) => (
//           <li key={p.id}>
//             <b>{p.title}</b> — {p.body}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default function App() {
//   return (
//     <AppProvider>
//       <StatePersistenceProvider>
//         <APITest />
//       </StatePersistenceProvider>
//     </AppProvider>
//   );
// }

// Cách đơn giản nhất để chạy TestIntegration.jsx
import React from "react";
import TestIntegration from "./test/TestIntegration";

export default function App() {
  return <TestIntegration />;
}
