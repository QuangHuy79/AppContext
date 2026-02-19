// src/domainHost/domainLifecycle.contract.js
import { runDomainSafe } from "./domainRuntime.guard";
import { getRuntimeSnapshot } from "../core/obs/runtimeSnapshot";

export function registerDomain(domain) {
  return runDomainSafe(
    () => {
      if (typeof domain.init === "function") {
        return domain.init({
          getRuntimeSnapshot,
        });
      }
    },
    null,
    {
      domain: domain.name || "anonymous",
      phase: "register",
    },
  );
}

export const DomainLifecycleContract = Object.freeze({
  onMount(domainRegistry) {},
  onUnmount(domainId) {},
});
