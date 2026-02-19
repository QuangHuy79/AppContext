// src/domains/cart/cart.rule.js

export function assertValidQuantity(quantity) {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error("[CART_RULE] Invalid quantity");
  }
}

export function assertItemConsistency(item) {
  if (!item || typeof item.id !== "string") {
    throw new Error("[CART_RULE] Invalid cart item");
  }
}
