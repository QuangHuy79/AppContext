// // Những sửa chính (tóm tắt)
// // Normalize event names: readiness keys đều chuyển về lowercase → tránh mismatch (API / api / Auth ...).
// // Pipeline rules chính xác: Security cần api và auth (đảm bảo đúng thứ tự). Data cần api+auth. Sync cần data.
// // Preload: dynamic imports khi preload xong sẽ emit app:provider:ready tương ứng để unlock pipeline (fake-ready) — giúp pipeline không phải chờ providers tự emit.
// // Reduce Suspense nesting: chỉ dùng một Suspense trên toàn bộ lazy cluster stack thay vì 3 lớp lồng nhau.
// // Memoize cluster wrappers với React.memo để tránh re-renders.
// // Use startTransition để cập nhật ready set không block UI.
// // src/AppRuntime/AppRuntime.jsx (AppRuntime v2 – optimized Task 14)
// import React, {
//   useEffect,
//   useMemo,
//   useState,
//   useCallback,
//   startTransition,
//   Suspense,
// } from "react";
// import PropTypes from "prop-types";

// import ToastProvider from "../components/Toast/ToastProvider";
// import { NetworkProvider } from "../context/modules/NetworkContext";
// import { DeviceProvider } from "../context/modules/DeviceContext";
// import { SettingsProvider } from "../context/modules/SettingsContext";
// import { UIProvider } from "../context/modules/UIContext";
// import { StorageProvider } from "../context/modules/StorageContext";
// import { CacheProvider } from "../context/modules/CacheContext";
// import { StatePersistenceProvider } from "../context/StatePersistenceContext";

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

// // single fallback component
// const DefaultFallback = React.memo(() => (
//   <div data-testid="fallback" aria-busy="true" style={{ padding: 16 }}>
//     Loading…
//   </div>
// ));

// // --- Memoized clusters ---
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

// const UICluster = React.memo(function UICluster({ children }) {
//   return (
//     <SettingsProvider>
//       <UIProvider>{children}</UIProvider>
//     </SettingsProvider>
//   );
// });
// UICluster.displayName = "UICluster";

// // Inner clusters
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

// // --- Helper to emit readiness events (normalized lowercase) ---
// function emitReady(providerName) {
//   try {
//     const ev = new CustomEvent("app:provider:ready", {
//       detail: { provider: String(providerName).toLowerCase() },
//     });
//     window.dispatchEvent(ev);
//   } catch (e) {
//     console.warn("emitReady failed", e);
//   }
// }

// export default function AppRuntime({
//   children,
//   options = { lazyLoad: true, preload: false, suspenseFallback: null },
// }) {
//   const { lazyLoad = true, preload = false, suspenseFallback = null } = options;

//   // readiness set (lowercase keys)
//   const [readySet, setReadySet] = useState(() => new Set());

//   const has = useCallback(
//     (name) => readySet.has(String(name).toLowerCase()),
//     [readySet]
//   );

//   // listen readiness events
//   useEffect(() => {
//     function onReady(e) {
//       const raw = e?.detail?.provider;
//       if (!raw) return;
//       const name = String(raw).toLowerCase();
//       startTransition(() => {
//         setReadySet((prev) => {
//           if (prev.has(name)) return prev;
//           const next = new Set(prev);
//           next.add(name);
//           return next;
//         });
//       });
//     }
//     window.addEventListener("app:provider:ready", onReady);
//     return () => window.removeEventListener("app:provider:ready", onReady);
//   }, []);

//   // preload lazy modules + emit pseudo-ready
//   useEffect(() => {
//     if (!preload) return;
//     let mounted = true;
//     const preloadList = async () => {
//       await new Promise((r) => setTimeout(r, 20));
//       const imports = [
//         import("../context/APIContext/APIContext")
//           .then(() => emitReady("api"))
//           .catch(() => {}),
//         import("../context/AuthContext/AuthContext")
//           .then(() => emitReady("auth"))
//           .catch(() => {}),
//         import("../context/modules/DataContext")
//           .then(() => emitReady("data"))
//           .catch(() => {}),
//         import("../context/modules/DataSyncContext")
//           .then(() => emitReady("datasync"))
//           .catch(() => {}),
//         import("../context/modules/NotificationContext")
//           .then(() => emitReady("notification"))
//           .catch(() => {}),
//       ];
//       try {
//         await Promise.all(imports);
//       } finally {
//         if (!mounted) return;
//       }
//     };
//     preloadList();
//     return () => {
//       mounted = false;
//     };
//   }, [preload]);

//   const storageConfig = useMemo(
//     () => ({ persistKey: "app_v2_state", debounceMs: 300, version: 2 }),
//     []
//   );

//   const fallback = suspenseFallback ?? <DefaultFallback />;

//   // PIPELINE RULES (lowercase normalized)
//   const canMountSecurity = !lazyLoad || (has("api") && has("auth"));
//   const canMountData = !lazyLoad || (has("api") && has("auth"));
//   const canMountSync = !lazyLoad || has("data");

//   // single Suspense for all lazy providers
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

//   const lazyTreeWithSuspense = (
//     <Suspense fallback={fallback}>{lazyTree}</Suspense>
//   );

//   return (
//     <StatePersistenceProvider value={{}}>
//       <CoreCluster storageConfig={storageConfig}>
//         <UICluster>
//           {canMountSecurity ? (
//             lazyLoad ? (
//               lazyTreeWithSuspense
//             ) : (
//               <SecurityClusterInner>
//                 <DataClusterInner>
//                   <SyncClusterInner>{children}</SyncClusterInner>
//                 </DataClusterInner>
//               </SecurityClusterInner>
//             )
//           ) : (
//             <div data-testid="runtime-waiting-security">{children}</div>
//           )}
//         </UICluster>
//       </CoreCluster>
//     </StatePersistenceProvider>
//   );
// }

// AppRuntime.propTypes = {
//   children: PropTypes.node.isRequired,
//   options: PropTypes.shape({
//     lazyLoad: PropTypes.bool,
//     preload: PropTypes.bool,
//     suspenseFallback: PropTypes.node,
//   }),
// };

// ========================================
// FILE C-14 CHUẨN: src/runtime/AppRuntime.jsx
// src/runtime/AppRuntime.jsx
import React from "react";

import AppRuntimeWrapper from "./AppRuntimeWrapper";
import RuntimeGate from "./RuntimeGate";
import { RuntimeBoundary } from "./RuntimeBoundary";

/**
 * AppRuntime – Public Runtime Entry (C-14)
 *
 * Vai trò:
 * - Facade duy nhất cho App
 * - KHÔNG chứa orchestration
 * - KHÔNG chứa provider
 * - KHÔNG lazy / preload
 *
 * Thứ tự cố định:
 * Boundary → Gate → Wrapper → App
 */
export default function AppRuntime({ children }) {
  return (
    <RuntimeBoundary>
      <RuntimeGate>
        <AppRuntimeWrapper>{children}</AppRuntimeWrapper>
      </RuntimeGate>
    </RuntimeBoundary>
  );
}
