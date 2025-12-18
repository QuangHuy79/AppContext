// // src/debug/RuntimeDebugger.jsx
// // --- file: src/debug/RuntimeDebugger.jsx ---
// import { useEffect } from "react";
// import { useUI } from "../context/modules/UIContext";
// import { useNetwork } from "../context/modules/NetworkContext";
// import { useDevice } from "../context/modules/DeviceContext";
// import { useSettings } from "../context/modules/SettingsContext";
// import { useStorage } from "../context/modules/StorageContext";
// import { useCache } from "../context/modules/CacheContext";
// import { useAPI } from "../context/APIContext/APIContext";
// import { useAuth } from "../context/AuthContext/AuthContext";
// import { useData } from "../context/modules/DataContext";
// import { useDataSync } from "../context/modules/DataSyncContext";

// export default function RuntimeDebugger() {
//   const ui = useUI();
//   const network = useNetwork();
//   const device = useDevice();
//   const settings = useSettings();
//   const storage = useStorage();
//   const cache = useCache();
//   const api = useAPI();
//   const auth = useAuth();
//   const data = useData();
//   const dataSync = useDataSync();

//   useEffect(() => {
//     if (!ui || typeof ui.log !== "function") {
//       console.warn("RuntimeDebugger: UIContext.log not available");
//       return;
//     }

//     const { log } = ui;

//     // --- Runtime scan logs ---
//     log("🟩 RuntimeDebugger mounted — starting full runtime scan...");
//     log("🔵 AppRuntime v2 initializing...");

//     // 1. Network
//     log(`🌐 Network: online = ${network?.online}`);

//     // 2. Device
//     log(
//       `📱 Device: screen=${device?.width}x${device?.height}, orientation=${device?.orientation}`
//     );

//     // 3. Settings
//     log(
//       `⚙ Settings restored: theme=${settings?.theme}, language=${settings?.language}`
//     );

//     // 4. UIContext
//     log("🎨 UIContext active");

//     // 5. StorageContext
//     const localKeysCount = Object.keys(window.localStorage).length;
//     const sessionKeysCount = Object.keys(window.sessionStorage).length;
//     log(
//       `💾 Storage ready: keys(local)=${localKeysCount}, keys(session)=${sessionKeysCount}`
//     );

//     // 6. CacheContext
//     const cacheKeysCount = cache?.keys ? cache.keys().length : 0;
//     log(`📦 Cache: total keys = ${cacheKeysCount}`);

//     // 7. APIContext
//     log(`🔗 APIContext booted: baseURL=${api?.baseURL}`);

//     // 8. AuthContext
//     log(
//       `🔐 Auth: loggedIn=${
//         auth?.isAuthenticated
//       }, tokenPresent=${!!auth?.token}`
//     );

//     // 9. DataContext
//     const dataCount = Array.isArray(data?.items) ? data.items.length : 0;
//     log(`📚 Data: items=${dataCount}`);

//     // 10. DataSyncContext
//     log(`🔁 DataSync active: interval=${dataSync?.interval}ms`);

//     // 11. StatePersistenceContext
//     log("📌 StatePersistence: restore + autosave enabled");

//     log("🟢 Runtime scan completed successfully.");
//   }, []); // ✅ chỉ chạy 1 lần khi mount, fix infinite loop

//   return null; // không render UI
// }

// // ==================================
// // RuntimeDebugger (C-19 version – gọn)
// // src/debug/RuntimeDebugger.jsx
// import { useEffect } from "react";
// import { useRuntimeSnapshot } from "../runtime/useRuntimeSnapshot";

// export default function RuntimeDebugger() {
//   const snapshot = useRuntimeSnapshot();

//   useEffect(() => {
//     if (!snapshot) return;
//     console.log("[RuntimeSnapshot]", snapshot);
//   }, []);

//   return null;
// }

// =======================================
// src/debug/RuntimeDebugger.jsx
import { useEffect } from "react";
import { useRuntimeSnapshot } from "../runtime/useRuntimeSnapshot";

export default function RuntimeDebugger() {
  const snapshot = useRuntimeSnapshot();

  useEffect(() => {
    console.group("🧩 RuntimeDebugger (C-20)");
    console.log("📸 Runtime Snapshot:", snapshot);
    console.groupEnd();
  }, [snapshot]);

  return null;
}
