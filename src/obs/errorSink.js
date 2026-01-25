// // // // // FILE FULL — errorSink.js (CLEAN + LOCKED)
// // // // // src/obs/errorSink.js
// // // // import { normalizeError } from "./normalizeError";
// // // // import { buildSnapshot } from "./buildSnapshot";

// // // // const STORE_KEY = "__APP_ERRORS__";

// // // // function getStore() {
// // // //   if (!window[STORE_KEY]) {
// // // //     window[STORE_KEY] = [];
// // // //   }
// // // //   return window[STORE_KEY];
// // // // }

// // // // /**
// // // //  * Central error logger (PRODUCTION-SAFE)
// // // //  *
// // // //  * - NO console.*
// // // //  * - NO dev-only side effects
// // // //  * - Pure data capture only
// // // //  */
// // // // // export function captureError(error, source) {
// // // // //   const normalized = normalizeError(error, source);
// // // // //   const snapshot = buildSnapshot();

// // // // //   const entry = {
// // // // //     ...normalized,
// // // // //     snapshot,
// // // // //   };

// // // // //   getStore().push(entry);
// // // // // }
// // // // export function captureError(error, source, level) {
// // // //   const normalized = normalizeError(error, source, level);
// // // //   const snapshot = buildSnapshot();

// // // //   getStore().push({
// // // //     ...normalized,
// // // //     snapshot,
// // // //   });
// // // // }

// // // // ========================================
// // // // src/obs/errorSink.js
// // // import { normalizeError } from "./normalizeError";
// // // import { buildSnapshot } from "./buildSnapshot";

// // // const STORE_KEY = "__APP_ERRORS__";

// // // function getStore() {
// // //   if (!window[STORE_KEY]) {
// // //     window[STORE_KEY] = [];
// // //   }
// // //   return window[STORE_KEY];
// // // }

// // // /**
// // //  * Central error logger (PRODUCTION-SAFE)
// // //  *
// // //  * - NO console.*
// // //  * - NO dev-only side effects
// // //  * - Pure data capture only
// // //  * - SINGLE SOURCE OF TRUTH for error intake
// // //  */
// // // export function captureError(error, source) {
// // //   const normalized = normalizeError(error, source);
// // //   const snapshot = buildSnapshot();

// // //   getStore().push({
// // //     ...normalized,
// // //     snapshot,
// // //   });
// // // }

// // // /**
// // //  * 🔒 VI.1 — GLOBAL SURVIVAL REFLEX
// // //  *
// // //  * - Always available
// // //  * - No import required
// // //  * - Cannot be shadowed by modules
// // //  */
// // // if (!window.reportError) {
// // //   window.reportError = function reportError(error, source) {
// // //     captureError(error, source);
// // //   };
// // // }

// // // ================================================
// // // src/obs/errorSink.js
// // import { normalizeError } from "./normalizeError";
// // import { buildSnapshot } from "./buildSnapshot";

// // const STORE_KEY = "__APP_ERRORS__";
// // const LOCK_KEY = "__APP_RUNTIME_LOCKED__";

// // function getStore() {
// //   if (!window[STORE_KEY]) {
// //     window[STORE_KEY] = [];
// //   }
// //   return window[STORE_KEY];
// // }

// // function lockRuntime() {
// //   window[LOCK_KEY] = true;
// // }

// // export function isRuntimeLocked() {
// //   return window[LOCK_KEY] === true;
// // }

// // /**
// //  * Central error logger (PRODUCTION-SAFE)
// //  * VI.2 — Degrade / Self-lock
// //  */
// // export function reportError(error, source) {
// //   const normalized = normalizeError(error, source);
// //   const snapshot = buildSnapshot();

// //   // 🔒 VI.2.1 — fatal triggers lock
// //   if (normalized.level === "fatal") {
// //     lockRuntime();
// //   }

// //   getStore().push({
// //     ...normalized,
// //     snapshot,
// //   });
// // }

// // ====================================
// // FILE FULL — errorSink.js (OBS-CONTRACT COMPLIANT)
// // src/obs/errorSink.js

// import { normalizeError } from "./normalizeError";
// import { buildSnapshot } from "./buildSnapshot";

// const STORE_KEY = "__APP_ERRORS__";

// /* ------------------------------------------------------------------ */
// /* Store                                                              */
// /* ------------------------------------------------------------------ */
// function getStore() {
//   if (!window[STORE_KEY]) {
//     window[STORE_KEY] = [];
//   }
//   return window[STORE_KEY];
// }

// /* ------------------------------------------------------------------ */
// /* Core capture                                                        */
// /* ------------------------------------------------------------------ */
// export function captureError(error, source, level = "recoverable") {
//   const normalized = normalizeError(error, source, level);
//   const snapshot = buildSnapshot();

//   const entry = {
//     ...normalized,
//     snapshot,
//   };

//   getStore().push(entry);
//   return entry;
// }

// /* ------------------------------------------------------------------ */
// /* Runtime API (GLOBAL CONTRACT)                                       */
// /* ------------------------------------------------------------------ */
// export function reportError(error, source, level) {
//   return captureError(error, source, level);
// }

// /* ------------------------------------------------------------------ */
// /* Global binding (OBS REQUIRED)                                       */
// /* ------------------------------------------------------------------ */
// if (typeof window !== "undefined") {
//   window.reportError = reportError;
// }

// =============================================
// FILE FULL — errorSink.js (VI.1 + VI.2 LOCKED)
// src/obs/errorSink.js

import { normalizeError } from "./normalizeError";
import { buildSnapshot } from "./buildSnapshot";

const STORE_KEY = "__APP_ERRORS__";
const LOCK_KEY = "__APP_RUNTIME_LOCKED__";

/* ------------------------------------------------------------------ */
/* Store                                                              */
/* ------------------------------------------------------------------ */
function getStore() {
  if (!window[STORE_KEY]) {
    window[STORE_KEY] = [];
  }
  return window[STORE_KEY];
}

/* ------------------------------------------------------------------ */
/* Runtime lock                                                        */
/* ------------------------------------------------------------------ */
function lockRuntime() {
  window[LOCK_KEY] = true;
}

export function isRuntimeLocked() {
  return window[LOCK_KEY] === true;
}

/* ------------------------------------------------------------------ */
/* Core capture                                                        */
/* ------------------------------------------------------------------ */
export function captureError(error, source, level = "recoverable") {
  const normalized = normalizeError(error, source, level);
  const snapshot = buildSnapshot();

  const entry = {
    ...normalized,
    snapshot,
  };

  getStore().push(entry);

  // 🔒 VI.2 — self-lock on fatal error
  if (entry.level === "fatal") {
    lockRuntime();
  }

  return entry;
}

/* ------------------------------------------------------------------ */
/* Runtime API                                                         */
/* ------------------------------------------------------------------ */
export function reportError(error, source, level) {
  return captureError(error, source, level);
}

/* ------------------------------------------------------------------ */
/* Global binding (OBS CONTRACT)                                       */
/* ------------------------------------------------------------------ */
if (typeof window !== "undefined") {
  window.reportError = reportError;
  window.isRuntimeLocked = isRuntimeLocked;
}
