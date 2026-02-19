import { describe, it, expect, beforeEach } from "vitest";
import "../../src/core/obs/errorSink";

describe("VI.1 - Error classification", () => {
  beforeEach(() => {
    window.__APP_ERRORS__ = [];
  });

  it("Error has level field", () => {
    window.reportError(new Error("core crash"), "core");

    const err = window.__APP_ERRORS__[0];
    expect(err.level).toBe("fatal");
  });

  it("Default error level is recoverable", () => {
    window.reportError("string error", "ui");

    const err = window.__APP_ERRORS__[0];
    expect(err.level).toBe("recoverable");
  });
});
