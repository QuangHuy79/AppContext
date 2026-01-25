// src/runtime/featureFlags.js
export function readFeatureFlags(env) {
  const parse = (v) => v === "on";

  return Object.freeze({
    NEW_DASHBOARD: parse(env.VITE_FF_NEW_DASHBOARD),
    BACKGROUND_SYNC: parse(env.VITE_FF_BACKGROUND_SYNC),
  });
}
