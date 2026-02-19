// // src/domains/order/index.js
// import { createInitialOrderState } from "./order.state";
// import { orderIntent } from "./order.intent";
// import { orderRule } from "./order.rule";

// const orderDomain = {
//   name: "order",

//   state: createInitialOrderState(),

//   intent: orderIntent,
//   rule: orderRule,

//   // optional – có thì chạy
//   init() {
//     // stress test: domain được mount mà không cần core đổi
//   },
// };

// export default orderDomain;

// ================================
import { createInitialOrderState } from "./order.state";
import * as orderIntent from "./order.intent";
import * as orderRule from "./order.rule";

const orderDomain = {
  name: "order",

  // 🔒 state là factory, không phải instance
  state: createInitialOrderState,

  // 🔒 intent & rule là namespace
  intent: orderIntent,
  rule: orderRule,

  // optional – có thì chạy
  init() {
    // stress test: domain mount không cần core đổi
  },
};

export default orderDomain;
