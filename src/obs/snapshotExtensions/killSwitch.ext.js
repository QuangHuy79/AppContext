// src/obs/snapshotExtensions/killSwitch.ext.js
import { readKillSwitch } from "../../runtime/killSwitch";

export function attachKillSwitch(snapshot) {
  return {
    ...snapshot,
    release: {
      ...(snapshot.release || {}),
      killSwitch: readKillSwitch(import.meta.env),
    },
  };
}
