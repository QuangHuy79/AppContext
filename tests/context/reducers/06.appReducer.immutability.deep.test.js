import { describe, it, expect } from "vitest";
import { appReducer } from "../../../src/core/context/reducers/appReducer";
import { initialAppState } from "../../../src/core/context/initialState";

describe("appReducer — IMMUTABILITY (DEEP SAFETY)", () => {
  it("DOES NOT mutate previous nested state", () => {
    const prev = initialAppState;

    const next = appReducer(prev, {
      type: "SETTINGS/SET_THEME",
      payload: "dark",
    });

    expect(prev.settings.theme).toBe("light");
    expect(next.settings.theme).toBe("dark");
  });

  it("IGNORES object payload and DOES NOT reuse payload reference", () => {
    const prev = initialAppState;
    const evilPayload = { theme: "dark" };

    const next = appReducer(prev, {
      type: "SETTINGS/SET_THEME",
      payload: evilPayload,
    });

    // strict payload → ignore
    expect(next.settings.theme).toBe("light");

    // reference safety
    expect(next.settings).not.toBe(evilPayload);
  });

  it("IGNORES mutation attempt via shared object reference", () => {
    const prev = initialAppState;
    const shared = { theme: "dark" };

    const next = appReducer(prev, {
      type: "SETTINGS/SET_THEME",
      payload: shared,
    });

    shared.theme = "system";

    expect(next.settings.theme).toBe("light");
  });
});
