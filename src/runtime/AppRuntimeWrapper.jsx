// // src/AppRuntime/AppRuntimeWrapper.jsx
//  Đây là toàn bộ file AppRuntimeWrapper.jsx đã được chỉnh sửa để tối ưu hóa hiệu năng,
//  loại bỏ Race Condition và tích hợp cơ chế Hydration Blocking & Versioning thông qua
//  StatePersistenceProvider đã refactor.
// Toàn bộ logic quản lý trạng thái sẵn sàng (ready state management) cũ đã được loại
// bỏ vì StatePersistenceProvider đã xử lý việc chặn render và Suspense xử lý tải code.
// import React, {
//   useEffect,
//   useMemo,
//   // 💡 Đã loại bỏ: useState, useCallback, startTransition
//   // 💡 Đã loại bỏ: useTransition không còn cần thiết
//   Suspense,
// } from "react";
// import PropTypes from "prop-types";

// // 💡 Giữ lại: Component và Providers không lazy
// import ToastProvider from "../components/Toast/ToastProvider";
// import { NetworkProvider } from "../context/modules/NetworkContext";
// import { DeviceProvider } from "../context/modules/DeviceContext";
// import { SettingsProvider } from "../context/modules/SettingsContext";
// import { UIProvider } from "../context/modules/UIContext";
// import { StorageProvider } from "../context/modules/StorageContext";
// import { CacheProvider } from "../context/modules/CacheContext";
// // 💡 StatePersistenceProvider đã được refactor để chấp nhận props config
// import { StatePersistenceProvider } from "../context/StatePersistenceContext";

// // Lazy providers (giữ lại Lazy Load cho Production)
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

// // single fallback component (test-friendly)
// const DefaultFallback = React.memo(() => (
//   <div data-testid="fallback" aria-busy="true" style={{ padding: 16 }}>
//     Loading…
//   </div>
// ));

// // Core cluster (always rendered, not inside Suspense)
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

// // UI cluster (always rendered)
// const UICluster = React.memo(function UICluster({ children }) {
//   return (
//     <SettingsProvider>
//       <UIProvider>{children}</UIProvider>
//     </SettingsProvider>
//   );
// });
// UICluster.displayName = "UICluster";

// // Inner clusters (lazy)
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

// // 💡 Đã loại bỏ: emitReady helper và toàn bộ logic lắng nghe window event (Race condition risk)

// /**
//  * AppRuntimeWrapper
//  *
//  * - Core/UI clusters luôn được mount
//  * - Lazy clusters được render bên trong Suspense (Code Splitting)
//  * - StatePersistenceProvider đã refactor sẽ lo việc Hydration Blocking (chặn render)
//  */
// export default function AppRuntimeWrapper({
//   children,
//   options = { lazyLoad: true, preload: false, suspenseFallback: null },
// }) {
//   const { lazyLoad = true, preload = false, suspenseFallback = null } = options;

//   // 💡 Đã loại bỏ: readySet và logic useEffect lắng nghe event readiness

//   // 💡 Đã loại bỏ: useEffect(preload) - Logic này không còn cần thiết vì Suspense quản lý load code

//   // Cấu hình lưu trữ trạng thái (dùng để truyền xuống StatePersistenceProvider)
//   const storageConfig = useMemo(
//     () => ({ persistKey: "app_v2_state", debounceMs: 300, version: 2 }),
//     []
//   );

//   // fallback: use provided suspenseFallback if present; otherwise default
//   const fallback = suspenseFallback ?? <DefaultFallback />;

//   // Cây Providers Lazy được nhóm lại (Tĩnh)
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

//   // 💡 Đã loại bỏ: logic canMountSecurity/canMountData/canMountSync

//   return (
//     // ⭐️ SỬA 1: Truyền config cần thiết cho Hydration Blocking & Versioning
//     <StatePersistenceProvider
//       persistKey={storageConfig.persistKey}
//       version={storageConfig.version}
//       loadingComponent={fallback} // Dùng fallback làm Loading Screen khi Hydrate
//     >
//       <CoreCluster storageConfig={storageConfig}>
//         <UICluster>
//           {/* ⭐️ SỬA 2: Đơn giản hóa logic render
//             StatePersistenceProvider đã chặn render cho đến khi Hydration xong.
//             Chúng ta chỉ cần tập trung vào Logic Lazy/Sync Load.
//           */}
//           {lazyLoad ? (
//             // Chế độ Lazy Load (Prod): Dùng Suspense để chờ code splitting
//             <Suspense fallback={fallback}>{lazyTree}</Suspense>
//           ) : (
//             // Chế độ Sync (Dev/Test): Mount Providers trực tiếp
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

// =================================
// AppRuntimeWrapper.jsx bản Production-ready
import React, { useMemo, Suspense } from "react";
import PropTypes from "prop-types";

/**
 * AppRuntimeWrapper (Production-ready)
 *
 * - Giữ nguyên hoàn toàn kiến trúc AppRuntime v2 của bạn.
 * - StatePersistenceProvider bây giờ nhận config (persistKey, version, loadingComponent).
 * - CoreCluster / UICluster luôn mount.
 * - Lazy clusters (API, Auth, Data, DataSync, Notification) được code-split bằng React.lazy + Suspense.
 * - Không có logic event-based readiness / preload / startTransition (đã loại bỏ vì Suspense đủ tốt cho production).
 *
 * LƯU Ý:
 * - Không thay đổi thứ tự provider trees — thứ tự rất quan trọng (Storage -> Network -> Device -> Settings -> UI -> Security -> Data -> Sync).
 * - Nếu cần bật preload / emitReady cho test, mình để lại comment chỗ phù hợp để bạn bật lại.
 */

