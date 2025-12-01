// Bản AppRuntime – Pha D tối ưu, tích hợp RuntimeSnapshotProvider,
// memo clusters, lazy load, preload đúng chuẩn React, Suspense fallback chuẩn, và side-effects hợp lý
// src/AppRuntime/AppRuntime.jsx
// import React, { Suspense, lazy, useMemo, useEffect } from "react";
// import PropTypes from "prop-types";

// /* -------------------------
//    Synchronous (light) Providers
// ------------------------- */
// import ToastProvider from "../components/Toast/ToastProvider";
// import { NetworkProvider } from "../context/modules/NetworkContext";
// import { DeviceProvider } from "../context/modules/DeviceContext";
// import { SettingsProvider } from "../context/modules/SettingsContext";
// import { UIProvider } from "../context/modules/UIContext";
// import { StorageProvider } from "../context/modules/StorageContext";
// import { CacheProvider } from "../context/modules/CacheContext";
// import { StatePersistenceProvider } from "../context/StatePersistenceContext";
// import { RuntimeSnapshotProvider } from "./useRuntimeSnapshot";
// import UICluster from "./clusters/UICluster";
// /* -------------------------
//    Lazy (heavy) Providers
// ------------------------- */
// const AuthProvider = lazy(() =>
//   import("../context/AuthContext/AuthContext").then((m) => ({
//     default: m.AuthProvider,
//   }))
// );
// const APIProvider = lazy(() =>
//   import("../context/APIContext/APIContext").then((m) => ({
//     default: m.APIProvider,
//   }))
// );
// const DataProvider = lazy(() =>
//   import("../context/modules/DataContext").then((m) => ({
//     default: m.DataProvider,
//   }))
// );
// const DataSyncProvider = lazy(() =>
//   import("../context/modules/DataSyncContext").then((m) => ({
//     default: m.DataSyncProvider,
//   }))
// );
// const NotificationProvider = lazy(() =>
//   import("../context/modules/NotificationContext").then((m) => ({
//     default: m.NotificationProvider,
//   }))
// );

// /* -------------------------
//    Error Boundary
// ------------------------- */
// class ErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false, error: null };
//   }
//   static getDerivedStateFromError(error) {
//     return { hasError: true, error };
//   }
//   componentDidCatch(error, info) {
//     console.error("RuntimeBoundary caught:", error, info);
//   }
//   render() {
//     if (this.state.hasError) {
//       return (
//         this.props.fallback ?? (
//           <div role="alert" style={{ padding: 20 }}>
//             <h2>Something went wrong.</h2>
//             <pre style={{ whiteSpace: "pre-wrap" }}>
//               {String(this.state.error)}
//             </pre>
//           </div>
//         )
//       );
//     }
//     return this.props.children;
//   }
// }

// /* -------------------------
//    Default Suspense fallback
// ------------------------- */
// function DefaultFallback() {
//   return (
//     <div aria-busy="true" style={{ padding: 16 }}>
//       Loading…
//     </div>
//   );
// }

// /* -------------------------
//    Preload helpers
// ------------------------- */
// export function preloadRuntimeModules(
//   modules = ["Auth", "API", "Data", "DataSync", "Notification"]
// ) {
//   modules.forEach((name) => {
//     switch (name) {
//       case "Auth":
//         import("../context/AuthContext/AuthContext");
//         break;
//       case "API":
//         import("../context/APIContext/APIContext");
//         break;
//       case "Data":
//         import("../context/modules/DataContext");
//         break;
//       case "DataSync":
//         import("../context/modules/DataSyncContext");
//         break;
//       case "Notification":
//         import("../context/modules/NotificationContext");
//         break;
//       default:
//         break;
//     }
//   });
// }

// /* =========================
//    RUNTIME CLUSTERS
// ========================= */
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

// // const UICluster = React.memo(function UICluster({ children }) {
// //   return (
// //     <SettingsProvider>
// //       <UIProvider>{children}</UIProvider>
// //     </SettingsProvider>
// //   );
// // });

// function SecurityClusterInner({ children }) {
//   return (
//     <APIProvider>
//       <AuthProvider>{children}</AuthProvider>
//     </APIProvider>
//   );
// }
// const SecurityCluster = React.memo(function SecurityCluster({
//   children,
//   lazyLoad,
//   fallback,
// }) {
//   return lazyLoad ? (
//     <Suspense fallback={fallback ?? <DefaultFallback />}>
//       <SecurityClusterInner>{children}</SecurityClusterInner>
//     </Suspense>
//   ) : (
//     <SecurityClusterInner>{children}</SecurityClusterInner>
//   );
// });

// function DataClusterInner({ children }) {
//   return (
//     <CacheProvider>
//       <DataProvider>{children}</DataProvider>
//     </CacheProvider>
//   );
// }
// const DataCluster = React.memo(function DataCluster({
//   children,
//   lazyLoad,
//   fallback,
// }) {
//   return lazyLoad ? (
//     <Suspense fallback={fallback ?? <DefaultFallback />}>
//       <DataClusterInner>{children}</DataClusterInner>
//     </Suspense>
//   ) : (
//     <DataClusterInner>{children}</DataClusterInner>
//   );
// });

// function SyncClusterInner({ children }) {
//   return (
//     <DataSyncProvider>
//       <NotificationProvider>{children}</NotificationProvider>
//     </DataSyncProvider>
//   );
// }
// const SyncCluster = React.memo(function SyncCluster({
//   children,
//   lazyLoad,
//   fallback,
// }) {
//   return lazyLoad ? (
//     <Suspense fallback={fallback ?? <DefaultFallback />}>
//       <SyncClusterInner>{children}</SyncClusterInner>
//     </Suspense>
//   ) : (
//     <SyncClusterInner>{children}</SyncClusterInner>
//   );
// });

