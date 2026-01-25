// src/obs/runtimeSnapshot.js
import { buildSnapshot } from "./buildSnapshot";
import { attachFeatureFlags } from "./snapshotExtensions/featureFlags.ext";
import { attachKillSwitch } from "./snapshotExtensions/killSwitch.ext";
import { attachReleaseSignature } from "./snapshotExtensions/releaseSignature.ext";
export function buildRuntimeSnapshot() {
  let snapshot = buildSnapshot();
  snapshot = attachFeatureFlags(snapshot);
  snapshot = attachKillSwitch(snapshot);
  snapshot = attachReleaseSignature(snapshot);
  return snapshot;
}
