import { describe, it, expect } from "vitest";
import { buildSnapshot } from "../../src/obs/buildSnapshot";

describe("VII.2 — MODULE AWARENESS (COARSE)", () => {
  it("Snapshot does not depend on module existence", () => {
    const snap = buildSnapshot();

    expect(snap.network).toBeDefined();
    expect(snap.device).toBeDefined();
    expect(snap.runtime).toBeDefined();
  });
});
