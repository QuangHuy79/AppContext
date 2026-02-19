import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildSnapshot } from "../../src/core/obs/buildSnapshot";

describe("PHASE 6.3 — SNAPSHOT CONTRACT", () => {
  beforeEach(() => {
    // deterministic time
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01T00:00:00Z"));

    // mock browser env
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

  it("SNAPSHOT always contains core domains", () => {
    const snap = buildSnapshot();

    expect(snap).toHaveProperty("network");
    expect(snap).toHaveProperty("device");
    expect(snap).toHaveProperty("runtime");
    expect(snap).toHaveProperty("timestamp");
  });

  it("SNAPSHOT does not contain foreign / injected domains", () => {
    const snap = buildSnapshot();

    expect(snap.auth).toBeUndefined();
    expect(snap.settings).toBeUndefined();
    expect(snap.ui).toBeUndefined();
  });

  it("SNAPSHOT network contract is stable", () => {
    const snap = buildSnapshot();

    expect(snap.network).toEqual({
      online: true,
      effectiveType: "4g",
    });
  });

  it("SNAPSHOT device contract is stable", () => {
    const snap = buildSnapshot();

    expect(snap.device).toMatchObject({
      userAgent: "test-agent",
      platform: "test-platform",
      memory: 8,
      width: 1200,
      height: 800,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
    });
  });

  it("SNAPSHOT runtime contract is stable", () => {
    const snap = buildSnapshot();

    expect(snap.runtime).toHaveProperty("env");
    expect(snap.runtime).toHaveProperty("dev");
  });

  it("SNAPSHOT timestamp is deterministic under fake timers", () => {
    const snap = buildSnapshot();

    expect(snap.timestamp).toBe(new Date("2024-01-01T00:00:00Z").getTime());
  });

  it("DEV mode snapshot is immutable (frozen)", () => {
    if (import.meta.env.DEV) {
      const snap = buildSnapshot();

      expect(Object.isFrozen(snap)).toBe(true);
      expect(Object.isFrozen(snap.network)).toBe(true);
      expect(Object.isFrozen(snap.device)).toBe(true);
      expect(Object.isFrozen(snap.runtime)).toBe(true);
    }
  });
});
