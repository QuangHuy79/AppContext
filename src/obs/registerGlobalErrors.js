// import { captureError } from "./errorSink";
// import { normalizeError } from "./normalizeError";

// export function registerGlobalErrors() {
//   // E3 – runtime exception
//   window.onerror = function (message, source, lineno, colno, error) {
//     captureError(normalizeError(error || message, "E3"));
//   };

//   // E2 – unhandled promise
//   window.onunhandledrejection = function (event) {
//     captureError(normalizeError(event.reason, "E2"));
//   };
// }

// ====================================
// import { captureError } from "./errorSink";
// import { normalizeError } from "./normalizeError";

// export function registerGlobalErrors() {
//   if (typeof window === "undefined") return;

//   // 🔹 Ensure global error buffer exists
//   if (!window.__APP_ERRORS__) {
//     window.__APP_ERRORS__ = [];
//   }

//   // ===============================
//   // E3 – Runtime exception (sync)
//   // ===============================
//   window.onerror = function (message, source, lineno, colno, error) {
//     try {
//       const normalized = normalizeError(error || message, "E3");
//       captureError(normalized);
//     } catch {
//       // fail silent – observability must never crash app
//     }

//     // return false → allow browser default handling (DEV friendly)
//     return false;
//   };

//   // =================================
//   // E2 – Unhandled Promise Rejection
//   // =================================
//   window.onunhandledrejection = function (event) {
//     try {
//       const normalized = normalizeError(event?.reason, "E2");
//       captureError(normalized);
//     } catch {
//       // fail silent
//     }
//   };
// }

// ============================================
// registerGlobalErrors.js — BẢN FINAL (LOCK)
// src/obs/registerGlobalErrors.js
import { captureError } from "./errorSink";

export function registerGlobalErrors() {
  if (typeof window === "undefined") return;

  // ===============================
  // E3 – Runtime exception (sync)
  // ===============================
  window.onerror = function (message, source, lineno, colno, error) {
    try {
      captureError(error || message, { source: "E3" });
    } catch {
      // observability must never crash app
    }

    // return false → keep browser default handling (DEV friendly)
    return false;
  };

  // =================================
  // E2 – Unhandled Promise Rejection
  // =================================
  window.onunhandledrejection = function (event) {
    try {
      captureError(event?.reason, { source: "E2" });
    } catch {
      // fail silent
    }
  };
}
