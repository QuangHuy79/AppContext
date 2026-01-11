// // // src/obs/normalizeBoundaryError.js
// // export function normalizeBoundaryError(error, info) {
// //   return {
// //     source: "E1",
// //     message: error?.message || String(error),
// //     stack: error?.stack || null,
// //     componentStack: info?.componentStack || null,
// //     time: Date.now(),
// //   };
// // }

// // ===============================
// // Ví dụ với ErrorBoundary (OBS-03 → OBS-04)
// import { safeSnapshot } from "./safeSnapshot";

// export function normalizeBoundaryError(error, info) {
//   return {
//     source: "E1",
//     message: error?.message || String(error),
//     stack: error?.stack || null,
//     componentStack: info?.componentStack || null,
//     time: Date.now(),
//     snapshot: safeSnapshot(),
//   };
// }
