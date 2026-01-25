// tests/context/reducers/03.appReducer.domainIsolation.hydrate.test.js

import { describe, it, expect } from "vitest";
import { appReducer } from "../../../src/context/reducers/appReducer";
import { initialAppState } from "../../../src/context/initialState";

describe("appReducer — DOMAIN ISOLATION (HYDRATE)", () => {
  it("HYDRATE: ignores ui domain in payload", () => {
    const prev = structuredClone(initialAppState);

    const next = appReducer(prev, {
      type: "HYDRATE_APP_STATE",
      payload: {
        ui: { loading: true },
      },
    });

    expect(next.ui).toEqual(prev.ui);
  });

  it("HYDRATE: ignores auth domain in payload", () => {
    const prev = structuredClone(initialAppState);

    const next = appReducer(prev, {
      type: "HYDRATE_APP_STATE",
      payload: {
        auth: { user: { id: 1 } },
      },
    });

    expect(next.auth).toBeUndefined();
    expect(next).toEqual(prev);
  });

  it("HYDRATE: merges settings but ignores other domains", () => {
    const prev = structuredClone(initialAppState);

    const next = appReducer(prev, {
      type: "HYDRATE_APP_STATE",
      payload: {
        settings: { theme: "dark" },
        ui: { loading: true },
        auth: { user: "evil" },
      },
    });

    expect(next.settings.theme).toBe("dark");
    expect(next.ui).toEqual(prev.ui);
    expect(next.auth).toBeUndefined();
  });

  it("HYDRATE: ignores unknown / injected domains", () => {
    const prev = structuredClone(initialAppState);

    const next = appReducer(prev, {
      type: "HYDRATE_APP_STATE",
      payload: {
        settings: { theme: "dark" },
        evil: { inject: true },
        __proto__: { polluted: true },
      },
    });

    expect(next.settings.theme).toBe("dark");
    expect(next.evil).toBeUndefined();
    expect({}.polluted).toBeUndefined();
  });

  it("HYDRATE: cannot overwrite existing ui via payload", () => {
    const prev = structuredClone(initialAppState);
    prev.ui.loading = false;

    const next = appReducer(prev, {
      type: "HYDRATE_APP_STATE",
      payload: {
        ui: { loading: true },
      },
    });

    expect(next.ui.loading).toBe(false);
  });
});
