// src/obs/snapshotExtensions/featureFlags.ext.js
import { readFeatureFlags } from "../../runtime/featureFlags";

export function attachFeatureFlags(snapshot) {
  return {
    ...snapshot,
    release: {
      ...(snapshot.release || {}),
      featureFlags: readFeatureFlags(import.meta.env),
    },
  };
}
