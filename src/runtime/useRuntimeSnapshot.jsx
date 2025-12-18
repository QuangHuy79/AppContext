// import React, { createContext, useContext, useMemo, useRef } from "react";
// import PropTypes from "prop-types";

// /**
//  * RuntimeSnapshotContext
//  * - Holds an immutable snapshot of runtime state
//  * - Used for debugging, orchestration, devtools
//  */
// const RuntimeSnapshotContext = createContext(null);

// /* ------------------------------------------------------------------ */
// /* Provider                                                           */
// /* ------------------------------------------------------------------ */

// export function RuntimeSnapshotProvider({ value, children }) {
//   /**
//    * Freeze snapshot once per update
//    * → prevent accidental mutation from consumers
//    */
//   const frozenSnapshot = useMemo(() => {
//     if (process.env.NODE_ENV !== "production" && value) {
//       try {
//         return Object.freeze({ ...value });
//       } catch {
//         return value;
//       }
//     }
//     return value;
//   }, [value]);

//   return (
//     <RuntimeSnapshotContext.Provider value={frozenSnapshot}>
//       {children}
//     </RuntimeSnapshotContext.Provider>
//   );
// }

// RuntimeSnapshotProvider.propTypes = {
//   value: PropTypes.object,
//   children: PropTypes.node.isRequired,
// };

// /* ------------------------------------------------------------------ */
// /* Hooks                                                              */
// /* ------------------------------------------------------------------ */

// /**
//  * useRuntimeSnapshot
//  *
//  * @param {string} [clusterKey]
//  * @returns snapshot | snapshot[clusterKey] | null
//  */
// export function useRuntimeSnapshot(clusterKey) {
//   const snapshot = useContext(RuntimeSnapshotContext);
//   if (!snapshot) return null;

//   return clusterKey ? snapshot[clusterKey] ?? null : snapshot;
// }

// /**
//  * useRuntimeSnapshotRef
//  * - returns stable ref (no re-render)
//  * - useful for logging / effects
//  */
// export function useRuntimeSnapshotRef() {
//   const snapshot = useContext(RuntimeSnapshotContext);
//   const ref = useRef(snapshot);
//   ref.current = snapshot;
//   return ref;
// }

// /* ------------------------------------------------------------------ */
// /* Utils                                                              */
// /* ------------------------------------------------------------------ */

// /**
//  * Safe helper to build snapshot object
//  * (used by AppRuntime / Orchestrator)
//  */
// export function createRuntimeSnapshot(payload = {}) {
//   return {
//     timestamp: Date.now(),
//     ...payload,
//   };
// }

// =================================
// useRuntimeSnapshot.jsx (final – clean)
// src/runtime/useRuntimeSnapshot.jsx
import React, { createContext, useContext } from "react";

/**
 * Runtime snapshot context
 * Lưu trạng thái runtime đã được assemble (read-only)
 */
const RuntimeSnapshotContext = createContext(null);

export function RuntimeSnapshotProvider({ value, children }) {
  return (
    <RuntimeSnapshotContext.Provider value={value}>
      {children}
    </RuntimeSnapshotContext.Provider>
  );
}

/**
 * useRuntimeSnapshot
 * @param {string} key - optional snapshot key
 */
export function useRuntimeSnapshot(key) {
  const snapshot = useContext(RuntimeSnapshotContext);
  if (!snapshot) return null;
  return key ? snapshot[key] : snapshot;
}
