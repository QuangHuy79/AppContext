// tests/context/reducers/02.appReducer.hydrate.test.js
import { describe, it, expect } from "vitest";
import { appReducer } from "../../../src/core/context/reducers/appReducer";
import { initialAppState } from "../../../src/core/context/initialState";

describe("appReducer — HYDRATE_APP_STATE hardening", () => {
  it("RETURN same state if payload is null / undefined", () => {
    const state = { ...initialAppState };

    expect(
      appReducer(state, { type: "HYDRATE_APP_STATE", payload: null }),
    ).toBe(state);

    expect(appReducer(state, { type: "HYDRATE_APP_STATE" })).toBe(state);
  });

  it("RETURN same state if payload is not an object", () => {
    const state = { ...initialAppState };

    expect(appReducer(state, { type: "HYDRATE_APP_STATE", payload: 123 })).toBe(
      state,
    );

    expect(
      appReducer(state, { type: "HYDRATE_APP_STATE", payload: "bad" }),
    ).toBe(state);
  });

  it("IGNORE payload fields outside whitelist (settings only)", () => {
    const state = { ...initialAppState };

    const next = appReducer(state, {
      type: "HYDRATE_APP_STATE",
      payload: {
        settings: { theme: "dark" },
        ui: { loading: true },
        auth: { user: { id: 1 } },
      },
    });

    expect(next.settings.theme).toBe("dark");

    // ❌ must NOT hydrate
    expect(next.ui).toBe(state.ui);
    expect(next.auth).toBe(state.auth);
  });

  it("IGNORE settings if settings is not an object", () => {
    const state = { ...initialAppState };

    const next = appReducer(state, {
      type: "HYDRATE_APP_STATE",
      payload: {
        settings: "dark",
      },
    });

    expect(next).toBe(state);
  });

  it("MERGE settings shallowly and preserve other state domains", () => {
    const state = {
      ...initialAppState,
      settings: {
        theme: "light",
        language: "en",
      },
    };

    const next = appReducer(state, {
      type: "HYDRATE_APP_STATE",
      payload: {
        settings: {
          theme: "dark",
        },
      },
    });

    expect(next.settings).toEqual({
      theme: "dark",
      language: "en",
    });

    // other domains untouched
    expect(next.ui).toBe(state.ui);
    expect(next.device).toBe(state.device);
  });
});
it("IGNORE extra domains in hydrate payload", () => {
  const state = {
    ...initialAppState,
    ui: { loading: false },
    settings: { theme: "light" },
  };

  const action = {
    type: "HYDRATE_APP_STATE",
    payload: {
      settings: { theme: "dark" },
      ui: { loading: true },
      auth: { user: "admin" },
    },
  };

  const next = appReducer(state, action);

  expect(next.settings.theme).toBe("dark");
  expect(next.ui).toBe(state.ui);
  expect(next.auth).toBeUndefined();
});

it("MERGE settings partially (non-destructive)", () => {
  const state = {
    ...initialAppState,
    settings: { theme: "light", lang: "vi" },
  };

  const action = {
    type: "HYDRATE_APP_STATE",
    payload: { settings: { theme: "dark" } },
  };

  const next = appReducer(state, action);

  expect(next.settings).toEqual({ theme: "dark", lang: "vi" });
});

it("REJECT malformed settings payload", () => {
  const state = { ...initialAppState };

  const action = {
    type: "HYDRATE_APP_STATE",
    payload: { settings: "dark" },
  };

  const next = appReducer(state, action);

  expect(next).toBe(state);
});

it("DO NOT create new domain during hydrate", () => {
  const state = { ...initialAppState };

  const action = {
    type: "HYDRATE_APP_STATE",
    payload: {
      settings: { theme: "dark" },
      unknown: { x: 1 },
    },
  };

  const next = appReducer(state, action);

  expect(next.unknown).toBeUndefined();
});

it("HYDRATE is idempotent", () => {
  const state = { ...initialAppState };

  const action = {
    type: "HYDRATE_APP_STATE",
    payload: { settings: { theme: "dark" } },
  };

  const first = appReducer(state, action);
  const second = appReducer(first, action);

  expect(second).toEqual(first);
});
