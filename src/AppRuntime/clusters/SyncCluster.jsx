// src/AppRuntime/clusters/SyncCluster.jsx
import React, { memo, Suspense } from "react";
import { DataSyncProvider } from "../../context/modules/DataSyncContext";
import { NotificationProvider } from "../../context/modules/NotificationContext";
// import DefaultFallback from "../DefaultFallback"; // fallback chuẩn cho Suspense

// /**
//  * =========================
//  * SyncClusterInner
//  * =========================
//  * Gói DataSyncProvider + NotificationProvider
//  * Chỉ dùng cho AppRuntime internal
//  */
// function SyncClusterInner({ children }) {
//   return (
//     <DataSyncProvider>
//       <NotificationProvider>{children}</NotificationProvider>
//     </DataSyncProvider>
//   );
// }

// /**
//  * =========================
//  * SyncCluster
//  * =========================
//  * Wrapper memo + Suspense cho lazy loading
//  */
// const SyncCluster = memo(function SyncCluster({
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

// export default SyncCluster;
/* -------------------------
   Default Suspense fallback
------------------------- */
function DefaultFallback() {
  return (
    <div aria-busy="true" style={{ padding: 16 }}>
      Loading…
    </div>
  );
}

/* =========================
   SecurityCluster (lazy)
========================= */
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
  if (lazyLoad) {
    return (
      <Suspense fallback={fallback ?? <DefaultFallback />}>
        <SecurityClusterInner>{children}</SecurityClusterInner>
      </Suspense>
    );
  }
  return <SecurityClusterInner>{children}</SecurityClusterInner>;
});

/* =========================
   DataCluster
========================= */
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
  if (lazyLoad) {
    return (
      <Suspense fallback={fallback ?? <DefaultFallback />}>
        <DataClusterInner>{children}</DataClusterInner>
      </Suspense>
    );
  }
  return <DataClusterInner>{children}</DataClusterInner>;
});

/* =========================
   SyncCluster
========================= */
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
  if (lazyLoad) {
    return (
      <Suspense fallback={fallback ?? <DefaultFallback />}>
        <SyncClusterInner>{children}</SyncClusterInner>
      </Suspense>
    );
  }
  return <SyncClusterInner>{children}</SyncClusterInner>;
});