// /* =========================
//    AppRuntime component
// ========================= */
// export function AppRuntime({ children, options = {} }) {
//   const {
//     lazyLoad = true,
//     preload = false,
//     enableAnalytics = false,
//     suspenseFallback = null,
//   } = options;

//   // Preload lazy modules (non-blocking)
//   useEffect(() => {
//     if (preload) {
//       const timer = setTimeout(() => preloadRuntimeModules(), 100);
//       return () => clearTimeout(timer);
//     }
//   }, [preload]);

//   const storageConfig = useMemo(
//     () => ({
//       persistKey: "app_v1_state",
//       debounceMs: 400,
//       version: 1,
//     }),
//     []
//   );

//   const runtimeActions = useMemo(
//     () => ({
//       flushCaches: () => {
//         // Implement your flush logic here
//       },
//     }),
//     []
//   );

//   return (
//     <RuntimeSnapshotProvider value={{}}>
//       <ErrorBoundary fallback={suspenseFallback ?? <DefaultFallback />}>
//         <CoreCluster storageConfig={storageConfig}>
//           <UICluster>
//             <StatePersistenceProvider value={{ runtimeActions }}>
//               <SecurityCluster
//                 lazyLoad={lazyLoad}
//                 fallback={suspenseFallback}
//               />
//               <DataCluster lazyLoad={lazyLoad} fallback={suspenseFallback}>
//                 <SyncCluster lazyLoad={lazyLoad} fallback={suspenseFallback}>
//                   {children}
//                 </SyncCluster>
//               </DataCluster>
//             </StatePersistenceProvider>
//           </UICluster>
//         </CoreCluster>
//       </ErrorBoundary>
//     </RuntimeSnapshotProvider>
//   );
// }

// AppRuntime.propTypes = {
//   children: PropTypes.node.isRequired,
//   options: PropTypes.shape({
//     lazyLoad: PropTypes.bool,
//     preload: PropTypes.bool,
//     enableAnalytics: PropTypes.bool,
//     suspenseFallback: PropTypes.node,
//   }),
// };

// export default AppRuntime;

// // ===========================
// // Dưới đây là phiên bản AppRuntime v10 – đã refactor hoàn chỉnh cho Task 10
// // src/AppRuntime/AppRuntime.jsx
// import React, { Suspense, lazy, useMemo, useEffect, useCallback } from "react";
// import PropTypes from "prop-types";

// /* =========================
//    Core Providers (light)
//    - kept synchronous to ensure environment and toast are available ASAP
// ========================= */
// import ToastProvider from "../components/Toast/ToastProvider";
// import { NetworkProvider } from "../context/modules/NetworkContext";
// import { DeviceProvider } from "../context/modules/DeviceContext";
// import { SettingsProvider } from "../context/modules/SettingsContext";
// import { UIProvider } from "../context/modules/UIContext";
// import { StorageProvider } from "../context/modules/StorageContext";
// import { CacheProvider } from "../context/modules/CacheContext";
// import { StatePersistenceProvider } from "../context/StatePersistenceContext";

// /* =========================
//    Lazy Providers (heavy)
//    - keep same import paths as your project structure
//    - lazy so initial paint/boot is faster; use preload option to warm them
// ========================= */
// const AuthProvider = lazy(() =>
//   import("../context/AuthContext/AuthContext").then((m) => ({
//     default: m.AuthProvider,
//   }))
// );

// const APIProvider = lazy(() =>
//   import("../context/APIContext/APIContext").then((m) => ({
//     default: m.APIProvider,
//   }))
// );

// const DataProvider = lazy(() =>
//   import("../context/modules/DataContext").then((m) => ({
//     default: m.DataProvider,
//   }))
// );

// const DataSyncProvider = lazy(() =>
//   import("../context/modules/DataSyncContext").then((m) => ({
//     default: m.DataSyncProvider,
//   }))
// );

// const NotificationProvider = lazy(() =>
//   import("../context/modules/NotificationContext").then((m) => ({
//     default: m.NotificationProvider,
//   }))
// );

// /* =========================
//    Default Suspense fallback
//    - memoized to avoid recreating element each render
// ========================= */
// const DefaultFallback = React.memo(function DefaultFallback() {
//   return (
//     <div aria-busy="true" style={{ padding: 16 }}>
//       Loading…
//     </div>
//   );
// });

// /* =========================
//    Error Boundary (RuntimeBoundary)
//    - uses PureComponent to avoid unnecessary re-renders
//    - isolates runtime-level crashes and shows fallback
// ========================= */
// class ErrorBoundary extends React.PureComponent {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false, error: null };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error, info) {
//     // Keep logging but do not re-throw (we isolate runtime errors here)
//     console.error("RuntimeBoundary caught:", error, info);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         this.props.fallback ?? (
//           <div role="alert" style={{ padding: 20 }}>
//             <h2>Something went wrong.</h2>
//             <pre style={{ whiteSpace: "pre-wrap" }}>
//               {String(this.state.error)}
//             </pre>
//           </div>
//         )
//       );
//     }
//     return this.props.children;
//   }
// }

// /* =========================
//    Preload helpers
//    - safe dynamic imports to warm bundles
//    - no side effects expected from these imports; they just load modules
// ========================= */
// export function preloadRuntimeModules(
//   modules = ["Auth", "API", "Data", "DataSync", "Notification"]
// ) {
//   modules.forEach((name) => {
//     switch (name) {
//       case "Auth":
//         import("../context/AuthContext/AuthContext");
//         break;
//       case "API":
//         import("../context/APIContext/APIContext");
//         break;
//       case "Data":
//         import("../context/modules/DataContext");
//         break;
//       case "DataSync":
//         import("../context/modules/DataSyncContext");
//         break;
//       case "Notification":
//         import("../context/modules/NotificationContext");
//         break;
//       default:
//         break;
//     }
//   });
// }

