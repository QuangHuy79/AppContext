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
