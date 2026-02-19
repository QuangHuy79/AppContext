// tests/context/reducers/01.appReducer.default.test.js
import { describe, it, expect } from "vitest";
import { appReducer } from "../../../src/core/context/reducers/appReducer";
import { initialAppState } from "../../../src/core/context/initialState";

describe("appReducer — DEFAULT & UNKNOWN ACTION", () => {
  it("RETURN same state for unknown action type", () => {
    const prevState = initialAppState;

    const nextState = appReducer(prevState, {
      type: "UNKNOWN/ACTION",
      payload: { any: "thing" },
    });

    expect(nextState).toBe(prevState); // 🔒 reference invariant
  });

  it("RETURN same state when action has no type", () => {
    const prevState = initialAppState;

    const nextState = appReducer(prevState, {
      payload: { foo: "bar" },
    });

    expect(nextState).toBe(prevState);
  });

  it("RETURN same state when action is malformed", () => {
    const prevState = initialAppState;

    const nextState = appReducer(prevState, null);

    expect(nextState).toBe(prevState);
  });
});
