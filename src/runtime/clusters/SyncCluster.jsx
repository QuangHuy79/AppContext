// // src/AppRuntime/clusters/SyncCluster.jsx
// import React, { memo, Suspense } from "react";
// import { DataSyncProvider } from "../../context/modules/DataSyncContext";
// import { NotificationProvider } from "../../context/modules/NotificationContext";
// // import DefaultFallback from "../DefaultFallback"; // fallback chuẩn cho Suspense

// // /**
// //  * =========================
// //  * SyncClusterInner
// //  * =========================
// //  * Gói DataSyncProvider + NotificationProvider
// //  * Chỉ dùng cho AppRuntime internal
// //  */
// // function SyncClusterInner({ children }) {
// //   return (
// //     <DataSyncProvider>
// //       <NotificationProvider>{children}</NotificationProvider>
// //     </DataSyncProvider>
// //   );
// // }

// // /**
// //  * =========================
// //  * SyncCluster
// //  * =========================
// //  * Wrapper memo + Suspense cho lazy loading
// //  */
// // const SyncCluster = memo(function SyncCluster({
// //   children,
// //   lazyLoad,
// //   fallback,
// // }) {
// //   return lazyLoad ? (
// //     <Suspense fallback={fallback ?? <DefaultFallback />}>
// //       <SyncClusterInner>{children}</SyncClusterInner>
// //     </Suspense>
// //   ) : (
// //     <SyncClusterInner>{children}</SyncClusterInner>
// //   );
// // });

// // export default SyncCluster;
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

// /* =========================
//    SecurityCluster (lazy)
// ========================= */
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
//   if (lazyLoad) {
//     return (
//       <Suspense fallback={fallback ?? <DefaultFallback />}>
//         <SecurityClusterInner>{children}</SecurityClusterInner>
//       </Suspense>
//     );
//   }
//   return <SecurityClusterInner>{children}</SecurityClusterInner>;
// });

// /* =========================
//    DataCluster
// ========================= */
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
//   if (lazyLoad) {
//     return (
//       <Suspense fallback={fallback ?? <DefaultFallback />}>
//         <DataClusterInner>{children}</DataClusterInner>
//       </Suspense>
//     );
//   }
//   return <DataClusterInner>{children}</DataClusterInner>;
// });

// /* =========================
//    SyncCluster
// ========================= */
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
//   if (lazyLoad) {
//     return (
//       <Suspense fallback={fallback ?? <DefaultFallback />}>
//         <SyncClusterInner>{children}</SyncClusterInner>
//       </Suspense>
//     );
//   }
//   return <SyncClusterInner>{children}</SyncClusterInner>;
// });

// =============================
// SyncCluster.jsx chuẩn (FULL, không đổi cấu trúc)
// Giữ nguyên toàn bộ logic đang dùng — chỉ bổ sung import và sửa lại comment.

// src/runtime/clusters/SyncCluster.jsx
import React, { memo, Suspense } from "react";

// === Providers theo kiến trúc AppRuntime v2 ===
import { APIProvider } from "../../context/APIContext/APIContext";
import { AuthProvider } from "../../context/AuthContext/AuthContext";

import { CacheProvider } from "../../context/modules/CacheContext";
import { DataProvider } from "../../context/modules/DataContext";

import { DataSyncProvider } from "../../context/modules/DataSyncContext";
import { NotificationProvider } from "../../context/modules/NotificationContext";

function DefaultFallback() {
  return (
    <div aria-busy="true" style={{ padding: 16 }}>
      Loading…
    </div>
  );
}

/* =========================
   SecurityCluster
========================= */
function SecurityClusterInner({ children }) {
  return (
    <APIProvider>
      <AuthProvider>{children}</AuthProvider>
    </APIProvider>
  );
}

const SecurityCluster = memo(function SecurityCluster({
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

const DataCluster = memo(function DataCluster({
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

const SyncCluster = memo(function SyncCluster({
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

export { SecurityCluster, DataCluster, SyncCluster };
