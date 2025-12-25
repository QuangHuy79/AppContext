// // useRuntimeSnapshot.jsx (C-21 hardened)
// // Nguyên tắc
// // Snapshot = ảnh chụp 1 lần
// // Read-only
// // Không trigger re-render dây chuyền.
// // src/runtime/useRuntimeSnapshot.jsx
// import { createContext, useContext, useRef } from "react";

// const RuntimeSnapshotContext = createContext(null);

// export function RuntimeSnapshotProvider({ value, children }) {
//   const snapshotRef = useRef(null);

//   // chỉ chụp snapshot 1 lần
//   if (!snapshotRef.current && value) {
//     snapshotRef.current = Object.freeze({
//       ...value,
//       __ts: Date.now(),
//     });
//   }

//   return (
//     <RuntimeSnapshotContext.Provider value={snapshotRef.current}>
//       {children}
//     </RuntimeSnapshotContext.Provider>
//   );
// }

// export function useRuntimeSnapshot() {
//   return useContext(RuntimeSnapshotContext);
// }

// ===============================
// useRuntimeSnapshot.jsx (CHỐT BẢN C-27)
// src/runtime/useRuntimeSnapshot.jsx
import { createContext, useContext, useRef } from "react";

export const RuntimeSnapshotContext = createContext(null);

export function RuntimeSnapshotProvider({ value, children }) {
  // freeze snapshot once
  const frozenRef = useRef(null);

  if (!frozenRef.current && value) {
    frozenRef.current = value;
  }

  return (
    <RuntimeSnapshotContext.Provider value={frozenRef.current}>
      {children}
    </RuntimeSnapshotContext.Provider>
  );
}

export function useRuntimeSnapshot(key) {
  const snapshot = useContext(RuntimeSnapshotContext);
  if (!snapshot) return null;
  return key ? snapshot[key] : snapshot;
}
