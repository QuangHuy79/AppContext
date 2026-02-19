// // // AppRuntimeWrapper.jsx — Phase 4.2 Auth Boundary FIXED
// // import React, { useMemo, Suspense } from "react";
// // import PropTypes from "prop-types";

// // /* --------------------
// //    Core (non-lazy)
// //    -------------------- */
// // import ToastProvider from "../components/Toast/ToastProvider";
// // import { NetworkProvider } from "../context/modules/NetworkContext";
// // import { DeviceProvider } from "../context/modules/DeviceContext";
// // import { SettingsProvider } from "../context/modules/SettingsContext";
// // import { UIProvider } from "../context/modules/UIContext";
// // import { StorageProvider } from "../context/modules/StorageContext";
// // import { CacheProvider } from "../context/modules/CacheContext";

// // import { StatePersistenceProvider } from "../context/StatePersistenceContext";

// // /* --------------------
// //    Lazy providers
// //    -------------------- */
// // const APIProvider = React.lazy(() =>
// //   import("../context/APIContext/APIContext").then((m) => ({
// //     default: m.APIProvider,
// //   })),
// // );

// // const AuthProvider = React.lazy(() =>
// //   import("../context/AuthContext/AuthContext").then((m) => ({
// //     default: m.AuthProvider,
// //   })),
// // );

// // const DataProvider = React.lazy(() =>
// //   import("../context/modules/DataContext").then((m) => ({
// //     default: m.DataProvider,
// //   })),
// // );

// // const DataSyncProvider = React.lazy(() =>
// //   import("../context/modules/DataSyncContext").then((m) => ({
// //     default: m.DataSyncProvider,
// //   })),
// // );

// // const NotificationProvider = React.lazy(() =>
// //   import("../context/modules/NotificationContext").then((m) => ({
// //     default: m.NotificationProvider,
// //   })),
// // );

// // /* --------------------
// //    Fallback
// //    -------------------- */
// // const DefaultFallback = React.memo(() => (
// //   <div aria-busy="true" style={{ padding: 16 }}>
// //     Loading…
// //   </div>
// // ));
// // DefaultFallback.displayName = "DefaultFallback";

// // /* --------------------
// //    Core clusters
// //    -------------------- */
// // const CoreCluster = React.memo(function CoreCluster({
// //   children,
// //   storageConfig,
// // }) {
// //   return (
// //     <ToastProvider>
// //       <StorageProvider config={storageConfig}>
// //         <NetworkProvider>
// //           <DeviceProvider>{children}</DeviceProvider>
// //         </NetworkProvider>
// //       </StorageProvider>
// //     </ToastProvider>
// //   );
// // });

// // const UICluster = React.memo(function UICluster({ children }) {
// //   return (
// //     <SettingsProvider>
// //       <UIProvider>{children}</UIProvider>
// //     </SettingsProvider>
// //   );
// // });

// // /* --------------------
// //    Inner clusters
// //    -------------------- */

// // /**
// //  * 🔐 SECURITY CLUSTER (FIXED)
// //  * - APIProvider vẫn global
// //  * - AuthProvider KHÔNG wrap toàn app
// //  */
// // const SecurityCluster = React.memo(function SecurityCluster({ children }) {
// //   return <APIProvider>{children}</APIProvider>;
// // });

// // /**
// //  * 🔐 AUTH TRUST ZONE
// //  * - Auth chỉ tồn tại trong fence này
// //  * - Component ngoài fence không thể useAuth
// //  */
// // const AuthTrustZone = React.memo(function AuthTrustZone({ children }) {
// //   return <AuthProvider>{children}</AuthProvider>;
// // });

// // const DataCluster = React.memo(function DataCluster({ children }) {
// //   return (
// //     <CacheProvider>
// //       <DataProvider>{children}</DataProvider>
// //     </CacheProvider>
// //   );
// // });

// // const SyncCluster = React.memo(function SyncCluster({ children }) {
// //   return (
// //     <DataSyncProvider>
// //       <NotificationProvider>{children}</NotificationProvider>
// //     </DataSyncProvider>
// //   );
// // });

// // /* --------------------
// //    AppRuntimeWrapper
// //    -------------------- */
// // export default function AppRuntimeWrapper({
// //   children,
// //   options = { lazyLoad: true, suspenseFallback: null },
// // }) {
// //   const { lazyLoad = true, suspenseFallback = null } = options;

// //   const storageConfig = useMemo(
// //     () => ({ persistKey: "app_v2_state", version: 2, debounceMs: 300 }),
// //     [],
// //   );

// //   const fallback = suspenseFallback ?? <DefaultFallback />;

// //   /**
// //    * children STRUCTURE EXPECTED:
// //    * {
// //    *   public: <PublicApp />,
// //    *   private: <PrivateApp />
// //    * }
// //    *
// //    * Nếu bạn CHƯA chia route:
// //    * - Pass toàn bộ app vào `private`
// //    * - public có thể là null
// //    */
// //   const lazyTree = useMemo(
// //     () => (
// //       <SecurityCluster>
// //         <DataCluster>
// //           <SyncCluster>
// //             {/* Public zone (NO AUTH ACCESS) */}
// //             {children?.public ?? null}

// //             {/* Auth trust zone */}
// //             <AuthTrustZone>{children?.private ?? null}</AuthTrustZone>
// //           </SyncCluster>
// //         </DataCluster>
// //       </SecurityCluster>
// //     ),
// //     [children],
// //   );

// //   return (
// //     <StatePersistenceProvider
// //       persistKey={storageConfig.persistKey}
// //       version={storageConfig.version}
// //       loadingComponent={DefaultFallback}
// //     >
// //       <CoreCluster storageConfig={storageConfig}>
// //         <UICluster>
// //           {lazyLoad ? (
// //             <Suspense fallback={fallback}>{lazyTree}</Suspense>
// //           ) : (
// //             lazyTree
// //           )}
// //         </UICluster>
// //       </CoreCluster>
// //     </StatePersistenceProvider>
// //   );
// // }

// // AppRuntimeWrapper.propTypes = {
// //   children: PropTypes.shape({
// //     public: PropTypes.node,
// //     private: PropTypes.node,
// //   }).isRequired,
// //   options: PropTypes.shape({
// //     lazyLoad: PropTypes.bool,
// //     suspenseFallback: PropTypes.node,
// //   }),
// // };

// // ============================================
// // src/runtime/AppRuntimeWrapper.jsx
// import React from "react";
// import UIHostRouter from "./UIHostRouter";

// export default function AppRuntimeWrapper() {
//   return <UIHostRouter />;
// }

// ======================================
// src/runtime/AppRuntimeWrapper.jsx
import React from "react";
import { createUIHostRouter } from "./UIHostRouter";

import AdminHost from "../uiHosts/admin/AdminHost";
import WebHost from "../uiHosts/web/WebHost";
import MobileHost from "../uiHosts/mobile/MobileHost";

const UIHostRouter = createUIHostRouter({
  admin: AdminHost,
  web: WebHost,
  mobile: MobileHost,
});

export default function AppRuntimeWrapper() {
  // hostKey có thể lấy từ env / config / snapshot
  return <UIHostRouter hostKey="web" />;
}
