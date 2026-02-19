// src/domains/product/product.rule.js

export function canAddProductToCart({ product }) {
  if (!product) {
    return {
      ok: false,
      reason: "PRODUCT_NOT_FOUND",
    };
  }

  if (product.isActive !== true) {
    return {
      ok: false,
      reason: "PRODUCT_INACTIVE",
    };
  }

  if (typeof product.price !== "number" || product.price <= 0) {
    return {
      ok: false,
      reason: "PRODUCT_INVALID_PRICE",
    };
  }

  return {
    ok: true,
  };
}
