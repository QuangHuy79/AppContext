// // // src/runtime/RuntimeOrchestrator.jsx
// // import React from "react";

// // // CLUSTERS
// // import NetworkCluster from "./clusters/NetworkCluster";
// // import DeviceCluster from "./clusters/DeviceCluster";
// // import UICluster from "./clusters/UICluster";
// // import {
// //   SecurityCluster,
// //   DataCluster,
// //   SyncCluster,
// // } from "./clusters/SyncCluster";

// // // CORE
// // import { AppProvider } from "../context/AppContext";
// // import { StatePersistenceProvider } from "../context/StatePersistenceContext";

// // export default function RuntimeOrchestrator({ children }) {
// //   return (
// //     <NetworkCluster>
// //       <DeviceCluster>
// //         <UICluster>
// //           <SecurityCluster lazyLoad={false}>
// //             <DataCluster lazyLoad={false}>
// //               <SyncCluster lazyLoad={false}>{children}</SyncCluster>
// //             </DataCluster>
// //           </SecurityCluster>
// //         </UICluster>
// //       </DeviceCluster>
// //     </NetworkCluster>
// //   );
// // }

// // ================================
// // C-10 – THAY ĐỔI DUY NHẤT (RẤT NHỎ)
// // 👉 Chỉ bọc thêm RuntimeSnapshotProvider
// // Không đụng cluster
// // Không đụng children
// // src/runtime/RuntimeOrchestrator.jsx
// import React from "react";

// import NetworkCluster from "./clusters/NetworkCluster";
// import DeviceCluster from "./clusters/DeviceCluster";
// import UICluster from "./clusters/UICluster";
// import {
//   SecurityCluster,
//   DataCluster,
//   SyncCluster,
// } from "./clusters/SyncCluster";

// import { RuntimeSnapshotProvider } from "./useRuntimeSnapshot";

// export default function RuntimeOrchestrator({ children }) {
//   const snapshot = {
//     network: true,
//     device: true,
//     ui: true,
//     security: true,
//     data: true,
//     sync: true,
//   };

//   return (
//     <RuntimeSnapshotProvider value={snapshot}>
//       <NetworkCluster>
//         <DeviceCluster>
//           <UICluster>
//             <SecurityCluster lazyLoad={false}>
//               <DataCluster lazyLoad={false}>
//                 <SyncCluster lazyLoad={false}>{children}</SyncCluster>
//               </DataCluster>
//             </SecurityCluster>
//           </UICluster>
//         </DeviceCluster>
//       </NetworkCluster>
//     </RuntimeSnapshotProvider>
//   );
// }

// ===============================
// C-20: Sửa / thêm đúng 2 chỗ
// src/runtime/RuntimeOrchestrator.jsx
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
    network: { online: network?.online },
    device: {
      width: device?.width,
      height: device?.height,
      orientation: device?.orientation,
    },
    settings: {
      theme: settings?.theme,
      language: settings?.language,
    },
    ui: { ready: !!ui },
    auth: { isAuthenticated: auth?.isAuthenticated },
    data: { count: Array.isArray(data?.items) ? data.items.length : 0 },
    sync: { running: !!sync },
  };

  return (
    <RuntimeSnapshotProvider value={snapshot}>
      <RuntimeDebugger /> {/* 👈 THÊM DÒNG NÀY */}
      {children}
    </RuntimeSnapshotProvider>
  );
}
