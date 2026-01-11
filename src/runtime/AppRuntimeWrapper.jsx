// // AppRuntimeWrapper.jsx bản Production-ready
// import React, { useMemo, Suspense } from "react";
// import PropTypes from "prop-types";

// /**
//  * AppRuntimeWrapper (Production-ready)
//  *
//  * - Giữ nguyên hoàn toàn kiến trúc AppRuntime v2 của bạn.
//  * - StatePersistenceProvider bây giờ nhận config (persistKey, version, loadingComponent).
//  * - CoreCluster / UICluster luôn mount.
//  * - Lazy clusters (API, Auth, Data, DataSync, Notification) được code-split bằng React.lazy + Suspense.
//  * - Không có logic event-based readiness / preload / startTransition (đã loại bỏ vì Suspense đủ tốt cho production).
//  *
//  * LƯU Ý:
//  * - Không thay đổi thứ tự provider trees — thứ tự rất quan trọng (Storage -> Network -> Device -> Settings -> UI -> Security -> Data -> Sync).
//  * - Nếu cần bật preload / emitReady cho test, mình để lại comment chỗ phù hợp để bạn bật lại.
//  */

// // non-lazy (core) providers — keep non-lazy to ensure stable base runtime
// import ToastProvider from "../components/Toast/ToastProvider";
// import { NetworkProvider } from "../context/modules/NetworkContext";
// import { DeviceProvider } from "../context/modules/DeviceContext";
// import { SettingsProvider } from "../context/modules/SettingsContext";
// import { UIProvider } from "../context/modules/UIContext";
// import { StorageProvider } from "../context/modules/StorageContext";
// import { CacheProvider } from "../context/modules/CacheContext";

// // StatePersistenceProvider is named export (refactor accepts config props)
// import { StatePersistenceProvider } from "../context/StatePersistenceContext";

// /**
//  * Lazy providers (kept lazy for production code-splitting)
//  * Each lazy import maps the module's named export to default so Suspense works cleanly.
//  */
// const AuthProvider = React.lazy(() =>
//   import("../context/AuthContext/AuthContext").then((m) => ({
//     default: m.AuthProvider,
//   }))
// );
// const APIProvider = React.lazy(() =>
//   import("../context/APIContext/APIContext").then((m) => ({
//     default: m.APIProvider,
//   }))
// );
// const DataProvider = React.lazy(() =>
//   import("../context/modules/DataContext").then((m) => ({
//     default: m.DataProvider,
//   }))
// );
// const DataSyncProvider = React.lazy(() =>
//   import("../context/modules/DataSyncContext").then((m) => ({
//     default: m.DataSyncProvider,
//   }))
// );
// const NotificationProvider = React.lazy(() =>
//   import("../context/modules/NotificationContext").then((m) => ({
//     default: m.NotificationProvider,
//   }))
// );

// // simple, test-friendly fallback used by Suspense and by StatePersistence during hydration
// const DefaultFallback = React.memo(() => (
//   <div data-testid="fallback" aria-busy="true" style={{ padding: 16 }}>
//     Loading…
//   </div>
// ));
// DefaultFallback.displayName = "DefaultFallback";

// /* --------------------
//    Core & UI clusters
//    -------------------- */

// // Core cluster: Toast + Storage + Network + Device
// const CoreCluster = React.memo(function CoreCluster({
//   children,
//   storageConfig,
// }) {
//   return (
//     <ToastProvider>
//       <StorageProvider config={storageConfig}>
//         <NetworkProvider>
//           <DeviceProvider>{children}</DeviceProvider>
//         </NetworkProvider>
//       </StorageProvider>
//     </ToastProvider>
//   );
// });
// CoreCluster.displayName = "CoreCluster";

// // UI cluster: Settings + UI
// const UICluster = React.memo(function UICluster({ children }) {
//   return (
//     <SettingsProvider>
//       <UIProvider>{children}</UIProvider>
//     </SettingsProvider>
//   );
// });
// UICluster.displayName = "UICluster";

// /* --------------------
//    Lazy inner clusters
//    -------------------- */

// const SecurityClusterInner = React.memo(function SecurityClusterInner({
//   children,
// }) {
//   return (
//     <APIProvider>
//       <AuthProvider>{children}</AuthProvider>
//     </APIProvider>
//   );
// });
// SecurityClusterInner.displayName = "SecurityClusterInner";

