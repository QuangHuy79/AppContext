import { describe, it, expect, vi, beforeEach } from "vitest";

// mock side-effect dependency
vi.mock("../../../src/core/obs/errorSink", () => ({
  emitError: vi.fn(),
}));

import { guardDevice } from "../../../src/core/runtime/guards/device.guard";
import { emitError } from "../../../src/core/obs/errorSink";

describe("guardDevice", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("RETURN false + emitError if snapshot.device is missing", () => {
    const result = guardDevice({});

    expect(result).toBe(false);
    expect(emitError).toHaveBeenCalledOnce();
  });

  it("RETURN false if userAgent is invalid", () => {
    const result = guardDevice({
      device: {
        userAgent: 123,
        platform: "web",
        memory: null,
        width: 800,
        height: 600,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
      },
    });

    expect(result).toBe(false);
    expect(emitError).toHaveBeenCalledOnce();
  });

  it("RETURN false if memory is invalid", () => {
    const result = guardDevice({
      device: {
        userAgent: "UA",
        platform: "web",
        memory: "8gb",
        width: 800,
        height: 600,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
      },
    });

    expect(result).toBe(false);
    expect(emitError).toHaveBeenCalledOnce();
  });

  it("RETURN true and NOT emitError on valid device snapshot", () => {
    const result = guardDevice({
      device: {
        userAgent: "UA",
        platform: "web",
        memory: 8,
        width: 800,
        height: 600,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
      },
    });

    expect(result).toBe(true);
    expect(emitError).not.toHaveBeenCalled();
  });
});
