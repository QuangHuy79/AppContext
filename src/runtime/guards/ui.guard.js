/**
 * 🔒 RUNTIME GUARD
 * ---------------------------------
 * Fail-fast only
 * Silent fail forbidden
 *
 * Locked after Phase 6.1
 */

// FILE FIX — ui.guard.js (CHUẨN PHASE 6)
// src/runtime/guards/ui.guard.js
import { captureError } from "../../obs/errorSink";

export function guardUI(snapshot) {
  const ui = snapshot?.ui;

  if (!ui) {
    captureError(new Error("snapshot.ui is missing"), "RG-UI-01");
    return false;
  }

  if (typeof ui.ready !== "boolean") {
    captureError(
      new Error(`ui.ready expected boolean, got '${ui.ready}'`),
      "RG-UI-02",
    );
    return false;
  }

  return true;
}