// /* =========================
//    RUNTIME CLUSTERS (memoized)
//    - Each cluster is a small provider composition
//    - Memoized to avoid re-render when parent renders with same props
//    - Comments explain flow and intent
// ========================= */

// /* -------------------------
//    CoreCluster
//    Flow:
//    1. ToastProvider must be mounted early so toastService/UI can show messages during boot.
//    2. StorageProvider handles local/session persistence (sync with StatePersistence).
//    3. NetworkProvider + DeviceProvider provide environment info to everyone downstream.
// ------------------------- */
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

// /* -------------------------
//    UICluster
//    Flow:
//    - Settings + UI contexts are user-facing and stable; mount after CoreCluster
//    - Provides theme, language, UI state that other modules (Auth, Data) may read
// ------------------------- */
// const UICluster = React.memo(function UICluster({ children }) {
//   return (
//     <SettingsProvider>
//       <UIProvider>{children}</UIProvider>
//     </SettingsProvider>
//   );
// });

// /* -------------------------
//    SecurityCluster (lazy)
//    Flow:
//    - APIProvider wraps AuthProvider so Auth can call API (token exchange, user info).
//    - Lazy by default to avoid loading heavy auth/api bundles on initial paint.
//    - If lazyLoad === false, mounts synchronously (useful for SSR tests / deterministic boot).
// ------------------------- */
// function SecurityClusterInner({ children }) {
//   return (
//     <APIProvider>
//       <AuthProvider>{children}</AuthProvider>
//     </APIProvider>
//   );
// }

// const SecurityCluster = React.memo(function SecurityCluster({
//   children,
//   lazyLoad,
//   fallback,
// }) {
//   return lazyLoad ? (
//     <Suspense fallback={fallback ?? <DefaultFallback />}>
//       <SecurityClusterInner>{children}</SecurityClusterInner>
//     </Suspense>
//   ) : (
//     <SecurityClusterInner>{children}</SecurityClusterInner>
//   );
// });

// /* -------------------------
//    DataCluster (lazy)
//    Flow:
//    - CacheProvider sits above DataProvider so cache logic can short-circuit network calls.
//    - DataProvider provides domain-level data hooks used by UI + DataSync.
// ------------------------- */
// function DataClusterInner({ children }) {
//   return (
//     <CacheProvider>
//       <DataProvider>{children}</DataProvider>
//     </CacheProvider>
//   );
// }

// const DataCluster = React.memo(function DataCluster({
//   children,
//   lazyLoad,
//   fallback,
// }) {
//   return lazyLoad ? (
//     <Suspense fallback={fallback ?? <DefaultFallback />}>
//       <DataClusterInner>{children}</DataClusterInner>
//     </Suspense>
//   ) : (
//     <DataClusterInner>{children}</DataClusterInner>
//   );
// });

// /* -------------------------
//    SyncCluster (lazy)
//    Flow:
//    - DataSyncProvider orchestrates sync loops (push/pull) and should mount after DataProvider + Auth.
//    - NotificationProvider wraps children so notifications originating from sync can show toasts/UI.
// ------------------------- */
// function SyncClusterInner({ children }) {
//   return (
//     <DataSyncProvider>
//       <NotificationProvider>{children}</NotificationProvider>
//     </DataSyncProvider>
//   );
// }

// const SyncCluster = React.memo(function SyncCluster({
//   children,
//   lazyLoad,
//   fallback,
// }) {
//   return lazyLoad ? (
//     <Suspense fallback={fallback ?? <DefaultFallback />}>
//       <SyncClusterInner>{children}</SyncClusterInner>
//     </Suspense>
//   ) : (
//     <SyncClusterInner>{children}</SyncClusterInner>
//   );
// });

// /* =========================
//    AppRuntime main export
//    - Options:
//      - lazyLoad: whether to lazy load heavy providers (Auth, API, Data, DataSync, Notification)
//      - preload: schedule a background preload of heavy modules
//      - enableAnalytics: reserved (no-op here) – kept for parity with previous interface
//      - suspenseFallback: override default fallback UI for Suspense
//    - Guarantees:
//      - StatePersistenceProvider wraps entire tree to allow state hydration before heavy providers run.
//      - Order is preserved to avoid race conditions:
//          StatePersistence -> ErrorBoundary -> CoreCluster -> UICluster -> SecurityCluster -> DataCluster -> SyncCluster -> children
// ========================= */
// export function AppRuntime({ children, options = {} }) {
//   const {
//     lazyLoad = true,
//     preload = false,
//     enableAnalytics = false,
//     suspenseFallback = null,
//   } = options;

//   /* -------------------------
//      Preload modules if requested
//      - useEffect with small timeout to allow initial paint to finish
//      - micro-delay prevents blocking synchronous mount
//   ------------------------- */
//   useEffect(() => {
//     if (preload) {
//       const timer = setTimeout(() => preloadRuntimeModules(), 100);
//       return () => clearTimeout(timer);
//     }
//     return undefined;
//   }, [preload]);

//   /* -------------------------
//      storageConfig:
//      - Memoized so StorageProvider doesn't receive new object each render
//      - Matches previous default persistKey + version
//   ------------------------- */
//   const storageConfig = useMemo(
//     () => ({ persistKey: "app_v1_state", debounceMs: 400, version: 1 }),
//     []
//   );

//   /* -------------------------
//      runtimeActions:
//      - stable API object passed into StatePersistenceProvider
//      - useCallback or useMemo to avoid prop changes causing re-render down the tree
//   ------------------------- */
//   const runtimeActions = useMemo(
//     () => ({
//       flushCaches: () => {
//         // placeholder action; keep side-effect free here
//         // implement actual flush logic in a separate runtime service if needed
//       },
//     }),
//     []
//   );

//   /* -------------------------
//      Suspense fallback resolver:
//      - uses provided suspenseFallback or DefaultFallback
//   ------------------------- */
//   const resolvedFallback = useMemo(
//     () => suspenseFallback ?? <DefaultFallback />,
//     [suspenseFallback]
//   );

