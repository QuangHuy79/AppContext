// src/domains/__test__/domain.forbidden.guard.test.js
import { registerDomain } from "../../../domainHost/domainHost";
import { describe, it, expect } from "vitest";

describe("domain forbidden operations", () => {
  it("domain cannot override Object.prototype", () => {
    const evilDomain = {
      init() {
        Object.prototype.hacked = true;
      },
    };

    expect(() => registerDomain(evilDomain)).not.toThrow();
    expect(Object.prototype.hacked).toBeUndefined();
  });
});
