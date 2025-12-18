// import React, { Suspense } from "react";
// import AppRuntimeWrapper from "./runtime/AppRuntimeWrapper";
// import ToastProvider from "./components/Toast/ToastProvider";
// import "./App.css";

// export default function App() {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <ToastProvider>
//         <AppRuntimeWrapper />
//       </ToastProvider>
//     </Suspense>
//   );
// }

// // ===================================
// // App.jsx — mount runtime wrapper/client (chỉ 1 điểm mount)
// // src/App.jsx
// import React, { Suspense } from "react";
// import AppRuntimeClient from "./runtime/AppRuntimeClient"; // đường dẫn bạn đang dùng
// import "./App.css";

// export default function App() {
//   return (
//     <Suspense fallback={<div>Loading app runtime…</div>}>
//       <AppRuntimeClient>
//         {/* App children: ví dụ Router, Pages */}
//         <div id="app-root">{/* Nếu bạn có Router, đặt ở đây */}</div>
//         <div style={{ padding: 40, fontSize: 24 }}>APP RENDER OK</div>
//       </AppRuntimeClient>
//     </Suspense>
//   );
// }

// ==========================================
// import AppRuntime from "./runtime/AppRuntime";

// export default function App() {
//   return (
//     <AppRuntime>
//       <div>APP RENDER OK</div>
//     </AppRuntime>
//   );
// }

// ==============================================
import AppRuntimeClient from "./runtime/AppRuntimeClient";

export default function App() {
  return (
    <AppRuntimeClient>
      <div>APP RENDER OK</div>
    </AppRuntimeClient>
  );
}
