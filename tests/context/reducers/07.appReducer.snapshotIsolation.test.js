import { describe, it, expect, vi } from "vitest";
import { appReducer } from "../../../src/core/context/reducers/appReducer";
import { initialAppState } from "../../../src/core/context/initialState";

/**
 * PHASE 6.4 — SNAPSHOT ISOLATION (CORRECT INVARIANT)
 *
 * Snapshot là OBSERVATION
 * Reducer state KHÔNG được:
 *  - bị override bởi snapshot
 *  - bị inject field từ snapshot
 */

// Snapshot bị hack nặng
vi.mock("../../../src/obs/buildSnapshot", () => ({
  buildSnapshot: () => ({
    network: { online: "EVIL" },
    device: null,
    runtime: { hacked: true },
    timestamp: "💀",
    injected: "SHOULD_NOT_EXIST",
  }),
}));

describe("PHASE 6.4 — SNAPSHOT ISOLATION", () => {
  it("HYDRATE_APP_STATE ignores snapshot completely", () => {
    const persistedState = {
      settings: { theme: "dark" },
    };

    const nextState = appReducer(initialAppState, {
      type: "HYDRATE_APP_STATE",
      payload: persistedState,
    });

    // 1️⃣ hydrate hoạt động bình thường
    expect(nextState.settings.theme).toBe("dark");

    // 2️⃣ snapshot KHÔNG inject field lạ
    expect(nextState.injected).toBeUndefined();
    expect(nextState.timestamp).toBeUndefined();

    // 3️⃣ snapshot KHÔNG override domain hợp pháp
    // network tồn tại → OK
    // nhưng KHÔNG lấy giá trị từ snapshot mock
    expect(nextState.network).toEqual(initialAppState.network);

    // 4️⃣ device / runtime không bị snapshot ép vào state
    expect(nextState.device).toBeUndefined();
    expect(nextState.runtime).toBeUndefined();
  });
});
