// import { safeSnapshot } from "./safeSnapshot";

// export function normalizeError(err, source) {
//   return {
//     source,
//     message: err?.message || String(err),
//     time: Date.now(),
//     snapshot: safeSnapshot(),
//   };
// }

// ===================================
// Sửa normalizeError.js (BỎ snapshot hoàn toàn)
// src/obs/normalizeError.js
export function normalizeError(err, source) {
  return {
    source,
    message: err?.message || String(err),
    stack: err?.stack,
    time: Date.now(),
  };
}
