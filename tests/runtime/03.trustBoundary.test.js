import { describe, it, expect } from "vitest";
import { buildSnapshot } from "../../src/core/obs/buildSnapshot";

describe("VII.3 — TRUST BOUNDARY", () => {
  it("Snapshot never contains auth domain", () => {
    const snap = buildSnapshot();

    expect(snap.auth).toBeUndefined();
  });
});