// non-lazy (core) providers — keep non-lazy to ensure stable base runtime
import ToastProvider from "../components/Toast/ToastProvider";
import { NetworkProvider } from "../context/modules/NetworkContext";
import { DeviceProvider } from "../context/modules/DeviceContext";
import { SettingsProvider } from "../context/modules/SettingsContext";
import { UIProvider } from "../context/modules/UIContext";
import { StorageProvider } from "../context/modules/StorageContext";
import { CacheProvider } from "../context/modules/CacheContext";

// StatePersistenceProvider is named export (refactor accepts config props)
import { StatePersistenceProvider } from "../context/StatePersistenceContext";

/**
 * Lazy providers (kept lazy for production code-splitting)
 * Each lazy import maps the module's named export to default so Suspense works cleanly.
 */
const AuthProvider = React.lazy(() =>
  import("../context/AuthContext/AuthContext").then((m) => ({
    default: m.AuthProvider,
  }))
);
const APIProvider = React.lazy(() =>
  import("../context/APIContext/APIContext").then((m) => ({
    default: m.APIProvider,
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

// simple, test-friendly fallback used by Suspense and by StatePersistence during hydration
const DefaultFallback = React.memo(() => (
  <div data-testid="fallback" aria-busy="true" style={{ padding: 16 }}>
    Loading…
  </div>
));
DefaultFallback.displayName = "DefaultFallback";

/* --------------------
   Core & UI clusters
   -------------------- */

// Core cluster: Toast + Storage + Network + Device
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
CoreCluster.displayName = "CoreCluster";

// UI cluster: Settings + UI
const UICluster = React.memo(function UICluster({ children }) {
  return (
    <SettingsProvider>
      <UIProvider>{children}</UIProvider>
    </SettingsProvider>
  );
});
UICluster.displayName = "UICluster";

/* --------------------
   Lazy inner clusters
   -------------------- */

const SecurityClusterInner = React.memo(function SecurityClusterInner({
  children,
}) {
  return (
    <APIProvider>
      <AuthProvider>{children}</AuthProvider>
    </APIProvider>
  );
});
SecurityClusterInner.displayName = "SecurityClusterInner";

const DataClusterInner = React.memo(function DataClusterInner({ children }) {
  return (
    <CacheProvider>
      <DataProvider>{children}</DataProvider>
    </CacheProvider>
  );
});
DataClusterInner.displayName = "DataClusterInner";

const SyncClusterInner = React.memo(function SyncClusterInner({ children }) {
  return (
    <DataSyncProvider>
      <NotificationProvider>{children}</NotificationProvider>
    </DataSyncProvider>
  );
});
SyncClusterInner.displayName = "SyncClusterInner";

/* --------------------
   AppRuntimeWrapper
   -------------------- */

/**
 * Notes on options:
 * - lazyLoad: if true use Suspense for lazy providers (recommended production)
 * - preload: removed (Suspense handles loading); kept in options shape for backwards-compatibility
 * - suspenseFallback: optional custom fallback component
 */
export default function AppRuntimeWrapper({
  children,
  options = { lazyLoad: true, preload: false, suspenseFallback: null },
}) {
  const {
    lazyLoad = true,
    /* preload intentionally unused */ suspenseFallback = null,
  } = options;

  // storageConfig passed into StorageProvider and StatePersistenceProvider.
  // Keep this single source so you won't accidentally diverge keys/versions.
  const storageConfig = useMemo(
    () => ({ persistKey: "app_v2_state", debounceMs: 300, version: 2 }),
    []
  );

  // fallback to use for Suspense and as loading screen during hydration
  const fallback = suspenseFallback ?? <DefaultFallback />;
  const FallbackComponent = DefaultFallback;

  // Lazy provider tree (kept static; children are passed at deepest level)
  const lazyTree = useMemo(
    () => (
      <SecurityClusterInner>
        <DataClusterInner>
          <SyncClusterInner>{children}</SyncClusterInner>
        </DataClusterInner>
      </SecurityClusterInner>
    ),
    [children]
  );

  return (
    /**
     * IMPORTANT:
     * - StatePersistenceProvider blocks/hydrates before allowing children to render.
     * - We pass persistKey & version to allow safe versioning & hydration behavior.
     * - loadingComponent uses the same fallback so user sees consistent loading UI.
     */
    <StatePersistenceProvider
      persistKey={storageConfig.persistKey}
      version={storageConfig.version}
      // loadingComponent={fallback}
      loadingComponent={FallbackComponent}
    >
      <CoreCluster storageConfig={storageConfig}>
        <UICluster>
          {lazyLoad ? (
            // Production recommended: use Suspense to wait for lazy provider bundles
            <Suspense fallback={fallback}>{lazyTree}</Suspense>
          ) : (
            // Synchronous mount mode (useful for tests or environments where lazy causes flakiness)
            lazyTree
          )}
        </UICluster>
      </CoreCluster>
    </StatePersistenceProvider>
  );
}

AppRuntimeWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  options: PropTypes.shape({
    lazyLoad: PropTypes.bool,
    preload: PropTypes.bool,
    suspenseFallback: PropTypes.node,
  }),
};
