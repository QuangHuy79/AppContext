// src/domains/__test__/order.domain.test.js
import { describe, test, expect } from "vitest";
// import { createOrder } from "../order/order.intent";
import { createOrder } from "../../features/commerce/order/order.intent";

describe("order domain – independent execution", () => {
  test("create order passes rule and returns nextState", () => {
    const state = {};
    const command = { orderId: "ORD_100" };

    const { nextState } = createOrder(state, command);

    expect(nextState).toEqual({
      id: "ORD_100",
      status: "CREATED",
    });

    // đảm bảo state gốc không bị mutate
    expect(state).toEqual({});
  });

  test("rule violation stops domain execution", () => {
    const state = {};
    const command = {}; // thiếu orderId

    expect(() => createOrder(state, command)).toThrow("ORDER_ID_REQUIRED");
  });
});
