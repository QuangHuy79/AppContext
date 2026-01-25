// import { describe, it, expect, vi, beforeEach } from "vitest";
// import { guardNetwork } from "../../../src/runtime/guards/network.guard";
// import * as errorSink from "../../../src/obs/errorSink";

// describe("guardNetwork", () => {
//   beforeEach(() => {
//     vi.spyOn(errorSink, "emitError").mockImplementation(() => {});
//   });

//   it("RETURN false + emitError if snapshot.network is missing", () => {
//     const result = guardNetwork({});

//     expect(result).toBe(false);
//     expect(errorSink.emitError).toHaveBeenCalledOnce();
//   });

//   it("RETURN false + emitError if network.online is not boolean", () => {
//     const snapshot = {
//       network: { online: "yes" },
//     };

//     const result = guardNetwork(snapshot);

//     expect(result).toBe(false);
//     expect(errorSink.emitError).toHaveBeenCalledOnce();
//   });

//   it("RETURN false + emitError if effectiveType is invalid", () => {
//     const snapshot = {
//       network: { online: true, effectiveType: 4 },
//     };

//     const result = guardNetwork(snapshot);

//     expect(result).toBe(false);
//     expect(errorSink.emitError).toHaveBeenCalledOnce();
//   });

//   it("RETURN true and NOT emitError on valid network snapshot", () => {
//     const snapshot = {
//       network: { online: true, effectiveType: "4g" },
//     };

//     const result = guardNetwork(snapshot);

//     expect(result).toBe(true);
//     expect(errorSink.emitError).not.toHaveBeenCalled();
//   });
// });

// =====================================
import { describe, it, expect, vi, beforeEach } from "vitest";
// MOCK TRƯỚC KHI IMPORT GUARD
vi.mock("../../../src/obs/errorSink", () => ({
  emitError: vi.fn(),
}));

import { guardNetwork } from "../../../src/runtime/guards/network.guard";
import { emitError } from "../../../src/obs/errorSink";

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
