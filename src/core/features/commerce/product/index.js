// // src/domains/product/index.js
// import { PRODUCT_INTENTS } from "./product.intent";
// import { canAddProductToCart } from "./product.rule";

// export const productDomain = {
//   id: "product",
//   name: "Product",
//   version: "0.1.0",

//   // ⚠️ chỉ string, đúng DomainRegistryContract
//   capabilities: [PRODUCT_INTENTS.ADD_TO_CART_REQUESTED],

//   // ⛔ không nằm trong contract, nhưng domainHost runtime sẽ dùng
//   intents: PRODUCT_INTENTS,
//   rules: {
//     canAddProductToCart,
//   },
// };

// ====================
// src/domains/product/index.js
const productDomain = {
  id: "product",
  name: "Product",
  version: "0.0.0",
  capabilities: [],
};

export default productDomain;
