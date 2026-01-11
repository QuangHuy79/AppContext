// // src/AppRuntime/RuntimeBoundary.jsx
// import React, { createContext, useContext } from "react";

// const SnapshotContext = createContext(null);

// export function RuntimeSnapshotProvider({ value, children }) {
//   return (
//     <SnapshotContext.Provider value={value}>
//       {children}
//     </SnapshotContext.Provider>
//   );
// }

// export function useRuntimeSnapshot(key) {
//   const ctx = useContext(SnapshotContext);
//   if (!ctx) return null;
//   return key ? ctx[key] : ctx;
// }

// export function RuntimeBoundary({
//   children,
//   fallback,
//   clusterName = "Cluster",
// }) {
//   return (
//     <ErrorBoundary
//       fallback={
//         fallback || (
//           <div style={{ padding: 16 }}>
//             <strong>{clusterName} failed to load.</strong>
//           </div>
//         )
//       }
//     >
//       {children}
//     </ErrorBoundary>
//   );
// }

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
//       return this.props.fallback;
//     }
//     return this.props.children;
//   }
// }

// ======================================
// FILE FULL — RuntimeBoundary.jsx (CLEAN + LOCKED)
// src/AppRuntime/RuntimeBoundary.jsx
import React, { createContext, useContext } from "react";

/* --------------------------------------------------
   Snapshot Context (READ-ONLY)
-------------------------------------------------- */
const SnapshotContext = createContext(null);

export function RuntimeSnapshotProvider({ value, children }) {
  return (
    <SnapshotContext.Provider value={value}>
      {children}
    </SnapshotContext.Provider>
  );
}

export function useRuntimeSnapshot(key) {
  const ctx = useContext(SnapshotContext);
  if (!ctx) return null;
  return key ? ctx[key] : ctx;
}

/* --------------------------------------------------
   Runtime Boundary (PRODUCTION-SAFE)
-------------------------------------------------- */
export function RuntimeBoundary({
  children,
  fallback,
  clusterName = "Cluster",
}) {
  return (
    <ErrorBoundary
      fallback={
        fallback || (
          <div style={{ padding: 16 }}>
            <strong>{clusterName} failed to load.</strong>
          </div>
        )
      }
    >
      {children}
    </ErrorBoundary>
  );
}

/* --------------------------------------------------
   ErrorBoundary (NO LOGGING)
-------------------------------------------------- */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // ❌ NO console
    // ❌ NO side effects
    // Error already handled by upper-level boundaries
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