// const DataClusterInner = React.memo(function DataClusterInner({ children }) {
//   return (
//     <CacheProvider>
//       <DataProvider>{children}</DataProvider>
//     </CacheProvider>
//   );
// });
// DataClusterInner.displayName = "DataClusterInner";

// const SyncClusterInner = React.memo(function SyncClusterInner({ children }) {
//   return (
//     <DataSyncProvider>
//       <NotificationProvider>{children}</NotificationProvider>
//     </DataSyncProvider>
//   );
// });
// SyncClusterInner.displayName = "SyncClusterInner";

// /* --------------------
//    AppRuntimeWrapper
//    -------------------- */

// /**
//  * Notes on options:
//  * - lazyLoad: if true use Suspense for lazy providers (recommended production)
//  * - preload: removed (Suspense handles loading); kept in options shape for backwards-compatibility
//  * - suspenseFallback: optional custom fallback component
//  */
// export default function AppRuntimeWrapper({
//   children,
//   options = { lazyLoad: true, preload: false, suspenseFallback: null },
// }) {
//   const {
//     lazyLoad = true,
//     /* preload intentionally unused */ suspenseFallback = null,
//   } = options;

//   // storageConfig passed into StorageProvider and StatePersistenceProvider.
//   // Keep this single source so you won't accidentally diverge keys/versions.
//   const storageConfig = useMemo(
//     () => ({ persistKey: "app_v2_state", debounceMs: 300, version: 2 }),
//     []
//   );

//   // fallback to use for Suspense and as loading screen during hydration
//   const fallback = suspenseFallback ?? <DefaultFallback />;
//   const FallbackComponent = DefaultFallback;

//   // Lazy provider tree (kept static; children are passed at deepest level)
//   const lazyTree = useMemo(
//     () => (
//       <SecurityClusterInner>
//         <DataClusterInner>
//           <SyncClusterInner>{children}</SyncClusterInner>
//         </DataClusterInner>
//       </SecurityClusterInner>
//     ),
//     [children]
//   );

//   return (
//     /**
//      * IMPORTANT:
//      * - StatePersistenceProvider blocks/hydrates before allowing children to render.
//      * - We pass persistKey & version to allow safe versioning & hydration behavior.
//      * - loadingComponent uses the same fallback so user sees consistent loading UI.
//      */
//     <StatePersistenceProvider
//       persistKey={storageConfig.persistKey}
//       version={storageConfig.version}
//       // loadingComponent={fallback}
//       loadingComponent={FallbackComponent}
//     >
//       <CoreCluster storageConfig={storageConfig}>
//         <UICluster>
//           {lazyLoad ? (
//             // Production recommended: use Suspense to wait for lazy provider bundles
//             <Suspense fallback={fallback}>{lazyTree}</Suspense>
//           ) : (
//             // Synchronous mount mode (useful for tests or environments where lazy causes flakiness)
//             lazyTree
//           )}
//         </UICluster>
//       </CoreCluster>
//     </StatePersistenceProvider>
//   );
// }

// AppRuntimeWrapper.propTypes = {
//   children: PropTypes.node.isRequired,
//   options: PropTypes.shape({
//     lazyLoad: PropTypes.bool,
//     preload: PropTypes.bool,
//     suspenseFallback: PropTypes.node,
//   }),
// };

// ==========================================
// FILE FULL — AppRuntimeWrapper.jsx (PHASE 4.2 FIXED)
// AppRuntimeWrapper.jsx — Phase 4.2 Auth Boundary FIXED
import React, { useMemo, Suspense } from "react";
import PropTypes from "prop-types";

/* --------------------
   Core (non-lazy)
   -------------------- */
import ToastProvider from "../components/Toast/ToastProvider";
import { NetworkProvider } from "../context/modules/NetworkContext";
import { DeviceProvider } from "../context/modules/DeviceContext";
import { SettingsProvider } from "../context/modules/SettingsContext";
import { UIProvider } from "../context/modules/UIContext";
import { StorageProvider } from "../context/modules/StorageContext";
import { CacheProvider } from "../context/modules/CacheContext";

import { StatePersistenceProvider } from "../context/StatePersistenceContext";

/* --------------------
   Lazy providers
   -------------------- */
const APIProvider = React.lazy(() =>
  import("../context/APIContext/APIContext").then((m) => ({
    default: m.APIProvider,
  }))
);

