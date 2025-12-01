// src/AppRuntime/AppRuntime.jsx
import React, { Suspense, lazy, useMemo, useEffect, useCallback } from "react";
import PropTypes from "prop-types";

/* =========================
   Core Providers (light)
   - kept synchronous to ensure environment and toast are available ASAP
========================= */
import ToastProvider from "../components/Toast/ToastProvider";
import { NetworkProvider } from "../context/modules/NetworkContext";
import { DeviceProvider } from "../context/modules/DeviceContext";
import { SettingsProvider } from "../context/modules/SettingsContext";
import { UIProvider } from "../context/modules/UIContext";
import { StorageProvider } from "../context/modules/StorageContext";
import { CacheProvider } from "../context/modules/CacheContext";
import { StatePersistenceProvider } from "../context/StatePersistenceContext";

/* =========================
   Lazy Providers (heavy)
   - keep same import paths as your project structure
   - lazy so initial paint/boot is faster; use preload option to warm them
========================= */
const AuthProvider = lazy(() =>
  import("../context/AuthContext/AuthContext").then((m) => ({
    default: m.AuthProvider,
  }))
);

const APIProvider = lazy(() =>
  import("../context/APIContext/APIContext").then((m) => ({
    default: m.APIProvider,
  }))
);

const DataProvider = lazy(() =>
  import("../context/modules/DataContext").then((m) => ({
    default: m.DataProvider,
  }))
);

const DataSyncProvider = lazy(() =>
  import("../context/modules/DataSyncContext").then((m) => ({
    default: m.DataSyncProvider,
  }))
);

const NotificationProvider = lazy(() =>
  import("../context/modules/NotificationContext").then((m) => ({
    default: m.NotificationProvider,
  }))
);

/* =========================
   Default Suspense fallback
   - memoized to avoid recreating element each render
========================= */
const DefaultFallback = React.memo(function DefaultFallback() {
  return (
    <div aria-busy="true" style={{ padding: 16 }}>
      Loading…
    </div>
  );
});

