// domains/__test__/order.intent.test.js
import { describe, test, expect } from "vitest";
import { createOrder } from "../../features/commerce/order/order.intent";

describe("order intent – createOrder", () => {
  test("create order without side-effect", () => {
    const state = {};
    const command = { orderId: "ORD_1" };

    const result = createOrder(state, command);

    expect(result.nextState).toEqual({
      id: "ORD_1",
      status: "CREATED",
    });

    // đảm bảo không mutate
    expect(state).toEqual({});
  });
});
