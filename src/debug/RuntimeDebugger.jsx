// // RuntimeDebugger CHỈ CHECK CONTRACT (READ-ONLY)
// // src/debug/RuntimeDebugger.jsx
// import { useEffect, useRef } from "react";
// import { useRuntimeSnapshot } from "../runtime/useRuntimeSnapshot";
// import { RuntimeSnapshotContract } from "../runtime/runtimeSnapshot.contract";
// import { runRuntimeGuards } from "../runtime/RuntimeGuardOrchestrator";
// export default function RuntimeDebugger() {
//   const snapshot = useRuntimeSnapshot();
//   const ranRef = useRef(false);

//   useEffect(() => {
//     if (!snapshot) return;
//     if (ranRef.current) return;
//     ranRef.current = true;

//     console.group("🧩 RuntimeDebugger (C-34)");
//     // console.log("📸 Runtime Snapshot:", snapshot);

//     const errors = [];

//     Object.entries(RuntimeSnapshotContract).forEach(([cluster, fields]) => {
//       const snapCluster = snapshot[cluster];
//       if (!snapCluster) {
//         errors.push(`Missing cluster: ${cluster}`);
//         return;
//       }

//       Object.entries(fields).forEach(([key, type]) => {
//         if (typeof snapCluster[key] !== type) {
//           errors.push(
//             `${cluster}.${key} expected ${type}, got ${typeof snapCluster[key]}`
//           );
//         }
//       });
//     });

//     if (errors.length === 0) {
//       // console.log("🟢 SNAPSHOT CONTRACT PASSED");
//       // 🔐 STEP 16 – Run all runtime guards
//       runRuntimeGuards(snapshot);
//     } else {
//       console.error("🔴 SNAPSHOT CONTRACT FAILED");
//       errors.forEach((e) => console.error(" ↳", e));
//     }

//     console.groupEnd();
//   }, [snapshot]);

//   return null;
// }

// ===========================================
// FILE FULL — RuntimeDebugger.jsx (CLEAN + LOCKED)
// src/debug/RuntimeDebugger.jsx
import { useEffect, useRef } from "react";
import { useRuntimeSnapshot } from "../runtime/useRuntimeSnapshot";
import { RuntimeSnapshotContract } from "../runtime/runtimeSnapshot.contract";
import { runRuntimeGuards } from "../runtime/RuntimeGuardOrchestrator";

export default function RuntimeDebugger() {
  // 🔒 DEV ONLY
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const snapshot = useRuntimeSnapshot();
  const ranRef = useRef(false);

  useEffect(() => {
    if (!snapshot) return;
    if (ranRef.current) return;
    ranRef.current = true;

    const errors = [];

    Object.entries(RuntimeSnapshotContract).forEach(([cluster, fields]) => {
      const snapCluster = snapshot[cluster];
      if (!snapCluster) {
        errors.push(`Missing cluster: ${cluster}`);
        return;
      }

      Object.entries(fields).forEach(([key, type]) => {
        if (typeof snapCluster[key] !== type) {
          errors.push(
            `${cluster}.${key} expected ${type}, got ${typeof snapCluster[key]}`
          );
        }
      });
    });

    if (errors.length === 0) {
      // DEV-ONLY runtime guards
      runRuntimeGuards(snapshot);
    }
    // ❌ NO console.* — errors should surface via guard system
  }, [snapshot]);

  return null;
}
