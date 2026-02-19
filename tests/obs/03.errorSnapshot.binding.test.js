// tests/obs/03.errorSnapshot.binding.test.js
import { describe, it, expect, beforeEach, vi } from "vitest";
import { captureError } from "../../src/core/obs/errorSink";

describe("PHASE 8.2 — SNAPSHOT ↔ ERROR BINDING", () => {
  beforeEach(() => {
    delete window.__APP_ERRORS__;

    // deterministic time
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01T00:00:00Z"));

    global.navigator = {
      onLine: true,
      userAgent: "test-agent",
      platform: "test-platform",
      deviceMemory: 8,
      connection: { effectiveType: "4g" },
    };

    global.window = {
      innerWidth: 1200,
      innerHeight: 800,
    };
  });

  it("ERROR snapshot is captured at error time (not lazy)", () => {
    captureError(new Error("E1"), "SRC-1");

    // mutate environment AFTER error
    global.navigator.onLine = false;
    global.window.innerWidth = 500;

    const snap = window.__APP_ERRORS__[0].snapshot;

    // snapshot must keep ORIGINAL values
    expect(snap.network.online).toBe(true);
    expect(snap.device.width).toBe(1200);
  });

  it("EACH error owns its own snapshot instance", () => {
    captureError(new Error("E1"), "SRC-1");

    // change env
    global.window.innerWidth = 600;

    captureError(new Error("E2"), "SRC-2");

    const snap1 = window.__APP_ERRORS__[0].snapshot;
    const snap2 = window.__APP_ERRORS__[1].snapshot;

    expect(snap1).not.toBe(snap2);
    expect(snap1.device.width).toBe(1200);
    expect(snap2.device.width).toBe(600);
  });

  it("SNAPSHOT attached to error is immutable in DEV", () => {
    if (!import.meta.env.DEV) return;

    captureError(new Error("IMMUTABLE"), "SRC");

    const snap = window.__APP_ERRORS__[0].snapshot;

    expect(Object.isFrozen(snap)).toBe(true);
    expect(Object.isFrozen(snap.network)).toBe(true);
    expect(Object.isFrozen(snap.device)).toBe(true);

    // mutation attempt must fail silently or throw
    expect(() => {
      snap.network.online = false;
    }).toThrow();
  });
});
