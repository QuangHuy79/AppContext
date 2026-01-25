// tests/context/reducers/04.appReducer.domainIsolation.actions.test.js

import { describe, it, expect } from "vitest";
import { appReducer } from "../../../src/context/reducers/appReducer";
import { initialAppState } from "../../../src/context/initialState";

describe("appReducer — DOMAIN ISOLATION (ACTIONS)", () => {
  it("IGNORE action attempting to mutate ui via unknown type", () => {
    const prev = structuredClone(initialAppState);

    const next = appReducer(prev, {
      type: "UI/SET_THEME", // invalid cross-domain
      payload: "dark",
    });

    expect(next).toEqual(prev);
  });

  it("IGNORE action with payload injecting foreign domain", () => {
    const prev = structuredClone(initialAppState);

    const next = appReducer(prev, {
      type: "SETTINGS/SET_THEME",
      payload: {
        theme: "dark",
        auth: { user: "evil" },
      },
    });

    // reducer only reads payload as primitive / expected value
    expect(next.settings.theme).toBe("light"); // payload malformed → fallback
    expect(next.auth).toBeUndefined();
  });

  it("DENY AUTH/SET_USER explicitly", () => {
    const prev = structuredClone(initialAppState);

    const next = appReducer(prev, {
      type: "AUTH/SET_USER",
      payload: { id: 1 },
    });

    expect(next).toEqual(prev);
    expect(next.auth).toBeUndefined();
  });

  it("DENY AUTH/CLEAR explicitly", () => {
    const prev = structuredClone(initialAppState);

    const next = appReducer(prev, {
      type: "AUTH/CLEAR",
    });

    expect(next).toEqual(prev);
    expect(next.auth).toBeUndefined();
  });

  it("UNKNOWN action with domain-shaped payload does not mutate state", () => {
    const prev = structuredClone(initialAppState);

    const next = appReducer(prev, {
      type: "UNKNOWN_ACTION",
      payload: {
        settings: { theme: "dark" },
        ui: { loading: true },
      },
    });

    expect(next).toEqual(prev);
  });
});
