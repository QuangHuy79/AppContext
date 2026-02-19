// src/domains/inventory/inventory.intent.js
// Intent là điểm duy nhất Core gọi vào
export const InventoryIntent = {
  reserve({ productId, quantity }) {
    return {
      type: "INVENTORY/RESERVE",
      payload: { productId, quantity },
    };
  },

  release({ productId, quantity }) {
    return {
      type: "INVENTORY/RELEASE",
      payload: { productId, quantity },
    };
  },
};
