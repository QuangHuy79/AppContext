// src/domains/__test__/domain.async.error.test.js
import { registerDomain } from "../../../domainHost/domainHost";
import { describe, it, expect } from "vitest";

describe("domain async error isolation", () => {
  it("async error must not crash core", async () => {
    const badDomain = {
      init() {
        Promise.reject(new Error("async crash"));
      },
    };

    expect(() => registerDomain(badDomain)).not.toThrow();
  });
});
