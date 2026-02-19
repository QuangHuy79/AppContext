// src/domains/cart/index.js
import { cartInitialState } from "./cart.state";
import { CartIntents } from "./cart.intent";

const cartDomain = {
  id: "cart",
  name: "Shopping Cart",
  version: "0.1.0",
  capabilities: ["cart.state", "cart.intent.add", "cart.intent.rollback"],

  // khai báo, KHÔNG dùng trực tiếp
  state: cartInitialState,
  intents: CartIntents,
};

export default cartDomain;
