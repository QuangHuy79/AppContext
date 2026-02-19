// domains/__test__/order.rule.test.js
import { describe, test, expect } from "vitest";
import { createOrder } from "../../features/commerce/order/order.intent";

describe("order rule – canCreateOrder", () => {
  test("throw error when orderId missing", () => {
    const state = {};
    const command = {};

    expect(() => {
      createOrder(state, command);
    }).toThrow("ORDER_ID_REQUIRED");
  });
});
