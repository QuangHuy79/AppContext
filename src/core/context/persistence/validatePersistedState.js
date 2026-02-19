export function validatePersistedState(payload, initialAppState) {
  if (!payload || typeof payload !== "object") return false;

  // ❌ foreign domains
  for (const key of Object.keys(payload)) {
    if (!(key in initialAppState)) return false;
  }

  // ❌ settings schema mismatch
  const s = payload.settings;
  const ref = initialAppState.settings;

  if (typeof s !== "object") return false;

  for (const key of Object.keys(s)) {
    if (!(key in ref)) return false;
    if (typeof s[key] !== typeof ref[key]) return false;
  }

  return true;
}
