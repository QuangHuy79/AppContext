// src/runtime/killSwitch.js
export function readKillSwitch(env) {
  const parse = (v) => v === "on";

  return Object.freeze({
    DISABLE_API: parse(env.VITE_KILL_API),
    DISABLE_BACKGROUND_SYNC: parse(env.VITE_KILL_BACKGROUND_SYNC),
  });
}
