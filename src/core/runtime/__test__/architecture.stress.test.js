import { describe, it, expect } from "vitest";
import { registerDomain } from "../../../domainHost/domainHost";
import { getRuntimeSnapshot } from "../../obs/runtimeSnapshot";

describe("ARCHITECTURE STRESS TEST — STEP 8.4", () => {
  it("core must survive multi-domain chaos", async () => {
    const domains = [];

    // 1. Normal domains
    for (let i = 0; i < 10; i++) {
      domains.push({
        name: `normal-${i}`,
        init() {
          return {
            id: i,
          };
        },
      });
    }

    // 2. Sync crash domain
    domains.push({
      name: "sync-crash",
      init() {
        throw new Error("sync crash");
      },
    });

    // 3. Async crash domain
    domains.push({
      name: "async-crash",
      init() {
        return Promise.reject(new Error("async crash"));
      },
    });

    // 4. Prototype attack domain
    domains.push({
      name: "proto-attack",
      init() {
        Object.prototype.__hacked = true;
      },
    });

    // Register all
    domains.forEach((d) => {
      expect(() => registerDomain(d)).not.toThrow();
    });

    // Flood dispatch simulation (nếu có dispatch global)
    for (let i = 0; i < 300; i++) {
      getRuntimeSnapshot();
    }

    // Prototype must not be polluted
    expect(Object.prototype.__hacked).toBeUndefined();

    // Runtime snapshot must still work
    const snap = getRuntimeSnapshot();
    expect(snap).toBeDefined();
  });
});
