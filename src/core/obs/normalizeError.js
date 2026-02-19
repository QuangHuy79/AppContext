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
