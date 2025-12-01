// src/AppRuntime/useRuntimeSnapshot.js
import { useContext, createContext } from "react";

// Context chung lưu snapshot
export const RuntimeSnapshotContext = createContext({});

export function RuntimeSnapshotProvider({ children, value }) {
  return (
    <RuntimeSnapshotContext.Provider value={value}>
      {children}
    </RuntimeSnapshotContext.Provider>
  );
}

// Hook lấy snapshot
export function useRuntimeSnapshot(clusterKey) {
  const snapshot = useContext(RuntimeSnapshotContext);
  if (clusterKey) return snapshot[clusterKey] || null;
  return snapshot;
}
