// src/domains/inventory/index.js
// GẮN DOMAIN VÀO DOMAIN HOST
// ĐIỂM QUAN TRỌNG NHẤT CỦA BƯỚC 8
import { inventoryInitialState } from "./inventory.state";
import { inventoryRules } from "./inventory.rule";
import { InventoryIntent } from "./inventory.intent";

export default {
  name: "inventory",

  initialState: inventoryInitialState,

  rules: inventoryRules,

  intents: InventoryIntent,
};
