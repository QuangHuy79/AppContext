// tests/obs/02.errorSink.awareness.test.js
import { describe, it, expect, beforeEach, vi } from "vitest";
import { captureError } from "../../src/obs/errorSink";

describe("PHASE 8.1 — ERROR AWARENESS", () => {
  beforeEach(() => {
    // reset global error store
    delete window.__APP_ERRORS__;

    // deterministic time
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01T00:00:00Z"));

    // minimal browser env for snapshot
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

  it("CORE records error into central error store", () => {
    const err = new Error("TEST ERROR");
    captureError(err, "TEST-SOURCE");

    expect(window.__APP_ERRORS__).toBeDefined();
    expect(Array.isArray(window.__APP_ERRORS__)).toBe(true);
    expect(window.__APP_ERRORS__.length).toBe(1);
  });

  it("ERROR entry contains normalized error + snapshot", () => {
    const err = new Error("TEST ERROR");
    captureError(err, "TEST-SOURCE");

    const entry = window.__APP_ERRORS__[0];

    expect(entry).toHaveProperty("source", "TEST-SOURCE");
    expect(entry).toHaveProperty("message", "TEST ERROR");
    expect(entry).toHaveProperty("time");
    expect(entry).toHaveProperty("snapshot");
  });

  it("ERROR snapshot follows snapshot contract (core domains only)", () => {
    const err = new Error("TEST ERROR");
    captureError(err, "TEST-SOURCE");

    const { snapshot } = window.__APP_ERRORS__[0];

    expect(snapshot).toHaveProperty("network");
    expect(snapshot).toHaveProperty("device");
    expect(snapshot).toHaveProperty("runtime");
    expect(snapshot).toHaveProperty("timestamp");

    // forbidden domains
    expect(snapshot.auth).toBeUndefined();
    expect(snapshot.ui).toBeUndefined();
    expect(snapshot.settings).toBeUndefined();
  });
});
