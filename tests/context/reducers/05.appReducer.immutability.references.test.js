// tests/context/reducers/05.appReducer.immutability.references.test.js
import { describe, it, expect } from "vitest";
import { appReducer } from "../../../src/core/context/reducers/appReducer";
import { initialAppState } from "../../../src/core/context/initialState";

describe("appReducer — IMMUTABILITY (REFERENCE SAFETY)", () => {
  it("RETURN same state reference for unknown action", () => {
    const prev = initialAppState;
    const next = appReducer(prev, { type: "UNKNOWN_ACTION" });

    expect(next).toBe(prev);
  });

  it("RETURN same state reference when action is denied (AUTH)", () => {
    const prev = initialAppState;
    const next = appReducer(prev, {
      type: "AUTH/SET_USER",
      payload: { id: 1 },
    });

    expect(next).toBe(prev);
  });

  it("CREATE new root state object for valid UI mutation", () => {
    const prev = initialAppState;
    const next = appReducer(prev, {
      type: "UI/SET_LOADING",
      payload: true,
    });

    expect(next).not.toBe(prev);
    expect(next.ui).not.toBe(prev.ui);
  });

  it("PRESERVE reference for untouched domains", () => {
    const prev = initialAppState;
    const next = appReducer(prev, {
      type: "UI/SET_LOADING",
      payload: true,
    });

    expect(next.settings).toBe(prev.settings);
  });
});
