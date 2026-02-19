// // // // src/domainHost/domainRuntime.guard.js
// // // export function runDomainSafe(fn, ctx, meta) {
// // //   try {
// // //     return fn(ctx);
// // //   } catch (err) {
// // //     console.error(
// // //       `[DOMAIN BLOCKED] ${meta?.domain || "unknown"} @ ${meta?.phase}`,
// // //       err,
// // //     );
// // //     return null;
// // //   }
// // // }

// // // ======================================
// // // src/domainHost/domainRuntime.guard.js
// // export function runDomainSafe(fn, ctx, meta) {
// //   try {
// //     const result = fn(ctx);

// //     // 🔒 ASYNC SAFETY
// //     if (result && typeof result.then === "function") {
// //       return result.catch((err) => {
// //         console.error(
// //           `[DOMAIN BLOCKED] ${meta?.domain || "unknown"} @ ${meta?.phase}`,
// //           err,
// //         );
// //         return null;
// //       });
// //     }

// //     return result;
// //   } catch (err) {
// //     console.error(
// //       `[DOMAIN BLOCKED] ${meta?.domain || "unknown"} @ ${meta?.phase}`,
// //       err,
// //     );
// //     return null;
// //   }
// // }

// // ========================================
// // src/domainHost/domainRuntime.guard.js
// export function runDomainSafe(fn, ctx, meta) {
//   let removeListener;

//   const handler = (event) => {
//     console.error(
//       `[DOMAIN ASYNC BLOCKED] ${meta?.domain || "unknown"} @ ${meta?.phase}`,
//       event.reason,
//     );
//     event.preventDefault();
//   };

//   if (typeof window !== "undefined") {
//     window.addEventListener("unhandledrejection", handler);
//     removeListener = () =>
//       window.removeEventListener("unhandledrejection", handler);
//   }

//   try {
//     const result = fn(ctx);

//     if (result && typeof result.then === "function") {
//       return result
//         .catch((err) => {
//           console.error(
//             `[DOMAIN BLOCKED] ${meta?.domain || "unknown"} @ ${meta?.phase}`,
//             err,
//           );
//           return null;
//         })
//         .finally(() => removeListener?.());
//     }

//     return result;
//   } catch (err) {
//     console.error(
//       `[DOMAIN BLOCKED] ${meta?.domain || "unknown"} @ ${meta?.phase}`,
//       err,
//     );
//     return null;
//   } finally {
//     removeListener?.();
//   }
// }

// ===================================
// src/domainHost/domainRuntime.guard.js

function snapshotProto(proto) {
  const snapshot = {};
  for (const key of Object.getOwnPropertyNames(proto)) {
    snapshot[key] = proto[key];
  }
  return snapshot;
}

function restoreProto(proto, snapshot) {
  // Xoá các key bị thêm vào
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (!(key in snapshot)) {
      delete proto[key];
    }
  }

  // Khôi phục giá trị gốc nếu bị override
  for (const key of Object.keys(snapshot)) {
    if (proto[key] !== snapshot[key]) {
      proto[key] = snapshot[key];
    }
  }
}

export function runDomainSafe(fn, ctx, meta) {
  let removeListener;

  const handler = (event) => {
    console.error(
      `[DOMAIN ASYNC BLOCKED] ${meta?.domain || "unknown"} @ ${meta?.phase}`,
      event.reason,
    );
    event.preventDefault();
  };

  // Browser async isolation
  if (typeof window !== "undefined") {
    window.addEventListener("unhandledrejection", handler);
    removeListener = () =>
      window.removeEventListener("unhandledrejection", handler);
  }

  // 🔒 Snapshot global prototypes trước khi chạy domain
  const objectProtoSnapshot = snapshotProto(Object.prototype);
  const arrayProtoSnapshot = snapshotProto(Array.prototype);
  const functionProtoSnapshot = snapshotProto(Function.prototype);

  const restoreAll = () => {
    restoreProto(Object.prototype, objectProtoSnapshot);
    restoreProto(Array.prototype, arrayProtoSnapshot);
    restoreProto(Function.prototype, functionProtoSnapshot);
    removeListener?.();
  };

  try {
    const result = fn(ctx);

    // Nếu domain trả Promise
    if (result && typeof result.then === "function") {
      return result
        .catch((err) => {
          console.error(
            `[DOMAIN BLOCKED] ${meta?.domain || "unknown"} @ ${meta?.phase}`,
            err,
          );
          return null;
        })
        .finally(() => {
          restoreAll();
        });
    }

    return result;
  } catch (err) {
    console.error(
      `[DOMAIN BLOCKED] ${meta?.domain || "unknown"} @ ${meta?.phase}`,
      err,
    );
    return null;
  } finally {
    // Sync restore
    restoreAll();
  }
}
