// tests/obs/04.debugSafety.prod.test.js
import { describe, it, expect, beforeEach, vi } from "vitest";
import { captureError } from "../../src/core/obs/errorSink";

describe("PHASE 8.3 — DEBUG SAFETY (PROD LEAK GUARD)", () => {
  beforeEach(() => {
    delete window.__APP_ERRORS__;

    // mock PROD env
    vi.stubEnv("MODE", "production");
    vi.stubEnv("DEV", false);

    global.navigator = {
      onLine: true,
      userAgent: "prod-agent",
      platform: "prod-platform",
      deviceMemory: 4,
      connection: { effectiveType: "4g" },
    };

    global.window = {
      innerWidth: 1024,
      innerHeight: 768,
    };
  });

  it("ERROR entry contains NO console artifacts", () => {
    const spy = vi.spyOn(console, "log");

    captureError(new Error("PROD_ERR"), "SRC");

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it("ERROR snapshot does NOT expose dev flags", () => {
    captureError(new Error("PROD_ERR"), "SRC");

    const entry = window.__APP_ERRORS__[0];

    // snapshot exists
    expect(entry.snapshot).toBeDefined();

    // runtime.dev may exist but must be boolean only
    expect(typeof entry.snapshot.runtime.dev).toBe("boolean");

    // no __DEV__ / raw env leakage
    expect(entry.snapshot.__DEV__).toBeUndefined();
    expect(entry.snapshot.import).toBeUndefined();
  });

  it("ERROR store contains DATA ONLY (no functions / refs)", () => {
    captureError(new Error("PROD_ERR"), "SRC");

    const entry = window.__APP_ERRORS__[0];

    function deepCheck(obj) {
      for (const v of Object.values(obj)) {
        expect(typeof v).not.toBe("function");
        if (v && typeof v === "object") deepCheck(v);
      }
    }

    deepCheck(entry);
  });
});
