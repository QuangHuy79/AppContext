// // src/test/TestUI.jsx
// import React from "react";
// import { AppProvider } from "../context/AppContext";
// import { useUI } from "../hooks/useUI";

// function UITest() {
//   const { sidebarOpen, toggleSidebar, showToast, setLoading, loading } =
//     useUI();

//   return (
//     <div style={{ padding: 24, fontFamily: "sans-serif" }}>
//       <h2>🧩 UIContext Test</h2>

//       <div style={{ marginTop: 16 }}>
//         <h4>Sidebar</h4>
//         <p>Sidebar: {sidebarOpen ? "✅ Open" : "❌ Closed"}</p>
//         <button onClick={toggleSidebar}>Toggle Sidebar</button>
//       </div>

//       <div style={{ marginTop: 16 }}>
//         <h4>Loading</h4>
//         <p>{loading ? "⏳ App is loading..." : "✅ Idle"}</p>
//         <button onClick={() => setLoading(!loading)}>Toggle Loading</button>
//       </div>

//       <div style={{ marginTop: 16 }}>
//         <h4>Toast</h4>
//         <button
//           onClick={() =>
//             showToast({ type: "success", message: "Success toast" })
//           }
//         >
//           Show Success Toast
//         </button>
//         <button
//           onClick={() => showToast({ type: "error", message: "Error toast" })}
//           style={{ marginLeft: 10 }}
//         >
//           Show Error Toast
//         </button>
//         <button
//           onClick={() => showToast({ type: "info", message: "Info toast" })}
//           style={{ marginLeft: 10 }}
//         >
//           Show Info Toast
//         </button>
//       </div>
//     </div>
//   );
// }

// export default function TestUI() {
//   return (
//     <AppProvider>
//       <UITest />
//     </AppProvider>
//   );
// }

// ========================
import React from "react";
import { AppProvider } from "../context/AppContext"; // đường dẫn chính xác
import UIContextTest from "./UIContextTest"; // file test UIContext của bạn

export default function TestUI() {
  return (
    <AppProvider>
      <div style={{ padding: 20 }}>
        <h2>🎨 Test UIContext + Toast</h2>
        <UIContextTest />
      </div>
    </AppProvider>
  );
}
