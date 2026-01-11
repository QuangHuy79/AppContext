// // errorSink.js — BỎ safeSnapshot, dùng buildSnapshot
// // src/obs/errorSink.js
// import { normalizeError } from "./normalizeError";
// import { buildSnapshot } from "./buildSnapshot";

// const STORE_KEY = "__APP_ERRORS__";

// function getStore() {
//   if (!window[STORE_KEY]) {
//     window[STORE_KEY] = [];
//   }
//   return window[STORE_KEY];
// }

// /**
//  * Central error logger
//  * Guards / Boundary / Global handlers MUST call this
//  */
// export function captureError(error, source) {
//   const normalized = normalizeError(error, source);
//   const snapshot = buildSnapshot();

//   const entry = {
//     ...normalized,
//     snapshot,
//   };

//   getStore().push(entry);

//   // DEV visibility only
//   if (import.meta.env.DEV) {
//     console.error(entry);
//   }
// }

// ===============================================
// FILE FULL — errorSink.js (CLEAN + LOCKED)
// src/obs/errorSink.js
import { normalizeError } from "./normalizeError";
import { buildSnapshot } from "./buildSnapshot";

const STORE_KEY = "__APP_ERRORS__";

function getStore() {
  if (!window[STORE_KEY]) {
    window[STORE_KEY] = [];
  }
  return window[STORE_KEY];
}

/**
 * Central error logger (PRODUCTION-SAFE)
 *
 * - NO console.*
 * - NO dev-only side effects
 * - Pure data capture only
 */
export function captureError(error, source) {
  const normalized = normalizeError(error, source);
  const snapshot = buildSnapshot();

  const entry = {
    ...normalized,
    snapshot,
  };

  getStore().push(entry);
}