const AuthProvider = React.lazy(() =>
  import("../context/AuthContext/AuthContext").then((m) => ({
    default: m.AuthProvider,
  }))
);

const DataProvider = React.lazy(() =>
  import("../context/modules/DataContext").then((m) => ({
    default: m.DataProvider,
  }))
);

const DataSyncProvider = React.lazy(() =>
  import("../context/modules/DataSyncContext").then((m) => ({
    default: m.DataSyncProvider,
  }))
);

const NotificationProvider = React.lazy(() =>
  import("../context/modules/NotificationContext").then((m) => ({
    default: m.NotificationProvider,
  }))
);

/* --------------------
   Fallback
   -------------------- */
const DefaultFallback = React.memo(() => (
  <div aria-busy="true" style={{ padding: 16 }}>
    Loading…
  </div>
));
DefaultFallback.displayName = "DefaultFallback";

/* --------------------
   Core clusters
   -------------------- */
const CoreCluster = React.memo(function CoreCluster({
  children,
  storageConfig,
}) {
  return (
    <ToastProvider>
      <StorageProvider config={storageConfig}>
        <NetworkProvider>
          <DeviceProvider>{children}</DeviceProvider>
        </NetworkProvider>
      </StorageProvider>
    </ToastProvider>
  );
});

const UICluster = React.memo(function UICluster({ children }) {
  return (
    <SettingsProvider>
      <UIProvider>{children}</UIProvider>
    </SettingsProvider>
  );
});

/* --------------------
   Inner clusters
   -------------------- */

/**
 * 🔐 SECURITY CLUSTER (FIXED)
 * - APIProvider vẫn global
 * - AuthProvider KHÔNG wrap toàn app
 */
const SecurityCluster = React.memo(function SecurityCluster({ children }) {
  return <APIProvider>{children}</APIProvider>;
});

/**
 * 🔐 AUTH TRUST ZONE
 * - Auth chỉ tồn tại trong fence này
 * - Component ngoài fence không thể useAuth
 */
const AuthTrustZone = React.memo(function AuthTrustZone({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
});

const DataCluster = React.memo(function DataCluster({ children }) {
  return (
    <CacheProvider>
      <DataProvider>{children}</DataProvider>
    </CacheProvider>
  );
});

const SyncCluster = React.memo(function SyncCluster({ children }) {
  return (
    <DataSyncProvider>
      <NotificationProvider>{children}</NotificationProvider>
    </DataSyncProvider>
  );
});

/* --------------------
   AppRuntimeWrapper
   -------------------- */
export default function AppRuntimeWrapper({
  children,
  options = { lazyLoad: true, suspenseFallback: null },
}) {
  const { lazyLoad = true, suspenseFallback = null } = options;

  const storageConfig = useMemo(
    () => ({ persistKey: "app_v2_state", version: 2, debounceMs: 300 }),
    []
  );

  const fallback = suspenseFallback ?? <DefaultFallback />;

  /**
   * children STRUCTURE EXPECTED:
   * {
   *   public: <PublicApp />,
   *   private: <PrivateApp />
   * }
   *
   * Nếu bạn CHƯA chia route:
   * - Pass toàn bộ app vào `private`
   * - public có thể là null
   */
  const lazyTree = useMemo(
    () => (
      <SecurityCluster>
        <DataCluster>
          <SyncCluster>
            {/* Public zone (NO AUTH ACCESS) */}
            {children?.public ?? null}

            {/* Auth trust zone */}
            <AuthTrustZone>{children?.private ?? null}</AuthTrustZone>
          </SyncCluster>
        </DataCluster>
      </SecurityCluster>
    ),
    [children]
  );

  return (
    <StatePersistenceProvider
      persistKey={storageConfig.persistKey}
      version={storageConfig.version}
      loadingComponent={DefaultFallback}
    >
      <CoreCluster storageConfig={storageConfig}>
        <UICluster>
          {lazyLoad ? (
            <Suspense fallback={fallback}>{lazyTree}</Suspense>
          ) : (
            lazyTree
          )}
        </UICluster>
      </CoreCluster>
    </StatePersistenceProvider>
  );
}

AppRuntimeWrapper.propTypes = {
  children: PropTypes.shape({
    public: PropTypes.node,
    private: PropTypes.node,
  }).isRequired,
  options: PropTypes.shape({
    lazyLoad: PropTypes.bool,
    suspenseFallback: PropTypes.node,
  }),
};
