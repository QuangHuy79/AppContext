// src/runtime/registerUIHost.js
import { hostRegistry } from "./hostRegistry";

export function registerUIHost(key, HostComponent) {
  if (!key) throw new Error("UIHost key is required");
  if (typeof HostComponent !== "function") {
    throw new Error("UIHost must be a component");
  }

  hostRegistry[key] = HostComponent;
}
