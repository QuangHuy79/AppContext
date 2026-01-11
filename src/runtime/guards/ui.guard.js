// File final version
// src/runtime/guards/ui.guard.js
import { emitError } from "../../obs/errorSink";

export function guardUI(snapshot) {
  const ui = snapshot?.ui;
  if (!ui) {
    emitError({
      source: "RG-UI-01",
      message: "snapshot.ui is missing",
      snapshot,
    });
    return false;
  }

  if (typeof ui.ready !== "boolean") {
    emitError({
      source: "RG-UI-02",
      message: `ui.ready expected boolean, got '${ui.ready}'`,
      snapshot,
    });
    return false;
  }

  return true;
}
