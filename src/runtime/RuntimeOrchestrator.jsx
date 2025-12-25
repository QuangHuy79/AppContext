// // src/runtime/RuntimeOrchestrator.jsx
// import { RuntimeSnapshotProvider } from "./useRuntimeSnapshot";
// import RuntimeDebugger from "../debug/RuntimeDebugger";
// import { useNetwork } from "../context/modules/NetworkContext";
// import { useDevice } from "../context/modules/DeviceContext";
// import { useSettings } from "../context/modules/SettingsContext";
// import { useUI } from "../context/modules/UIContext";
// import { useAuth } from "../context/AuthContext/AuthContext";
// import { useData } from "../context/modules/DataContext";
// import { useDataSync } from "../context/modules/DataSyncContext";

// export default function RuntimeOrchestrator({ children }) {
//   const network = useNetwork();
//   const device = useDevice();
//   const settings = useSettings();
//   const ui = useUI();
//   const auth = useAuth();
//   const data = useData();
//   const sync = useDataSync();

//   // const snapshot = {
//   //   network: {
//   //     isOnline: network?.isOnline,
//   //   },

//   //   device: {
//   //     width: device?.deviceInfo?.width,
//   //     height: device?.deviceInfo?.height,
//   //     isMobile: device?.deviceInfo?.isMobile,
//   //   },

//   //   settings: {
//   //     theme: settings?.state?.theme,
//   //     locale: settings?.state?.locale,
//   //   },

//   //   ui: {
//   //     loading: ui?.state?.loading,
//   //   },

//   //   auth: {
//   //     isAuthenticated: auth?.isAuthenticated,
//   //     hasUser: !!auth?.user,
//   //   },

//   //   data: {
//   //     keysCount:
//   //       data?.data && typeof data.data === "object"
//   //         ? Object.keys(data.data).length
//   //         : 0,
//   //   },

//   //   sync: {
//   //     syncing: sync?.syncing,
//   //     lastSync: sync?.lastSync,
//   //   },
//   // };
//   const snapshot = {
//     network: {
//       isOnline: Boolean(network?.isOnline),
//     },

//     device: {
//       width: Number(device?.width ?? 0),
//       height: Number(device?.height ?? 0),
//       orientation: device?.orientation || "unknown",
//     },

//     settings: {
//       theme: settings?.theme || "light",
//       language: settings?.language || "en",
//     },

//     ui: {
//       ready: Boolean(ui),
//     },

//     auth: {
//       isAuthenticated: Boolean(auth?.isAuthenticated),
//     },

//     data: {
//       count: Array.isArray(data?.items) ? data.items.length : 0,
//     },

//     sync: {
//       running: Boolean(sync?.syncing),
//     },
//   };

//   return (
//     <RuntimeSnapshotProvider value={snapshot}>
//       {/* 👇 Debugger BẮT BUỘC nằm ở đây */}
//       {import.meta.env.DEV && <RuntimeDebugger />}
//       {children}
//       {/* {children} */}
//     </RuntimeSnapshotProvider>
//   );
// }

// // ==================================
// // FIX ĐÚNG – DUY NHẤT (STEP 14 FINAL)
// // ✅ RuntimeOrchestrator.jsx (chuẩn contract + guard)
// // src/runtime/RuntimeOrchestrator.jsx
// import { RuntimeSnapshotProvider } from "./useRuntimeSnapshot";
// import RuntimeDebugger from "../debug/RuntimeDebugger";

// import { useNetwork } from "../context/modules/NetworkContext";
// import { useDevice } from "../context/modules/DeviceContext";
// import { useSettings } from "../context/modules/SettingsContext";
// import { useUI } from "../context/modules/UIContext";
// import { useAuth } from "../context/AuthContext/AuthContext";
// import { useData } from "../context/modules/DataContext";
// import { useDataSync } from "../context/modules/DataSyncContext";

// export default function RuntimeOrchestrator({ children }) {
//   const network = useNetwork();
//   const device = useDevice();
//   const settings = useSettings();
//   const ui = useUI();
//   const auth = useAuth();
//   const data = useData();
//   const sync = useDataSync();

//   const snapshot = {
//     network: {
//       isOnline: Boolean(network?.isOnline),
//     },

//     device: {
//       width: Number(device?.deviceInfo?.width ?? 0),
//       height: Number(device?.deviceInfo?.height ?? 0),
//       isMobile: Boolean(device?.deviceInfo?.isMobile),
//       isTablet: Boolean(device?.deviceInfo?.isTablet),
//       isDesktop: Boolean(device?.deviceInfo?.isDesktop),
//     },

//     settings: {
//       theme: settings?.state?.theme ?? "light",
//       locale: settings?.state?.locale ?? "en",
//     },

//     ui: {
//       loading: Boolean(ui?.state?.loading),
//     },

//     auth: {
//       isAuthenticated: Boolean(auth?.isAuthenticated),
//     },

//     data: {
//       count:
//         data?.data && typeof data.data === "object"
//           ? Object.keys(data.data).length
//           : 0,
//     },

//     sync: {
//       syncing: Boolean(sync?.syncing),
//       lastSync: sync?.lastSync ?? null,
//     },
//   };

//   return (
//     <RuntimeSnapshotProvider value={snapshot}>
//       {import.meta.env.DEV && <RuntimeDebugger />}
//       {children}
//     </RuntimeSnapshotProvider>
//   );
// }

// ============================================
import { RuntimeSnapshotProvider } from "./useRuntimeSnapshot";
import RuntimeDebugger from "../debug/RuntimeDebugger";
import { useNetwork } from "../context/modules/NetworkContext";
import { useDevice } from "../context/modules/DeviceContext";
import { useSettings } from "../context/modules/SettingsContext";
import { useUI } from "../context/modules/UIContext";
import { useAuth } from "../context/AuthContext/AuthContext";
import { useData } from "../context/modules/DataContext";
import { useDataSync } from "../context/modules/DataSyncContext";

export default function RuntimeOrchestrator({ children }) {
  const network = useNetwork();
  const device = useDevice();
  const settings = useSettings();
  const ui = useUI();
  const auth = useAuth();
  const data = useData();
  const sync = useDataSync();

  const snapshot = {
    network: {
      isOnline: Boolean(network?.isOnline),
    },

    device: {
      width: Number(device?.width ?? 0),
      height: Number(device?.height ?? 0),
      orientation: device?.orientation ?? "unknown",
    },

    settings: {
      theme: settings?.theme ?? "light",
      locale: settings?.locale ?? "en",
    },

    ui: {
      loading: Boolean(ui?.loading),
    },

    auth: {
      isAuthenticated: Boolean(auth?.isAuthenticated),
    },

    data: {
      count: Array.isArray(data?.items) ? data.items.length : 0,
    },

    sync: {
      running: Boolean(sync?.syncing),
    },
  };

  return (
    <RuntimeSnapshotProvider value={snapshot}>
      {/* {children} */}
      {import.meta.env.DEV && <RuntimeDebugger />}
      {children}
    </RuntimeSnapshotProvider>
  );
}
