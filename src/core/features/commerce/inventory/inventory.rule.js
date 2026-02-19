// src/domains/inventory/inventory.rule.js
// Rule chỉ xử lý nghiệp vụ nội bộ
export function inventoryRules(state, event) {
  switch (event.type) {
    case "INVENTORY/RESERVE": {
      const { productId, quantity } = event.payload;
      const current = state.stockByProductId[productId] ?? 0;

      if (current < quantity) {
        throw new Error("INVENTORY_OUT_OF_STOCK");
      }

      return {
        ...state,
        stockByProductId: {
          ...state.stockByProductId,
          [productId]: current - quantity,
        },
      };
    }

    case "INVENTORY/RELEASE": {
      const { productId, quantity } = event.payload;
      const current = state.stockByProductId[productId] ?? 0;

      return {
        ...state,
        stockByProductId: {
          ...state.stockByProductId,
          [productId]: current + quantity,
        },
      };
    }

    default:
      return state;
  }
}