/* =========================
   Error Boundary (RuntimeBoundary)
   - uses PureComponent to avoid unnecessary re-renders
   - isolates runtime-level crashes and shows fallback
========================= */
class ErrorBoundary extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Keep logging but do not re-throw (we isolate runtime errors here)
    console.error("RuntimeBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div role="alert" style={{ padding: 20 }}>
            <h2>Something went wrong.</h2>
            <pre style={{ whiteSpace: "pre-wrap" }}>
              {String(this.state.error)}
            </pre>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

/* =========================
   Preload helpers
   - safe dynamic imports to warm bundles
   - no side effects expected from these imports; they just load modules
========================= */
export function preloadRuntimeModules(
  modules = ["Auth", "API", "Data", "DataSync", "Notification"]
) {
  modules.forEach((name) => {
    switch (name) {
      case "Auth":
        import("../context/AuthContext/AuthContext");
        break;
      case "API":
        import("../context/APIContext/APIContext");
        break;
      case "Data":
        import("../context/modules/DataContext");
        break;
      case "DataSync":
        import("../context/modules/DataSyncContext");
        break;
      case "Notification":
        import("../context/modules/NotificationContext");
        break;
      default:
        break;
    }
  });
}

/* =========================
   RUNTIME CLUSTERS (memoized)
   - Each cluster is a small provider composition
   - Memoized to avoid re-render when parent renders with same props
   - Comments explain flow and intent
========================= */

/* -------------------------
   CoreCluster
   Flow:
   1. ToastProvider must be mounted early so toastService/UI can show messages during boot.
   2. StorageProvider handles local/session persistence (sync with StatePersistence).
   3. NetworkProvider + DeviceProvider provide environment info to everyone downstream.
------------------------- */
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

/* -------------------------
   UICluster
   Flow:
   - Settings + UI contexts are user-facing and stable; mount after CoreCluster
   - Provides theme, language, UI state that other modules (Auth, Data) may read
------------------------- */
const UICluster = React.memo(function UICluster({ children }) {
  return (
    <SettingsProvider>
      <UIProvider>{children}</UIProvider>
    </SettingsProvider>
  );
});

/* -------------------------
   SecurityCluster (lazy)
   Flow:
   - APIProvider wraps AuthProvider so Auth can call API (token exchange, user info).
   - Lazy by default to avoid loading heavy auth/api bundles on initial paint.
   - If lazyLoad === false, mounts synchronously (useful for SSR tests / deterministic boot).
------------------------- */
function SecurityClusterInner({ children }) {
  return (
    <APIProvider>
      <AuthProvider>{children}</AuthProvider>
    </APIProvider>
  );
}

const SecurityCluster = React.memo(function SecurityCluster({
  children,
  lazyLoad,
  fallback,
}) {
  return lazyLoad ? (
    <Suspense fallback={fallback ?? <DefaultFallback />}>
      <SecurityClusterInner>{children}</SecurityClusterInner>
    </Suspense>
  ) : (
    <SecurityClusterInner>{children}</SecurityClusterInner>
  );
});

/* -------------------------
   DataCluster (lazy)
   Flow:
   - CacheProvider sits above DataProvider so cache logic can short-circuit network calls.
   - DataProvider provides domain-level data hooks used by UI + DataSync.
------------------------- */
function DataClusterInner({ children }) {
  return (
    <CacheProvider>
      <DataProvider>{children}</DataProvider>
    </CacheProvider>
  );
}

const DataCluster = React.memo(function DataCluster({
  children,
  lazyLoad,
  fallback,
}) {
  return lazyLoad ? (
    <Suspense fallback={fallback ?? <DefaultFallback />}>
      <DataClusterInner>{children}</DataClusterInner>
    </Suspense>
  ) : (
    <DataClusterInner>{children}</DataClusterInner>
  );
});

/* -------------------------
   SyncCluster (lazy)
   Flow:
   - DataSyncProvider orchestrates sync loops (push/pull) and should mount after DataProvider + Auth.
   - NotificationProvider wraps children so notifications originating from sync can show toasts/UI.
------------------------- */
function SyncClusterInner({ children }) {
  return (
    <DataSyncProvider>
      <NotificationProvider>{children}</NotificationProvider>
    </DataSyncProvider>
  );
}

const SyncCluster = React.memo(function SyncCluster({
  children,
  lazyLoad,
  fallback,
}) {
  return lazyLoad ? (
    <Suspense fallback={fallback ?? <DefaultFallback />}>
      <SyncClusterInner>{children}</SyncClusterInner>
    </Suspense>
  ) : (
    <SyncClusterInner>{children}</SyncClusterInner>
  );
});

/* =========================
   AppRuntime main export
   - Options:
     - lazyLoad: whether to lazy load heavy providers (Auth, API, Data, DataSync, Notification)
     - preload: schedule a background preload of heavy modules
     - enableAnalytics: reserved (no-op here) – kept for parity with previous interface
     - suspenseFallback: override default fallback UI for Suspense
   - Guarantees:
     - StatePersistenceProvider wraps entire tree to allow state hydration before heavy providers run.
     - Order is preserved to avoid race conditions:
         StatePersistence -> ErrorBoundary -> CoreCluster -> UICluster -> SecurityCluster -> DataCluster -> SyncCluster -> children
========================= */
export function AppRuntime({ children, options = {} }) {
  const {
    lazyLoad = true,
    preload = false,
    enableAnalytics = false,
    suspenseFallback = null,
  } = options;

  /* -------------------------
     Preload modules if requested
     - useEffect with small timeout to allow initial paint to finish
     - micro-delay prevents blocking synchronous mount
  ------------------------- */
  useEffect(() => {
    if (preload) {
      const timer = setTimeout(() => preloadRuntimeModules(), 100);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [preload]);

  /* -------------------------
     storageConfig:
     - Memoized so StorageProvider doesn't receive new object each render
     - Matches previous default persistKey + version
  ------------------------- */
  const storageConfig = useMemo(
    () => ({ persistKey: "app_v1_state", debounceMs: 400, version: 1 }),
    []
  );

  /* -------------------------
     runtimeActions:
     - stable API object passed into StatePersistenceProvider
     - useCallback or useMemo to avoid prop changes causing re-render down the tree
  ------------------------- */
  const runtimeActions = useMemo(
    () => ({
      flushCaches: () => {
        // placeholder action; keep side-effect free here
        // implement actual flush logic in a separate runtime service if needed
      },
    }),
    []
  );

  /* -------------------------
     Suspense fallback resolver:
     - uses provided suspenseFallback or DefaultFallback
  ------------------------- */
  const resolvedFallback = useMemo(
    () => suspenseFallback ?? <DefaultFallback />,
    [suspenseFallback]
  );

  /* =========================
     Render Tree (order matters)
     Flow explanation (top-to-bottom):
     1. StatePersistenceProvider mounts first — it can hydrate persisted app state.
     2. ErrorBoundary isolates runtime crashes so UI doesn't break the entire page.
     3. CoreCluster mounts Toast + Storage + Network + Device.
        - Toast must be available early so services can enqueue toasts during startup.
     4. UICluster mounts Settings + UI contexts (theme/lang).
     5. SecurityCluster mounts API + Auth (lazy by default).
        - Auth relies on API; Auth must be inside API so it can call token endpoints.
     6. DataCluster mounts Cache + Data (lazy by default).
        - Cache helps Data short-circuit network reads.
     7. SyncCluster mounts DataSync + Notification (lazy by default).
        - DataSync relies on Auth/Data; Notification must be available to show sync results.
     8. children rendered last so they have access to all contexts above.
  ========================= */
  return (
    <StatePersistenceProvider value={{ runtimeActions }}>
      <ErrorBoundary fallback={resolvedFallback}>
        <CoreCluster storageConfig={storageConfig}>
          <UICluster>
            <SecurityCluster lazyLoad={lazyLoad} fallback={resolvedFallback}>
              <DataCluster lazyLoad={lazyLoad} fallback={resolvedFallback}>
                <SyncCluster lazyLoad={lazyLoad} fallback={resolvedFallback}>
                  {children}
                </SyncCluster>
              </DataCluster>
            </SecurityCluster>
          </UICluster>
        </CoreCluster>
      </ErrorBoundary>
    </StatePersistenceProvider>
  );
}

/* =========================
   PropTypes & default export
========================= */
AppRuntime.propTypes = {
  children: PropTypes.node.isRequired,
  options: PropTypes.shape({
    lazyLoad: PropTypes.bool,
    preload: PropTypes.bool,
    enableAnalytics: PropTypes.bool,
    suspenseFallback: PropTypes.node,
  }),
};

export default React.memo(AppRuntime);