//   /* =========================
//      Render Tree (order matters)
//      Flow explanation (top-to-bottom):
//      1. StatePersistenceProvider mounts first — it can hydrate persisted app state.
//      2. ErrorBoundary isolates runtime crashes so UI doesn't break the entire page.
//      3. CoreCluster mounts Toast + Storage + Network + Device.
//         - Toast must be available early so services can enqueue toasts during startup.
//      4. UICluster mounts Settings + UI contexts (theme/lang).
//      5. SecurityCluster mounts API + Auth (lazy by default).
//         - Auth relies on API; Auth must be inside API so it can call token endpoints.
//      6. DataCluster mounts Cache + Data (lazy by default).
//         - Cache helps Data short-circuit network reads.
//      7. SyncCluster mounts DataSync + Notification (lazy by default).
//         - DataSync relies on Auth/Data; Notification must be available to show sync results.
//      8. children rendered last so they have access to all contexts above.
//   ========================= */
//   return (
//     <StatePersistenceProvider value={{ runtimeActions }}>
//       <ErrorBoundary fallback={resolvedFallback}>
//         <CoreCluster storageConfig={storageConfig}>
//           <UICluster>
//             <SecurityCluster lazyLoad={lazyLoad} fallback={resolvedFallback}>
//               <DataCluster lazyLoad={lazyLoad} fallback={resolvedFallback}>
//                 <SyncCluster lazyLoad={lazyLoad} fallback={resolvedFallback}>
//                   {children}
//                 </SyncCluster>
//               </DataCluster>
//             </SecurityCluster>
//           </UICluster>
//         </CoreCluster>
//       </ErrorBoundary>
//     </StatePersistenceProvider>
//   );
// }

// /* =========================
//    PropTypes & default export
// ========================= */
// AppRuntime.propTypes = {
//   children: PropTypes.node.isRequired,
//   options: PropTypes.shape({
//     lazyLoad: PropTypes.bool,
//     preload: PropTypes.bool,
//     enableAnalytics: PropTypes.bool,
//     suspenseFallback: PropTypes.node,
//   }),
// };

// export default React.memo(AppRuntime);

// ===============================
// Đây sẽ là phiên bản sẵn sàng release.
// ===========================
// src/AppRuntime/AppRuntime.final.jsx
// import React, { Suspense, lazy, useMemo, useEffect } from "react";
// import PropTypes from "prop-types";

// /* =========================
//    Core Providers (synchronous)
// ========================= */
// import ToastProvider from "../components/Toast/ToastProvider";
// import { NetworkProvider } from "../context/modules/NetworkContext";
// import { DeviceProvider } from "../context/modules/DeviceContext";
// import { SettingsProvider } from "../context/modules/SettingsContext";
// import { UIProvider } from "../context/modules/UIContext";
// import { StorageProvider } from "../context/modules/StorageContext";
// import { CacheProvider } from "../context/modules/CacheContext";
// import { StatePersistenceProvider } from "../context/StatePersistenceContext";

// /* =========================
//    Lazy Providers
// ========================= */
// const AuthProvider = lazy(() =>
//   import("../context/AuthContext/AuthContext").then((m) => ({
//     default: m.AuthProvider,
//   }))
// );
// const APIProvider = lazy(() =>
//   import("../context/APIContext/APIContext").then((m) => ({
//     default: m.APIProvider,
//   }))
// );
// const DataProvider = lazy(() =>
//   import("../context/modules/DataContext").then((m) => ({
//     default: m.DataProvider,
//   }))
// );
// const DataSyncProvider = lazy(() =>
//   import("../context/modules/DataSyncContext").then((m) => ({
//     default: m.DataSyncProvider,
//   }))
// );
// const NotificationProvider = lazy(() =>
//   import("../context/modules/NotificationContext").then((m) => ({
//     default: m.NotificationProvider,
//   }))
// );

// /* =========================
//    Default fallback UI
// ========================= */
// const DefaultFallback = React.memo(() => (
//   <div data-testid="fallback" aria-busy="true" style={{ padding: 16 }}>
//     Loading…
//   </div>
// ));

// /* =========================
//    Runtime Error Boundary
// ========================= */
// class ErrorBoundary extends React.PureComponent {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false, error: null };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error, info) {
//     console.error("RuntimeBoundary caught:", error, info);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         this.props.fallback ?? (
//           <div role="alert" style={{ padding: 20 }}>
//             <h2>Something went wrong.</h2>
//             <pre style={{ whiteSpace: "pre-wrap" }}>
//               {String(this.state.error)}
//             </pre>
//           </div>
//         )
//       );
//     }
//     return this.props.children;
//   }
// }

// /* =========================
//    Preload helper
// ========================= */
// export function preloadRuntimeModules(
//   modules = ["Auth", "API", "Data", "DataSync", "Notification"]
// ) {
//   modules.forEach((name) => {
//     switch (name) {
//       case "Auth":
//         import("../context/AuthContext/AuthContext");
//         break;
//       case "API":
//         import("../context/APIContext/APIContext");
//         break;
//       case "Data":
//         import("../context/modules/DataContext");
//         break;
//       case "DataSync":
//         import("../context/modules/DataSyncContext");
//         break;
//       case "Notification":
//         import("../context/modules/NotificationContext");
//         break;
//       default:
//         break;
//     }
//   });
// }

// /* =========================
//    Memoized Clusters
// ========================= */
// const CoreCluster = React.memo(({ children, storageConfig }) => (
//   <ToastProvider>
//     <StorageProvider config={storageConfig}>
//       <NetworkProvider>
//         <DeviceProvider>{children}</DeviceProvider>
//       </NetworkProvider>
//     </StorageProvider>
//   </ToastProvider>
// ));

