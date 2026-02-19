// tests/runtime/guards/03.settings.guard.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";

// 🔒 MOCK errorSink — CHỈ mock captureError
vi.mock("../../../src/core/obs/errorSink", () => ({
  captureError: vi.fn(),
}));

import { captureError } from "../../../src/core/obs/errorSink";
import { guardSettings } from "../../../src/core/runtime/guards/settings.guard";

describe("guardSettings", () => {
  beforeEach(() => {
    captureError.mockClear();
  });

  it("RETURN false + captureError if snapshot.settings is missing", () => {
    const snapshot = {};

    const result = guardSettings(snapshot);

    expect(result).toBe(false);
    expect(captureError).toHaveBeenCalledOnce();
    expect(captureError).toHaveBeenCalledWith(expect.any(Error), "RG-SET-00");
  });

  it("RETURN false + captureError if settings.theme is invalid", () => {
    const snapshot = {
      settings: {
        theme: "blue", // ❌ invalid
      },
    };

    const result = guardSettings(snapshot);

    expect(result).toBe(false);
    expect(captureError).toHaveBeenCalledOnce();
    expect(captureError).toHaveBeenCalledWith(expect.any(Error), "RG-SET-01");
  });

  it("RETURN true and NOT captureError if settings.theme is valid (light)", () => {
    const snapshot = {
      settings: {
        theme: "light",
      },
    };

    const result = guardSettings(snapshot);

    expect(result).toBe(true);
    expect(captureError).not.toHaveBeenCalled();
  });

  it("RETURN true and NOT captureError if settings.theme is valid (dark/system)", () => {
    const snapshotDark = {
      settings: { theme: "dark" },
    };

    const snapshotSystem = {
      settings: { theme: "system" },
    };

    expect(guardSettings(snapshotDark)).toBe(true);
    expect(guardSettings(snapshotSystem)).toBe(true);
    expect(captureError).not.toHaveBeenCalled();
  });
});
