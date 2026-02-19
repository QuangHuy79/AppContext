// domains/order/order.intent.js
import { canCreateOrder } from "./order.rule";
export const ORDER_INTENT = {
  CREATE: "CREATE_ORDER",
  CONFIRM: "CONFIRM_ORDER",
  CANCEL: "CANCEL_ORDER",
  COMPLETE: "COMPLETE_ORDER",
};

// Shape mô tả (không xử lý)
export const createOrderIntent = (payload) => ({
  type: ORDER_INTENT.CREATE,
  payload,
});

export const confirmOrderIntent = (payload) => ({
  type: ORDER_INTENT.CONFIRM,
  payload,
});

export const cancelOrderIntent = (payload) => ({
  type: ORDER_INTENT.CANCEL,
  payload,
});

export const completeOrderIntent = (payload) => ({
  type: ORDER_INTENT.COMPLETE,
  payload,
});
export function createOrder(state, command) {
  canCreateOrder(state, command);
  // state: plain object
  // command: { orderId }

  const nextState = {
    ...state,
    id: command.orderId,
    status: "CREATED",
  };

  return { nextState };
}
