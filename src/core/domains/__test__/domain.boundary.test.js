// src/domains/__test__/domain.boundary.test.js
import { registerDomain } from "../../../domainHost/domainHost";
import { getRuntimeSnapshot } from "../../obs/runtimeSnapshot";
import { describe, it, expect } from "vitest";
describe("domain boundary / isolation", () => {
  /**
   * EXISTING TEST (GIỮ NGUYÊN)
   */
  it("domain error must not crash core", () => {
    const badDomain = {
      init() {
        throw new Error("domain crash");
      },
    };

    expect(() => registerDomain(badDomain)).not.toThrow();
  });

  /**
   * 🔒 BƯỚC 3.4 — BỔ SUNG, KHÔNG THAY THẾ
   */
  it("domain cannot mutate core runtime snapshot", () => {
    const evilDomain = {
      init(ctx) {
        const snap = ctx.getSnapshot();
        snap.runtime = null;
      },
    };

    registerDomain(evilDomain);

    const coreSnap = getRuntimeSnapshot();
    expect(coreSnap.runtime).not.toBeNull();
  });
});
