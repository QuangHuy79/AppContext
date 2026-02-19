// // // src/runtime/UIHostRouter.jsx
// // import React from "react";
// // import { hostRegistry } from "./hostRegistry";

// // /* =========================
// //    8.1 – FACTORY MODE (tests)
// // ========================= */
// // export function createUIHostRouter(registry = {}) {
// //   if (!registry || typeof registry !== "object") {
// //     throw new Error("UIHostRouter requires a host registry object");
// //   }

// //   return function UIHostRouter({ hostKey, snapshot }) {
// //     if (!hostKey) {
// //       throw new Error("hostKey is required");
// //     }

// //     const Host = registry[hostKey];

// //     if (!Host) {
// //       throw new Error(`UIHost "${hostKey}" not registered`);
// //     }

// //     return <Host snapshot={snapshot} />;
// //   };
// // }

// // /* =========================
// //    8.2 – PROD MODE
// // ========================= */
// // export default function UIHostRouter({ hostKey = "web", snapshot }) {
// //   const Host = hostRegistry[hostKey];

// //   if (!Host) {
// //     throw new Error(`UIHost "${hostKey}" not registered`);
// //   }

// //   return <Host snapshot={snapshot} />;
// // }

// // ================================
// // src/runtime/UIHostRouter.jsx
// // UIHostRouter.jsx (8.3-compliant)
// import React, { memo } from "react";
// import { hostRegistry } from "./hostRegistry";

// function UIHostRouter({ hostKey = "web", snapshot }) {
//   const Host = hostRegistry[hostKey];

//   if (!Host) {
//     throw new Error(`UIHost "${hostKey}" not registered`);
//   }

//   return <Host snapshot={snapshot} />;
// }

// /**
//  * Performance Boundary:
//  * - re-render ONLY when hostKey or snapshot reference changes
//  */
// export default memo(
//   UIHostRouter,
//   (prev, next) =>
//     prev.hostKey === next.hostKey && prev.snapshot === next.snapshot,
// );

// =================================================
// src/runtime/UIHostRouter.jsx – FINAL (8.1 + 8.2 + 8.3)
import React, { memo } from "react";
import { hostRegistry } from "./hostRegistry";

/* =========================
   8.1 – FACTORY (TEST ONLY)
========================= */
export function createUIHostRouter(registry = {}) {
  if (!registry || typeof registry !== "object") {
    throw new Error("UIHostRouter requires a host registry object");
  }

  return function UIHostRouter({ hostKey, snapshot }) {
    if (!hostKey) {
      throw new Error("hostKey is required");
    }

    const Host = registry[hostKey];

    if (!Host) {
      throw new Error(`UIHost "${hostKey}" not registered`);
    }

    return <Host snapshot={snapshot} />;
  };
}

/* =========================
   8.2 + 8.3 – PROD ROUTER
========================= */
function UIHostRouter({ hostKey = "web", snapshot }) {
  const Host = hostRegistry[hostKey];

  if (!Host) {
    throw new Error(`UIHost "${hostKey}" not registered`);
  }

  return <Host snapshot={snapshot} />;
}

export default memo(UIHostRouter);
