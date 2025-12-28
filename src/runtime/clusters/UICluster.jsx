// import React, { useEffect } from "react";
// import { useSettings } from "../../context/modules/SettingsContext";
// import { useUI } from "../../context/modules/UIContext";

// export default function UICluster({ children }) {
//   const { state: settings } = useSettings(); // ✅ sửa đúng API
//   const { loading } = useUI(); // dùng trực tiếp loading

//   // Apply theme
//   useEffect(() => {
//     const theme = settings.theme || "light";
//     document.documentElement.setAttribute("data-theme", theme);
//   }, [settings.theme]);

//   // Apply loading class
//   useEffect(() => {
//     if (loading) {
//       document.body.classList.add("app-loading");
//     } else {
//       document.body.classList.remove("app-loading");
//     }
//   }, [loading]);

//   return <>{children}</>;
// }
