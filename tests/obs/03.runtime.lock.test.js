import { describe, it, expect, beforeEach } from "vitest";
import { reportError, isRuntimeLocked } from "@/obs/errorSink";
describe("VI.2 — Runtime self-lock", () => {
  beforeEach(() => {
    window.__APP_ERRORS__ = [];
    window.__APP_RUNTIME_LOCKED__ = false;
  });

  it("locks runtime after fatal error", () => {
    reportError(new Error("core crash"), "core");

    expect(isRuntimeLocked()).toBe(true);
  });
});