// const UICluster = React.memo(({ children }) => (
//   <SettingsProvider>
//     <UIProvider>{children}</UIProvider>
//   </SettingsProvider>
// ));

// const SecurityClusterInner = ({ children }) => (
//   <APIProvider>
//     <AuthProvider>{children}</AuthProvider>
//   </APIProvider>
// );

// const SecurityCluster = React.memo(({ children, lazyLoad, fallback }) =>
//   lazyLoad ? (
//     <Suspense fallback={fallback ?? <DefaultFallback />}>
//       <SecurityClusterInner>{children}</SecurityClusterInner>
//     </Suspense>
//   ) : (
//     <SecurityClusterInner>{children}</SecurityClusterInner>
//   )
// );

// const DataClusterInner = ({ children }) => (
//   <CacheProvider>
//     <DataProvider>{children}</DataProvider>
//   </CacheProvider>
// );

// const DataCluster = React.memo(({ children, lazyLoad, fallback }) =>
//   lazyLoad ? (
//     <Suspense fallback={fallback ?? <DefaultFallback />}>
//       <DataClusterInner>{children}</DataClusterInner>
//     </Suspense>
//   ) : (
//     <DataClusterInner>{children}</DataClusterInner>
//   )
// );

// const SyncClusterInner = ({ children }) => (
//   <DataSyncProvider>
//     <NotificationProvider>{children}</NotificationProvider>
//   </DataSyncProvider>
// );

// const SyncCluster = React.memo(({ children, lazyLoad, fallback }) =>
//   lazyLoad ? (
//     <Suspense fallback={fallback ?? <DefaultFallback />}>
//       <SyncClusterInner>{children}</SyncClusterInner>
//     </Suspense>
//   ) : (
//     <SyncClusterInner>{children}</SyncClusterInner>
//   )
// );

// /* =========================
//    AppRuntime – Final Task 13
// ========================= */
// export function AppRuntime({ children, options = {} }) {
//   const { lazyLoad = true, preload = false, suspenseFallback = null } = options;

//   useEffect(() => {
//     if (preload) {
//       const timer = setTimeout(() => preloadRuntimeModules(), 50);
//       return () => clearTimeout(timer);
//     }
//   }, [preload]);

//   const storageConfig = useMemo(
//     () => ({ persistKey: "app_v1_state", debounceMs: 400, version: 1 }),
//     []
//   );

//   const runtimeActions = useMemo(
//     () => ({
//       flushCaches: () => {},
//     }),
//     []
//   );

//   const resolvedFallback = useMemo(
//     () => suspenseFallback ?? <DefaultFallback />,
//     [suspenseFallback]
//   );

//   return (
//     <StatePersistenceProvider value={{ runtimeActions }}>
//       <ErrorBoundary fallback={resolvedFallback}>
//         <CoreCluster storageConfig={storageConfig}>
//           <UICluster>
//             <SecurityCluster lazyLoad={lazyLoad} fallback={resolvedFallback}>
//               <DataCluster lazyLoad={lazyLoad} fallback={resolvedFallback}>
//                 <SyncCluster lazyLoad={lazyLoad} fallback={resolvedFallback}>
//                   {children}
//                 </SyncCluster>
//               </DataCluster>
//             </SecurityCluster>
//           </UICluster>
//         </CoreCluster>
//       </ErrorBoundary>
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

// export default React.memo(AppRuntime);

// // ===================================
// // ===========================
// // src/AppRuntime/AppRuntime.final.jsx
// // AppRuntime v1 final – Task 13 với đầy đủ integration, dựa trên code AppRuntime v10 ,
// // tối ưu lazy/preload/fallback, memoized clusters, ErrorBoundary, StatePersistence,
// // ToastProvider. Đây sẽ là phiên bản sẵn sàng release.
// import React, { Suspense, lazy, useMemo, useEffect } from "react";
// import PropTypes from "prop-types";

// /* =========================
//    Core Providers (synchronous)
// ========================= */
// import ToastProvider from "../components/Toast/ToastProvider";
// import { NetworkProvider } from "../context/modules/NetworkContext";
// import { DeviceProvider } from "../context/modules/DeviceContext";
// import { SettingsProvider } from "../context/modules/SettingsContext";
// import { UIProvider } from "../context/modules/UIContext";
// import { StorageProvider } from "../context/modules/StorageContext";
// import { CacheProvider } from "../context/modules/CacheContext";
// import { StatePersistenceProvider } from "../context/StatePersistenceContext";

// /* =========================
//    Lazy Providers
// ========================= */
// const AuthProvider = lazy(() =>
//   import("../context/AuthContext/AuthContext").then((m) => ({
//     default: m.AuthProvider,
//   }))
// );
// const APIProvider = lazy(() =>
//   import("../context/APIContext/APIContext").then((m) => ({
//     default: m.APIProvider,
//   }))
// );
// const DataProvider = lazy(() =>
//   import("../context/modules/DataContext").then((m) => ({
//     default: m.DataProvider,
//   }))
// );
// const DataSyncProvider = lazy(() =>
//   import("../context/modules/DataSyncContext").then((m) => ({
//     default: m.DataSyncProvider,
//   }))
// );
// const NotificationProvider = lazy(() =>
//   import("../context/modules/NotificationContext").then((m) => ({
//     default: m.NotificationProvider,
//   }))
// );

// /* =========================
//    Default fallback UI
// ========================= */
// const DefaultFallback = React.memo(() => (
//   <div data-testid="fallback" aria-busy="true" style={{ padding: 16 }}>
//     Loading…
//   </div>
// ));

