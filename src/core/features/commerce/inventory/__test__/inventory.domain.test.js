// src/domains/inventory/__test__/inventory.domain.test.js

import inventory from "../index";
import { test, expect } from "vitest";
test("inventory reserve reduces stock", () => {
  let state = {
    stockByProductId: { p1: 10 },
  };

  state = inventory.rules(
    state,
    inventory.intents.reserve({ productId: "p1", quantity: 3 }),
  );

  expect(state.stockByProductId.p1).toBe(7);
});
