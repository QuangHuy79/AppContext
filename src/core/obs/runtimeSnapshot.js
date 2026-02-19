// // src/obs/runtimeSnapshot.js
// import { buildSnapshot } from "./buildSnapshot";
// import { attachFeatureFlags } from "./snapshotExtensions/featureFlags.ext";
// import { attachKillSwitch } from "./snapshotExtensions/killSwitch.ext";
// import { attachReleaseSignature } from "./snapshotExtensions/releaseSignature.ext";
// export function buildRuntimeSnapshot() {
//   let snapshot = buildSnapshot();
//   snapshot = attachFeatureFlags(snapshot);
//   snapshot = attachKillSwitch(snapshot);
//   snapshot = attachReleaseSignature(snapshot);
//   return snapshot;
// }

// ===================================
// src/obs/runtimeSnapshot.js
import { buildSnapshot } from "./buildSnapshot";
import { attachFeatureFlags } from "./snapshotExtensions/featureFlags.ext";
import { attachKillSwitch } from "./snapshotExtensions/killSwitch.ext";
import { attachReleaseSignature } from "./snapshotExtensions/releaseSignature.ext";

function deepFreeze(obj) {
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    if (
      obj[prop] !== null &&
      typeof obj[prop] === "object" &&
      !Object.isFrozen(obj[prop])
    ) {
      deepFreeze(obj[prop]);
    }
  });
  return obj;
}
export function buildRuntimeSnapshot() {
  let snapshot = buildSnapshot();
  snapshot = attachFeatureFlags(snapshot);
  snapshot = attachKillSwitch(snapshot);
  snapshot = attachReleaseSignature(snapshot);
  // return snapshot;
  return deepFreeze(snapshot);
}

/**
 * 🔒 Runtime Snapshot Contract
 * Domain chỉ được đọc – không được mutate
 */
export function getRuntimeSnapshot() {
  const snap = buildRuntimeSnapshot();
  return Object.freeze(structuredClone(snap));
}
