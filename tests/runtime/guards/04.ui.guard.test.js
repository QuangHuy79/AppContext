// tests/runtime/guards/04.ui.guard.test.js
import { describe, it, expect, vi, beforeEach } from "vitest";

// 🔒 MOCK errorSink — chỉ captureError
vi.mock("../../../src/obs/errorSink", () => ({
  captureError: vi.fn(),
}));

import { captureError } from "../../../src/obs/errorSink";
import { guardUI } from "../../../src/runtime/guards/ui.guard";

describe("guardUI", () => {
  beforeEach(() => {
    captureError.mockClear();
  });

  it("RETURN false + captureError if snapshot.ui is missing", () => {
    const snapshot = {};

    const result = guardUI(snapshot);

    expect(result).toBe(false);
    expect(captureError).toHaveBeenCalledOnce();
    expect(captureError).toHaveBeenCalledWith(expect.any(Error), "RG-UI-01");
  });

  it("RETURN false + captureError if ui.ready is not boolean", () => {
    const snapshot = {
      ui: {
        ready: "yes", // ❌ invalid
      },
    };

    const result = guardUI(snapshot);

    expect(result).toBe(false);
    expect(captureError).toHaveBeenCalledOnce();
    expect(captureError).toHaveBeenCalledWith(expect.any(Error), "RG-UI-02");
  });

  it("RETURN true and NOT captureError if ui.ready is boolean true", () => {
    const snapshot = {
      ui: {
        ready: true,
      },
    };

    const result = guardUI(snapshot);

    expect(result).toBe(true);
    expect(captureError).not.toHaveBeenCalled();
  });

  it("RETURN true and NOT captureError if ui.ready is boolean false", () => {
    const snapshot = {
      ui: {
        ready: false,
      },
    };

    const result = guardUI(snapshot);

    expect(result).toBe(true);
    expect(captureError).not.toHaveBeenCalled();
  });
});
