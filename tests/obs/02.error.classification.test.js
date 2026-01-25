// // import { beforeEach, describe, it, expect } from "vitest";
// // import { captureError } from "../../src/obs/errorSink";

// // describe("VI.1 — Error classification", () => {
// //   beforeEach(() => {
// //     window.__APP_ERRORS__ = []; // 🔒 RESET STATE
// //   });
// //   it("Error has level field", () => {
// //     captureError(new Error("boom"), "TEST", "fatal");

// //     const err = window.__APP_ERRORS__[0];
// //     expect(err.level).toBe("fatal");
// //   });

// //   it("Default error level is recoverable", () => {
// //     captureError(new Error("minor"), "TEST");

// //     const err = window.__APP_ERRORS__[0];
// //     expect(err.level).toBe("recoverable");
// //   });
// // });

// // ======================================
// import { describe, it, expect, beforeEach } from "vitest";
// import { captureError } from "../../src/obs/errorSink";

// describe("VI.1 — Error classification", () => {
//   beforeEach(() => {
//     window.__APP_ERRORS__ = [];
//   });

//   it("Error instance → fatal", () => {
//     captureError(new Error("boom"), "TEST");

//     const err = window.__APP_ERRORS__[0];
//     expect(err.level).toBe("fatal");
//   });

//   it("Non-Error value → recoverable", () => {
//     captureError("something wrong", "TEST");

//     const err = window.__APP_ERRORS__[0];
//     expect(err.level).toBe("recoverable");
//   });
// });

// =============================================
import { describe, it, expect, beforeEach } from "vitest";
import "../../src/obs/errorSink";

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