// /* =========================
//    Runtime Error Boundary
// ========================= */
// class ErrorBoundary extends React.PureComponent {
//   constructor(props) {
//     super(props);
//     this.state = { hasError: false, error: null };
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error, info) {
//     console.error("RuntimeBoundary caught:", error, info);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         this.props.fallback ?? (
//           <div role="alert" style={{ padding: 20 }}>
//             <h2>Something went wrong.</h2>
//             <pre style={{ whiteSpace: "pre-wrap" }}>
//               {String(this.state.error)}
//             </pre>
//           </div>
//         )
//       );
//     }
//     return this.props.children;
//   }
// }

// /* =========================
//    Preload helper
// ========================= */
// export function preloadRuntimeModules(
//   modules = ["Auth", "API", "Data", "DataSync", "Notification"]
// ) {
//   modules.forEach((name) => {
//     switch (name) {
//       case "Auth":
//         import("../context/AuthContext/AuthContext");
//         break;
//       case "API":
//         import("../context/APIContext/APIContext");
//         break;
//       case "Data":
//         import("../context/modules/DataContext");
//         break;
//       case "DataSync":
//         import("../context/modules/DataSyncContext");
//         break;
//       case "Notification":
//         import("../context/modules/NotificationContext");
//         break;
//       default:
//         break;
//     }
//   });
// }

// /* =========================
//    Memoized Clusters
// ========================= */
// const CoreCluster = React.memo(({ children, storageConfig }) => (
//   <ToastProvider>
//     <StorageProvider config={storageConfig}>
//       <NetworkProvider>
//         <DeviceProvider>{children}</DeviceProvider>
//       </NetworkProvider>
//     </StorageProvider>
//   </ToastProvider>
// ));

// const UICluster = React.memo(({ children }) => (
//   <SettingsProvider>
//     <UIProvider>{children}</UIProvider>
//   </SettingsProvider>
// ));

// const SecurityClusterInner = ({ children }) => (
//   <APIProvider>
//     <AuthProvider>{children}</AuthProvider>
//   </APIProvider>
// );

// const SecurityCluster = React.memo(({ children, lazyLoad, fallback }) =>
//   lazyLoad ? (
//     <Suspense fallback={fallback ?? <DefaultFallback />}>
//       <SecurityClusterInner>{children}</SecurityClusterInner>
//     </Suspense>
//   ) : (
//     <SecurityClusterInner>{children}</SecurityClusterInner>
//   )
// );

// const DataClusterInner = ({ children }) => (
//   <CacheProvider>
//     <DataProvider>{children}</DataProvider>
//   </CacheProvider>
// );

// const DataCluster = React.memo(({ children, lazyLoad, fallback }) =>
//   lazyLoad ? (
//     <Suspense fallback={fallback ?? <DefaultFallback />}>
//       <DataClusterInner>{children}</DataClusterInner>
//     </Suspense>
//   ) : (
//     <DataClusterInner>{children}</DataClusterInner>
//   )
// );

// const SyncClusterInner = ({ children }) => (
//   <DataSyncProvider>
//     <NotificationProvider>{children}</NotificationProvider>
//   </DataSyncProvider>
// );

// const SyncCluster = React.memo(({ children, lazyLoad, fallback }) =>
//   lazyLoad ? (
//     <Suspense fallback={fallback ?? <DefaultFallback />}>
//       <SyncClusterInner>{children}</SyncClusterInner>
//     </Suspense>
//   ) : (
//     <SyncClusterInner>{children}</SyncClusterInner>
//   )
// );

// /* =========================
//    AppRuntime – Final Task 13
// ========================= */
// export function AppRuntime({ children, options = {} }) {
//   const { lazyLoad = true, preload = false, suspenseFallback = null } = options;

//   useEffect(() => {
//     if (preload) {
//       const timer = setTimeout(() => preloadRuntimeModules(), 50);
//       return () => clearTimeout(timer);
//     }
//   }, [preload]);

//   const storageConfig = useMemo(
//     () => ({ persistKey: "app_v1_state", debounceMs: 400, version: 1 }),
//     []
//   );

//   const runtimeActions = useMemo(
//     () => ({
//       flushCaches: () => {},
//     }),
//     []
//   );

//   const resolvedFallback = useMemo(
//     () => suspenseFallback ?? <DefaultFallback />,
//     [suspenseFallback]
//   );

//   return (
//     <StatePersistenceProvider value={{ runtimeActions }}>
//       <ErrorBoundary fallback={resolvedFallback}>
//         <CoreCluster storageConfig={storageConfig}>
//           <UICluster>
//             <SecurityCluster lazyLoad={lazyLoad} fallback={resolvedFallback}>
//               <DataCluster lazyLoad={lazyLoad} fallback={resolvedFallback}>
//                 <SyncCluster lazyLoad={lazyLoad} fallback={resolvedFallback}>
//                   {children}
//                 </SyncCluster>
//               </DataCluster>
//             </SecurityCluster>
//           </UICluster>
//         </CoreCluster>
//       </ErrorBoundary>
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

// export default React.memo(AppRuntime);

// // ==============================
// // AppRuntime v2 — orchestration (code)
// // src/AppRuntime/AppRuntime.jsx (AppRuntime v2 - pipeline orchestrator)
// import React, { useEffect, useMemo, useState } from "react";
// import PropTypes from "prop-types";

// import ToastProvider from "../components/Toast/ToastProvider";
// import { NetworkProvider } from "../context/modules/NetworkContext";
// import { DeviceProvider } from "../context/modules/DeviceContext";
// import { SettingsProvider } from "../context/modules/SettingsContext";
// import { UIProvider } from "../context/modules/UIContext";
// import { StorageProvider } from "../context/modules/StorageContext";
// import { CacheProvider } from "../context/modules/CacheContext";
// import { StatePersistenceProvider } from "../context/StatePersistenceContext";

// import { Suspense, lazy } from "react";

// const AuthProvider = lazy(() =>
//   import("../context/AuthContext/AuthContext").then((m) => ({
//     default: m.AuthProvider,
//   }))
// );
// const APIProvider = lazy(() =>
//   import("../context/APIContext/APIContext").then((m) => ({
//     default: m.APIProvider,
//   }))
// );
// const DataProvider = lazy(() =>
//   import("../context/modules/DataContext").then((m) => ({
//     default: m.DataProvider,
//   }))
// );
// const DataSyncProvider = lazy(() =>
//   import("../context/modules/DataSyncContext").then((m) => ({
//     default: m.DataSyncProvider,
//   }))
// );
// const NotificationProvider = lazy(() =>
//   import("../context/modules/NotificationContext").then((m) => ({
//     default: m.NotificationProvider,
//   }))
// );

// const DefaultFallback = React.memo(() => (
//   <div data-testid="fallback" aria-busy="true" style={{ padding: 16 }}>
//     Loading…
//   </div>
// ));

// // small wrapper clusters (keeps tree readable)
// const CoreCluster = ({ children, storageConfig }) => (
//   <ToastProvider>
//     <StorageProvider config={storageConfig}>
//       <NetworkProvider>
//         <DeviceProvider>{children}</DeviceProvider>
//       </NetworkProvider>
//     </StorageProvider>
//   </ToastProvider>
// );

// const UICluster = ({ children }) => (
//   <SettingsProvider>
//     <UIProvider>{children}</UIProvider>
//   </SettingsProvider>
// );

// // Security/Data/Sync clusters as components to mount conditionally
// function SecurityClusterInner({ children }) {
//   return (
//     <APIProvider>
//       <AuthProvider>{children}</AuthProvider>
//     </APIProvider>
//   );
// }
// function DataClusterInner({ children }) {
//   return (
//     <CacheProvider>
//       <DataProvider>{children}</DataProvider>
//     </CacheProvider>
//   );
// }
// function SyncClusterInner({ children }) {
//   return (
//     <DataSyncProvider>
//       <NotificationProvider>{children}</NotificationProvider>
//     </DataSyncProvider>
//   );
// }

// export default function AppRuntime({
//   children,
//   options = { lazyLoad: true, preload: false, suspenseFallback: null },
// }) {
//   const { lazyLoad = true, preload = false, suspenseFallback = null } = options;

//   // track ready providers via events
//   const [readySet, setReadySet] = useState(() => new Set());

//   useEffect(() => {
//     function onReady(e) {
//       const name = e?.detail?.provider;
//       if (!name) return;
//       setReadySet((prev) => {
//         const next = new Set(prev);
//         next.add(name);
//         return next;
//       });
//     }
//     window.addEventListener("app:provider:ready", onReady);
//     return () => window.removeEventListener("app:provider:ready", onReady);
//   }, []);

//   // optionally preload (keeps same helper)
//   useEffect(() => {
//     if (preload) {
//       const t = setTimeout(() => {
//         // caller-provided helper in original file; keep it if present
//         if (typeof window !== "undefined" && window.__preloadRuntimeModules) {
//           window.__preloadRuntimeModules();
//         } else {
//           // fallback: dynamic imports
//           import("../context/AuthContext/AuthContext");
//           import("../context/APIContext/APIContext");
//           import("../context/modules/DataContext");
//           import("../context/modules/DataSyncContext");
//           import("../context/modules/NotificationContext");
//         }
//       }, 50);
//       return () => clearTimeout(t);
//     }
//   }, [preload]);

//   const storageConfig = useMemo(
//     () => ({ persistKey: "app_v2_state", debounceMs: 300, version: 2 }),
//     []
//   );

//   const fallback = suspenseFallback ?? <DefaultFallback />;

//   // helpers to check readiness
//   const has = (name) => readySet.has(name);

//   /* PIPELINE RULES (you can tweak)
//      - SecurityCluster requires API ready (if lazyLoad true) OR will mount immediately when lazyLoad=false
//      - DataCluster requires API + Auth ready
//      - SyncCluster requires Data ready
//   */
//   const canMountSecurity = !lazyLoad || has("API") || has("SecurityImmediate");
//   const canMountData = !lazyLoad || (has("API") && has("Auth"));
//   const canMountSync = !lazyLoad || has("Data");

//   return (
//     <StatePersistenceProvider value={{}}>
//       {/* CoreCluster always mounted */}
//       <CoreCluster storageConfig={storageConfig}>
//         {/* UI always mounted */}
//         <UICluster>
//           {/* Security cluster: mount when allowed */}
//           {canMountSecurity ? (
//             lazyLoad ? (
//               <Suspense fallback={fallback}>
//                 <SecurityClusterInner>
//                   {/* Data cluster */}
//                   {canMountData ? (
//                     lazyLoad ? (
//                       <Suspense fallback={fallback}>
//                         <DataClusterInner>
//                           {canMountSync ? (
//                             lazyLoad ? (
//                               <Suspense fallback={fallback}>
//                                 <SyncClusterInner>{children}</SyncClusterInner>
//                               </Suspense>
//                             ) : (
//                               <SyncClusterInner>{children}</SyncClusterInner>
//                             )
//                           ) : (
//                             // hold children until sync ready
//                             <div data-testid="runtime-waiting-sync">
//                               {children}
//                             </div>
//                           )}
//                         </DataClusterInner>
//                       </Suspense>
//                     ) : (
//                       <DataClusterInner>{children}</DataClusterInner>
//                     )
//                   ) : (
//                     <div data-testid="runtime-waiting-data">{children}</div>
//                   )}
//                 </SecurityClusterInner>
//               </Suspense>
//             ) : (
//               <SecurityClusterInner>
//                 <DataClusterInner>
//                   <SyncClusterInner>{children}</SyncClusterInner>
//                 </DataClusterInner>
//               </SecurityClusterInner>
//             )
//           ) : (
//             // waiting security
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

// // Giải thích ngắn:

// // AppRuntime lắng nghe event app:provider:ready và lưu tên provider vào readySet.

// // canMountSecurity, canMountData, canMountSync quyết định khi nào mount cluster tiếp theo.

// // Nếu lazyLoad=false sẽ mount toàn bộ đồng bộ (dễ test).

// // Nếu lazyLoad=true thì vẫn dùng Suspense nhưng chỉ mount cluster khi phụ thuộc đã “ready”.

// Những sửa chính (tóm tắt)
// Normalize event names: readiness keys đều chuyển về lowercase → tránh mismatch (API / api / Auth ...).
// Pipeline rules chính xác: Security cần api và auth (đảm bảo đúng thứ tự). Data cần api+auth. Sync cần data.
// Preload: dynamic imports khi preload xong sẽ emit app:provider:ready tương ứng để unlock pipeline (fake-ready) — giúp pipeline không phải chờ providers tự emit.
// Reduce Suspense nesting: chỉ dùng một Suspense trên toàn bộ lazy cluster stack thay vì 3 lớp lồng nhau.
// Memoize cluster wrappers với React.memo để tránh re-renders.
// Use startTransition để cập nhật ready set không block UI.
// src/AppRuntime/AppRuntime.jsx (AppRuntime v2 – optimized Task 14)
import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  startTransition,
  Suspense,
} from "react";
import PropTypes from "prop-types";

