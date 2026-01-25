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
  const isRealError = err instanceof Error;

  return {
    source,
    level: isRealError ? "fatal" : "recoverable", // 🔒 VI.1 RULE
    message: err?.message || String(err),
    stack: err?.stack,
    time: Date.now(),
  };
}

// // ==================================
// export function normalizeError(err, source) {
//   const isFatal = err instanceof Error; // 🔒 VI.1 CONTRACT

//   return {
//     source,
//     level: isFatal ? "fatal" : "recoverable",
//     message: err?.message || String(err),
//     stack: isFatal ? err.stack : undefined,
//     time: Date.now(),
//   };
// }
