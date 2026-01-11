// File network.guard.js — FINAL
// src/runtime/guards/network.guard.js
import { emitError } from "../../obs/errorSink";

export function guardNetwork(snapshot) {
  const network = snapshot?.network;

  if (!network) {
    emitError({
      source: "RG-NET-01",
      message: "snapshot.network is missing",
      snapshot,
    });
    return false;
  }

  if (typeof network.online !== "boolean") {
    emitError({
      source: "RG-NET-02",
      message: "network.online expected boolean",
      snapshot,
    });
    return false;
  }

  if (
    network.effectiveType !== undefined &&
    typeof network.effectiveType !== "string"
  ) {
    emitError({
      source: "RG-NET-03",
      message: "network.effectiveType expected string",
      snapshot,
    });
    return false;
  }

  return true;
}
