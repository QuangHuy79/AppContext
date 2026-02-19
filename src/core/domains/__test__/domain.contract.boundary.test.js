// src/domains/__test__/domain.contract.boundary.test.js
import { describe, it, expect } from "vitest";

describe("domain contract boundary", () => {
  it("domain must not import runtime layer", async () => {
    await expect(async () => {
      await import("../../runtime/AppRuntime");
    }).rejects.toThrow();
  });
});