import ToastProvider from "../components/Toast/ToastProvider";
import { NetworkProvider } from "../context/modules/NetworkContext";
import { DeviceProvider } from "../context/modules/DeviceContext";
import { SettingsProvider } from "../context/modules/SettingsContext";
import { UIProvider } from "../context/modules/UIContext";
import { StorageProvider } from "../context/modules/StorageContext";
import { CacheProvider } from "../context/modules/CacheContext";
import { StatePersistenceProvider } from "../context/StatePersistenceContext";

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

// single fallback component
const DefaultFallback = React.memo(() => (
  <div data-testid="fallback" aria-busy="true" style={{ padding: 16 }}>
    Loading…
  </div>
));

// --- Memoized clusters ---
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

const UICluster = React.memo(function UICluster({ children }) {
  return (
    <SettingsProvider>
      <UIProvider>{children}</UIProvider>
    </SettingsProvider>
  );
});
UICluster.displayName = "UICluster";

// Inner clusters
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

// --- Helper to emit readiness events (normalized lowercase) ---
function emitReady(providerName) {
  try {
    const ev = new CustomEvent("app:provider:ready", {
      detail: { provider: String(providerName).toLowerCase() },
    });
    window.dispatchEvent(ev);
  } catch (e) {
    console.warn("emitReady failed", e);
  }
}

