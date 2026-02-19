// tests/context/persistence/01.schemaDrift.test.js
import { describe, it, expect } from "vitest";
import { appReducer } from "../../../src/core/context/reducers/appReducer";
import { initialAppState } from "../../../src/core/context/initialState";

describe("PERSISTENCE — SCHEMA DRIFT PROTECTION", () => {
  it("REJECT hydrate when settings schema has unexpected extra keys", () => {
    const driftedState = {
      settings: {
        theme: "dark",
        evil: "💀",
      },
    };

    const next = appReducer(initialAppState, {
      type: "HYDRATE_APP_STATE",
      payload: driftedState,
    });

    // FAIL CLOSED → ignore hydrate
    expect(next).toBe(initialAppState);
  });

  it("REJECT hydrate when settings.theme has invalid type", () => {
    const driftedState = {
      settings: {
        theme: 123,
      },
    };

    const next = appReducer(initialAppState, {
      type: "HYDRATE_APP_STATE",
      payload: driftedState,
    });

    expect(next).toBe(initialAppState);
  });

  it("REJECT hydrate when persisted payload injects foreign domain", () => {
    const driftedState = {
      settings: {
        theme: "dark",
      },
      auth: {
        user: "evil",
      },
    };

    const next = appReducer(initialAppState, {
      type: "HYDRATE_APP_STATE",
      payload: driftedState,
    });

    expect(next).toBe(initialAppState);
    expect(next.auth).toBeUndefined();
  });

  it("ACCEPT hydrate only when schema matches exactly", () => {
    const validState = {
      settings: {
        theme: "dark",
      },
    };

    const next = appReducer(initialAppState, {
      type: "HYDRATE_APP_STATE",
      payload: validState,
    });

    expect(next).not.toBe(initialAppState);
    expect(next.settings.theme).toBe("dark");
  });
});
