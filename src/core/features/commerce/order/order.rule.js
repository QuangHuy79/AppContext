// src/domain/order/order.rule.js
export function assertValidOrder(state) {
  if (!state.id) {
    throw new Error("Order must have id");
  }

  if (!Array.isArray(state.items) || state.items.length === 0) {
    throw new Error("Order must have at least one item");
  }
}
export function canCreateOrder(state, command) {
  if (!command || !command.orderId) {
    throw new Error("ORDER_ID_REQUIRED");
  }
  return true;
}
