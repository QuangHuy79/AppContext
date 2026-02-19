// src/runtime/__test__/architecture.stress.50.test.js
import { describe, it, expect } from "vitest";
import { registerDomain } from "../../../domainHost/domainHost";
import { getRuntimeSnapshot } from "../../obs/runtimeSnapshot";

describe("ARCHITECTURE STRESS 50 DOMAINS", () => {
  it("core must survive 50 domain chaos", async () => {
    const total = 50;

    for (let i = 0; i < total; i++) {
      const index = i;

      const domain = {
        name: `stress-${index}`,
        init() {
          // 0–4 sync crash
          if (index < 5) {
            throw new Error("sync crash");
          }

          // 5–9 async reject
          if (index >= 5 && index < 10) {
            return Promise.reject(new Error("async crash"));
          }

          // 10–14 prototype attack
          if (index >= 10 && index < 15) {
            Object.prototype.__polluted = "yes";
          }

          // 15–19 mutation attempt
          if (index >= 15 && index < 20) {
            const snap = getRuntimeSnapshot();
            if (snap) {
              try {
                snap.hacked = true;
              } catch {}
            }
          }

          return { id: index };
        },
      };

      expect(() => registerDomain(domain)).not.toThrow();
    }

    // Simulate multi-subscriber read
    const subscribers = [];
    for (let i = 0; i < 5; i++) {
      subscribers.push(() => getRuntimeSnapshot());
    }

    // Flood runtime reads
    for (let i = 0; i < 500; i++) {
      subscribers.forEach((fn) => fn());
    }

    // Prototype must remain clean
    expect(Object.prototype.__polluted).toBeUndefined();

    // Snapshot must still be usable
    const finalSnap = getRuntimeSnapshot();
    expect(finalSnap).toBeDefined();

    // Ensure no hacked key
    expect(finalSnap.hacked).toBeUndefined();
  });
});
