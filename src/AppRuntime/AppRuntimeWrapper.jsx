// // src/runtime/AppRuntimeWrapper.jsx
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

// // --- Lazy wrappers ---
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

// // --- Fallback ---
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

// const UICluster = React.memo(function UICluster({ children }) {
//   return (
//     <SettingsProvider>
//       <UIProvider>{children}</UIProvider>
//     </SettingsProvider>
//   );
// });

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

// const DataClusterInner = React.memo(function DataClusterInner({ children }) {
//   return (
//     <CacheProvider>
//       <DataProvider>{children}</DataProvider>
//     </CacheProvider>
//   );
// });

// const SyncClusterInner = React.memo(function SyncClusterInner({ children }) {
//   return (
//     <DataSyncProvider>
//       <NotificationProvider>{children}</NotificationProvider>
//     </DataSyncProvider>
//   );
// });

// // --- Helper emit ready ---
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

// // --- AppRuntimeWrapper ---
// export default function AppRuntimeWrapper({
//   children,
//   options = { lazyLoad: true, preload: false, suspenseFallback: null },
// }) {
//   const { lazyLoad = true, preload = false, suspenseFallback = null } = options;

//   const [readySet, setReadySet] = useState(() => new Set());
//   const has = useCallback(
//     (name) => readySet.has(String(name).toLowerCase()),
//     [readySet]
//   );

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

//   // preload lazy modules + pseudo-ready
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

//   const canMountSecurity = !lazyLoad || (has("api") && has("auth"));
//   const canMountData = !lazyLoad || (has("api") && has("auth"));
//   const canMountSync = !lazyLoad || has("data");

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

// AppRuntimeWrapper.propTypes = {
//   children: PropTypes.node.isRequired,
//   options: PropTypes.shape({
//     lazyLoad: PropTypes.bool,
//     preload: PropTypes.bool,
//     suspenseFallback: PropTypes.node,
//   }),
// };

// ======================================
// src/AppRuntime/AppRuntimeWrapper.jsx
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

// Lazy providers (keep as lazy for real app)
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

// single fallback component (test-friendly)
const DefaultFallback = React.memo(() => (
  <div data-testid="fallback" aria-busy="true" style={{ padding: 16 }}>
    Loading…
  </div>
));

// Core cluster (always rendered, not inside Suspense)
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

// UI cluster (always rendered)
const UICluster = React.memo(function UICluster({ children }) {
  return (
    <SettingsProvider>
      <UIProvider>{children}</UIProvider>
    </SettingsProvider>
  );
});
UICluster.displayName = "UICluster";

// Inner clusters (lazy)
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

// emitReady helper (same as original)
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

/**
 * AppRuntimeWrapper
 *
 * - Core/UI clusters always mounted (outside Suspense)
 * - Lazy clusters are rendered inside one Suspense with single fallback
 * - options:
 *   - lazyLoad: boolean (default true) — if false, lazy clusters mount synchronously (no Suspense)
 *   - preload: boolean — if true, pre-import lazy modules (warm-up) and emit pseudo-ready events
 *   - suspenseFallback: node — custom fallback to use for Suspense
 */
export default function AppRuntimeWrapper({
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

  // Listen readiness events and update readySet (startTransition for non-blocking)
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

  // Preload lazy modules if requested (warm-up) — this only loads code and emits pseudo-ready,
  // it does not mount any provider instances here.
  useEffect(() => {
    if (!preload) return;
    let mounted = true;
    const preloadList = async () => {
      // tiny delay to allow mounting sequence to settle
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

  // fallback: use provided suspenseFallback if present; otherwise default
  const fallback = suspenseFallback ?? <DefaultFallback />;

  // pipeline rules (lowercase normalized)
  const canMountSecurity = !lazyLoad || (has("api") && has("auth"));
  const canMountData = !lazyLoad || (has("api") && has("auth"));
  const canMountSync = !lazyLoad || has("data");

  // lazyTree nested in pipeline order
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

  // Suspense wrapper for the lazy clusters only
  const lazyTreeWithSuspense = (
    <Suspense fallback={fallback}>{lazyTree}</Suspense>
  );

  return (
    <StatePersistenceProvider value={{}}>
      <CoreCluster storageConfig={storageConfig}>
        <UICluster>
          {/* Core/UI are outside Suspense so they render immediately */}
          {canMountSecurity ? (
            lazyLoad ? (
              // lazyLoad true -> render lazy tree inside Suspense
              lazyTreeWithSuspense
            ) : (
              // lazyLoad false -> mount lazy clusters synchronously (no Suspense)
              <SecurityClusterInner>
                <DataClusterInner>
                  <SyncClusterInner>{children}</SyncClusterInner>
                </DataClusterInner>
              </SecurityClusterInner>
            )
          ) : (
            // If security cannot mount yet, show waiting placeholder but keep Core/UI rendered
            <div data-testid="runtime-waiting-security">{children}</div>
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
