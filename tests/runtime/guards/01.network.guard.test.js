import { describe, it, expect, vi, beforeEach } from "vitest";
// MOCK TRƯỚC KHI IMPORT GUARD
vi.mock("../../../src/core/obs/errorSink", () => ({
  emitError: vi.fn(),
}));

import { guardNetwork } from "../../../src/core/runtime/guards/network.guard";
import { emitError } from "../../../src/core/obs/errorSink";

describe("guardNetwork", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // 🔑 RESET CALL COUNT
  });
  it("RETURN false + emitError if snapshot.network is missing", () => {
    const result = guardNetwork({});

    expect(result).toBe(false);
    expect(emitError).toHaveBeenCalledOnce();
  });

  it("RETURN false + emitError if network.online is not boolean", () => {
    const snapshot = {
      network: { online: "yes" },
    };

    const result = guardNetwork(snapshot);

    expect(result).toBe(false);
    expect(emitError).toHaveBeenCalledOnce();
  });

  it("RETURN false + emitError if effectiveType is invalid", () => {
    const snapshot = {
      network: { online: true, effectiveType: 4 },
    };

    const result = guardNetwork(snapshot);

    expect(result).toBe(false);
    expect(emitError).toHaveBeenCalledOnce();
  });

  it("RETURN true and NOT emitError on valid network snapshot", () => {
    const snapshot = {
      network: { online: true, effectiveType: "4g" },
    };

    const result = guardNetwork(snapshot);

    expect(result).toBe(true);
    expect(emitError).not.toHaveBeenCalled();
  });
});
