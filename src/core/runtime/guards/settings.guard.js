/**
 * 🔒 RUNTIME GUARD
 * ---------------------------------
 * Fail-fast only
 * Silent fail forbidden
 *
 * Locked after Phase 6.1
 */

// settings.guard.js — FINAL (FIXED)
// src/runtime/guards/settings.guard.js
import { captureError } from "../../obs/errorSink";

export function guardSettings(snapshot) {
  const s = snapshot?.settings;

  if (!s) {
    captureError(new Error("snapshot.settings is missing"), "RG-SET-00");
    return false;
  }

  if (!["light", "dark", "system"].includes(s.theme)) {
    captureError(
      new Error(
        `settings.theme expected one of ['light','dark','system'], got '${s.theme}'`,
      ),
      "RG-SET-01",
    );
    return false;
  }

  return true;
}