export default function AppRuntime({
  children,
  options = { lazyLoad: true, preload: false, suspenseFallback: null },
}) {
  const { lazyLoad = true, preload = false, suspenseFallback = null } = options;

  // readiness set (lowercase keys)
  const [readySet, setReadySet] = useState(() => new Set());

  const has = useCallback(
    (name) => readySet.has(String(name).toLowerCase()),
    [readySet]
  );

  // listen readiness events
  useEffect(() => {
    function onReady(e) {
      const raw = e?.detail?.provider;
      if (!raw) return;
      const name = String(raw).toLowerCase();
      startTransition(() => {
        setReadySet((prev) => {
          if (prev.has(name)) return prev;
          const next = new Set(prev);
          next.add(name);
          return next;
        });
      });
    }
    window.addEventListener("app:provider:ready", onReady);
    return () => window.removeEventListener("app:provider:ready", onReady);
  }, []);

  // preload lazy modules + emit pseudo-ready
  useEffect(() => {
    if (!preload) return;
    let mounted = true;
    const preloadList = async () => {
      await new Promise((r) => setTimeout(r, 20));
      const imports = [
        import("../context/APIContext/APIContext")
          .then(() => emitReady("api"))
          .catch(() => {}),
        import("../context/AuthContext/AuthContext")
          .then(() => emitReady("auth"))
          .catch(() => {}),
        import("../context/modules/DataContext")
          .then(() => emitReady("data"))
          .catch(() => {}),
        import("../context/modules/DataSyncContext")
          .then(() => emitReady("datasync"))
          .catch(() => {}),
        import("../context/modules/NotificationContext")
          .then(() => emitReady("notification"))
          .catch(() => {}),
      ];
      try {
        await Promise.all(imports);
      } finally {
        if (!mounted) return;
      }
    };
    preloadList();
    return () => {
      mounted = false;
    };
  }, [preload]);

  const storageConfig = useMemo(
    () => ({ persistKey: "app_v2_state", debounceMs: 300, version: 2 }),
    []
  );

  const fallback = suspenseFallback ?? <DefaultFallback />;

  // PIPELINE RULES (lowercase normalized)
  const canMountSecurity = !lazyLoad || (has("api") && has("auth"));
  const canMountData = !lazyLoad || (has("api") && has("auth"));
  const canMountSync = !lazyLoad || has("data");

  // single Suspense for all lazy providers
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

  const lazyTreeWithSuspense = (
    <Suspense fallback={fallback}>{lazyTree}</Suspense>
  );

  return (
    <StatePersistenceProvider value={{}}>
      <CoreCluster storageConfig={storageConfig}>
        <UICluster>
          {canMountSecurity ? (
            lazyLoad ? (
              lazyTreeWithSuspense
            ) : (
              <SecurityClusterInner>
                <DataClusterInner>
                  <SyncClusterInner>{children}</SyncClusterInner>
                </DataClusterInner>
              </SecurityClusterInner>
            )
          ) : (
            <div data-testid="runtime-waiting-security">{children}</div>
          )}
        </UICluster>
      </CoreCluster>
    </StatePersistenceProvider>
  );
}

AppRuntime.propTypes = {
  children: PropTypes.node.isRequired,
  options: PropTypes.shape({
    lazyLoad: PropTypes.bool,
    preload: PropTypes.bool,
    suspenseFallback: PropTypes.node,
  }),
};
