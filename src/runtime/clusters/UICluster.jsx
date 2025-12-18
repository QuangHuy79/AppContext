// // GIẢI PHÁP: UICluster v2 chính xác cho Step 7
// // UICluster chỉ được phép chứa:
// // UI initialization logic
// // UI hooks orchestration
// // Theme / Layout pre-processing
// // Không được chứa provider
// // Không được lồng context
// // Không được tạo dependency ngược giữa cluster ↔ AppRuntimeClient
// // 👉 Đây là UICluster phiên bản đúng:
// // ✅ UICluster.jsx – Phiên bản Step 7 (ĐÚNG KIẾN TRÚC APPRUNTIME v2)
// // src/runtime/clusters/UICluster.jsx
// import React, { useEffect } from "react";
// import { useSettings } from "../../context/modules/SettingsContext";
// import { useUI } from "../../context/modules/UIContext";

// /*
//   UICluster không được wrap provider.
//   Chỉ thực hiện:
//   - Orchestrate UI lifecycle
//   - Sync theme
//   - Apply global classes
//   - Run UI effects
// */

// export default function UICluster({ children }) {
//   const { settings } = useSettings();
//   const { ui } = useUI();

//   useEffect(() => {
//     // Sync theme vào HTML
//     const theme = settings.theme || "light";
//     document.documentElement.setAttribute("data-theme", theme);
//   }, [settings.theme]);

//   useEffect(() => {
//     if (ui.loading) {
//       document.body.classList.add("app-loading");
//     } else {
//       document.body.classList.remove("app-loading");
//     }
//   }, [ui.loading]);

//   return <>{children}</>;
// }

// =================================
import React, { useEffect } from "react";
import { useSettings } from "../../context/modules/SettingsContext";
import { useUI } from "../../context/modules/UIContext";

export default function UICluster({ children }) {
  const { state: settings } = useSettings(); // ✅ sửa đúng API
  const { loading } = useUI(); // dùng trực tiếp loading

  // Apply theme
  useEffect(() => {
    const theme = settings.theme || "light";
    document.documentElement.setAttribute("data-theme", theme);
  }, [settings.theme]);

  // Apply loading class
  useEffect(() => {
    if (loading) {
      document.body.classList.add("app-loading");
    } else {
      document.body.classList.remove("app-loading");
    }
  }, [loading]);

  return <>{children}</>;
}
